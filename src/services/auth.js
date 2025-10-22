const USERS_KEY = 'fynvia_users_v1';
const CURRENT_USER_KEY = 'fynvia_current_user_v1';

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
  } catch {
    return null;
  }
}

export function setCurrentUser(user) {
  if (user) localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(CURRENT_USER_KEY);
}

export function signupUser({ name, email, password, role, aadhar = null, pan = null }) {
  const users = loadUsers();
  const exists = users.some(u => u.email.toLowerCase() === String(email).toLowerCase());
  if (exists) {
    const err = new Error('Email already registered');
    err.code = 'EMAIL_EXISTS';
    throw err;
  }
  const user = { id: crypto.randomUUID?.() || String(Date.now()), name, email, password, role, aadhar, pan };
  users.push(user);
  saveUsers(users);
  setCurrentUser({ id: user.id, name: user.name, email: user.email, role: user.role, aadhar: user.aadhar, pan: user.pan });
  return user;
}

export function updateUser(id, updates = {}) {
  const users = loadUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) throw new Error('User not found');
  users[idx] = { ...users[idx], ...updates };
  saveUsers(users);
  // If updating current user, reflect in CURRENT_USER_KEY
  const current = getCurrentUser();
  if (current && current.id === id) {
    setCurrentUser({ ...current, ...updates });
  }
  return users[idx];
}

const RESETS_KEY = 'fynvia_pw_resets_v1';

function loadResets() {
  try { return JSON.parse(localStorage.getItem(RESETS_KEY) || '{}'); } catch { return {}; }
}

function saveResets(obj) { localStorage.setItem(RESETS_KEY, JSON.stringify(obj)); }

export function requestReset(target) {
  // target can be email or mobile (we'll treat it as email in this simple app)
  const users = loadUsers();
  const user = users.find(u => u.email.toLowerCase() === String(target).toLowerCase());
  if (!user) {
    const err = new Error('No account found');
    err.code = 'NOT_FOUND';
    throw err;
  }
  const pin = String(Math.floor(100000 + Math.random() * 900000));
  const resets = loadResets();
  resets[user.email] = { pin, expires: Date.now() + 1000 * 60 * 10 }; // 10 minutes
  saveResets(resets);
  // In a real app we'd send via email or sms; here we return the pin so dev can view it
  return pin;
}

export function verifyReset(email, pin) {
  const resets = loadResets();
  const entry = resets[email];
  if (!entry) return false;
  if (Date.now() > entry.expires) { delete resets[email]; saveResets(resets); return false; }
  return String(entry.pin) === String(pin);
}

export function setPassword(email, newPassword) {
  const users = loadUsers();
  const idx = users.findIndex(u => u.email.toLowerCase() === String(email).toLowerCase());
  if (idx === -1) throw new Error('User not found');
  users[idx].password = newPassword;
  saveUsers(users);
  // clear reset
  const resets = loadResets();
  delete resets[users[idx].email];
  saveResets(resets);
  // if current user, update current user store
  const current = getCurrentUser();
  if (current && current.email.toLowerCase() === users[idx].email.toLowerCase()) {
    setCurrentUser({ ...current, password: newPassword });
  }
  return true;
}

export function loginUser({ email, password }) {
  const users = loadUsers();
  const user = users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
  if (!user || user.password !== password) {
    const err = new Error('Invalid credentials');
    err.code = 'INVALID_CREDENTIALS';
    throw err;
  }
  setCurrentUser({ id: user.id, name: user.name, email: user.email, role: user.role });
  return user;
}

export function logoutUser() {
  setCurrentUser(null);
}

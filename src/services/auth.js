const USERS_KEY = "fynvia_users_v1";
const CURRENT_USER_KEY = "fynvia_current_user_v1";
const RESETS_KEY = "fynvia_pw_resets_v1";
export const API_URL = "http://localhost:5000/api";

// ----------------- Helpers -----------------
async function hashString(value) {
  if (!value) return '';
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    // fallback simple hash (not cryptographically secure) if SubtleCrypto not available
    let h = 0;
    for (let i = 0; i < value.length; i++) h = (h << 5) - h + value.charCodeAt(i) | 0;
    return String(h >>> 0);
  }
  const enc = new TextEncoder();
  const data = await window.crypto.subtle.digest('SHA-256', enc.encode(value));
  return Array.from(new Uint8Array(data)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ---------------- Local helpers ----------------
function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
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

// ---------------- Backend-powered signup/login ----------------
export async function signupUser({ name, email, password, role, aadhar = null, pan = null }) {
  try {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role, aadhar, pan }),
    });

    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data.error || "Signup failed");
      if (res.status === 409) err.code = "EMAIL_EXISTS";
      throw err;
    }

    // backend returns { message, user }
    setCurrentUser(data.user);
    return data.user;
  } catch (err) {
    // fallback to local storage auth if backend unavailable
    const users = loadUsers();
    if (users.find((u) => u.email.toLowerCase() === String(email).toLowerCase())) {
      const e = new Error("Email already exists (local)");
      e.code = "EMAIL_EXISTS";
      throw e;
    }
    const id = `local_${Date.now()}_${Math.floor(Math.random() * 9000 + 1000)}`;
    // store hashed password for local fallback
    const hashed = await hashString(password);
    const user = { id, name, email, password: hashed, role, aadhar, pan, createdAt: Date.now() };
    users.push(user);
    saveUsers(users);
    setCurrentUser(user);
    return user;
  }
}

export async function loginUser({ email, password, role }) {
  try {
    const res = await fetch(`${API_URL}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data.error || "Invalid credentials");
      err.code = "INVALID_CREDENTIALS";
      throw err;
    }

    setCurrentUser(data.user);
    return data.user;
  } catch (err) {
    const users = loadUsers();
    const user = users.find((u) => {
      const sameEmail = u.email.toLowerCase() === String(email).toLowerCase();
      // If role is provided, require role match; otherwise match by email only
      const roleMatches = typeof role === 'undefined' || role === null ? true : u.role === role;
      return sameEmail && roleMatches;
    });
    if (!user) {
      const e = new Error("Invalid credentials (local)");
      e.code = "INVALID_CREDENTIALS";
      throw e;
    }
    // support both plain-text (older entries) and hashed passwords
    const hashedAttempt = await hashString(password);
    if (user.password !== password && user.password !== hashedAttempt) {
      const e = new Error("Invalid credentials (local)");
      e.code = "INVALID_CREDENTIALS";
      throw e;
    }
    setCurrentUser(user);
    return user;
  }
}

// ---------------- Rest (password reset, etc.) stay local ----------------
export function updateUser(id, updates = {}) {
  const users = loadUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error("User not found");
  users[idx] = { ...users[idx], ...updates };
  saveUsers(users);
  const current = getCurrentUser();
  if (current && current.id === id) {
    setCurrentUser({ ...current, ...updates });
  }
  return users[idx];
}

function loadResets() {
  try {
    return JSON.parse(localStorage.getItem(RESETS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveResets(obj) {
  localStorage.setItem(RESETS_KEY, JSON.stringify(obj));
}

export function requestReset(target) {
  const users = loadUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === String(target).toLowerCase()
  );
  if (!user) {
    const err = new Error("No account found");
    err.code = "NOT_FOUND";
    throw err;
  }
  const pin = String(Math.floor(100000 + Math.random() * 900000));
  const resets = loadResets();
  resets[user.email] = { pin, expires: Date.now() + 1000 * 60 * 10 };
  saveResets(resets);
  return pin;
}

export function verifyReset(email, pin) {
  const resets = loadResets();
  const entry = resets[email];
  if (!entry) return false;
  if (Date.now() > entry.expires) {
    delete resets[email];
    saveResets(resets);
    return false;
  }
  return String(entry.pin) === String(pin);
}

export function setPassword(email, newPassword) {
  const users = loadUsers();
  const idx = users.findIndex(
    (u) => u.email.toLowerCase() === String(email).toLowerCase()
  );
  if (idx === -1) throw new Error("User not found");
  users[idx].password = newPassword;
  saveUsers(users);
  const resets = loadResets();
  delete resets[users[idx].email];
  saveResets(resets);
  const current = getCurrentUser();
  if (
    current &&
    current.email.toLowerCase() === users[idx].email.toLowerCase()
  ) {
    setCurrentUser({ ...current, password: newPassword });
  }
  return true;
}

export function logoutUser() {
  setCurrentUser(null);
}

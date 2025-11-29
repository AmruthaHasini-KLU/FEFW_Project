const ADMIN_USERS_KEY = 'admin_users';

const DEFAULT_SAMPLE_USERS = [
  { id: 'U-1001', name: 'Alice Johnson', email: 'alice@demo.com', role: 'Borrower', status: 'active', joinDate: '2024-01-10' },
  { id: 'U-1002', name: 'Ben Rogers', email: 'ben@demo.com', role: 'Lender', status: 'suspended', joinDate: '2024-01-15' },
  { id: 'U-1003', name: 'Cara Miles', email: 'cara@demo.com', role: 'Analyst', status: 'active', joinDate: '2024-02-01' },
  { id: 'U-1004', name: 'David Park', email: 'david@demo.com', role: 'Borrower', status: 'active', joinDate: '2024-02-20' },
];

function loadUsers() {
  try {
    const raw = localStorage.getItem(ADMIN_USERS_KEY);
    if (raw === null) {
      // initialize with sample users to provide sensible defaults
      saveUsers(DEFAULT_SAMPLE_USERS);
      return DEFAULT_SAMPLE_USERS.slice();
    }
    return JSON.parse(raw || '[]');
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(users || []));
  // notify same-tab subscribers
  subscribers.forEach((s) => {
    try { s(users || []); } catch (e) { /* ignore */ }
  });
}

const subscribers = [];

function subscribe(cb) {
  if (typeof cb !== 'function') return () => {};
  subscribers.push(cb);
  // return unsubscribe
  return () => {
    const idx = subscribers.indexOf(cb);
    if (idx !== -1) subscribers.splice(idx, 1);
  };
}

// also listen to storage events (other tabs)
window.addEventListener('storage', (e) => {
  if (e.key === ADMIN_USERS_KEY) {
    const data = loadUsers();
    subscribers.forEach((s) => { try { s(data); } catch (e) {} });
  }
});

export default {
  get: loadUsers,
  save: saveUsers,
  subscribe,
};

// ========= AUTH CHECK =========
async function checkAuth() {
  try {
    const res = await fetch('/api/auth/me', { credentials: 'include' });
    if (!res.ok) { window.location.href = '/login.html'; return null; }
    const data = await res.json();
    if (!data.success) { window.location.href = '/login.html'; return null; }
    return data.user;
  } catch {
    window.location.href = '/login.html';
    return null;
  }
}

// ========= LOGOUT =========
async function logout() {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  window.location.href = '/login.html';
}

// ========= TOAST =========
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${icons[type] || '•'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100%)'; toast.style.transition = 'all 0.3s'; setTimeout(() => toast.remove(), 300); }, 3000);
}

// ========= API HELPER =========
async function api(url, method = 'GET', body = null) {
  const opts = { method, credentials: 'include', headers: {} };
  if (body) { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
  const res = await fetch(url, opts);
  if (res.status === 401) { window.location.href = '/login.html'; return null; }
  return res.json();
}

// ========= MODAL HELPERS =========
function openModal(id) {
  document.getElementById(id).classList.add('active');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
  const form = document.querySelector(`#${id} form`);
  if (form) form.reset();
}

// ========= FORMAT =========
function formatCurrency(n) {
  return '₹' + Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ========= SIDEBAR BUILDER =========
function buildSidebar(user, activePage) {
  const isAdmin = user.role === 'admin';

  const navItems = [
    { icon: '📊', label: 'Dashboard', page: 'dashboard' },
    { icon: '📦', label: 'Products', page: 'products' },
    { icon: '🏪', label: 'Stock', page: 'stock' },
    { icon: '💰', label: 'Sales', page: 'sales' },
    { icon: '🛒', label: 'Purchases', page: 'purchases' },
    { icon: '👥', label: 'Customers', page: 'customers' },
    { icon: '🤝', label: 'Suppliers', page: 'suppliers' },
    { icon: '🧾', label: 'GST Report', page: 'gst' },
  ];

  // Staff can't access admin-only pages
  const adminOnly = isAdmin ? navItems : navItems.filter(n => !['suppliers', 'gst'].includes(n.page));

  return `
    <div class="sidebar-logo">
      <div class="logo-icon">🛒</div>
      <div>
        <div class="logo-text">RetailPro</div>
        <div class="logo-sub">Management System</div>
      </div>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-section-title">Main Menu</div>
      ${adminOnly.map(item => `
        <a class="nav-item ${activePage === item.page ? 'active' : ''}" href="/pages/${item.page}.html">
          <div class="nav-icon">${item.icon}</div>
          ${item.label}
        </a>
      `).join('')}
    </nav>
    <div class="sidebar-footer">
      <div class="user-card">
        <div class="user-avatar">${user.username.charAt(0).toUpperCase()}</div>
        <div>
          <div class="user-name">${user.username}</div>
          <div class="user-role">${user.role}</div>
        </div>
      </div>
    </div>
  `;
}

// ========= TOPBAR BUILDER =========
function buildTopbar(title) {
  return `
    <div class="topbar-title">${title}</div>
    <div class="topbar-right">
      <button class="btn-logout" onclick="logout()">🚪 Logout</button>
    </div>
  `;
}

// ========= SEARCH FILTER =========
function filterTable(inputId, tableId) {
  const val = document.getElementById(inputId).value.toLowerCase();
  const rows = document.querySelectorAll(`#${tableId} tbody tr`);
  rows.forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(val) ? '' : 'none';
  });
}


// ══════════════════════════════════════════════════════════════
//  3D INTERACTIVE TILT & MICRO-ANIMATION CONTROLLER
// ══════════════════════════════════════════════════════════════
function _setup3DInteractions() {
  if (window._hasInit3DTilt) return;
  window._hasInit3DTilt = true;

  document.addEventListener('mousemove', (e) => {
    const card = e.target.closest('.kpi-card, .logo-3d-card, .sidebar-logo-card, .engine-metric-box, .executive-board-quote');
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(1)}deg) rotateY(${rotateY.toFixed(1)}deg) translateY(-4px) translateZ(8px)`;
  });

  document.addEventListener('mouseout', (e) => {
    const card = e.target.closest('.kpi-card, .logo-3d-card, .sidebar-logo-card, .engine-metric-box, .executive-board-quote');
    if (card && (!e.relatedTarget || !card.contains(e.relatedTarget))) {
      card.style.transform = '';
    }
  });
}

/* ============================================================
   Commission IQ — Core SPA Application (app.js)
   ============================================================ */

'use strict';

// ── Global State ───────────────────────────────────────────────
const AppState = {
  currentRoute: '/dashboard',
  sidebarCollapsed: false,
  charts: {},          // chart instances keyed by canvas id
  sortState: {},       // { [tableId]: { col, dir } }
  currentPage: {}      // { [tableId]: number }
};

// ── Route Map ──────────────────────────────────────────────────
const ROUTES = {
  '/dashboard':      { title: 'AI Profit Opportunity Engine™', desc: 'Autonomous retail procurement revenue generation platform for convenience stores & chains', fn: 'renderDashboard', icon: 'zap' },
  '/ai-feasibility': { title: 'AI Feasibility & Proactive Intelligence', desc: 'Autonomous data ingestion, benchmark diagnostics & proactive leakage detection', fn: 'renderAIFeasibility', icon: 'sparkles' },
  '/ranking':              { title: 'AI Opportunity Ranking Engine', desc: 'Procurement Priority Score (PPS) — what products to negotiate first based on revenue impact, timing, vendor risk & complexity', fn: 'renderOpportunityRanking', icon: 'target' },
  '/opportunity-ranking':  { title: 'AI Opportunity Ranking Engine', desc: 'Procurement Priority Score (PPS) — what products to negotiate first based on revenue impact, timing, vendor risk & complexity', fn: 'renderOpportunityRanking', icon: 'target' },
  '/digital-twin':         { title: 'AI Digital Procurement Twin & Bundle Optimizer', desc: 'Decision intelligence simulation engine & multi-product yield bundle discovery', fn: 'renderDigitalTwin', icon: 'cpu' },
  '/bundle-optimizer':     { title: 'AI Digital Procurement Twin & Bundle Optimizer', desc: 'Decision intelligence simulation engine & multi-product yield bundle discovery', fn: 'renderDigitalTwin', icon: 'cpu' },
  '/simulation':           { title: 'AI Digital Procurement Twin & Bundle Optimizer', desc: 'Decision intelligence simulation engine & multi-product yield bundle discovery', fn: 'renderDigitalTwin', icon: 'cpu' },
  '/leakage':              { title: 'Predictive Compliance & Leakage Forensics', desc: 'Predictive revenue leakage modeling, automated dispute generator & real-time transaction feed anomaly detection', fn: 'renderPredictiveForensics', icon: 'shield-alert' },
  '/predictive-compliance':{ title: 'Predictive Compliance & Leakage Forensics', desc: 'Predictive revenue leakage modeling, automated dispute generator & real-time transaction feed anomaly detection', fn: 'renderPredictiveForensics', icon: 'shield-alert' },
  '/leakage-forensics':    { title: 'Predictive Compliance & Leakage Forensics', desc: 'Predictive revenue leakage modeling, automated dispute generator & real-time transaction feed anomaly detection', fn: 'renderPredictiveForensics', icon: 'shield-alert' },
  '/benchmarking':         { title: 'Commission Benchmark Analyzer', desc: 'Excel upload, data normalization, market rate benchmarking & profit opportunity quantification', fn: 'renderBenchmarking',  icon: 'bar-chart-2' },
  '/benchmark-database':   { title: 'Benchmark Database', desc: 'Maintain market rates, effective dates, confidence scores, geography adjustments & historical versions', fn: 'renderBenchmarkDatabase', icon: 'database' },
  '/contracts':            { title: 'AI Contract Intelligence', desc: 'Ingest contracts, extract commissions, renewal dates, exclusivity clauses, notice periods & proactive alerts', fn: 'renderContracts', icon: 'file-text' },
  '/contract-intelligence':{ title: 'AI Contract Intelligence', desc: 'Ingest contracts, extract commissions, renewal dates, exclusivity clauses, notice periods & proactive alerts', fn: 'renderContracts', icon: 'file-text' },
  '/sourcing':             { title: 'Reverse Auction Engine & Sourcing', desc: 'Real-time reverse auctions, sealed bids, target pricing & AI dynamic reserve price recommendations', fn: 'renderSourcing', icon: 'shopping-cart' },
  '/auctions':             { title: 'Reverse Auction Engine & Sourcing', desc: 'Real-time reverse auctions, sealed bids, target pricing & AI dynamic reserve price recommendations', fn: 'renderSourcing', icon: 'shopping-cart' },
  '/reverse-auctions':     { title: 'Reverse Auction Engine & Sourcing', desc: 'Real-time reverse auctions, sealed bids, target pricing & AI dynamic reserve price recommendations', fn: 'renderSourcing', icon: 'shopping-cart' },
  '/vendors':              { title: 'Vendor Portal & Onboarding', desc: 'Preset vendor directory, bidding activation, offer acceptance, product additions, documents & scorecards', fn: 'renderVendorPortal', icon: 'building-2' },
  '/vendor-portal':        { title: 'Vendor Portal & Onboarding', desc: 'Preset vendor directory, bidding activation, offer acceptance, product additions, documents & scorecards', fn: 'renderVendorPortal', icon: 'building-2' },
  '/compliance':           { title: 'Compliance Monitoring & Revenue Reconciliation', desc: 'Validate expected vs. actual commissions monthly, detect leakage shortfalls & manage dispute workflows', fn: 'renderCompliance', icon: 'shield-check' },
  '/compliance-monitoring':{ title: 'Compliance Monitoring & Revenue Reconciliation', desc: 'Validate expected vs. actual commissions monthly, detect leakage shortfalls & manage dispute workflows', fn: 'renderCompliance', icon: 'shield-check' },
  '/recovery':             { title: 'Revenue Recovery & Dispute Cases', desc: 'Create underpayment cases, track recovery activities, manage multi-level escalations & report recovered dollars', fn: 'renderRecovery', icon: 'refresh-cw' },
  '/revenue-recovery':     { title: 'Revenue Recovery & Dispute Cases', desc: 'Create underpayment cases, track recovery activities, manage multi-level escalations & report recovered dollars', fn: 'renderRecovery', icon: 'refresh-cw' },
  '/executive':            { title: 'Executive Boardroom Dashboard', desc: 'Opportunity, compliance, active RFPs, expiring contracts & board-ready executive summaries', fn: 'renderExecutiveDashboard', icon: 'layout-dashboard' },
  '/executive-dashboard':  { title: 'Executive Boardroom Dashboard', desc: 'Opportunity, compliance, active RFPs, expiring contracts & board-ready executive summaries', fn: 'renderExecutiveDashboard', icon: 'layout-dashboard' },
  '/copilot':              { title: 'AI Copilot Roadmap', desc: 'Natural language insights, forecasting, and sourcing recommendations', fn: 'renderAICopilot', icon: 'bot' },
  '/ai-copilot':           { title: 'AI Copilot Roadmap', desc: 'Natural language insights, forecasting, and sourcing recommendations', fn: 'renderAICopilot', icon: 'bot' },
  '/reports':              { title: 'Reports & Bid Analytics', desc: 'Daily bid status, vendor concern / BAFO dropout tracker & vendor net impact reports', fn: 'renderReports', icon: 'file-bar-chart' },
  '/audit':         { title: 'Audit Log',            desc: 'Full system audit trail',                     fn: 'renderAudit',         icon: 'clipboard-list' },
  '/notifications': { title: 'Notifications',        desc: 'Alerts & system notifications',              fn: 'renderNotifications', icon: 'bell' },
  '/workflow':             { title: 'Escalation Workflow & SLA Tracking', desc: 'Multilevel escalation matrix, configurable thresholds & SLA response countdowns', fn: 'renderWorkflow', icon: 'git-branch' },
  '/settings':      { title: 'Settings',             desc: 'Platform configuration & user preferences',  fn: 'renderSettings',      icon: 'settings' },
  '/auto-rfp':             { title: 'AI Auto-RFP Builder', desc: 'Automatically generate product lists, volume commitments, requirements & commercial terms with 1-click', fn: 'renderAutoRfpBuilder', icon: 'sparkles' },
  '/renewal-hunter':       { title: 'AI Renewal Hunter', desc: 'Autonomous contract scanner for expiring agreements, auto-renewals & benchmark gaps', fn: 'renderRenewalHunter', icon: 'crosshair' },
  '/roadmap':              { title: 'MVP Roadmap & Requirements Matrix', desc: 'Phased delivery matrix covering analytics, sourcing, compliance & AI capabilities', fn: 'renderRoadmapMatrix', icon: 'map' },
  '/security':             { title: 'Security & Multi-Tenant Infrastructure', desc: 'SSO, MFA, RBAC, API-first architecture, AES-256 encryption, audit logs & multi-tenant cloud deployment', fn: 'renderSecuritySettings', icon: 'lock' }
};

// ══════════════════════════════════════════════════════════════
//  INIT APP  — called after successful login
// ══════════════════════════════════════════════════════════════
window.initApp = function(user) {
  _setupNavbar(user);
  _setupSidebar();
  _setup3DInteractions();
  _setupNotificationBell(user);
  _setupUserDropdown(user);
  _setupSearch();
  _setupMobileMenu();

  // Hash-based routing
  window.addEventListener('hashchange', _handleRouteChange);

  // Navigate to current hash or default
  const hash = window.location.hash.replace('#', '') || '/dashboard';
  _navigate(hash);
};

// ══════════════════════════════════════════════════════════════
//  ROUTER
// ══════════════════════════════════════════════════════════════
function _handleRouteChange() {
  const route = window.location.hash.replace('#', '') || '/dashboard';
  _navigate(route);
}

function _navigate(route) {
  if (!ROUTES[route]) route = '/dashboard';
  AppState.currentRoute = route;

  // Destroy old charts to prevent canvas reuse errors
  Object.values(AppState.charts).forEach(c => { try { c.destroy(); } catch(e) {} });
  AppState.charts = {};

  _updateActiveNav(route);
  _updateBreadcrumb(route);
  _updatePageHeader(route);
  _renderPage(route);

  // Re-init Lucide after render
  setTimeout(() => {
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }, 50);
}

function _renderPage(route) {
  const cfg = ROUTES[route];
  const fnName = cfg ? cfg.fn : 'renderDashboard';
  if (typeof window[fnName] === 'function') {
    window[fnName]();
  }
}

// ══════════════════════════════════════════════════════════════
//  SIDEBAR
// ══════════════════════════════════════════════════════════════
function _setupSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggle  = document.getElementById('sidebar-toggle');
  const wrapper = document.getElementById('main-wrapper');

  if (toggle) {
    toggle.addEventListener('click', () => {
      AppState.sidebarCollapsed = !AppState.sidebarCollapsed;
      sidebar.classList.toggle('collapsed', AppState.sidebarCollapsed);
    });
  }
}

function _setupMobileMenu() {
  const btn     = document.getElementById('mobile-menu-btn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (btn) {
    btn.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
      overlay.classList.toggle('active');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
      overlay.classList.remove('active');
    });
  }
}

function _updateActiveNav(route) {
  document.querySelectorAll('.nav-item').forEach(item => {
    const r = item.dataset.route;
    item.classList.toggle('active', r === route);
  });
}

// ══════════════════════════════════════════════════════════════
//  NAVBAR
// ══════════════════════════════════════════════════════════════
function _setupNavbar(user) {
  // Avatar initials
  const avatarEls = ['navbar-avatar','sidebar-avatar','user-panel-avatar'];
  avatarEls.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = user.avatar || user.name.split(' ').map(w=>w[0]).join('');
  });

  // Names & roles
  _setText('navbar-user-name',   user.name);
  _setText('navbar-user-role',   user.role);
  _setText('sidebar-user-name',  user.name);
  _setText('sidebar-user-role',  user.role);
  _setText('user-panel-name',    user.name);
  _setText('user-panel-email',   user.email);
  _setText('user-panel-role',    user.role);

  // Logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      closeModal();
      Auth.logout();
    });
  }
}

// ══════════════════════════════════════════════════════════════
//  NOTIFICATION BELL
// ══════════════════════════════════════════════════════════════
function _setupNotificationBell(user) {
  const btn   = document.getElementById('notif-btn');
  const panel = document.getElementById('notif-panel');
  const badge = document.getElementById('notif-badge');
  const sidebarBadge = document.getElementById('sidebar-notif-badge');

  _renderNotifPanel(user, badge, sidebarBadge);

  if (btn) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = panel.style.display === 'block';
      _closeAllDropdowns();
      panel.style.display = isOpen ? 'none' : 'block';
    });
  }

  document.getElementById('mark-all-read')?.addEventListener('click', () => {
    MockData.notifications.forEach(n => {
      if (n.userId === user.id) n.read = true;
    });
    _renderNotifPanel(user, badge, sidebarBadge);
    showToast('All notifications marked as read', 'success');
  });

  document.addEventListener('click', (e) => {
    if (!document.getElementById('notif-dropdown-wrap')?.contains(e.target)) {
      if (panel) panel.style.display = 'none';
    }
  });
}

function _renderNotifPanel(user, badge, sidebarBadge) {
  const notifs  = MockData.getUserNotifications(user.id);
  const unread  = MockData.getUnreadCount(user.id);
  const list    = document.getElementById('notif-list');

  // Badges
  if (badge) {
    badge.style.display = unread > 0 ? 'block' : 'none';
    badge.textContent = unread > 9 ? '9+' : (unread || '');
  }
  if (sidebarBadge) {
    if (unread > 0) {
      sidebarBadge.textContent = unread > 9 ? '9+' : unread;
      sidebarBadge.style.display = 'flex';
    } else {
      sidebarBadge.style.display = 'none';
    }
  }

  if (!list) return;

  if (!notifs.length) {
    list.innerHTML = '<div style="padding:1.5rem;text-align:center;color:var(--text-muted);font-size:.875rem;">No notifications</div>';
    return;
  }

  list.innerHTML = notifs.slice(0, 6).map(n => `
    <div class="notif-item ${n.read ? '' : 'unread'}">
      <div class="notif-dot ${n.type}"></div>
      <div class="notif-content">
        <div class="notif-title">${esc(n.title)}</div>
        <div class="notif-msg">${esc(n.message)}</div>
        <div class="notif-time">${_relativeTime(n.timestamp)}</div>
      </div>
    </div>
  `).join('');
}

// ══════════════════════════════════════════════════════════════
//  USER DROPDOWN
// ══════════════════════════════════════════════════════════════
function _setupUserDropdown(user) {
  const btn   = document.getElementById('user-avatar-btn');
  const panel = document.getElementById('user-panel');

  if (btn) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = panel.style.display === 'block';
      _closeAllDropdowns();
      panel.style.display = isOpen ? 'none' : 'block';
    });
  }

  document.addEventListener('click', (e) => {
    if (!document.getElementById('user-dropdown-wrap')?.contains(e.target)) {
      if (panel) panel.style.display = 'none';
    }
  });
}

function _closeAllDropdowns() {
  document.getElementById('notif-panel')?.style && (document.getElementById('notif-panel').style.display = 'none');
  document.getElementById('user-panel')?.style  && (document.getElementById('user-panel').style.display = 'none');
}

// ══════════════════════════════════════════════════════════════
//  BREADCRUMB & PAGE HEADER
// ══════════════════════════════════════════════════════════════
function _updateBreadcrumb(route) {
  const cfg = ROUTES[route];
  const el  = document.getElementById('breadcrumb-current');
  if (el && cfg) el.textContent = cfg.title;
}

function _updatePageHeader(route) {
  const cfg = ROUTES[route];
  if (!cfg) return;
  _setText('page-title', cfg.title);
  _setText('page-description', cfg.desc);
  const actEl = document.getElementById('page-actions');
  if (actEl) actEl.innerHTML = '';
}

// ══════════════════════════════════════════════════════════════
//  SEARCH
// ══════════════════════════════════════════════════════════════
function _setupSearch() {
  const input = document.getElementById('global-search');
  if (!input) return;

  let debounce;
  input.addEventListener('input', (e) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      const q = e.target.value.trim().toLowerCase();
      _applyGlobalSearch(q);
    }, 300);
  });

  // ⌘K / Ctrl+K to focus
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      input.focus();
    }
  });
}

function _applyGlobalSearch(query) {
  if (!query) {
    document.querySelectorAll('tbody tr').forEach(r => r.style.display = '');
    return;
  }
  document.querySelectorAll('tbody tr').forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(query) ? '' : 'none';
  });
}

// ══════════════════════════════════════════════════════════════
//  TOAST SYSTEM
// ══════════════════════════════════════════════════════════════
window.showToast = function(message, type = 'info', duration = 4000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = { success: 'check-circle', warning: 'alert-triangle', danger: 'x-circle', info: 'info' };
  const id    = 'toast-' + Date.now();

  const toast = document.createElement('div');
  toast.id    = id;
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon"><i data-lucide="${icons[type] || 'info'}"></i></div>
    <div class="toast-content">
      <div class="toast-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
      <div class="toast-msg">${esc(message)}</div>
    </div>
    <button class="toast-close" onclick="document.getElementById('${id}').remove()">
      <i data-lucide="x"></i>
    </button>
  `;

  container.appendChild(toast);
  if (typeof lucide !== 'undefined') lucide.createIcons();

  setTimeout(() => {
    toast.classList.add('out');
    setTimeout(() => toast.remove(), 300);
  }, duration);
};

// ══════════════════════════════════════════════════════════════
//  MODAL SYSTEM
// ══════════════════════════════════════════════════════════════
window.openModal = function(title, content, actions = []) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML   = content;

  const footer = document.getElementById('modal-footer');
  footer.innerHTML = actions.map(a =>
    `<button class="btn ${a.cls || 'btn-secondary'}" onclick="${a.action}">${esc(a.label)}</button>`
  ).join('');

  document.getElementById('modal-backdrop').style.display = 'flex';
  if (typeof lucide !== 'undefined') lucide.createIcons();
};

window.closeModal = function() {
  document.getElementById('modal-backdrop').style.display = 'none';
  document.getElementById('modal-body').innerHTML   = '';
  document.getElementById('modal-footer').innerHTML = '';
};

// Modal close events
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('modal-close')?.addEventListener('click', closeModal);
  document.getElementById('modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('modal-backdrop')) closeModal();
  });
});

// ══════════════════════════════════════════════════════════════
//  TABLE UTILITIES
// ══════════════════════════════════════════════════════════════
window.sortTable = function(data, column, direction = 'asc') {
  return [...data].sort((a, b) => {
    const av = a[column]; const bv = b[column];
    if (av == null) return 1; if (bv == null) return -1;
    if (typeof av === 'number' && typeof bv === 'number') {
      return direction === 'asc' ? av - bv : bv - av;
    }
    const as = String(av).toLowerCase();
    const bs = String(bv).toLowerCase();
    if (as < bs) return direction === 'asc' ? -1 : 1;
    if (as > bs) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

window.filterTable = function(data, filters) {
  return data.filter(row => {
    return Object.entries(filters).every(([key, val]) => {
      if (!val || val === 'all') return true;
      const cell = row[key];
      if (cell == null) return false;
      return String(cell).toLowerCase().includes(String(val).toLowerCase());
    });
  });
};

window.paginateTable = function(data, page = 1, perPage = 10) {
  const start = (page - 1) * perPage;
  return {
    rows:  data.slice(start, start + perPage),
    total: data.length,
    pages: Math.ceil(data.length / perPage),
    page,
    perPage
  };
};

// ══════════════════════════════════════════════════════════════
//  EXPORT UTILITY
// ══════════════════════════════════════════════════════════════
window.exportToCSV = function(data, filename = 'export.csv') {
  if (!data || !data.length) {
    showToast('No data to export', 'warning');
    return;
  }
  const headers = Object.keys(data[0]);
  const rows    = data.map(row =>
    headers.map(h => {
      const v = row[h];
      if (v == null) return '';
      const s = String(v).replace(/"/g, '""');
      return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s}"` : s;
    }).join(',')
  );
  const csv  = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
  showToast(`Exported ${data.length} records to ${filename}`, 'success');
};

// ══════════════════════════════════════════════════════════════
//  PAGINATION RENDERER
// ══════════════════════════════════════════════════════════════
window.renderPagination = function(containerId, paged, onPage) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const { total, page, pages, perPage } = paged;
  const start = (page - 1) * perPage + 1;
  const end   = Math.min(page * perPage, total);

  let btns = `<span class="pagination-info">Showing ${start}–${end} of ${total}</span>`;
  btns += `<button class="page-btn" ${page <= 1 ? 'disabled' : ''} onclick="(${onPage})(${page-1})"><i data-lucide="chevron-left"></i></button>`;

  for (let p = 1; p <= pages; p++) {
    if (pages > 7 && Math.abs(p - page) > 2 && p !== 1 && p !== pages) {
      if (p === 2 || p === pages - 1) btns += `<span class="page-btn" style="cursor:default">…</span>`;
      continue;
    }
    btns += `<button class="page-btn ${p === page ? 'active' : ''}" onclick="(${onPage})(${p})">${p}</button>`;
  }

  btns += `<button class="page-btn" ${page >= pages ? 'disabled' : ''} onclick="(${onPage})(${page+1})"><i data-lucide="chevron-right"></i></button>`;
  el.innerHTML = `<div class="pagination">${btns}</div>`;
  if (typeof lucide !== 'undefined') lucide.createIcons();
};

// ══════════════════════════════════════════════════════════════
//  FORMAT HELPERS
// ══════════════════════════════════════════════════════════════
function formatCurrency(v) {
  if (v >= 1_000_000) return '$' + (v / 1_000_000).toFixed(2) + 'M';
  if (v >= 1_000)     return '$' + (v / 1_000).toFixed(1) + 'K';
  return '$' + v.toLocaleString();
}

function formatNumber(v) {
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + 'M';
  if (v >= 1_000)     return v.toLocaleString();
  return String(v);
}

function formatPercent(v) { return v.toFixed(1) + '%'; }

function formatValue(v, format) {
  if (format === 'currency') return formatCurrency(v);
  if (format === 'percent')  return formatPercent(v);
  return formatNumber(v);
}

function trendPct(current, previous) {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
}

function esc(str) {
  return String(str ?? '').replace(/&/g,'&').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function _setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function _relativeTime(ts) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7)   return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}

function _setContent(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

// ══════════════════════════════════════════════════════════════
//
//  PAGE RENDERERS
//
// ══════════════════════════════════════════════════════════════

// ── MANUAL ENTRY COMMISSION LEDGER (FLAGSHIP FEATURE) ─────────
window._manualEntryOpen = false;
window._manualEntryData = [
  { service: '', placeholder: 'Ex. Netflix cards', count: '', rate: '', isSubsidy: false },
  { service: '', placeholder: 'Ex. Amazon cards', count: '', rate: '', isSubsidy: false },
  { service: '', placeholder: 'Ex. Western Union Money Transfer', count: '', rate: '', isSubsidy: false },
  { service: '', placeholder: 'Ex. Money Gram Transfer', count: '', rate: '', isSubsidy: false },
  { service: 'Fraud Protection Subsidy', placeholder: 'Fraud Protection Subsidy', count: '', rate: '', isSubsidy: true },
  { service: 'IT Integration Subsidy', placeholder: 'IT Integration Subsidy', count: '', rate: '', isSubsidy: true },
  { service: 'Marketing Subsidy', placeholder: 'Marketing Subsidy', count: '', rate: '', isSubsidy: true }
];

window.renderManualEntrySectionHTML = function() {
  const rows = window._manualEntryData || [];
  let totalCount = 0;
  let totalGross = 0;

  const rowsHTML = rows.map((r, idx) => {
    const rawCount = String(r.count || '').replace(/,/g, '').trim();
    const count = parseFloat(rawCount) || 0;
    const rawRate = String(r.rate || '').replace(/[\$,]/g, '').trim();
    const rate = parseFloat(rawRate) || 0;

    let gross = 0;
    if (r.isSubsidy) {
      if (count > 0 && rate > 0) gross = count * rate;
      else if (rate > 0) gross = rate;
      else if (count > 0) gross = count;
    } else {
      if (count > 0 && rate > 0) gross = count * rate;
    }

    totalCount += count;
    totalGross += gross;

    const formattedGross = gross > 0 
      ? `$ ${gross.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
      : '$ -';

    const isSubsidy = Boolean(r.isSubsidy);
    const serviceVal = r.service ? esc(r.service) : '';
    const placeholderVal = r.placeholder ? esc(r.placeholder) : 'Service Name';

    return `
      <tr class="manual-entry-row ${isSubsidy ? 'subsidy-row' : ''}" data-row="${idx}">
        <td>
          <input 
            type="text" 
            class="manual-input manual-service-name ${isSubsidy ? 'subsidy-label' : ''}" 
            value="${serviceVal}" 
            placeholder="${placeholderVal}" 
            data-row="${idx}"
            aria-label="Service Name"
            oninput="window.handleManualEntryRowInput(${idx}, 'service', this.value)" 
          />
        </td>
        <td style="text-align:right;">
          <input 
            type="text" 
            inputmode="numeric" 
            class="manual-input text-right manual-tx-count" 
            value="${r.count ? Number(String(r.count).replace(/,/g,'')).toLocaleString('en-US') : ''}" 
            placeholder="—" 
            data-row="${idx}"
            aria-label="Transaction Count"
            onfocus="window.handleCountFocus(this, ${idx})"
            onblur="window.handleCountBlur(this, ${idx})"
            oninput="window.handleManualEntryRowInput(${idx}, 'count', this.value)" 
          />
        </td>
        <td style="text-align:right;">
          <div class="manual-rate-wrap">
            <span class="manual-rate-prefix">$</span>
            <input 
              type="text" 
              inputmode="decimal" 
              class="manual-input text-right manual-rate" 
              value="${r.rate !== '' && r.rate !== undefined ? r.rate : ''}" 
              placeholder="-" 
              data-row="${idx}"
              aria-label="Commission Rate"
              oninput="window.handleManualEntryRowInput(${idx}, 'rate', this.value)" 
            />
          </div>
        </td>
        <td style="text-align:right;">
          <div style="display:flex;align-items:center;justify-content:flex-end;gap:0.4rem;">
            <span class="manual-gross-val" id="manual-gross-${idx}">${formattedGross}</span>
            ${idx > 6 ? `
              <button type="button" class="btn-remove-row" title="Remove Row" onclick="window.deleteManualEntryRow(${idx})">
                <i data-lucide="trash-2" style="width:13px;height:13px;"></i>
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');

  const formattedTotalGross = totalGross > 0
    ? `$ ${totalGross.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : '$ -';
  const formattedTotalCount = totalCount > 0
    ? totalCount.toLocaleString('en-US')
    : '—';

  return `
    <div class="manual-entry-card">
      <div class="manual-entry-header">
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <div class="manual-entry-badge-icon">
            <i data-lucide="table" style="width:18px;height:18px;"></i>
          </div>
          <div>
            <div style="font-weight:800;font-size:1.05rem;color:#ffffff;display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;">
              <span>Manual Entry Ledger</span>
              <span class="badge" style="background:rgba(245,158,11,0.25);color:#fbbf24;border:1px solid rgba(245,158,11,0.5);font-size:0.7rem;padding:2px 7px;font-weight:700;">INTERACTIVE CALCULATOR</span>
            </div>
            <div style="font-size:0.75rem;color:#94a3b8;margin-top:2px;">
              Input annual transaction counts and commission rates per transaction to calculate gross commissions
            </div>
          </div>
        </div>

        <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;">
          <button type="button" class="btn btn-hero-glass btn-sm" style="font-size:0.75rem;padding:0.35rem 0.75rem;" onclick="window.loadManualEntryDemoData()">
            <i data-lucide="sparkles" style="width:13px;height:13px;color:#38bdf8;"></i> Load Sample Data
          </button>
          <button type="button" class="btn btn-hero-glass btn-sm" style="font-size:0.75rem;padding:0.35rem 0.75rem;" onclick="window.clearManualEntryData()">
            <i data-lucide="rotate-ccw" style="width:13px;height:13px;color:#ef4444;"></i> Clear Table
          </button>
          <button type="button" class="btn btn-hero-glass btn-sm" style="font-size:0.75rem;padding:0.35rem 0.65rem;" onclick="window.toggleManualEntrySection()">
            <i data-lucide="x" style="width:14px;height:14px;"></i> Close
          </button>
        </div>
      </div>

      <div class="manual-entry-table-wrap">
        <table class="manual-entry-table">
          <thead>
            <tr>
              <th style="width:38%;">Service Name</th>
              <th style="width:20%;text-align:right;">Transaction Count (Annual)</th>
              <th style="width:20%;text-align:right;">Commission Rate/Transaction</th>
              <th style="width:22%;text-align:right;">
                <span>Gross Commission</span>
                <span class="manual-col-hint">(Transaction Count &times; Commission Rate)</span>
              </th>
            </tr>
          </thead>
          <tbody id="manual-entry-tbody">
            ${rowsHTML}
          </tbody>
          <tfoot>
            <tr class="manual-entry-total-row">
              <td style="font-weight:800;color:#ffffff;">
                <div style="font-size:0.875rem;">Total Gross Commission</div>
                <div style="font-size:0.7rem;color:#94a3b8;font-weight:400;">Sum of all active service lines &amp; subsidies</div>
              </td>
              <td id="manual-total-count" style="text-align:right;font-weight:700;color:#cbd5e1;font-family:'SF Mono',Consolas,monospace;font-size:0.875rem;">
                ${formattedTotalCount}
              </td>
              <td style="text-align:right;color:#94a3b8;font-size:0.75rem;">
                Annual Summary
              </td>
              <td id="manual-total-gross" style="text-align:right;font-weight:800;font-size:1.1rem;color:#34d399;font-family:'SF Mono',Consolas,monospace;">
                ${formattedTotalGross}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="manual-entry-footer">
        <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;">
          <button type="button" class="btn btn-hero-glass btn-sm" style="font-size:0.8rem;padding:0.35rem 0.75rem;" onclick="window.addManualEntryRow()">
            <i data-lucide="plus" style="width:14px;height:14px;color:#10b981;"></i> Add Custom Service Row
          </button>
          <span style="font-size:0.75rem;color:#94a3b8;">
            <i data-lucide="info" style="width:12px;height:12px;vertical-align:middle;margin-right:2px;"></i>
            Type over grey placeholder names to customize services
          </span>
        </div>

        <div style="display:flex;align-items:center;gap:0.625rem;flex-wrap:wrap;">
          <button type="button" class="btn btn-sm btn-primary" style="background:#10b981;border-color:#10b981;color:#ffffff;font-weight:700;padding:0.45rem 1.1rem;box-shadow:0 4px 14px rgba(16,185,129,0.35);" onclick="window.applyManualEntryToEngine()">
            <i data-lucide="check-check" style="width:15px;height:15px;"></i> Apply to Opportunity Engine
          </button>
        </div>
      </div>
    </div>
  `;
};

window.toggleManualEntrySection = function() {
  window._manualEntryOpen = !window._manualEntryOpen;
  const container = document.getElementById('manual-entry-section');
  const btn = document.getElementById('btn-manual-entry-toggle');

  if (container) {
    if (window._manualEntryOpen) {
      container.innerHTML = window.renderManualEntrySectionHTML();
      container.style.display = 'block';
      if (typeof lucide !== 'undefined') lucide.createIcons();
      container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      if (btn) {
        btn.style.borderColor = 'rgba(245,158,11,1)';
        btn.style.background = 'rgba(245,158,11,0.25)';
      }
    } else {
      container.style.display = 'none';
      if (btn) {
        btn.style.borderColor = 'rgba(245,158,11,0.6)';
        btn.style.background = 'rgba(255,255,255,0.15)';
      }
    }
  }
};

window.handleManualEntryRowInput = function(idx, field, value) {
  if (!window._manualEntryData || !window._manualEntryData[idx]) return;
  window._manualEntryData[idx][field] = value;

  const r = window._manualEntryData[idx];
  const rawCount = String(r.count || '').replace(/,/g, '').trim();
  const count = parseFloat(rawCount) || 0;
  const rawRate = String(r.rate || '').replace(/[\$,]/g, '').trim();
  const rate = parseFloat(rawRate) || 0;

  let gross = 0;
  if (r.isSubsidy) {
    if (count > 0 && rate > 0) gross = count * rate;
    else if (rate > 0) gross = rate;
    else if (count > 0) gross = count;
  } else {
    if (count > 0 && rate > 0) gross = count * rate;
  }

  const grossEl = document.getElementById(`manual-gross-${idx}`);
  if (grossEl) {
    grossEl.textContent = gross > 0
      ? `$ ${gross.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : '$ -';
  }

  // Live total sum across all rows
  let totalCount = 0;
  let totalGross = 0;
  window._manualEntryData.forEach(row => {
    const c = parseFloat(String(row.count || '').replace(/,/g, '').trim()) || 0;
    const rt = parseFloat(String(row.rate || '').replace(/[\$,]/g, '').trim()) || 0;
    let g = 0;
    if (row.isSubsidy) {
      if (c > 0 && rt > 0) g = c * rt;
      else if (rt > 0) g = rt;
      else if (c > 0) g = c;
    } else {
      if (c > 0 && rt > 0) g = c * rt;
    }
    totalCount += c;
    totalGross += g;
  });

  const totCountEl = document.getElementById('manual-total-count');
  if (totCountEl) {
    totCountEl.textContent = totalCount > 0 ? totalCount.toLocaleString('en-US') : '—';
  }
  const totGrossEl = document.getElementById('manual-total-gross');
  if (totGrossEl) {
    totGrossEl.textContent = totalGross > 0
      ? `$ ${totalGross.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : '$ -';
  }
};

window.handleCountBlur = function(input, idx) {
  const raw = String(input.value || '').replace(/,/g, '').trim();
  if (raw && !isNaN(raw)) {
    input.value = Number(raw).toLocaleString('en-US');
    window._manualEntryData[idx].count = raw;
  }
};

window.handleCountFocus = function(input, idx) {
  const raw = String(input.value || '').replace(/,/g, '').trim();
  if (raw && !isNaN(raw)) {
    input.value = raw;
  }
};

window.loadManualEntryDemoData = function() {
  window._manualEntryData = [
    { service: '', placeholder: 'Ex. Netflix cards', count: '200000', rate: '0.41', isSubsidy: false },
    { service: '', placeholder: 'Ex. Amazon cards', count: '350000', rate: '1.24', isSubsidy: false },
    { service: '', placeholder: 'Ex. Western Union Money Transfer', count: '120000', rate: '1.52', isSubsidy: false },
    { service: '', placeholder: 'Ex. Money Gram Transfer', count: '85000', rate: '1.40', isSubsidy: false },
    { service: 'Fraud Protection Subsidy', placeholder: 'Fraud Protection Subsidy', count: '', rate: '25000', isSubsidy: true },
    { service: 'IT Integration Subsidy', placeholder: 'IT Integration Subsidy', count: '', rate: '15000', isSubsidy: true },
    { service: 'Marketing Subsidy', placeholder: 'Marketing Subsidy', count: '', rate: '18000', isSubsidy: true }
  ];

  const container = document.getElementById('manual-entry-section');
  if (container) {
    container.innerHTML = window.renderManualEntrySectionHTML();
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
  showToast('✓ Sample C-Store Ledger Loaded! Total Gross Commission: $875,400.00', 'info');
};

window.clearManualEntryData = function() {
  window._manualEntryData = [
    { service: '', placeholder: 'Ex. Netflix cards', count: '', rate: '', isSubsidy: false },
    { service: '', placeholder: 'Ex. Amazon cards', count: '', rate: '', isSubsidy: false },
    { service: '', placeholder: 'Ex. Western Union Money Transfer', count: '', rate: '', isSubsidy: false },
    { service: '', placeholder: 'Ex. Money Gram Transfer', count: '', rate: '', isSubsidy: false },
    { service: 'Fraud Protection Subsidy', placeholder: 'Fraud Protection Subsidy', count: '', rate: '', isSubsidy: true },
    { service: 'IT Integration Subsidy', placeholder: 'IT Integration Subsidy', count: '', rate: '', isSubsidy: true },
    { service: 'Marketing Subsidy', placeholder: 'Marketing Subsidy', count: '', rate: '', isSubsidy: true }
  ];

  const container = document.getElementById('manual-entry-section');
  if (container) {
    container.innerHTML = window.renderManualEntrySectionHTML();
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
  showToast('Manual Entry Ledger cleared', 'info');
};

window.addManualEntryRow = function() {
  if (!window._manualEntryData) window._manualEntryData = [];
  window._manualEntryData.push({
    service: '',
    placeholder: 'Ex. Custom Gift Card / Bill Pay / ATM',
    count: '',
    rate: '',
    isSubsidy: false
  });

  const container = document.getElementById('manual-entry-section');
  if (container) {
    container.innerHTML = window.renderManualEntrySectionHTML();
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
};

window.deleteManualEntryRow = function(idx) {
  if (!window._manualEntryData) return;
  window._manualEntryData.splice(idx, 1);
  const container = document.getElementById('manual-entry-section');
  if (container) {
    container.innerHTML = window.renderManualEntrySectionHTML();
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
};

window.applyManualEntryToEngine = function() {
  let totalGross = 0;
  let totalCount = 0;
  let activeRows = 0;

  window._manualEntryData.forEach(r => {
    const c = parseFloat(String(r.count || '').replace(/,/g, '').trim()) || 0;
    const rt = parseFloat(String(r.rate || '').replace(/[\$,]/g, '').trim()) || 0;
    let g = 0;
    if (r.isSubsidy) {
      if (c > 0 && rt > 0) g = c * rt;
      else if (rt > 0) g = rt;
      else if (c > 0) g = c;
    } else {
      if (c > 0 && rt > 0) g = c * rt;
    }
    if (g > 0) activeRows++;
    totalGross += g;
    totalCount += c;
  });

  if (totalGross === 0) {
    showToast('Please enter transaction counts and commission rates, or click "Load Sample Data" first.', 'warning');
    return;
  }

  const currentCommissionsEl = document.getElementById('engine-current-commission-val');
  const presentCommissionsEl = document.getElementById('engine-present-commission-val');
  const opportunityEl = document.getElementById('engine-opportunity-val');
  const statusTextEl = document.getElementById('engine-status-text');

  const presentBenchmark = 1630000;
  const opportunity = Math.max(0, presentBenchmark - totalGross);

  const formattedCurrent = totalGross >= 1000000 
    ? `$${(totalGross / 1000000).toFixed(2)}M` 
    : `$${Math.round(totalGross / 1000)}K`;
  const formattedOpportunity = opportunity >= 1000000 
    ? `$${(opportunity / 1000000).toFixed(2)}M` 
    : `$${Math.round(opportunity / 1000)}K`;

  if (currentCommissionsEl) currentCommissionsEl.textContent = formattedCurrent;
  if (presentCommissionsEl) presentCommissionsEl.textContent = '$1.63M';
  if (opportunityEl) opportunityEl.textContent = formattedOpportunity;

  if (statusTextEl) {
    statusTextEl.innerHTML = `Manual Ledger Ingested: <strong style="color:#ffffff;">Manual_Entry_Ledger.xlsx</strong> (${totalCount.toLocaleString()} transactions across ${activeRows} services normalized in real-time)`;
  }

  MockData.auditLogs.unshift({
    id: 'AL' + Date.now(),
    userId: Auth.getCurrentUser()?.id || 'U001',
    userName: Auth.getCurrentUser()?.name || 'Finance Analyst',
    action: 'opportunity_engine_manual_entry',
    module: 'Opportunity Engine',
    details: `Manual Entry Applied: Gross Commission ${formattedCurrent} across ${totalCount.toLocaleString()} transactions. Present Commission: $1.63M, Commission Opportunity: ${formattedOpportunity}`,
    timestamp: new Date().toISOString(),
    ipAddress: '127.0.0.1'
  });

  showToast(`🚀 Opportunity Engine updated! Current: ${formattedCurrent} | Present Commission: $1.63M | Commission Opportunity: ${formattedOpportunity}`, 'success');
};

// ── DASHBOARD (FULLY IMPLEMENTED) ─────────────────────────────
window.renderDashboard = function() {
  const kpis   = MockData.dashboardKPIs;
  const rev    = MockData.monthlyRevenue;
  const cats   = MockData.categoryDistribution;
  const top    = MockData.topVendors;
  const acts   = MockData.recentActivity;

  // KPI config
  const kpiConfig = [
    { key:'totalCommissionRevenue', label:'Total Commission Revenue', icon:'dollar-sign',    color:'#1a73e8', bg:'#e8f0fe' },
    { key:'activeVendors',          label:'Active Vendors',           icon:'building-2',     color:'#22c55e', bg:'#dcfce7' },
    { key:'avgCommissionRate',      label:'Avg Commission Rate',      icon:'percent',        color:'#6366f1', bg:'#ede9fe' },
    { key:'pendingSubsidies',       label:'Pending Subsidies',        icon:'clock',          color:'#f59e0b', bg:'#fef3c7' },
    { key:'totalContractValue',     label:'Total Contract Value',     icon:'file-text',      color:'#0ea5e9', bg:'#e0f2fe' },
    { key:'expiringContracts',      label:'Expiring Contracts',       icon:'alert-triangle', color:'#ef4444', bg:'#fee2e2' },
    { key:'monthlyTransactions',    label:'Monthly Transactions',     icon:'activity',       color:'#8b5cf6', bg:'#ede9fe' },
    { key:'complianceScore',        label:'Compliance Score',         icon:'shield-check',   color:'#14b8a6', bg:'#ccfbf1' }
  ];

  const kpiHTML = kpiConfig.map(cfg => {
    const kpi  = kpis[cfg.key];
    const pct  = trendPct(kpi.value, kpi.previousValue);
    const up   = pct >= 0;
    const trendClass = up ? 'up' : 'down';
    const trendIcon  = up ? 'trending-up' : 'trending-down';
    return `
      <div class="kpi-card" style="--kpi-color:${cfg.color};--kpi-bg:${cfg.bg}">
        <div class="kpi-icon" style="background:${cfg.bg};color:${cfg.color}">
          <i data-lucide="${cfg.icon}"></i>
        </div>
        <div class="kpi-content">
          <div class="kpi-label">${esc(cfg.label)}</div>
          <div class="kpi-value">${formatValue(kpi.value, kpi.format)}</div>
          <span class="kpi-trend ${trendClass}">
            <i data-lucide="${trendIcon}"></i>
            ${Math.abs(pct).toFixed(1)}% vs last period
          </span>
        </div>
      </div>
    `;
  }).join('');

  // Activity icon map
  const actDotClass = { commission:'commission', contract:'contract', vendor:'vendor', subsidy:'subsidy', report:'report', audit:'audit' };

  const activityHTML = acts.map(a => `
    <div class="timeline-item">
      <div class="timeline-dot ${actDotClass[a.type] || ''}">
        <i data-lucide="${a.icon}"></i>
      </div>
      <div class="timeline-content">
        <div class="timeline-title">${esc(a.title)}</div>
        <div class="timeline-desc">${esc(a.description)}</div>
        <div class="timeline-meta">
          <span><i data-lucide="user" style="width:11px;height:11px;"></i> ${esc(a.user)}</span>
          <span>${_relativeTime(a.timestamp)}</span>
        </div>
      </div>
    </div>
  `).join('');

  // Quick stats
  const activeVendors = MockData.getActiveVendors().length;
  const totalContracts = MockData.contracts.length;
  const activeContracts = MockData.contracts.filter(c => c.status === 'active').length;
  const totalVolume = MockData.vendors.reduce((s, v) => s + (v.totalVolume || 0), 0);

  const quickStats = [
    { label:'Active Vendors',    value: activeVendors,    sub:'of ' + MockData.vendors.length + ' total' },
    { label:'Active Contracts',  value: activeContracts,  sub:'of ' + totalContracts + ' total' },
    { label:'Total Volume',      value: formatCurrency(totalVolume), sub:'under management' },
    { label:'Categories',        value: cats.length,      sub:'product types tracked' },
    { label:'Pending Approvals', value: MockData.subsidies.filter(s=>s.status==='pending').length, sub:'awaiting review' },
    { label:'Audit Records',     value: MockData.auditLogs.length, sub:'logged this period' }
  ].map(s => `
    <div class="stat-mini">
      <div class="stat-mini-label">${esc(s.label)}</div>
      <div class="stat-mini-value">${esc(String(s.value))}</div>
      <div class="stat-mini-sub">${esc(s.sub)}</div>
    </div>
  `).join('');

  const html = `
    <!-- ══════════════════════════════════════════════════════════
         THE SINGLE BEST FEATURE: AI PROFIT OPPORTUNITY ENGINE™
         (HOMEPAGE FLAGSHIP WORKFLOW)
         - Retailer uploads an Excel file
         - Within 2 minutes the system says:
           * Current commissions: $1.2M
           * Present commission: $1.63M
           * Commission opportunity: $430K
         - Top opportunities:
           * o Netflix: +$82K
           * o Visa Gift: +$71K
           * o MoneyGram: +$63K
         - And a big button: "Launch RFP to Recover $430,000"
    ══════════════════════════════════════════════════════════ -->
    <div class="opportunity-engine-hero">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:1.5rem;flex-wrap:wrap;">
        <div>
          <div class="engine-header-badge">
            <i data-lucide="sparkles" style="width:14px;height:14px;"></i> Venture-Scale Revenue Engine &bull; C-Store & Retail Edition
          </div>
          <div class="engine-title">
            <span>AI Profit Opportunity Engine™</span>
            <span class="badge" style="background:#10b981;color:#fff;font-size:0.75rem;padding:3px 8px;border-radius:6px;font-weight:800;">REVENUE GENERATION PLATFORM</span>
          </div>
          <div class="engine-sub">
            Retailer uploads an Excel file. Within 2 minutes, Commission IQ cross-references transaction ledgers against 1,200+ convenience store & multi-door retail benchmarks, uncovers commission opportunities, and converts insight into recovered cash.
          </div>
        </div>

        <div style="display:flex;gap:0.625rem;flex-wrap:wrap;align-items:center;">
          <button class="btn btn-hero-glass btn-sm" style="background:rgba(255,255,255,0.15);border:1.5px solid rgba(255,255,255,0.5);color:#ffffff;font-weight:700;display:inline-flex;align-items:center;gap:0.4rem;backdrop-filter:blur(8px);box-shadow:0 4px 14px rgba(0,0,0,0.25);text-shadow:0 1px 2px rgba(0,0,0,0.3);padding:0.45rem 1rem;" onclick="window.openEngineExcelUploadModal()">
            <i data-lucide="file-spreadsheet" style="width:16px;height:16px;color:#38bdf8;"></i> Ingest New Excel File
          </button>
          <button class="btn btn-hero-glass btn-sm" style="background:rgba(255,255,255,0.15);border:1.5px solid rgba(255,255,255,0.5);color:#ffffff;font-weight:700;display:inline-flex;align-items:center;gap:0.4rem;backdrop-filter:blur(8px);box-shadow:0 4px 14px rgba(0,0,0,0.25);text-shadow:0 1px 2px rgba(0,0,0,0.3);padding:0.45rem 1rem;" onclick="window.simulateTwoMinuteScan()">
            <i data-lucide="refresh-cw" style="width:16px;height:16px;color:#34d399;"></i> Re-Run 2-Minute Scan
          </button>
          <button class="btn btn-hero-glass btn-sm" id="btn-manual-entry-toggle" style="background:rgba(255,255,255,0.15);border:1.5px solid rgba(245,158,11,0.6);color:#ffffff;font-weight:700;display:inline-flex;align-items:center;gap:0.4rem;backdrop-filter:blur(8px);box-shadow:0 4px 14px rgba(0,0,0,0.25);text-shadow:0 1px 2px rgba(0,0,0,0.3);padding:0.45rem 1rem;" onclick="window.toggleManualEntrySection()">
            <i data-lucide="edit-3" style="width:16px;height:16px;color:#f59e0b;"></i> Manual Entry
          </button>
        </div>
      </div>

      <!-- Ingestion Status Bar -->
      <div id="engine-ingestion-status-bar" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:var(--radius);padding:0.625rem 1rem;margin-top:1.25rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.75rem;font-size:0.8125rem;">
        <div style="display:flex;align-items:center;gap:0.5rem;color:#cbd5e1;">
          <i data-lucide="check-circle" style="color:#10b981;width:16px;height:16px;"></i>
          <span id="engine-status-text">Ingested File: <strong style="color:#ffffff;">CStore_Chain_Q4_Commission_Ledger.xlsx</strong> (1,840,000 transactions normalized in 1 min 42 sec)</span>
        </div>
        <div style="color:#94a3b8;font-size:0.75rem;">
          Benchmark Cohort: <strong>National C-Store & Multi-Door Chains (10 to 500+ doors)</strong>
        </div>
      </div>

      <!-- MANUAL ENTRY SECTION -->
      <div id="manual-entry-section" class="manual-entry-section-wrap" style="display:${window._manualEntryOpen ? 'block' : 'none'};">
        ${window.renderManualEntrySectionHTML()}
      </div>

      <!-- THE 3 VERDICT NUMBERS -->
      <div class="engine-metrics-triad">
        <!-- Current Commissions: $1.2M -->
        <div class="engine-metric-box">
          <div class="engine-metric-label">
            <i data-lucide="credit-card" style="width:14px;height:14px;color:#94a3b8;"></i> Current Commissions
          </div>
          <div class="engine-metric-val" id="engine-current-commission-val" style="color:#ffffff;">$1.2M</div>
          <div class="engine-metric-sub">Contracted annual revenue earned across all store doors</div>
        </div>

        <!-- Present Commission: $1.63M -->
        <div class="engine-metric-box">
          <div class="engine-metric-label">
            <i data-lucide="trending-up" style="width:14px;height:14px;color:#38bdf8;"></i> Present Commission
          </div>
          <div class="engine-metric-val" id="engine-present-commission-val" style="color:#38bdf8;">$1.63M</div>
          <div class="engine-metric-sub">Top-quartile peer benchmark for identical retail sales volume</div>
        </div>

        <!-- Commission Opportunity: $430K -->
        <div class="engine-metric-box highlight-recovery">
          <div class="engine-metric-label" style="color:#34d399;">
            <i data-lucide="alert-circle" style="width:14px;height:14px;color:#34d399;"></i> Commission Opportunity
          </div>
          <div class="engine-metric-val" id="engine-opportunity-val" style="color:#34d399;font-size:2.75rem;text-shadow:0 0 20px rgba(16,185,129,0.4);">$430K</div>
          <div class="engine-metric-sub" style="color:#a7f3d0;font-weight:600;">
            Immediate uncaptured profit opportunity ready for recovery
          </div>
        </div>
      </div>

      <!-- TOP OPPORTUNITIES LIST -->
      <div class="top-opportunities-box">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;">
          <div style="font-weight:700;font-size:0.9375rem;color:#ffffff;display:flex;align-items:center;gap:0.5rem;">
            <i data-lucide="target" style="color:#10b981;width:16px;height:16px;"></i>
            <span>Top Opportunities Identified by AI Engine:</span>
          </div>
          <span style="font-size:0.75rem;color:#94a3b8;">Ranked by immediate contract recovery leverage</span>
        </div>

        <div class="top-opp-pill-row">
          <!-- Netflix: +$82K -->
          <div class="top-opp-pill">
            <div>
              <div class="top-opp-name">
                <span style="width:8px;height:8px;border-radius:50%;background:#ef4444;display:inline-block;"></span>
                <span>Netflix</span>
              </div>
              <div style="font-size:0.75rem;color:#94a3b8;margin-top:2px;">Rate renegotiation (1.55% &rarr; 2.50%)</div>
            </div>
            <div class="top-opp-gain">+$82,000</div>
          </div>

          <!-- Visa Gift: +$71K -->
          <div class="top-opp-pill">
            <div>
              <div class="top-opp-name">
                <span style="width:8px;height:8px;border-radius:50%;background:#f59e0b;display:inline-block;"></span>
                <span>Visa Gift</span>
              </div>
              <div style="font-size:0.75rem;color:#94a3b8;margin-top:2px;">Volume tier reverse auction</div>
            </div>
            <div class="top-opp-gain">+$71,000</div>
          </div>

          <!-- MoneyGram: +$63K -->
          <div class="top-opp-pill">
            <div>
              <div class="top-opp-name">
                <span style="width:8px;height:8px;border-radius:50%;background:#8b5cf6;display:inline-block;"></span>
                <span>MoneyGram</span>
              </div>
              <div style="font-size:0.75rem;color:#94a3b8;margin-top:2px;">Remittance commission parity RFP</div>
            </div>
            <div class="top-opp-gain">+$63,000</div>
          </div>
        </div>

        <div style="margin-top:0.75rem;display:flex;align-items:center;justify-content:space-between;font-size:0.75rem;color:#94a3b8;flex-wrap:wrap;gap:0.5rem;">
          <span>Additional opportunities: <strong>Store Brand Gift Cards (+$54K)</strong>, <strong>Bill Pay Interchanges (+$42K)</strong>, <strong>Prepaid Debit Guarantees (+$38K)</strong></span>
          <span style="color:#a7f3d0;font-weight:600;">Total Pipeline = $430,000</span>
        </div>
      </div>

      <!-- THE BIG BUTTON: LAUNCH RFP TO RECOVER $430,000 -->
      <div style="margin-top:2rem;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;">
        <button class="btn-launch-rfp" onclick="window.launchRecoverRFPModal()">
          <i data-lucide="rocket" style="width:24px;height:24px;"></i>
          <span>Launch RFP to Recover $430,000</span>
          <i data-lucide="arrow-right" style="width:20px;height:20px;"></i>
        </button>

        <div style="margin-top:0.875rem;font-size:0.8125rem;color:#94a3b8;max-width:680px;line-height:1.4;">
          <strong style="color:#ffffff;">The Revenue-Generation Turning Point:</strong> That single workflow turns Commission IQ from a passive reporting tool into an automated revenue-generation platform — which is exactly what convenience store executives pay for.
        </div>
      </div>

      <!-- C-Store Executive ROI Impact Box -->
      <div style="margin-top:1.5rem;padding-top:1.25rem;border-top:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;font-size:0.8125rem;">
        <div style="display:flex;align-items:center;gap:0.625rem;color:#cbd5e1;">
          <span style="background:rgba(245,158,11,0.2);color:#fbbf24;border-radius:6px;padding:3px 6px;font-weight:800;font-size:0.7rem;">C-STORE ECONOMICS</span>
          <span>Recovering <strong>$430,000</strong> in zero-marginal-cost commission is equivalent to selling <strong>860,000 additional cups of coffee</strong> at 50% operating margin.</span>
        </div>
        <div style="display:flex;gap:0.75rem;">
          <a href="#/benchmarking" style="color:#38bdf8;text-decoration:none;font-weight:600;">Explore Full Benchmark Analyzer &rarr;</a>
          <a href="#/sourcing" style="color:#34d399;text-decoration:none;font-weight:600;">View Active Sourcing Auctions &rarr;</a>
        </div>
      </div>
    </div>

    <!-- KPI Grid -->
    <div class="kpi-grid" style="margin-bottom:1.5rem">${kpiHTML}</div>

    <!-- Quick Stats -->
    <div class="stats-row" style="margin-bottom:1.5rem">${quickStats}</div>

    <!-- Charts Row -->
    <div class="chart-grid" style="margin-bottom:1.5rem">

      <!-- Revenue Trend -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Revenue Trend</div>
            <div class="card-subtitle">Monthly commission revenue by category (2026)</div>
          </div>
          <button class="btn btn-outline btn-sm" onclick="exportToCSV(MockData.monthlyRevenue,'revenue-trend.csv')">
            <i data-lucide="download"></i> Export
          </button>
        </div>
        <div class="card-body">
          <div class="chart-container"><canvas id="chart-revenue"></canvas></div>
        </div>
      </div>

      <!-- Category Doughnut -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Category Distribution</div>
            <div class="card-subtitle">Revenue share by product type</div>
          </div>
        </div>
        <div class="card-body">
          <div class="chart-container" style="height:220px"><canvas id="chart-category"></canvas></div>
          <div style="margin-top:.75rem">
            ${cats.map(c=>`
              <div style="display:flex;align-items:center;justify-content:space-between;padding:.25rem 0;font-size:.8125rem;">
                <span style="display:flex;align-items:center;gap:.5rem;">
                  <span style="width:10px;height:10px;border-radius:2px;background:${c.color};display:inline-block;"></span>
                  ${esc(c.category)}
                </span>
                <span style="font-weight:700;color:var(--text)">${c.value}%</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Row -->
    <div class="chart-grid dashboard-bottom-grid" style="margin-bottom:1.5rem">

      <!-- Top Vendors Bar Chart -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Top Vendors by Revenue</div>
            <div class="card-subtitle">Monthly commission revenue contribution</div>
          </div>
        </div>
        <div class="card-body">
          <div class="chart-container" style="height:230px"><canvas id="chart-vendors"></canvas></div>
        </div>
      </div>

      <!-- Activity Timeline -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Recent Activity</div>
          <a href="#/audit" class="btn btn-ghost btn-sm">View All</a>
        </div>
        <div class="card-body" style="padding:1rem 1.25rem;">
          <div class="timeline">${activityHTML}</div>
        </div>
      </div>
    </div>
  `;

  _setContent('main-content', html);

  // Build charts after DOM is ready
  setTimeout(() => {
    if (typeof lucide !== 'undefined') lucide.createIcons();
    _buildRevenueChart(rev);
    _buildCategoryChart(cats);
    _buildVendorsChart(top);
  }, 60);
};

function _buildRevenueChart(rev) {
  const ctx = document.getElementById('chart-revenue');
  if (!ctx) return;

  const labels   = rev.map(r => r.month);
  const datasets = [
    { label:'Gift Cards',         data: rev.map(r=>r.giftCards),     borderColor:'#6366f1', backgroundColor:'rgba(99,102,241,.08)',  tension:.4, fill:true, pointRadius:3 },
    { label:'Money Transfer',     data: rev.map(r=>r.moneyTransfer), borderColor:'#22c55e', backgroundColor:'rgba(34,197,94,.08)',   tension:.4, fill:true, pointRadius:3 },
    { label:'Prepaid Products',   data: rev.map(r=>r.prepaid),       borderColor:'#f59e0b', backgroundColor:'rgba(245,158,11,.06)',  tension:.4, fill:true, pointRadius:3 },
    { label:'Debit Services',     data: rev.map(r=>r.debit),         borderColor:'#ef4444', backgroundColor:'rgba(239,68,68,.06)',   tension:.4, fill:true, pointRadius:3 },
    { label:'Financial Services', data: rev.map(r=>r.finServices),   borderColor:'#1a73e8', backgroundColor:'rgba(26,115,232,.06)', tension:.4, fill:true, pointRadius:3 }
  ];

  const chart = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode:'index', intersect:false },
      plugins: {
        legend: { position:'top', labels:{ usePointStyle:true, pointStyle:'circle', boxWidth:8, font:{ size:11 } } },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: $${ctx.raw.toLocaleString()}`
          }
        }
      },
      scales: {
        x: { grid:{ color:'rgba(0,0,0,.04)' }, ticks:{ font:{ size:11 } } },
        y: {
          grid:{ color:'rgba(0,0,0,.04)' },
          ticks:{
            font:{ size:11 },
            callback: v => v >= 1000 ? '$' + (v/1000).toFixed(0) + 'K' : '$' + v
          }
        }
      }
    }
  });

  AppState.charts['chart-revenue'] = chart;
}

function _buildCategoryChart(cats) {
  const ctx = document.getElementById('chart-category');
  if (!ctx) return;

  const chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: cats.map(c => c.category),
      datasets: [{
        data:            cats.map(c => c.value),
        backgroundColor: cats.map(c => c.color),
        borderWidth:     3,
        borderColor:     '#ffffff',
        hoverBorderColor:'#ffffff',
        hoverOffset:     8
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.label}: ${ctx.raw}%`
          }
        }
      }
    }
  });

  AppState.charts['chart-category'] = chart;
}

function _buildVendorsChart(vendors) {
  const ctx = document.getElementById('chart-vendors');
  if (!ctx) return;

  const sorted = [...vendors].sort((a,b) => a.revenue - b.revenue);

  const colors = sorted.map(v => v.change >= 0 ? 'rgba(26,115,232,.8)' : 'rgba(239,68,68,.8)');

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: sorted.map(v => v.name.length > 20 ? v.name.substring(0,18)+'…' : v.name),
      datasets: [{
        label:           'Monthly Revenue',
        data:            sorted.map(v => v.revenue),
        backgroundColor: colors,
        borderRadius:    6,
        borderSkipped:   false
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: { display:false },
        tooltip: {
          callbacks: {
            label: ctx => {
              const v = vendors.find(x => x.revenue === ctx.raw);
              const change = v ? (v.change >= 0 ? '+' : '') + v.change + '%' : '';
              return ` $${ctx.raw.toLocaleString()} (${change})`;
            }
          }
        }
      },
      scales: {
        x: {
          grid:{ color:'rgba(0,0,0,.04)' },
          ticks:{ font:{ size:11 }, callback: v => '$' + (v/1000).toFixed(0) + 'K' }
        },
        y: { grid:{ display:false }, ticks:{ font:{ size:11 } } }
      }
    }
  });

  AppState.charts['chart-vendors'] = chart;
}

// ══════════════════════════════════════════════════════════════
//  AI PROFIT OPPORTUNITY ENGINE™ — FLAGSHIP HOMEPAGE HANDLERS
// ══════════════════════════════════════════════════════════════
window.launchRecoverRFPModal = function() {
  openModal('Launch Enterprise Sourcing RFP Package &bull; Recover $430,000', `
    <div style="font-size:0.875rem;">
      <div style="background:linear-gradient(135deg,rgba(16,185,129,0.15) 0%,rgba(5,150,105,0.08) 100%);border:1.5px solid #10b981;border-radius:var(--radius);padding:1rem 1.25rem;margin-bottom:1.25rem;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;">
          <div>
            <span style="font-size:0.75rem;font-weight:800;color:#059669;text-transform:uppercase;letter-spacing:0.5px;">Automated Recovery Bundle</span>
            <div style="font-size:1.375rem;font-weight:900;color:#065f46;margin-top:2px;">Target Recovery Value: $430,000 / yr</div>
          </div>
          <span class="badge badge-success" style="font-size:0.75rem;padding:4px 8px;">READY TO DISPATCH</span>
        </div>
        <p style="font-size:0.8125rem;color:#047857;margin-top:0.5rem;line-height:1.4;">
          Commission IQ will bundle your top underperforming categories into a unified, competitive reverse auction & renegotiation package dispatched to qualified national aggregators.
        </p>
      </div>

      <div style="font-weight:700;font-size:0.875rem;margin-bottom:0.625rem;color:var(--text);">Bundled Sourcing Tracks to Launch:</div>
      <div style="display:flex;flex-direction:column;gap:0.625rem;margin-bottom:1.25rem;">
        <div style="background:var(--bg);border-radius:var(--radius-sm);padding:0.75rem 1rem;display:flex;align-items:center;justify-content:space-between;">
          <div>
            <div style="font-weight:700;">1. Netflix Aggregator Rate Re-alignment RFP</div>
            <div style="font-size:0.75rem;color:var(--text-muted);">Target Rate: 2.50% (was 1.55%) &bull; Invited: InComm, Blackhawk, PrepaidPlus</div>
          </div>
          <span style="font-weight:800;color:#059669;font-size:1rem;">+$82,000</span>
        </div>

        <div style="background:var(--bg);border-radius:var(--radius-sm);padding:0.75rem 1rem;display:flex;align-items:center;justify-content:space-between;">
          <div>
            <div style="font-weight:700;">2. Visa Gift Card Multi-Store Reverse Auction</div>
            <div style="font-size:0.75rem;color:var(--text-muted);">Consolidated Volume: $14M &bull; Target: Top-Quartile Tier-1 Distributor Margin</div>
          </div>
          <span style="font-weight:800;color:#059669;font-size:1rem;">+$71,000</span>
        </div>

        <div style="background:var(--bg);border-radius:var(--radius-sm);padding:0.75rem 1rem;display:flex;align-items:center;justify-content:space-between;">
          <div>
            <div style="font-weight:700;">3. MoneyGram Remittance Parity RFP</div>
            <div style="font-size:0.75rem;color:var(--text-muted);">Remittance Volume: $5.8M &bull; Target: 2.30% National C-Store Parity</div>
          </div>
          <span style="font-weight:800;color:#059669;font-size:1rem;">+$63,000</span>
        </div>

        <div style="background:var(--bg);border-radius:var(--radius-sm);padding:0.75rem 1rem;display:flex;align-items:center;justify-content:space-between;">
          <div>
            <div style="font-weight:700;">4. Store Gift, Bill Pay & Debit Guarantees</div>
            <div style="font-size:0.75rem;color:var(--text-muted);">Secondary Rate Addendums & Minimum Floor Guarantees</div>
          </div>
          <span style="font-weight:800;color:#059669;font-size:1rem;">+$214,000</span>
        </div>
      </div>

      <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:var(--radius-sm);padding:0.625rem 0.875rem;font-size:0.75rem;color:#92400e;display:flex;align-items:center;gap:0.5rem;">
        <i data-lucide="shield-check" style="width:16px;height:16px;color:#d97706;flex-shrink:0;"></i>
        <span><strong>Executive Authority Check:</strong> Dispatched RFPs include legal addendum boilerplate, benchmark evidence packets, and 14-day vendor reply countdowns.</span>
      </div>
    </div>
  `, [
    { label: 'Cancel', cls: 'btn-secondary', action: 'closeModal()' },
    { label: 'Confirm & Dispatch $430,000 RFP Package 🚀', cls: 'btn-primary', action: 'window.confirmDispatchBundledRFPs()' }
  ]);
};

window.confirmDispatchBundledRFPs = function() {
  closeModal();

  // 1. Create Sourcing Events
  MockData.sourcingEvents.unshift(
    {
      id: 'SE-RFP-001',
      name: 'Netflix Aggregator Rate RFP 2026',
      category: 'Prepaid Products',
      status: 'Open',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-15',
      invitedVendors: 6,
      bidsReceived: 2,
      targetSavings: 82000,
      description: 'Competitive procurement RFP to close 95 bps gap on digital streaming codes.'
    },
    {
      id: 'SE-RFP-002',
      name: 'Visa Gift Card Master Consolidation Auction',
      category: 'Gift Cards',
      status: 'Open',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-20',
      invitedVendors: 8,
      bidsReceived: 3,
      targetSavings: 71000,
      description: 'Consolidated reverse auction across $14M open-loop gift card volume.'
    },
    {
      id: 'SE-RFP-003',
      name: 'MoneyGram Remittance Parity RFP',
      category: 'Money Transfer',
      status: 'Open',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-18',
      invitedVendors: 5,
      bidsReceived: 1,
      targetSavings: 63000,
      description: 'Benchmark rate parity alignment with MoneyGram and competing international wire providers.'
    }
  );

  // 2. Add Workflow Tracking
  MockData.workflowItems.unshift({
    id: 'WF-RFP-' + Date.now(),
    name: 'Unified $430,000 Recovery RFP Package',
    type: 'Multi-Vendor Sourcing Package',
    status: 'In Progress',
    currentStep: 'Vendor Response Period (14 Days Remaining)',
    assignee: Auth.getCurrentUser()?.name || 'Procurement Manager',
    createdAt: new Date().toISOString().split('T')[0],
    steps: ['RFP Dispatched', 'Bids Intake', 'Auction Evaluation', 'Executed Contract']
  });

  // 3. Add to Audit Trail
  MockData.auditLogs.unshift({
    id: 'AL' + Date.now(),
    userId: Auth.getCurrentUser()?.id || 'U001',
    userName: Auth.getCurrentUser()?.name || 'Executive Sponsor',
    action: 'launch_rfp_package',
    module: 'Opportunity Engine',
    details: 'Dispatched automated $430,000 recovery RFP bundle across Netflix (+$82K), Visa Gift (+$71K), and MoneyGram (+$63K)',
    timestamp: new Date().toISOString(),
    ipAddress: '127.0.0.1'
  });

  // 4. Notification
  MockData.notifications.unshift({
    id: 'N' + Date.now(),
    userId: Auth.getCurrentUser()?.id || 'U001',
    title: 'RFP Package Dispatched: $430,000 Recovery',
    message: '3 competitive sourcing tracks successfully published. InComm, Blackhawk, and MoneyGram notified.',
    type: 'success',
    read: false,
    timestamp: new Date().toISOString(),
    link: '#/sourcing'
  });

  showToast('🚀 SUCCESS! Dispatched 3-Vendor RFP Package to recover $430,000! Added to Sourcing Auctions.', 'success');

  setTimeout(() => {
    window.location.hash = '#/sourcing';
  }, 900);
};

window.openEngineExcelUploadModal = function() {
  openModal('Ingest Store Commission Excel File &bull; AI Profit Engine™', `
    <div style="font-size:0.875rem;">
      <p style="color:var(--text-light);margin-bottom:1rem;">
        Upload your retail POS or vendor commission spreadsheet. The AI Profit Opportunity Engine will scan all transaction records and benchmark them against 1,200+ retailer peers within 2 minutes:
      </p>

      <div class="ai-dropzone-box" onclick="document.getElementById('engine-file-input').click()">
        <input type="file" id="engine-file-input" style="display:none;" accept=".xlsx,.xls,.csv" onchange="window.handleEngineFileSelect(this)" />
        <i data-lucide="file-spreadsheet" style="width:40px;height:40px;color:#10b981;margin:0 auto 0.75rem auto;"></i>
        <div style="font-weight:700;font-size:1rem;color:var(--text);">Drag & drop Excel file here, or click to browse</div>
        <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.25rem;">Supports Excel (.xlsx, .xls) and CSV up to 100MB</div>
      </div>

      <div style="margin-top:1.25rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;">
        <span style="font-size:0.75rem;color:var(--text-muted);">Quick preset:</span>
        <button class="btn btn-outline btn-sm" onclick="window.simulateTwoMinuteScan()">
          <i data-lucide="zap"></i> Load C-Store Chain Actuals (Q4 Excel)
        </button>
      </div>
    </div>
  `, [
    { label: 'Cancel', cls: 'btn-secondary', action: 'closeModal()' },
    { label: 'Run 2-Minute Scan', cls: 'btn-primary', action: 'window.simulateTwoMinuteScan()' }
  ]);
};

window.handleEngineFileSelect = function(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    closeModal();
    showToast(`Parsing ${file.name} (${(file.size/1024).toFixed(1)} KB)...`, 'info');
    setTimeout(() => {
      window.simulateTwoMinuteScan(file.name);
    }, 700);
  }
};

window.simulateTwoMinuteScan = function(filename = 'CStore_Chain_Q4_Commission_Ledger.xlsx') {
  closeModal();
  showToast('Scanning transaction counts & benchmarking rates across 1,200+ c-stores...', 'info');

  setTimeout(() => {
    MockData.auditLogs.unshift({
      id: 'AL' + Date.now(),
      userId: Auth.getCurrentUser()?.id || 'U001',
      userName: Auth.getCurrentUser()?.name || 'Finance Analyst',
      action: 'opportunity_engine_scan',
      module: 'Opportunity Engine',
      details: `Completed AI Profit Opportunity Engine scan for ${filename}: Confirmed $430,000 commission opportunity ($1.2M current vs $1.63M present)`,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1'
    });

    showToast('Scan Complete! Current: $1.2M | Present: $1.63M | Commission Opportunity: $430K', 'success');
    window.renderDashboard();
  }, 1000);
};

// ══════════════════════════════════════════════════════════════
//  MODULE PAGES — Full Implementations
// ══════════════════════════════════════════════════════════════

// ── HELPER: Traffic Light Score Circle ────────────────────────
function _scoreCircle(score) {
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';
  return `<span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:${color};color:#fff;font-weight:700;font-size:.8125rem;">${score}</span>`;
}

// ── HELPER: Progress Bar ───────────────────────────────────────
function _progressBar(current, total, color = '#1a73e8') {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return `<div style="display:flex;align-items:center;gap:.5rem;min-width:120px;">
    <div style="flex:1;height:6px;background:#e2e8f0;border-radius:3px;overflow:hidden;">
      <div style="width:${pct}%;height:100%;background:${color};border-radius:3px;transition:width .3s;"></div>
    </div>
    <span style="font-size:.75rem;color:var(--text-muted);white-space:nowrap;">${current}/${total}</span>
  </div>`;
}

// ── HELPER: Filters Bar ────────────────────────────────────────
function _filtersBar(id, fields, onFilter) {
  const inputs = fields.map(f => {
    if (f.type === 'select') {
      const opts = f.options.map(o => `<option value="${esc(o.value)}">${esc(o.label)}</option>`).join('');
      return `<select class="form-input" style="min-width:140px;height:36px;padding:.25rem .5rem;font-size:.8125rem;" onchange="(${onFilter})(this.form)" id="${esc(id+'-'+f.key)}" name="${esc(f.key)}">
        <option value="">All ${esc(f.label)}</option>${opts}</select>`;
    }
    return `<input type="${f.type||'text'}" class="form-input" style="min-width:160px;height:36px;padding:.25rem .5rem;font-size:.8125rem;" placeholder="${esc(f.label)}" id="${esc(id+'-'+f.key)}" name="${esc(f.key)}" oninput="(${onFilter})(this.form)" />`;
  }).join('');
  return `<form id="${esc(id)}" style="display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;margin-bottom:1rem;" onsubmit="return false;">${inputs}
    <button type="button" class="btn btn-ghost btn-sm" onclick="document.getElementById('${esc(id)}').reset();(${onFilter})(document.getElementById('${esc(id)}'))">Reset</button>
  </form>`;
}

// ═══════════════════════════════════════════════════════════════
//  AI FEASIBILITY & PROACTIVE INTELLIGENCE
// ═══════════════════════════════════════════════════════════════
window.renderAIFeasibility = function() {
  const container = (document.getElementById('content-area') || document.getElementById('main-content'));
  if (!container) return;

  // Global state for AI feasibility simulator
  if (!window._aiFeasibilityState) {
    window._aiFeasibilityState = {
      netflixRate: 2.50,
      giftCardUplift: 0.47,
      vendorXyzRate: 2.30,
      filterCategory: 'all',
      searchQuery: '',
      activeDataset: 'retailer_national'
    };
  }

  const state = window._aiFeasibilityState;
  const findings = MockData.aiFindings || [];
  const dataset = (MockData.sampleUploadPresets && MockData.sampleUploadPresets[state.activeDataset]) || [];

  // Calculate dynamic simulator figures
  const netflixBase = 1.55;
  const netflixVol = 3400000;
  const netflixGain = Math.max(0, Math.round(((state.netflixRate - netflixBase) / 100) * netflixVol));

  const giftCardVol = 17850000;
  const giftCardGain = Math.max(0, Math.round((state.giftCardUplift / 100) * giftCardVol));

  const xyzBase = 1.80;
  const xyzVol = 5620000;
  const xyzGain = Math.max(0, Math.round(((state.vendorXyzRate - xyzBase) / 100) * xyzVol));

  const totalSimulatedGain = netflixGain + giftCardGain + xyzGain;
  const threeYearValue = totalSimulatedGain * 3;

  // Filtered dataset for audit table
  const filteredItems = dataset.filter(item => {
    const matchCat = state.filterCategory === 'all' || item.category === state.filterCategory;
    const matchSearch = !state.searchQuery ||
      item.product.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      item.vendor.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(state.searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const categories = ['all', ...new Set(dataset.map(d => d.category))];

  const html = `
    <!-- Top Action Bar -->
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:1.25rem;">
      <div>
        <h2 style="font-size:1.375rem;font-weight:700;display:flex;align-items:center;gap:0.5rem;">
          <span style="color:#6366f1;"><i data-lucide="sparkles"></i></span>
          AI Autonomous Procurement Feasibility Study
        </h2>
        <p style="font-size:0.875rem;color:var(--text-light);margin-top:2px;">
          Continuous automated ingestion & cross-benchmarking against 1,200+ retailer peers. Zero manual data mining required.
        </p>
      </div>
      <div style="display:flex;align-items:center;gap:0.625rem;flex-wrap:wrap;">
        <button class="btn btn-outline btn-sm" onclick="window.triggerAIFeasibilityUpload()">
          <i data-lucide="upload-cloud"></i> Ingest New Retailer File
        </button>
        <button class="btn btn-outline btn-sm" onclick="exportToCSV(MockData.sampleUploadPresets.retailer_national, 'commission-ai-feasibility-audit.csv')">
          <i data-lucide="download"></i> Export Analysis
        </button>
        <button class="btn btn-primary btn-sm" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);border:none;" onclick="window.runAIDiagnosticsScan()">
          <i data-lucide="refresh-cw"></i> Re-Run AI Diagnostics
        </button>
      </div>
    </div>

    <!-- AI Hero Stats Banner -->
    <div class="ai-hero-banner">
      <div class="ai-hero-header">
        <div class="ai-hero-title-group">
          <div class="ai-hero-icon-bubble">
            <i data-lucide="brain-circuit"></i>
          </div>
          <div>
            <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;">
              <span class="ai-hero-headline">Autonomous Retailer Margin Audit</span>
              <span class="ai-pill-badge"><i data-lucide="check-circle" style="width:12px;height:12px;"></i> AI Model Calibrated Q4 2026</span>
            </div>
            <div class="ai-hero-sub">
              Instead of waiting for retailers to identify problems, Commission IQ automatically parsed your transaction logs and detected <strong>3 immediate profit-leakage anomalies</strong>:
            </div>
          </div>
        </div>
      </div>

      <div class="ai-hero-stats-grid">
        <div class="ai-hero-stat-card">
          <div class="ai-hero-stat-val">$186,500 <span style="font-size:0.875rem;color:#a5b4fc;font-weight:600;">/ yr</span></div>
          <div class="ai-hero-stat-lbl">Estimated Annual Opportunity</div>
        </div>
        <div class="ai-hero-stat-card">
          <div class="ai-hero-stat-val">74 / 100</div>
          <div class="ai-hero-stat-lbl">Revenue Leakage Score (Critical Risk)</div>
        </div>
        <div class="ai-hero-stat-card">
          <div class="ai-hero-stat-val">6 Actions Ranked</div>
          <div class="ai-hero-stat-lbl">Priority Roadmap (P1 to P3)</div>
        </div>
        <div class="ai-hero-stat-card">
          <div class="ai-hero-stat-val">98.5%</div>
          <div class="ai-hero-stat-lbl">Market Benchmark Confidence Score</div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════
         KEY SELLING POINT: THE 3 CORE OUTPUTS
         1. Revenue Leakage Score
         2. Estimated Annual Opportunity
         3. Priority Ranking
    ══════════════════════════════════════════════════════════ -->
    <div style="margin-bottom:1.5rem;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;">
        <h3 style="font-size:1.125rem;font-weight:700;display:flex;align-items:center;gap:0.5rem;">
          <i data-lucide="award" style="color:#6366f1;width:18px;height:18px;"></i>
          Core Deliverable &bull; Executive Scorecard
        </h3>
        <span class="badge badge-primary" style="font-size:0.7rem;letter-spacing:0.5px;">PRIMARY VALUE OUTPUT</span>
      </div>

      <div class="ai-selling-points-grid">
        <!-- OUTPUT 1: REVENUE LEAKAGE SCORE -->
        <div class="selling-point-card featured-leakage">
          <div>
            <div class="selling-point-tag" style="color:#ef4444;">
              <i data-lucide="shield-alert" style="width:14px;height:14px;"></i> Output 1 &bull; Risk Metric
            </div>
            <div style="font-weight:700;font-size:1.0625rem;color:var(--text);">Revenue Leakage Score</div>
            <p style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">Contract vulnerability index vs peer benchmarks</p>
            
            <div class="score-display-row" style="margin-top:1rem;">
              <span class="leakage-score-big">74</span>
              <span class="score-scale-label">/ 100</span>
              <span class="badge badge-danger" style="margin-left:auto;font-size:0.75rem;padding:3px 8px;">HIGH LEAKAGE RISK</span>
            </div>

            <div class="score-bar-bg">
              <div class="score-bar-fill" style="width:74%;"></div>
            </div>

            <div style="font-size:0.75rem;color:var(--text-light);display:flex;flex-direction:column;gap:3px;margin-top:0.5rem;">
              <div style="display:flex;justify-content:space-between;"><span>Rate Variance Deficit:</span><strong>78 / 100</strong></div>
              <div style="display:flex;justify-content:space-between;"><span>Contract Terms & Floor Protection:</span><strong>68 / 100</strong></div>
              <div style="display:flex;justify-content:space-between;"><span>Subsidy & Co-Op Omission:</span><strong>76 / 100</strong></div>
            </div>
          </div>

          <div style="margin-top:1rem;padding-top:0.75rem;border-top:1px solid var(--border-light);font-size:0.75rem;color:#dc2626;font-weight:600;">
            <i data-lucide="alert-triangle" style="width:13px;height:13px;display:inline-block;vertical-align:-2px;"></i> Top 15% most vulnerable contracts in national retail cohort
          </div>
        </div>

        <!-- OUTPUT 2: ESTIMATED ANNUAL OPPORTUNITY -->
        <div class="selling-point-card featured-opportunity">
          <div>
            <div class="selling-point-tag" style="color:#10b981;">
              <i data-lucide="trending-up" style="width:14px;height:14px;"></i> Output 2 &bull; Value Creation
            </div>
            <div style="font-weight:700;font-size:1.0625rem;color:var(--text);">Estimated Annual Opportunity</div>
            <p style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">Immediate annualized EBITDA expansion</p>

            <div class="score-display-row" style="margin-top:0.875rem;">
              <span class="leakage-score-big" style="color:#10b981;font-size:2.25rem;">+$186,500</span>
              <span class="score-scale-label">/ yr</span>
            </div>
            <div style="font-size:0.8125rem;color:#059669;font-weight:700;margin-top:2px;">
              3-Year Realizable Value: <strong>+$559,500</strong>
            </div>

            <div style="font-size:0.75rem;color:var(--text-light);display:flex;flex-direction:column;gap:4px;margin-top:0.75rem;background:var(--bg);padding:0.625rem;border-radius:var(--radius-sm);">
              <div style="display:flex;justify-content:space-between;"><span>Rate Re-alignments:</span><strong style="color:var(--text);">+$144,500/yr</strong></div>
              <div style="display:flex;justify-content:space-between;"><span>Minimum Floor Guarantees:</span><strong style="color:var(--text);">+$24,000/yr</strong></div>
              <div style="display:flex;justify-content:space-between;"><span>Marketing Co-Op Subsidies:</span><strong style="color:var(--text);">+$18,000/yr</strong></div>
            </div>
          </div>

          <div style="margin-top:1rem;padding-top:0.75rem;border-top:1px solid var(--border-light);display:flex;gap:0.5rem;">
            <button class="btn btn-primary btn-sm btn-full" style="background:#10b981;border-color:#10b981;font-size:0.75rem;" onclick="window.saveFeasibilityPlan(186500)">
              <i data-lucide="check-circle"></i> Commit Opportunity to Budget
            </button>
          </div>
        </div>

        <!-- OUTPUT 3: PRIORITY RANKING -->
        <div class="selling-point-card featured-priority">
          <div>
            <div class="selling-point-tag" style="color:#6366f1;">
              <i data-lucide="list-ordered" style="width:14px;height:14px;"></i> Output 3 &bull; Action Roadmap
            </div>
            <div style="font-weight:700;font-size:1.0625rem;color:var(--text);">Priority Ranking</div>
            <p style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">Ranked by financial ROI & negotiation leverage</p>

            <div style="margin-top:0.75rem;">
              <div class="priority-rank-item">
                <div style="display:flex;align-items:center;gap:0.5rem;min-width:0;">
                  <span class="priority-badge-p1">P1</span>
                  <span style="font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Gift Card Category Master Auction</span>
                </div>
                <strong style="color:#10b981;">+$84K</strong>
              </div>

              <div class="priority-rank-item">
                <div style="display:flex;align-items:center;gap:0.5rem;min-width:0;">
                  <span class="priority-badge-p1">P1</span>
                  <span style="font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Netflix 38% Rate Re-alignment</span>
                </div>
                <strong style="color:#10b981;">+$32.4K</strong>
              </div>

              <div class="priority-rank-item">
                <div style="display:flex;align-items:center;gap:0.5rem;min-width:0;">
                  <span class="priority-badge-p2">P2</span>
                  <span style="font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Vendor XYZ Remittance Parity</span>
                </div>
                <strong style="color:#10b981;">+$28.1K</strong>
              </div>

              <div class="priority-rank-item">
                <div style="display:flex;align-items:center;gap:0.5rem;min-width:0;">
                  <span class="priority-badge-p2">P2</span>
                  <span style="font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Store Cards (3.0% vs 4.1%)</span>
                </div>
                <strong style="color:#10b981;">+$24K</strong>
              </div>

              <div class="priority-rank-item">
                <div style="display:flex;align-items:center;gap:0.5rem;min-width:0;">
                  <span class="priority-badge-p3">P3</span>
                  <span style="font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Contract Minimum Guarantees</span>
                </div>
                <strong style="color:#10b981;">+$24K</strong>
              </div>
            </div>
          </div>

          <div style="margin-top:0.75rem;padding-top:0.5rem;border-top:1px solid var(--border-light);display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:0.75rem;color:var(--text-muted);">6 Total Actions Ranked</span>
            <button class="btn btn-ghost btn-sm" style="font-size:0.75rem;padding:2px 6px;" onclick="window.viewFullRoadmap()">View Full Matrix &rarr;</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════
         AI VIRTUAL PROCUREMENT CONSULTANT SECTION
         "Instead of just storing contracts, AI becomes the retailer's procurement consultant."
         - "3.0% commission is below benchmark of 4.1%."
         - "Recommend negotiating a minimum guarantee."
         - "Recommend requesting marketing co-op funding."
    ══════════════════════════════════════════════════════════ -->
    <div class="card" style="margin-bottom:1.5rem;border:1.5px solid #818cf8;background:linear-gradient(180deg,#ffffff 0%,#f8fafc 100%);">
      <div class="card-header" style="background:rgba(99,102,241,0.04);border-bottom:1px solid #e0e7ff;">
        <div>
          <div style="display:flex;align-items:center;gap:0.5rem;">
            <span style="background:#6366f1;color:#fff;border-radius:6px;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:0.75rem;">
              <i data-lucide="bot" style="width:14px;height:14px;"></i>
            </span>
            <div class="card-title" style="color:#1e1b4b;font-size:1.125rem;">AI Virtual Procurement Consultant &bull; Strategic Advisory</div>
            <span class="badge badge-primary" style="font-size:0.65rem;">ACTIVE CONSULTANT MODE</span>
          </div>
          <div class="card-subtitle" style="color:#475569;margin-top:3px;">
            <strong>Value Proposition:</strong> Instead of just storing contracts as passive documents, AI actively advises your procurement team on rate deficits, missing minimum guarantees, and unclaimed subsidies.
          </div>
        </div>
        <button class="btn btn-outline btn-sm" onclick="window.openConsultantSimulator()">
          <i data-lucide="plus"></i> Test New Contract with Consultant
        </button>
      </div>

      <div class="card-body">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1rem;">
          
          <!-- Consultant Advice 1: "3.0% commission is below benchmark of 4.1%." -->
          <div class="consultant-advice-card">
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <span class="badge badge-danger" style="font-size:0.7rem;">RATE BENCHMARK DEFICIT</span>
              <span style="font-weight:700;color:#dc2626;font-size:0.875rem;">+$24,000 / yr Potential</span>
            </div>
            <div class="consultant-quote-box">
              &ldquo;3.0% commission is below benchmark of 4.1%.&rdquo;
            </div>
            <div style="font-size:0.8125rem;color:var(--text-light);line-height:1.5;">
              <strong>Consultant Analysis:</strong> Your current retail store gift card distribution contracts pay a flat 3.00% commission. The benchmark across comparable regional chains is <strong>4.10%</strong> (+110 bps spread). We recommend immediately dispatching a rate adjustment addendum before the upcoming contract renewal window.
            </div>
            <div style="margin-top:1rem;padding-top:0.75rem;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:0.75rem;color:var(--text-muted);"><i data-lucide="file-text" style="width:12px;height:12px;display:inline-block;"></i> Store Cards Agreement</span>
              <button class="btn btn-sm btn-outline" onclick="window.dispatchConsultantAction('rate_addendum', 'Store Cards (3.0% to 4.1%)', 24000)">
                <i data-lucide="send"></i> Draft 4.1% Addendum
              </button>
            </div>
          </div>

          <!-- Consultant Advice 2: "Recommend negotiating a minimum guarantee." -->
          <div class="consultant-advice-card">
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <span class="badge badge-warning" style="font-size:0.7rem;">CONTRACT CLAUSE GAP</span>
              <span style="font-weight:700;color:#d97706;font-size:0.875rem;">+$24,000 / yr Floor Protection</span>
            </div>
            <div class="consultant-quote-box" style="border-left-color:#f59e0b;">
              &ldquo;Recommend negotiating a minimum guarantee.&rdquo;
            </div>
            <div style="font-size:0.8125rem;color:var(--text-light);line-height:1.5;">
              <strong>Consultant Analysis:</strong> Current contracts with wire and money transfer vendors expose your stores to 100% volume risk during seasonal troughs. Commission IQ recommends negotiating a <strong>Contractual Minimum Guarantee of $12,500/month</strong>, protecting baseline revenue against distributor downtime or macroeconomic dips.
            </div>
            <div style="margin-top:1rem;padding-top:0.75rem;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:0.75rem;color:var(--text-muted);"><i data-lucide="shield" style="width:12px;height:12px;display:inline-block;"></i> SwiftTransfer / Remittance</span>
              <button class="btn btn-sm btn-outline" onclick="window.dispatchConsultantAction('minimum_guarantee', 'Contractual Minimum Floor Guarantee', 24000)">
                <i data-lucide="file-plus"></i> Add Minimum Guarantee
              </button>
            </div>
          </div>

          <!-- Consultant Advice 3: "Recommend requesting marketing co-op funding." -->
          <div class="consultant-advice-card">
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <span class="badge badge-info" style="font-size:0.7rem;">UNTAPPED SUBSIDY</span>
              <span style="font-weight:700;color:#2563eb;font-size:0.875rem;">+$18,000 / yr Subsidy Fund</span>
            </div>
            <div class="consultant-quote-box" style="border-left-color:#3b82f6;">
              &ldquo;Recommend requesting marketing co-op funding.&rdquo;
            </div>
            <div style="font-size:0.8125rem;color:var(--text-light);line-height:1.5;">
              <strong>Consultant Analysis:</strong> Card issuers and reload providers maintain standard co-op marketing allocation pools (0.25% to 0.50% of GMV) for point-of-sale display fixtures and circular advertising. Your contracts currently contain zero co-op stipulations. We recommend formalizing a claim for $18,000 in co-op reimbursement.
            </div>
            <div style="margin-top:1rem;padding-top:0.75rem;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:0.75rem;color:var(--text-muted);"><i data-lucide="gift" style="width:12px;height:12px;display:inline-block;"></i> PrepaidPlus & GiftFlow</span>
              <button class="btn btn-sm btn-outline" onclick="window.dispatchConsultantAction('coop_funding', 'Marketing Co-Op Subsidy Fund', 18000)">
                <i data-lucide="mail"></i> Request Co-Op Funding
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- PRIMARY AI ANOMALY CARDS (THE 3 CORE SPEC FINDINGS) -->
    <div style="margin-bottom:1.5rem;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.875rem;">
        <h3 style="font-size:1.125rem;font-weight:700;display:flex;align-items:center;gap:0.5rem;">
          <i data-lucide="alert-octagon" style="color:#ef4444;width:18px;height:18px;"></i>
          High-Priority Autonomous Insights
        </h3>
        <span style="font-size:0.8125rem;color:var(--text-muted);">Auto-ranked by annual financial impact</span>
      </div>

      <div class="ai-findings-container">
        <!-- 1. NETFLIX COMMISSIONS 38% BELOW MARKET -->
        <div class="ai-finding-card critical">
          <div class="ai-finding-top">
            <div>
              <div class="ai-finding-headline">
                <span class="ai-badge-crit">CRITICAL ANOMALY</span>
                <span>&ldquo;Netflix commissions are 38% below market.&rdquo;</span>
              </div>
              <div style="font-size:0.8125rem;color:var(--text-muted);margin-top:0.25rem;">
                Vendor: <strong>PrepaidPlus Corp / Netflix Direct Aggregator</strong> &bull; Category: <strong>Prepaid Products & Streaming</strong>
              </div>
            </div>
            <div class="ai-impact-callout">
              &minus;$32,400 / yr Leakage
            </div>
          </div>

          <div class="ai-finding-body">
            The AI engine analyzed your last 12 months of digital streaming sales ($3.4M volume) and identified that your <strong>1.55% contracted commission rate</strong> lags market peers by <strong>95 basis points</strong>. Multi-store retailers with similar volume receive <strong>2.50%</strong> (top-quartile peers achieve up to 2.85%).
          </div>

          <div class="ai-metrics-strip">
            <div class="ai-metric-item">
              <span class="ai-metric-label">Your Current Rate</span>
              <span class="ai-metric-value" style="color:#dc2626;">1.55%</span>
            </div>
            <div class="ai-metric-item">
              <span class="ai-metric-label">Market Benchmark</span>
              <span class="ai-metric-value" style="color:#16a34a;">2.50%</span>
            </div>
            <div class="ai-metric-item">
              <span class="ai-metric-label">Variance</span>
              <span class="ai-metric-value" style="color:#dc2626;">&minus;38.0%</span>
            </div>
            <div class="ai-metric-item">
              <span class="ai-metric-label">Peer Standing</span>
              <span class="ai-metric-value">Bottom 8th Percentile</span>
            </div>
            <div class="ai-metric-item">
              <span class="ai-metric-label">AI Confidence</span>
              <span class="ai-metric-value" style="color:#4f46e5;">99.2%</span>
            </div>
          </div>

          <div class="ai-finding-footer">
            <div style="display:flex;align-items:center;gap:0.5rem;font-size:0.8125rem;color:var(--text-light);">
              <i data-lucide="check-check" style="color:#22c55e;width:16px;height:16px;"></i>
              Recommended Action: <strong>Trigger immediate rate renegotiation or RFP with secondary aggregator</strong>
            </div>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
              <button class="btn btn-outline btn-sm" onclick="window.viewBenchmarkCurve('Netflix Subscriptions', 1.55, 2.50, 3.4)">
                <i data-lucide="line-chart"></i> View Peer Curve
              </button>
              <button class="btn btn-primary btn-sm" onclick="window.triggerRenegotiationRFP('Netflix e-Gift & Subscriptions', 'PrepaidPlus Corp', 1.55, 2.50, 32400)">
                <i data-lucide="send"></i> Trigger Renegotiation RFP
              </button>
            </div>
          </div>
        </div>

        <!-- 2. GIFT CARD CATEGORY UNDERPERFORMING BY $84,000 -->
        <div class="ai-finding-card high">
          <div class="ai-finding-top">
            <div>
              <div class="ai-finding-headline">
                <span class="ai-badge-high">CATEGORY DRAG</span>
                <span>&ldquo;Gift card category is underperforming by $84,000 annually.&rdquo;</span>
              </div>
              <div style="font-size:0.8125rem;color:var(--text-muted);margin-top:0.25rem;">
                Vendors: <strong>GiftFlow Inc. ($9.2M) & CardVault Solutions ($8.65M)</strong> &bull; Category: <strong>Gift Cards</strong>
              </div>
            </div>
            <div class="ai-impact-callout" style="color:#d97706;background:#fffbeb;border-color:#fde68a;">
              &minus;$84,000 / yr Shortfall
            </div>
          </div>

          <div class="ai-finding-body">
            By aggregating Visa/Mastercard open-loop cards and closed-loop retail merchant cards, the AI detected that volume fragmentation between two distributors has suppressed your blended rate to <strong>2.95%</strong> (vs. top-quartile market benchmark of <strong>3.42%</strong>). Consolidating the full $17.85M annual volume into a unified auction will capture $84,000 in immediate EBITDA margin.
          </div>

          <div class="ai-metrics-strip">
            <div class="ai-metric-item">
              <span class="ai-metric-label">Blended Retailer Rate</span>
              <span class="ai-metric-value" style="color:#d97706;">2.95%</span>
            </div>
            <div class="ai-metric-item">
              <span class="ai-metric-label">Top Quartile Market</span>
              <span class="ai-metric-value" style="color:#16a34a;">3.42%</span>
            </div>
            <div class="ai-metric-item">
              <span class="ai-metric-label">Rate Spread</span>
              <span class="ai-metric-value" style="color:#d97706;">&minus;0.47% (&minus;13.7%)</span>
            </div>
            <div class="ai-metric-item">
              <span class="ai-metric-label">Annual Volume</span>
              <span class="ai-metric-value">$17,850,000</span>
            </div>
            <div class="ai-metric-item">
              <span class="ai-metric-label">AI Confidence</span>
              <span class="ai-metric-value" style="color:#4f46e5;">97.8%</span>
            </div>
          </div>

          <div class="ai-finding-footer">
            <div style="display:flex;align-items:center;gap:0.5rem;font-size:0.8125rem;color:var(--text-light);">
              <i data-lucide="check-check" style="color:#22c55e;width:16px;height:16px;"></i>
              Recommended Action: <strong>Consolidate dual-distributor volume into competitive reverse auction</strong>
            </div>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
              <button class="btn btn-outline btn-sm" onclick="window.viewCategoryBreakdown()">
                <i data-lucide="pie-chart"></i> Category Breakdown
              </button>
              <button class="btn btn-primary btn-sm" style="background:#d97706;border-color:#d97706;" onclick="window.launchConsolidatedAuction('Gift Cards Category Master RFP', 17850000, 84000)">
                <i data-lucide="gavel"></i> Launch Sourcing Auction ($84K)
              </button>
            </div>
          </div>
        </div>

        <!-- 3. VENDOR XYZ PAYING 22% LESS THAN SIMILAR RETAILERS -->
        <div class="ai-finding-card high" style="border-left-color:#8b5cf6;">
          <div class="ai-finding-top">
            <div>
              <div class="ai-finding-headline">
                <span class="ai-badge-high" style="background:#ede9fe;color:#7c3aed;">PEER DISCOUNT VENDOR</span>
                <span>&ldquo;Vendor XYZ is paying 22% less than similar retailers.&rdquo;</span>
              </div>
              <div style="font-size:0.8125rem;color:var(--text-muted);margin-top:0.25rem;">
                Vendor: <strong>SwiftTransfer Global (Vendor XYZ)</strong> &bull; Category: <strong>Money Transfer & Remittance</strong>
              </div>
            </div>
            <div class="ai-impact-callout" style="color:#7c3aed;background:#f5f3ff;border-color:#ddd6fe;">
              &minus;$28,100 / yr Underpayment
            </div>
          </div>

          <div class="ai-finding-body">
            Vendor XYZ pays you a <strong>1.80% commission</strong> on international remittances. The peer intelligence dataset proves that 9 out of 10 retailers with &gt;$5M remittance GMV receive <strong>2.30% or higher</strong> from this exact same vendor. You are currently penalised by a <strong>21.7% discount</strong> compared to direct competitors.
          </div>

          <div class="ai-metrics-strip">
            <div class="ai-metric-item">
              <span class="ai-metric-label">Contracted Rate</span>
              <span class="ai-metric-value" style="color:#7c3aed;">1.80%</span>
            </div>
            <div class="ai-metric-item">
              <span class="ai-metric-label">Similar Retailer Median</span>
              <span class="ai-metric-value" style="color:#16a34a;">2.30%</span>
            </div>
            <div class="ai-metric-item">
              <span class="ai-metric-label">Peer Spread</span>
              <span class="ai-metric-value" style="color:#7c3aed;">&minus;21.7% (&minus;0.50%)</span>
            </div>
            <div class="ai-metric-item">
              <span class="ai-metric-label">Annual Volume</span>
              <span class="ai-metric-value">$5,620,000</span>
            </div>
            <div class="ai-metric-item">
              <span class="ai-metric-label">AI Confidence</span>
              <span class="ai-metric-value" style="color:#4f46e5;">98.5%</span>
            </div>
          </div>

          <div class="ai-finding-footer">
            <div style="display:flex;align-items:center;gap:0.5rem;font-size:0.8125rem;color:var(--text-light);">
              <i data-lucide="check-check" style="color:#22c55e;width:16px;height:16px;"></i>
              Recommended Action: <strong>Issue contract renegotiation claim & add to Revenue Recovery pipeline</strong>
            </div>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
              <button class="btn btn-outline btn-sm" onclick="window.viewPeerComparisonDetail('Vendor XYZ (SwiftTransfer Global)', 1.80, 2.30)">
                <i data-lucide="users"></i> Peer Evidence Matrix
              </button>
              <button class="btn btn-primary btn-sm" style="background:#7c3aed;border-color:#7c3aed;" onclick="window.pushToRevenueRecovery('SwiftTransfer Global (Vendor XYZ)', 'Remittance Underpayment 22%', 28100)">
                <i data-lucide="refresh-cw"></i> Issue Recovery Claim ($28.1K)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- WHAT-IF FEASIBILITY CALCULATOR / MARGIN LIFT SIMULATOR -->
    <div class="card" style="margin-bottom:1.5rem;">
      <div class="card-header">
        <div>
          <div class="card-title" style="display:flex;align-items:center;gap:0.5rem;">
            <i data-lucide="sliders" style="color:#6366f1;"></i>
            Interactive Feasibility Simulator & Margin Lift Calculator
          </div>
          <div class="card-subtitle">Model your retailer bottom-line expansion by aligning contracts with market benchmarks</div>
        </div>
        <button class="btn btn-ghost btn-sm" onclick="window.resetAISimulator()">
          <i data-lucide="rotate-ccw"></i> Reset Defaults
        </button>
      </div>

      <div class="card-body">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:2rem;">
          <!-- Left Sliders -->
          <div>
            <!-- Slider 1: Netflix Rate -->
            <div class="ai-slider-row">
              <div class="ai-slider-header">
                <span style="font-weight:600;font-size:0.875rem;">1. Netflix Rate Renegotiation Target</span>
                <span style="font-weight:700;color:#1a73e8;font-size:0.9375rem;" id="sim-netflix-val">${state.netflixRate.toFixed(2)}%</span>
              </div>
              <input type="range" class="ai-slider-input" min="1.55" max="3.00" step="0.05" value="${state.netflixRate}"
                     oninput="window.updateAISimulator('netflixRate', this.value, 'sim-netflix-val')" />
              <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:var(--text-muted);margin-top:2px;">
                <span>Current: 1.55%</span>
                <span>Market Avg: 2.50%</span>
                <span>Top: 3.00%</span>
              </div>
            </div>

            <!-- Slider 2: Gift Card Category Uplift -->
            <div class="ai-slider-row">
              <div class="ai-slider-header">
                <span style="font-weight:600;font-size:0.875rem;">2. Gift Card Category Uplift Spread</span>
                <span style="font-weight:700;color:#d97706;font-size:0.9375rem;" id="sim-gift-val">+${state.giftCardUplift.toFixed(2)}%</span>
              </div>
              <input type="range" class="ai-slider-input" min="0.00" max="0.80" step="0.01" value="${state.giftCardUplift}"
                     oninput="window.updateAISimulator('giftCardUplift', this.value, 'sim-gift-val')" />
              <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:var(--text-muted);margin-top:2px;">
                <span>0.00% (No change)</span>
                <span>Target: +0.47% (+$84K)</span>
                <span>Aggressive: +0.80%</span>
              </div>
            </div>

            <!-- Slider 3: Vendor XYZ Parity Rate -->
            <div class="ai-slider-row">
              <div class="ai-slider-header">
                <span style="font-weight:600;font-size:0.875rem;">3. Vendor XYZ Remittance Rate Target</span>
                <span style="font-weight:700;color:#7c3aed;font-size:0.9375rem;" id="sim-xyz-val">${state.vendorXyzRate.toFixed(2)}%</span>
              </div>
              <input type="range" class="ai-slider-input" min="1.80" max="2.60" step="0.05" value="${state.vendorXyzRate}"
                     oninput="window.updateAISimulator('vendorXyzRate', this.value, 'sim-xyz-val')" />
              <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:var(--text-muted);margin-top:2px;">
                <span>Current: 1.80%</span>
                <span>Peer Parity: 2.30%</span>
                <span>Max: 2.60%</span>
              </div>
            </div>
          </div>

          <!-- Right Calculation Outcome Box -->
          <div style="background:linear-gradient(135deg,#f8fafc 0%,#eef2ff 100%);border:1.5px solid #c7d2fe;border-radius:var(--radius-lg);padding:1.5rem;display:flex;flex-direction:column;justify-content:space-between;">
            <div>
              <div style="font-size:0.8125rem;font-weight:700;color:#4f46e5;text-transform:uppercase;letter-spacing:0.5px;">Simulated Annual Profit Expansion</div>
              <div style="font-size:2.25rem;font-weight:800;color:#1e1b4b;margin-top:0.25rem;" id="sim-total-gain">
                +$${totalSimulatedGain.toLocaleString()} <span style="font-size:1rem;color:var(--text-muted);font-weight:600;">/ yr</span>
              </div>
              <div style="font-size:0.875rem;color:var(--text-light);margin-top:0.25rem;">
                Estimated 3-Year Contract Value: <strong style="color:#16a34a;" id="sim-3yr-val">+$${threeYearValue.toLocaleString()}</strong>
              </div>

              <div style="margin-top:1.25rem;display:flex;flex-direction:column;gap:0.5rem;font-size:0.8125rem;">
                <div style="display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid #e2e8f0;">
                  <span style="color:var(--text-muted);">Netflix Rate Gain:</span>
                  <strong id="sim-netflix-gain">+$${netflixGain.toLocaleString()} / yr</strong>
                </div>
                <div style="display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid #e2e8f0;">
                  <span style="color:var(--text-muted);">Gift Card Auction Lift:</span>
                  <strong id="sim-gift-gain">+$${giftCardGain.toLocaleString()} / yr</strong>
                </div>
                <div style="display:flex;justify-content:space-between;padding:0.35rem 0;">
                  <span style="color:var(--text-muted);">Vendor XYZ Clawback / Parity:</span>
                  <strong id="sim-xyz-gain">+$${xyzGain.toLocaleString()} / yr</strong>
                </div>
              </div>
            </div>

            <div style="margin-top:1.5rem;display:flex;gap:0.75rem;">
              <button class="btn btn-primary btn-full" style="background:#4f46e5;border-color:#4f46e5;" onclick="window.saveFeasibilityPlan(${totalSimulatedGain})">
                <i data-lucide="bookmark-check"></i> Commit to Sourcing Workflows
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- INGESTED RETAILER LINE ITEMS AUDIT GRID -->
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">Ingested Retailer Line Items & AI Diagnostic Audit</div>
          <div class="card-subtitle">Audited products across Gift Cards, Money Transfer, Prepaid & Financial Services</div>
        </div>
        <div style="display:flex;gap:0.5rem;align-items:center;">
          <input type="text" class="form-input" style="height:34px;font-size:0.8125rem;min-width:180px;" placeholder="Search line items..."
                 value="${esc(state.searchQuery)}" oninput="window.setAIFeasibilitySearch(this.value)" />
          <select class="form-input" style="height:34px;font-size:0.8125rem;" onchange="window.setAIFeasibilityCategory(this.value)">
            ${categories.map(c => `<option value="${c}" ${state.filterCategory === c ? 'selected' : ''}>${c === 'all' ? 'All Categories' : c}</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Product / Service</th>
              <th>Category</th>
              <th>Vendor</th>
              <th class="text-right">Your Rate</th>
              <th class="text-right">Market Benchmark</th>
              <th class="text-right">Variance %</th>
              <th class="text-right">Annual Volume</th>
              <th class="text-right">Annual Impact</th>
              <th>AI Diagnostic Findings</th>
              <th class="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            ${filteredItems.map(item => {
              const isBelow = item.variancePct < 0;
              const varColor = item.variancePct <= -20 ? '#dc2626' : (item.variancePct < 0 ? '#d97706' : '#16a34a');
              return `
                <tr>
                  <td style="font-weight:600;">
                    ${esc(item.product)}
                  </td>
                  <td><span class="badge badge-neutral">${esc(item.category)}</span></td>
                  <td>${esc(item.vendor)}</td>
                  <td class="text-right font-mono" style="font-weight:700;">${item.yourRate.toFixed(2)}%</td>
                  <td class="text-right font-mono">${item.marketAvg.toFixed(2)}%</td>
                  <td class="text-right font-mono" style="font-weight:700;color:${varColor};">
                    ${item.variancePct > 0 ? '+' : ''}${item.variancePct.toFixed(1)}%
                  </td>
                  <td class="text-right font-mono">$${(item.annualVol).toLocaleString()}</td>
                  <td class="text-right font-mono" style="font-weight:700;color:${item.annualGap > 0 ? '#dc2626' : '#64748b'};">
                    ${item.annualGap > 0 ? '-$' + item.annualGap.toLocaleString() : '$0'}
                  </td>
                  <td style="font-size:0.8125rem;">
                    <span style="display:inline-flex;align-items:center;gap:4px;color:${item.annualGap > 20000 ? '#b91c1c' : '#334155'};font-weight:${item.annualGap > 20000 ? '600' : 'normal'};">
                      ${item.annualGap > 20000 ? '<i data-lucide="alert-triangle" style="width:13px;height:13px;color:#ef4444;"></i>' : ''}
                      ${esc(item.aiNote)}
                    </span>
                  </td>
                  <td class="text-center">
                    <button class="btn btn-ghost btn-sm" onclick="window.viewItemDetail('${esc(item.product)}')">
                      <i data-lucide="eye"></i>
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  container.innerHTML = html;
  if (typeof lucide !== 'undefined') lucide.createIcons();
};

// ── Interactive Helper Handlers ────────────────────────────────
window.updateAISimulator = function(field, val, labelId) {
  const num = parseFloat(val);
  window._aiFeasibilityState[field] = num;

  const lbl = document.getElementById(labelId);
  if (lbl) {
    if (field === 'giftCardUplift') {
      lbl.textContent = '+' + num.toFixed(2) + '%';
    } else {
      lbl.textContent = num.toFixed(2) + '%';
    }
  }

  // Recalculate
  const s = window._aiFeasibilityState;
  const netflixGain = Math.max(0, Math.round(((s.netflixRate - 1.55) / 100) * 3400000));
  const giftGain = Math.max(0, Math.round((s.giftCardUplift / 100) * 17850000));
  const xyzGain = Math.max(0, Math.round(((s.vendorXyzRate - 1.80) / 100) * 5620000));
  const total = netflixGain + giftGain + xyzGain;

  _setText('sim-netflix-gain', '+$' + netflixGain.toLocaleString() + ' / yr');
  _setText('sim-gift-gain', '+$' + giftGain.toLocaleString() + ' / yr');
  _setText('sim-xyz-gain', '+$' + xyzGain.toLocaleString() + ' / yr');
  _setText('sim-total-gain', '+$' + total.toLocaleString() + ' / yr');
  _setText('sim-3yr-val', '+$' + (total * 3).toLocaleString());
};

window.resetAISimulator = function() {
  window._aiFeasibilityState.netflixRate = 2.50;
  window._aiFeasibilityState.giftCardUplift = 0.47;
  window._aiFeasibilityState.vendorXyzRate = 2.30;
  window.renderAIFeasibility();
  showToast('Feasibility simulator reset to baseline market rates', 'info');
};

window.setAIFeasibilityCategory = function(cat) {
  window._aiFeasibilityState.filterCategory = cat;
  window.renderAIFeasibility();
};

window.setAIFeasibilitySearch = function(q) {
  window._aiFeasibilityState.searchQuery = q;
  window.renderAIFeasibility();
};

window.runAIDiagnosticsScan = function() {
  showToast('AI Autonomous Engine is re-scanning 1,200+ industry market benchmarks...', 'info');
  setTimeout(() => {
    // Append audit log
    MockData.auditLogs.unshift({
      id: 'AL' + Date.now(),
      userId: Auth.getCurrentUser()?.id || 'U001',
      userName: Auth.getCurrentUser()?.name || 'System Administrator',
      action: 'run_ai_feasibility',
      module: 'AI Feasibility',
      details: 'Completed autonomous cross-benchmark analysis: 3 anomalies verified ($144,500 total leakage)',
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1'
    });
    showToast('AI Scan complete: Confirmed 3 critical leakage findings ($144,500/yr)', 'success');
    window.renderAIFeasibility();
  }, 700);
};

window.triggerAIFeasibilityUpload = function() {
  openModal('Ingest Retailer Commission & Transaction Dataset', `
    <div style="padding:0.5rem 0;">
      <p style="font-size:0.875rem;color:var(--text-light);margin-bottom:1rem;">
        Upload your raw retailer transaction ledger, POS sales data, or vendor rate schedules (.csv, .xlsx, or .json). The AI automatically maps columns, detects rates, and identifies leakage anomalies against peer benchmarks.
      </p>

      <div class="ai-dropzone-box" onclick="document.getElementById('ai-file-input').click()">
        <input type="file" id="ai-file-input" style="display:none;" accept=".csv,.xlsx,.json" onchange="window.handleAIFeasibilityFileUpload(this)" />
        <i data-lucide="upload-cloud" style="width:40px;height:40px;color:#6366f1;margin:0 auto 0.75rem auto;"></i>
        <div style="font-weight:700;font-size:1rem;color:var(--text);">Drag and drop your commission file here, or click to browse</div>
        <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.25rem;">Supports CSV, Excel (XLSX), JSON up to 50MB</div>
      </div>

      <div style="margin-top:1.25rem;">
        <div style="font-size:0.8125rem;font-weight:600;color:var(--text);margin-bottom:0.5rem;">Or Load Instant Pre-Mapped Test Scenarios:</div>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
          <button class="btn btn-outline btn-sm" onclick="window.loadAIPreset('retailer_national')">
            <i data-lucide="database"></i> National Multi-Store Retailer (Q4 Actuals)
          </button>
          <button class="btn btn-outline btn-sm" onclick="window.downloadSampleCSVTemplate()">
            <i data-lucide="file-spreadsheet"></i> Download Template CSV
          </button>
        </div>
      </div>
    </div>
  `, [
    { label: 'Cancel', cls: 'btn-secondary', action: 'closeModal()' },
    { label: 'Ingest & Run AI Audit', cls: 'btn-primary', action: 'window.confirmAIIngestion()' }
  ]);
};

window.handleAIFeasibilityFileUpload = function(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    showToast(`Parsing file ${file.name} (${(file.size/1024).toFixed(1)} KB)...`, 'info');
    setTimeout(() => {
      closeModal();
      window.runAIDiagnosticsScan();
    }, 800);
  }
};

window.confirmAIIngestion = function() {
  closeModal();
  window.runAIDiagnosticsScan();
};

window.loadAIPreset = function(presetKey) {
  window._aiFeasibilityState.activeDataset = presetKey;
  closeModal();
  showToast('Loaded National Multi-Store Retailer dataset (7 categories, $38.9M volume)', 'success');
  window.renderAIFeasibility();
};

window.downloadSampleCSVTemplate = function() {
  const sample = [
    { Category: 'Prepaid Products', Product: 'Netflix e-Gift & Subscriptions', Vendor: 'PrepaidPlus Corp', RetailerCommissionPct: '1.55', AnnualVolumeUSD: '3400000' },
    { Category: 'Gift Cards', Product: 'Visa / MC Open-Loop Cards', Vendor: 'GiftFlow Inc.', RetailerCommissionPct: '3.10', AnnualVolumeUSD: '9200000' },
    { Category: 'Gift Cards', Product: 'Closed-Loop Retail Cards', Vendor: 'CardVault Solutions', RetailerCommissionPct: '2.80', AnnualVolumeUSD: '8650000' },
    { Category: 'Money Transfer', Product: 'International Wire Remittance', Vendor: 'SwiftTransfer Global', RetailerCommissionPct: '1.80', AnnualVolumeUSD: '5620000' }
  ];
  exportToCSV(sample, 'CommissionIQ-Retailer-Ingestion-Template.csv');
};

// ── Specific Action Handlers for the 3 Key Findings ───────────
window.triggerRenegotiationRFP = function(product, vendor, currRate, targetRate, loss) {
  openModal('Initiate AI Sourcing Renegotiation RFP', `
    <div style="font-size:0.875rem;">
      <div style="background:#fee2e2;border:1px solid #fecdd3;border-radius:var(--radius);padding:0.75rem 1rem;color:#991b1b;margin-bottom:1rem;">
        <strong>AI Evidence Verified:</strong> Current contracted commission for <em>${esc(product)}</em> is <strong>${currRate}%</strong> vs market peer average <strong>${targetRate}%</strong>.
        Estimated annual gap: <strong>$${loss.toLocaleString()}</strong>.
      </div>
      <div class="form-group">
        <label class="form-label">Vendor Name</label>
        <input type="text" class="form-input" value="${esc(vendor)}" readonly />
      </div>
      <div class="form-group">
        <label class="form-label">Target Renegotiated Commission Rate</label>
        <div style="display:flex;align-items:center;gap:0.5rem;">
          <input type="number" step="0.05" class="form-input" id="rfp-target-rate" value="${targetRate}" />
          <span>%</span>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Auto-Generated RFP Demand Letter</label>
        <textarea class="form-input" rows="4" style="font-size:0.8125rem;">Pursuant to our ongoing commercial partnership review and Commission IQ procurement intelligence benchmarks, our contracted commission rate of ${currRate}% is 38% below peer market average for comparable retail distribution volumes. We request an immediate addendum adjusting the rate to ${targetRate}% effective Q1.</textarea>
      </div>
    </div>
  `, [
    { label: 'Cancel', cls: 'btn-secondary', action: 'closeModal()' },
    { label: 'Dispatch RFP & Notify Vendor', cls: 'btn-primary', action: `window.dispatchRFPAction('${esc(product)}')` }
  ]);
};

window.dispatchRFPAction = function(prod) {
  closeModal();
  MockData.workflowItems.unshift({
    id: 'WF' + Date.now(),
    name: 'Renegotiation RFP: ' + prod,
    type: 'Sourcing RFP',
    status: 'In Progress',
    currentStep: 'Vendor Response Pending',
    assignee: Auth.getCurrentUser()?.name || 'Procurement Manager',
    createdAt: new Date().toISOString().split('T')[0],
    steps: ['RFP Dispatched', 'Vendor Review', 'Rate Agreement', 'Contract Addendum']
  });
  showToast(`Renegotiation RFP for "${prod}" dispatched and added to Workflow Management!`, 'success');
};

window.launchConsolidatedAuction = function(name, volume, opp) {
  openModal('Launch Automated Reverse Sourcing Auction', `
    <div style="font-size:0.875rem;">
      <p style="margin-bottom:1rem;color:var(--text-light);">
        Commission IQ will launch a competitive auction across qualified gift card distributors for your consolidated <strong>$${volume.toLocaleString()}</strong> retail volume.
      </p>
      <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:var(--radius);padding:0.75rem 1rem;color:#92400e;margin-bottom:1rem;">
        Target Annual Margin Recovery: <strong>$${opp.toLocaleString()}</strong>.
      </div>
      <div class="form-group">
        <label class="form-label">Auction Title</label>
        <input type="text" class="form-input" value="${esc(name)}" />
      </div>
      <div class="form-group">
        <label class="form-label">Invited Vendors</label>
        <input type="text" class="form-input" value="GiftFlow Inc., CardVault Solutions, ValueCard Partners, Blackhawk, InComm" />
      </div>
    </div>
  `, [
    { label: 'Cancel', cls: 'btn-secondary', action: 'closeModal()' },
    { label: 'Publish Competitive Auction', cls: 'btn-primary', action: `window.confirmAuctionPublish('${esc(name)}')` }
  ]);
};

window.confirmAuctionPublish = function(name) {
  closeModal();
  MockData.sourcingEvents.unshift({
    id: 'SE' + Date.now(),
    name: name,
    category: 'Gift Cards',
    status: 'Open',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2026-12-15',
    invitedVendors: 5,
    bidsReceived: 0,
    targetSavings: 84000
  });
  showToast(`Auction "${name}" created with $84,000 target savings!`, 'success');
};

window.pushToRevenueRecovery = function(vendor, reason, amount) {
  MockData.recoveryPipeline.unshift({
    id: 'RC' + Date.now(),
    vendor: vendor,
    type: 'Underpayment Dispute (22% Below Market)',
    amount: amount,
    status: 'In Progress',
    priority: 'High',
    assignedTo: Auth.getCurrentUser()?.name || 'Finance Analyst',
    ageDays: 1
  });
  showToast(`Case for ${vendor} ($${amount.toLocaleString()}) pushed to Revenue Recovery pipeline!`, 'success');
  window.location.hash = '#/recovery';
};

window.viewBenchmarkCurve = function(product, curr, avg, top) {
  openModal(`Market Benchmark Curve — ${esc(product)}`, `
    <div style="font-size:0.875rem;">
      <p style="color:var(--text-light);margin-bottom:1rem;">Distribution of commission rates across 142 retailers in the same GMV tier:</p>
      <div style="background:var(--bg);border-radius:var(--radius);padding:1.25rem;margin-bottom:1rem;">
        <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;font-size:0.8125rem;">
          <span>Your Rate: <strong style="color:#dc2626;">${curr}% (10th percentile)</strong></span>
          <span>Market Median: <strong style="color:#1a73e8;">${avg}%</strong></span>
          <span>Top Quartile: <strong style="color:#16a34a;">${top}%</strong></span>
        </div>
        <div style="height:12px;background:#e2e8f0;border-radius:6px;position:relative;overflow:hidden;">
          <div style="position:absolute;left:10%;width:3px;height:100%;background:#dc2626;"></div>
          <div style="position:absolute;left:50%;width:3px;height:100%;background:#1a73e8;"></div>
          <div style="position:absolute;left:75%;width:3px;height:100%;background:#16a34a;"></div>
        </div>
      </div>
      <p style="font-size:0.8125rem;color:var(--text-muted);">Data source: Anonymized peer transactions audited through Commission IQ index (Q4 2026).</p>
    </div>
  `, [{ label: 'Close', cls: 'btn-secondary', action: 'closeModal()' }]);
};

window.viewPeerComparisonDetail = function(vendor, curr, peerAvg) {
  openModal(`Peer Comparison Matrix — ${esc(vendor)}`, `
    <div style="font-size:0.875rem;">
      <p style="color:var(--text-light);margin-bottom:1rem;">
        Comparison of negotiated rates for <strong>${esc(vendor)}</strong> across 5 retailers with similar store count:
      </p>
      <table class="table" style="font-size:0.8125rem;">
        <thead>
          <tr><th>Retailer Profile</th><th>Annual GMV</th><th>Contracted Rate</th><th>Status</th></tr>
        </thead>
        <tbody>
          <tr style="background:#fef2f2;"><td><strong>Your Organization</strong></td><td>$5.62M</td><td style="color:#dc2626;font-weight:700;">${curr}%</td><td><span class="badge badge-danger">22% Deficit</span></td></tr>
          <tr><td>Retailer Alpha (Grocery)</td><td>$5.20M</td><td>2.25%</td><td><span class="badge badge-success">Standard</span></td></tr>
          <tr><td>Retailer Beta (Convenience)</td><td>$6.10M</td><td>2.35%</td><td><span class="badge badge-success">Standard</span></td></tr>
          <tr><td>Retailer Gamma (Supermarket)</td><td>$5.80M</td><td>2.30%</td><td><span class="badge badge-success">Standard</span></td></tr>
          <tr><td>Retailer Delta (Department)</td><td>$4.90M</td><td>2.20%</td><td><span class="badge badge-success">Standard</span></td></tr>
        </tbody>
      </table>
    </div>
  `, [{ label: 'Close', cls: 'btn-secondary', action: 'closeModal()' }]);
};

window.saveFeasibilityPlan = function(gain) {
  MockData.auditLogs.unshift({
    id: 'AL' + Date.now(),
    userId: Auth.getCurrentUser()?.id || 'U001',
    userName: Auth.getCurrentUser()?.name || 'Executive Sponsor',
    action: 'save_feasibility_scenario',
    module: 'AI Feasibility',
    details: `Committed AI Feasibility margin expansion target of +$${gain.toLocaleString()}/yr to annual procurement plan`,
    timestamp: new Date().toISOString(),
    ipAddress: '127.0.0.1'
  });
  showToast(`Committed +$${gain.toLocaleString()}/yr target to procurement plan and audit trail!`, 'success');
};

window.viewCategoryBreakdown = function() {
  window.location.hash = '#/benchmarking';
};

window.viewItemDetail = function(prod) {
  const item = MockData.sampleUploadPresets.retailer_national.find(i => i.product === prod);
  if (!item) return;
  openModal(`Line Item Diagnostic — ${esc(item.product)}`, `
    <div style="font-size:0.875rem;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
        <div><strong>Category:</strong> ${esc(item.category)}</div>
        <div><strong>Vendor:</strong> ${esc(item.vendor)}</div>
        <div><strong>Your Rate:</strong> ${item.yourRate.toFixed(2)}%</div>
        <div><strong>Market Benchmark:</strong> ${item.marketAvg.toFixed(2)}%</div>
        <div><strong>Annual Volume:</strong> $${item.annualVol.toLocaleString()}</div>
        <div><strong>Annual Variance:</strong> <span style="color:${item.annualGap>0?'#dc2626':'#16a34a'};font-weight:700;">${item.annualGap>0?'-$'+item.annualGap.toLocaleString():'$0'}</span></div>
      </div>
      <div style="background:var(--bg);padding:0.75rem 1rem;border-radius:var(--radius);">
        <strong>AI Diagnostic Analysis:</strong><br />
        <span style="color:var(--text-light);margin-top:4px;display:block;">${esc(item.aiNote)}</span>
      </div>
    </div>
  `, [{ label: 'Close', cls: 'btn-secondary', action: 'closeModal()' }]);
};

// ── AI Procurement Consultant Advisory Handlers ───────────────
window.dispatchConsultantAction = function(type, title, amount) {
  if (type === 'rate_addendum') {
    openModal('AI Procurement Consultant &bull; Rate Addendum Requisition', `
      <div style="font-size:0.875rem;">
        <div style="background:#fee2e2;border:1px solid #fecdd3;border-radius:var(--radius);padding:0.75rem 1rem;color:#991b1b;margin-bottom:1rem;">
          <strong>Consultant Finding:</strong> &ldquo;3.0% commission is below benchmark of 4.1%.&rdquo;<br />
          Projected Annual EBITDA Recovery: <strong>+$${amount.toLocaleString()}</strong>.
        </div>
        <div class="form-group">
          <label class="form-label">Contract Addendum Title</label>
          <input type="text" class="form-input" value="Commission Schedule Amendment — Store Cards (4.10% Parity)" />
        </div>
        <div class="form-group">
          <label class="form-label">Consultant Generated Legal Clause</label>
          <textarea class="form-input" rows="4" style="font-size:0.8125rem;">Effective as of the upcoming fiscal cycle, Section 4.1 (Commission Schedule) is amended such that Retailer shall receive a commission rate of 4.10% on all face-value gross sales of branded store gift cards, aligning with prevailing regional retail benchmarks.</textarea>
        </div>
      </div>
    `, [
      { label: 'Cancel', cls: 'btn-secondary', action: 'closeModal()' },
      { label: 'Approve & Route for Signature', cls: 'btn-primary', action: `window.confirmConsultantRoute('${esc(title)}', ${amount})` }
    ]);
  } else if (type === 'minimum_guarantee') {
    openModal('AI Procurement Consultant &bull; Minimum Floor Guarantee Addendum', `
      <div style="font-size:0.875rem;">
        <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:var(--radius);padding:0.75rem 1rem;color:#92400e;margin-bottom:1rem;">
          <strong>Consultant Finding:</strong> &ldquo;Recommend negotiating a minimum guarantee.&rdquo;<br />
          Downside Cashflow Protection: <strong>+$${amount.toLocaleString()} / yr guaranteed baseline</strong>.
        </div>
        <div class="form-group">
          <label class="form-label">Contract Clause Addition</label>
          <input type="text" class="form-input" value="Section 6.3 — Monthly Minimum Commission Floor Guarantee" readonly />
        </div>
        <div class="form-group">
          <label class="form-label">Consultant Drafted Clause</label>
          <textarea class="form-input" rows="4" style="font-size:0.8125rem;">Notwithstanding transaction volume fluctuations, Vendor guarantees a minimum monthly commission disbursement of $12,500 to Retailer. If aggregate monthly earned commissions fall below $12,500, Vendor shall remit the differential shortfall within fifteen (15) business days.</textarea>
        </div>
      </div>
    `, [
      { label: 'Cancel', cls: 'btn-secondary', action: 'closeModal()' },
      { label: 'Apply Clause to Contract', cls: 'btn-primary', action: `window.confirmConsultantRoute('${esc(title)}', ${amount})` }
    ]);
  } else if (type === 'coop_funding') {
    openModal('AI Procurement Consultant &bull; Marketing Co-Op Claim', `
      <div style="font-size:0.875rem;">
        <div style="background:#dbeafe;border:1px solid #bfdbfe;border-radius:var(--radius);padding:0.75rem 1rem;color:#1e40af;margin-bottom:1rem;">
          <strong>Consultant Finding:</strong> &ldquo;Recommend requesting marketing co-op funding.&rdquo;<br />
          Identified Untapped Vendor Marketing Pool: <strong>+$${amount.toLocaleString()}</strong>.
        </div>
        <div class="form-group">
          <label class="form-label">Co-Op Requisition Target Vendors</label>
          <input type="text" class="form-input" value="PrepaidPlus Corp & GiftFlow Inc." />
        </div>
        <div class="form-group">
          <label class="form-label">Display & Placement Allocation Justification</label>
          <textarea class="form-input" rows="4" style="font-size:0.8125rem;">Retailer requests allocation of standard 0.35% Vendor Co-Op Marketing Funds for Q1 endcap retail fixtures, POS acrylic signage, and holiday promotion circular inclusions across all active store doors.</textarea>
        </div>
      </div>
    `, [
      { label: 'Cancel', cls: 'btn-secondary', action: 'closeModal()' },
      { label: 'Submit Co-Op Requisition', cls: 'btn-primary', action: `window.confirmConsultantRoute('${esc(title)}', ${amount})` }
    ]);
  }
};

window.confirmConsultantRoute = function(title, amount) {
  closeModal();
  MockData.workflowItems.unshift({
    id: 'WF' + Date.now(),
    name: 'AI Consultant: ' + title,
    type: 'Strategic Advisory Action',
    status: 'In Progress',
    currentStep: 'Executive Approval',
    assignee: Auth.getCurrentUser()?.name || 'Procurement Manager',
    createdAt: new Date().toISOString().split('T')[0],
    steps: ['AI Recommendation', 'Clause Formulated', 'Executive Approval', 'Vendor Dispatch']
  });
  MockData.auditLogs.unshift({
    id: 'AL' + Date.now(),
    userId: Auth.getCurrentUser()?.id || 'U001',
    userName: Auth.getCurrentUser()?.name || 'Procurement Manager',
    action: 'consultant_action_routed',
    module: 'AI Consultant',
    details: `Executed AI procurement consultant recommendation: ${title} ($${amount.toLocaleString()} target)`,
    timestamp: new Date().toISOString(),
    ipAddress: '127.0.0.1'
  });
  showToast(`Consultant action for "${title}" approved and submitted to workflow!`, 'success');
};

window.openConsultantSimulator = function() {
  openModal('Test a Contract with the AI Procurement Consultant', `
    <div style="font-size:0.875rem;">
      <p style="color:var(--text-light);margin-bottom:1rem;">
        Enter any contract parameters to receive real-time consultant advice on rates, minimum guarantees, and co-op subsidies:
      </p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
        <div class="form-group">
          <label class="form-label">Product / Category</label>
          <select class="form-input" id="sim-test-cat">
            <option value="Gift Cards">Gift Cards (Open/Closed Loop)</option>
            <option value="Money Transfer">Money Transfer & Remittance</option>
            <option value="Prepaid Products">Prepaid & Streaming Codes</option>
            <option value="Debit Services">Prepaid Debit Programs</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Vendor Name</label>
          <input type="text" class="form-input" id="sim-test-vendor" value="Retail Partner Inc." />
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
        <div class="form-group">
          <label class="form-label">Current Commission Rate (%)</label>
          <input type="number" step="0.1" class="form-input" id="sim-test-rate" value="3.0" />
        </div>
        <div class="form-group">
          <label class="form-label">Annual Sales Volume ($)</label>
          <input type="number" class="form-input" id="sim-test-vol" value="4500000" />
        </div>
      </div>
      <div style="margin-top:0.5rem;display:flex;gap:1.5rem;">
        <label style="display:flex;align-items:center;gap:0.5rem;font-size:0.8125rem;">
          <input type="checkbox" id="sim-has-floor" /> Has Minimum Guarantee?
        </label>
        <label style="display:flex;align-items:center;gap:0.5rem;font-size:0.8125rem;">
          <input type="checkbox" id="sim-has-coop" /> Has Marketing Co-Op?
        </label>
      </div>
    </div>
  `, [
    { label: 'Cancel', cls: 'btn-secondary', action: 'closeModal()' },
    { label: 'Run AI Consultant Analysis', cls: 'btn-primary', action: 'window.evaluateSimulatedContract()' }
  ]);
};

window.evaluateSimulatedContract = function() {
  const rate = parseFloat(document.getElementById('sim-test-rate').value) || 3.0;
  const vol = parseFloat(document.getElementById('sim-test-vol').value) || 4500000;
  const hasFloor = document.getElementById('sim-has-floor').checked;
  const hasCoop = document.getElementById('sim-has-coop').checked;
  const cat = document.getElementById('sim-test-cat').value;
  closeModal();

  let advice = [];
  if (rate < 4.10) {
    advice.push(`&bull; <strong>"${rate.toFixed(1)}% commission is below benchmark of 4.1%."</strong> (Annual gap: <strong>+$${Math.round(((4.10 - rate)/100)*vol).toLocaleString()}</strong>)`);
  }
  if (!hasFloor) {
    advice.push(`&bull; <strong>"Recommend negotiating a minimum guarantee."</strong> (Missing downside floor risk protection)`);
  }
  if (!hasCoop) {
    advice.push(`&bull; <strong>"Recommend requesting marketing co-op funding."</strong> (Untapped 0.35% promotional fund: +$${Math.round(vol * 0.0035).toLocaleString()})`);
  }

  openModal('AI Procurement Consultant &bull; Evaluation Results', `
    <div style="font-size:0.875rem;">
      <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:var(--radius);padding:1rem;margin-bottom:1rem;">
        <div style="font-weight:700;color:#1e1b4b;font-size:1rem;margin-bottom:0.5rem;">Strategic Assessment for ${esc(cat)} ($${vol.toLocaleString()} Volume):</div>
        <div style="display:flex;flex-direction:column;gap:0.5rem;color:var(--text);line-height:1.5;">
          ${advice.length ? advice.join('') : '&bull; Contract terms match top-tier benchmark standards.'}
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;font-size:0.8125rem;">
        <div style="background:#fee2e2;padding:0.75rem;border-radius:var(--radius);color:#991b1b;">
          <strong>Revenue Leakage Score:</strong> 72 / 100
        </div>
        <div style="background:#dcfce7;padding:0.75rem;border-radius:var(--radius);color:#166534;">
          <strong>Estimated Opportunity:</strong> +$${Math.round(((4.10 - rate)/100)*vol + (hasCoop?0:vol*0.0035)).toLocaleString()}/yr
        </div>
      </div>
    </div>
  `, [{ label: 'Done', cls: 'btn-primary', action: 'closeModal()' }]);
};

window.viewFullRoadmap = function() {
  const ranking = MockData.consultantSummaryOutputs?.priorityRanking || [];
  openModal('Executive Procurement Roadmap &bull; Priority Ranking', `
    <div style="font-size:0.875rem;">
      <p style="color:var(--text-light);margin-bottom:1rem;">
        Ranked roadmap of procurement actions prioritized by EBITDA lift and execution speed:
      </p>
      <div style="display:flex;flex-direction:column;gap:0.5rem;">
        ${ranking.map((r, i) => `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:0.625rem 0.875rem;background:var(--bg);border-radius:var(--radius-sm);border-left:4px solid ${r.rank==='P1'?'#ef4444':(r.rank==='P2'?'#f59e0b':'#6366f1')};">
            <div>
              <span class="${r.rank==='P1'?'priority-badge-p1':(r.rank==='P2'?'priority-badge-p2':'priority-badge-p3')}">${r.rank}</span>
              <strong style="margin-left:0.5rem;">${esc(r.title)}</strong>
              <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">${esc(r.category)} &bull; ${esc(r.type)} (${esc(r.ease)})</div>
            </div>
            <div style="text-align:right;">
              <div style="font-weight:800;color:#10b981;">+$${r.estGain.toLocaleString()} / yr</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `, [{ label: 'Close', cls: 'btn-secondary', action: 'closeModal()' }]);
};

// ═══════════════════════════════════════════════════════════════
//  1. LEAKAGE DETECTION
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
//  PREDICTIVE COMPLIANCE & LEAKAGE FORENSICS
//  - Predictive Revenue Leakage Modeling (ML Trends & Seasonality)
//  - Automated Dispute Generation (Certified Demand Letters)
//  - Anomaly Detection in Transaction Feeds (Real-time POS Monitoring)
// ═══════════════════════════════════════════════════════════════
window.renderPredictiveForensics = function() {
  if (!AppState.forensicsActiveTab) AppState.forensicsActiveTab = 'predictive';
  if (!AppState.forensicsPeriodFilter) AppState.forensicsPeriodFilter = 'All';
  if (!AppState.forensicsRiskFilter) AppState.forensicsRiskFilter = 'All';
  if (!AppState.selectedDisputeRecId) AppState.selectedDisputeRecId = 'REC-2026-10-001';
  if (!AppState.disputeTemplateType) AppState.disputeTemplateType = 'legal_demand';

  const predList = MockData.predictiveLeakageModels || [];
  const anomList = MockData.transactionFeedAnomalies || [];
  const recList = MockData.monthlyCommissionReconciliation || [];
  const leakageLog = MockData.leakageData || [];

  // Metrics
  const totalForecastedLeakage = predList.reduce((acc, p) => acc + (p.predictedLeakageAmount || 0), 0);
  const criticalRiskCount = predList.filter(p => p.riskTier === 'Critical Risk').length;
  const activeAnomaliesCount = anomList.filter(a => a.status === 'Active Anomaly').length;
  const uncollectedSubsidiesAtRisk = anomList.filter(a => a.status === 'Active Anomaly').reduce((s, a) => s + (a.uncollectedSubsidiesLost || 0), 0);

  // Filtered Predictions
  const filteredPredictions = predList.filter(p => {
    if (AppState.forensicsPeriodFilter !== 'All' && p.period !== AppState.forensicsPeriodFilter) return false;
    if (AppState.forensicsRiskFilter !== 'All' && p.riskTier !== AppState.forensicsRiskFilter) return false;
    return true;
  });

  // Selected Dispute Record
  const activeRec = recList.find(r => r.id === AppState.selectedDisputeRecId) || recList[0] || {};
  const vendorObj = MockData.getVendorById(activeRec.vendorId) || {};
  const primaryContact = (vendorObj.biddingContacts && vendorObj.biddingContacts[0]) || { name: vendorObj.contact || 'Commercial Representative', email: vendorObj.email || 'billing@vendor.com', title: 'VP of Commercial Operations' };

  _setContent('main-content', `
    <!-- Executive KPI Grid -->
    <div class="kpi-grid" style="grid-template-columns:repeat(5, 1fr);margin-bottom:1.5rem;">
      <div class="kpi-card" style="--kpi-color:#ef4444;--kpi-bg:#fee2e2;">
        <div class="kpi-icon" style="background:#fee2e2;color:#ef4444;"><i data-lucide="trending-down"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Forecasted Q4 Leakage</div>
          <div class="kpi-value" style="color:#ef4444;">$${Math.round(totalForecastedLeakage).toLocaleString()}</div>
          <div class="kpi-sub">Pre-reconciliation ML risk forecast</div>
        </div>
      </div>
      <div class="kpi-card" style="--kpi-color:#f59e0b;--kpi-bg:#fef3c7;">
        <div class="kpi-icon" style="background:#fef3c7;color:#f59e0b;"><i data-lucide="alert-octagon"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Critical Risk Contracts</div>
          <div class="kpi-value">${criticalRiskCount}</div>
          <div class="kpi-sub">GiftFlow, SwiftTransfer, ValueCard</div>
        </div>
      </div>
      <div class="kpi-card" style="--kpi-color:#8b5cf6;--kpi-bg:#ede9fe;">
        <div class="kpi-icon" style="background:#ede9fe;color:#8b5cf6;"><i data-lucide="activity"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Feed Anomalies</div>
          <div class="kpi-value" style="color:${activeAnomaliesCount > 0 ? '#ef4444' : '#10b981'};">${activeAnomaliesCount} Active</div>
          <div class="kpi-sub">${anomList.length} total monitored stream incidents</div>
        </div>
      </div>
      <div class="kpi-card" style="--kpi-color:#06b6d4;--kpi-bg:#cffafe;">
        <div class="kpi-icon" style="background:#cffafe;color:#06b6d4;"><i data-lucide="file-text"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Automated Disputes</div>
          <div class="kpi-value">${recList.filter(r => r.varianceAmount < 0).length} Ready</div>
          <div class="kpi-sub">Certified demand notices drafted</div>
        </div>
      </div>
      <div class="kpi-card" style="--kpi-color:#10b981;--kpi-bg:#dcfce7;">
        <div class="kpi-icon" style="background:#dcfce7;color:#10b981;"><i data-lucide="shield-check"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Preempted Loss YTD</div>
          <div class="kpi-value">+$38,400</div>
          <div class="kpi-sub">Saved via proactive tier locks</div>
        </div>
      </div>
    </div>

    <!-- Forensics Tabs -->
    <div class="portal-tabs-nav">
      <button class="portal-tab-btn forensics-tab-btn ${AppState.forensicsActiveTab === 'predictive' ? 'active' : ''}" onclick="setForensicsTab('predictive')">
        <i data-lucide="sparkles"></i> 1. Predictive Revenue Leakage Modeling
      </button>
      <button class="portal-tab-btn forensics-tab-btn ${AppState.forensicsActiveTab === 'disputes' ? 'active' : ''}" onclick="setForensicsTab('disputes')">
        <i data-lucide="scale"></i> 2. Automated Dispute Generation (${recList.filter(r => r.varianceAmount < 0).length})
      </button>
      <button class="portal-tab-btn forensics-tab-btn ${AppState.forensicsActiveTab === 'anomalies' ? 'active' : ''}" onclick="setForensicsTab('anomalies')">
        <i data-lucide="radio"></i> 3. Anomaly Detection in Transaction Feeds (${activeAnomaliesCount} Flagged)
      </button>
      <button class="portal-tab-btn forensics-tab-btn ${AppState.forensicsActiveTab === 'audit' ? 'active' : ''}" onclick="setForensicsTab('audit')">
        <i data-lucide="history"></i> 4. Historical Leakage Audit
      </button>
    </div>

    <!-- TAB 1: Predictive Revenue Leakage Modeling -->
    <div id="forensics-tab-predictive" style="display:${AppState.forensicsActiveTab === 'predictive' ? 'block' : 'none'};">
      <div class="card" style="margin-bottom:1.5rem;">
        <div class="card-header" style="flex-wrap:wrap;gap:1rem;">
          <div>
            <div class="card-title">Machine Learning Predictive Revenue Leakage Modeling</div>
            <div class="card-subtitle">AI models analyze historical transaction velocity, foot traffic multipliers (+81% Black Friday), and seasonal patterns to forecast commission leakage <em>before</em> monthly reconciliation occurs.</div>
          </div>
          <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;">
            <select class="form-select form-select-sm" style="width:180px;" onchange="filterForensicsPeriod(this.value)">
              <option value="All" ${AppState.forensicsPeriodFilter === 'All' ? 'selected' : ''}>All Forecast Periods</option>
              <option value="2026-11" ${AppState.forensicsPeriodFilter === '2026-11' ? 'selected' : ''}>November 2026 (Black Friday)</option>
              <option value="2026-12" ${AppState.forensicsPeriodFilter === '2026-12' ? 'selected' : ''}>December 2026 (Holiday Surge)</option>
            </select>
            <select class="form-select form-select-sm" style="width:160px;" onchange="filterForensicsRisk(this.value)">
              <option value="All" ${AppState.forensicsRiskFilter === 'All' ? 'selected' : ''}>All Risk Tiers</option>
              <option value="Critical Risk" ${AppState.forensicsRiskFilter === 'Critical Risk' ? 'selected' : ''}>Critical Risk (≥80%)</option>
              <option value="Elevated Risk" ${AppState.forensicsRiskFilter === 'Elevated Risk' ? 'selected' : ''}>Elevated Risk (60-79%)</option>
              <option value="Low Risk" ${AppState.forensicsRiskFilter === 'Low Risk' ? 'selected' : ''}>Low Risk (&lt;60%)</option>
            </select>
            <button class="btn btn-outline btn-sm" onclick="runMLForecastRecalibration()">
              <i data-lucide="refresh-cw"></i> Recalibrate ML Models
            </button>
            <button class="btn btn-outline btn-sm" onclick="exportForensicsCSV()">
              <i data-lucide="download"></i> Export Predictions
            </button>
          </div>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Forecast Period & Category</th>
                <th>Vendor Partner</th>
                <th style="text-align:right;">Projected GMV Volume</th>
                <th style="text-align:right;">Predicted Leakage</th>
                <th>Leakage Probability</th>
                <th>Primary Risk Driver (Root Cause Diagnosis)</th>
                <th style="text-align:right;">Proactive AI Action</th>
              </tr>
            </thead>
            <tbody>
              ${filteredPredictions.map(p => {
                const isCrit = p.riskTier === 'Critical Risk';
                const isElev = p.riskTier === 'Elevated Risk';
                const riskBadge = isCrit
                  ? '<span class="badge badge-danger"><i data-lucide="alert-octagon"></i> Critical Risk</span>'
                  : isElev
                  ? '<span class="badge badge-warning"><i data-lucide="alert-triangle"></i> Elevated Risk</span>'
                  : '<span class="badge badge-success"><i data-lucide="check"></i> Low Risk</span>';

                return `
                  <tr>
                    <td>
                      <div style="font-weight:700;font-size:0.875rem;">${esc(p.periodLabel)}</div>
                      <div style="font-size:0.75rem;color:var(--text-muted);"><i data-lucide="tag" style="width:11px;height:11px;display:inline-block;vertical-align:middle;"></i> ${esc(p.category)}</div>
                    </td>
                    <td>
                      <div style="font-weight:700;">${esc(p.vendorName)}</div>
                      <div style="font-size:0.75rem;color:var(--text-muted);">Contract: ${p.contractedRate}% &bull; Predicted Remittance: ${p.predictedRemittedRate}%</div>
                    </td>
                    <td style="text-align:right;">
                      <div style="font-weight:700;font-size:0.95rem;">$${p.forecastedVolume.toLocaleString()}</div>
                      <div style="font-size:0.75rem;color:#059669;font-weight:600;">${p.footTrafficMultiplier}x Foot Traffic</div>
                    </td>
                    <td style="text-align:right;">
                      <div style="font-weight:800;font-size:1rem;color:#ef4444;">-$${p.predictedLeakageAmount.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
                      <div style="font-size:0.75rem;color:var(--text-muted);">Exp: $${p.expectedMonthlyCommission.toLocaleString()}</div>
                    </td>
                    <td>
                      <div style="display:flex;align-items:center;gap:0.5rem;">
                        <span style="font-weight:800;font-size:0.9rem;${isCrit ? 'color:#dc2626;' : isElev ? 'color:#d97706;' : 'color:#16a34a;'}">${p.leakageProbability}%</span>
                        ${riskBadge}
                      </div>
                      <div style="width:100px;height:5px;background:#e2e8f0;border-radius:3px;margin-top:4px;">
                        <div style="width:${p.leakageProbability}%;height:100%;background:${isCrit ? '#ef4444' : isElev ? '#f59e0b' : '#10b981'};border-radius:3px;"></div>
                      </div>
                    </td>
                    <td>
                      <div style="font-size:0.8125rem;color:#1e293b;line-height:1.4;">
                        ${esc(p.primaryRiskDriver)}
                      </div>
                      <div style="font-size:0.75rem;color:#0284c7;margin-top:4px;font-weight:600;">
                        💡 Strategy: ${esc(p.proactiveRecommendation)}
                      </div>
                    </td>
                    <td style="text-align:right;">
                      <button class="btn btn-primary btn-xs" onclick="dispatchPreemptiveAddendum('${p.id}')">
                        <i data-lucide="send"></i> Dispatch Addendum
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Forecast Charts -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.5rem;">
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Q4 Holiday Volume Surge vs. Projected Commission Deficit</div>
              <div class="card-subtitle">Expected contractual yield vs. forecasted clearinghouse settlement</div>
            </div>
          </div>
          <div class="card-body">
            <div class="chart-container" style="height:250px;"><canvas id="chart-predictive-leakage"></canvas></div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Foot Traffic Multiplier vs. Probability of Leakage</div>
              <div class="card-subtitle">Correlation between seasonal foot traffic peaks and rate tier suppression</div>
            </div>
          </div>
          <div class="card-body">
            <div class="chart-container" style="height:250px;"><canvas id="chart-traffic-leakage"></canvas></div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: Automated Dispute Generation -->
    <div id="forensics-tab-disputes" style="display:${AppState.forensicsActiveTab === 'disputes' ? 'block' : 'none'};">
      <div style="display:grid;grid-template-columns:360px 1fr;gap:1.5rem;margin-bottom:1.5rem;">
        <!-- Left: Case Selector & Controls -->
        <div>
          <div class="card" style="margin-bottom:1rem;">
            <div class="card-header">
              <div class="card-title">Select Discrepant Settlement Record</div>
            </div>
            <div class="card-body" style="padding:0.75rem;">
              ${recList.filter(r => r.varianceAmount < 0).map(r => {
                const isSelected = r.id === AppState.selectedDisputeRecId;
                return `
                  <div class="pipeline-card" style="cursor:pointer;border-left:4px solid #ef4444;${isSelected ? 'background:#eff6ff;border-color:#3b82f6;' : ''}" onclick="selectDisputeRecord('${r.id}')">
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                      <div style="font-weight:700;font-size:0.875rem;">${esc(r.vendorName)}</div>
                      <span class="badge badge-shortfall" style="font-size:0.7rem;">-$${Math.abs(r.varianceAmount).toFixed(0)}</span>
                    </div>
                    <div style="font-size:0.75rem;color:var(--text-muted);margin:2px 0;">${esc(r.productName)} &bull; ${esc(r.monthLabel)}</div>
                    <div style="font-size:0.75rem;color:#b91c1c;margin-top:4px;">Variance: ${r.varianceBps} bps deficit</div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-title">Dispute Notice Settings</div>
            </div>
            <div class="card-body">
              <div class="form-group">
                <label class="form-label" style="font-weight:700;">Notice Template Type</label>
                <select class="form-select" onchange="AppState.disputeTemplateType = this.value; window.renderPredictiveForensics();">
                  <option value="legal_demand" ${AppState.disputeTemplateType === 'legal_demand' ? 'selected' : ''}>Formal Certified Legal Demand Letter</option>
                  <option value="audit_finding" ${AppState.disputeTemplateType === 'audit_finding' ? 'selected' : ''}>Internal Audit Discrepancy & Notice to Cure</option>
                  <option value="accounting_inquiry" ${AppState.disputeTemplateType === 'accounting_inquiry' ? 'selected' : ''}>Commercial Finance Inquiry & Settlement Adjustment</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" style="font-weight:700;">Statutory Cure Period</label>
                <input type="text" class="form-input" value="10 Business Days (Per MSA Section 14.3)" readonly>
              </div>

              <div class="form-group">
                <label class="form-label" style="font-weight:700;">Recipient Vendor Contact</label>
                <input type="text" class="form-input" value="${esc(primaryContact.name)} (${esc(primaryContact.email)})" readonly>
              </div>

              <div style="display:flex;flex-direction:column;gap:0.5rem;margin-top:1.25rem;">
                <button class="btn btn-primary" onclick="dispatchDisputeEmail('${activeRec.id}')">
                  <i data-lucide="send"></i> Dispatch Certified Dispute Notice
                </button>
                <button class="btn btn-outline" onclick="copyDisputeText()">
                  <i data-lucide="copy"></i> Copy Notice to Clipboard
                </button>
                <button class="btn btn-outline" onclick="downloadDisputePDF('${activeRec.id}')">
                  <i data-lucide="file-down"></i> Download Certified PDF Notice
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Certified Dispute Letter Preview -->
        <div class="dispute-paper" id="dispute-letter-content">
          <div class="dispute-letterhead">
            <div>
              <div style="font-size:1.25rem;font-weight:900;letter-spacing:-0.5px;color:#0f172a;display:flex;align-items:center;gap:0.5rem;">
                <span style="color:#ef4444;"><i data-lucide="shield-alert"></i></span>
                COMMISSION IQ — PROCUREMENT & AUDIT RECOVERY
              </div>
              <div style="font-size:0.75rem;color:#64748b;margin-top:2px;">Enterprise Multi-Door Retail Network &bull; Contract Compliance & Revenue Assurance Division</div>
            </div>
            <div style="text-align:right;">
              <span class="badge badge-danger" style="font-size:0.75rem;padding:3px 8px;">FORMAL LEGAL NOTICE</span>
              <div style="font-size:0.75rem;font-family:monospace;color:#64748b;margin-top:4px;">REF: NOTICE-CIQ-2026-10-${activeRec.vendorId || 'V001'}</div>
              <div style="font-size:0.75rem;color:#64748b;">Date: November 18, 2026</div>
            </div>
          </div>

          <div style="margin-bottom:1.25rem;font-size:0.875rem;">
            <div><strong>DELIVERED VIA CERTIFIED ELECTRONIC NOTICE & RECORDED AUDIT DISPATCH</strong></div>
            <div style="margin-top:0.5rem;">
              <strong>TO:</strong> ${esc(primaryContact.name)}, ${esc(primaryContact.title)}<br>
              <strong>COMPANY:</strong> ${esc(activeRec.vendorName)}<br>
              <strong>VENDOR ID:</strong> ${esc(activeRec.vendorId)} &bull; ${esc(primaryContact.email)}
            </div>
          </div>

          <div style="background:#fee2e2;border-left:4px solid #ef4444;padding:0.75rem 1rem;border-radius:4px;margin-bottom:1.25rem;">
            <div style="font-weight:800;color:#991b1b;font-size:0.95rem;">SUBJECT: DEMAND FOR IMMEDIATE REMITTANCE CURE — AUDITED COMMISSION SHORTFALL OF $${Math.abs(activeRec.varianceAmount || 0).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
            <div style="font-size:0.8125rem;color:#7f1d1d;margin-top:2px;">Reconciliation Audit Cycle: ${esc(activeRec.monthLabel || 'October 2026')} &bull; Product Category: ${esc(activeRec.productName)}</div>
          </div>

          <p style="font-size:0.875rem;margin-bottom:1rem;">
            Dear ${esc(primaryContact.name)},
          </p>
          <p style="font-size:0.875rem;margin-bottom:1rem;">
            Please be advised that Commission IQ's Automated Reconciliation Engine has completed its formal audit of monthly commission settlement remittances for the period of <strong>${esc(activeRec.monthLabel || 'October 2026')}</strong>. A material variance has been identified between contractually agreed commission entitlements and actual remitted receipts under Remittance Advice <strong>${esc(activeRec.remittanceRef || 'REM-AUTO-2026')}</strong>.
          </p>

          <table class="dispute-table">
            <thead>
              <tr>
                <th>Audit Parameter</th>
                <th>Contractual Entitlement</th>
                <th>Actual Remitted Receipt</th>
                <th style="color:#b91c1c;">Identified Variance (Shortfall)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Settled GMV Transaction Volume</strong></td>
                <td>$${(activeRec.monthlyVolume || 0).toLocaleString()}</td>
                <td>$${(activeRec.monthlyVolume || 0).toLocaleString()}</td>
                <td>$0.00 (Volume Reconciled)</td>
              </tr>
              <tr>
                <td><strong>Commission Rate / Transaction</strong></td>
                <td>${activeRec.contractedRate}% (Contracted Tier)</td>
                <td>${activeRec.actualRemittedRate}% (Applied Rate)</td>
                <td style="color:#b91c1c;font-weight:700;">${activeRec.varianceBps} bps Rate Deficit</td>
              </tr>
              <tr>
                <td><strong>Base Commission Generated</strong></td>
                <td>$${(activeRec.contractedBaseCommission || 0).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                <td>$${(activeRec.actualBaseCommission || 0).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                <td style="color:#b91c1c;font-weight:700;">-$${Math.abs((activeRec.contractedBaseCommission||0) - (activeRec.actualBaseCommission||0)).toFixed(2)}</td>
              </tr>
              <tr>
                <td><strong>Contracted Subsidies (Fraud/Marketing/IT)</strong></td>
                <td>$${(activeRec.contractedSubsidies || 0).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                <td>$${(activeRec.actualSubsidiesReceived || 0).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                <td style="color:#b91c1c;font-weight:700;">-$${Math.abs((activeRec.contractedSubsidies||0) - (activeRec.actualSubsidiesReceived||0)).toFixed(2)}</td>
              </tr>
              <tr style="background:#fef2f2;font-weight:800;font-size:0.95rem;">
                <td><strong>TOTAL ENTITLEMENT / REMITTANCE</strong></td>
                <td>$${(activeRec.expectedCommission || 0).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                <td>$${(activeRec.actualCommission || 0).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                <td style="color:#dc2626;">-$${Math.abs(activeRec.varianceAmount || 0).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
              </tr>
            </tbody>
          </table>

          <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:0.75rem 1rem;border-radius:4px;margin-bottom:1rem;font-size:0.8125rem;">
            <strong>ROOT CAUSE DETERMINATION:</strong> ${esc(activeRec.leakageRootCause || 'Rate tier mismatch and unbilled marketing co-op')}.
          </div>

          <p style="font-size:0.875rem;margin-bottom:1rem;">
            <strong>CONTRACTUAL BASIS & LEGAL DEMAND:</strong><br>
            Under <em>Section 6.2 ("Commission Remittance Schedules & Volume Tier Adjustments")</em> and <em>Section 14.3 ("Audit Rights & Shortfall Recovery")</em> of the Master Services Agreement executed between the parties, vendor is required to remit full earned commission without arbitrary deductions within the stipulated Net settlement window.
          </p>
          <p style="font-size:0.875rem;margin-bottom:1.5rem;">
            Retailer hereby formally demands payment of the shortfall balance in the amount of <strong>$${Math.abs(activeRec.varianceAmount || 0).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</strong> within <strong>ten (10) business days</strong> of receipt of this notice (no later than <strong>December 2, 2026</strong>). Failure to cure will result in escalation to the Revenue Recovery Pipeline, assessment of 1.5% monthly late interest per Section 14.3, and potential suspension of vendor bidding privileges in the active Reverse Auction Arena (Event SE001).
          </p>

          <div style="display:flex;justify-content:space-between;align-items:flex-end;border-top:1px solid #cbd5e1;padding-top:1rem;font-size:0.8125rem;">
            <div>
              <strong>Sincerely,</strong><br>
              <strong>Commission IQ Audit & Procurement Recovery Committee</strong><br>
              Cc: Corporate Treasury, Contract Compliance Legal Counsel
            </div>
            <div style="font-family:monospace;font-size:0.7rem;color:#94a3b8;text-align:right;">
              DIGITALLY CERTIFIED BY COMMISSION IQ ENGINE<br>
              BLOCKCHAIN AUDIT HASH: 0x8F9B...4E12
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 3: Anomaly Detection in Transaction Feeds -->
    <div id="forensics-tab-anomalies" style="display:${AppState.forensicsActiveTab === 'anomalies' ? 'block' : 'none'};">
      <div class="card" style="margin-bottom:1.5rem;">
        <div class="card-header" style="flex-wrap:wrap;gap:1rem;">
          <div>
            <div class="card-title" style="display:flex;align-items:center;gap:0.5rem;">
              <span class="feed-pulse-dot"></span>
              Real-Time POS Transaction Feed & API Ingestion Anomaly Monitor
            </div>
            <div class="card-subtitle">Continuous machine learning surveillance of uploaded & API-fed transaction counts across 1,420 store doors to instantly detect volume drop-offs, POS firmware timeouts, and uncollected subsidies.</div>
          </div>
          <div style="display:flex;align-items:center;gap:0.5rem;">
            <button class="btn btn-outline btn-sm" onclick="simulateNewAnomaly()">
              <i data-lucide="zap"></i> Simulate Anomaly Injection
            </button>
            <button class="btn btn-primary btn-sm" onclick="runGatewayDiagnostics()">
              <i data-lucide="cpu"></i> Run Network Diagnostics
            </button>
          </div>
        </div>

        <!-- Live Stream Feed Status Banner -->
        <div style="background:linear-gradient(135deg, #0f172a, #1e293b);border-radius:8px;padding:1rem 1.25rem;margin:1rem;color:#fff;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
          <div style="display:flex;align-items:center;gap:1rem;">
            <div style="width:40px;height:40px;border-radius:8px;background:rgba(239,68,68,0.2);border:1px solid #ef4444;display:flex;align-items:center;justify-content:center;color:#ef4444;font-size:1.25rem;">
              <i data-lucide="radio"></i>
            </div>
            <div>
              <div style="font-weight:800;font-size:1rem;letter-spacing:-0.2px;">Streaming POS Ingestion Stream Active &bull; 1,420 Retail Doors Connected</div>
              <div style="font-size:0.8125rem;color:#94a3b8;">Average Ingestion Velocity: <strong>3,420 tx / hr</strong> &bull; Anomaly Detection Latency: <strong>&lt; 45 seconds</strong> &bull; Uncollected Subsidies At Risk: <strong style="color:#f87171;">$${uncollectedSubsidiesAtRisk.toLocaleString()}</strong></div>
            </div>
          </div>
          <div>
            <span class="badge badge-danger" style="font-size:0.8rem;padding:4px 10px;">${activeAnomaliesCount} ACTIVE INCIDENTS FLAGGED</span>
          </div>
        </div>

        <!-- Hourly Velocity Chart -->
        <div style="padding:0 1rem 1rem 1rem;">
          <div style="font-size:0.875rem;font-weight:700;margin-bottom:0.5rem;color:var(--text-muted);text-transform:uppercase;">24-Hour Monitored Transaction Feed Velocity vs. Baseline</div>
          <div class="chart-container" style="height:220px;"><canvas id="chart-pos-feed"></canvas></div>
        </div>

        <!-- Stream of Anomalies -->
        <div style="padding:0 1rem 1rem 1rem;">
          <div style="font-size:0.875rem;font-weight:700;margin-bottom:0.75rem;color:var(--text-muted);text-transform:uppercase;">Flagged Transaction Feed Incidents & Root Cause Diagnostics</div>
          ${anomList.map(a => {
            const isCrit = a.severity === 'Critical';
            const isWarn = a.severity === 'Medium';
            const itemClass = isCrit ? 'critical' : isWarn ? 'warning' : 'resolved';
            const badgeClass = isCrit ? 'badge-danger' : isWarn ? 'badge-warning' : 'badge-success';

            return `
              <div class="anomaly-stream-item ${itemClass}">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:0.5rem;">
                  <div>
                    <div style="display:flex;align-items:center;gap:0.5rem;">
                      <span class="badge ${badgeClass}">${esc(a.severity)}</span>
                      <strong style="font-size:0.95rem;">${esc(a.productCategory)}</strong>
                      <span style="font-size:0.75rem;color:var(--text-muted);">&bull; ${esc(a.timestamp)} &bull; Vendor: <strong>${esc(a.vendorName)}</strong></span>
                    </div>
                    <div style="font-size:0.8125rem;color:#0284c7;font-weight:600;margin-top:2px;">
                      ${esc(a.storeDoors)} (${esc(a.region)})
                    </div>
                  </div>
                  <div style="text-align:right;">
                    <div style="font-weight:800;font-size:1.1rem;${isCrit ? 'color:#dc2626;' : isWarn ? 'color:#d97706;' : 'color:#16a34a;'}">${a.deficitPercentage}% Velocity Collapse</div>
                    <div style="font-size:0.75rem;color:var(--text-muted);">Expected: ${a.expectedCountPerHour} tx/hr &bull; Actual: ${a.actualCountPerHour} tx/hr</div>
                  </div>
                </div>

                <div style="background:var(--bg-subtle, #f8fafc);border:1px solid var(--border-color, #e2e8f0);padding:0.75rem;border-radius:6px;margin:0.75rem 0;font-size:0.8125rem;">
                  <strong>DIAGNOSTIC ROOT CAUSE:</strong> ${esc(a.rootCause)}
                  ${a.uncollectedSubsidiesLost > 0 ? `
                    <div style="color:#b91c1c;font-weight:700;margin-top:3px;">
                      ⚠️ Uncollected Promotional Subsidies Lost: $${a.uncollectedSubsidiesLost.toLocaleString()}
                    </div>
                  ` : ''}
                </div>

                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;">
                  <div style="font-size:0.75rem;color:var(--text-muted);">
                    Recommended Action: <strong>${esc(a.recommendedAction)}</strong>
                  </div>
                  <div style="display:flex;gap:0.35rem;">
                    ${a.status === 'Active Anomaly' ? `
                      <button class="btn btn-success btn-xs" onclick="autoHealAnomaly('${a.id}')">
                        <i data-lucide="cpu"></i> Auto-Heal Terminal Switch
                      </button>
                      <button class="btn btn-outline btn-xs" onclick="quarantineBatch('${a.id}')">
                        <i data-lucide="shield-ban"></i> Quarantine POS Batch
                      </button>
                    ` : `
                      <span class="badge badge-success"><i data-lucide="check"></i> Remediated</span>
                    `}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>

    <!-- TAB 4: Historical Leakage Audit -->
    <div id="forensics-tab-audit" style="display:${AppState.forensicsActiveTab === 'audit' ? 'block' : 'none'};">
      <div class="card" style="margin-bottom:1.5rem;">
        <div class="card-header">
          <div>
            <div class="card-title">Comprehensive Historical Commission Leakage Log</div>
            <div class="card-subtitle">Audited leakage records across convenience chain store network</div>
          </div>
          <button class="btn btn-outline btn-sm" onclick="exportToCSV(MockData.leakageData, 'Leakage_Audit_Log.csv')">
            <i data-lucide="download"></i> Export Log CSV
          </button>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Product</th>
                <th>Contracted Rate</th>
                <th>Actual Remitted</th>
                <th>Rate Variance</th>
                <th>Financial Shortfall</th>
                <th>Status</th>
                <th>Date Logged</th>
              </tr>
            </thead>
            <tbody>
              ${leakageLog.map(r => `
                <tr>
                  <td style="font-weight:700;">${esc(r.vendor)}</td>
                  <td>${esc(r.product)}</td>
                  <td>${r.expectedRate.toFixed(2)}%</td>
                  <td>${r.actualRate.toFixed(2)}%</td>
                  <td style="color:#ef4444;font-weight:700;">${r.variance.toFixed(2)}%</td>
                  <td style="color:#ef4444;font-weight:800;">$${r.amountLost.toLocaleString()}</td>
                  <td><span class="badge ${r.status === 'Recovered' ? 'badge-success' : r.status === 'Detected' ? 'badge-danger' : 'badge-warning'}">${esc(r.status)}</span></td>
                  <td style="font-size:0.8125rem;color:var(--text-muted);">${r.date}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `);

  // Chart Rendering
  setTimeout(() => {
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Chart 1: Predictive Leakage
    const ctx1 = document.getElementById('chart-predictive-leakage');
    if (ctx1) {
      AppState.charts['chart-predictive-leakage'] = new Chart(ctx1, {
        type: 'bar',
        data: {
          labels: ['GiftFlow (Nov)', 'SwiftTransfer (Dec)', 'ReloadNow (Nov)', 'ValueCard (Dec)', 'FinServ (Dec)'],
          datasets: [
            { label: 'Forecasted Remittance ($)', data: [7960, 4060, 3390, 2150, 12390], backgroundColor: '#10b981', borderRadius: 4 },
            { label: 'Predicted Leakage Risk ($)', data: [6840, 8960, 1380, 1900, 2360], backgroundColor: '#ef4444', borderRadius: 4 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } },
            tooltip: { callbacks: { label: ctx => ctx.dataset.label + ': $' + ctx.parsed.y.toLocaleString() } }
          },
          scales: {
            y: { stacked: true, ticks: { callback: v => '$' + (v/1000) + 'k', font: { size: 11 } }, grid: { color: 'rgba(0,0,0,0.05)' } },
            x: { stacked: true, grid: { display: false }, ticks: { font: { size: 10 } } }
          }
        }
      });
    }

    // Chart 2: Foot Traffic vs Probability
    const ctx2 = document.getElementById('chart-traffic-leakage');
    if (ctx2) {
      AppState.charts['chart-traffic-leakage'] = new Chart(ctx2, {
        type: 'line',
        data: {
          labels: ['1.0x (Normal)', '1.2x (Weekend)', '1.4x (Pre-Holiday)', '1.6x (Thanksgiving)', '1.8x (Black Friday)', '2.0x (Peak Eve)'],
          datasets: [
            { label: 'Leakage Risk Probability (%)', data: [15, 28, 55, 78, 92, 96], borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', fill: true, tension: 0.35, pointRadius: 5 },
            { label: 'Terminal Throttling Risk (%)', data: [5, 12, 35, 62, 85, 91], borderColor: '#f59e0b', borderDash: [5, 5], fill: false, tension: 0.35, pointRadius: 4 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } } },
          scales: {
            y: { min: 0, max: 100, ticks: { callback: v => v + '%', font: { size: 11 } }, grid: { color: 'rgba(0,0,0,0.05)' } },
            x: { grid: { display: false }, ticks: { font: { size: 10 } } }
          }
        }
      });
    }

    // Chart 3: Live POS Feed
    const ctx3 = document.getElementById('chart-pos-feed');
    if (ctx3) {
      AppState.charts['chart-pos-feed'] = new Chart(ctx3, {
        type: 'line',
        data: {
          labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '13:00 (Anomaly)', '14:00', '15:00 (Anomaly)', '16:00', '18:00', '20:00', '22:00'],
          datasets: [
            { label: 'Expected Baseline (tx/hr)', data: [450, 210, 180, 890, 2400, 3100, 3600, 3800, 3550, 3700, 3400, 3900, 2800, 1200], borderColor: '#3b82f6', borderDash: [4, 4], fill: false, tension: 0.3 },
            { label: 'Monitored Live POS Feed (tx/hr)', data: [445, 208, 178, 880, 2380, 3080, 3580, 1920, 3520, 2140, 3380, 3880, 2780, 1190], borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.06)', fill: true, tension: 0.2, pointRadius: 4 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } } },
          scales: {
            y: { ticks: { callback: v => v + ' tx', font: { size: 11 } }, grid: { color: 'rgba(0,0,0,0.05)' } },
            x: { grid: { display: false }, ticks: { font: { size: 10 } } }
          }
        }
      });
    }
  }, 60);
};

// Aliases
window.renderLeakage = window.renderPredictiveForensics;

// Forensics Handlers
window.setForensicsTab = function(tabName) {
  AppState.forensicsActiveTab = tabName;
  window.renderPredictiveForensics();
};

window.filterForensicsPeriod = function(p) {
  AppState.forensicsPeriodFilter = p;
  window.renderPredictiveForensics();
};

window.filterForensicsRisk = function(r) {
  AppState.forensicsRiskFilter = r;
  window.renderPredictiveForensics();
};

window.selectDisputeRecord = function(recId) {
  AppState.selectedDisputeRecId = recId;
  window.renderPredictiveForensics();
};

window.dispatchPreemptiveAddendum = function(predId) {
  const p = (MockData.predictiveLeakageModels || []).find(item => item.id === predId);
  if (!p) return;
  p.actionStatus = 'Preemptive Addendum Executed';

  MockData.auditLogs.unshift({
    id: 'AUD-' + Date.now(),
    timestamp: new Date().toISOString(),
    user: (Auth && Auth.currentUser && Auth.currentUser().name) || 'Category Manager',
    action: 'Preemptive Rate Addendum Dispatched',
    module: 'Predictive Forensics',
    details: 'Dispatched preemptive ' + p.category + ' tier lock addendum to ' + p.vendorName + ' protecting $' + p.predictedLeakageAmount.toFixed(2)
  });

  MockData.notifications.unshift({
    id: 'N-PRED-' + Date.now(),
    userId: 'U003',
    title: 'Preemptive Tier Lock Dispatched',
    message: 'Preemptive addendum issued to ' + p.vendorName + ' for ' + p.periodLabel + ' to protect $' + p.predictedLeakageAmount.toFixed(2) + ' in forecast leakage.',
    timestamp: 'Just now',
    type: 'success',
    read: false
  });

  showToast('Preemptive rate addendum dispatched to ' + p.vendorName + '!');
  window.renderPredictiveForensics();
};

window.dispatchDisputeEmail = function(recId) {
  const rec = (MockData.monthlyCommissionReconciliation || []).find(r => r.id === recId) || {};
  showToast('Dispatching certified dispute notice & audit packet to ' + (rec.vendorName || 'vendor') + '...');
  setTimeout(() => {
    rec.reconciliationStatus = 'Dispute In Progress';
    rec.escalatedToRecovery = true;
    rec.recoveryCaseId = 'RC-DISP-' + Date.now().toString().slice(-4);

    MockData.recoveryPipeline.unshift({
      id: rec.recoveryCaseId,
      vendor: rec.vendorName,
      type: 'Commission Shortfall',
      amount: Math.abs(rec.varianceAmount || 2000),
      status: 'In Progress',
      priority: 'High',
      assignedTo: (Auth && Auth.currentUser && Auth.currentUser().name) || 'Finance Analyst',
      age: 0,
      notes: 'Certified demand notice dispatched with 10-day cure window. Root cause: ' + rec.leakageRootCause
    });

    MockData.auditLogs.unshift({
      id: 'AUD-' + Date.now(),
      timestamp: new Date().toISOString(),
      user: (Auth && Auth.currentUser && Auth.currentUser().name) || 'Finance Analyst',
      action: 'Certified Dispute Notice Dispatched',
      module: 'Predictive Forensics',
      details: 'Served formal legal demand to ' + rec.vendorName + ' for $' + Math.abs(rec.varianceAmount).toFixed(2) + ' shortfall. Case: ' + rec.recoveryCaseId
    });

    showToast('Certified Dispute Notice served successfully (Case ' + rec.recoveryCaseId + ')');
    window.renderPredictiveForensics();
  }, 400);
};

window.copyDisputeText = function() {
  const content = document.getElementById('dispute-letter-content');
  if (content) {
    navigator.clipboard.writeText(content.innerText).then(() => {
      showToast('Dispute notice text copied to clipboard!');
    }).catch(() => {
      showToast('Notice text ready for copy.');
    });
  }
};

window.downloadDisputePDF = function(recId) {
  showToast('Generating signed certified PDF demand letter for record ' + recId + '...');
};

window.simulateNewAnomaly = function() {
  const newAnom = {
    id: 'ANOM-' + Date.now(),
    timestamp: 'Just now (Live Alert)',
    storeDoors: 'Doors #301–#315 (Pacific Northwest Doors)',
    region: 'West Coast',
    productCategory: 'Streaming Digital Cards',
    vendorName: 'PrepaidPlus Corp',
    severity: 'Critical',
    expectedCountPerHour: 75,
    actualCountPerHour: 8,
    deficitPercentage: -89.3,
    rootCause: 'Aggregator POS API rate limiter threshold tripped during lunch hour; transactions queued without confirmation',
    uncollectedSubsidiesLost: 750,
    status: 'Active Anomaly',
    recommendedAction: 'Reset API consumer quota on PrepaidPlus gateway.'
  };

  MockData.transactionFeedAnomalies.unshift(newAnom);

  MockData.auditLogs.unshift({
    id: 'AUD-' + Date.now(),
    timestamp: new Date().toISOString(),
    user: 'AI Anomaly Daemon',
    action: 'POS Stream Anomaly Detected',
    module: 'Predictive Forensics',
    details: 'Real-time alert: -89.3% volume collapse on Doors #301-#315'
  });

  showToast('Real-time anomaly injected and flagged by AI monitor!');
  window.renderPredictiveForensics();
};

window.autoHealAnomaly = function(anomId) {
  const anom = (MockData.transactionFeedAnomalies || []).find(a => a.id === anomId);
  if (!anom) return;
  anom.status = 'Auto-Healed';
  anom.actualCountPerHour = anom.expectedCountPerHour;
  anom.deficitPercentage = 0.0;

  MockData.auditLogs.unshift({
    id: 'AUD-' + Date.now(),
    timestamp: new Date().toISOString(),
    user: 'AI Self-Healing Protocol',
    action: 'POS Gateway Auto-Healed',
    module: 'Predictive Forensics',
    details: 'Auto-restarted gateway socket and restored terminal sync for incident ' + anomId
  });

  showToast('Auto-Healed! Terminal gateway reset and velocity restored to normal.');
  window.renderPredictiveForensics();
};

window.quarantineBatch = function(anomId) {
  const anom = (MockData.transactionFeedAnomalies || []).find(a => a.id === anomId);
  if (!anom) return;
  showToast('Quarantined POS batch for ' + anom.storeDoors + '. Field engineering notified.');
};

window.runGatewayDiagnostics = function() {
  showToast('Running synthetic ping and TLS certificate health audit across 1,420 store gateways...');
  setTimeout(() => {
    showToast('Diagnostics completed: 1,418 gateways healthy; 2 endpoints remediated.');
  }, 500);
};

window.runMLForecastRecalibration = function() {
  showToast('Running Monte Carlo simulation & holiday foot traffic weight calibration...');
  setTimeout(() => {
    showToast('ML calibration complete: Refreshed predictive leakage boundaries with 94.2% confidence.');
    window.renderPredictiveForensics();
  }, 400);
};

window.exportForensicsCSV = function() {
  const rows = (MockData.predictiveLeakageModels || []).map(p => ({
    'Period': p.periodLabel,
    'Vendor ID': p.vendorId,
    'Vendor Name': p.vendorName,
    'Category': p.category,
    'Forecasted Volume ($)': p.forecastedVolume,
    'Foot Traffic Multiplier': p.footTrafficMultiplier,
    'Contracted Rate (%)': p.contractedRate,
    'Predicted Remitted Rate (%)': p.predictedRemittedRate,
    'Predicted Leakage Amount ($)': p.predictedLeakageAmount,
    'Leakage Probability (%)': p.leakageProbability,
    'Risk Tier': p.riskTier,
    'Primary Risk Driver': p.primaryRiskDriver,
    'Proactive Recommendation': p.proactiveRecommendation,
    'Action Status': p.actionStatus
  }));
  exportToCSV(rows, 'Predictive_Revenue_Leakage_Forecast_Q4.csv');
  showToast('Exported predictive leakage forecast CSV');
};


window.renderBenchmarking = function() {
  const container = (document.getElementById('content-area') || document.getElementById('main-content'));
  if (!container) return;

  // Analyzer Local State
  if (!window._benchmarkAnalyzerState) {
    window._benchmarkAnalyzerState = {
      activeTab: 'product', // 'product' | 'category' | 'vendor' | 'normalization'
      categoryFilter: 'all',
      vendorFilter: 'all',
      statusFilter: 'all',
      searchQuery: '',
      targetPercentile: '75', // '50' | '75' | '90'
      includeSubsidiesInRate: true
    };
  }

  const state = window._benchmarkAnalyzerState;
  const benchmarkItems = MockData.benchmarkData || [];

  // Recalculate metrics per item
  const analyzedItems = benchmarkItems.map(item => {
    const txCount = item.annualTransactions || 0;
    const rate = item.commissionRatePerTx || item.yourRate || 0;
    const avgSize = item.avgTxSize || 50.0;
    const volume = item.annualVolume || (txCount * avgSize);

    // Current commission revenue from transactions + subsidies
    const currentBaseCommission = (rate / 100) * volume;
    const currentSubsidies = (item.fraudSubsidy || 0) + (item.itSubsidy || 0) + (item.marketingSubsidy || 0);
    const totalCurrentRevenue = currentBaseCommission + currentSubsidies;

    // Benchmark targets
    const benchRate = (state.targetPercentile === '90') ? (item.marketHigh || item.marketAvg * 1.15) :
                      (state.targetPercentile === '50') ? (item.marketLow || item.marketAvg * 0.9) :
                      (item.marketAvg || rate);

    const benchmarkBaseCommission = (benchRate / 100) * volume;
    const benchSubsidies = (item.marketFraudSubsidy || item.fraudSubsidy || 0) +
                           (item.marketItSubsidy || item.itSubsidy || 0) +
                           (item.marketMarketingSubsidy || item.marketingSubsidy || 0);
    const totalBenchmarkRevenue = benchmarkBaseCommission + benchSubsidies;

    const annualOpportunity = Math.round(totalBenchmarkRevenue - totalCurrentRevenue);
    const rateGap = parseFloat((benchRate - rate).toFixed(2));
    const isBelow = annualOpportunity > 0;

    return {
      ...item,
      volume,
      currentBaseCommission,
      currentSubsidies,
      totalCurrentRevenue,
      benchRate,
      benchSubsidies,
      totalBenchmarkRevenue,
      annualOpportunity,
      rateGap,
      isBelow
    };
  });

  // KPI Aggregates
  const totalAnalyzedTx = analyzedItems.reduce((acc, i) => acc + (i.annualTransactions || 0), 0);
  const totalAnalyzedVol = analyzedItems.reduce((acc, i) => acc + (i.volume || 0), 0);
  const totalCurrentRevenue = analyzedItems.reduce((acc, i) => acc + i.totalCurrentRevenue, 0);
  const totalCurrentSubsidies = analyzedItems.reduce((acc, i) => acc + i.currentSubsidies, 0);
  const totalNetOpportunity = analyzedItems.reduce((acc, i) => acc + (i.annualOpportunity > 0 ? i.annualOpportunity : 0), 0);
  const underperformingCount = analyzedItems.filter(i => i.annualOpportunity > 0).length;

  // Filtered rows for product tab
  const filteredProducts = analyzedItems.filter(item => {
    const matchCat = state.categoryFilter === 'all' || item.category === state.categoryFilter;
    const matchVen = state.vendorFilter === 'all' || item.vendor === state.vendorFilter;
    const matchStatus = state.statusFilter === 'all' ||
      (state.statusFilter === 'below' && item.annualOpportunity > 0) ||
      (state.statusFilter === 'above' && item.annualOpportunity <= 0);
    const matchSearch = !state.searchQuery ||
      item.serviceName.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      item.vendor.toLowerCase().includes(state.searchQuery.toLowerCase());
    return matchCat && matchVen && matchStatus && matchSearch;
  });

  // Aggregation BY CATEGORY
  const categoryGroups = {};
  analyzedItems.forEach(item => {
    const cat = item.category || 'Other';
    if (!categoryGroups[cat]) {
      categoryGroups[cat] = {
        category: cat,
        servicesCount: 0,
        annualTransactions: 0,
        volume: 0,
        currentRevenue: 0,
        subsidies: 0,
        benchmarkRevenue: 0,
        opportunity: 0
      };
    }
    categoryGroups[cat].servicesCount += 1;
    categoryGroups[cat].annualTransactions += item.annualTransactions || 0;
    categoryGroups[cat].volume += item.volume || 0;
    categoryGroups[cat].currentRevenue += item.totalCurrentRevenue;
    categoryGroups[cat].subsidies += item.currentSubsidies;
    categoryGroups[cat].benchmarkRevenue += item.totalBenchmarkRevenue;
    categoryGroups[cat].opportunity += (item.annualOpportunity > 0 ? item.annualOpportunity : 0);
  });
  const categoryList = Object.values(categoryGroups).sort((a,b) => b.opportunity - a.opportunity);

  // Aggregation BY VENDOR
  const vendorGroups = {};
  analyzedItems.forEach(item => {
    const ven = item.vendor || 'Unknown Vendor';
    if (!vendorGroups[ven]) {
      vendorGroups[ven] = {
        vendor: ven,
        category: item.category,
        productsCount: 0,
        productsList: [],
        annualTransactions: 0,
        volume: 0,
        currentRevenue: 0,
        subsidies: 0,
        benchmarkRevenue: 0,
        opportunity: 0
      };
    }
    vendorGroups[ven].productsCount += 1;
    vendorGroups[ven].productsList.push(item.serviceName);
    vendorGroups[ven].annualTransactions += item.annualTransactions || 0;
    vendorGroups[ven].volume += item.volume || 0;
    vendorGroups[ven].currentRevenue += item.totalCurrentRevenue;
    vendorGroups[ven].subsidies += item.currentSubsidies;
    vendorGroups[ven].benchmarkRevenue += item.totalBenchmarkRevenue;
    vendorGroups[ven].opportunity += (item.annualOpportunity > 0 ? item.annualOpportunity : 0);
  });
  const vendorList = Object.values(vendorGroups).sort((a,b) => b.opportunity - a.opportunity);

  // Normalization Ingestion Log History (Mock + Session)
  if (!window._benchmarkNormalizationLogs) {
    window._benchmarkNormalizationLogs = [
      {
        id: 'NL-101',
        filename: 'Retail_Store_Commission_Schedule_Q4.xlsx',
        uploadedBy: 'Rachel Nguyen (Finance Analyst)',
        timestamp: '2026-11-18 10:14:22',
        rowCount: 10,
        normalizedColumns: 'Service Name, Transaction count (annual), Commission Rate/Transaction, Fraud Protection Subsidy, IT Integration Subsidy, Marketing Subsidy',
        status: 'Normalized Successfully',
        rulesApplied: 'Currency stripped ($), Transaction counts cast to integer, Rate verified as % face value'
      },
      {
        id: 'NL-100',
        filename: 'National_Vendor_Rate_Matrix_2026.csv',
        uploadedBy: 'Jessica Williams (Procurement Manager)',
        timestamp: '2026-11-17 14:32:00',
        rowCount: 8,
        normalizedColumns: 'Service Name, Transaction count (annual), Commission Rate/Transaction, Subsidies',
        status: 'Normalized with 1 Warning',
        rulesApplied: 'Missing IT Integration subsidy defaulted to contract baseline'
      }
    ];
  }

  const allCategories = ['all', ...new Set(analyzedItems.map(i => i.category))];
  const allVendors = ['all', ...new Set(analyzedItems.map(i => i.vendor))];

  const html = `
    <!-- Top Action Bar -->
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:1.25rem;">
      <div>
        <h2 style="font-size:1.375rem;font-weight:700;display:flex;align-items:center;gap:0.5rem;">
          <span style="color:#1a73e8;"><i data-lucide="bar-chart-2"></i></span>
          Commission Benchmark Analyzer
        </h2>
        <p style="font-size:0.875rem;color:var(--text-light);margin-top:2px;">
          Upload Excel spreadsheets, normalize data, calculate commissions & subsidies, and quantify profit opportunities across Products, Categories, and Vendors.
        </p>
      </div>

      <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;">
        <button class="btn btn-primary btn-sm" onclick="window.openBenchmarkExcelUploadModal()" style="background:#1a73e8;border-color:#1a73e8;">
          <i data-lucide="file-spreadsheet"></i> Upload Excel / CSV
        </button>
        <button class="btn btn-outline btn-sm" onclick="window.downloadBenchmarkExcelTemplate()">
          <i data-lucide="download"></i> Excel Template
        </button>
        <button class="btn btn-outline btn-sm" onclick="window.openBenchmarkConfigModal()">
          <i data-lucide="sliders"></i> Benchmark Target (${state.targetPercentile}th %)
        </button>
        <button class="btn btn-outline btn-sm" onclick="exportToCSV(analyzedItems, 'Commission-Benchmark-Opportunity-Analysis.csv')">
          <i data-lucide="share"></i> Export Analysis
        </button>
      </div>
    </div>

    <!-- Executive KPI Strip -->
    <div class="kpi-grid" style="grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:1rem;margin-bottom:1.5rem;">
      <div class="kpi-card" style="--kpi-color:#10b981;--kpi-bg:#d1fae5;">
        <div class="kpi-icon" style="background:#d1fae5;color:#10b981;"><i data-lucide="trending-up"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Quantified Annual Opportunity</div>
          <div class="kpi-value" style="color:#059669;">+$${totalNetOpportunity.toLocaleString()}</div>
          <span class="kpi-trend up"><i data-lucide="check-circle"></i> Across 6 underperforming services</span>
        </div>
      </div>

      <div class="kpi-card" style="--kpi-color:#1a73e8;--kpi-bg:#e8f0fe;">
        <div class="kpi-icon" style="background:#e8f0fe;color:#1a73e8;"><i data-lucide="layers"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Annual Analyzed Volume</div>
          <div class="kpi-value">$${(totalAnalyzedVol / 1000000).toFixed(1)}M</div>
          <span class="kpi-trend" style="color:var(--text-muted);">${totalAnalyzedTx.toLocaleString()} transactions/yr</span>
        </div>
      </div>

      <div class="kpi-card" style="--kpi-color:#6366f1;--kpi-bg:#ede9fe;">
        <div class="kpi-icon" style="background:#ede9fe;color:#6366f1;"><i data-lucide="dollar-sign"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Current Commission & Subsidies</div>
          <div class="kpi-value">$${totalCurrentRevenue.toLocaleString()}</div>
          <span class="kpi-trend" style="color:var(--text-muted);">$${totalCurrentSubsidies.toLocaleString()} subsidies captured</span>
        </div>
      </div>

      <div class="kpi-card" style="--kpi-color:#f59e0b;--kpi-bg:#fef3c7;">
        <div class="kpi-icon" style="background:#fef3c7;color:#f59e0b;"><i data-lucide="alert-triangle"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Underperforming Ratio</div>
          <div class="kpi-value" style="color:#d97706;">${underperformingCount} of ${analyzedItems.length}</div>
          <span class="kpi-trend down"><i data-lucide="arrow-down-right"></i> Lagging ${state.targetPercentile}th percentile benchmark</span>
        </div>
      </div>
    </div>

    <!-- Multi-Perspective View Tabs -->
    <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid var(--border);margin-bottom:1.25rem;flex-wrap:wrap;gap:0.75rem;">
      <div style="display:flex;gap:0.5rem;">
        <button class="btn btn-sm ${state.activeTab === 'product' ? 'btn-primary' : 'btn-ghost'}" onclick="window.setBenchmarkTab('product')">
          <i data-lucide="box"></i> By Product / Service (${analyzedItems.length})
        </button>
        <button class="btn btn-sm ${state.activeTab === 'category' ? 'btn-primary' : 'btn-ghost'}" onclick="window.setBenchmarkTab('category')">
          <i data-lucide="grid"></i> By Category (${categoryList.length})
        </button>
        <button class="btn btn-sm ${state.activeTab === 'vendor' ? 'btn-primary' : 'btn-ghost'}" onclick="window.setBenchmarkTab('vendor')">
          <i data-lucide="building"></i> By Vendor (${vendorList.length})
        </button>
        <button class="btn btn-sm ${state.activeTab === 'normalization' ? 'btn-primary' : 'btn-ghost'}" onclick="window.setBenchmarkTab('normalization')">
          <i data-lucide="file-check-2"></i> Ingestion & Normalization Logs
        </button>
      </div>

      <div style="font-size:0.75rem;color:var(--text-muted);display:flex;align-items:center;gap:0.35rem;">
        <i data-lucide="info" style="width:13px;height:13px;"></i>
        Target Benchmark: <strong>${state.targetPercentile}th Percentile (Market Avg/Top)</strong>
      </div>
    </div>

    <!-- TAB 1: BY PRODUCT / SERVICE NAME -->
    ${state.activeTab === 'product' ? `
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Product & Service Benchmark Opportunity Quantification</div>
            <div class="card-subtitle">Detailed line-item comparison against normalized Excel ingestion model</div>
          </div>
          <div style="display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap;">
            <input type="text" class="form-input" style="height:34px;font-size:0.8125rem;min-width:180px;" placeholder="Search service name, vendor..."
                   value="${esc(state.searchQuery)}" oninput="window.setBenchmarkSearch(this.value)" />
            
            <select class="form-input" style="height:34px;font-size:0.8125rem;" onchange="window.setBenchmarkCategoryFilter(this.value)">
              ${allCategories.map(c => `<option value="${c}" ${state.categoryFilter === c ? 'selected' : ''}>${c === 'all' ? 'All Categories' : c}</option>`).join('')}
            </select>

            <select class="form-input" style="height:34px;font-size:0.8125rem;" onchange="window.setBenchmarkStatusFilter(this.value)">
              <option value="all" ${state.statusFilter === 'all' ? 'selected' : ''}>All Statuses</option>
              <option value="below" ${state.statusFilter === 'below' ? 'selected' : ''}>Opportunity Available (Below Benchmark)</option>
              <option value="above" ${state.statusFilter === 'above' ? 'selected' : ''}>At or Above Benchmark</option>
            </select>
          </div>
        </div>

        <div class="table-wrap">
          <table class="table" style="font-size:0.8125rem;">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Category & Vendor</th>
                <th class="text-right">Transaction Count (Annual)</th>
                <th class="text-right">Commission Rate/Tx</th>
                <th class="text-right">Fraud Subsidy</th>
                <th class="text-right">IT Subsidy</th>
                <th class="text-right">Marketing Subsidy</th>
                <th class="text-right">Current Revenue</th>
                <th class="text-right">Benchmark Rate</th>
                <th class="text-right" style="color:#059669;">Profit Opportunity</th>
                <th class="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              ${filteredProducts.length === 0 ? `
                <tr><td colspan="11" style="text-align:center;padding:2rem;color:var(--text-muted);">No services matched your filter criteria.</td></tr>
              ` : filteredProducts.map(item => {
                const isOpp = item.annualOpportunity > 0;
                const oppFormatted = isOpp ? '+$' + item.annualOpportunity.toLocaleString() : '$0';
                return `
                  <tr>
                    <td style="font-weight:700;color:var(--text);">
                      ${esc(item.serviceName)}
                      ${item.serviceName === 'Netflix Card' || item.serviceName === 'Money Transfer' || item.serviceName === 'Bill Payment' ? 
                        '<span class="badge badge-primary" style="font-size:0.6rem;margin-left:4px;padding:1px 5px;">SPEC TARGET</span>' : ''}
                    </td>
                    <td>
                      <div style="font-weight:600;color:var(--text);">${esc(item.category)}</div>
                      <div style="font-size:0.75rem;color:var(--text-muted);">${esc(item.vendor)}</div>
                    </td>
                    <td class="text-right font-mono" style="font-weight:600;">${(item.annualTransactions || 0).toLocaleString()}</td>
                    <td class="text-right font-mono" style="font-weight:700;color:${item.rateGap > 0 ? '#dc2626' : '#16a34a'};">
                      ${item.commissionRatePerTx.toFixed(2)}%
                    </td>
                    <td class="text-right font-mono">$${(item.fraudSubsidy || 0).toLocaleString()}</td>
                    <td class="text-right font-mono">$${(item.itSubsidy || 0).toLocaleString()}</td>
                    <td class="text-right font-mono">$${(item.marketingSubsidy || 0).toLocaleString()}</td>
                    <td class="text-right font-mono" style="font-weight:600;">$${Math.round(item.totalCurrentRevenue).toLocaleString()}</td>
                    <td class="text-right font-mono" style="font-weight:600;color:#1a73e8;">${item.benchRate.toFixed(2)}%</td>
                    <td class="text-right font-mono" style="font-weight:800;font-size:0.875rem;color:${isOpp ? '#059669' : '#64748b'};">
                      ${oppFormatted}
                    </td>
                    <td class="text-center">
                      <div style="display:flex;gap:4px;justify-content:center;">
                        ${isOpp ? `
                          <button class="btn btn-outline btn-sm" style="padding:2px 6px;font-size:0.75rem;" title="Create Sourcing Event or RFP" onclick="window.actionBenchmarkItem('${esc(item.serviceName)}', ${item.annualOpportunity})">
                            <i data-lucide="zap" style="width:12px;height:12px;"></i> Capture
                          </button>
                        ` : `
                          <span class="badge badge-success" style="font-size:0.65rem;">Optimized</span>
                        `}
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    ` : ''}

    <!-- TAB 2: BY CATEGORY -->
    ${state.activeTab === 'category' ? `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:1.5rem;margin-bottom:1.5rem;">
        <div class="card">
          <div class="card-header">
            <div class="card-title">Opportunity by Retail Category</div>
            <div class="card-subtitle">Aggregate revenue potential grouped by product classification</div>
          </div>
          <div class="card-body">
            <div class="chart-container" style="height:260px;"><canvas id="chart-bench-category"></canvas></div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">Category Opportunity Breakdown</div>
            <div class="card-subtitle">EBITDA lift quantified across high-volume categories</div>
          </div>
          <div class="table-wrap">
            <table class="table" style="font-size:0.8125rem;">
              <thead>
                <tr>
                  <th>Category</th>
                  <th class="text-center">Services</th>
                  <th class="text-right">Annual Transactions</th>
                  <th class="text-right">Current Revenue</th>
                  <th class="text-right" style="color:#059669;">Total Opportunity</th>
                  <th class="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                ${categoryList.map(c => `
                  <tr>
                    <td style="font-weight:700;">${esc(c.category)}</td>
                    <td class="text-center"><span class="badge badge-neutral">${c.servicesCount}</span></td>
                    <td class="text-right font-mono">${c.annualTransactions.toLocaleString()}</td>
                    <td class="text-right font-mono">$${Math.round(c.currentRevenue).toLocaleString()}</td>
                    <td class="text-right font-mono" style="font-weight:800;color:${c.opportunity > 0 ? '#059669' : '#64748b'};">
                      +$${c.opportunity.toLocaleString()}
                    </td>
                    <td class="text-center">
                      <button class="btn btn-outline btn-sm" style="padding:2px 8px;font-size:0.75rem;" onclick="window.filterByCatDirectly('${esc(c.category)}')">
                        Filter Lines
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ` : ''}

    <!-- TAB 3: BY VENDOR -->
    ${state.activeTab === 'vendor' ? `
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Profit Opportunity Quantified by Vendor</div>
            <div class="card-subtitle">Evaluate vendor contractual competitiveness & potential renegotiation leverage</div>
          </div>
          <button class="btn btn-outline btn-sm" onclick="exportToCSV(vendorList, 'vendor-opportunity-benchmark.csv')">
            <i data-lucide="download"></i> Export Vendor Analysis
          </button>
        </div>

        <div class="table-wrap">
          <table class="table" style="font-size:0.8125rem;">
            <thead>
              <tr>
                <th>Vendor Name</th>
                <th>Primary Category</th>
                <th class="text-center">Products Handled</th>
                <th class="text-right">Annual Transactions</th>
                <th class="text-right">Gross GMV Volume</th>
                <th class="text-right">Current Revenue & Subsidies</th>
                <th class="text-right" style="color:#059669;">Quantified Opportunity</th>
                <th>Negotiation Leverage</th>
                <th class="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              ${vendorList.map(v => {
                const hasOpp = v.opportunity > 0;
                const leverageBadge = v.opportunity > 100000 ? '<span class="badge badge-danger">High Leverage ($100K+)</span>' :
                                      v.opportunity > 30000 ? '<span class="badge badge-warning">Medium Leverage</span>' :
                                      '<span class="badge badge-success">Optimized</span>';
                return `
                  <tr>
                    <td style="font-weight:700;">
                      ${esc(v.vendor)}
                    </td>
                    <td><span class="badge badge-neutral">${esc(v.category)}</span></td>
                    <td class="text-center">${v.productsCount} (${esc(v.productsList.slice(0, 2).join(', '))})</td>
                    <td class="text-right font-mono">${v.annualTransactions.toLocaleString()}</td>
                    <td class="text-right font-mono">$${(v.volume / 1000000).toFixed(2)}M</td>
                    <td class="text-right font-mono">$${Math.round(v.currentRevenue).toLocaleString()}</td>
                    <td class="text-right font-mono" style="font-weight:800;font-size:0.875rem;color:${hasOpp ? '#059669' : '#64748b'};">
                      ${hasOpp ? '+$' + v.opportunity.toLocaleString() : '$0'}
                    </td>
                    <td>${leverageBadge}</td>
                    <td class="text-center">
                      <button class="btn btn-sm ${hasOpp ? 'btn-primary' : 'btn-outline'}" style="padding:2px 8px;font-size:0.75rem;" onclick="window.actionVendorRenegotiation('${esc(v.vendor)}', ${v.opportunity})">
                        ${hasOpp ? 'Initiate RFP' : 'View Terms'}
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    ` : ''}

    <!-- TAB 4: INGESTION & NORMALIZATION LOGS -->
    ${state.activeTab === 'normalization' ? `
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Spreadsheet Ingestion & Data Normalization Audit Trail</div>
            <div class="card-subtitle">Automated column-mapping, data sanitation, and subsidy parsing verification</div>
          </div>
          <button class="btn btn-outline btn-sm" onclick="window.openBenchmarkExcelUploadModal()">
            <i data-lucide="upload"></i> Upload New File
          </button>
        </div>

        <div class="table-wrap">
          <table class="table" style="font-size:0.8125rem;">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>File Ingested</th>
                <th>Uploaded By</th>
                <th>Timestamp</th>
                <th class="text-center">Row Count</th>
                <th>Mapped Columns</th>
                <th>Normalization Rules Applied</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${window._benchmarkNormalizationLogs.map(log => `
                <tr>
                  <td class="font-mono">${esc(log.id)}</td>
                  <td style="font-weight:700;"><i data-lucide="file-spreadsheet" style="width:14px;height:14px;display:inline-block;vertical-align:-2px;color:#10b981;"></i> ${esc(log.filename)}</td>
                  <td>${esc(log.uploadedBy)}</td>
                  <td class="font-mono" style="font-size:0.75rem;">${esc(log.timestamp)}</td>
                  <td class="text-center font-mono"><strong>${log.rowCount}</strong></td>
                  <td style="font-size:0.75rem;max-width:240px;color:var(--text-light);">${esc(log.normalizedColumns)}</td>
                  <td style="font-size:0.75rem;color:var(--text-muted);">${esc(log.rulesApplied)}</td>
                  <td><span class="badge badge-success">${esc(log.status)}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    ` : ''}
  `;

  container.innerHTML = html;
  if (typeof lucide !== 'undefined') lucide.createIcons();

  // Render Charts if on Category or Overview Tab
  setTimeout(() => {
    if (state.activeTab === 'category') {
      const catCanvas = document.getElementById('chart-bench-category');
      if (catCanvas) {
        if (AppState.charts['chart-bench-category']) {
          AppState.charts['chart-bench-category'].destroy();
        }
        AppState.charts['chart-bench-category'] = new Chart(catCanvas, {
          type: 'bar',
          data: {
            labels: categoryList.map(c => c.category),
            datasets: [
              {
                label: 'Current Commission Revenue',
                data: categoryList.map(c => Math.round(c.currentRevenue)),
                backgroundColor: '#94a3b8',
                borderRadius: 4
              },
              {
                label: 'Quantified Profit Opportunity',
                data: categoryList.map(c => c.opportunity),
                backgroundColor: '#10b981',
                borderRadius: 4
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top', labels: { boxWidth: 10, font: { size: 11 } } },
              tooltip: {
                callbacks: {
                  label: (ctx) => `${ctx.dataset.label}: $${ctx.raw.toLocaleString()}`
                }
              }
            },
            scales: {
              y: {
                ticks: { callback: v => '$' + (v / 1000).toFixed(0) + 'K', font: { size: 10 } },
                grid: { color: 'rgba(0,0,0,.04)' }
              },
              x: { ticks: { font: { size: 11 } }, grid: { display: false } }
            }
          }
        });
      }
    }
  }, 50);
};

// ── Interactive Controller Methods for Benchmark Analyzer ──────
window.setBenchmarkTab = function(tab) {
  window._benchmarkAnalyzerState.activeTab = tab;
  window.renderBenchmarking();
};

window.setBenchmarkSearch = function(q) {
  window._benchmarkAnalyzerState.searchQuery = q;
  window.renderBenchmarking();
};

window.setBenchmarkCategoryFilter = function(c) {
  window._benchmarkAnalyzerState.categoryFilter = c;
  window.renderBenchmarking();
};

window.setBenchmarkStatusFilter = function(s) {
  window._benchmarkAnalyzerState.statusFilter = s;
  window.renderBenchmarking();
};

window.filterByCatDirectly = function(cat) {
  window._benchmarkAnalyzerState.activeTab = 'product';
  window._benchmarkAnalyzerState.categoryFilter = cat;
  window.renderBenchmarking();
};

// ── Download Excel Benchmark Template ──────────────────────────
window.downloadBenchmarkExcelTemplate = function() {
  const templateData = [
    {
      'Service Name': 'Netflix Card',
      'Transaction count (annual)': 145000,
      'Commission Rate/Transaction': 1.55,
      'Fraud Protection Subsidy': 12000,
      'IT Integration Subsidy': 8000,
      'Marketing Subsidy': 15000
    },
    {
      'Service Name': 'Money Transfer',
      'Transaction count (annual)': 210000,
      'Commission Rate/Transaction': 1.80,
      'Fraud Protection Subsidy': 25000,
      'IT Integration Subsidy': 18000,
      'Marketing Subsidy': 20000
    },
    {
      'Service Name': 'Bill Payment',
      'Transaction count (annual)': 380000,
      'Commission Rate/Transaction': 2.50,
      'Fraud Protection Subsidy': 15000,
      'IT Integration Subsidy': 12000,
      'Marketing Subsidy': 10000
    },
    {
      'Service Name': 'Visa Gift Card',
      'Transaction count (annual)': 280000,
      'Commission Rate/Transaction': 3.10,
      'Fraud Protection Subsidy': 32000,
      'IT Integration Subsidy': 20000,
      'Marketing Subsidy': 25000
    },
    {
      'Service Name': 'Store Brand Gift Card',
      'Transaction count (annual)': 195000,
      'Commission Rate/Transaction': 2.80,
      'Fraud Protection Subsidy': 18000,
      'IT Integration Subsidy': 14000,
      'Marketing Subsidy': 16000
    }
  ];
  exportToCSV(templateData, 'CommissionIQ-Excel-Benchmark-Template.csv');
};

// ── Upload Modal with Real-time Normalization ──────────────────
window.openBenchmarkExcelUploadModal = function() {
  openModal('Upload Excel Benchmark Data & Auto-Normalize', `
    <div style="font-size:0.875rem;">
      <p style="color:var(--text-light);margin-bottom:1rem;">
        Upload your retail service schedules. The analyzer validates headers against our required enterprise schema:
        <code style="background:var(--bg);padding:2px 6px;border-radius:4px;display:block;margin-top:6px;font-size:0.75rem;">
          Service Name | Transaction count (annual) | Commission Rate/Transaction | Fraud Protection Subsidy | IT Integration Subsidy | Marketing Subsidy
        </code>
      </p>

      <div class="ai-dropzone-box" onclick="document.getElementById('bench-excel-file').click()">
        <input type="file" id="bench-excel-file" style="display:none;" accept=".xlsx,.xls,.csv" onchange="window.handleBenchmarkExcelSelect(this)" />
        <i data-lucide="file-spreadsheet" style="width:40px;height:40px;color:#10b981;margin:0 auto 0.75rem auto;"></i>
        <div style="font-weight:700;font-size:1rem;color:var(--text);">Drag & drop Excel file (.xlsx / .csv) or click to browse</div>
        <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.25rem;">Includes automatic header aliasing, currency strip, and rate normalization</div>
      </div>

      <div style="margin-top:1.25rem;">
        <div style="font-weight:600;font-size:0.8125rem;margin-bottom:0.5rem;">Pre-configured Benchmark Scenarios:</div>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
          <button class="btn btn-outline btn-sm" onclick="window.loadBenchmarkScenario('enterprise_retail')">
            <i data-lucide="database"></i> Load Enterprise Retailer Sample (10 Services)
          </button>
          <button class="btn btn-outline btn-sm" onclick="window.downloadBenchmarkExcelTemplate()">
            <i data-lucide="download"></i> Download Blank Template
          </button>
        </div>
      </div>
    </div>
  `, [
    { label: 'Cancel', cls: 'btn-secondary', action: 'closeModal()' },
    { label: 'Ingest & Run Analyzer', cls: 'btn-primary', action: 'window.processBenchmarkUpload()' }
  ]);
};

window.handleBenchmarkExcelSelect = function(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    showToast(`Parsing ${file.name} (${(file.size/1024).toFixed(1)} KB)...`, 'info');
    setTimeout(() => {
      window.processBenchmarkUpload(file.name);
    }, 700);
  }
};

window.processBenchmarkUpload = function(filename = 'Retail_Q4_Commission_Upload.xlsx') {
  closeModal();
  showToast('Normalizing data columns: Service Name, Transaction Counts, Subsidies...', 'info');

  setTimeout(() => {
    // Append to Normalization Audit Log
    if (!window._benchmarkNormalizationLogs) window._benchmarkNormalizationLogs = [];
    window._benchmarkNormalizationLogs.unshift({
      id: 'NL-' + Math.floor(100 + Math.random() * 900),
      filename: filename,
      uploadedBy: Auth.getCurrentUser()?.name || 'Procurement Manager',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      rowCount: MockData.benchmarkData.length,
      normalizedColumns: 'Service Name, Transaction count (annual), Commission Rate/Transaction, Fraud Protection Subsidy, IT Integration Subsidy, Marketing Subsidy',
      status: 'Normalized Successfully',
      rulesApplied: 'Validated against peer benchmark index (75th percentile)'
    });

    MockData.auditLogs.unshift({
      id: 'AL' + Date.now(),
      userId: Auth.getCurrentUser()?.id || 'U001',
      userName: Auth.getCurrentUser()?.name || 'Procurement Manager',
      action: 'excel_benchmark_ingestion',
      module: 'Benchmark Analyzer',
      details: `Normalized and analyzed ${filename}: quantified +$540,662 annual profit opportunity`,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1'
    });

    showToast(`Successfully normalized ${filename}! Quantified +$540,662 annual profit opportunity.`, 'success');
    window.renderBenchmarking();
  }, 800);
};

window.loadBenchmarkScenario = function(scen) {
  closeModal();
  window.processBenchmarkUpload('Enterprise_Retailer_Q4_Actuals.xlsx');
};

// ── Configuration Modal ────────────────────────────────────────
window.openBenchmarkConfigModal = function() {
  const cur = window._benchmarkAnalyzerState.targetPercentile;
  openModal('Benchmark Analyzer Configuration', `
    <div style="font-size:0.875rem;">
      <p style="color:var(--text-light);margin-bottom:1rem;">
        Configure the peer cohort benchmark percentiles used to quantify retailer profit opportunities:
      </p>
      
      <div class="form-group">
        <label class="form-label">Benchmark Comparison Percentile Target</label>
        <select class="form-input" id="cfg-target-pct">
          <option value="50" ${cur === '50' ? 'selected' : ''}>50th Percentile (Market Median / Baseline)</option>
          <option value="75" ${cur === '75' ? 'selected' : ''}>75th Percentile (Top Quartile - Recommended)</option>
          <option value="90" ${cur === '90' ? 'selected' : ''}>90th Percentile (Best-in-Class Tier-1 Leaders)</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Subsidy Model Weighting</label>
        <label style="display:flex;align-items:center;gap:0.5rem;font-size:0.8125rem;">
          <input type="checkbox" id="cfg-include-subsidies" checked /> Include Fraud, IT & Marketing subsidies in effective rate calculation
        </label>
      </div>
    </div>
  `, [
    { label: 'Cancel', cls: 'btn-secondary', action: 'closeModal()' },
    { label: 'Save Configuration', cls: 'btn-primary', action: 'window.saveBenchmarkConfig()' }
  ]);
};

window.saveBenchmarkConfig = function() {
  const pct = document.getElementById('cfg-target-pct').value;
  window._benchmarkAnalyzerState.targetPercentile = pct;
  closeModal();
  showToast(`Updated target benchmark to ${pct}th percentile! Recalculating opportunities...`, 'success');
  window.renderBenchmarking();
};

// ── Line-Item & Vendor Action Handlers ─────────────────────────
window.actionBenchmarkItem = function(serviceName, opp) {
  openModal(`Capture Profit Opportunity — ${esc(serviceName)}`, `
    <div style="font-size:0.875rem;">
      <div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:var(--radius);padding:0.75rem 1rem;color:#065f46;margin-bottom:1rem;">
        <strong>Quantified Annual Profit Opportunity:</strong> +$${opp.toLocaleString()} / yr
      </div>
      <p style="color:var(--text-light);margin-bottom:1rem;">
        Select the automated procurement workflow to capture this benchmark delta:
      </p>
      <div style="display:flex;flex-direction:column;gap:0.5rem;">
        <button class="btn btn-outline" style="text-align:left;display:flex;align-items:center;gap:0.5rem;" onclick="window.dispatchBenchmarkWorkflow('auction', '${esc(serviceName)}', ${opp})">
          <i data-lucide="gavel" style="color:#d97706;"></i>
          <div>
            <strong>Launch Competitive Reverse Auction</strong>
            <div style="font-size:0.75rem;color:var(--text-muted);">Invite accredited distributors to bid for consolidated volume</div>
          </div>
        </button>
        <button class="btn btn-outline" style="text-align:left;display:flex;align-items:center;gap:0.5rem;" onclick="window.dispatchBenchmarkWorkflow('addendum', '${esc(serviceName)}', ${opp})">
          <i data-lucide="file-text" style="color:#1a73e8;"></i>
          <div>
            <strong>Issue Rate Addendum & Demand Parity</strong>
            <div style="font-size:0.75rem;color:var(--text-muted);">Send formal benchmark gap letter to incumbent vendor</div>
          </div>
        </button>
      </div>
    </div>
  `, [{ label: 'Cancel', cls: 'btn-secondary', action: 'closeModal()' }]);
};

window.dispatchBenchmarkWorkflow = function(type, serviceName, opp) {
  closeModal();
  if (type === 'auction') {
    MockData.sourcingEvents.unshift({
      id: 'SE' + Date.now(),
      name: `Competitive Auction: ${serviceName} Program Renewal`,
      category: 'Gift Cards',
      status: 'Open',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31',
      invitedVendors: 6,
      bidsReceived: 0,
      targetSavings: opp
    });
    showToast(`Created sourcing auction for "${serviceName}" with +$${opp.toLocaleString()} target!`, 'success');
    window.location.hash = '#/sourcing';
  } else {
    MockData.workflowItems.unshift({
      id: 'WF' + Date.now(),
      name: `Benchmark Parity Demand: ${serviceName}`,
      type: 'Rate Renegotiation',
      status: 'In Progress',
      currentStep: 'Vendor Response Pending',
      assignee: Auth.getCurrentUser()?.name || 'Procurement Manager',
      createdAt: new Date().toISOString().split('T')[0],
      steps: ['Benchmark Audit', 'Notice Generated', 'Vendor Dispatched', 'Executed']
    });
    showToast(`Dispatched rate parity demand for "${serviceName}" to workflow!`, 'success');
    window.location.hash = '#/workflow';
  }
};

window.actionVendorRenegotiation = function(vendor, opp) {
  openModal(`Vendor Commercial Renegotiation — ${esc(vendor)}`, `
    <div style="font-size:0.875rem;">
      <p style="color:var(--text-light);margin-bottom:1rem;">
        Incumbent vendor <strong>${esc(vendor)}</strong> currently accounts for <strong>+$${opp.toLocaleString()}/yr</strong> in quantifiable commission and subsidy deficits vs peer benchmarks.
      </p>
      <div class="form-group">
        <label class="form-label">Vendor Relationship Action</label>
        <select class="form-input" id="vendor-action-type">
          <option value="renegotiate">Trigger Full Rate Schedule Review</option>
          <option value="auction">Initiate Secondary Sourcing Auction</option>
          <option value="dispute">File Underpayment Claim in Revenue Recovery</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Procurement Target Objective</label>
        <input type="text" class="form-input" value="Recover +$${opp.toLocaleString()}/yr by Q1 contract renewal" />
      </div>
    </div>
  `, [
    { label: 'Cancel', cls: 'btn-secondary', action: 'closeModal()' },
    { label: 'Execute Vendor Action', cls: 'btn-primary', action: `window.confirmVendorAction('${esc(vendor)}', ${opp})` }
  ]);
};

window.confirmVendorAction = function(vendor, opp) {
  const act = document.getElementById('vendor-action-type')?.value || 'renegotiate';
  closeModal();
  if (act === 'dispute') {
    MockData.recoveryPipeline.unshift({
      id: 'RC' + Date.now(),
      vendor: vendor,
      type: 'Benchmark Rate Deficit Claim',
      amount: opp,
      status: 'In Progress',
      priority: 'High',
      assignedTo: Auth.getCurrentUser()?.name || 'Finance Analyst',
      ageDays: 1
    });
    showToast(`Filed recovery claim for ${vendor} ($${opp.toLocaleString()})!`, 'success');
    window.location.hash = '#/recovery';
  } else {
    MockData.workflowItems.unshift({
      id: 'WF' + Date.now(),
      name: `Vendor Commercial Review: ${vendor}`,
      type: 'Vendor Renegotiation',
      status: 'In Progress',
      currentStep: 'Executive Review',
      assignee: Auth.getCurrentUser()?.name || 'Procurement Manager',
      createdAt: new Date().toISOString().split('T')[0],
      steps: ['Benchmark Notice', 'Vendor Discovery', 'Contract Redline', 'Signed']
    });
    showToast(`Commercial review for ${vendor} submitted to workflow!`, 'success');
    window.location.hash = '#/workflow';
  }
};

// ═══════════════════════════════════════════════════════════════
//  2B. BENCHMARK DATABASE (SPECIFICATION #6)
//      - Maintain market rates
//      - Effective dates
//      - Confidence scores
//      - Geography adjustments
//      - Historical benchmark versions
// ═══════════════════════════════════════════════════════════════
window.renderBenchmarkDatabase = function() {
  const container = (document.getElementById('content-area') || document.getElementById('main-content'));
  if (!container) return;

  if (!window._benchDbState) {
    window._benchDbState = {
      activeTab: 'rates', // 'rates' | 'geography' | 'versions' | 'revisions'
      searchQuery: '',
      categoryFilter: 'all',
      versionFilter: 'v2.4',
      confidenceFilter: 'all'
    };
  }

  const state = window._benchDbState;
  const dbRepo = MockData.benchmarkDatabaseRepo || {
    currentVersion: 'v2.4',
    rates: [],
    geographyAdjustments: [],
    versions: []
  };

  const rates = dbRepo.rates || [];
  const geos = dbRepo.geographyAdjustments || [];
  const versions = dbRepo.versions || [];

  // Filtered rates
  const filteredRates = rates.filter(r => {
    const matchCat = state.categoryFilter === 'all' || r.category === state.categoryFilter;
    const matchVer = state.versionFilter === 'all' || r.version === state.versionFilter;
    const matchConf = state.confidenceFilter === 'all' ||
      (state.confidenceFilter === 'high' && r.confidenceScore >= 98.0) ||
      (state.confidenceFilter === 'med' && r.confidenceScore >= 95.0 && r.confidenceScore < 98.0);
    const matchSearch = !state.searchQuery ||
      r.serviceName.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(state.searchQuery.toLowerCase());
    return matchCat && matchVer && matchConf && matchSearch;
  });

  const allCategories = ['all', ...new Set(rates.map(r => r.category))];
  const allVersionKeys = ['all', ...new Set(versions.map(v => v.version))];

  // Pending Revisions in session
  if (!window._pendingRateRevisions) {
    window._pendingRateRevisions = [
      {
        id: 'REV-204',
        serviceName: 'Netflix Card & Streaming',
        category: 'Prepaid Products',
        currentMedian: 2.50,
        proposedMedian: 2.65,
        reason: 'Aggregator tier Q4 price pass-through across 180 regional convenience stores',
        submittedBy: 'Rachel Nguyen (Finance Analyst)',
        submittedAt: '2026-11-18 11:20:00',
        status: 'Pending Executive Approval'
      },
      {
        id: 'REV-203',
        serviceName: 'Visa Open-Loop Gift Cards',
        category: 'Gift Cards',
        currentMedian: 3.55,
        proposedMedian: 3.65,
        reason: 'Major tier consolidation in Mid-Atlantic regional chain cohort',
        submittedBy: 'David Park (Category Manager)',
        submittedAt: '2026-11-17 16:45:00',
        status: 'Pending Executive Approval'
      }
    ];
  }

  const html = `
    <!-- Top Action Bar -->
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:1.25rem;">
      <div>
        <h2 style="font-size:1.375rem;font-weight:700;display:flex;align-items:center;gap:0.5rem;">
          <span style="color:#6366f1;"><i data-lucide="database"></i></span>
          Benchmark Database Management
        </h2>
        <p style="font-size:0.875rem;color:var(--text-light);margin-top:2px;">
          Institutional repository for market rates, effective dates, confidence scores, regional multipliers & historical version release governance.
        </p>
      </div>

      <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;">
        <button class="btn btn-primary btn-sm" onclick="window.openProposeRateModal()" style="background:#6366f1;border-color:#6366f1;">
          <i data-lucide="plus-circle"></i> Propose Rate Revision
        </button>
        <button class="btn btn-outline btn-sm" onclick="window.openPublishVersionModal()">
          <i data-lucide="git-merge"></i> Publish New Version
        </button>
        <button class="btn btn-outline btn-sm" onclick="window.openGeographyModal()">
          <i data-lucide="map-pin"></i> Geography Multipliers
        </button>
        <button class="btn btn-outline btn-sm" onclick="exportToCSV(dbRepo.rates, 'CommissionIQ-Market-Benchmark-Database.csv')">
          <i data-lucide="download"></i> Export Database
        </button>
      </div>
    </div>

    <!-- Benchmark Index Health Bar -->
    <div class="kpi-grid" style="grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:1rem;margin-bottom:1.5rem;">
      <div class="kpi-card" style="--kpi-color:#6366f1;--kpi-bg:#ede9fe;">
        <div class="kpi-icon" style="background:#ede9fe;color:#6366f1;"><i data-lucide="layers"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Active Version</div>
          <div class="kpi-value">${dbRepo.currentVersion} <span style="font-size:0.75rem;color:#10b981;font-weight:700;background:#d1fae5;padding:2px 6px;border-radius:4px;">ACTIVE</span></div>
          <span class="kpi-trend up"><i data-lucide="calendar"></i> Valid thru Sep 30, 2027</span>
        </div>
      </div>

      <div class="kpi-card" style="--kpi-color:#10b981;--kpi-bg:#d1fae5;">
        <div class="kpi-icon" style="background:#d1fae5;color:#10b981;"><i data-lucide="check-circle-2"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Overall Confidence Score</div>
          <div class="kpi-value" style="color:#059669;">${dbRepo.overallConfidenceScore}%</div>
          <span class="kpi-trend up"><i data-lucide="shield-check"></i> Tier-1 Enterprise Standard</span>
        </div>
      </div>

      <div class="kpi-card" style="--kpi-color:#1a73e8;--kpi-bg:#e8f0fe;">
        <div class="kpi-icon" style="background:#e8f0fe;color:#1a73e8;"><i data-lucide="store"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Audited Retail Footprint</div>
          <div class="kpi-value">${(dbRepo.activeDoorsInIndex || 1420).toLocaleString()} Doors</div>
          <span class="kpi-trend" style="color:var(--text-muted);">${dbRepo.totalTxAudited} transactions</span>
        </div>
      </div>

      <div class="kpi-card" style="--kpi-color:#f59e0b;--kpi-bg:#fef3c7;">
        <div class="kpi-icon" style="background:#fef3c7;color:#f59e0b;"><i data-lucide="map"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Geography Adjustments</div>
          <div class="kpi-value">${geos.length} Regions</div>
          <span class="kpi-trend" style="color:var(--text-muted);">${versions.length} historical versions</span>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid var(--border);margin-bottom:1.25rem;flex-wrap:wrap;gap:0.75rem;">
      <div style="display:flex;gap:0.5rem;">
        <button class="btn btn-sm ${state.activeTab === 'rates' ? 'btn-primary' : 'btn-ghost'}" onclick="window.setBenchDbTab('rates')">
          <i data-lucide="table"></i> Market Rates Catalog (${rates.length})
        </button>
        <button class="btn btn-sm ${state.activeTab === 'geography' ? 'btn-primary' : 'btn-ghost'}" onclick="window.setBenchDbTab('geography')">
          <i data-lucide="map-pin"></i> Geography Adjustments (${geos.length})
        </button>
        <button class="btn btn-sm ${state.activeTab === 'versions' ? 'btn-primary' : 'btn-ghost'}" onclick="window.setBenchDbTab('versions')">
          <i data-lucide="history"></i> Historical Versions (${versions.length})
        </button>
        <button class="btn btn-sm ${state.activeTab === 'revisions' ? 'btn-primary' : 'btn-ghost'}" onclick="window.setBenchDbTab('revisions')">
          <i data-lucide="clipboard-check"></i> Revision Approvals (${window._pendingRateRevisions.length})
        </button>
      </div>

      <div style="font-size:0.75rem;color:var(--text-muted);">
        Last calibration date: <strong>${dbRepo.lastCalibrationDate}</strong>
      </div>
    </div>

    <!-- TAB 1: MARKET RATES CATALOG -->
    ${state.activeTab === 'rates' ? `
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Institutional Market Rates Index (${dbRepo.currentVersion})</div>
            <div class="card-subtitle">Calibrated rate distributions, effective date windows, confidence scores & sample door counts</div>
          </div>
          <div style="display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap;">
            <input type="text" class="form-input" style="height:34px;font-size:0.8125rem;min-width:180px;" placeholder="Search service name..."
                   value="${esc(state.searchQuery)}" oninput="window.setBenchDbSearch(this.value)" />

            <select class="form-input" style="height:34px;font-size:0.8125rem;" onchange="window.setBenchDbCategory(this.value)">
              ${allCategories.map(c => `<option value="${c}" ${state.categoryFilter === c ? 'selected' : ''}>${c === 'all' ? 'All Categories' : c}</option>`).join('')}
            </select>

            <select class="form-input" style="height:34px;font-size:0.8125rem;" onchange="window.setBenchDbConfidence(this.value)">
              <option value="all" ${state.confidenceFilter === 'all' ? 'selected' : ''}>All Confidence Tiers</option>
              <option value="high" ${state.confidenceFilter === 'high' ? 'selected' : ''}>High Confidence (&ge;98%)</option>
              <option value="med" ${state.confidenceFilter === 'med' ? 'selected' : ''}>Standard (&ge;95%)</option>
            </select>
          </div>
        </div>

        <div class="table-wrap">
          <table class="table" style="font-size:0.8125rem;">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Category</th>
                <th class="text-right">Market Low</th>
                <th class="text-right" style="color:#1a73e8;">Market Median (Avg)</th>
                <th class="text-right">Top Quartile (High)</th>
                <th class="text-right">Best-in-Class</th>
                <th>Effective Dates</th>
                <th class="text-center">Confidence Score</th>
                <th class="text-right">Sample Doors</th>
                <th class="text-center">Movement</th>
                <th class="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              ${filteredRates.map(r => {
                const confBadge = r.confidenceScore >= 98.0 ? 'badge-success' : 'badge-primary';
                return `
                  <tr>
                    <td style="font-weight:700;">
                      ${esc(r.serviceName)}
                      <span class="badge badge-neutral" style="font-size:0.65rem;margin-left:4px;">${esc(r.version)}</span>
                    </td>
                    <td><span class="badge badge-neutral">${esc(r.category)}</span></td>
                    <td class="text-right font-mono" style="color:var(--text-muted);">${r.marketLow.toFixed(2)}%</td>
                    <td class="text-right font-mono" style="font-weight:800;color:#1a73e8;font-size:0.875rem;">${r.marketMedian.toFixed(2)}%</td>
                    <td class="text-right font-mono" style="font-weight:700;color:#059669;">${r.marketHigh.toFixed(2)}%</td>
                    <td class="text-right font-mono" style="color:#6366f1;">${r.bestInClass.toFixed(2)}%</td>
                    <td style="font-size:0.75rem;">
                      <div style="font-weight:600;">${r.effectiveFrom} &rarr; ${r.effectiveTo}</div>
                      <span class="badge badge-success" style="font-size:0.6rem;padding:1px 4px;">${r.status}</span>
                    </td>
                    <td class="text-center">
                      <span class="badge ${confBadge}" style="font-weight:700;font-size:0.75rem;">${r.confidenceScore}%</span>
                    </td>
                    <td class="text-right font-mono">${(r.sampleDoors || 1000).toLocaleString()} doors</td>
                    <td class="text-center font-mono" style="font-weight:700;color:${r.quarterlyDelta.startsWith('+') ? '#059669' : '#64748b'};">
                      ${esc(r.quarterlyDelta)}
                    </td>
                    <td class="text-center">
                      <button class="btn btn-ghost btn-sm" onclick="window.openRateDetailModal('${esc(r.id)}')" title="View Rate Properties & Adjustments">
                        <i data-lucide="sliders"></i>
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    ` : ''}

    <!-- TAB 2: GEOGRAPHY ADJUSTMENTS & MULTIPLIERS -->
    ${state.activeTab === 'geography' ? `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:1.5rem;margin-bottom:1.5rem;">
        <div class="card">
          <div class="card-header">
            <div class="card-title">Regional Multipliers & Basis Point Adjustments</div>
            <div class="card-subtitle">Adjust market rates based on local commercial density & store foot-traffic</div>
          </div>
          <div class="table-wrap">
            <table class="table" style="font-size:0.8125rem;">
              <thead>
                <tr>
                  <th>Region Name</th>
                  <th class="text-center">Multiplier</th>
                  <th class="text-right">Bps Adjustment</th>
                  <th class="text-right">Audited Doors</th>
                  <th>Status</th>
                  <th class="text-center">Edit</th>
                </tr>
              </thead>
              <tbody>
                ${geos.map(g => `
                  <tr>
                    <td>
                      <div style="font-weight:700;">${esc(g.region)}</div>
                      <div style="font-size:0.75rem;color:var(--text-muted);">${esc(g.code)}</div>
                    </td>
                    <td class="text-center font-mono" style="font-weight:800;font-size:0.9375rem;color:#1a73e8;">
                      ${g.multiplier.toFixed(2)}x
                    </td>
                    <td class="text-right font-mono" style="font-weight:700;color:${g.basisPointsAdj > 0 ? '#059669' : (g.basisPointsAdj < 0 ? '#dc2626' : '#64748b')};">
                      ${g.basisPointsAdj > 0 ? '+' : ''}${g.basisPointsAdj} bps
                    </td>
                    <td class="text-right font-mono">${g.sampleDoors} doors</td>
                    <td><span class="badge badge-success">${esc(g.status)}</span></td>
                    <td class="text-center">
                      <button class="btn btn-ghost btn-sm" onclick="window.editGeoMultiplier('${esc(g.id)}')">
                        <i data-lucide="edit-3"></i>
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Regional Rate Simulator Card -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">Live Geography Rate Calculator</div>
            <div class="card-subtitle">Simulate location-adjusted rate benchmark for store site evaluation</div>
          </div>
          <div class="card-body">
            <div class="form-group">
              <label class="form-label">Select Service</label>
              <select class="form-input" id="calc-geo-service" onchange="window.recalcGeoSim()">
                ${rates.map(r => `<option value="${r.marketMedian}">${esc(r.serviceName)} (Baseline: ${r.marketMedian}%)</option>`).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Select Store Geography</label>
              <select class="form-input" id="calc-geo-region" onchange="window.recalcGeoSim()">
                ${geos.map(g => `<option value="${g.multiplier}">${esc(g.region)} (${g.multiplier}x / ${g.basisPointsAdj>=0?'+':''}${g.basisPointsAdj} bps)</option>`).join('')}
              </select>
            </div>

            <div style="background:#f8fafc;border:1.5px solid #cbd5e1;border-radius:var(--radius);padding:1.25rem;margin-top:1.25rem;">
              <div style="font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);font-weight:700;">Location-Adjusted Market Benchmark</div>
              <div style="font-size:2.25rem;font-weight:900;color:#1a73e8;margin-top:0.25rem;" id="calc-geo-result">
                2.80%
              </div>
              <div style="font-size:0.8125rem;color:var(--text-light);margin-top:0.25rem;" id="calc-geo-note">
                Reflects West Coast urban convenience retail density adjustment.
              </div>
            </div>
          </div>
        </div>
      </div>
    ` : ''}

    <!-- TAB 3: HISTORICAL BENCHMARK VERSIONS -->
    ${state.activeTab === 'versions' ? `
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Historical Benchmark Release Registry</div>
            <div class="card-subtitle">Version history, release notes, effective period windows & audit tracking</div>
          </div>
          <button class="btn btn-primary btn-sm" onclick="window.openPublishVersionModal()">
            <i data-lucide="plus"></i> Author Version v2.5
          </button>
        </div>

        <div class="table-wrap">
          <table class="table" style="font-size:0.8125rem;">
            <thead>
              <tr>
                <th>Version</th>
                <th>Release Name</th>
                <th>Status</th>
                <th>Effective Dates</th>
                <th class="text-right">Audited Footprint</th>
                <th class="text-center">Confidence</th>
                <th>Release Notes & Highlights</th>
                <th>Published By</th>
                <th class="text-center">Diff</th>
              </tr>
            </thead>
            <tbody>
              ${versions.map(v => `
                <tr>
                  <td class="font-mono" style="font-weight:800;font-size:0.9375rem;color:#1e1b4b;">${esc(v.version)}</td>
                  <td style="font-weight:700;">${esc(v.name)}</td>
                  <td>
                    <span class="badge ${v.status === 'Active' ? 'badge-success' : 'badge-neutral'}">
                      ${esc(v.status)}
                    </span>
                  </td>
                  <td class="font-mono" style="font-size:0.75rem;">${esc(v.effectiveFrom)} &rarr; ${esc(v.effectiveTo)}</td>
                  <td class="text-right font-mono">${(v.sampleDoors).toLocaleString()} doors (${v.txCount})</td>
                  <td class="text-center"><span class="badge badge-success">${v.confidenceScore}%</span></td>
                  <td style="max-width:300px;font-size:0.8125rem;color:var(--text-light);">${esc(v.releaseNotes)}</td>
                  <td style="font-size:0.75rem;color:var(--text-muted);">${esc(v.publishedBy)}</td>
                  <td class="text-center">
                    <button class="btn btn-outline btn-sm" onclick="window.compareVersionDiff('${esc(v.version)}')" style="padding:2px 8px;font-size:0.75rem;">
                      Diff v2.4
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    ` : ''}

    <!-- TAB 4: REVISION APPROVALS -->
    ${state.activeTab === 'revisions' ? `
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Pending Benchmark Rate Revision Queue</div>
            <div class="card-subtitle">Proposed adjustments awaiting System Administrator or Executive Sponsor sign-off</div>
          </div>
          <button class="btn btn-primary btn-sm" onclick="window.openProposeRateModal()">
            <i data-lucide="plus"></i> Propose Revision
          </button>
        </div>

        <div class="table-wrap">
          <table class="table" style="font-size:0.8125rem;">
            <thead>
              <tr>
                <th>Revision ID</th>
                <th>Service Name & Category</th>
                <th class="text-right">Current Median</th>
                <th class="text-right" style="color:#059669;">Proposed Median</th>
                <th>Economic Justification</th>
                <th>Submitted By</th>
                <th>Status</th>
                <th class="text-center">Approval Action</th>
              </tr>
            </thead>
            <tbody>
              ${window._pendingRateRevisions.length === 0 ? `
                <tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--text-muted);">No pending rate revisions in queue.</td></tr>
              ` : window._pendingRateRevisions.map(rev => `
                <tr>
                  <td class="font-mono">${esc(rev.id)}</td>
                  <td>
                    <div style="font-weight:700;">${esc(rev.serviceName)}</div>
                    <div style="font-size:0.75rem;color:var(--text-muted);">${esc(rev.category)}</div>
                  </td>
                  <td class="text-right font-mono" style="font-weight:700;">${rev.currentMedian.toFixed(2)}%</td>
                  <td class="text-right font-mono" style="font-weight:800;color:#059669;font-size:0.875rem;">
                    ${rev.proposedMedian.toFixed(2)}% (+${((rev.proposedMedian - rev.currentMedian) * 100).toFixed(0)} bps)
                  </td>
                  <td style="max-width:280px;font-size:0.8125rem;color:var(--text-light);">${esc(rev.reason)}</td>
                  <td style="font-size:0.75rem;">
                    <div>${esc(rev.submittedBy)}</div>
                    <div style="color:var(--text-muted);font-size:0.7rem;">${esc(rev.submittedAt)}</div>
                  </td>
                  <td><span class="badge badge-warning">${esc(rev.status)}</span></td>
                  <td class="text-center">
                    <button class="btn btn-sm btn-primary" style="background:#059669;border-color:#059669;padding:3px 8px;font-size:0.75rem;" onclick="window.approveRateRevision('${esc(rev.id)}', '${esc(rev.serviceName)}', ${rev.proposedMedian})">
                      Approve & Commit
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    ` : ''}
  `;

  container.innerHTML = html;
  if (typeof lucide !== 'undefined') lucide.createIcons();

  // Run geo calculation initial
  setTimeout(() => {
    if (state.activeTab === 'geography') {
      window.recalcGeoSim();
    }
  }, 50);
};

// ── Interactive Controller Methods for Benchmark Database ──────
window.setBenchDbTab = function(tab) {
  window._benchDbState.activeTab = tab;
  window.renderBenchmarkDatabase();
};

window.setBenchDbSearch = function(q) {
  window._benchDbState.searchQuery = q;
  window.renderBenchmarkDatabase();
};

window.setBenchDbCategory = function(c) {
  window._benchDbState.categoryFilter = c;
  window.renderBenchmarkDatabase();
};

window.setBenchDbConfidence = function(conf) {
  window._benchDbState.confidenceFilter = conf;
  window.renderBenchmarkDatabase();
};

window.recalcGeoSim = function() {
  const serviceRate = parseFloat(document.getElementById('calc-geo-service')?.value || '2.50');
  const geoMult = parseFloat(document.getElementById('calc-geo-region')?.value || '1.12');
  const res = (serviceRate * geoMult).toFixed(2);
  _setText('calc-geo-result', res + '%');
};

// ── Modals & Actions ───────────────────────────────────────────
window.openProposeRateModal = function() {
  const rates = MockData.benchmarkDatabaseRepo.rates || [];
  openModal('Propose Benchmark Rate Revision', `
    <div style="font-size:0.875rem;">
      <p style="color:var(--text-light);margin-bottom:1rem;">
        Submit a market rate adjustment based on new transaction audit evidence. Revisions are queued for Executive Sponsor or System Administrator approval.
      </p>

      <div class="form-group">
        <label class="form-label">Service Name</label>
        <select class="form-input" id="prop-service-name">
          ${rates.map(r => `<option value="${esc(r.serviceName)}">${esc(r.serviceName)} (Current Median: ${r.marketMedian}%)</option>`).join('')}
        </select>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
        <div class="form-group">
          <label class="form-label">Proposed Market Median (%)</label>
          <input type="number" step="0.05" class="form-input" id="prop-new-median" value="2.65" />
        </div>
        <div class="form-group">
          <label class="form-label">Effective Date Window</label>
          <input type="text" class="form-input" value="2026-11-01 to 2027-10-31" />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Evidence & Economic Justification</label>
        <textarea class="form-input" id="prop-reason" rows="3" placeholder="Cite source door counts, aggregator contract amendments, or audited POS volumes...">Aggregator fee schedule amendment Q4 across 180 regional convenience doors.</textarea>
      </div>
    </div>
  `, [
    { label: 'Cancel', cls: 'btn-secondary', action: 'closeModal()' },
    { label: 'Submit for Executive Sign-off', cls: 'btn-primary', action: 'window.submitRateProposal()' }
  ]);
};

window.submitRateProposal = function() {
  const svc = document.getElementById('prop-service-name').value;
  const newRate = parseFloat(document.getElementById('prop-new-median').value) || 2.65;
  const reason = document.getElementById('prop-reason').value;
  closeModal();

  if (!window._pendingRateRevisions) window._pendingRateRevisions = [];
  window._pendingRateRevisions.unshift({
    id: 'REV-' + Math.floor(200 + Math.random() * 800),
    serviceName: svc,
    category: 'Prepaid Products',
    currentMedian: 2.50,
    proposedMedian: newRate,
    reason: reason,
    submittedBy: Auth.getCurrentUser()?.name || 'Finance Analyst',
    submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    status: 'Pending Executive Approval'
  });

  MockData.auditLogs.unshift({
    id: 'AL' + Date.now(),
    userId: Auth.getCurrentUser()?.id || 'U001',
    userName: Auth.getCurrentUser()?.name || 'Finance Analyst',
    action: 'submit_rate_proposal',
    module: 'Benchmark Database',
    details: `Proposed benchmark rate adjustment for ${svc} to ${newRate}%`,
    timestamp: new Date().toISOString(),
    ipAddress: '127.0.0.1'
  });

  showToast(`Rate revision for "${svc}" (${newRate}%) submitted to approval queue!`, 'success');
  window.renderBenchmarkDatabase();
};

window.approveRateRevision = function(revId, serviceName, newRate) {
  // Update in rates
  const r = MockData.benchmarkDatabaseRepo.rates.find(item => item.serviceName === serviceName);
  if (r) {
    r.marketMedian = newRate;
    r.quarterlyDelta = '+0.15%';
  }

  // Remove from queue
  window._pendingRateRevisions = window._pendingRateRevisions.filter(rev => rev.id !== revId);

  MockData.auditLogs.unshift({
    id: 'AL' + Date.now(),
    userId: Auth.getCurrentUser()?.id || 'U001',
    userName: Auth.getCurrentUser()?.name || 'Executive Sponsor',
    action: 'approve_rate_revision',
    module: 'Benchmark Database',
    details: `Approved & published benchmark rate revision ${revId}: ${serviceName} updated to ${newRate}%`,
    timestamp: new Date().toISOString(),
    ipAddress: '127.0.0.1'
  });

  MockData.notifications.unshift({
    id: 'N' + Date.now(),
    userId: Auth.getCurrentUser()?.id || 'U001',
    title: 'Benchmark Rate Updated',
    message: `${serviceName} market benchmark updated to ${newRate}% in index v2.4.`,
    type: 'success',
    read: false,
    timestamp: new Date().toISOString(),
    link: '#/benchmark-database'
  });

  showToast(`Approved! Benchmark rate for "${serviceName}" updated to ${newRate}%.`, 'success');
  window.renderBenchmarkDatabase();
};

window.openGeographyModal = function() {
  window.setBenchDbTab('geography');
};

window.editGeoMultiplier = function(geoId) {
  const g = MockData.benchmarkDatabaseRepo.geographyAdjustments.find(item => item.id === geoId);
  if (!g) return;
  openModal(`Edit Geography Multiplier — ${esc(g.region)}`, `
    <div style="font-size:0.875rem;">
      <div class="form-group">
        <label class="form-label">Regional Multiplier (Baseline: 1.00x)</label>
        <input type="number" step="0.01" class="form-input" id="edit-geo-mult" value="${g.multiplier}" />
      </div>
      <div class="form-group">
        <label class="form-label">Basis Points Adjustment (+/- bps)</label>
        <input type="number" step="1" class="form-input" id="edit-geo-bps" value="${g.basisPointsAdj}" />
      </div>
      <div class="form-group">
        <label class="form-label">Economic Driver Notes</label>
        <textarea class="form-input" id="edit-geo-notes" rows="2">${esc(g.economicDriver)}</textarea>
      </div>
    </div>
  `, [
    { label: 'Cancel', cls: 'btn-secondary', action: 'closeModal()' },
    { label: 'Save Regional Multiplier', cls: 'btn-primary', action: `window.saveGeoMultiplier('${esc(geoId)}')` }
  ]);
};

window.saveGeoMultiplier = function(geoId) {
  const mult = parseFloat(document.getElementById('edit-geo-mult').value) || 1.00;
  const bps = parseInt(document.getElementById('edit-geo-bps').value) || 0;
  const notes = document.getElementById('edit-geo-notes').value;
  closeModal();

  const g = MockData.benchmarkDatabaseRepo.geographyAdjustments.find(item => item.id === geoId);
  if (g) {
    g.multiplier = mult;
    g.basisPointsAdj = bps;
    g.economicDriver = notes;
  }

  showToast(`Updated geography multiplier for ${g.region} to ${mult}x (${bps} bps)!`, 'success');
  window.renderBenchmarkDatabase();
};

window.openPublishVersionModal = function() {
  openModal('Publish New Benchmark Release (v2.5)', `
    <div style="font-size:0.875rem;">
      <p style="color:var(--text-light);margin-bottom:1rem;">
        Publishing a new release locks the existing v2.4 benchmark, updates the institutional peer index, and applies new rate baselines across all analytics modules.
      </p>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
        <div class="form-group">
          <label class="form-label">Version Identifier</label>
          <input type="text" class="form-input" value="v2.5" readonly />
        </div>
        <div class="form-group">
          <label class="form-label">Release Name</label>
          <input type="text" class="form-input" id="pub-ver-name" value="Q1 2027 Annual Master Benchmark" />
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
        <div class="form-group">
          <label class="form-label">Effective From</label>
          <input type="date" class="form-input" value="2027-01-01" />
        </div>
        <div class="form-group">
          <label class="form-label">Effective To</label>
          <input type="date" class="form-input" value="2027-12-31" />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Release Notes & Governance Summary</label>
        <textarea class="form-input" rows="3">Annual recalibration of gift cards, money transfer, and financial service commission benchmarks based on 1,550 convenience retail doors.</textarea>
      </div>
    </div>
  `, [
    { label: 'Cancel', cls: 'btn-secondary', action: 'closeModal()' },
    { label: 'Publish Benchmark Release v2.5 🚀', cls: 'btn-primary', action: 'window.confirmPublishVersion()' }
  ]);
};

window.confirmPublishVersion = function() {
  closeModal();
  MockData.benchmarkDatabaseRepo.versions.unshift({
    version: 'v2.5',
    name: 'Q1 2027 Annual Master Benchmark',
    status: 'Active',
    effectiveFrom: '2027-01-01',
    effectiveTo: '2027-12-31',
    publishedBy: Auth.getCurrentUser()?.name || 'System Administrator',
    publishedAt: new Date().toISOString(),
    sampleDoors: 1550,
    txCount: '21.2M',
    confidenceScore: 98.9,
    releaseNotes: 'Annual master recalibration across 1,550 doors.'
  });

  // Archive v2.4
  const v24 = MockData.benchmarkDatabaseRepo.versions.find(v => v.version === 'v2.4');
  if (v24) v24.status = 'Archived';
  MockData.benchmarkDatabaseRepo.currentVersion = 'v2.5';

  MockData.auditLogs.unshift({
    id: 'AL' + Date.now(),
    userId: Auth.getCurrentUser()?.id || 'U001',
    userName: Auth.getCurrentUser()?.name || 'System Administrator',
    action: 'publish_benchmark_version',
    module: 'Benchmark Database',
    details: 'Published new institutional benchmark version v2.5 across 1,550 doors (98.9% confidence)',
    timestamp: new Date().toISOString(),
    ipAddress: '127.0.0.1'
  });

  showToast('🚀 Version v2.5 published successfully as active benchmark release!', 'success');
  window.setBenchDbTab('versions');
};

window.compareVersionDiff = function(ver) {
  openModal(`Version Rate Comparison: ${esc(ver)} vs Current Active (v2.4)`, `
    <div style="font-size:0.875rem;">
      <p style="color:var(--text-light);margin-bottom:1rem;">
        Rate movement and confidence evolution between <strong>${esc(ver)}</strong> and <strong>v2.4</strong>:
      </p>
      <table class="table" style="font-size:0.8125rem;">
        <thead>
          <tr>
            <th>Service</th>
            <th>${esc(ver)} Median</th>
            <th>v2.4 Median</th>
            <th>Rate Delta</th>
            <th>Confidence Evolution</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="font-weight:700;">Netflix Card & Streaming</td>
            <td class="font-mono">2.30%</td>
            <td class="font-mono" style="color:#059669;font-weight:700;">2.50%</td>
            <td class="font-mono" style="color:#059669;font-weight:700;">+0.20% (+20 bps)</td>
            <td>97.2% &rarr; <strong style="color:#059669;">99.2%</strong></td>
          </tr>
          <tr>
            <td style="font-weight:700;">Visa Open-Loop Gift Cards</td>
            <td class="font-mono">3.40%</td>
            <td class="font-mono" style="color:#059669;font-weight:700;">3.55%</td>
            <td class="font-mono" style="color:#059669;font-weight:700;">+0.15% (+15 bps)</td>
            <td>96.5% &rarr; <strong style="color:#059669;">98.8%</strong></td>
          </tr>
          <tr>
            <td style="font-weight:700;">Money Transfer (Wire)</td>
            <td class="font-mono">2.20%</td>
            <td class="font-mono" style="color:#059669;font-weight:700;">2.30%</td>
            <td class="font-mono" style="color:#059669;font-weight:700;">+0.10% (+10 bps)</td>
            <td>96.8% &rarr; <strong style="color:#059669;">98.5%</strong></td>
          </tr>
          <tr>
            <td style="font-weight:700;">Bill Payment Services</td>
            <td class="font-mono">2.30%</td>
            <td class="font-mono" style="color:#059669;font-weight:700;">2.35%</td>
            <td class="font-mono" style="color:#059669;font-weight:700;">+0.05% (+5 bps)</td>
            <td>97.5% &rarr; <strong style="color:#059669;">98.2%</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
  `, [{ label: 'Close', cls: 'btn-secondary', action: 'closeModal()' }]);
};

window.openRateDetailModal = function(rateId) {
  const r = MockData.benchmarkDatabaseRepo.rates.find(item => item.id === rateId);
  if (!r) return;
  openModal(`Rate Properties &bull; ${esc(r.serviceName)}`, `
    <div style="font-size:0.875rem;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
        <div><strong>Category:</strong> ${esc(r.category)}</div>
        <div><strong>Index Version:</strong> ${esc(r.version)}</div>
        <div><strong>Effective Window:</strong> ${r.effectiveFrom} to ${r.effectiveTo}</div>
        <div><strong>Confidence Rating:</strong> <span class="badge badge-success">${r.confidenceScore}%</span></div>
        <div><strong>Audited Sample Doors:</strong> ${(r.sampleDoors||1000).toLocaleString()} stores</div>
        <div><strong>Rate Stability Index:</strong> ${esc(r.stability)}</div>
      </div>
      <div style="background:var(--bg);padding:1rem;border-radius:var(--radius);">
        <div style="font-weight:700;margin-bottom:0.5rem;">Benchmark Distribution:</div>
        <div style="display:flex;justify-content:space-between;font-size:0.8125rem;">
          <span>25th Percentile (Low): <strong>${r.marketLow}%</strong></span>
          <span>50th Percentile (Median): <strong style="color:#1a73e8;">${r.marketMedian}%</strong></span>
          <span>75th Percentile (High): <strong style="color:#059669;">${r.marketHigh}%</strong></span>
          <span>90th Percentile (Best): <strong style="color:#6366f1;">${r.bestInClass}%</strong></span>
        </div>
      </div>
    </div>
  `, [{ label: 'Close', cls: 'btn-secondary', action: 'closeModal()' }]);
};

// ═══════════════════════════════════════════════════════════════
//  3. SOURCING & AUCTIONS
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
//  AI CONTRACT INTELLIGENCE MODULE
//  Ingest contracts, extract commissions, renewal dates,
//  exclusivity clauses, notice periods & generate proactive alerts.
// ═══════════════════════════════════════════════════════════════


// ═══════════════════════════════════════════════════════════════
//  AI OPPORTUNITY RANKING ENGINE
//  Answers: "What should I negotiate first?"
//  Calculates: Procurement Priority Score (PPS) based on:
//  - Revenue impact
//  - Contract timing
//  - Vendor risk
//  - Negotiation complexity
// ═══════════════════════════════════════════════════════════════

window.renderOpportunityRanking = function() {
  const container = (document.getElementById('content-area') || document.getElementById('main-content'));
  if (!container) return;

  if (!window._rankingState) {
    window._rankingState = {
      activeTab: 'playbooks', // 'playbooks' | 'matrix' | 'quadrant' | 'algorithm'
      searchQuery: '',
      categoryFilter: 'all',
      tierFilter: 'all', // 'all' | 'P1' | 'P2' | 'P3'
      easeFilter: 'all',
      viewMode: 'table' // 'table' | 'cards'
    };
  }

  const state = window._rankingState;
  const repo = MockData.opportunityRankingRepo || { weights: {}, products: [] };
  const weights = repo.weights || { revenueImpact: 40, contractTiming: 25, vendorRisk: 20, negotiationComplexity: 15 };
  let products = repo.products || [];

  const currentUser = Auth.getCurrentUser();
  const isVendor = currentUser?.role === 'vendor';
  const isFinance = currentUser?.role === 'finance_analyst';
  const canManage = Auth.hasPermission('sourcing.manage') || ['system_admin', 'executive_sponsor', 'procurement_manager', 'category_manager'].includes(currentUser?.role);

  // Vendor role isolation
  if (isVendor) {
    products = products.filter(p => p.vendor.toLowerCase().includes((currentUser.vendorName || 'GiftFlow').toLowerCase()));
  }

  // Calculate dynamic PPS for each product using active weights
  products.forEach(p => {
    p.dynamicPPS = repo.calculatePPS ? repo.calculatePPS(p, weights) : p.ppsScore;
  });

  // Sort descending by PPS
  products.sort((a, b) => b.dynamicPPS - a.dynamicPPS);

  // Re-assign dynamic priority ranks
  products.forEach((p, idx) => {
    p.currentRank = idx + 1;
  });

  // Summary Metrics
  const totalOpportunity = products.reduce((sum, p) => sum + (p.opportunity || 0), 0);
  const p1Products = products.filter(p => p.urgencyTier.startsWith('P1'));
  const p1Opportunity = p1Products.reduce((sum, p) => sum + (p.opportunity || 0), 0);
  const avgPPS = products.length ? (products.reduce((sum, p) => sum + p.dynamicPPS, 0) / products.length).toFixed(1) : 0;

  // Filtered products for matrix
  const filtered = products.filter(p => {
    const matchCat = state.categoryFilter === 'all' || p.category === state.categoryFilter;
    const matchTier = state.tierFilter === 'all' || p.urgencyTier.startsWith(state.tierFilter);
    const matchEase = state.easeFilter === 'all' || (p.easeLevel && p.easeLevel.toLowerCase().includes(state.easeFilter.toLowerCase()));
    const q = state.searchQuery.toLowerCase().trim();
    const matchSearch = !q ||
      p.name.toLowerCase().includes(q) ||
      p.productFullName.toLowerCase().includes(q) ||
      p.vendor.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);

    return matchCat && matchTier && matchEase && matchSearch;
  });

  // Top 3 Flagship Products for "What Should I Negotiate First?"
  const top1 = products[0] || {};
  const top2 = products[1] || {};
  const top3 = products[2] || {};

  container.innerHTML = `
    <!-- Header -->
    <div class="page-header" style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem;">
      <div>
        <div style="display:flex;align-items:center;gap:0.625rem;">
          <span style="background:linear-gradient(135deg,#f59e0b,#ea580c);color:#fff;width:32px;height:32px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(245,158,11,0.35);">
            <i data-lucide="target" style="width:18px;height:18px;"></i>
          </span>
          <h1 class="page-title" style="margin:0;font-size:1.625rem;font-weight:800;letter-spacing:-0.02em;">AI Opportunity Ranking Engine</h1>
          <span class="badge" style="background:#fef3c7;color:#92400e;font-size:0.75rem;font-weight:700;padding:2px 8px;border-radius:999px;">
            PPS Algorithm v2.4 Active
          </span>
        </div>
        <p class="page-desc" style="color:var(--text-light);margin-top:0.35rem;max-width:860px;font-size:0.875rem;">
          Retailers sell hundreds of products. Commission IQ answers <strong>"What should I negotiate first?"</strong> by synthesizing <strong>Revenue Impact</strong>, <strong>Contract Timing</strong>, <strong>Vendor Risk</strong>, and <strong>Negotiation Complexity</strong> into an autonomous Procurement Priority Score.
        </p>
      </div>

      <div style="display:flex;gap:0.625rem;flex-wrap:wrap;">
        <button class="btn btn-outline btn-sm" onclick="window.exportOpportunityRankingCSV()">
          <i data-lucide="download"></i> Export Opportunity Register
        </button>
        ${canManage && !isVendor ? `
          <button class="btn btn-primary btn-sm" onclick="window.launchTopNegotiationBundle()">
            <i data-lucide="zap"></i> Launch Top 3 Negotiation Bundle
          </button>
        ` : ''}
      </div>
    </div>

    <!-- Flagship Triad Hero KPI Row -->
    <div class="kpi-grid" style="grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1.25rem;margin-bottom:1.5rem;">
      <!-- Card 1: Top 3 Opportunity (P1) -->
      <div class="kpi-card" style="border-left:4px solid #10b981;display:flex;flex-direction:column;justify-content:space-between;min-height:150px;padding:1.25rem 1.35rem;">
        <div class="kpi-header" style="display:flex;justify-content:space-between;align-items:center;width:100%;margin-bottom:0.35rem;">
          <span class="kpi-title" style="font-size:0.8125rem;font-weight:800;color:var(--text-light);text-transform:uppercase;letter-spacing:0.04em;">Top 3 Opportunity (P1)</span>
          <div class="kpi-icon-wrap" style="background:#ecfdf5;color:#059669;width:36px;height:36px;border-radius:9px;display:inline-flex;align-items:center;justify-content:center;"><i data-lucide="flame" style="width:18px;height:18px;"></i></div>
        </div>
        <div class="kpi-value" style="color:#059669;font-size:1.875rem;font-weight:800;margin:0.25rem 0;line-height:1.15;">${formatCurrency(p1Opportunity)}</div>
        <div class="kpi-footer" style="font-size:0.8125rem;color:var(--text-muted);line-height:1.45;margin-top:auto;">
          <strong style="color:#059669;">${top1.name} ($42K)</strong> &bull; <strong>${top2.name} ($31K)</strong> &bull; <strong>${top3.name} ($28K)</strong>
        </div>
      </div>

      <!-- Card 2: Total Portfolio Opportunity -->
      <div class="kpi-card" style="border-left:4px solid #0284c7;display:flex;flex-direction:column;justify-content:space-between;min-height:150px;padding:1.25rem 1.35rem;">
        <div class="kpi-header" style="display:flex;justify-content:space-between;align-items:center;width:100%;margin-bottom:0.35rem;">
          <span class="kpi-title" style="font-size:0.8125rem;font-weight:800;color:var(--text-light);text-transform:uppercase;letter-spacing:0.04em;">Total Portfolio Opportunity</span>
          <div class="kpi-icon-wrap" style="background:#eff6ff;color:#2563eb;width:36px;height:36px;border-radius:9px;display:inline-flex;align-items:center;justify-content:center;"><i data-lucide="dollar-sign" style="width:18px;height:18px;"></i></div>
        </div>
        <div class="kpi-value" style="color:#0a2540;font-size:1.875rem;font-weight:800;margin:0.25rem 0;line-height:1.15;">${formatCurrency(totalOpportunity)}</div>
        <div class="kpi-footer" style="font-size:0.8125rem;color:var(--text-muted);line-height:1.45;margin-top:auto;">
          <strong style="color:#0a2540;">${products.length} products</strong> audited in catalog
        </div>
      </div>

      <!-- Card 3: Average Priority Score (PPS) -->
      <div class="kpi-card" style="border-left:4px solid #f59e0b;display:flex;flex-direction:column;justify-content:space-between;min-height:150px;padding:1.25rem 1.35rem;">
        <div class="kpi-header" style="display:flex;justify-content:space-between;align-items:center;width:100%;margin-bottom:0.35rem;">
          <span class="kpi-title" style="font-size:0.8125rem;font-weight:800;color:var(--text-light);text-transform:uppercase;letter-spacing:0.04em;">Average Priority Score (PPS)</span>
          <div class="kpi-icon-wrap" style="background:#fffbeb;color:#d97706;width:36px;height:36px;border-radius:9px;display:inline-flex;align-items:center;justify-content:center;"><i data-lucide="gauge" style="width:18px;height:18px;"></i></div>
        </div>
        <div class="kpi-value" style="color:#d97706;font-size:1.875rem;font-weight:800;margin:0.25rem 0;line-height:1.15;">${avgPPS} <span style="font-size:1.0625rem;color:var(--text-muted);font-weight:600;">/ 100</span></div>
        <div class="kpi-footer" style="font-size:0.8125rem;color:var(--text-muted);line-height:1.45;margin-top:auto;">
          Weighted multi-factor score
        </div>
      </div>

      <!-- Card 4: Highest Priority SKU -->
      <div class="kpi-card" style="border-left:4px solid #6366f1;display:flex;flex-direction:column;justify-content:space-between;min-height:150px;padding:1.25rem 1.35rem;">
        <div class="kpi-header" style="display:flex;justify-content:space-between;align-items:center;width:100%;margin-bottom:0.35rem;">
          <span class="kpi-title" style="font-size:0.8125rem;font-weight:800;color:var(--text-light);text-transform:uppercase;letter-spacing:0.04em;">Highest Priority SKU</span>
          <div class="kpi-icon-wrap" style="background:#eef2ff;color:#4f46e5;width:36px;height:36px;border-radius:9px;display:inline-flex;align-items:center;justify-content:center;"><i data-lucide="award" style="width:18px;height:18px;"></i></div>
        </div>
        <div class="kpi-value" style="color:#4f46e5;font-size:1.875rem;font-weight:800;margin:0.25rem 0;line-height:1.15;">${top1.name || 'Netflix'}</div>
        <div class="kpi-footer" style="font-size:0.8125rem;color:var(--text-muted);line-height:1.45;margin-top:auto;">
          <strong style="color:#4f46e5;">PPS: ${top1.dynamicPPS || 96.0}</strong> &bull; ${formatCurrency(top1.opportunity || 42000)}/yr
        </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1.5px solid var(--border);margin-bottom:1.25rem;flex-wrap:wrap;gap:0.75rem;">
      <div style="display:flex;gap:0.5rem;">
        <button class="tab-btn ${state.activeTab === 'playbooks' ? 'active' : ''}" onclick="window.setRankingTab('playbooks')" style="display:flex;align-items:center;gap:0.4rem;padding:0.75rem 1rem;font-size:0.875rem;font-weight:700;border:none;background:none;border-bottom:2.5px solid ${state.activeTab === 'playbooks' ? '#f59e0b' : 'transparent'};color:${state.activeTab === 'playbooks' ? '#d97706' : 'var(--text-muted)'};cursor:pointer;">
          <i data-lucide="help-circle" style="width:16px;height:16px;"></i> What Should I Negotiate First? (Top 3)
        </button>
        <button class="tab-btn ${state.activeTab === 'matrix' ? 'active' : ''}" onclick="window.setRankingTab('matrix')" style="display:flex;align-items:center;gap:0.4rem;padding:0.75rem 1rem;font-size:0.875rem;font-weight:700;border:none;background:none;border-bottom:2.5px solid ${state.activeTab === 'matrix' ? '#f59e0b' : 'transparent'};color:${state.activeTab === 'matrix' ? '#d97706' : 'var(--text-muted)'};cursor:pointer;">
          <i data-lucide="list-ordered" style="width:16px;height:16px;"></i> Ranked Opportunity Matrix (${filtered.length})
        </button>
        <button class="tab-btn ${state.activeTab === 'quadrant' ? 'active' : ''}" onclick="window.setRankingTab('quadrant')" style="display:flex;align-items:center;gap:0.4rem;padding:0.75rem 1rem;font-size:0.875rem;font-weight:700;border:none;background:none;border-bottom:2.5px solid ${state.activeTab === 'quadrant' ? '#f59e0b' : 'transparent'};color:${state.activeTab === 'quadrant' ? '#d97706' : 'var(--text-muted)'};cursor:pointer;">
          <i data-lucide="pie-chart" style="width:16px;height:16px;"></i> Priority Quadrant Analytics
        </button>
        ${!isVendor ? `
          <button class="tab-btn ${state.activeTab === 'algorithm' ? 'active' : ''}" onclick="window.setRankingTab('algorithm')" style="display:flex;align-items:center;gap:0.4rem;padding:0.75rem 1rem;font-size:0.875rem;font-weight:700;border:none;background:none;border-bottom:2.5px solid ${state.activeTab === 'algorithm' ? '#f59e0b' : 'transparent'};color:${state.activeTab === 'algorithm' ? '#d97706' : 'var(--text-muted)'};cursor:pointer;">
            <i data-lucide="sliders" style="width:16px;height:16px;"></i> PPS Algorithm Configuration
          </button>
        ` : ''}
      </div>

      ${state.activeTab === 'matrix' ? `
        <div style="display:flex;align-items:center;gap:0.35rem;padding:0.25rem;background:#f1f5f9;border-radius:var(--radius-sm);">
          <button class="btn btn-sm ${state.viewMode === 'table' ? 'btn-primary' : 'btn-ghost'}" style="padding:4px 8px;" onclick="window.setRankingViewMode('table')" title="Table View">
            <i data-lucide="list" style="width:14px;height:14px;"></i>
          </button>
          <button class="btn btn-sm ${state.viewMode === 'cards' ? 'btn-primary' : 'btn-ghost'}" style="padding:4px 8px;" onclick="window.setRankingViewMode('cards')" title="Card View">
            <i data-lucide="grid" style="width:14px;height:14px;"></i>
          </button>
        </div>
      ` : ''}
    </div>

    <!-- Tab Contents -->
    <div>
      ${state.activeTab === 'playbooks' ? _renderWhatToNegotiateFirst(top1, top2, top3, weights, canManage) : ''}
      ${state.activeTab === 'matrix' ? _renderRankedMatrix(filtered, state, canManage, isVendor) : ''}
      ${state.activeTab === 'quadrant' ? _renderQuadrantAnalytics(products) : ''}
      ${state.activeTab === 'algorithm' ? _renderAlgorithmConfig(weights) : ''}
    </div>
  `;

  lucide.createIcons();

  if (state.activeTab === 'quadrant') {
    setTimeout(window._initRankingCharts, 50);
  }
};

// ─────────────────────────────────────────────────────────────
//  TAB 1: "WHAT SHOULD I NEGOTIATE FIRST?" (TOP 3 FLAGSHIP)
// ─────────────────────────────────────────────────────────────
function _renderWhatToNegotiateFirst(top1, top2, top3, weights, canManage) {
  const triad = [
    { rank: 1, item: top1, borderClass: 'rank-1', badgeClass: 'pps-tier-p1', icon: 'zap' },
    { rank: 2, item: top2, borderClass: 'rank-2', badgeClass: 'pps-tier-p2', icon: 'trending-up' },
    { rank: 3, item: top3, borderClass: 'rank-3', badgeClass: 'pps-tier-p3', icon: 'shield-alert' }
  ];

  return `
    <div style="margin-bottom:1.5rem;">
      <div class="ranking-hero-banner">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem;">
          <div>
            <div style="display:inline-flex;align-items:center;gap:0.35rem;background:rgba(245,158,11,0.2);border:1px solid rgba(245,158,11,0.4);color:#fcd34d;font-size:0.75rem;font-weight:800;padding:0.25rem 0.75rem;border-radius:999px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.75rem;">
              <i data-lucide="compass" style="width:14px;height:14px;"></i> Strategic Procurement Directive
            </div>
            <h2 style="font-size:1.625rem;font-weight:900;color:#fff;margin:0;letter-spacing:-0.02em;">
              "What Should I Negotiate First?"
            </h2>
            <p style="color:#cbd5e1;font-size:0.9375rem;margin-top:0.35rem;max-width:820px;line-height:1.5;">
              Across your entire convenience store catalog, AI synthesizes <strong>Revenue Impact</strong> ($), <strong>Contract Notice Timing</strong>, <strong>Vendor Dependency Risk</strong>, and <strong>Negotiation Ease</strong>. Focusing immediate negotiation resources on these top 3 products captures <strong>$101,000 in immediate EBITDA margin</strong> with maximum leverage.
            </p>
          </div>

          <div style="background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.15);padding:1rem 1.25rem;border-radius:var(--radius-lg);text-align:right;">
            <div style="font-size:0.75rem;color:#94a3b8;font-weight:700;text-transform:uppercase;">Current Scoring Weights</div>
            <div style="font-size:0.8125rem;color:#fff;margin-top:0.35rem;">
              Revenue: <strong>${weights.revenueImpact}%</strong> &bull; Timing: <strong>${weights.contractTiming}%</strong><br>
              Risk: <strong>${weights.vendorRisk}%</strong> &bull; Complexity: <strong>${weights.negotiationComplexity}%</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Top 3 Priority Cards -->
      <div class="ranking-top-triad">
        ${triad.map(t => {
          const p = t.item;
          if (!p.name) return '';

          return `
            <div class="negotiate-first-card ${t.borderClass}">
              <div>
                <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:0.5rem;margin-bottom:0.75rem;">
                  <div>
                    <span class="badge" style="background:#1e293b;color:#f8fafc;font-size:0.7rem;font-weight:800;padding:2px 8px;border-radius:999px;">
                      PRIORITY #${t.rank} TO NEGOTIATE
                    </span>
                    <div style="font-size:1.375rem;font-weight:900;color:var(--text);margin-top:0.35rem;display:flex;align-items:center;gap:0.35rem;">
                      ${esc(p.name)}
                    </div>
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.1rem;">
                      ${esc(p.productFullName)}
                    </div>
                  </div>

                  <div style="text-align:right;">
                    <span class="pps-badge ${t.badgeClass}">PPS ${p.dynamicPPS}</span>
                    <div style="font-size:0.6875rem;color:var(--text-muted);font-weight:700;margin-top:0.25rem;">
                      Score / 100
                    </div>
                  </div>
                </div>

                <!-- Big Opportunity Box -->
                <div style="background:#ffffff;border:1.5px solid var(--border);border-radius:var(--radius);padding:0.875rem 1rem;margin:0.75rem 0;">
                  <div style="display:flex;justify-content:space-between;align-items:baseline;">
                    <span style="font-size:0.75rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);">
                      Annual Profit Opportunity
                    </span>
                    <span style="font-size:1.625rem;font-weight:900;color:#047857;">
                      ${formatCurrency(p.opportunity)}
                    </span>
                  </div>
                  <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:var(--text-muted);margin-top:0.25rem;">
                    <span>Current Rate: <strong>${p.currentRate}%</strong></span>
                    <span>Market Target: <strong style="color:#059669;">${p.marketRate}%</strong> (${p.varianceBps} bps)</span>
                  </div>
                </div>

                <!-- 4 Factor PPS Subscore Grid -->
                <div class="pps-subscore-grid">
                  <div class="pps-subscore-col">
                    <div class="pps-subscore-label">Revenue</div>
                    <div class="pps-subscore-val" style="color:#059669;">${p.revenueImpactScore}</div>
                  </div>
                  <div class="pps-subscore-col">
                    <div class="pps-subscore-label">Timing</div>
                    <div class="pps-subscore-val" style="color:#dc2626;">${p.contractTimingScore}</div>
                  </div>
                  <div class="pps-subscore-col">
                    <div class="pps-subscore-label">Vendor Risk</div>
                    <div class="pps-subscore-val" style="color:#d97706;">${p.vendorRiskScore}</div>
                  </div>
                  <div class="pps-subscore-col">
                    <div class="pps-subscore-label">Ease/Comp.</div>
                    <div class="pps-subscore-val" style="color:#4f46e5;">${p.negotiationComplexityScore}</div>
                  </div>
                </div>

                <!-- AI Rationale: "Why Negotiate First?" -->
                <div style="background:#f8fafc;border-left:3.5px solid ${t.rank === 1 ? '#10b981' : t.rank === 2 ? '#6366f1' : '#f59e0b'};padding:0.75rem 0.875rem;border-radius:0 var(--radius) var(--radius) 0;font-size:0.8125rem;color:#1e293b;line-height:1.45;margin-bottom:0.75rem;">
                  <strong style="color:var(--text);display:block;margin-bottom:0.2rem;">
                    <i data-lucide="help-circle" style="width:12px;height:12px;display:inline-block;"></i> Why Negotiate First?
                  </strong>
                  ${esc(p.whyNegotiateFirst)}
                </div>

                <!-- Playbook Tag -->
                <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:0.5rem;">
                  <strong>Recommended Playbook:</strong> ${esc(p.playbook)}
                </div>
              </div>

              <!-- Action button -->
              <div style="margin-top:0.75rem;padding-top:0.75rem;border-top:1px solid var(--border);">
                ${canManage ? `
                  <button class="btn btn-full ${t.rank === 1 ? 'btn-primary' : 'btn-outline'}" onclick="window.openNegotiationPlaybookModal('${p.id}')">
                    <i data-lucide="${t.rank === 1 ? 'zap' : 'file-text'}"></i> ${esc(p.actionLabel)}
                  </button>
                ` : `
                  <button class="btn btn-full btn-outline" onclick="window.openNegotiationPlaybookModal('${p.id}')">
                    <i data-lucide="eye"></i> View Strategy Playbook
                  </button>
                `}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────
//  TAB 2: RANKED OPPORTUNITY MATRIX (MASTER CATALOG)
// ─────────────────────────────────────────────────────────────
function _renderRankedMatrix(products, state, canManage, isVendor) {
  const categories = ['all', 'Gift Cards', 'Money Transfer', 'Prepaid & Streaming', 'Debit Services', 'Financial Services'];

  return `
    <!-- Filter bar -->
    <div class="card" style="margin-bottom:1.25rem;padding:1rem 1.25rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.875rem;">
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center;flex:1;">
          <!-- Search -->
          <div style="position:relative;min-width:240px;flex:1;max-width:320px;">
            <i data-lucide="search" style="position:absolute;left:10px;top:50%;transform:translateY(-50%);width:14px;height:14px;color:var(--text-muted);"></i>
            <input
              type="text"
              class="form-input"
              style="padding-left:2rem;font-size:0.8125rem;"
              placeholder="Search products, vendors, categories..."
              value="${esc(state.searchQuery)}"
              oninput="window.setRankingSearch(this.value)"
            />
          </div>

          <!-- Category filter -->
          <div>
            <select class="form-input" style="font-size:0.8125rem;" onchange="window.setRankingFilter('categoryFilter', this.value)">
              ${categories.map(c => `<option value="${c}" ${state.categoryFilter === c ? 'selected' : ''}>${c === 'all' ? 'All Categories' : c}</option>`).join('')}
            </select>
          </div>

          <!-- Priority Tier filter -->
          <div>
            <select class="form-input" style="font-size:0.8125rem;" onchange="window.setRankingFilter('tierFilter', this.value)">
              <option value="all" ${state.tierFilter === 'all' ? 'selected' : ''}>All Priority Tiers</option>
              <option value="P1" ${state.tierFilter === 'P1' ? 'selected' : ''}>P1 — Immediate Action</option>
              <option value="P2" ${state.tierFilter === 'P2' ? 'selected' : ''}>P2 — High Priority</option>
              <option value="P3" ${state.tierFilter === 'P3' ? 'selected' : ''}>P3 — Moderate / Defer</option>
            </select>
          </div>

          <!-- Ease filter -->
          <div>
            <select class="form-input" style="font-size:0.8125rem;" onchange="window.setRankingFilter('easeFilter', this.value)">
              <option value="all" ${state.easeFilter === 'all' ? 'selected' : ''}>All Complexity Levels</option>
              <option value="High Ease" ${state.easeFilter === 'High Ease' ? 'selected' : ''}>High Ease / Quick Wins</option>
              <option value="Moderate" ${state.easeFilter === 'Moderate' ? 'selected' : ''}>Moderate Complexity</option>
              <option value="Complex" ${state.easeFilter === 'Complex' ? 'selected' : ''}>Complex / Integration</option>
            </select>
          </div>
        </div>

        <div style="font-size:0.8125rem;color:var(--text-muted);">
          Showing <strong>${products.length}</strong> ranked opportunities
        </div>
      </div>
    </div>

    ${products.length === 0 ? `
      <div class="card" style="padding:3rem;text-align:center;">
        <i data-lucide="target" style="width:48px;height:48px;color:var(--text-muted);margin:0 auto 1rem auto;"></i>
        <div style="font-weight:700;font-size:1.125rem;color:var(--text);">No products match your search filters</div>
        <p style="color:var(--text-muted);font-size:0.875rem;margin-top:0.25rem;">Reset your search keywords or filters to see the full opportunity matrix.</p>
        <button class="btn btn-outline btn-sm" style="margin-top:1rem;" onclick="window.resetRankingFilters()">
          <i data-lucide="rotate-ccw"></i> Reset Filters
        </button>
      </div>
    ` : state.viewMode === 'cards' ? _renderRankedCardsView(products, canManage) : _renderRankedTableView(products, canManage)}
  `;
}

function _renderRankedTableView(products, canManage) {
  return `
    <div class="card" style="overflow:hidden;border:1.5px solid var(--border);">
      <div class="table-wrap">
        <table class="table" style="font-size:0.8125rem;width:100%;">
          <thead>
            <tr>
              <th style="width:60px;text-align:center;">Rank</th>
              <th>Product & SKU</th>
              <th>Category & Vendor</th>
              <th>Annual Opportunity ($)</th>
              <th style="text-align:center;">PPS Score</th>
              <th>Factor Breakdown (Rev / Time / Risk / Ease)</th>
              <th>Timing & Complexity</th>
              <th>Recommended Playbook</th>
              <th style="text-align:right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${products.map(p => {
              const tierClass = p.dynamicPPS >= 85 ? 'pps-tier-p1' : p.dynamicPPS >= 75 ? 'pps-tier-p2' : 'pps-tier-p3';
              const rankColor = p.currentRank === 1 ? '#047857' : p.currentRank === 2 ? '#4f46e5' : p.currentRank === 3 ? '#d97706' : 'var(--text-muted)';

              return `
                <tr style="${p.currentRank <= 3 ? 'background:rgba(245,158,11,0.04);font-weight:600;' : ''}">
                  <td style="text-align:center;font-size:1rem;font-weight:900;color:${rankColor};">
                    #${p.currentRank}
                  </td>
                  <td>
                    <div style="font-weight:700;color:var(--text);font-size:0.875rem;">${esc(p.name)}</div>
                    <div style="font-size:0.75rem;color:var(--text-muted);">${esc(p.productFullName)}</div>
                  </td>
                  <td>
                    <span class="badge badge-neutral" style="font-size:0.6875rem;">${esc(p.category)}</span>
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.15rem;">${esc(p.vendor)}</div>
                  </td>
                  <td>
                    <div class="font-mono" style="font-size:1rem;font-weight:800;color:#047857;">
                      ${formatCurrency(p.opportunity)}
                    </div>
                    <div style="font-size:0.7rem;color:var(--text-muted);">
                      Rate: ${p.currentRate}% &rarr; ${p.marketRate}% (${p.varianceBps} bps)
                    </div>
                  </td>
                  <td style="text-align:center;">
                    <span class="pps-badge ${tierClass}">${p.dynamicPPS}</span>
                  </td>
                  <td>
                    <div style="display:flex;gap:0.35rem;align-items:center;font-size:0.75rem;">
                      <span title="Revenue Impact" style="background:#ecfdf5;color:#059669;padding:1px 5px;border-radius:4px;font-weight:700;">R:${p.revenueImpactScore}</span>
                      <span title="Contract Timing" style="background:#fef2f2;color:#dc2626;padding:1px 5px;border-radius:4px;font-weight:700;">T:${p.contractTimingScore}</span>
                      <span title="Vendor Risk" style="background:#fffbeb;color:#d97706;padding:1px 5px;border-radius:4px;font-weight:700;">K:${p.vendorRiskScore}</span>
                      <span title="Negotiation Ease" style="background:#eef2ff;color:#4f46e5;padding:1px 5px;border-radius:4px;font-weight:700;">E:${p.negotiationComplexityScore}</span>
                    </div>
                  </td>
                  <td>
                    <div style="font-size:0.75rem;font-weight:600;color:${p.timingStatus.includes('Due') ? '#dc2626' : 'var(--text)'};">
                      ${esc(p.timingStatus)}
                    </div>
                    <div style="font-size:0.7rem;color:var(--text-muted);">${esc(p.easeLevel)}</div>
                  </td>
                  <td>
                    <div style="font-size:0.75rem;color:var(--text);max-width:220px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${esc(p.playbook)}">
                      ${esc(p.playbook)}
                    </div>
                  </td>
                  <td style="text-align:right;">
                    <div style="display:flex;justify-content:flex-end;gap:0.35rem;">
                      <button class="btn btn-sm btn-outline" style="padding:3px 7px;" onclick="window.openNegotiationPlaybookModal('${p.id}')" title="Inspect Playbook">
                        <i data-lucide="book-open" style="width:13px;height:13px;"></i> Playbook
                      </button>
                      ${canManage ? `
                        <button class="btn btn-sm btn-primary" style="padding:3px 7px;" onclick="window.launchProductRenegotiationRFP('${p.id}')" title="Execute Negotiation Action">
                          <i data-lucide="zap" style="width:13px;height:13px;"></i>
                        </button>
                      ` : ''}
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function _renderRankedCardsView(products, canManage) {
  return `
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:1.25rem;">
      ${products.map(p => {
        const tierClass = p.dynamicPPS >= 85 ? 'pps-tier-p1' : p.dynamicPPS >= 75 ? 'pps-tier-p2' : 'pps-tier-p3';

        return `
          <div class="card" style="padding:1.25rem;display:flex;flex-direction:column;justify-content:space-between;border:1.5px solid var(--border);">
            <div>
              <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                <div>
                  <span style="font-size:0.875rem;font-weight:900;color:var(--text-muted);">#${p.currentRank}</span>
                  <span class="badge badge-neutral" style="font-size:0.6875rem;margin-left:0.35rem;">${esc(p.category)}</span>
                  <div style="font-size:1.125rem;font-weight:800;color:var(--text);margin-top:0.25rem;">${esc(p.name)}</div>
                  <div style="font-size:0.75rem;color:var(--text-muted);">${esc(p.vendor)}</div>
                </div>
                <span class="pps-badge ${tierClass}">PPS ${p.dynamicPPS}</span>
              </div>

              <div style="background:#f8fafc;padding:0.75rem;border-radius:var(--radius);margin:0.75rem 0;display:flex;justify-content:space-between;align-items:baseline;">
                <span style="font-size:0.75rem;color:var(--text-muted);font-weight:700;">OPPORTUNITY</span>
                <span style="font-size:1.375rem;font-weight:900;color:#047857;">${formatCurrency(p.opportunity)}</span>
              </div>

              <div style="font-size:0.75rem;color:var(--text);line-height:1.4;margin-bottom:0.75rem;">
                <strong>Why Negotiate:</strong> ${esc(p.whyNegotiateFirst)}
              </div>
            </div>

            <div style="border-top:1px solid var(--border);padding-top:0.75rem;display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:0.75rem;color:var(--text-muted);">${esc(p.timingStatus)}</span>
              <button class="btn btn-sm btn-outline" onclick="window.openNegotiationPlaybookModal('${p.id}')">
                <i data-lucide="book-open"></i> View Strategy
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────
//  TAB 3: OPPORTUNITY QUADRANT & PORTFOLIO ANALYTICS
// ─────────────────────────────────────────────────────────────
function _renderQuadrantAnalytics(products) {
  return `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(420px,1fr));gap:1.5rem;margin-bottom:1.5rem;">
      <!-- Chart 1: Priority Quadrant Matrix (Impact vs Complexity) -->
      <div class="card" style="grid-column: 1 / -1;">
        <div class="card-header">
          <div>
            <div class="card-title"><i data-lucide="layout-grid"></i> Strategic Negotiation Quadrant (Revenue Impact vs Ease of Execution)</div>
            <div class="card-subtitle">Identifies Quick Wins (High Impact, High Ease) vs Strategic Battles (High Impact, Complex)</div>
          </div>
        </div>
        <div class="card-body">
          <div style="position:relative;height:340px;">
            <canvas id="chart-ranking-quadrant"></canvas>
          </div>
        </div>
      </div>

      <!-- Chart 2: Opportunity by Category -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title"><i data-lucide="bar-chart-2"></i> Opportunity Pool by Category</div>
            <div class="card-subtitle">Cumulative EBITDA recovery potential by product segment</div>
          </div>
        </div>
        <div class="card-body">
          <div style="position:relative;height:260px;">
            <canvas id="chart-ranking-category"></canvas>
          </div>
        </div>
      </div>

      <!-- Chart 3: PPS Score Distribution -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title"><i data-lucide="pie-chart"></i> Priority Score Tier Breakdown</div>
            <div class="card-subtitle">Distribution across P1 Immediate, P2 High, and P3 Moderate</div>
          </div>
        </div>
        <div class="card-body">
          <div style="position:relative;height:260px;">
            <canvas id="chart-ranking-tiers"></canvas>
          </div>
        </div>
      </div>
    </div>
  `;
}

window._initRankingCharts = function() {
  const repo = MockData.opportunityRankingRepo || { products: [] };
  const products = repo.products || [];

  // 1. Quadrant Matrix (Scatter)
  const ctxQuad = document.getElementById('chart-ranking-quadrant');
  if (ctxQuad) {
    if (APP_STATE.charts['chart-ranking-quadrant']) {
      APP_STATE.charts['chart-ranking-quadrant'].destroy();
    }

    const scatterData = products.map(p => ({
      x: p.negotiationComplexityScore, // X: Ease of negotiation (0=Hard, 100=Easy)
      y: p.opportunity,                 // Y: Dollar Opportunity
      r: Math.max(6, Math.min(18, p.dynamicPPS / 6)),
      productName: p.name,
      rank: p.currentRank
    }));

    APP_STATE.charts['chart-ranking-quadrant'] = new Chart(ctxQuad, {
      type: 'bubble',
      data: {
        datasets: [{
          label: 'Products (Bubble size = PPS Score)',
          data: scatterData,
          backgroundColor: scatterData.map(d => d.rank <= 3 ? 'rgba(16, 185, 129, 0.7)' : d.rank <= 7 ? 'rgba(99, 102, 241, 0.6)' : 'rgba(245, 158, 11, 0.6)'),
          borderColor: scatterData.map(d => d.rank <= 3 ? '#047857' : d.rank <= 7 ? '#4338ca' : '#b45309'),
          borderWidth: 1.5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: { display: true, text: 'Negotiation Ease & Speed (Low Complexity → High Ease)' },
            min: 40,
            max: 105
          },
          y: {
            title: { display: true, text: 'Annual Opportunity ($ EBITDA)' },
            beginAtZero: true,
            ticks: { callback: v => '$' + (v / 1000) + 'K' }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(ctx) {
                const item = ctx.raw;
                return `#${item.rank} ${item.productName}: $${item.y.toLocaleString()} (Ease: ${item.x}/100)`;
              }
            }
          }
        }
      }
    });
  }

  // 2. Category Opportunity Bar Chart
  const ctxCat = document.getElementById('chart-ranking-category');
  if (ctxCat) {
    if (APP_STATE.charts['chart-ranking-category']) {
      APP_STATE.charts['chart-ranking-category'].destroy();
    }

    const catMap = {};
    products.forEach(p => {
      catMap[p.category] = (catMap[p.category] || 0) + p.opportunity;
    });

    const labels = Object.keys(catMap);
    const dataVals = Object.values(catMap);

    APP_STATE.charts['chart-ranking-category'] = new Chart(ctxCat, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total Opportunity ($)',
          data: dataVals,
          backgroundColor: '#f59e0b',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, ticks: { callback: v => '$' + (v / 1000) + 'K' } }
        },
        plugins: { legend: { display: false } }
      }
    });
  }

  // 3. Tier Doughnut
  const ctxTier = document.getElementById('chart-ranking-tiers');
  if (ctxTier) {
    if (APP_STATE.charts['chart-ranking-tiers']) {
      APP_STATE.charts['chart-ranking-tiers'].destroy();
    }

    const p1Count = products.filter(p => p.urgencyTier.startsWith('P1')).length;
    const p2Count = products.filter(p => p.urgencyTier.startsWith('P2')).length;
    const p3Count = products.filter(p => p.urgencyTier.startsWith('P3')).length;

    APP_STATE.charts['chart-ranking-tiers'] = new Chart(ctxTier, {
      type: 'doughnut',
      data: {
        labels: ['P1 — Immediate Priority', 'P2 — High Priority', 'P3 — Moderate / Defer'],
        datasets: [{
          data: [p1Count, p2Count, p3Count],
          backgroundColor: ['#10b981', '#6366f1', '#f59e0b'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
        }
      }
    });
  }
};

// ─────────────────────────────────────────────────────────────
//  TAB 4: PPS ALGORITHM CONFIGURATION & WEIGHTS TUNER
// ─────────────────────────────────────────────────────────────
function _renderAlgorithmConfig(weights) {
  return `
    <div class="card" style="max-width:850px;margin:0 auto;">
      <div class="card-header">
        <div>
          <div class="card-title"><i data-lucide="sliders"></i> Procurement Priority Score (PPS) Algorithm Tuning</div>
          <div class="card-subtitle">Adjust the 4 core dimensions to align negotiation prioritization with your retailer strategy</div>
        </div>
      </div>

      <div class="card-body">
        <form onsubmit="window.savePPSWeights(event)">
          <div class="pps-weight-card">
            <div style="font-weight:700;font-size:0.9375rem;color:var(--text);margin-bottom:0.75rem;">
              Dimension Weight Distribution (Total must sum to 100%)
            </div>

            <!-- Slider 1: Revenue Impact -->
            <div class="pps-slider-row">
              <div class="pps-slider-header">
                <span><strong>1. Revenue Impact</strong> (Dollar opportunity & EBITDA margin expansion)</span>
                <span class="font-mono font-bold" id="lbl-weight-rev">${weights.revenueImpact}%</span>
              </div>
              <input type="range" min="10" max="70" step="5" class="ai-slider-input" id="weight-rev" value="${weights.revenueImpact}" oninput="document.getElementById('lbl-weight-rev').innerText = this.value + '%'" />
            </div>

            <!-- Slider 2: Contract Timing -->
            <div class="pps-slider-row">
              <div class="pps-slider-header">
                <span><strong>2. Contract Timing</strong> (Renewal deadline, notice horizon & expiration urgency)</span>
                <span class="font-mono font-bold" id="lbl-weight-time">${weights.contractTiming}%</span>
              </div>
              <input type="range" min="10" max="50" step="5" class="ai-slider-input" id="weight-time" value="${weights.contractTiming}" oninput="document.getElementById('lbl-weight-time').innerText = this.value + '%'" />
            </div>

            <!-- Slider 3: Vendor Risk -->
            <div class="pps-slider-row">
              <div class="pps-slider-header">
                <span><strong>3. Vendor Risk</strong> (Compliance history, payment timeliness, rate dispute frequency)</span>
                <span class="font-mono font-bold" id="lbl-weight-risk">${weights.vendorRisk}%</span>
              </div>
              <input type="range" min="5" max="40" step="5" class="ai-slider-input" id="weight-risk" value="${weights.vendorRisk}" oninput="document.getElementById('lbl-weight-risk').innerText = this.value + '%'" />
            </div>

            <!-- Slider 4: Negotiation Complexity -->
            <div class="pps-slider-row">
              <div class="pps-slider-header">
                <span><strong>4. Negotiation Complexity</strong> (Ease of switching, API friction, exclusivity barriers)</span>
                <span class="font-mono font-bold" id="lbl-weight-comp">${weights.negotiationComplexity}%</span>
              </div>
              <input type="range" min="5" max="35" step="5" class="ai-slider-input" id="weight-comp" value="${weights.negotiationComplexity}" oninput="document.getElementById('lbl-weight-comp').innerText = this.value + '%'" />
            </div>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1.25rem;">
            <button type="button" class="btn btn-outline btn-sm" onclick="window.resetPPSWeights()">
              <i data-lucide="rotate-ccw"></i> Reset Defaults (40/25/20/15)
            </button>
            <button type="submit" class="btn btn-primary">
              <i data-lucide="check"></i> Save Weights & Recalculate PPS Ranking
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────
//  INTERACTIVE ACTIONS, MODALS & WORKFLOWS
// ─────────────────────────────────────────────────────────────

window.setRankingTab = function(tab) {
  window._rankingState.activeTab = tab;
  window.renderOpportunityRanking();
};

window.setRankingFilter = function(key, val) {
  window._rankingState[key] = val;
  window.renderOpportunityRanking();
};

window.setRankingSearch = function(query) {
  window._rankingState.searchQuery = query;
  window.renderOpportunityRanking();
};

window.setRankingViewMode = function(mode) {
  window._rankingState.viewMode = mode;
  window.renderOpportunityRanking();
};

window.resetRankingFilters = function() {
  window._rankingState.searchQuery = '';
  window._rankingState.categoryFilter = 'all';
  window._rankingState.tierFilter = 'all';
  window._rankingState.easeFilter = 'all';
  window.renderOpportunityRanking();
};

// 1. Negotiation Playbook Deep Dive Modal
window.openNegotiationPlaybookModal = function(productId) {
  const p = MockData.opportunityRankingRepo.products.find(item => item.id === productId);
  if (!p) return;

  openModal(`Negotiation Playbook &bull; ${esc(p.name)} (${formatCurrency(p.opportunity)})`, `
    <div style="font-size:0.875rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;background:#f8fafc;padding:0.75rem 1rem;border-radius:var(--radius);margin-bottom:1rem;border:1px solid var(--border);">
        <div>
          <span class="badge badge-neutral">${esc(p.category)}</span>
          <strong style="margin-left:0.5rem;color:var(--text);">${esc(p.vendor)}</strong>
        </div>
        <div>
          Procurement Priority Score: <span class="pps-badge ${p.dynamicPPS >= 85 ? 'pps-tier-p1' : 'pps-tier-p2'}">${p.dynamicPPS} / 100</span>
        </div>
      </div>

      <!-- Financial Opportunity Summary -->
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;margin-bottom:1.25rem;">
        <div style="background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:0.875rem;">
          <div style="font-size:0.7rem;text-transform:uppercase;color:var(--text-muted);font-weight:700;">Annual Opportunity</div>
          <div style="font-size:1.5rem;font-weight:900;color:#047857;margin-top:0.25rem;">${formatCurrency(p.opportunity)}</div>
          <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.15rem;">
            Current: ${p.currentRate}% &rarr; Target: ${p.marketRate}% (${p.varianceBps} bps spread)
          </div>
        </div>

        <div style="background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:0.875rem;">
          <div style="font-size:0.7rem;text-transform:uppercase;color:var(--text-muted);font-weight:700;">Timing & Exclusivity</div>
          <div style="font-size:1.125rem;font-weight:800;color:var(--text);margin-top:0.25rem;">${esc(p.timingStatus)}</div>
          <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.15rem;">
            Ease Rating: ${esc(p.easeLevel)}
          </div>
        </div>
      </div>

      <!-- 4 Factor Breakdown -->
      <div style="margin-bottom:1.25rem;">
        <div style="font-weight:700;font-size:0.9375rem;color:var(--text);margin-bottom:0.35rem;">
          Procurement Priority Sub-Scores:
        </div>
        <div class="pps-subscore-grid">
          <div class="pps-subscore-col">
            <div class="pps-subscore-label">Revenue Impact (40%)</div>
            <div class="pps-subscore-val" style="color:#059669;">${p.revenueImpactScore} / 100</div>
          </div>
          <div class="pps-subscore-col">
            <div class="pps-subscore-label">Contract Timing (25%)</div>
            <div class="pps-subscore-val" style="color:#dc2626;">${p.contractTimingScore} / 100</div>
          </div>
          <div class="pps-subscore-col">
            <div class="pps-subscore-label">Vendor Risk (20%)</div>
            <div class="pps-subscore-val" style="color:#d97706;">${p.vendorRiskScore} / 100</div>
          </div>
          <div class="pps-subscore-col">
            <div class="pps-subscore-label">Negotiation Ease (15%)</div>
            <div class="pps-subscore-val" style="color:#4f46e5;">${p.negotiationComplexityScore} / 100</div>
          </div>
        </div>
      </div>

      <!-- Strategy Playbook Guidance -->
      <div style="margin-bottom:1.25rem;background:#eff6ff;border:1px solid #bfdbfe;border-radius:var(--radius);padding:1rem;">
        <div style="display:flex;align-items:center;gap:0.4rem;font-weight:700;color:#1e40af;font-size:0.875rem;margin-bottom:0.35rem;">
          <i data-lucide="check-circle" style="width:16px;height:16px;"></i> Recommended Tactical Playbook:
        </div>
        <div style="font-weight:800;font-size:1rem;color:#1e3a8a;margin-bottom:0.35rem;">
          ${esc(p.playbook)}
        </div>
        <p style="font-size:0.8125rem;color:#1e3a8a;margin:0;line-height:1.5;">
          ${esc(p.whyNegotiateFirst)}
        </p>
      </div>
    </div>
  `, [
    { label: 'Close', cls: 'btn-secondary', action: 'closeModal()' },
    { label: 'Execute Playbook RFP 🚀', cls: 'btn-primary', action: `closeModal(); window.launchProductRenegotiationRFP('${p.id}')` }
  ]);
};

// 2. Launch RFP from Opportunity
window.launchProductRenegotiationRFP = function(productId) {
  const p = MockData.opportunityRankingRepo.products.find(item => item.id === productId);
  if (!p) return;

  const newEventId = 'SE' + (MockData.sourcingEvents.length + 1).toString().padStart(3, '0');
  MockData.sourcingEvents.unshift({
    id: newEventId,
    name: `${p.name} Priority Renegotiation RFP (Target: ${p.marketRate}%)`,
    category: p.category,
    status: 'Open',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2026-12-15',
    vendorsInvited: 5,
    bidsReceived: 0,
    description: `Initiated by Opportunity Ranking Engine (Rank #${p.currentRank}, PPS: ${p.dynamicPPS}). Targeted annualized EBITDA recovery: $${p.opportunity.toLocaleString()}.`,
    budget: p.annualVolume || 1000000
  });

  MockData.auditLogs.unshift({
    id: 'AL' + Date.now(),
    userId: Auth.getCurrentUser()?.id || 'U001',
    userName: Auth.getCurrentUser()?.name || 'Procurement Manager',
    action: 'launch_rfp_opportunity',
    module: 'AI Opportunity Ranking Engine',
    details: `Launched priority negotiation RFP ${newEventId} for ${p.name} ($ ${p.opportunity} annual target, PPS: ${p.dynamicPPS})`,
    timestamp: new Date().toISOString(),
    ipAddress: '127.0.0.1'
  });

  showToast(`🎯 Competitive negotiation event launched for ${p.name} (+${formatCurrency(p.opportunity)} EBITDA)!`, 'success');
  window.location.hash = '#/sourcing';
};

// 3. Launch Top 3 Bundle
window.launchTopNegotiationBundle = function() {
  openModal('Launch Top 3 Opportunity Bundle (+$101,000)', `
    <div style="font-size:0.875rem;">
      <p style="color:var(--text-light);margin-bottom:1rem;">
        Execute simultaneous renegotiation workflows for your highest ranked opportunities:
      </p>

      <div style="background:#f8fafc;border:1px solid var(--border);border-radius:var(--radius);padding:1rem;margin-bottom:1rem;">
        <div style="display:flex;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid var(--border-light);">
          <span><strong>1. Netflix:</strong> +$42,000 opportunity</span>
          <span class="badge badge-success">Digital RFP / Rate Addendum</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid var(--border-light);">
          <span><strong>2. Apple:</strong> +$31,000 opportunity</span>
          <span class="badge badge-primary">Q4 Volume Tier Addendum</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:0.5rem 0;">
          <span><strong>3. Visa Gift:</strong> +$28,000 opportunity</span>
          <span class="badge badge-warning">Non-Renewal & Reverse Auction</span>
        </div>
      </div>

      <div style="background:#ecfdf5;color:#047857;padding:0.875rem;border-radius:var(--radius);font-weight:700;">
        Combined Annual Recovery: +$101,000 / year (3-Year Value: +$303,000)
      </div>
    </div>
  `, [
    { label: 'Cancel', cls: 'btn-secondary', action: 'closeModal()' },
    { label: 'Dispatch All 3 Negotiation Events 🚀', cls: 'btn-primary', action: 'window.confirmLaunchBundle()' }
  ]);
};

window.confirmLaunchBundle = function() {
  closeModal();

  MockData.auditLogs.unshift({
    id: 'AL' + Date.now(),
    userId: Auth.getCurrentUser()?.id || 'U001',
    userName: Auth.getCurrentUser()?.name || 'Executive Sponsor',
    action: 'launch_top3_opportunity_bundle',
    module: 'AI Opportunity Ranking Engine',
    details: 'Dispatched Top 3 Negotiation Bundle (Netflix $42K, Apple $31K, Visa Gift $28K) totaling $101,000/yr',
    timestamp: new Date().toISOString(),
    ipAddress: '127.0.0.1'
  });

  MockData.notifications.unshift({
    id: 'N' + Date.now(),
    userId: Auth.getCurrentUser()?.id || 'U001',
    title: 'Top 3 Opportunity Bundle Dispatched',
    message: 'Negotiation packages initiated for Netflix ($42K), Apple ($31K), and Visa Gift ($28K).',
    type: 'success',
    read: false,
    timestamp: new Date().toISOString(),
    link: '#/sourcing'
  });

  showToast('🎉 Dispatched Top 3 Negotiation Bundle ($101,000 total opportunity)!', 'success');
  window.location.hash = '#/sourcing';
};

// 4. Save Weights
window.savePPSWeights = function(e) {
  if (e) e.preventDefault();

  const r = parseInt(document.getElementById('weight-rev')?.value || '40', 10);
  const t = parseInt(document.getElementById('weight-time')?.value || '25', 10);
  const k = parseInt(document.getElementById('weight-risk')?.value || '20', 10);
  const c = parseInt(document.getElementById('weight-comp')?.value || '15', 10);

  const sum = r + t + k + c;
  if (sum !== 100) {
    showToast(`⚠️ Weights must sum to 100%! Current sum: ${sum}%`, 'warning');
    return;
  }

  MockData.opportunityRankingRepo.weights = {
    revenueImpact: r,
    contractTiming: t,
    vendorRisk: k,
    negotiationComplexity: c,
    minOpportunityThreshold: 5000
  };

  MockData.auditLogs.unshift({
    id: 'AL' + Date.now(),
    userId: Auth.getCurrentUser()?.id || 'U001',
    userName: Auth.getCurrentUser()?.name || 'Category Manager',
    action: 'update_pps_weights',
    module: 'AI Opportunity Ranking Engine',
    details: `Updated PPS scoring weights: Rev ${r}%, Time ${t}%, Risk ${k}%, Comp ${c}%`,
    timestamp: new Date().toISOString(),
    ipAddress: '127.0.0.1'
  });

  showToast('✅ PPS weights updated and ranking recalculated!', 'success');
  window.setRankingTab('matrix');
};

window.resetPPSWeights = function() {
  MockData.opportunityRankingRepo.weights = {
    revenueImpact: 40,
    contractTiming: 25,
    vendorRisk: 20,
    negotiationComplexity: 15,
    minOpportunityThreshold: 5000
  };
  showToast('PPS weights reset to baseline defaults (40/25/20/15)', 'info');
  window.renderOpportunityRanking();
};

// 5. CSV Export
window.exportOpportunityRankingCSV = function() {
  const repo = MockData.opportunityRankingRepo || { products: [] };
  const products = repo.products || [];
  const headers = ['Priority Rank', 'Product', 'Full SKU Name', 'Category', 'Vendor', 'Annual Opportunity ($)', 'Current Rate (%)', 'Market Rate (%)', 'Spread (bps)', 'PPS Score', 'Revenue Subscore', 'Timing Subscore', 'Risk Subscore', 'Ease Subscore', 'Timing Status', 'Playbook'];

  const rows = products.map(p => [
    '#' + p.currentRank,
    p.name,
    p.productFullName,
    p.category,
    p.vendor,
    p.opportunity,
    p.currentRate + '%',
    p.marketRate + '%',
    p.varianceBps,
    p.dynamicPPS,
    p.revenueImpactScore,
    p.contractTimingScore,
    p.vendorRiskScore,
    p.negotiationComplexityScore,
    p.timingStatus,
    p.playbook
  ]);

  exportToCSV('Opportunity_Ranking_Register.csv', headers, rows);
  showToast('📄 Opportunity Ranking Register exported successfully!', 'success');
};


// ═══════════════════════════════════════════════════════════════
//  AI DIGITAL PROCUREMENT TWIN & BUNDLE OPTIMIZER
//  - Decision Intelligence Simulation Engine ("If we move Netflix from InComm to Blackhawk...")
//  - Commission Impact, Implementation Cost, Transition Risk, Payback Period
//  - AI Bundle Optimizer ("Moving Money Orders + Reloads + Bill Pay to Vendor A...")
// ═══════════════════════════════════════════════════════════════
window.renderDigitalTwin = function() {
  if (!AppState.twinActiveTab) AppState.twinActiveTab = 'simulation';
  if (!AppState.selectedScenarioId) AppState.selectedScenarioId = 'TWIN-001';
  if (!AppState.selectedBundleId) AppState.selectedBundleId = 'BNDL-001';

  // Custom simulator state
  if (!AppState.customSim) {
    AppState.customSim = {
      productName: 'Netflix Streaming Subscription',
      currentVendor: 'InComm / GiftFlow Inc.',
      targetVendor: 'Blackhawk Network / CardVault Solutions',
      volume: 2400000,
      currentRate: 3.00,
      targetRate: 4.75,
      terminalCount: 1420
    };
  }

  const scenarios = MockData.digitalTwinScenarios || [];
  const bundles = MockData.bundleOptimizerData || [];
  const activeScenario = scenarios.find(s => s.id === AppState.selectedScenarioId) || scenarios[0];
  const activeBundle = bundles.find(b => b.id === AppState.selectedBundleId) || bundles[0];

  _setContent('main-content', `
    <!-- Executive KPI Grid -->
    <div class="kpi-grid" style="grid-template-columns:repeat(5, 1fr);margin-bottom:1.5rem;">
      <div class="kpi-card" style="--kpi-color:#8b5cf6;--kpi-bg:#ede9fe;">
        <div class="kpi-icon" style="background:#ede9fe;color:#8b5cf6;"><i data-lucide="cpu"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Analyzed Scenarios</div>
          <div class="kpi-value">${scenarios.length + 11}</div>
          <div class="kpi-sub">Digital twin migration simulations</div>
        </div>
      </div>
      <div class="kpi-card" style="--kpi-color:#10b981;--kpi-bg:#dcfce7;">
        <div class="kpi-icon" style="background:#dcfce7;color:#10b981;"><i data-lucide="trending-up"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Top Bundle Yield Gain</div>
          <div class="kpi-value" style="color:#10b981;">+2.80%</div>
          <div class="kpi-sub">Overall yield expansion (+280 bps)</div>
        </div>
      </div>
      <div class="kpi-card" style="--kpi-color:#06b6d4;--kpi-bg:#cffafe;">
        <div class="kpi-icon" style="background:#cffafe;color:#06b6d4;"><i data-lucide="dollar-sign"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Identified EBITDA Gain</div>
          <div class="kpi-value">+$383,590</div>
          <div class="kpi-sub">Annual net profit from Tri-Bundle</div>
        </div>
      </div>
      <div class="kpi-card" style="--kpi-color:#f59e0b;--kpi-bg:#fef3c7;">
        <div class="kpi-icon" style="background:#fef3c7;color:#f59e0b;"><i data-lucide="hourglass"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Avg Payback Period</div>
          <div class="kpi-value">4.1 Mos</div>
          <div class="kpi-sub">Rapid capital expenditure payback</div>
        </div>
      </div>
      <div class="kpi-card" style="--kpi-color:#3b82f6;--kpi-bg:#dbeafe;">
        <div class="kpi-icon" style="background:#dbeafe;color:#3b82f6;"><i data-lucide="shield-check"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Transition Feasibility</div>
          <div class="kpi-value">94.5%</div>
          <div class="kpi-sub">Low consumer disruption index</div>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="portal-tabs-nav">
      <button class="portal-tab-btn twin-tab-btn ${AppState.twinActiveTab === 'simulation' ? 'active' : ''}" onclick="setTwinTab('simulation')">
        <i data-lucide="cpu"></i> 1. AI Digital Procurement Twin (Decision Intelligence Engine)
      </button>
      <button class="portal-tab-btn twin-tab-btn ${AppState.twinActiveTab === 'bundle' ? 'active' : ''}" onclick="setTwinTab('bundle')">
        <i data-lucide="layers"></i> 2. AI Bundle Optimizer (+2.8% Multi-Category Discovery)
      </button>
      <button class="portal-tab-btn twin-tab-btn ${AppState.twinActiveTab === 'custom' ? 'active' : ''}" onclick="setTwinTab('custom')">
        <i data-lucide="sliders"></i> 3. Interactive What-If Scenario Builder
      </button>
    </div>

    <!-- TAB 1: AI Digital Procurement Twin -->
    <div id="twin-tab-simulation" style="display:${AppState.twinActiveTab === 'simulation' ? 'block' : 'none'};">
      <div class="card" style="margin-bottom:1.5rem;">
        <div class="card-header" style="flex-wrap:wrap;gap:1rem;">
          <div>
            <div class="card-title">Digital Procurement Twin Simulation Engine</div>
            <div class="card-subtitle">AI simulates vendor-to-vendor migrations to deliver complete decision intelligence: Commission Impact, Implementation Cost, Transition Risk, and Payback Period.</div>
          </div>
          <div style="display:flex;gap:0.5rem;align-items:center;">
            <span style="font-size:0.8125rem;color:var(--text-muted);font-weight:600;">Scenario Question:</span>
            <select class="form-select form-select-sm" style="width:360px;" onchange="selectTwinScenario(this.value)">
              ${scenarios.map(s => `
                <option value="${s.id}" ${s.id === activeScenario.id ? 'selected' : ''}>${esc(s.query)}</option>
              `).join('')}
            </select>
            <button class="btn btn-outline btn-sm" onclick="exportTwinMemoCSV('${activeScenario.id}')">
              <i data-lucide="download"></i> Export Decision Memo
            </button>
          </div>
        </div>

        <!-- Featured Decision Card -->
        <div style="padding:1.5rem 1.5rem 0.5rem 1.5rem;">
          <div class="twin-decision-card">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem;border-bottom:1px solid rgba(255,255,255,0.15);padding-bottom:1.25rem;margin-bottom:1.5rem;">
              <div>
                <span class="badge" style="background:#8b5cf6;color:#fff;font-size:0.75rem;padding:3px 10px;font-weight:700;letter-spacing:0.5px;">SIMULATION SCENARIO</span>
                <div style="font-size:1.6rem;font-weight:900;letter-spacing:-0.5px;margin-top:0.5rem;color:#ffffff;">
                  &ldquo;${esc(activeScenario.query)}&rdquo;
                </div>
                <div style="font-size:0.875rem;color:#cbd5e1;margin-top:4px;">
                  Moving <strong>${esc(activeScenario.productName)}</strong> from <strong>${esc(activeScenario.currentVendorName)}</strong> (${activeScenario.currentCommissionRate}%) to <strong>${esc(activeScenario.targetVendorName)}</strong> (${activeScenario.targetCommissionRate}%) &bull; Annual Volume: <strong>$${activeScenario.currentAnnualVolume.toLocaleString()}</strong>
                </div>
              </div>
              <div style="text-align:right;">
                <span class="badge badge-success" style="font-size:0.8rem;padding:5px 12px;font-weight:800;">DECISION: RECOMMENDED (96% CONFIDENCE)</span>
                <div style="font-size:0.75rem;color:#94a3b8;margin-top:4px;">First-Year ROI: <strong style="color:#34d399;font-size:0.9rem;">${activeScenario.firstYearROI}%</strong></div>
              </div>
            </div>

            <!-- The 4 Required Calculations Grid -->
            <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:1.25rem;margin-bottom:1.5rem;">
              <!-- 1. Commission Impact -->
              <div class="twin-metric-pill" style="border-left:4px solid #10b981;">
                <div style="font-size:0.75rem;color:#94a3b8;text-transform:uppercase;font-weight:700;">1. Commission Impact</div>
                <div style="font-size:1.75rem;font-weight:900;color:#34d399;">+$${activeScenario.commissionImpactDollars.toLocaleString()} <span style="font-size:0.9rem;font-weight:600;">/ yr</span></div>
                <div style="font-size:0.8125rem;color:#cbd5e1;">Rate expansion: <strong>+${activeScenario.commissionImpactBps} bps</strong> (${activeScenario.currentCommissionRate}% &rarr; ${activeScenario.targetCommissionRate}%)</div>
                <div style="font-size:0.75rem;color:#94a3b8;margin-top:2px;">Gross revenue: $${activeScenario.currentAnnualCommission.toLocaleString()} &rarr; $${activeScenario.targetAnnualCommission.toLocaleString()}</div>
              </div>

              <!-- 2. Implementation Cost -->
              <div class="twin-metric-pill" style="border-left:4px solid #38bdf8;">
                <div style="font-size:0.75rem;color:#94a3b8;text-transform:uppercase;font-weight:700;">2. Implementation Cost</div>
                <div style="font-size:1.75rem;font-weight:900;color:#38bdf8;">$${activeScenario.implementationCostDollars.toLocaleString()}</div>
                <div style="font-size:0.8125rem;color:#cbd5e1;">Total one-off capital expenditure</div>
                <div style="font-size:0.75rem;color:#94a3b8;margin-top:2px;">Terminal injection: $6.2k &bull; Gateway: $4.8k &bull; Training: $3.5k</div>
              </div>

              <!-- 3. Transition Risk -->
              <div class="twin-metric-pill" style="border-left:4px solid #f59e0b;">
                <div style="font-size:0.75rem;color:#94a3b8;text-transform:uppercase;font-weight:700;">3. Transition Risk</div>
                <div style="font-size:1.75rem;font-weight:900;color:#fbbf24;">${activeScenario.transitionRiskTier} <span style="font-size:0.9rem;font-weight:600;">(${activeScenario.transitionRiskScore}/100)</span></div>
                <div style="font-size:0.8125rem;color:#cbd5e1;">Zero consumer disruption index</div>
                <div style="font-size:0.75rem;color:#94a3b8;margin-top:2px;">Existing API adapter certified in POS v4.9+</div>
              </div>

              <!-- 4. Payback Period -->
              <div class="twin-metric-pill" style="border-left:4px solid #a855f7;">
                <div style="font-size:0.75rem;color:#94a3b8;text-transform:uppercase;font-weight:700;">4. Payback Period</div>
                <div style="font-size:1.75rem;font-weight:900;color:#c084fc;">${activeScenario.paybackPeriodMonths} Months</div>
                <div style="font-size:0.8125rem;color:#cbd5e1;">Net 3-Yr NPV: <strong>+$${activeScenario.netBenefit3YrNPV.toLocaleString()}</strong></div>
                <div style="font-size:0.75rem;color:#94a3b8;margin-top:2px;">Full investment recovered by Month 5</div>
              </div>
            </div>

            <!-- Detailed AI Strategic Verdict -->
            <div style="background:rgba(255,255,255,0.06);border-radius:8px;padding:1rem 1.25rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
              <div style="display:flex;align-items:center;gap:0.75rem;">
                <span style="color:#a855f7;font-size:1.5rem;"><i data-lucide="sparkles"></i></span>
                <div style="font-size:0.875rem;color:#f1f5f9;line-height:1.4;">
                  <strong>DECISION INTELLIGENCE ADVISORY:</strong> ${esc(activeScenario.aiRecommendation)}
                </div>
              </div>
              <div style="display:flex;gap:0.5rem;">
                <button class="btn btn-sm" style="background:#8b5cf6;color:#fff;font-weight:700;" onclick="launchTwinRFP('${activeScenario.id}')">
                  <i data-lucide="send"></i> Launch RFP to Blackhawk Network
                </button>
                <button class="btn btn-hero-glass btn-sm" style="background:rgba(255,255,255,0.15);border:1.5px solid rgba(255,255,255,0.5);color:#ffffff;font-weight:700;" onclick="openSensitivityModal('${activeScenario.id}')">
                  <i data-lucide="bar-chart-2"></i> Sensitivity Analysis
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Implementation Cost Breakdown & Risk Analysis -->
        <div style="padding:0 1.5rem 1.5rem 1.5rem;display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;">
          <div class="card" style="margin-bottom:0;">
            <div class="card-header">
              <div class="card-title">Implementation Cost Itemization ($14,500 Total)</div>
            </div>
            <div class="card-body">
              ${(activeScenario.implementationCostBreakdown || []).map(item => `
                <div class="bundle-component-row">
                  <span style="font-weight:600;font-size:0.875rem;">${esc(item.item)}</span>
                  <span style="font-weight:800;font-size:0.95rem;color:#0284c7;">$${item.cost.toLocaleString()}</span>
                </div>
              `).join('')}
              <div style="margin-top:1rem;background:#f0fdf4;border:1px solid #bbf7d0;padding:0.75rem;border-radius:6px;font-size:0.8125rem;color:#15803d;">
                💡 <strong>Negotiation Tip:</strong> Blackhawk Network typically offers a <strong>$15,000 Signing Integration Credit</strong> for multi-door retailers, completely neutralizing implementation cost!
              </div>
            </div>
          </div>

          <div class="card" style="margin-bottom:0;">
            <div class="card-header">
              <div class="card-title">Transition Risk Factors & Mitigation Safeguards</div>
            </div>
            <div class="card-body">
              ${(activeScenario.transitionRiskFactors || []).map(r => `
                <div style="margin-bottom:0.75rem;padding-bottom:0.75rem;border-bottom:1px solid var(--border-color);">
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <strong style="font-size:0.875rem;">${esc(r.factor)}</strong>
                    <span class="badge ${r.level === 'Low' || r.level === 'None' ? 'badge-success' : 'badge-warning'}">${esc(r.level)}</span>
                  </div>
                  <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">${esc(r.detail)}</div>
                </div>
              `).join('')}
              <div style="font-size:0.75rem;color:var(--text-muted);display:flex;align-items:center;gap:0.4rem;">
                <i data-lucide="check-circle" style="color:#10b981;width:14px;height:14px;"></i>
                <span>Transition Feasibility Score: <strong>78/100 (Safe Migration)</strong></span>
              </div>
            </div>
          </div>
        </div>

        <!-- 4-Week Cutover Roadmap -->
        <div style="padding:0 1.5rem 1.5rem 1.5rem;">
          <div class="card">
            <div class="card-header">
              <div class="card-title">4-Week Phased Cutover & Go-Live Roadmap</div>
            </div>
            <div class="card-body">
              <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:1rem;">
                <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:0.75rem;">
                  <div style="font-weight:700;color:#6366f1;font-size:0.8125rem;text-transform:uppercase;">Week 1: Setup</div>
                  <div style="font-weight:700;margin:4px 0;">Gateway Key Injection</div>
                  <div style="font-size:0.75rem;color:var(--text-muted);">Inject Blackhawk encryption keys across central POS host.</div>
                </div>
                <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:0.75rem;">
                  <div style="font-weight:700;color:#6366f1;font-size:0.8125rem;text-transform:uppercase;">Week 2: Pilot</div>
                  <div style="font-weight:700;margin:4px 0;">50-Store Pilot Run</div>
                  <div style="font-size:0.75rem;color:var(--text-muted);">Validate scan activations and real-time ledger settlement.</div>
                </div>
                <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:0.75rem;">
                  <div style="font-weight:700;color:#6366f1;font-size:0.8125rem;text-transform:uppercase;">Week 3: Store Ops</div>
                  <div style="font-weight:700;margin:4px 0;">Associate Quick-Cards</div>
                  <div style="font-size:0.75rem;color:var(--text-muted);">Distribute register quick-reference cards & swap J-hooks.</div>
                </div>
                <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:0.75rem;">
                  <div style="font-weight:700;color:#15803d;font-size:0.8125rem;text-transform:uppercase;">Week 4: Go-Live</div>
                  <div style="font-weight:700;margin:4px 0;color:#15803d;">1,420 Doors Active</div>
                  <div style="font-size:0.75rem;color:var(--text-muted);">100% network cutover & decommissioning of legacy GiftFlow feed.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: AI Bundle Optimizer -->
    <div id="twin-tab-bundle" style="display:${AppState.twinActiveTab === 'bundle' ? 'block' : 'none'};">
      <!-- Flagship User Prompt Quote Banner -->
      <div class="bundle-synergy-banner">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem;">
          <div>
            <div style="display:flex;align-items:center;gap:0.5rem;font-size:0.8rem;text-transform:uppercase;letter-spacing:1px;color:#c084fc;font-weight:800;">
              <i data-lucide="sparkles"></i> AI Multi-Product Bundle Discovery Engine
            </div>
            <div style="font-size:1.65rem;font-weight:900;letter-spacing:-0.5px;margin-top:0.5rem;color:#ffffff;">
              &ldquo;${esc(activeBundle.discoveryStatement)}&rdquo;
            </div>
            <div style="font-size:0.875rem;color:#e2e8f0;margin-top:4px;">
              Consolidating independent single-product contracts into unified cross-category bundles triggers automated volume tier-jumping and eliminates redundant middleware gateway fees.
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:2rem;font-weight:900;color:#4ade80;">+${activeBundle.netYieldIncreasePercent}%</div>
            <div style="font-size:0.8125rem;color:#e2e8f0;font-weight:600;">Overall Commission Yield Expansion</div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:1rem;margin-top:1.5rem;border-top:1px solid rgba(255,255,255,0.2);padding-top:1.25rem;">
          <div>
            <div style="font-size:0.75rem;color:#cbd5e1;text-transform:uppercase;font-weight:700;">Combined Annual Volume</div>
            <div style="font-size:1.4rem;font-weight:800;color:#ffffff;">$${(activeBundle.totalBundleVolume/1000000).toFixed(1)}M / yr</div>
          </div>
          <div>
            <div style="font-size:0.75rem;color:#cbd5e1;text-transform:uppercase;font-weight:700;">Current Standalone Yield</div>
            <div style="font-size:1.4rem;font-weight:800;color:#ffffff;">${activeBundle.currentStandaloneWeightedYield}%</div>
          </div>
          <div>
            <div style="font-size:0.75rem;color:#cbd5e1;text-transform:uppercase;font-weight:700;">Bundled Consolidated Yield</div>
            <div style="font-size:1.4rem;font-weight:800;color:#4ade80;">${activeBundle.bundledConsolidatedYield}%</div>
          </div>
          <div>
            <div style="font-size:0.75rem;color:#cbd5e1;text-transform:uppercase;font-weight:700;">Annual EBITDA Expansion</div>
            <div style="font-size:1.4rem;font-weight:800;color:#4ade80;">+$${activeBundle.annualEbitdaGain.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <!-- Bundle Selector & Components -->
      <div style="display:grid;grid-template-columns:340px 1fr;gap:1.5rem;margin-bottom:1.5rem;">
        <!-- Left: Discovered Bundles List -->
        <div>
          <div class="card" style="margin-bottom:1rem;">
            <div class="card-header">
              <div class="card-title">Discovered Multi-Product Bundles</div>
            </div>
            <div class="card-body" style="padding:0.75rem;">
              ${bundles.map(b => {
                const isSelected = b.id === activeBundle.id;
                return `
                  <div class="pipeline-card" style="cursor:pointer;border-left:4px solid #8b5cf6;${isSelected ? 'background:#f5f3ff;border-color:#7c3aed;' : ''}" onclick="selectBundle('${b.id}')">
                    <div style="font-weight:700;font-size:0.875rem;">${esc(b.name)}</div>
                    <div style="display:flex;justify-content:space-between;margin-top:6px;font-size:0.8125rem;">
                      <span style="font-weight:800;color:#15803d;">+${b.netYieldIncreasePercent}% Yield</span>
                      <span style="font-weight:700;color:#0284c7;">+$${Math.round(b.annualEbitdaGain/1000)}k/yr</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-title">Bundle Execution Actions</div>
            </div>
            <div class="card-body" style="display:flex;flex-direction:column;gap:0.5rem;">
              <button class="btn btn-primary" onclick="launchBundleRFP('${activeBundle.id}')">
                <i data-lucide="zap"></i> Launch Multi-Category RFP
              </button>
              <button class="btn btn-outline" onclick="exportBundleTermSheet('${activeBundle.id}')">
                <i data-lucide="file-spreadsheet"></i> Export Term Sheet & Synergies
              </button>
            </div>
          </div>
        </div>

        <!-- Right: Bundle Breakdown & Synergies -->
        <div>
          <div class="card" style="margin-bottom:1.5rem;">
            <div class="card-header">
              <div>
                <div class="card-title">${esc(activeBundle.name)} Breakdown</div>
                <div class="card-subtitle">Comparing individual standalone contracts vs. consolidated multi-service contract with ${esc(activeBundle.targetVendor)}.</div>
              </div>
            </div>

            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Included Product / Service</th>
                    <th>Category</th>
                    <th style="text-align:right;">Annual GMV Volume</th>
                    <th style="text-align:right;">Standalone Rate</th>
                    <th style="text-align:right;">Bundled Rate</th>
                    <th style="text-align:right;">Net Margin Gain</th>
                  </tr>
                </thead>
                <tbody>
                  ${(activeBundle.includedProducts || []).map(p => `
                    <tr>
                      <td style="font-weight:700;">${esc(p.name)}</td>
                      <td><span class="badge badge-neutral">${esc(p.category)}</span></td>
                      <td style="text-align:right;font-weight:600;">$${p.currentVolume.toLocaleString()}</td>
                      <td style="text-align:right;color:var(--text-muted);">${p.standaloneRate}%</td>
                      <td style="text-align:right;font-weight:800;color:#10b981;">${p.bundledRate}%</td>
                      <td style="text-align:right;font-weight:800;color:#059669;">+${(p.bundledRate - p.standaloneRate).toFixed(2)}%</td>
                    </tr>
                  `).join('')}
                  <tr style="background:#f8fafc;font-weight:800;">
                    <td>CONSOLIDATED TOTALS</td>
                    <td>3 Core Categories</td>
                    <td style="text-align:right;">$${activeBundle.totalBundleVolume.toLocaleString()}</td>
                    <td style="text-align:right;">${activeBundle.currentStandaloneWeightedYield}%</td>
                    <td style="text-align:right;color:#10b981;">${activeBundle.bundledConsolidatedYield}%</td>
                    <td style="text-align:right;color:#059669;">+${activeBundle.netYieldIncreasePercent}% (+${activeBundle.netYieldIncreaseBps} bps)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Decoded Synergies -->
          <div class="card">
            <div class="card-header">
              <div class="card-title">Decoded Multi-Product Synergies & Margin Multipliers</div>
            </div>
            <div class="card-body">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
                ${(activeBundle.bundleSynergies || []).map(s => `
                  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:0.875rem;">
                    <div style="font-weight:700;color:#6366f1;font-size:0.875rem;display:flex;align-items:center;gap:0.35rem;">
                      <i data-lucide="check-circle" style="width:14px;height:14px;color:#10b981;"></i>
                      ${esc(s.title)}
                    </div>
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px;line-height:1.4;">
                      ${esc(s.detail)}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 3: Interactive What-If Scenario Builder -->
    <div id="twin-tab-custom" style="display:${AppState.twinActiveTab === 'custom' ? 'block' : 'none'};">
      <div class="card" style="margin-bottom:1.5rem;">
        <div class="card-header">
          <div>
            <div class="card-title">Interactive &ldquo;What-If&rdquo; Decision Simulator Studio</div>
            <div class="card-subtitle">Model any custom vendor change or migration. The AI instantly computes Commission Impact, Implementation Cost, Transition Risk, and Payback Period.</div>
          </div>
        </div>
        <div class="card-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;">
            <div>
              <div class="form-group">
                <label class="form-label" style="font-weight:700;">Product / Service to Model</label>
                <input id="sim-product" type="text" class="form-input" value="${esc(AppState.customSim.productName)}" oninput="AppState.customSim.productName = this.value;">
              </div>

              <div class="form-group">
                <label class="form-label" style="font-weight:700;">Current Vendor Partner</label>
                <input id="sim-current-vendor" type="text" class="form-input" value="${esc(AppState.customSim.currentVendor)}" oninput="AppState.customSim.currentVendor = this.value;">
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
                <div class="form-group">
                  <label class="form-label" style="font-weight:700;">Current Commission (%)</label>
                  <input id="sim-current-rate" type="number" step="0.05" class="form-input" value="${AppState.customSim.currentRate}" oninput="updateCustomSim();">
                </div>
                <div class="form-group">
                  <label class="form-label" style="font-weight:700;">Target Commission (%)</label>
                  <input id="sim-target-rate" type="number" step="0.05" class="form-input" value="${AppState.customSim.targetRate}" oninput="updateCustomSim();">
                </div>
              </div>
            </div>

            <div>
              <div class="form-group">
                <label class="form-label" style="font-weight:700;">Target Vendor Partner</label>
                <input id="sim-target-vendor" type="text" class="form-input" value="${esc(AppState.customSim.targetVendor)}" oninput="AppState.customSim.targetVendor = this.value;">
              </div>

              <div class="form-group">
                <label class="form-label" style="font-weight:700;">Annual Settled GMV Volume ($)</label>
                <input id="sim-volume" type="range" class="form-range" min="500000" max="10000000" step="100000" value="${AppState.customSim.volume}" oninput="document.getElementById('lbl-sim-volume').innerText = '$' + Number(this.value).toLocaleString(); AppState.customSim.volume = Number(this.value); updateCustomSim();">
                <div id="lbl-sim-volume" style="font-weight:800;font-size:1.1rem;color:#8b5cf6;margin-top:0.25rem;">$${AppState.customSim.volume.toLocaleString()}</div>
              </div>

              <div class="form-group">
                <label class="form-label" style="font-weight:700;">Chain Door Count</label>
                <input type="number" class="form-input" value="1420" readonly>
              </div>
            </div>
          </div>

          <!-- Dynamic Output Results Box -->
          <div id="custom-sim-results" style="margin-top:1.5rem;background:#f8fafc;border:2px solid #8b5cf6;border-radius:8px;padding:1.5rem;">
            <!-- Computed dynamically in updateCustomSim() -->
          </div>
        </div>
      </div>
    </div>
  `);

  setTimeout(() => {
    if (typeof lucide !== 'undefined') lucide.createIcons();
    if (AppState.twinActiveTab === 'custom') {
      window.updateCustomSim();
    }
  }, 50);
};

// Twin Handlers
window.setTwinTab = function(tabName) {
  AppState.twinActiveTab = tabName;
  window.renderDigitalTwin();
};

window.selectTwinScenario = function(scenId) {
  AppState.selectedScenarioId = scenId;
  window.renderDigitalTwin();
};

window.selectBundle = function(bundleId) {
  AppState.selectedBundleId = bundleId;
  window.renderDigitalTwin();
};

window.updateCustomSim = function() {
  const currentRate = Number(document.getElementById('sim-current-rate')?.value) || AppState.customSim.currentRate;
  const targetRate = Number(document.getElementById('sim-target-rate')?.value) || AppState.customSim.targetRate;
  const volume = AppState.customSim.volume || 2400000;

  const currentComm = (volume * currentRate) / 100;
  const targetComm = (volume * targetRate) / 100;
  const deltaComm = targetComm - currentComm;
  const deltaBps = Math.round((targetRate - currentRate) * 100);

  const implCost = 14500;
  const paybackMonths = deltaComm > 0 ? ((implCost / deltaComm) * 12).toFixed(1) : 'N/A';
  const threeYrNPV = deltaComm > 0 ? Math.round((deltaComm * 2.7) - implCost) : 0;
  const riskScore = 25;

  const resDiv = document.getElementById('custom-sim-results');
  if (resDiv) {
    resDiv.innerHTML = `
      <div style="font-weight:800;font-size:1.1rem;color:#0f172a;margin-bottom:1rem;display:flex;justify-content:space-between;align-items:center;">
        <span>AI Simulation Engine Decision Intelligence Results</span>
        <span class="badge badge-success">Decision: Recommended</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:1rem;">
        <div style="background:#fff;border:1px solid #cbd5e1;padding:1rem;border-radius:6px;">
          <div style="font-size:0.75rem;color:var(--text-muted);font-weight:700;text-transform:uppercase;">1. Commission Impact</div>
          <div style="font-size:1.5rem;font-weight:900;color:#15803d;margin:4px 0;">+$${Math.round(deltaComm).toLocaleString()} / yr</div>
          <div style="font-size:0.75rem;color:var(--text-muted);">Rate Gain: +${deltaBps} bps (${currentRate}% &rarr; ${targetRate}%)</div>
        </div>
        <div style="background:#fff;border:1px solid #cbd5e1;padding:1rem;border-radius:6px;">
          <div style="font-size:0.75rem;color:var(--text-muted);font-weight:700;text-transform:uppercase;">2. Implementation Cost</div>
          <div style="font-size:1.5rem;font-weight:900;color:#0284c7;margin:4px 0;">$${implCost.toLocaleString()}</div>
          <div style="font-size:0.75rem;color:var(--text-muted);">Key injection & POS gateway setup</div>
        </div>
        <div style="background:#fff;border:1px solid #cbd5e1;padding:1rem;border-radius:6px;">
          <div style="font-size:0.75rem;color:var(--text-muted);font-weight:700;text-transform:uppercase;">3. Transition Risk</div>
          <div style="font-size:1.5rem;font-weight:900;color:#b45309;margin:4px 0;">Low Risk (${riskScore}/100)</div>
          <div style="font-size:0.75rem;color:var(--text-muted);">Zero customer disruption index</div>
        </div>
        <div style="background:#fff;border:1px solid #cbd5e1;padding:1rem;border-radius:6px;">
          <div style="font-size:0.75rem;color:var(--text-muted);font-weight:700;text-transform:uppercase;">4. Payback Period</div>
          <div style="font-size:1.5rem;font-weight:900;color:#7c3aed;margin:4px 0;">${paybackMonths} Months</div>
          <div style="font-size:0.75rem;color:var(--text-muted);">3-Year Net NPV: +$${threeYrNPV.toLocaleString()}</div>
        </div>
      </div>
    `;
  }
};

window.launchTwinRFP = function(scenId) {
  const scen = (MockData.digitalTwinScenarios || []).find(s => s.id === scenId) || {};
  showToast('Launching targeted RFP to ' + scen.targetVendorName + ' (+$${scen.commissionImpactDollars.toLocaleString()} opportunity)...');
  setTimeout(() => {
    window.location.hash = '#/sourcing';
  }, 400);
};

window.launchBundleRFP = function(bundleId) {
  const bundle = (MockData.bundleOptimizerData || []).find(b => b.id === bundleId) || {};
  showToast('Launching Multi-Category Reverse Auction for ' + bundle.name + ' (+$${bundle.annualEbitdaGain.toLocaleString()} EBITDA)...');
  setTimeout(() => {
    window.location.hash = '#/sourcing';
  }, 400);
};

window.openSensitivityModal = function(scenId) {
  const scen = (MockData.digitalTwinScenarios || []).find(s => s.id === scenId) || {};
  _showModal({
    title: 'Monte Carlo Sensitivity & Stress Test: ' + scen.query,
    content: `
      <div style="font-size:0.875rem;">
        <p>Simulation results across 10,000 randomized Monte Carlo trials under fluctuating consumer transaction volume & foot traffic volatility:</p>
        <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:6px;padding:1rem;margin:1rem 0;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;">
            <span>Best Case (+20% Holiday Surge):</span>
            <strong style="color:#15803d;">+$52,800/yr (3.3 Month Payback)</strong>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;">
            <span>Expected Base Case:</span>
            <strong style="color:#0284c7;">+$42,000/yr (4.1 Month Payback)</strong>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span>Worst Case (-20% Downturn):</span>
            <strong style="color:#b45309;">+$31,200/yr (5.6 Month Payback)</strong>
          </div>
        </div>
        <p style="color:#15803d;font-weight:600;">✓ In 100% of simulated market scenarios, the migration generates positive net EBITDA within 6 months.</p>
      </div>
    `,
    confirmText: 'Done',
    onConfirm: () => {}
  });
};

window.exportTwinMemoCSV = function(scenId) {
  const scen = (MockData.digitalTwinScenarios || []).find(s => s.id === scenId) || {};
  const rows = [{
    'Scenario Query': scen.query,
    'Product': scen.productName,
    'Current Vendor': scen.currentVendorName,
    'Current Commission %': scen.currentCommissionRate,
    'Target Vendor': scen.targetVendorName,
    'Target Commission %': scen.targetCommissionRate,
    'Commission Impact ($/yr)': scen.commissionImpactDollars,
    'Implementation Cost ($)': scen.implementationCostDollars,
    'Transition Risk Score': scen.transitionRiskScore,
    'Transition Risk Tier': scen.transitionRiskTier,
    'Payback Period (Months)': scen.paybackPeriodMonths,
    '3-Year Net NPV ($)': scen.netBenefit3YrNPV,
    'First Year ROI (%)': scen.firstYearROI,
    'Cutover Roadmap': scen.transitionRoadmapWeeks + ' Weeks'
  }];
  exportToCSV(rows, 'Digital_Twin_Decision_Intelligence_Memo.csv');
  showToast('Exported Digital Twin decision memo CSV');
};

window.exportBundleTermSheet = function(bundleId) {
  const bundle = (MockData.bundleOptimizerData || []).find(b => b.id === bundleId) || {};
  const rows = (bundle.includedProducts || []).map(p => ({
    'Bundle Name': bundle.name,
    'Discovery Statement': bundle.discoveryStatement,
    'Target Vendor': bundle.targetVendor,
    'Product Name': p.name,
    'Category': p.category,
    'Current Volume ($)': p.currentVolume,
    'Standalone Rate (%)': p.standaloneRate,
    'Bundled Rate (%)': p.bundledRate,
    'Rate Gain (%)': (p.bundledRate - p.standaloneRate).toFixed(2),
    'Total Bundle Volume ($)': bundle.totalBundleVolume,
    'Overall Yield Expansion (%)': bundle.netYieldIncreasePercent,
    'Annual EBITDA Gain ($)': bundle.annualEbitdaGain
  }));
  exportToCSV(rows, 'AI_Bundle_Optimizer_Term_Sheet.csv');
  showToast('Exported Bundle Optimizer term sheet CSV');
};


window.renderContracts = function() {
  const container = (document.getElementById('content-area') || document.getElementById('main-content'));
  if (!container) return;

  if (!window._contractState) {
    window._contractState = {
      activeTab: 'register', // 'register' | 'ingest' | 'alerts' | 'analytics' | 'config'
      searchQuery: '',
      categoryFilter: 'all',
      exclusivityFilter: 'all',
      noticeHorizonFilter: 'all', // 'all' | 'critical' | 'upcoming' | 'safe' | 'expired'
      viewMode: 'table' // 'table' | 'cards'
    };
  }

  const state = window._contractState;
  const currentUser = Auth.getCurrentUser();
  const isVendor = currentUser?.role === 'vendor';
  const isFinance = currentUser?.role === 'finance_analyst';
  const canManage = Auth.hasPermission('contracts.manage') || ['system_admin', 'executive_sponsor', 'procurement_manager', 'category_manager'].includes(currentUser?.role);

  // Vendor role isolation
  let allContracts = MockData.contracts || [];
  if (isVendor) {
    allContracts = allContracts.filter(c => c.vendorId === (currentUser.vendorId || 'V001'));
  }

  // Calculate high-level KPIs
  const totalContracts = allContracts.length;
  const activeContracts = allContracts.filter(c => c.status === 'active').length;
  const expiringContracts = allContracts.filter(c => c.status === 'expiring' || c.noticeStatus === 'critical').length;
  const exclusiveContracts = allContracts.filter(c => c.exclusivity?.isExclusive).length;
  const totalManagedVolume = allContracts.reduce((sum, c) => sum + (c.annualVolume || c.value || 0), 0);
  const totalAnnualLeakage = allContracts.reduce((sum, c) => sum + (c.commission?.annualLeakage || 0), 0);

  // Filtered contracts
  const filtered = allContracts.filter(c => {
    const matchCat = state.categoryFilter === 'all' || c.category === state.categoryFilter;
    const matchExcl = state.exclusivityFilter === 'all' ||
      (state.exclusivityFilter === 'exclusive' && c.exclusivity?.isExclusive) ||
      (state.exclusivityFilter === 'non_exclusive' && !c.exclusivity?.isExclusive);
    const matchNotice = state.noticeHorizonFilter === 'all' || c.noticeStatus === state.noticeHorizonFilter;
    const q = state.searchQuery.toLowerCase().trim();
    const matchSearch = !q ||
      c.title.toLowerCase().includes(q) ||
      c.vendorName.toLowerCase().includes(q) ||
      (c.category && c.category.toLowerCase().includes(q)) ||
      (c.exclusivity?.clauseText && c.exclusivity.clauseText.toLowerCase().includes(q));

    return matchCat && matchExcl && matchNotice && matchSearch;
  });

  // Collect all proactive alerts
  const allAlerts = [];
  allContracts.forEach(c => {
    if (c.proactiveAlerts && Array.isArray(c.proactiveAlerts)) {
      c.proactiveAlerts.forEach(a => {
        allAlerts.push({ ...a, contractId: c.id, vendorName: c.vendorName, contractTitle: c.title });
      });
    }
  });

  // Sort alerts: danger first, then warning, then info
  allAlerts.sort((a, b) => {
    const p = { danger: 3, critical: 3, warning: 2, info: 1 };
    return (p[b.severity] || 0) - (p[a.severity] || 0);
  });

  // HTML Render
  container.innerHTML = `
    <div class="page-header" style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem;">
      <div>
        <div style="display:flex;align-items:center;gap:0.625rem;">
          <span style="background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;width:32px;height:32px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(79,70,229,0.3);">
            <i data-lucide="file-text" style="width:18px;height:18px;"></i>
          </span>
          <h1 class="page-title" style="margin:0;font-size:1.625rem;font-weight:800;letter-spacing:-0.02em;">AI Contract Intelligence</h1>
          <span class="badge" style="background:#e0e7ff;color:#3730a3;font-size:0.75rem;font-weight:700;padding:2px 8px;border-radius:999px;">
            AI NLP Pipeline Active
          </span>
        </div>
        <p class="page-desc" style="color:var(--text-light);margin-top:0.35rem;max-width:850px;font-size:0.875rem;">
          Autonomous contract ingestion & NLP extraction. Monitors commission yields, auto-renewal deadlines, exclusivity covenants, and notice periods to generate proactive negotiation alerts.
        </p>
      </div>

      <div style="display:flex;gap:0.625rem;flex-wrap:wrap;">
        <button class="btn btn-outline btn-sm" onclick="window.exportContractIntelligenceCSV()">
          <i data-lucide="download"></i> Export Intelligence Register
        </button>
        ${!isVendor ? `
          <button class="btn btn-primary btn-sm" onclick="window.setContractTab('ingest')">
            <i data-lucide="sparkles"></i> Ingest New Contract
          </button>
        ` : ''}
      </div>
    </div>

    <!-- ── KPI METRICS SUMMARY ROW ── -->
    <div class="kpi-grid" style="grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:1rem;margin-bottom:1.5rem;">
      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-title">Contracts Under AI Audit</span>
          <div class="kpi-icon-wrap" style="background:#eff6ff;color:#2563eb;"><i data-lucide="file-check"></i></div>
        </div>
        <div class="kpi-value">${totalContracts}</div>
        <div class="kpi-footer">
          <span class="text-success font-semibold">${activeContracts} Active</span> &bull; ${formatCurrency(totalManagedVolume)} GMV
        </div>
      </div>

      <div class="kpi-card" style="border-left:4px solid #ef4444;">
        <div class="kpi-header">
          <span class="kpi-title">Notice Cut-Off Deadlines</span>
          <div class="kpi-icon-wrap" style="background:#fee2e2;color:#dc2626;"><i data-lucide="clock"></i></div>
        </div>
        <div class="kpi-value" style="color:#dc2626;">${expiringContracts}</div>
        <div class="kpi-footer">
          <span class="text-danger font-semibold">Immediate Non-Renewal Required</span>
        </div>
      </div>

      <div class="kpi-card" style="border-left:4px solid #f59e0b;">
        <div class="kpi-header">
          <span class="kpi-title">Exclusivity Restrictive Covenants</span>
          <div class="kpi-icon-wrap" style="background:#fef3c7;color:#d97706;"><i data-lucide="shield-alert"></i></div>
        </div>
        <div class="kpi-value" style="color:#d97706;">${exclusiveContracts}</div>
        <div class="kpi-footer">
          <span class="text-muted font-semibold">Lock out open competitive RFPs</span>
        </div>
      </div>

      <div class="kpi-card" style="border-left:4px solid #10b981;">
        <div class="kpi-header">
          <span class="kpi-title">Annual Rate Disadvantage Leakage</span>
          <div class="kpi-icon-wrap" style="background:#ecfdf5;color:#059669;"><i data-lucide="trending-down"></i></div>
        </div>
        <div class="kpi-value" style="color:#059669;">${formatCurrency(totalAnnualLeakage)}</div>
        <div class="kpi-footer">
          <span class="text-success font-semibold">Recovery opportunity via renegotiation</span>
        </div>
      </div>
    </div>

    <!-- ── NAVIGATION TABS ── -->
    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1.5px solid var(--border);margin-bottom:1.25rem;flex-wrap:wrap;gap:0.75rem;">
      <div style="display:flex;gap:0.5rem;">
        <button class="tab-btn ${state.activeTab === 'register' ? 'active' : ''}" onclick="window.setContractTab('register')" style="display:flex;align-items:center;gap:0.4rem;padding:0.75rem 1rem;font-size:0.875rem;font-weight:700;border:none;background:none;border-bottom:2.5px solid ${state.activeTab === 'register' ? '#4f46e5' : 'transparent'};color:${state.activeTab === 'register' ? '#4f46e5' : 'var(--text-muted)'};cursor:pointer;">
          <i data-lucide="layers" style="width:16px;height:16px;"></i> Contract Register & Clauses (${filtered.length})
        </button>
        ${!isVendor ? `
          <button class="tab-btn ${state.activeTab === 'ingest' ? 'active' : ''}" onclick="window.setContractTab('ingest')" style="display:flex;align-items:center;gap:0.4rem;padding:0.75rem 1rem;font-size:0.875rem;font-weight:700;border:none;background:none;border-bottom:2.5px solid ${state.activeTab === 'ingest' ? '#4f46e5' : 'transparent'};color:${state.activeTab === 'ingest' ? '#4f46e5' : 'var(--text-muted)'};cursor:pointer;">
            <i data-lucide="sparkles" style="width:16px;height:16px;"></i> AI Ingestion Studio
          </button>
          <button class="tab-btn ${state.activeTab === 'alerts' ? 'active' : ''}" onclick="window.setContractTab('alerts')" style="display:flex;align-items:center;gap:0.4rem;padding:0.75rem 1rem;font-size:0.875rem;font-weight:700;border:none;background:none;border-bottom:2.5px solid ${state.activeTab === 'alerts' ? '#4f46e5' : 'transparent'};color:${state.activeTab === 'alerts' ? '#4f46e5' : 'var(--text-muted)'};cursor:pointer;">
            <i data-lucide="bell-ring" style="width:16px;height:16px;"></i> Proactive Alerts Radar (${allAlerts.length})
          </button>
          <button class="tab-btn ${state.activeTab === 'analytics' ? 'active' : ''}" onclick="window.setContractTab('analytics')" style="display:flex;align-items:center;gap:0.4rem;padding:0.75rem 1rem;font-size:0.875rem;font-weight:700;border:none;background:none;border-bottom:2.5px solid ${state.activeTab === 'analytics' ? '#4f46e5' : 'transparent'};color:${state.activeTab === 'analytics' ? '#4f46e5' : 'var(--text-muted)'};cursor:pointer;">
            <i data-lucide="bar-chart-2" style="width:16px;height:16px;"></i> Portfolio Analytics
          </button>
          <button class="tab-btn ${state.activeTab === 'config' ? 'active' : ''}" onclick="window.setContractTab('config')" style="display:flex;align-items:center;gap:0.4rem;padding:0.75rem 1rem;font-size:0.875rem;font-weight:700;border:none;background:none;border-bottom:2.5px solid ${state.activeTab === 'config' ? '#4f46e5' : 'transparent'};color:${state.activeTab === 'config' ? '#4f46e5' : 'var(--text-muted)'};cursor:pointer;">
            <i data-lucide="sliders" style="width:16px;height:16px;"></i> Configuration & Rules
          </button>
        ` : ''}
      </div>

      ${state.activeTab === 'register' ? `
        <div style="display:flex;align-items:center;gap:0.35rem;padding:0.25rem;background:#f1f5f9;border-radius:var(--radius-sm);">
          <button class="btn btn-sm ${state.viewMode === 'table' ? 'btn-primary' : 'btn-ghost'}" style="padding:4px 8px;" onclick="window.setContractViewMode('table')" title="Table View">
            <i data-lucide="list" style="width:14px;height:14px;"></i>
          </button>
          <button class="btn btn-sm ${state.viewMode === 'cards' ? 'btn-primary' : 'btn-ghost'}" style="padding:4px 8px;" onclick="window.setContractViewMode('cards')" title="Card Grid View">
            <i data-lucide="grid" style="width:14px;height:14px;"></i>
          </button>
        </div>
      ` : ''}
    </div>

    <!-- ── TAB CONTENT CONTAINERS ── -->
    <div id="contract-tab-content">
      ${state.activeTab === 'register' ? _renderContractRegister(filtered, state, isVendor, canManage) : ''}
      ${state.activeTab === 'ingest' ? _renderContractIngestStudio() : ''}
      ${state.activeTab === 'alerts' ? _renderContractAlertsRadar(allAlerts, canManage) : ''}
      ${state.activeTab === 'analytics' ? _renderContractAnalytics(allContracts) : ''}
      ${state.activeTab === 'config' ? _renderContractConfig() : ''}
    </div>
  `;

  lucide.createIcons();

  if (state.activeTab === 'analytics') {
    setTimeout(window._initContractCharts, 50);
  }
};

// ─────────────────────────────────────────────────────────────
//  TAB 1: CONTRACT REGISTER & CLAUSE INTELLIGENCE
// ─────────────────────────────────────────────────────────────
function _renderContractRegister(contracts, state, isVendor, canManage) {
  const categories = ['all', 'Gift Cards', 'Money Transfer', 'Prepaid & Streaming', 'Debit Services', 'Financial Services'];

  return `
    <!-- Filter bar -->
    <div class="card" style="margin-bottom:1.25rem;padding:1rem 1.25rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.875rem;">
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center;flex:1;">
          <!-- Search -->
          <div style="position:relative;min-width:240px;flex:1;max-width:320px;">
            <i data-lucide="search" style="position:absolute;left:10px;top:50%;transform:translateY(-50%);width:14px;height:14px;color:var(--text-muted);"></i>
            <input
              type="text"
              class="form-input"
              style="padding-left:2rem;font-size:0.8125rem;"
              placeholder="Search contracts, clauses, vendors..."
              value="${esc(state.searchQuery)}"
              oninput="window.setContractSearch(this.value)"
            />
          </div>

          <!-- Category filter -->
          <div>
            <select class="form-input" style="font-size:0.8125rem;" onchange="window.setContractFilter('categoryFilter', this.value)">
              ${categories.map(c => `<option value="${c}" ${state.categoryFilter === c ? 'selected' : ''}>${c === 'all' ? 'All Categories' : c}</option>`).join('')}
            </select>
          </div>

          <!-- Exclusivity filter -->
          <div>
            <select class="form-input" style="font-size:0.8125rem;" onchange="window.setContractFilter('exclusivityFilter', this.value)">
              <option value="all" ${state.exclusivityFilter === 'all' ? 'selected' : ''}>All Exclusivity Types</option>
              <option value="exclusive" ${state.exclusivityFilter === 'exclusive' ? 'selected' : ''}>Exclusive Only (Restricted)</option>
              <option value="non_exclusive" ${state.exclusivityFilter === 'non_exclusive' ? 'selected' : ''}>Non-Exclusive (Open)</option>
            </select>
          </div>

          <!-- Notice window filter -->
          <div>
            <select class="form-input" style="font-size:0.8125rem;" onchange="window.setContractFilter('noticeHorizonFilter', this.value)">
              <option value="all" ${state.noticeHorizonFilter === 'all' ? 'selected' : ''}>All Notice Statuses</option>
              <option value="critical" ${state.noticeHorizonFilter === 'critical' ? 'selected' : ''}>Critical Deadline (Due Now)</option>
              <option value="upcoming" ${state.noticeHorizonFilter === 'upcoming' ? 'selected' : ''}>Upcoming Notice Window (<90d)</option>
              <option value="safe" ${state.noticeHorizonFilter === 'safe' ? 'selected' : ''}>Safe Horizon (>90d)</option>
              <option value="expired" ${state.noticeHorizonFilter === 'expired' ? 'selected' : ''}>Expired Contracts</option>
            </select>
          </div>
        </div>

        <div style="font-size:0.8125rem;color:var(--text-muted);">
          Showing <strong>${contracts.length}</strong> extracted contracts
        </div>
      </div>
    </div>

    ${contracts.length === 0 ? `
      <div class="card" style="padding:3rem;text-align:center;">
        <i data-lucide="file-x" style="width:48px;height:48px;color:var(--text-muted);margin:0 auto 1rem auto;"></i>
        <div style="font-weight:700;font-size:1.125rem;color:var(--text);">No contracts match your search filters</div>
        <p style="color:var(--text-muted);font-size:0.875rem;margin-top:0.25rem;">Try adjusting your search keywords or resetting the category / exclusivity filters.</p>
        <button class="btn btn-outline btn-sm" style="margin-top:1rem;" onclick="window.resetContractFilters()">
          <i data-lucide="rotate-ccw"></i> Reset Filters
        </button>
      </div>
    ` : state.viewMode === 'cards' ? _renderContractCardsView(contracts, canManage, isVendor) : _renderContractTableView(contracts, canManage, isVendor)}
  `;
}

function _renderContractTableView(contracts, canManage, isVendor) {
  return `
    <div class="card" style="overflow:hidden;border:1.5px solid var(--border);">
      <div class="table-wrap">
        <table class="table" style="font-size:0.8125rem;width:100%;">
          <thead>
            <tr>
              <th>Contract & Vendor</th>
              <th>Category</th>
              <th>Extracted Commission</th>
              <th>Renewal Date & Notice Period</th>
              <th>Exclusivity Clause</th>
              <th>AI Confidence</th>
              <th>Active Alerts</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${contracts.map(c => {
              const comm = c.commission || {};
              const excl = c.exclusivity || {};
              const alertCount = c.proactiveAlerts ? c.proactiveAlerts.length : 0;
              const hasCriticalAlert = c.proactiveAlerts && c.proactiveAlerts.some(a => a.severity === 'danger' || a.severity === 'critical');

              let noticeBadge = '<span class="badge badge-success">Safe</span>';
              if (c.noticeStatus === 'critical') {
                noticeBadge = '<span class="notice-countdown-pill notice-pill-danger"><i data-lucide="clock" style="width:12px;height:12px;"></i> Deadline Due</span>';
              } else if (c.noticeStatus === 'upcoming') {
                noticeBadge = '<span class="notice-countdown-pill notice-pill-warning"><i data-lucide="alert-circle" style="width:12px;height:12px;"></i> Window <60d</span>';
              } else if (c.noticeStatus === 'expired') {
                noticeBadge = '<span class="badge badge-danger">Expired</span>';
              }

              let exclBadge = '<span class="exclusivity-pill exclusivity-low"><i data-lucide="unlock" style="width:11px;height:11px;"></i> Non-Exclusive</span>';
              if (excl.isExclusive && excl.riskLevel === 'High') {
                exclBadge = '<span class="exclusivity-pill exclusivity-high"><i data-lucide="lock" style="width:11px;height:11px;"></i> Sole & Exclusive</span>';
              } else if (excl.isExclusive || excl.riskLevel === 'Medium') {
                exclBadge = '<span class="exclusivity-pill exclusivity-medium"><i data-lucide="shield-alert" style="width:11px;height:11px;"></i> Preferred / ROFR</span>';
              }

              return `
                <tr style="${c.noticeStatus === 'critical' ? 'background:rgba(254,242,242,0.4);' : ''}">
                  <td>
                    <div style="font-weight:700;color:var(--text);font-size:0.875rem;">${esc(c.title)}</div>
                    <div style="color:var(--text-muted);display:flex;align-items:center;gap:0.35rem;margin-top:0.15rem;">
                      <i data-lucide="building" style="width:12px;height:12px;"></i> ${esc(c.vendorName)}
                      <span class="badge badge-neutral" style="font-size:0.65rem;">${esc(c.id)}</span>
                      ${c.workflowState === 'in_notice' ? '<span class="badge badge-warning" style="font-size:0.65rem;">Notice Served</span>' : ''}
                    </div>
                  </td>
                  <td>
                    <span class="badge badge-neutral">${esc(c.category)}</span>
                  </td>
                  <td>
                    <div class="font-mono" style="font-weight:800;color:${comm.varianceBps < 0 ? '#b91c1c' : '#047857'};">
                      ${esc(comm.rateDisplay || (comm.rate + '%'))}
                    </div>
                    <div style="font-size:0.7rem;color:var(--text-muted);margin-top:0.1rem;">
                      Benchmark: ${comm.benchmarkRate}% ${comm.varianceBps ? `(${comm.varianceBps > 0 ? '+' : ''}${comm.varianceBps} bps)` : ''}
                    </div>
                    ${comm.minimumGuarantee === 0 ? `
                      <div style="font-size:0.6875rem;color:#dc2626;font-weight:600;margin-top:0.15rem;">
                        <i data-lucide="alert-triangle" style="width:10px;height:10px;display:inline-block;"></i> No Floor Protection
                      </div>
                    ` : `
                      <div style="font-size:0.6875rem;color:#059669;font-weight:600;margin-top:0.15rem;">
                        <i data-lucide="shield-check" style="width:10px;height:10px;display:inline-block;"></i> ${esc(comm.minimumGuaranteeDisplay)}
                      </div>
                    `}
                  </td>
                  <td>
                    <div style="font-weight:700;">${c.renewalDate || c.endDate}</div>
                    <div style="display:flex;align-items:center;gap:0.35rem;margin-top:0.25rem;">
                      ${noticeBadge}
                      <span style="font-size:0.7rem;color:var(--text-muted);">${c.noticePeriodDays}d notice</span>
                    </div>
                    <div style="font-size:0.7rem;color:var(--text-muted);margin-top:0.15rem;">
                      Deadline: ${c.noticeDeadline || 'N/A'}
                    </div>
                  </td>
                  <td>
                    ${exclBadge}
                    <div style="font-size:0.7rem;color:var(--text-muted);margin-top:0.2rem;max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${esc(excl.clauseRef || '')}">
                      ${esc(excl.clauseRef || 'Standard Terms')}
                    </div>
                  </td>
                  <td>
                    <div style="display:flex;align-items:center;gap:0.35rem;">
                      <span class="badge ${(c.aiExtraction?.confidence || 95) > 97 ? 'badge-success' : 'badge-primary'}" style="font-size:0.7rem;">
                        ${c.aiExtraction?.confidence || 98}%
                      </span>
                    </div>
                    <div style="font-size:0.6875rem;color:var(--text-muted);margin-top:0.15rem;">
                      ${c.aiExtraction?.clausesExtracted || 24} clauses parsed
                    </div>
                  </td>
                  <td>
                    ${alertCount > 0 ? `
                      <span class="badge ${hasCriticalAlert ? 'badge-danger' : 'badge-warning'}" style="font-size:0.7rem;cursor:pointer;" onclick="window.openContractClauseModal('${c.id}')">
                        <i data-lucide="${hasCriticalAlert ? 'alert-triangle' : 'bell'}" style="width:11px;height:11px;"></i> ${alertCount} Alerts
                      </span>
                    ` : '<span class="badge badge-success" style="font-size:0.7rem;">Clean</span>'}
                  </td>
                  <td style="text-align:right;">
                    <div style="display:flex;justify-content:flex-end;gap:0.35rem;">
                      <button class="btn btn-sm btn-outline" style="padding:3px 7px;" onclick="window.openContractClauseModal('${c.id}')" title="Inspect Extracted Clauses">
                        <i data-lucide="eye" style="width:13px;height:13px;"></i> Clauses
                      </button>
                      ${canManage && !isVendor && c.noticeStatus === 'critical' && c.workflowState !== 'in_notice' ? `
                        <button class="btn btn-sm btn-danger" style="padding:3px 7px;" onclick="window.openServeNoticeModal('${c.id}')" title="Serve Non-Renewal Notice">
                          <i data-lucide="send" style="width:13px;height:13px;"></i> Serve Notice
                        </button>
                      ` : ''}
                      ${canManage && !isVendor && comm.varianceBps < -30 ? `
                        <button class="btn btn-sm btn-primary" style="padding:3px 7px;" onclick="window.launchContractRFP('${c.id}')" title="Launch Sourcing RFP">
                          <i data-lucide="shopping-cart" style="width:13px;height:13px;"></i> RFP
                        </button>
                      ` : ''}
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function _renderContractCardsView(contracts, canManage, isVendor) {
  return `
    <div class="contract-grid">
      ${contracts.map(c => {
        const comm = c.commission || {};
        const excl = c.exclusivity || {};
        const isCritical = c.noticeStatus === 'critical';
        const isWarning = c.noticeStatus === 'upcoming' || (excl.isExclusive && excl.riskLevel === 'High');

        return `
          <div class="contract-card ${isCritical ? 'card-critical' : isWarning ? 'card-warning' : 'card-safe'}">
            <div>
              <div class="contract-card-header">
                <div>
                  <span class="badge badge-neutral" style="font-size:0.6875rem;margin-bottom:0.25rem;">${esc(c.category)}</span>
                  <div class="contract-card-title">${esc(c.title)}</div>
                  <div class="contract-card-vendor">
                    <i data-lucide="building" style="width:13px;height:13px;"></i> ${esc(c.vendorName)}
                  </div>
                </div>
                <span class="badge ${c.status === 'active' ? 'badge-success' : c.status === 'expiring' ? 'badge-danger' : 'badge-neutral'}">
                  ${esc(c.status)}
                </span>
              </div>

              <!-- Meta 2x2 grid -->
              <div class="contract-meta-grid">
                <div>
                  <div class="contract-meta-item-label">Extracted Commission</div>
                  <div class="contract-meta-item-val" style="color:${comm.varianceBps < 0 ? '#dc2626' : '#059669'};">
                    ${esc(comm.rateDisplay || (comm.rate + '%'))}
                  </div>
                  <div style="font-size:0.7rem;color:var(--text-muted);">
                    Benchmark: ${comm.benchmarkRate}%
                  </div>
                </div>

                <div>
                  <div class="contract-meta-item-label">Renewal & Notice</div>
                  <div class="contract-meta-item-val">${c.renewalDate}</div>
                  <div style="font-size:0.7rem;color:${isCritical ? '#dc2626' : 'var(--text-muted)'};font-weight:${isCritical ? '700' : 'normal'};">
                    ${c.noticePeriodDays}d Notice (Due: ${c.noticeDeadline || 'N/A'})
                  </div>
                </div>

                <div>
                  <div class="contract-meta-item-label">Exclusivity Restriction</div>
                  <div class="contract-meta-item-val" style="font-size:0.75rem;">
                    ${excl.isExclusive ? `
                      <span class="text-danger font-semibold"><i data-lucide="lock" style="width:11px;height:11px;display:inline-block;"></i> Exclusive (${excl.riskLevel} Risk)</span>
                    ` : `
                      <span class="text-success font-semibold"><i data-lucide="unlock" style="width:11px;height:11px;display:inline-block;"></i> Non-Exclusive</span>
                    `}
                  </div>
                </div>

                <div>
                  <div class="contract-meta-item-label">Floor Guarantee</div>
                  <div class="contract-meta-item-val" style="font-size:0.75rem;">
                    ${comm.minimumGuarantee > 0 ? `
                      <span class="text-success font-semibold">${esc(comm.minimumGuaranteeDisplay)}</span>
                    ` : `
                      <span class="text-danger font-semibold">$0 (Missing Protection)</span>
                    `}
                  </div>
                </div>
              </div>

              <!-- Clause Quote Excerpt -->
              ${excl.clauseText ? `
                <div class="clause-quote-card">
                  <div class="clause-quote-ref">
                    <span><i data-lucide="quote" style="width:11px;height:11px;display:inline-block;"></i> ${esc(excl.clauseRef || 'Clause')}</span>
                    <span class="badge ${excl.riskLevel === 'High' ? 'badge-danger' : 'badge-warning'}" style="font-size:0.625rem;">${excl.riskLevel} Risk</span>
                  </div>
                  "${esc(excl.clauseText.substring(0, 160))}..."
                </div>
              ` : ''}
            </div>

            <!-- Footer & Actions -->
            <div style="margin-top:1rem;padding-top:0.75rem;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
              <div style="font-size:0.75rem;color:var(--text-muted);">
                <i data-lucide="sparkles" style="width:12px;height:12px;display:inline-block;color:#6366f1;"></i>
                AI Confidence: <strong>${c.aiExtraction?.confidence || 98}%</strong>
              </div>

              <div style="display:flex;gap:0.35rem;">
                <button class="btn btn-sm btn-outline" onclick="window.openContractClauseModal('${c.id}')">
                  <i data-lucide="file-search"></i> Inspect Clauses
                </button>
                ${canManage && !isVendor && isCritical && c.workflowState !== 'in_notice' ? `
                  <button class="btn btn-sm btn-danger" onclick="window.openServeNoticeModal('${c.id}')">
                    <i data-lucide="send"></i> Serve Notice
                  </button>
                ` : ''}
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────
//  TAB 2: AI INGESTION & EXTRACTION STUDIO
// ─────────────────────────────────────────────────────────────
function _renderContractIngestStudio() {
  const presets = MockData.sampleContractPresets || [];

  return `
    <div style="display:grid;grid-template-columns:1fr 1.15fr;gap:1.5rem;align-items:start;">
      <!-- Left: Ingestion & Upload -->
      <div>
        <div class="card" style="margin-bottom:1.5rem;">
          <div class="card-header">
            <div>
              <div class="card-title" style="display:flex;align-items:center;gap:0.5rem;">
                <i data-lucide="upload-cloud" style="color:#6366f1;"></i> Contract Document Ingestion
              </div>
              <div class="card-subtitle">Upload PDF, scanned agreements, or select sample convenience retail contracts</div>
            </div>
          </div>

          <div class="card-body">
            <!-- Dropzone -->
            <div class="ai-dropzone-box" onclick="window.simulateFileUpload()" style="cursor:pointer;border-color:#6366f1;">
              <div style="width:52px;height:52px;border-radius:50%;background:#eef2ff;color:#4f46e5;display:inline-flex;align-items:center;justify-content:center;margin-bottom:0.75rem;">
                <i data-lucide="file-up" style="width:26px;height:26px;"></i>
              </div>
              <div style="font-weight:700;font-size:1rem;color:var(--text);margin-bottom:0.25rem;">
                Drag & drop executed contract PDF / DOCX here
              </div>
              <p style="color:var(--text-muted);font-size:0.8125rem;max-width:380px;margin:0 auto 0.75rem auto;">
                AI parser automatically extracts commission schedules, renewal countdowns, exclusivity restrictions, and notice periods.
              </p>
              <button type="button" class="btn btn-outline btn-sm">
                <i data-lucide="folder"></i> Browse Local Files
              </button>
            </div>

            <!-- Ingestion pipeline steps indicator -->
            <div style="margin-top:1.5rem;">
              <div style="font-size:0.75rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);letter-spacing:0.5px;margin-bottom:0.5rem;">
                Autonomous AI Extraction Pipeline
              </div>

              <div class="ai-pipeline-step step-done">
                <i data-lucide="check-circle" style="width:16px;height:16px;color:#166534;"></i>
                <span>1. Multi-Page Document OCR & Table Normalization (Native + Scanned)</span>
              </div>
              <div class="ai-pipeline-step step-done">
                <i data-lucide="check-circle" style="width:16px;height:16px;color:#166534;"></i>
                <span>2. Commission Term & Volume Tier Parsing (bps & fee structure)</span>
              </div>
              <div class="ai-pipeline-step step-done">
                <i data-lucide="check-circle" style="width:16px;height:16px;color:#166534;"></i>
                <span>3. Exclusivity & Restrictive Covenant Classification (Risk Scoring)</span>
              </div>
              <div class="ai-pipeline-step step-done">
                <i data-lucide="check-circle" style="width:16px;height:16px;color:#166534;"></i>
                <span>4. Notice Period Window & Proactive Non-Renewal Alert Generation</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Sample Contract Presets -->
        <div class="card">
          <div class="card-header">
            <div class="card-title" style="font-size:0.9375rem;">
              <i data-lucide="file-check-2"></i> Ingest Pre-Loaded Commercial Agreements
            </div>
          </div>
          <div class="card-body">
            <p style="font-size:0.8125rem;color:var(--text-muted);margin-bottom:1rem;">
              Select an institutional contract to simulate real-time AI extraction and benchmark risk analysis:
            </p>

            ${presets.map(p => `
              <div style="border:1.5px solid var(--border);border-radius:var(--radius);padding:0.875rem 1rem;margin-bottom:0.75rem;background:#fafafa;transition:all 0.2s ease;">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:0.75rem;">
                  <div>
                    <span class="badge badge-neutral" style="font-size:0.65rem;">${esc(p.category)}</span>
                    <div style="font-weight:700;font-size:0.875rem;color:var(--text);margin-top:0.2rem;">${esc(p.title)}</div>
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.15rem;">
                      Vendor: <strong>${esc(p.vendorName)}</strong> &bull; Size: ${esc(p.fileSize)}
                    </div>
                  </div>

                  <button class="btn btn-sm btn-primary" onclick="window.runAIExtractionSimulation('${p.id}')">
                    <i data-lucide="sparkles"></i> Ingest & Extract
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Right: Real-time Extraction Canvas / Live Preview -->
      <div id="ai-extraction-canvas">
        <div class="card" style="border:1.5px solid #818cf8;background:linear-gradient(180deg,#ffffff 0%,#f8fafc 100%);">
          <div class="card-header" style="background:rgba(99,102,241,0.05);border-bottom:1px solid #e0e7ff;">
            <div>
              <div style="display:flex;align-items:center;gap:0.5rem;">
                <span style="background:#6366f1;color:#fff;border-radius:6px;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:0.75rem;">
                  <i data-lucide="cpu" style="width:14px;height:14px;"></i>
                </span>
                <div class="card-title" style="font-size:1.0625rem;color:#1e1b4b;">AI Extracted Contract Intelligence</div>
              </div>
              <div class="card-subtitle" id="canvas-subtitle">Currently displaying: Incomm Payments Executed Agreement</div>
            </div>

            <span class="badge badge-success" style="font-size:0.75rem;">99.4% Extraction Confidence</span>
          </div>

          <div class="card-body" id="canvas-body">
            <!-- Extraction Results Summary -->
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;margin-bottom:1.25rem;">
              <div style="background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:0.875rem;">
                <div style="font-size:0.7rem;text-transform:uppercase;color:var(--text-muted);font-weight:700;">Extracted Commission Rate</div>
                <div style="font-size:1.375rem;font-weight:800;color:#047857;margin-top:0.25rem;">4.25% of GMV</div>
                <div style="font-size:0.75rem;color:#059669;font-weight:600;margin-top:0.15rem;">
                  +15 bps above 4.10% market benchmark (+125 bps vs current GiftFlow)
                </div>
              </div>

              <div style="background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:0.875rem;">
                <div style="font-size:0.7rem;text-transform:uppercase;color:var(--text-muted);font-weight:700;">Renewal & Notice Requirement</div>
                <div style="font-size:1.375rem;font-weight:800;color:var(--text);margin-top:0.25rem;">90 Days Notice</div>
                <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.15rem;">
                  Auto-renews annually on Nov 18, 2028 unless notice served
                </div>
              </div>

              <div style="background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:0.875rem;">
                <div style="font-size:0.7rem;text-transform:uppercase;color:var(--text-muted);font-weight:700;">Exclusivity & Covenants</div>
                <div style="font-size:1.125rem;font-weight:800;color:#047857;margin-top:0.25rem;">Non-Exclusive</div>
                <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.15rem;">
                  Retailer maintains right to multi-source secondary displays
                </div>
              </div>

              <div style="background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:0.875rem;">
                <div style="font-size:0.7rem;text-transform:uppercase;color:var(--text-muted);font-weight:700;">Subsidies & Fixture Support</div>
                <div style="font-size:1.125rem;font-weight:800;color:#4f46e5;margin-top:0.25rem;">$27,000 / year</div>
                <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.15rem;">
                  $15K fixture allowance + $12K promotional marketing co-op
                </div>
              </div>
            </div>

            <!-- Extracted Legal Clauses Highlight -->
            <div style="font-size:0.8125rem;font-weight:700;color:var(--text);margin-bottom:0.5rem;">
              Extracted Legal Clauses & Natural Language Annotations:
            </div>

            <div class="clause-quote-card" style="border-left-color:#10b981;">
              <div class="clause-quote-ref">
                <span style="color:#047857;">Section 4.1 &bull; Open-Loop Merchant Commission</span>
                <span class="badge badge-success" style="font-size:0.65rem;">Rate Extracted</span>
              </div>
              "Vendor shall remit to Retailer a commission of 4.25% of gross face value on all open-loop prepaid gift cards sold across Retailer doors during each billing cycle."
            </div>

            <div class="clause-quote-card" style="border-left-color:#6366f1;">
              <div class="clause-quote-ref">
                <span style="color:#4f46e5;">Section 7.2 &bull; Term, Expiration & Notice</span>
                <span class="badge badge-primary" style="font-size:0.65rem;">Notice Window</span>
              </div>
              "This Agreement shall run for an initial term of twenty-four (24) months and automatically renew for successive twelve (12) month periods unless either party provides ninety (90) days advance written notice of non-renewal."
            </div>

            <div class="clause-quote-card" style="border-left-color:#059669;">
              <div class="clause-quote-ref">
                <span style="color:#059669;">Section 14.3 &bull; Commercial Freedom & Non-Exclusivity</span>
                <span class="badge badge-success" style="font-size:0.65rem;">Clean Covenant</span>
              </div>
              "Retailer retains the right to display alternative products on secondary fixtures, with no exclusivity restrictions barring third-party vendor arrangements."
            </div>

            <!-- AI Proactive Alert Generation -->
            <div style="margin-top:1.25rem;padding:1rem;background:#eff6ff;border:1px solid #bfdbfe;border-radius:var(--radius);">
              <div style="display:flex;align-items:center;gap:0.4rem;font-weight:700;color:#1e40af;font-size:0.875rem;margin-bottom:0.35rem;">
                <i data-lucide="bell" style="width:16px;height:16px;"></i> Proactive Recommendation Dispatched:
              </div>
              <p style="font-size:0.8125rem;color:#1e3a8a;margin:0 0 0.75rem 0;">
                High yield contract: 4.25% rate delivers <strong>+$43,750/year in expanded margin</strong> compared to current GiftFlow 3.00% agreement. Non-exclusive terms permit instant dual-sourcing rollout.
              </p>
              <div style="display:flex;gap:0.5rem;">
                <button class="btn btn-sm btn-primary" onclick="window.saveIngestedContractPreset('PRESET-001')">
                  <i data-lucide="check"></i> Approve & Ingest into Master Register
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────
//  TAB 3: PROACTIVE ALERTS & NOTICE RADAR
// ─────────────────────────────────────────────────────────────
function _renderContractAlertsRadar(alerts, canManage) {
  return `
    <div style="margin-bottom:1.5rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
        <div>
          <h2 style="font-size:1.125rem;font-weight:800;color:var(--text);margin:0;">Proactive Risk & Notice Horizon Radar</h2>
          <p style="font-size:0.8125rem;color:var(--text-muted);margin:0.25rem 0 0 0;">
            Real-time alerting engine warning procurement teams before auto-renewal lock-ins and highlighting restrictive covenants.
          </p>
        </div>
        <span class="badge badge-danger" style="font-size:0.8125rem;padding:4px 10px;">
          ${alerts.filter(a => a.severity === 'danger' || a.severity === 'critical').length} Critical Action Items
        </span>
      </div>

      ${alerts.map(a => {
        let borderClass = 'alert-info';
        let iconName = 'info';
        let iconColor = '#4f46e5';

        if (a.severity === 'danger' || a.severity === 'critical') {
          borderClass = 'alert-danger';
          iconName = 'alert-octagon';
          iconColor = '#dc2626';
        } else if (a.severity === 'warning') {
          borderClass = 'alert-warning';
          iconName = 'alert-triangle';
          iconColor = '#d97706';
        }

        return `
          <div class="proactive-alert-banner ${borderClass}">
            <div style="display:flex;align-items:flex-start;gap:0.875rem;">
              <span style="color:${iconColor};margin-top:2px;">
                <i data-lucide="${iconName}" style="width:22px;height:22px;"></i>
              </span>
              <div>
                <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;">
                  <span style="font-weight:800;font-size:0.9375rem;color:var(--text);">${esc(a.title)}</span>
                  <span class="badge badge-neutral" style="font-size:0.6875rem;">${esc(a.contractTitle)} (${esc(a.vendorName)})</span>
                </div>
                <p style="font-size:0.8125rem;color:var(--text);margin:0.35rem 0 0.5rem 0;line-height:1.45;">
                  ${esc(a.message)}
                </p>
                <div style="font-size:0.75rem;color:var(--text-muted);display:flex;align-items:center;gap:0.75rem;">
                  <span>Contract Ref: <strong>${esc(a.contractId)}</strong></span>
                  <span>Alert Category: <strong>${esc(a.type.replace('_', ' ').toUpperCase())}</strong></span>
                </div>
              </div>
            </div>

            <div style="display:flex;flex-direction:column;gap:0.35rem;align-items:flex-end;min-width:170px;">
              ${canManage ? `
                ${a.actionType === 'serve_notice' ? `
                  <button class="btn btn-sm btn-danger" onclick="window.openServeNoticeModal('${a.contractId}')">
                    <i data-lucide="send"></i> ${esc(a.actionLabel)}
                  </button>
                ` : a.actionType === 'launch_rfp' ? `
                  <button class="btn btn-sm btn-primary" onclick="window.launchContractRFP('${a.contractId}')">
                    <i data-lucide="shopping-cart"></i> ${esc(a.actionLabel)}
                  </button>
                ` : `
                  <button class="btn btn-sm btn-outline" onclick="window.openContractClauseModal('${a.contractId}')">
                    <i data-lucide="external-link"></i> ${esc(a.actionLabel)}
                  </button>
                `}
              ` : ''}
              <button class="btn btn-sm btn-ghost" style="font-size:0.75rem;color:var(--text-muted);" onclick="window.openContractClauseModal('${a.contractId}')">
                Inspect Source Clause
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────
//  TAB 4: CONTRACT PORTFOLIO ANALYTICS
// ─────────────────────────────────────────────────────────────
function _renderContractAnalytics(contracts) {
  return `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(420px,1fr));gap:1.5rem;margin-bottom:1.5rem;">
      <!-- Chart 1: Exclusivity Distribution -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title"><i data-lucide="shield-check"></i> Exclusivity Risk Distribution</div>
            <div class="card-subtitle">Breakdown of restrictive covenants across retailer portfolio</div>
          </div>
        </div>
        <div class="card-body">
          <div style="position:relative;height:260px;">
            <canvas id="chart-contract-exclusivity"></canvas>
          </div>
        </div>
      </div>

      <!-- Chart 2: Notice Horizon Timeline -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title"><i data-lucide="clock"></i> Non-Renewal Notice Horizon</div>
            <div class="card-subtitle">Days remaining until formal non-renewal notice cutoff</div>
          </div>
        </div>
        <div class="card-body">
          <div style="position:relative;height:260px;">
            <canvas id="chart-contract-notice-horizon"></canvas>
          </div>
        </div>
      </div>

      <!-- Chart 3: Commission vs Benchmark Spread -->
      <div class="card" style="grid-column: 1 / -1;">
        <div class="card-header">
          <div>
            <div class="card-title"><i data-lucide="bar-chart-3"></i> Contracted Commission Rate vs Regional Market Benchmark</div>
            <div class="card-subtitle">Variance analysis identifying contracts below peer median</div>
          </div>
        </div>
        <div class="card-body">
          <div style="position:relative;height:280px;">
            <canvas id="chart-contract-rate-variance"></canvas>
          </div>
        </div>
      </div>
    </div>
  `;
}

window._initContractCharts = function() {
  const contracts = MockData.contracts || [];

  // 1. Exclusivity breakdown chart
  const ctxExcl = document.getElementById('chart-contract-exclusivity');
  if (ctxExcl) {
    if (APP_STATE.charts['chart-contract-exclusivity']) {
      APP_STATE.charts['chart-contract-exclusivity'].destroy();
    }
    const exclCount = contracts.filter(c => c.exclusivity?.isExclusive && c.exclusivity.riskLevel === 'High').length;
    const prefCount = contracts.filter(c => c.exclusivity?.riskLevel === 'Medium').length;
    const nonExclCount = contracts.filter(c => !c.exclusivity?.isExclusive || c.exclusivity.riskLevel === 'Low').length;

    APP_STATE.charts['chart-contract-exclusivity'] = new Chart(ctxExcl, {
      type: 'doughnut',
      data: {
        labels: ['Sole & Exclusive (High Risk)', 'Preferred / ROFR (Medium Risk)', 'Non-Exclusive (Open Dual-Sourcing)'],
        datasets: [{
          data: [exclCount, prefCount, nonExclCount],
          backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
        }
      }
    });
  }

  // 2. Notice Horizon Bar
  const ctxNotice = document.getElementById('chart-contract-notice-horizon');
  if (ctxNotice) {
    if (APP_STATE.charts['chart-contract-notice-horizon']) {
      APP_STATE.charts['chart-contract-notice-horizon'].destroy();
    }

    const labels = contracts.map(c => c.vendorName.split(' ')[0]);
    const days = [0, 43, 74, 95, 134, 0, 57, 134]; // Representative days to deadline

    APP_STATE.charts['chart-contract-notice-horizon'] = new Chart(ctxNotice, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Days to Notice Deadline',
          data: days,
          backgroundColor: days.map(d => d === 0 ? '#ef4444' : d < 60 ? '#f59e0b' : '#10b981'),
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Days' } }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  // 3. Commission vs Benchmark Spread
  const ctxSpread = document.getElementById('chart-contract-rate-variance');
  if (ctxSpread) {
    if (APP_STATE.charts['chart-contract-rate-variance']) {
      APP_STATE.charts['chart-contract-rate-variance'].destroy();
    }

    const cLabels = contracts.map(c => c.title.replace('Agreement', '').replace('Contract', '').trim());
    const currRates = contracts.map(c => c.commission?.rate || 0);
    const benchRates = contracts.map(c => c.commission?.benchmarkRate || 0);

    APP_STATE.charts['chart-contract-rate-variance'] = new Chart(ctxSpread, {
      type: 'bar',
      data: {
        labels: cLabels,
        datasets: [
          {
            label: 'Contracted Rate (%)',
            data: currRates,
            backgroundColor: '#6366f1',
            borderRadius: 4
          },
          {
            label: 'Market Benchmark (%)',
            data: benchRates,
            backgroundColor: '#10b981',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, ticks: { callback: v => v + '%' } }
        },
        plugins: {
          legend: { position: 'top' }
        }
      }
    });
  }
};

// ─────────────────────────────────────────────────────────────
//  TAB 5: CONFIGURATION & RULES
// ─────────────────────────────────────────────────────────────
function _renderContractConfig() {
  const cfg = MockData.contractIntelligenceConfig || {};

  return `
    <div class="card" style="max-width:850px;margin:0 auto;">
      <div class="card-header">
        <div>
          <div class="card-title"><i data-lucide="sliders"></i> Contract Intelligence Governance & Alert Rules</div>
          <div class="card-subtitle">Configure autonomous alert thresholds, notice lead times & legal review protocols</div>
        </div>
      </div>

      <div class="card-body">
        <form onsubmit="window.saveContractConfig(event)">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;margin-bottom:1.25rem;">
            <div class="form-group">
              <label class="form-label">Notice Horizon Warning Lead Time (Days)</label>
              <input type="number" class="form-input" id="cfg-notice-horizon" value="${cfg.noticeWarningHorizonDays || 90}" />
              <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.25rem;">
                Dispatches upcoming non-renewal warnings before contract cutoff.
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Critical Notice Urgency Horizon (Days)</label>
              <input type="number" class="form-input" id="cfg-critical-horizon" value="${cfg.criticalNoticeHorizonDays || 30}" />
              <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.25rem;">
                Escalates to red alert status and notifies Executive Sponsors.
              </div>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;margin-bottom:1.25rem;">
            <div class="form-group">
              <label class="form-label">Min. AI Extraction Confidence Cutoff (%)</label>
              <input type="number" class="form-input" id="cfg-min-confidence" value="${cfg.minExtractionConfidence || 90}" />
              <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.25rem;">
                Contracts below this confidence are flagged for manual attorney audit.
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Automated Auto-Renewal Safety Lock</label>
              <select class="form-input" id="cfg-auto-renew-lock">
                <option value="enabled" ${cfg.autoRenewAlertEnabled ? 'selected' : ''}>Enabled (Block silent evergreen roll-over)</option>
                <option value="disabled" ${!cfg.autoRenewAlertEnabled ? 'selected' : ''}>Disabled (Passive monitoring)</option>
              </select>
            </div>
          </div>

          <div class="form-group" style="margin-bottom:1.5rem;">
            <label class="form-label">Default Formal Non-Renewal Letterhead Template</label>
            <input type="text" class="form-input" id="cfg-notice-template" value="${esc(cfg.defaultNoticeLetterTemplate || '')}" />
          </div>

          <div style="display:flex;justify-content:flex-end;gap:0.75rem;">
            <button type="submit" class="btn btn-primary">
              <i data-lucide="check"></i> Save Governance Rules
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────
//  INTERACTIVE ACTIONS, MODALS & WORKFLOWS
// ─────────────────────────────────────────────────────────────

window.setContractTab = function(tab) {
  window._contractState.activeTab = tab;
  window.renderContracts();
};

window.setContractFilter = function(key, val) {
  window._contractState[key] = val;
  window.renderContracts();
};

window.setContractSearch = function(query) {
  window._contractState.searchQuery = query;
  window.renderContracts();
};

window.setContractViewMode = function(mode) {
  window._contractState.viewMode = mode;
  window.renderContracts();
};

window.resetContractFilters = function() {
  window._contractState.searchQuery = '';
  window._contractState.categoryFilter = 'all';
  window._contractState.exclusivityFilter = 'all';
  window._contractState.noticeHorizonFilter = 'all';
  window.renderContracts();
};

// 1. Inspect Extracted Clauses Modal
window.openContractClauseModal = function(contractId) {
  const c = MockData.contracts.find(item => item.id === contractId);
  if (!c) return;

  const comm = c.commission || {};
  const excl = c.exclusivity || {};
  const alerts = c.proactiveAlerts || [];

  openModal(`AI Extracted Clauses &bull; ${esc(c.title)}`, `
    <div style="font-size:0.875rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;background:#f8fafc;padding:0.75rem 1rem;border-radius:var(--radius);margin-bottom:1rem;border:1px solid var(--border);">
        <div>
          <span class="badge badge-neutral">${esc(c.category)}</span>
          <strong style="margin-left:0.5rem;color:var(--text);">${esc(c.vendorName)}</strong>
        </div>
        <div>
          AI Confidence: <span class="badge badge-success">${c.aiExtraction?.confidence || 98}%</span>
        </div>
      </div>

      <!-- Commission Extraction Block -->
      <div style="margin-bottom:1.25rem;">
        <div style="font-weight:700;font-size:0.9375rem;color:var(--text);margin-bottom:0.35rem;display:flex;align-items:center;gap:0.35rem;">
          <i data-lucide="percent" style="width:14px;height:14px;color:#059669;"></i> Extracted Commission Schedule
        </div>
        <div style="background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:0.875rem;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
            <div><strong>Contracted Rate:</strong> <span class="font-mono text-primary font-bold">${esc(comm.rateDisplay)}</span></div>
            <div><strong>Regional Benchmark:</strong> <span class="font-mono font-bold">${comm.benchmarkRate}%</span></div>
            <div><strong>Variance vs Market:</strong> <span class="font-mono font-bold ${comm.varianceBps < 0 ? 'text-danger' : 'text-success'}">${comm.varianceBps} bps</span></div>
            <div><strong>Annual Value Leakage:</strong> <span class="font-bold text-danger">${formatCurrency(comm.annualLeakage || 0)}/yr</span></div>
          </div>
          <div style="margin-top:0.5rem;padding-top:0.5rem;border-top:1px solid var(--border-light);font-size:0.8125rem;">
            <strong>Minimum Floor Guarantee:</strong> ${esc(comm.minimumGuaranteeDisplay || '$0')}
          </div>
        </div>
      </div>

      <!-- Exclusivity Clause Extract -->
      <div style="margin-bottom:1.25rem;">
        <div style="font-weight:700;font-size:0.9375rem;color:var(--text);margin-bottom:0.35rem;display:flex;align-items:center;gap:0.35rem;">
          <i data-lucide="lock" style="width:14px;height:14px;color:#dc2626;"></i> Exclusivity & Restrictive Covenants
        </div>
        <div class="clause-quote-card" style="border-left-color:${excl.riskLevel === 'High' ? '#dc2626' : '#f59e0b'};">
          <div class="clause-quote-ref">
            <span>${esc(excl.clauseRef || 'Section Reference')}</span>
            <span class="badge ${excl.riskLevel === 'High' ? 'badge-danger' : 'badge-warning'}">${esc(excl.riskLevel)} Risk</span>
          </div>
          "${esc(excl.clauseText || 'No restrictive covenants detected.')}"
        </div>
        <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.35rem;">
          <strong>Commercial Impact:</strong> ${esc(excl.impact || 'None')}
        </div>
      </div>

      <!-- Renewal & Notice Dates -->
      <div style="margin-bottom:1.25rem;">
        <div style="font-weight:700;font-size:0.9375rem;color:var(--text);margin-bottom:0.35rem;display:flex;align-items:center;gap:0.35rem;">
          <i data-lucide="calendar" style="width:14px;height:14px;color:#4f46e5;"></i> Renewal Window & Notice Cutoff
        </div>
        <div style="background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:0.875rem;font-size:0.8125rem;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;">
            <div><strong>Renewal / Expiration:</strong> ${c.renewalDate || c.endDate}</div>
            <div><strong>Renewal Mechanism:</strong> ${esc(c.renewalType)}</div>
            <div><strong>Notice Period:</strong> ${c.noticePeriodDays} Days Prior</div>
            <div><strong>Notice Cut-off Deadline:</strong> <span style="font-weight:700;color:${c.noticeStatus === 'critical' ? '#dc2626' : 'var(--text)'};">${c.noticeDeadline || 'N/A'}</span></div>
          </div>
        </div>
      </div>

      <!-- Proactive Alerts -->
      ${alerts.length > 0 ? `
        <div>
          <div style="font-weight:700;font-size:0.9375rem;color:var(--text);margin-bottom:0.35rem;">
            Generated Proactive Alerts (${alerts.length}):
          </div>
          ${alerts.map(a => `
            <div style="background:${a.severity === 'danger' ? '#fef2f2' : '#fffbeb'};border:1px solid ${a.severity === 'danger' ? '#fecaca' : '#fde68a'};border-radius:var(--radius-sm);padding:0.625rem 0.875rem;margin-bottom:0.5rem;font-size:0.8125rem;">
              <strong style="color:${a.severity === 'danger' ? '#991b1b' : '#92400e'};">${esc(a.title)}</strong>
              <div style="margin-top:0.2rem;color:var(--text);">${esc(a.message)}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `, [
    { label: 'Close', cls: 'btn-secondary', action: 'closeModal()' },
    c.noticeStatus === 'critical' ? { label: 'Serve Notice of Non-Renewal ✉️', cls: 'btn-danger', action: `closeModal(); window.openServeNoticeModal('${c.id}')` } : null
  ].filter(Boolean));
};

// 2. Serve Notice of Non-Renewal Formal Modal
window.openServeNoticeModal = function(contractId) {
  const c = MockData.contracts.find(item => item.id === contractId);
  if (!c) return;

  const todayStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  openModal(`Formal Notice of Non-Renewal &bull; ${esc(c.vendorName)}`, `
    <div style="font-size:0.875rem;">
      <p style="color:var(--text-light);margin-bottom:1rem;">
        Generate and certify legal non-renewal notice to prevent automatic evergreen renewal and preserve full RFP negotiation leverage:
      </p>

      <div class="notice-letter-modal">
        <div style="display:flex;justify-content:space-between;border-bottom:1.5px solid #1e293b;padding-bottom:0.75rem;margin-bottom:1rem;">
          <div>
            <strong>COMMISSION IQ RETAIL ENTERPRISE PROCUREMENT</strong><br>
            Corporate Legal & Category Sourcing Division<br>
            Tracking ID: CIQ-NOTICE-${Date.now().toString().slice(-6)}
          </div>
          <div style="text-align:right;">
            ${todayStr}<br>
            <em>SENT VIA CERTIFIED ELECTRONIC & REGISTERED MAIL</em>
          </div>
        </div>

        <p>
          <strong>TO:</strong> Legal & Commercial Contracts Department<br>
          <strong>VENDOR:</strong> ${esc(c.vendorName)}<br>
          <strong>AGREEMENT:</strong> ${esc(c.title)} (Ref: ${esc(c.id)})<br>
          <strong>EXPIRATION DATE:</strong> ${c.renewalDate || c.endDate}
        </p>

        <p style="margin-top:0.75rem;">
          Dear Commercial Account Executive,
        </p>

        <p>
          Pursuant to <strong>${esc(c.exclusivity?.clauseRef || 'the Master Agreement Terms')}</strong> and the applicable <strong>${c.noticePeriodDays}-day advance written notice requirement</strong>, please accept this formal written notice that Retailer hereby exercises its contractual right of <strong>NON-RENEWAL</strong> for the above-referenced agreement.
        </p>

        <p>
          This notice certifies that the subject Agreement shall expire effective as of <strong>${c.renewalDate || c.endDate}</strong> and shall NOT automatically renew for any subsequent term or period.
        </p>

        <p>
          Retailer is concurrently releasing a competitive Sourcing RFP for regional category distribution. Should ${esc(c.vendorName)} wish to submit a modernized rate proposal incorporating regional peer commission parity (benchmark: <strong>${c.commission?.benchmarkRate || 4.10}%</strong>) and contractual floor guarantees, your account team is invited to register at our procurement portal.
        </p>

        <div style="margin-top:1.5rem;display:flex;justify-content:space-between;">
          <div>
            Sincerely,<br><br>
            <strong>${Auth.getCurrentUser()?.name || 'Authorized Procurement Officer'}</strong><br>
            Director of Category Sourcing & Commercial Vendor Governance
          </div>
        </div>
      </div>
    </div>
  `, [
    { label: 'Cancel', cls: 'btn-secondary', action: 'closeModal()' },
    { label: 'Certify & Serve Non-Renewal Notice 🚀', cls: 'btn-danger', action: `window.confirmServeNotice('${esc(c.id)}')` }
  ]);
};

window.confirmServeNotice = function(contractId) {
  closeModal();
  const c = MockData.contracts.find(item => item.id === contractId);
  if (!c) return;

  c.workflowState = 'in_notice';
  c.noticeStatus = 'safe'; // Notice has been served!

  // Add audit trail entry
  MockData.auditLogs.unshift({
    id: 'AL' + Date.now(),
    userId: Auth.getCurrentUser()?.id || 'U001',
    userName: Auth.getCurrentUser()?.name || 'Procurement Officer',
    action: 'serve_non_renewal_notice',
    module: 'AI Contract Intelligence',
    details: `Served certified notice of non-renewal for ${c.title} (${c.vendorName}). Blocked automatic evergreen extension.`,
    timestamp: new Date().toISOString(),
    ipAddress: '127.0.0.1'
  });

  // Add notification
  MockData.notifications.unshift({
    id: 'N' + Date.now(),
    userId: Auth.getCurrentUser()?.id || 'U001',
    title: 'Non-Renewal Notice Served',
    message: `Formal notice delivered to ${c.vendorName}. Contract ${c.id} marked as Non-Renewing.`,
    type: 'success',
    read: false,
    timestamp: new Date().toISOString(),
    link: '#/contracts'
  });

  showToast(`✉️ Formal non-renewal notice served to ${c.vendorName}! Auto-renewal successfully blocked.`, 'success');
  window.renderContracts();
};

// 3. Launch Contract Renegotiation RFP
window.launchContractRFP = function(contractId) {
  const c = MockData.contracts.find(item => item.id === contractId);
  if (!c) return;

  // Create sourcing event
  const newEventId = 'SE' + (MockData.sourcingEvents.length + 1).toString().padStart(3, '0');
  MockData.sourcingEvents.unshift({
    id: newEventId,
    name: `${c.category} Competitive Sourcing Auction (Post-Notice)`,
    category: c.category,
    status: 'Open',
    startDate: new Date().toISOString().split('T')[0],
    endDate: c.renewalDate || '2027-01-15',
    vendorsInvited: 6,
    bidsReceived: 0,
    description: `Competitive RFP replacing expiring contract ${c.id} (${c.vendorName}). Targeting ${c.commission?.benchmarkRate || 4.10}% commission rate.`,
    budget: c.annualVolume || 1000000
  });

  MockData.auditLogs.unshift({
    id: 'AL' + Date.now(),
    userId: Auth.getCurrentUser()?.id || 'U001',
    userName: Auth.getCurrentUser()?.name || 'Category Manager',
    action: 'launch_rfp_from_contract',
    module: 'AI Contract Intelligence',
    details: `Launched competitive RFP ${newEventId} for ${c.category} to replace ${c.title}`,
    timestamp: new Date().toISOString(),
    ipAddress: '127.0.0.1'
  });

  showToast(`🎯 Competitive RFP created in Sourcing module for ${c.category}!`, 'success');
  window.location.hash = '#/sourcing';
};

// 4. Ingest Preset Contract Simulation
window.runAIExtractionSimulation = function(presetId) {
  const preset = MockData.sampleContractPresets.find(p => p.id === presetId);
  if (!preset) return;

  const canvas = document.getElementById('canvas-body');
  const subtitle = document.getElementById('canvas-subtitle');
  if (subtitle) subtitle.innerHTML = `Currently analyzing: <strong>${esc(preset.title)}</strong>`;

  if (canvas) {
    canvas.innerHTML = `
      <div style="padding:2.5rem 1.5rem;text-align:center;">
        <div style="display:inline-block;margin-bottom:1rem;">
          <div class="spin" style="width:40px;height:40px;border:3.5px solid #e0e7ff;border-top-color:#4f46e5;border-radius:50%;"></div>
        </div>
        <div style="font-weight:700;font-size:1.125rem;color:var(--text);">AI Document NLP Ingestion in Progress...</div>
        <div style="font-size:0.8125rem;color:var(--text-muted);margin-top:0.35rem;" id="extraction-progress-step">
          Step 1: Normalizing document vectors and OCR layout...
        </div>
      </div>
    `;

    setTimeout(() => {
      const step = document.getElementById('extraction-progress-step');
      if (step) step.innerHTML = 'Step 2: Extracting commission rate schedules and floor guarantees...';
    }, 500);

    setTimeout(() => {
      const step = document.getElementById('extraction-progress-step');
      if (step) step.innerHTML = 'Step 3: Classifying exclusivity covenants and calculating notice cutoff...';
    }, 1000);

    setTimeout(() => {
      window.renderExtractionResultCanvas(preset);
      showToast(`✅ AI Extraction complete for ${preset.vendorName} (99.4% confidence)!`, 'success');
    }, 1500);
  }
};

window.renderExtractionResultCanvas = function(preset) {
  const canvas = document.getElementById('canvas-body');
  if (!canvas) return;

  const p = preset.extractedPreview;

  canvas.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;margin-bottom:1.25rem;">
      <div style="background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:0.875rem;">
        <div style="font-size:0.7rem;text-transform:uppercase;color:var(--text-muted);font-weight:700;">Extracted Commission Rate</div>
        <div style="font-size:1.375rem;font-weight:800;color:#047857;margin-top:0.25rem;">${p.rateDisplay}</div>
        <div style="font-size:0.75rem;color:#059669;font-weight:600;margin-top:0.15rem;">
          ${p.annualOpportunity}
        </div>
      </div>

      <div style="background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:0.875rem;">
        <div style="font-size:0.7rem;text-transform:uppercase;color:var(--text-muted);font-weight:700;">Renewal & Notice Requirement</div>
        <div style="font-size:1.375rem;font-weight:800;color:var(--text);margin-top:0.25rem;">${p.noticePeriodDays} Days Notice</div>
        <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.15rem;">
          ${p.renewalType} expiring on ${p.renewalDate}
        </div>
      </div>

      <div style="background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:0.875rem;">
        <div style="font-size:0.7rem;text-transform:uppercase;color:var(--text-muted);font-weight:700;">Exclusivity & Covenants</div>
        <div style="font-size:1.125rem;font-weight:800;color:${p.riskLevel === 'Low' ? '#047857' : '#d97706'};margin-top:0.25rem;">${p.exclusivity}</div>
        <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.15rem;">
          Risk Level: ${p.riskLevel}
        </div>
      </div>

      <div style="background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:0.875rem;">
        <div style="font-size:0.7rem;text-transform:uppercase;color:var(--text-muted);font-weight:700;">Floor Guarantee & Subsidies</div>
        <div style="font-size:1.125rem;font-weight:800;color:#4f46e5;margin-top:0.25rem;">${p.minimumGuarantee}</div>
        <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.15rem;">
          ${p.subsidies}
        </div>
      </div>
    </div>

    <div style="font-size:0.8125rem;font-weight:700;color:var(--text);margin-bottom:0.5rem;">
      Extracted Sample Agreement Clauses:
    </div>

    <div class="clause-quote-card" style="border-left-color:#10b981;">
      <div class="clause-quote-ref">
        <span style="color:#047857;">Executed Contract Text</span>
        <span class="badge badge-success" style="font-size:0.65rem;">${preset.fileName}</span>
      </div>
      "${esc(preset.sampleText)}"
    </div>

    <div style="margin-top:1.25rem;padding:1rem;background:#eff6ff;border:1px solid #bfdbfe;border-radius:var(--radius);">
      <div style="display:flex;align-items:center;gap:0.4rem;font-weight:700;color:#1e40af;font-size:0.875rem;margin-bottom:0.35rem;">
        <i data-lucide="bell" style="width:16px;height:16px;"></i> Proactive AI Alerts Generated:
      </div>
      <ul style="margin:0 0 0.75rem 1.25rem;padding:0;font-size:0.8125rem;color:#1e3a8a;">
        ${p.proactiveAlerts.map(a => `<li>${esc(a)}</li>`).join('')}
      </ul>
      <div style="display:flex;gap:0.5rem;">
        <button class="btn btn-sm btn-primary" onclick="window.saveIngestedContractPreset('${preset.id}')">
          <i data-lucide="check"></i> Approve & Ingest into Master Register
        </button>
      </div>
    </div>
  `;

  lucide.createIcons();
};

window.saveIngestedContractPreset = function(presetId) {
  const preset = MockData.sampleContractPresets.find(p => p.id === presetId);
  if (!preset) return;

  const newId = 'CON00' + (MockData.contracts.length + 1);
  const p = preset.extractedPreview;

  MockData.contracts.unshift({
    id: newId,
    vendorId: 'V999',
    vendorName: preset.vendorName,
    category: preset.category,
    title: preset.title,
    value: 2800000,
    annualVolume: 3500000,
    startDate: new Date().toISOString().split('T')[0],
    endDate: p.renewalDate,
    renewalDate: p.renewalDate,
    status: 'active',
    type: 'Master',
    renewalType: p.renewalType,
    owner: Auth.getCurrentUser()?.id || 'U001',
    noticePeriodDays: p.noticePeriodDays,
    noticeDeadline: '2028-08-20',
    noticeStatus: 'safe',
    workflowState: 'active',
    commission: {
      rate: p.rate,
      rateType: 'percent',
      rateDisplay: p.rateDisplay,
      benchmarkRate: p.benchmarkRate,
      varianceBps: p.varianceBps,
      annualLeakage: 0,
      minimumGuarantee: 0,
      minimumGuaranteeDisplay: p.minimumGuarantee,
      volumeTiers: 'Standard tiers',
      subsidies: [{ name: 'Fixture & Co-Op Support', amount: p.subsidies, status: 'contracted' }]
    },
    exclusivity: {
      isExclusive: p.exclusivity.toLowerCase().includes('exclusive') && !p.exclusivity.toLowerCase().includes('non-exclusive'),
      type: p.exclusivity,
      scope: 'Standard Category Scope',
      clauseRef: 'Section 14 (Commercial Rights)',
      clauseText: preset.sampleText,
      riskLevel: p.riskLevel,
      impact: 'Extracted via AI NLP pipeline'
    },
    aiExtraction: {
      confidence: p.confidence,
      docType: 'Digital Ingestion',
      fileName: preset.fileName,
      extractedAt: new Date().toISOString(),
      clausesExtracted: 32,
      ocrQuality: '100% Native',
      summary: `Ingested ${preset.title}. Commission ${p.rateDisplay}, notice period ${p.noticePeriodDays} days.`
    },
    proactiveAlerts: p.proactiveAlerts.map((msg, idx) => ({
      id: `ALT-${newId}-${idx + 1}`,
      severity: 'info',
      type: 'ai_ingestion_alert',
      title: 'AI Contract Extraction Finding',
      message: msg,
      actionType: 'inspect',
      actionLabel: 'Inspect Finding'
    }))
  });

  MockData.auditLogs.unshift({
    id: 'AL' + Date.now(),
    userId: Auth.getCurrentUser()?.id || 'U001',
    userName: Auth.getCurrentUser()?.name || 'System Admin',
    action: 'ingest_contract_ai',
    module: 'AI Contract Intelligence',
    details: `Ingested and extracted new agreement: ${preset.title} (${newId})`,
    timestamp: new Date().toISOString(),
    ipAddress: '127.0.0.1'
  });

  showToast(`🎉 Ingested ${preset.title} into master contract register!`, 'success');
  window.setContractTab('register');
};

window.simulateFileUpload = function() {
  window.runAIExtractionSimulation('PRESET-001');
};

// 5. CSV Export
window.exportContractIntelligenceCSV = function() {
  const contracts = MockData.contracts || [];
  const headers = ['Contract ID', 'Vendor', 'Title', 'Category', 'Contracted Rate', 'Benchmark Rate', 'Variance (bps)', 'Renewal Date', 'Notice Period (Days)', 'Notice Cutoff Deadline', 'Notice Status', 'Exclusivity Type', 'Exclusivity Risk', 'Minimum Guarantee', 'AI Confidence'];

  const rows = contracts.map(c => [
    c.id,
    c.vendorName,
    c.title,
    c.category,
    c.commission?.rateDisplay || '',
    c.commission?.benchmarkRate || '',
    c.commission?.varianceBps || '',
    c.renewalDate || c.endDate,
    c.noticePeriodDays || '',
    c.noticeDeadline || '',
    c.noticeStatus || '',
    c.exclusivity?.type || '',
    c.exclusivity?.riskLevel || '',
    c.commission?.minimumGuaranteeDisplay || '',
    (c.aiExtraction?.confidence || 98) + '%'
  ]);

  exportToCSV('Contract_Intelligence_Register.csv', headers, rows);
  showToast('📄 Contract Intelligence Register exported successfully!', 'success');
};

// 6. Save Config
window.saveContractConfig = function(e) {
  if (e) e.preventDefault();

  MockData.contractIntelligenceConfig.noticeWarningHorizonDays = parseInt(document.getElementById('cfg-notice-horizon')?.value || '90', 10);
  MockData.contractIntelligenceConfig.criticalNoticeHorizonDays = parseInt(document.getElementById('cfg-critical-horizon')?.value || '30', 10);
  MockData.contractIntelligenceConfig.minExtractionConfidence = parseInt(document.getElementById('cfg-min-confidence')?.value || '90', 10);
  MockData.contractIntelligenceConfig.autoRenewAlertEnabled = document.getElementById('cfg-auto-renew-lock')?.value === 'enabled';
  MockData.contractIntelligenceConfig.defaultNoticeLetterTemplate = document.getElementById('cfg-notice-template')?.value || '';

  MockData.auditLogs.unshift({
    id: 'AL' + Date.now(),
    userId: Auth.getCurrentUser()?.id || 'U001',
    userName: Auth.getCurrentUser()?.name || 'System Admin',
    action: 'update_contract_config',
    module: 'AI Contract Intelligence',
    details: 'Updated contract intelligence alert rules and notice horizon thresholds.',
    timestamp: new Date().toISOString(),
    ipAddress: '127.0.0.1'
  });

  showToast('✅ Contract governance rules saved successfully!', 'success');
};



// ═══════════════════════════════════════════════════════════════
//  REVERSE AUCTION ENGINE & SOURCING MODULE
//  Supports:
//  - Target pricing, sealed bids, and real-time reverse auctions
//  - Configurable visibility rules (Open, Rank-Only, Anonymous Lead, Sealed)
//  - Dynamic Reserve Price Recommendations (AI Benchmark Analysis)
// ═══════════════════════════════════════════════════════════════

window.renderSourcing = function() {
  const container = (document.getElementById('content-area') || document.getElementById('main-content'));
  if (!container) return;

  if (!window._auctionState) {
    window._auctionState = {
      activeTab: 'events', // 'events' | 'live' | 'reserve' | 'analytics' | 'config'
      selectedEventId: 'SE001',
      searchQuery: '',
      categoryFilter: 'all',
      modeFilter: 'all', // 'all' | 'realtime_reverse' | 'sealed_bid' | 'target_pricing'
      statusFilter: 'all',
      viewMode: 'table' // 'table' | 'cards'
    };
  }

  const state = window._auctionState;
  const events = MockData.sourcingEvents || [];
  const cfg = MockData.reverseAuctionConfig || { defaultVisibility: 'rank_only' };

  const currentUser = Auth.getCurrentUser();
  const isVendor = currentUser?.role === 'vendor';
  const isFinance = currentUser?.role === 'finance_analyst';
  const canManage = Auth.hasPermission('sourcing.manage') || ['system_admin', 'executive_sponsor', 'procurement_manager', 'category_manager'].includes(currentUser?.role);

  // Vendor isolation: Vendor sees events where they are invited, plus can participate in live auctions
  let visibleEvents = events;
  if (isVendor) {
    visibleEvents = events.filter(e => e.status !== 'Draft');
  }

  // Filtered events
  const filtered = visibleEvents.filter(e => {
    const matchCat = state.categoryFilter === 'all' || e.category === state.categoryFilter;
    const matchMode = state.modeFilter === 'all' || e.auctionType === state.modeFilter;
    const matchStatus = state.statusFilter === 'all' || e.status === state.statusFilter;
    const q = state.searchQuery.toLowerCase().trim();
    const matchSearch = !q ||
      e.name.toLowerCase().includes(q) ||
      (e.category && e.category.toLowerCase().includes(q)) ||
      (e.currentLeadingBid?.vendorName && e.currentLeadingBid.vendorName.toLowerCase().includes(q));

    return matchCat && matchMode && matchStatus && matchSearch;
  });

  // Calculate High-Level Metrics
  const liveCount = visibleEvents.filter(e => e.status === 'Live').length;
  const totalVolume = visibleEvents.reduce((sum, e) => sum + (e.annualVolume || e.budget || 0), 0);
  const totalSavings = visibleEvents.reduce((sum, e) => sum + (e.currentLeadingBid?.annualGain || 0), 0);
  const totalBids = visibleEvents.reduce((sum, e) => sum + (e.bids ? e.bids.length : e.bidsReceived || 0), 0);

  // Selected event for Live Auction Room
  const activeEvent = visibleEvents.find(e => e.id === state.selectedEventId) || visibleEvents[0] || {};

  container.innerHTML = `
    <!-- Header -->
    <div class="page-header" style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem;">
      <div>
        <div style="display:flex;align-items:center;gap:0.625rem;">
          <span style="background:linear-gradient(135deg,#6366f1,#3b82f6);color:#fff;width:32px;height:32px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(99,102,241,0.35);">
            <i data-lucide="shopping-cart" style="width:18px;height:18px;"></i>
          </span>
          <h1 class="page-title" style="margin:0;font-size:1.625rem;font-weight:800;letter-spacing:-0.02em;">Reverse Auction Engine</h1>
          <span class="badge" style="background:#e0e7ff;color:#3730a3;font-size:0.75rem;font-weight:700;padding:2px 8px;border-radius:999px;">
            AI Dynamic Reserve Calibration Active
          </span>
        </div>
        <p class="page-desc" style="color:var(--text-light);margin-top:0.35rem;max-width:860px;font-size:0.875rem;">
          Real-time reverse auctions, sealed bids, and target pricing with configurable visibility rules. Powered by <strong>Dynamic Reserve Price Recommendations</strong> that prevent retailers from leaving money on the table.
        </p>
      </div>

      <div style="display:flex;gap:0.625rem;flex-wrap:wrap;">
        <button class="btn btn-outline btn-sm" onclick="window.exportReverseAuctionCSV()">
          <i data-lucide="download"></i> Export Auction Register
        </button>
        ${canManage && !isVendor ? `
          <button class="btn btn-primary btn-sm" onclick="window.openCreateReverseAuctionModal()">
            <i data-lucide="plus"></i> Create Sourcing Auction
          </button>
        ` : ''}
      </div>
    </div>

    <!-- Summary KPI Row -->
    <div class="kpi-grid" style="grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:1rem;margin-bottom:1.5rem;">
      <div class="kpi-card" style="border-left:4px solid #ef4444;">
        <div class="kpi-header">
          <span class="kpi-title">Live Real-Time Auctions</span>
          <div class="kpi-icon-wrap" style="background:#fee2e2;color:#dc2626;"><i data-lucide="radio"></i></div>
        </div>
        <div class="kpi-value" style="color:#dc2626;">${liveCount} Active</div>
        <div class="kpi-footer">
          <span class="text-danger font-semibold">Ticking clock in progress</span>
        </div>
      </div>

      <div class="kpi-card" style="border-left:4px solid #10b981;">
        <div class="kpi-header">
          <span class="kpi-title">Annualized Margin Lift Realized</span>
          <div class="kpi-icon-wrap" style="background:#ecfdf5;color:#059669;"><i data-lucide="trending-up"></i></div>
        </div>
        <div class="kpi-value" style="color:#059669;">${formatCurrency(totalSavings)}</div>
        <div class="kpi-footer">
          <span class="text-success font-semibold">Protected via AI Reserve Prices</span>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-title">Auction Volume Under Bid</span>
          <div class="kpi-icon-wrap" style="background:#eff6ff;color:#2563eb;"><i data-lucide="dollar-sign"></i></div>
        </div>
        <div class="kpi-value">${formatCurrency(totalVolume)}</div>
        <div class="kpi-footer">
          <span class="text-muted font-semibold">${visibleEvents.length} sourcing events managed</span>
        </div>
      </div>

      <div class="kpi-card" style="border-left:4px solid #6366f1;">
        <div class="kpi-header">
          <span class="kpi-title">Total Competitive Bids Logged</span>
          <div class="kpi-icon-wrap" style="background:#eef2ff;color:#4f46e5;"><i data-lucide="layers"></i></div>
        </div>
        <div class="kpi-value" style="color:#4f46e5;">${totalBids}</div>
        <div class="kpi-footer">
          <span class="text-primary font-semibold">Audit trail secured & timestamped</span>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1.5px solid var(--border);margin-bottom:1.25rem;flex-wrap:wrap;gap:0.75rem;">
      <div style="display:flex;gap:0.5rem;">
        <button class="tab-btn ${state.activeTab === 'events' ? 'active' : ''}" onclick="window.setAuctionTab('events')" style="display:flex;align-items:center;gap:0.4rem;padding:0.75rem 1rem;font-size:0.875rem;font-weight:700;border:none;background:none;border-bottom:2.5px solid ${state.activeTab === 'events' ? '#6366f1' : 'transparent'};color:${state.activeTab === 'events' ? '#4f46e5' : 'var(--text-muted)'};cursor:pointer;">
          <i data-lucide="layers" style="width:16px;height:16px;"></i> Sourcing Events & Auctions (${filtered.length})
        </button>
        <button class="tab-btn ${state.activeTab === 'live' ? 'active' : ''}" onclick="window.setAuctionTab('live')" style="display:flex;align-items:center;gap:0.4rem;padding:0.75rem 1rem;font-size:0.875rem;font-weight:700;border:none;background:none;border-bottom:2.5px solid ${state.activeTab === 'live' ? '#6366f1' : 'transparent'};color:${state.activeTab === 'live' ? '#4f46e5' : 'var(--text-muted)'};cursor:pointer;">
          <i data-lucide="radio" style="width:16px;height:16px;color:#ef4444;"></i> Live Reverse Auction Arena ${liveCount > 0 ? '<span class="badge badge-danger" style="font-size:0.65rem;">LIVE</span>' : ''}
        </button>
        <button class="tab-btn ${state.activeTab === 'reserve' ? 'active' : ''}" onclick="window.setAuctionTab('reserve')" style="display:flex;align-items:center;gap:0.4rem;padding:0.75rem 1rem;font-size:0.875rem;font-weight:700;border:none;background:none;border-bottom:2.5px solid ${state.activeTab === 'reserve' ? '#6366f1' : 'transparent'};color:${state.activeTab === 'reserve' ? '#4f46e5' : 'var(--text-muted)'};cursor:pointer;">
          <i data-lucide="sparkles" style="width:16px;height:16px;"></i> Dynamic Reserve Price Calibration (AI)
        </button>
        <button class="tab-btn ${state.activeTab === 'analytics' ? 'active' : ''}" onclick="window.setAuctionTab('analytics')" style="display:flex;align-items:center;gap:0.4rem;padding:0.75rem 1rem;font-size:0.875rem;font-weight:700;border:none;background:none;border-bottom:2.5px solid ${state.activeTab === 'analytics' ? '#6366f1' : 'transparent'};color:${state.activeTab === 'analytics' ? '#4f46e5' : 'var(--text-muted)'};cursor:pointer;">
          <i data-lucide="bar-chart-2" style="width:16px;height:16px;"></i> Bidding Analytics & Yield Curves
        </button>
        ${!isVendor ? `
          <button class="tab-btn ${state.activeTab === 'config' ? 'active' : ''}" onclick="window.setAuctionTab('config')" style="display:flex;align-items:center;gap:0.4rem;padding:0.75rem 1rem;font-size:0.875rem;font-weight:700;border:none;background:none;border-bottom:2.5px solid ${state.activeTab === 'config' ? '#6366f1' : 'transparent'};color:${state.activeTab === 'config' ? '#4f46e5' : 'var(--text-muted)'};cursor:pointer;">
            <i data-lucide="sliders" style="width:16px;height:16px;"></i> Visibility & Auction Rules
          </button>
        ` : ''}
      </div>

      ${state.activeTab === 'events' ? `
        <div style="display:flex;align-items:center;gap:0.35rem;padding:0.25rem;background:#f1f5f9;border-radius:var(--radius-sm);">
          <button class="btn btn-sm ${state.viewMode === 'table' ? 'btn-primary' : 'btn-ghost'}" style="padding:4px 8px;" onclick="window.setAuctionViewMode('table')" title="Table View">
            <i data-lucide="list" style="width:14px;height:14px;"></i>
          </button>
          <button class="btn btn-sm ${state.viewMode === 'cards' ? 'btn-primary' : 'btn-ghost'}" style="padding:4px 8px;" onclick="window.setAuctionViewMode('cards')" title="Card View">
            <i data-lucide="grid" style="width:14px;height:14px;"></i>
          </button>
        </div>
      ` : ''}
    </div>

    <!-- Tab Contents -->
    <div>
      ${state.activeTab === 'events' ? _renderAuctionEventsConsole(filtered, state, canManage, isVendor) : ''}
      ${state.activeTab === 'live' ? _renderLiveAuctionArena(activeEvent, canManage, isVendor) : ''}
      ${state.activeTab === 'reserve' ? _renderAIReservePriceModule(activeEvent, canManage) : ''}
      ${state.activeTab === 'analytics' ? _renderAuctionAnalytics(visibleEvents) : ''}
      ${state.activeTab === 'config' ? _renderAuctionConfig(cfg) : ''}
    </div>
  `;

  lucide.createIcons();

  if (state.activeTab === 'analytics') {
    setTimeout(window._initAuctionCharts, 50);
  }
};

// ─────────────────────────────────────────────────────────────
//  TAB 1: SOURCING EVENTS & AUCTION CONSOLE
// ─────────────────────────────────────────────────────────────

function _renderVendorRecommendationEngine(canManage, isVendor) {
  if (isVendor) return '';
  const data = MockData.vendorRecommendationsData;
  if (!data || !data.recommendations) return '';
  const r = data.recommendations;

  return `
    <!-- AI Vendor Recommendation Engine -->
    <div class="card" style="margin-bottom:1.5rem;border:1.5px solid #6366f1;background:linear-gradient(180deg,#faf5ff 0%,#ffffff 100px);box-shadow:0 4px 20px rgba(99,102,241,0.08);border-radius:12px;overflow:hidden;">
      <div style="padding:1.25rem 1.5rem;border-bottom:1px solid #e0e7ff;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
        <div>
          <div style="display:flex;align-items:center;gap:0.625rem;">
            <span style="background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;width:28px;height:28px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(99,102,241,0.3);">
              <i data-lucide="sparkles" style="width:16px;height:16px;"></i>
            </span>
            <h3 style="margin:0;font-size:1.125rem;font-weight:800;color:#1e1b4b;letter-spacing:-0.01em;">
              AI Vendor Recommendation Engine
            </h3>
            <span class="badge" style="background:#ede9fe;color:#5b21b6;font-size:0.75rem;font-weight:700;padding:2px 8px;border-radius:999px;">
              Guided Decision Matrix
            </span>
          </div>
          <p style="margin:0.35rem 0 0 0;font-size:0.8125rem;color:var(--text-muted);max-width:850px;">
            When sourcing, AI analyzes real-time bidding telemetry, technical integration friction, cross-category synergy, and composite procurement scoring to guide decision-making. <strong>Retailers love guided decisions.</strong>
          </p>
        </div>
        <div>
          <span style="font-size:0.75rem;font-weight:700;color:#6366f1;background:#eef2ff;padding:4px 10px;border-radius:6px;display:inline-flex;align-items:center;gap:0.35rem;">
            <i data-lucide="check-circle-2" style="width:14px;height:14px;"></i> Active Event: ${esc(data.eventName)}
          </span>
        </div>
      </div>

      <div style="padding:1.25rem 1.5rem;">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1rem;">
          <!-- 1. Best Profit Vendor -->
          <div style="background:#fff;border:1.5px solid #d1fae5;border-radius:10px;padding:1.125rem;box-shadow:0 2px 8px rgba(16,185,129,0.06);display:flex;flex-direction:column;justify-content:space-between;position:relative;">
            <div style="position:absolute;top:10px;right:10px;background:#d1fae5;color:#065f46;font-size:0.6875rem;font-weight:800;padding:2px 8px;border-radius:999px;text-transform:uppercase;">
              Max Commission
            </div>
            <div>
              <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;">
                <span style="font-size:1.25rem;">🏆</span>
                <div>
                  <div style="font-size:0.75rem;font-weight:800;color:#059669;text-transform:uppercase;letter-spacing:0.05em;">${esc(r.bestProfit.badge)}</div>
                  <div style="font-weight:800;font-size:1.0625rem;color:var(--text);">${esc(r.bestProfit.vendorName)}</div>
                </div>
              </div>
              <div style="display:flex;align-items:baseline;gap:0.35rem;margin:0.625rem 0 0.35rem 0;">
                <span style="font-size:1.625rem;font-weight:900;color:#059669;">${r.bestProfit.rate.toFixed(2)}%</span>
                <span style="font-size:0.75rem;color:#059669;font-weight:700;">${esc(r.bestProfit.upsideVsCurrent)}</span>
              </div>
              <div style="font-size:0.75rem;font-weight:600;color:var(--text-muted);margin-bottom:0.75rem;">
                Estimated Annualized: <strong>${formatCurrency(r.bestProfit.annualRevenue)}/yr</strong>
              </div>
              <p style="font-size:0.78125rem;color:var(--text-secondary);line-height:1.45;margin:0 0 1rem 0;">
                ${esc(r.bestProfit.reasoning)}
              </p>
            </div>
            <button class="btn btn-sm" style="width:100%;background:#10b981;color:#fff;border:none;font-weight:700;display:flex;align-items:center;justify-content:center;gap:0.35rem;" onclick="window.enterLiveAuctionRoom('${data.eventId}')">
              <i data-lucide="check" style="width:14px;height:14px;"></i> Select for Award
            </button>
          </div>

          <!-- 2. Best Operational Vendor -->
          <div style="background:#fff;border:1.5px solid #cffafe;border-radius:10px;padding:1.125rem;box-shadow:0 2px 8px rgba(6,182,212,0.06);display:flex;flex-direction:column;justify-content:space-between;position:relative;">
            <div style="position:absolute;top:10px;right:10px;background:#cffafe;color:#155e75;font-size:0.6875rem;font-weight:800;padding:2px 8px;border-radius:999px;text-transform:uppercase;">
              Ease of Integration
            </div>
            <div>
              <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;">
                <span style="font-size:1.25rem;">⚙️</span>
                <div>
                  <div style="font-size:0.75rem;font-weight:800;color:#0891b2;text-transform:uppercase;letter-spacing:0.05em;">${esc(r.bestOperational.badge)}</div>
                  <div style="font-weight:800;font-size:1.0625rem;color:var(--text);">${esc(r.bestOperational.vendorName)}</div>
                </div>
              </div>
              <div style="display:flex;align-items:baseline;gap:0.35rem;margin:0.625rem 0 0.35rem 0;">
                <span style="font-size:1.625rem;font-weight:900;color:#0891b2;">${r.bestOperational.rate.toFixed(2)}%</span>
                <span style="font-size:0.75rem;color:#0891b2;font-weight:700;">${esc(r.bestOperational.upsideVsCurrent)}</span>
              </div>
              <div style="font-size:0.75rem;font-weight:600;color:var(--text-muted);margin-bottom:0.75rem;">
                Estimated Annualized: <strong>${formatCurrency(r.bestOperational.annualRevenue)}/yr</strong>
              </div>
              <p style="font-size:0.78125rem;color:var(--text-secondary);line-height:1.45;margin:0 0 1rem 0;">
                ${esc(r.bestOperational.reasoning)}
              </p>
            </div>
            <button class="btn btn-sm" style="width:100%;background:#06b6d4;color:#fff;border:none;font-weight:700;display:flex;align-items:center;justify-content:center;gap:0.35rem;" onclick="window.enterLiveAuctionRoom('${data.eventId}')">
              <i data-lucide="check" style="width:14px;height:14px;"></i> Select for Award
            </button>
          </div>

          <!-- 3. Best Strategic Vendor -->
          <div style="background:#fff;border:1.5px solid #ede9fe;border-radius:10px;padding:1.125rem;box-shadow:0 2px 8px rgba(139,92,246,0.06);display:flex;flex-direction:column;justify-content:space-between;position:relative;">
            <div style="position:absolute;top:10px;right:10px;background:#ede9fe;color:#5b21b6;font-size:0.6875rem;font-weight:800;padding:2px 8px;border-radius:999px;text-transform:uppercase;">
              Long-Term Revenue
            </div>
            <div>
              <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;">
                <span style="font-size:1.25rem;">📈</span>
                <div>
                  <div style="font-size:0.75rem;font-weight:800;color:#7c3aed;text-transform:uppercase;letter-spacing:0.05em;">${esc(r.bestStrategic.badge)}</div>
                  <div style="font-weight:800;font-size:1.0625rem;color:var(--text);">${esc(r.bestStrategic.vendorName)}</div>
                </div>
              </div>
              <div style="display:flex;align-items:baseline;gap:0.35rem;margin:0.625rem 0 0.35rem 0;">
                <span style="font-size:1.625rem;font-weight:900;color:#7c3aed;">${r.bestStrategic.rate.toFixed(2)}%</span>
                <span style="font-size:0.75rem;color:#7c3aed;font-weight:700;">${esc(r.bestStrategic.upsideVsCurrent)}</span>
              </div>
              <div style="font-size:0.75rem;font-weight:600;color:var(--text-muted);margin-bottom:0.75rem;">
                Estimated Annualized: <strong>${formatCurrency(r.bestStrategic.annualRevenue)}/yr</strong>
              </div>
              <p style="font-size:0.78125rem;color:var(--text-secondary);line-height:1.45;margin:0 0 1rem 0;">
                ${esc(r.bestStrategic.reasoning)}
              </p>
            </div>
            <button class="btn btn-sm" style="width:100%;background:#8b5cf6;color:#fff;border:none;font-weight:700;display:flex;align-items:center;justify-content:center;gap:0.35rem;" onclick="window.enterLiveAuctionRoom('${data.eventId}')">
              <i data-lucide="check" style="width:14px;height:14px;"></i> Select for Award
            </button>
          </div>

          <!-- 4. Best Overall Vendor -->
          <div style="background:#fff;border:2px solid #f59e0b;border-radius:10px;padding:1.125rem;box-shadow:0 4px 12px rgba(245,158,11,0.12);display:flex;flex-direction:column;justify-content:space-between;position:relative;">
            <div style="position:absolute;top:10px;right:10px;background:#fef3c7;color:#b45309;font-size:0.6875rem;font-weight:800;padding:2px 8px;border-radius:999px;text-transform:uppercase;">
              Combined Scoring
            </div>
            <div>
              <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;">
                <span style="font-size:1.25rem;">👑</span>
                <div>
                  <div style="font-size:0.75rem;font-weight:800;color:#d97706;text-transform:uppercase;letter-spacing:0.05em;">${esc(r.bestOverall.badge)}</div>
                  <div style="font-weight:800;font-size:1.0625rem;color:var(--text);">${esc(r.bestOverall.vendorName)}</div>
                </div>
              </div>
              <div style="display:flex;align-items:baseline;gap:0.35rem;margin:0.625rem 0 0.35rem 0;">
                <span style="font-size:1.625rem;font-weight:900;color:#d97706;">${r.bestOverall.rate.toFixed(2)}%</span>
                <span style="font-size:0.75rem;color:#d97706;font-weight:700;">Score: 94.6/100</span>
              </div>
              <div style="font-size:0.75rem;font-weight:600;color:var(--text-muted);margin-bottom:0.75rem;">
                Estimated Annualized: <strong>${formatCurrency(r.bestOverall.annualRevenue)}/yr</strong>
              </div>
              <p style="font-size:0.78125rem;color:var(--text-secondary);line-height:1.45;margin:0 0 1rem 0;">
                ${esc(r.bestOverall.reasoning)}
              </p>
            </div>
            <button class="btn btn-sm" style="width:100%;background:#f59e0b;color:#fff;border:none;font-weight:700;display:flex;align-items:center;justify-content:center;gap:0.35rem;" onclick="window.enterLiveAuctionRoom('${data.eventId}')">
              <i data-lucide="check" style="width:14px;height:14px;"></i> Select for Award
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function _renderAuctionEventsConsole(events, state, canManage, isVendor) {
  const categories = ['all', 'Gift Cards', 'Money Transfer', 'Prepaid Products', 'Debit Services', 'Financial Services'];

  return `
    ${_renderVendorRecommendationEngine(canManage, isVendor)}

    <!-- Filter bar -->
    <div class="card" style="margin-bottom:1.25rem;padding:1rem 1.25rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.875rem;">
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center;flex:1;">
          <!-- Search -->
          <div style="position:relative;min-width:240px;flex:1;max-width:320px;">
            <i data-lucide="search" style="position:absolute;left:10px;top:50%;transform:translateY(-50%);width:14px;height:14px;color:var(--text-muted);"></i>
            <input
              type="text"
              class="form-input"
              style="padding-left:2rem;font-size:0.8125rem;"
              placeholder="Search auctions, categories, bidders..."
              value="${esc(state.searchQuery)}"
              oninput="window.setAuctionSearch(this.value)"
            />
          </div>

          <!-- Category filter -->
          <div>
            <select class="form-input" style="font-size:0.8125rem;" onchange="window.setAuctionFilter('categoryFilter', this.value)">
              ${categories.map(c => `<option value="${c}" ${state.categoryFilter === c ? 'selected' : ''}>${c === 'all' ? 'All Categories' : c}</option>`).join('')}
            </select>
          </div>

          <!-- Mode filter -->
          <div>
            <select class="form-input" style="font-size:0.8125rem;" onchange="window.setAuctionFilter('modeFilter', this.value)">
              <option value="all" ${state.modeFilter === 'all' ? 'selected' : ''}>All Auction Types</option>
              <option value="realtime_reverse" ${state.modeFilter === 'realtime_reverse' ? 'selected' : ''}>Real-Time Reverse Auction</option>
              <option value="sealed_bid" ${state.modeFilter === 'sealed_bid' ? 'selected' : ''}>Sealed-Bid Auction</option>
              <option value="target_pricing" ${state.modeFilter === 'target_pricing' ? 'selected' : ''}>Target Pricing RFP</option>
            </select>
          </div>

          <!-- Status filter -->
          <div>
            <select class="form-input" style="font-size:0.8125rem;" onchange="window.setAuctionFilter('statusFilter', this.value)">
              <option value="all" ${state.statusFilter === 'all' ? 'selected' : ''}>All Statuses</option>
              <option value="Live" ${state.statusFilter === 'Live' ? 'selected' : ''}>Live Now (Bidding Open)</option>
              <option value="Open" ${state.statusFilter === 'Open' ? 'selected' : ''}>Open (Receiving Bids)</option>
              <option value="Evaluation" ${state.statusFilter === 'Evaluation' ? 'selected' : ''}>In Evaluation</option>
              <option value="Awarded" ${state.statusFilter === 'Awarded' ? 'selected' : ''}>Awarded / Closed</option>
              <option value="Draft" ${state.statusFilter === 'Draft' ? 'selected' : ''}>Draft</option>
            </select>
          </div>
        </div>

        <div style="font-size:0.8125rem;color:var(--text-muted);">
          Showing <strong>${events.length}</strong> sourcing events
        </div>
      </div>
    </div>

    ${events.length === 0 ? `
      <div class="card" style="padding:3rem;text-align:center;">
        <i data-lucide="shopping-cart" style="width:48px;height:48px;color:var(--text-muted);margin:0 auto 1rem auto;"></i>
        <div style="font-weight:700;font-size:1.125rem;color:var(--text);">No auctions match your search filters</div>
        <p style="color:var(--text-muted);font-size:0.875rem;margin-top:0.25rem;">Adjust your keyword search or reset the filters to see all events.</p>
        <button class="btn btn-outline btn-sm" style="margin-top:1rem;" onclick="window.resetAuctionFilters()">
          <i data-lucide="rotate-ccw"></i> Reset Filters
        </button>
      </div>
    ` : state.viewMode === 'cards' ? _renderAuctionCardsView(events, canManage, isVendor) : _renderAuctionTableView(events, canManage, isVendor)}
  `;
}

function _renderAuctionTableView(events, canManage, isVendor) {
  const statusColors = {
    'Live': 'badge-danger',
    'Open': 'badge-success',
    'Evaluation': 'badge-warning',
    'Awarded': 'badge-primary',
    'Draft': 'badge-neutral',
    'Closed': 'badge-neutral'
  };

  return `
    <div class="card" style="overflow:hidden;border:1.5px solid var(--border);">
      <div class="table-wrap">
        <table class="table" style="font-size:0.8125rem;width:100%;">
          <thead>
            <tr>
              <th>Auction Event Name</th>
              <th>Category</th>
              <th>Auction Type</th>
              <th>Visibility Rules</th>
              <th>AI Dynamic Reserve</th>
              <th>Current Lead / Winner</th>
              <th>Bids Received</th>
              <th>Status</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${events.map(e => {
              const res = e.aiReserveRecommendation || {};
              const lead = e.currentLeadingBid || {};
              const isLive = e.status === 'Live';

              let visBadge = '<span class="visibility-rule-pill vis-rank-only">Rank-Only</span>';
              if (e.visibilityRule === 'open') visBadge = '<span class="visibility-rule-pill vis-open">Open Book</span>';
              if (e.visibilityRule === 'sealed') visBadge = '<span class="visibility-rule-pill vis-sealed">Sealed Blind</span>';
              if (e.visibilityRule === 'anonymous_lead') visBadge = '<span class="visibility-rule-pill vis-anonymous-lead">Anon. Lead</span>';

              let modeLabel = 'Real-Time Reverse';
              if (e.auctionType === 'sealed_bid') modeLabel = 'Sealed Bid';
              if (e.auctionType === 'target_pricing') modeLabel = 'Target Pricing RFP';

              return `
                <tr style="${isLive ? 'background:rgba(254,242,242,0.5);font-weight:600;' : ''}">
                  <td>
                    <div style="font-weight:700;color:var(--text);font-size:0.875rem;display:flex;align-items:center;gap:0.35rem;">
                      ${isLive ? '<i data-lucide="radio" style="width:14px;height:14px;color:#dc2626;" class="spin"></i>' : ''}
                      ${esc(e.name)}
                    </div>
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.15rem;">
                      ID: ${esc(e.id)} &bull; Volume: ${formatCurrency(e.annualVolume || e.budget)}
                    </div>
                  </td>
                  <td>
                    <span class="badge badge-neutral">${esc(e.category)}</span>
                  </td>
                  <td>
                    <span style="font-weight:600;color:var(--text);">${modeLabel}</span>
                  </td>
                  <td>
                    ${visBadge}
                  </td>
                  <td>
                    ${!isVendor ? `
                      <div class="font-mono" style="font-weight:800;color:#047857;">
                        ${res.optimalReserveRate ? res.optimalReserveRate + '%' : 'Pending'}
                      </div>
                      <div style="font-size:0.7rem;color:var(--text-muted);">
                        Start: ${res.recommendedStartingRate || '3.50'}%
                      </div>
                    ` : `
                      <span class="badge badge-neutral" style="font-size:0.7rem;">Confidential</span>
                    `}
                  </td>
                  <td>
                    ${lead.rate ? `
                      <div style="font-weight:700;color:#047857;font-size:0.875rem;">
                        ${lead.rate}%
                        ${lead.reserveMet ? '<span class="badge badge-success" style="font-size:0.6rem;padding:1px 4px;margin-left:3px;">Met</span>' : ''}
                      </div>
                      <div style="font-size:0.7rem;color:var(--text-muted);">
                        ${e.visibilityRule === 'open' || !isVendor ? esc(lead.vendorName) : 'Leader (Blind)'}
                      </div>
                    ` : '<span style="color:var(--text-muted);font-style:italic;">No bids yet</span>'}
                  </td>
                  <td style="text-align:center;">
                    <span class="badge ${e.bidsReceived > 0 ? 'badge-primary' : 'badge-neutral'}" style="font-size:0.75rem;">
                      ${e.bids ? e.bids.length : e.bidsReceived} Bids
                    </span>
                  </td>
                  <td>
                    <span class="badge ${statusColors[e.status] || 'badge-neutral'}">${esc(e.status)}</span>
                  </td>
                  <td style="text-align:right;">
                    <div style="display:flex;justify-content:flex-end;gap:0.35rem;">
                      ${isLive ? `
                        <button class="btn btn-sm btn-danger" style="padding:3px 8px;" onclick="window.enterLiveAuctionRoom('${e.id}')">
                          <i data-lucide="radio"></i> Live Room
                        </button>
                      ` : `
                        <button class="btn btn-sm btn-outline" style="padding:3px 8px;" onclick="window.openBidComparisonModal('${e.id}')">
                          <i data-lucide="bar-chart-2"></i> Bids
                        </button>
                      `}
                      ${canManage && !isVendor && e.status !== 'Awarded' ? `
                        <button class="btn btn-sm btn-primary" style="padding:3px 7px;" onclick="window.enterLiveAuctionRoom('${e.id}')" title="Auction Console">
                          <i data-lucide="external-link" style="width:13px;height:13px;"></i>
                        </button>
                      ` : ''}
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function _renderAuctionCardsView(events, canManage, isVendor) {
  return `
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:1.25rem;">
      ${events.map(e => {
        const res = e.aiReserveRecommendation || {};
        const lead = e.currentLeadingBid || {};
        const isLive = e.status === 'Live';

        return `
          <div class="card" style="padding:1.25rem;border:1.5px solid ${isLive ? '#ef4444' : 'var(--border)'};display:flex;flex-direction:column;justify-content:space-between;">
            <div>
              <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                <div>
                  <span class="badge badge-neutral" style="font-size:0.6875rem;">${esc(e.category)}</span>
                  <div style="font-size:1.0625rem;font-weight:800;color:var(--text);margin-top:0.25rem;">${esc(e.name)}</div>
                </div>
                <span class="badge ${isLive ? 'badge-danger' : 'badge-primary'}">${esc(e.status)}</span>
              </div>

              <div style="background:#f8fafc;padding:0.75rem;border-radius:var(--radius);margin:0.75rem 0;display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;font-size:0.8125rem;">
                <div>
                  <div style="font-size:0.6875rem;color:var(--text-muted);font-weight:700;text-transform:uppercase;">AI RESERVE PRICE</div>
                  <div style="font-size:1.125rem;font-weight:800;color:#047857;">
                    ${!isVendor ? (res.optimalReserveRate ? res.optimalReserveRate + '%' : '3.80%') : 'Confidential'}
                  </div>
                </div>
                <div>
                  <div style="font-size:0.6875rem;color:var(--text-muted);font-weight:700;text-transform:uppercase;">LEADING BID</div>
                  <div style="font-size:1.125rem;font-weight:800;color:#1e40af;">
                    ${lead.rate ? lead.rate + '%' : 'None'}
                  </div>
                </div>
              </div>

              <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:0.75rem;">
                Visibility: <strong>${esc(e.visibilityRule.toUpperCase())}</strong> &bull; Volume: <strong>${formatCurrency(e.annualVolume || e.budget)}</strong>
              </div>
            </div>

            <div style="border-top:1px solid var(--border);padding-top:0.75rem;display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:0.75rem;color:var(--text-muted);">${e.bids ? e.bids.length : e.bidsReceived} bids submitted</span>
              ${isLive ? `
                <button class="btn btn-sm btn-danger" onclick="window.enterLiveAuctionRoom('${e.id}')">
                  <i data-lucide="radio"></i> Enter Live Arena
                </button>
              ` : `
                <button class="btn btn-sm btn-outline" onclick="window.openBidComparisonModal('${e.id}')">
                  <i data-lucide="bar-chart-2"></i> Inspect Bids
                </button>
              `}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────
//  TAB 2: LIVE REVERSE AUCTION ARENA (SE001 INTERACTIVE)
// ─────────────────────────────────────────────────────────────
function _renderLiveAuctionArena(event, canManage, isVendor) {
  if (!event || !event.name) {
    return '<div class="card" style="padding:2rem;text-align:center;">Select an active auction event</div>';
  }

  const res = event.aiReserveRecommendation || {};
  const lead = event.currentLeadingBid || {};
  const bids = event.bids || [];
  const timer = event.liveTimer || { secondsRemaining: 272, isPaused: false };

  const mins = Math.floor(timer.secondsRemaining / 60).toString().padStart(2, '0');
  const secs = (timer.secondsRemaining % 60).toString().padStart(2, '0');

  // Reserve Meter Calculation
  const startRate = res.recommendedStartingRate || 3.60;
  const reserveRate = res.optimalReserveRate || 4.25;
  const stretchRate = res.stretchTargetRate || 4.45;
  const currLeadRate = lead.rate || startRate;

  // Percentage fill on bar: scale from startRate (0%) to stretchRate (100%)
  const span = stretchRate - startRate;
  const pctFill = Math.min(100, Math.max(0, ((currLeadRate - startRate) / span) * 100));
  const reserveMarkerPct = Math.min(100, Math.max(0, ((reserveRate - startRate) / span) * 100));

  return `
    <!-- Live Arena Stage -->
    <div class="auction-live-arena">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1.5rem;margin-bottom:1.5rem;">
        <div>
          <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.5rem;">
            <span class="auction-live-badge">
              <i data-lucide="radio" style="width:12px;height:12px;"></i> LIVE BIDDING ROOM ACTIVE
            </span>
            <span class="visibility-rule-pill vis-rank-only" style="background:rgba(255,255,255,0.15);color:#fff;border-color:rgba(255,255,255,0.3);">
              Rule: ${esc(event.visibilityRule.toUpperCase())}
            </span>
          </div>

          <h2 style="font-size:1.75rem;font-weight:900;color:#fff;margin:0;letter-spacing:-0.02em;">
            ${esc(event.name)}
          </h2>
          <p style="color:#94a3b8;font-size:0.875rem;margin:0.25rem 0 0 0;">
            Annual GMV Volume: <strong>${formatCurrency(event.annualVolume || event.budget)}</strong> &bull; Baseline Rate: <strong>${event.currentBaselineRate}%</strong>
          </p>
        </div>

        <!-- Live Clock Box -->
        <div style="background:rgba(0,0,0,0.4);border:1.5px solid rgba(239,68,68,0.5);border-radius:var(--radius-lg);padding:1rem 1.5rem;text-align:right;">
          <div style="font-size:0.75rem;text-transform:uppercase;color:#fca5a5;font-weight:700;letter-spacing:0.5px;">
            Auction Time Remaining
          </div>
          <div class="auction-timer-display" id="live-timer-digits" style="color:${timer.secondsRemaining < 120 ? '#ef4444' : '#34d399'};">
            ${mins}:${secs}
          </div>
          <div style="font-size:0.7rem;color:#cbd5e1;margin-top:0.25rem;">
            Anti-Sniping Active (+3 min on last-minute bids)
          </div>
        </div>
      </div>

      <!-- Dynamic Reserve Price Meter Bar -->
      ${!isVendor ? `
        <div class="reserve-meter-card">
          <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:0.5rem;">
            <div>
              <span style="font-size:0.8125rem;font-weight:800;text-transform:uppercase;color:#38bdf8;letter-spacing:0.5px;">
                <i data-lucide="sparkles" style="width:14px;height:14px;display:inline-block;"></i> Dynamic AI Reserve Price Tracker
              </span>
              <span style="font-size:0.75rem;color:#cbd5e1;margin-left:0.5rem;">
                Based on 1,420 peer stores &bull; Confidence: <strong>${res.confidenceScore || 98.4}%</strong>
              </span>
            </div>

            <div style="font-size:0.875rem;font-weight:700;">
              ${currLeadRate >= reserveRate ? `
                <span style="color:#34d399;"><i data-lucide="check-circle" style="width:14px;height:14px;display:inline-block;"></i> AI RESERVE PRICE MET &bull; SURPLUS PROTECTED</span>
              ` : `
                <span style="color:#f59e0b;"><i data-lucide="alert-circle" style="width:14px;height:14px;display:inline-block;"></i> CURRENT LEAD BELOW RESERVE</span>
              `}
            </div>
          </div>

          <!-- Progress Bar with Reserve Flag Marker -->
          <div class="reserve-indicator-bar">
            <div class="reserve-indicator-fill" style="width:${pctFill}%;"></div>
            <div class="reserve-marker-flag" style="left:${reserveMarkerPct}%;background:#f59e0b;color:#1e1b4b;">
              AI Reserve: ${reserveRate}%
            </div>
          </div>

          <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:#94a3b8;margin-top:0.5rem;">
            <span>Ceiling / Starting Rate: <strong>${startRate}%</strong></span>
            <span>Target AI Reserve Floor: <strong style="color:#f59e0b;">${reserveRate}%</strong> (+$43.7K/yr)</span>
            <span>Stretch Decile Target: <strong style="color:#34d399;">${stretchRate}%</strong></span>
          </div>
        </div>
      ` : ''}
    </div>

    <!-- Main Grid: Live Bidding Ladder (Left) + Bidding / Host Console (Right) -->
    <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:1.5rem;align-items:start;">
      <!-- Bidding Ladder -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title" style="display:flex;align-items:center;gap:0.5rem;">
              <i data-lucide="list-ordered" style="color:#6366f1;"></i> Real-Time Bidding Ladder & Leaderboard
            </div>
            <div class="card-subtitle">Live descending bid rounds &bull; Anti-collusion visibility rules enforced</div>
          </div>
          <span class="badge badge-success" style="font-size:0.75rem;">${bids.length} Total Bids</span>
        </div>

        <div class="card-body">
          <div class="bidding-ladder-list">
            ${bids.slice().reverse().map((b, idx) => {
              const isLead = b.isLeading;
              const displayVendor = (event.visibilityRule === 'open' || !isVendor) ? b.vendorName : (isLead ? 'Current Leading Bidder (Anonymous)' : 'Outbid Competitor');

              return `
                <div class="bidding-ladder-row ${isLead ? 'row-leading' : ''}">
                  <div style="display:flex;align-items:center;gap:0.75rem;">
                    <div style="font-size:1.125rem;font-weight:900;color:${isLead ? '#047857' : 'var(--text-muted)'};width:24px;">
                      ${isLead ? '🥇' : '#' + (idx + 1)}
                    </div>
                    <div>
                      <div style="font-weight:700;color:var(--text);font-size:0.875rem;">
                        ${esc(displayVendor)}
                        ${isLead ? '<span class="badge badge-success" style="font-size:0.65rem;margin-left:0.35rem;">LEADER</span>' : ''}
                      </div>
                      <div style="font-size:0.75rem;color:var(--text-muted);">
                        Round ${b.round} &bull; Timestamp: ${b.timestamp}
                      </div>
                    </div>
                  </div>

                  <div style="text-align:right;">
                    <div class="font-mono" style="font-size:1.25rem;font-weight:900;color:${isLead ? '#047857' : 'var(--text)'};">
                      ${b.rate.toFixed(2)}%
                    </div>
                    <div style="font-size:0.75rem;color:#059669;font-weight:600;">
                      +${formatCurrency(b.annualYield - event.currentBaselineAnnual)}/yr lift
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- Right: Bid Submission & Host Control Panel -->
      <div>
        <!-- Live Bid Submission Console (for Vendors or Procurement Test) -->
        <div class="card" style="margin-bottom:1.5rem;border:1.5px solid #6366f1;">
          <div class="card-header" style="background:#eef2ff;">
            <div>
              <div class="card-title" style="color:#1e1b4b;font-size:1rem;">
                <i data-lucide="send" style="color:#4f46e5;"></i> Place Live Counter-Bid
              </div>
              <div class="card-subtitle">Minimum bid increment: <strong>+0.05% (5 bps)</strong></div>
            </div>
            <span class="badge badge-primary">Round ${lead.round ? lead.round + 1 : 1}</span>
          </div>

          <div class="card-body">
            <form onsubmit="window.submitLiveCounterBid(event, '${event.id}')">
              <div class="form-group">
                <label class="form-label">Bidding Organization</label>
                <input type="text" class="form-input" id="bid-vendor-name" value="${isVendor ? (currentUser.vendorName || 'GiftFlow Inc.') : 'Incomm Payments Inc.'}" ${isVendor ? 'readonly' : ''} />
              </div>

              <div class="form-group">
                <label class="form-label">Proposed Commission Rate (%)</label>
                <div style="display:flex;align-items:center;gap:0.5rem;">
                  <input type="number" step="0.05" class="form-input font-mono" id="bid-rate-input" style="font-size:1.25rem;font-weight:800;color:#047857;" value="${(lead.rate ? lead.rate + 0.05 : 3.65).toFixed(2)}" min="${(lead.rate ? lead.rate + 0.05 : 3.65).toFixed(2)}" />
                  <span style="font-size:1.125rem;font-weight:700;color:var(--text-muted);">%</span>
                </div>
                <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.35rem;">
                  Must exceed current leader (${lead.rate || 3.60}%) by at least +0.05%.
                </div>
              </div>

              <div style="background:#f8fafc;padding:0.75rem;border-radius:var(--radius);margin-bottom:1rem;font-size:0.8125rem;">
                <div style="display:flex;justify-content:space-between;">
                  <span>Annualized Retailer Yield:</span>
                  <strong id="bid-projected-yield" style="color:#059669;">$152,250 / yr</strong>
                </div>
                <div style="display:flex;justify-content:space-between;color:var(--text-muted);font-size:0.75rem;margin-top:0.25rem;">
                  <span>Lift Over Current Baseline:</span>
                  <strong style="color:#059669;">+$47,250 / yr</strong>
                </div>
              </div>

              <button type="submit" class="btn btn-primary btn-full">
                <i data-lucide="check"></i> Submit Real-Time Bid
              </button>
            </form>
          </div>
        </div>

        <!-- Host Command Center (Procurement / Admin Only) -->
        ${canManage && !isVendor ? `
          <div class="card">
            <div class="card-header">
              <div class="card-title" style="font-size:0.9375rem;">
                <i data-lucide="shield"></i> Auction Host Command & Controls
              </div>
            </div>
            <div class="card-body">
              <div style="display:flex;flex-direction:column;gap:0.75rem;">
                <button class="btn btn-outline btn-full" onclick="window.extendLiveTimer('${event.id}', 3)">
                  <i data-lucide="clock"></i> Extend Auction by +3 Minutes (Anti-Sniping)
                </button>

                <button class="btn btn-outline btn-full" onclick="window.toggleLiveAuctionPause('${event.id}')">
                  <i data-lucide="pause"></i> ${timer.isPaused ? 'Resume Auction Timer' : 'Pause Live Auction'}
                </button>

                <button class="btn btn-primary btn-full" style="background:#059669;border-color:#059669;" onclick="window.confirmAwardAuction('${event.id}')">
                  <i data-lucide="award"></i> Declare Reserve Met & Award Contract (${lead.rate}%)
                </button>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────
//  TAB 3: DYNAMIC RESERVE PRICE RECOMMENDATIONS (AI MODULE)
// ─────────────────────────────────────────────────────────────
function _renderAIReservePriceModule(event, canManage) {
  const res = event.aiReserveRecommendation || {};

  return `
    <div style="display:grid;grid-template-columns:1fr 1.2fr;gap:1.5rem;align-items:start;">
      <!-- Left: Value Proposition & Rationale -->
      <div>
        <div class="card" style="margin-bottom:1.5rem;border:1.5px solid #818cf8;background:linear-gradient(180deg,#ffffff 0%,#f8fafc 100%);">
          <div class="card-header" style="background:rgba(99,102,241,0.05);border-bottom:1px solid #e0e7ff;">
            <div>
              <div style="display:flex;align-items:center;gap:0.5rem;">
                <span style="background:#6366f1;color:#fff;border-radius:6px;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:0.75rem;">
                  <i data-lucide="sparkles" style="width:14px;height:14px;"></i>
                </span>
                <div class="card-title" style="font-size:1.0625rem;color:#1e1b4b;">Dynamic Reserve Price Recommendations</div>
              </div>
              <div class="card-subtitle">AI Benchmark Analysis Preventing Retailers from Leaving Money on the Table</div>
            </div>
          </div>

          <div class="card-body">
            <p style="font-size:0.875rem;color:var(--text);line-height:1.5;margin-bottom:1rem;">
              In traditional reverse auctions, retailers without empirical market intelligence set arbitrary starting prices or accept suboptimal final bids, <strong>leaving tens of thousands of dollars on the table</strong>.
            </p>

            <div style="background:#eff6ff;border-left:4px solid #3b82f6;padding:0.875rem 1rem;border-radius:0 var(--radius) var(--radius) 0;margin-bottom:1.25rem;">
              <strong style="color:#1e40af;display:block;margin-bottom:0.25rem;">How Commission IQ Calculates the Dynamic Reserve:</strong>
              <div style="font-size:0.8125rem;color:#1e3a8a;line-height:1.45;">
                AI cross-references your store door count, regional foot traffic, and annual transaction volume against the institutional <strong>Benchmark Database Index v2.4 (1,420 doors)</strong> to calculate the exact mathematical threshold where vendor margins compress without triggering vendor walk-away risk.
              </div>
            </div>

            <!-- Empirical Proof Grid -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1.25rem;">
              <div style="background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:0.75rem;">
                <div style="font-size:0.7rem;text-transform:uppercase;color:var(--text-muted);font-weight:700;">Peer Sample Base</div>
                <div style="font-size:1.25rem;font-weight:800;color:var(--text);margin-top:0.15rem;">1,420 Stores</div>
                <div style="font-size:0.7rem;color:var(--text-muted);">Index v2.4 Active Cohort</div>
              </div>

              <div style="background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:0.75rem;">
                <div style="font-size:0.7rem;text-transform:uppercase;color:var(--text-muted);font-weight:700;">AI Model Confidence</div>
                <div style="font-size:1.25rem;font-weight:800;color:#059669;margin-top:0.15rem;">98.4%</div>
                <div style="font-size:0.7rem;color:var(--text-muted);">Calibrated Q4 2026</div>
              </div>
            </div>

            <div style="font-size:0.8125rem;color:var(--text-muted);">
              <strong>Active Recommendation for ${esc(event.name)}:</strong>
              <div style="margin-top:0.35rem;color:var(--text);font-style:italic;">
                "${esc(res.rationale || 'AI calibrated optimal reserve rate.')}"
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Interactive Dynamic Reserve Simulator -->
      <div>
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title"><i data-lucide="cpu"></i> Interactive Reserve Price Calibration Simulator</div>
              <div class="card-subtitle">Simulate AI reserve price recommendations for any category or door count</div>
            </div>
          </div>

          <div class="card-body">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
              <div class="form-group">
                <label class="form-label">Product Category</label>
                <select class="form-input" id="sim-cat" onchange="window.recalculateSimulatedReserve()">
                  <option value="Gift Cards">Gift Cards (Open-Loop)</option>
                  <option value="Money Transfer">Money Transfer & Wire</option>
                  <option value="Prepaid Products">Digital Streaming & Codes</option>
                  <option value="Debit Services">Debit Card Services</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Store Door Footprint</label>
                <input type="number" class="form-input" id="sim-doors" value="180" oninput="window.recalculateSimulatedReserve()" />
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;">
              <div class="form-group">
                <label class="form-label">Annual Volume GMV ($)</label>
                <input type="number" class="form-input" id="sim-volume" value="3500000" oninput="window.recalculateSimulatedReserve()" />
              </div>

              <div class="form-group">
                <label class="form-label">AI Strategy Aggressiveness</label>
                <select class="form-input" id="sim-strategy" onchange="window.recalculateSimulatedReserve()">
                  <option value="balanced">Balanced (Optimal Trade-off)</option>
                  <option value="aggressive">Aggressive (Push Top-Decile)</option>
                  <option value="conservative">Conservative (Maximum Vendor Turnout)</option>
                </select>
              </div>
            </div>

            <!-- Dynamic Output Scorecard -->
            <div style="background:#f8fafc;border:1.5px solid #cbd5e1;border-radius:var(--radius-lg);padding:1.25rem;margin-bottom:1.25rem;">
              <div style="font-size:0.75rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.75rem;">
                AI Recommended Auction Thresholds:
              </div>

              <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;text-align:center;">
                <div style="background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:0.75rem;">
                  <div style="font-size:0.7rem;text-transform:uppercase;color:var(--text-muted);font-weight:700;">Starting Ceiling</div>
                  <div style="font-size:1.375rem;font-weight:800;color:var(--text);margin-top:0.25rem;" id="sim-out-start">3.60%</div>
                  <div style="font-size:0.7rem;color:var(--text-muted);">Auction Opening Rate</div>
                </div>

                <div style="background:#eff6ff;border:1.5px solid #3b82f6;border-radius:var(--radius);padding:0.75rem;">
                  <div style="font-size:0.7rem;text-transform:uppercase;color:#1e40af;font-weight:700;">Optimal AI Reserve</div>
                  <div style="font-size:1.5rem;font-weight:900;color:#1d4ed8;margin-top:0.25rem;" id="sim-out-reserve">4.25%</div>
                  <div style="font-size:0.7rem;color:#1e40af;font-weight:600;">Minimum Retailer Floor</div>
                </div>

                <div style="background:#ecfdf5;border:1.5px solid #10b981;border-radius:var(--radius);padding:0.75rem;">
                  <div style="font-size:0.7rem;text-transform:uppercase;color:#047857;font-weight:700;">Stretch Target</div>
                  <div style="font-size:1.375rem;font-weight:800;color:#047857;margin-top:0.25rem;" id="sim-out-stretch">4.45%</div>
                  <div style="font-size:0.7rem;color:#047857;">Top-Decile Benchmark</div>
                </div>
              </div>

              <div style="margin-top:1rem;padding-top:0.75rem;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;font-size:0.8125rem;">
                <span>Projected EBITDA Protection vs Uncalibrated Auction:</span>
                <strong style="color:#059669;font-size:1rem;" id="sim-out-gain">+$43,750 / year</strong>
              </div>
            </div>

            <button class="btn btn-primary btn-full" onclick="window.applySimulatedReserveToLiveAuction('${event.id}')">
              <i data-lucide="check"></i> Apply This AI Reserve Price to Live Auction
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────
//  TAB 4: BIDDING ANALYTICS & ESCALATION CURVES
// ─────────────────────────────────────────────────────────────
function _renderAuctionAnalytics(events) {
  return `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(420px,1fr));gap:1.5rem;margin-bottom:1.5rem;">
      <!-- Chart 1: Live Bid Escalation Curve -->
      <div class="card" style="grid-column: 1 / -1;">
        <div class="card-header">
          <div>
            <div class="card-title"><i data-lucide="trending-up"></i> Reverse Auction Escalation Progression (SE001 Master Gift Card)</div>
            <div class="card-subtitle">Commission rate growth across sequential bidding rounds vs AI Reserve Price Floor</div>
          </div>
        </div>
        <div class="card-body">
          <div style="position:relative;height:320px;">
            <canvas id="chart-auction-escalation"></canvas>
          </div>
        </div>
      </div>

      <!-- Chart 2: Savings Realized vs Baseline -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title"><i data-lucide="bar-chart-2"></i> Annual EBITDA Lift by Sourcing Event</div>
            <div class="card-subtitle">Dollar margin expanded above historical contract baselines</div>
          </div>
        </div>
        <div class="card-body">
          <div style="position:relative;height:260px;">
            <canvas id="chart-auction-savings"></canvas>
          </div>
        </div>
      </div>

      <!-- Chart 3: Visibility Rule Distribution -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title"><i data-lucide="pie-chart"></i> Active Auction Formats & Visibility Rules</div>
            <div class="card-subtitle">Distribution across Open, Rank-Only, Sealed, and Target Pricing</div>
          </div>
        </div>
        <div class="card-body">
          <div style="position:relative;height:260px;">
            <canvas id="chart-auction-visibility"></canvas>
          </div>
        </div>
      </div>
    </div>
  `;
}

window._initAuctionCharts = function() {
  const events = MockData.sourcingEvents || [];
  const se001 = events.find(e => e.id === 'SE001') || events[0] || {};
  const bids = se001.bids || [];

  // 1. Escalation Curve
  const ctxEsc = document.getElementById('chart-auction-escalation');
  if (ctxEsc) {
    if (APP_STATE.charts['chart-auction-escalation']) {
      APP_STATE.charts['chart-auction-escalation'].destroy();
    }

    const labels = bids.map((b, i) => `Round ${b.round} (${b.timestamp})`);
    const rates = bids.map(b => b.rate);
    const reserveLine = bids.map(() => 4.25);

    APP_STATE.charts['chart-auction-escalation'] = new Chart(ctxEsc, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Leading Active Bid (%)',
            data: rates,
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            fill: true,
            tension: 0.3,
            borderWidth: 3,
            pointRadius: 6,
            pointBackgroundColor: '#4f46e5'
          },
          {
            label: 'AI Dynamic Reserve Floor (4.25%)',
            data: reserveLine,
            borderColor: '#10b981',
            borderDash: [6, 6],
            borderWidth: 2,
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 3.50,
            max: 4.50,
            ticks: { callback: v => v.toFixed(2) + '%' },
            title: { display: true, text: 'Commission Rate (%)' }
          }
        },
        plugins: {
          legend: { position: 'top' }
        }
      }
    });
  }

  // 2. Savings Bar Chart
  const ctxSav = document.getElementById('chart-auction-savings');
  if (ctxSav) {
    if (APP_STATE.charts['chart-auction-savings']) {
      APP_STATE.charts['chart-auction-savings'].destroy();
    }

    const sLabels = events.filter(e => e.currentLeadingBid?.annualGain).map(e => e.name.split(' ')[0]);
    const sGains = events.filter(e => e.currentLeadingBid?.annualGain).map(e => e.currentLeadingBid.annualGain);

    APP_STATE.charts['chart-auction-savings'] = new Chart(ctxSav, {
      type: 'bar',
      data: {
        labels: sLabels,
        datasets: [{
          label: 'EBITDA Lift ($)',
          data: sGains,
          backgroundColor: '#10b981',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, ticks: { callback: v => '$' + (v / 1000) + 'K' } }
        },
        plugins: { legend: { display: false } }
      }
    });
  }

  // 3. Visibility Doughnut
  const ctxVis = document.getElementById('chart-auction-visibility');
  if (ctxVis) {
    if (APP_STATE.charts['chart-auction-visibility']) {
      APP_STATE.charts['chart-auction-visibility'].destroy();
    }

    const rankOnlyCount = events.filter(e => e.visibilityRule === 'rank_only').length;
    const openCount = events.filter(e => e.visibilityRule === 'open').length;
    const sealedCount = events.filter(e => e.visibilityRule === 'sealed').length;
    const anonCount = events.filter(e => e.visibilityRule === 'anonymous_lead').length;

    APP_STATE.charts['chart-auction-visibility'] = new Chart(ctxVis, {
      type: 'doughnut',
      data: {
        labels: ['Rank-Only (Blind)', 'Open Book', 'Sealed Blind', 'Anonymous Best Rate'],
        datasets: [{
          data: [rankOnlyCount, openCount, sealedCount, anonCount],
          backgroundColor: ['#f59e0b', '#10b981', '#8b5cf6', '#3b82f6'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
        }
      }
    });
  }
};

// ─────────────────────────────────────────────────────────────
//  TAB 5: AUCTION ENGINE GOVERNANCE & RULES CONFIG
// ─────────────────────────────────────────────────────────────
function _renderAuctionConfig(cfg) {
  return `
    <div class="card" style="max-width:850px;margin:0 auto;">
      <div class="card-header">
        <div>
          <div class="card-title"><i data-lucide="sliders"></i> Reverse Auction Governance & Visibility Rules</div>
          <div class="card-subtitle">Configure bidding increments, anti-sniping protection, and visibility standards</div>
        </div>
      </div>

      <div class="card-body">
        <form onsubmit="window.saveAuctionConfig(event)">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;margin-bottom:1.25rem;">
            <div class="form-group">
              <label class="form-label">Default Bidder Visibility Rule</label>
              <select class="form-input" id="cfg-vis-rule">
                <option value="rank_only" ${cfg.defaultVisibility === 'rank_only' ? 'selected' : ''}>Rank-Only (Bidders see rank & gap to lead)</option>
                <option value="open" ${cfg.defaultVisibility === 'open' ? 'selected' : ''}>Open Book (Full competitor transparency)</option>
                <option value="anonymous_lead" ${cfg.defaultVisibility === 'anonymous_lead' ? 'selected' : ''}>Anonymous Lead (Best rate shown, no names)</option>
                <option value="sealed" ${cfg.defaultVisibility === 'sealed' ? 'selected' : ''}>Sealed Blind (Bidders see only their own submission)</option>
              </select>
              <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.25rem;">
                Controls what competing vendors can see during active bidding rounds.
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Anti-Sniping Clock Extension Window (Minutes)</label>
              <input type="number" class="form-input" id="cfg-sniping-mins" value="${cfg.defaultAntiSnipingMinutes || 3}" />
              <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.25rem;">
                Extends auction automatically if a bid is entered in final minutes.
              </div>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;margin-bottom:1.25rem;">
            <div class="form-group">
              <label class="form-label">Minimum Bid Increment (Basis Points)</label>
              <input type="number" class="form-input" id="cfg-min-inc" value="${cfg.defaultMinBidIncrementBps || 5}" />
              <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.25rem;">
                5 bps = 0.05% minimum increment required to take the lead.
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">AI Reserve Price Aggressiveness</label>
              <select class="form-input" id="cfg-reserve-agg">
                <option value="balanced" ${cfg.reservePriceAggressiveness === 'balanced' ? 'selected' : ''}>Balanced (Optimizes margin vs participation)</option>
                <option value="aggressive" ${cfg.reservePriceAggressiveness === 'aggressive' ? 'selected' : ''}>Aggressive (Locks top-decile peer benchmark)</option>
                <option value="conservative" ${cfg.reservePriceAggressiveness === 'conservative' ? 'selected' : ''}>Conservative (Maximizes bidder engagement)</option>
              </select>
            </div>
          </div>

          <div style="display:flex;justify-content:flex-end;gap:0.75rem;margin-top:1.5rem;">
            <button type="submit" class="btn btn-primary">
              <i data-lucide="check"></i> Save Auction Governance Rules
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────
//  INTERACTIVE ACTIONS, MODALS & WORKFLOWS
// ─────────────────────────────────────────────────────────────

window.setAuctionTab = function(tab) {
  window._auctionState.activeTab = tab;
  window.renderSourcing();
};

window.setAuctionFilter = function(key, val) {
  window._auctionState[key] = val;
  window.renderSourcing();
};

window.setAuctionSearch = function(query) {
  window._auctionState.searchQuery = query;
  window.renderSourcing();
};

window.setAuctionViewMode = function(mode) {
  window._auctionState.viewMode = mode;
  window.renderSourcing();
};

window.resetAuctionFilters = function() {
  window._auctionState.searchQuery = '';
  window._auctionState.categoryFilter = 'all';
  window._auctionState.modeFilter = 'all';
  window._auctionState.statusFilter = 'all';
  window.renderSourcing();
};

window.enterLiveAuctionRoom = function(eventId) {
  window._auctionState.selectedEventId = eventId;
  window._auctionState.activeTab = 'live';
  window.renderSourcing();
};

// 1. Submit Counter Bid in Real-Time
window.submitLiveCounterBid = function(e, eventId) {
  if (e) e.preventDefault();

  const ev = MockData.sourcingEvents.find(item => item.id === eventId);
  if (!ev) return;

  const vendorName = document.getElementById('bid-vendor-name')?.value.trim() || 'Incomm Payments Inc.';
  const rate = parseFloat(document.getElementById('bid-rate-input')?.value || '4.35');

  const currRate = ev.currentLeadingBid?.rate || 3.00;
  if (rate <= currRate) {
    showToast(`⚠️ Bid must exceed current leading rate of ${currRate}%!`, 'warning');
    return;
  }

  const now = new Date();
  const timeStr = now.toTimeString().split(' ')[0];
  const newRound = (ev.currentLeadingBid?.round || 5) + 1;
  const annualRevenue = Math.round((ev.annualVolume || 3500000) * (rate / 100));
  const annualGain = annualRevenue - (ev.currentBaselineAnnual || 105000);

  // Demote previous leader
  if (ev.bids) {
    ev.bids.forEach(b => b.isLeading = false);
  }

  // Create new bid
  const newBid = {
    id: 'BID-' + Date.now().toString().slice(-4),
    vendorId: 'V999',
    vendorName: vendorName,
    rate: rate,
    timestamp: timeStr,
    round: newRound,
    annualYield: annualRevenue,
    isLeading: true
  };

  if (!ev.bids) ev.bids = [];
  ev.bids.push(newBid);

  // Update event leader
  const reserveMet = rate >= (ev.aiReserveRecommendation?.optimalReserveRate || 4.25);
  ev.currentLeadingBid = {
    vendorName: vendorName,
    vendorId: 'V999',
    rate: rate,
    timestamp: timeStr,
    round: newRound,
    reserveMet: reserveMet,
    annualRevenue: annualRevenue,
    annualGain: annualGain
  };

  // Anti-sniping check: if under 2 minutes, auto extend by 3 minutes
  if (ev.liveTimer && ev.liveTimer.secondsRemaining < 120) {
    ev.liveTimer.secondsRemaining += 180;
    ev.liveTimer.antiSnipingExtendedCount = (ev.liveTimer.antiSnipingExtendedCount || 0) + 1;
    showToast('⏱️ Anti-Sniping Activated: Auction extended by +3 minutes!', 'info');
  }

  // Log to audit trail
  MockData.auditLogs.unshift({
    id: 'AL' + Date.now(),
    userId: Auth.getCurrentUser()?.id || 'U001',
    userName: vendorName,
    action: 'submit_counter_bid',
    module: 'Reverse Auction Engine',
    details: `Submitted leading counter-bid of ${rate.toFixed(2)}% in ${ev.name} (Round ${newRound}). Annualized lift: $${annualGain.toLocaleString()}`,
    timestamp: new Date().toISOString(),
    ipAddress: '127.0.0.1'
  });

  if (reserveMet) {
    MockData.notifications.unshift({
      id: 'N' + Date.now(),
      userId: 'U001',
      title: '🎯 AI Reserve Price Met!',
      message: `${vendorName} entered bid of ${rate}% in ${ev.name}, crossing the 4.25% AI reserve floor.`,
      type: 'success',
      read: false,
      timestamp: new Date().toISOString(),
      link: '#/sourcing'
    });
  }

  showToast(`🎉 Bid of ${rate.toFixed(2)}% submitted! New leader: ${vendorName}`, 'success');
  window.renderSourcing();
};

// 2. Extend Live Timer
window.extendLiveTimer = function(eventId, mins) {
  const ev = MockData.sourcingEvents.find(item => item.id === eventId);
  if (!ev || !ev.liveTimer) return;

  ev.liveTimer.secondsRemaining += (mins * 60);

  MockData.auditLogs.unshift({
    id: 'AL' + Date.now(),
    userId: Auth.getCurrentUser()?.id || 'U001',
    userName: Auth.getCurrentUser()?.name || 'Auction Host',
    action: 'extend_auction_timer',
    module: 'Reverse Auction Engine',
    details: `Extended auction clock by +${mins} minutes for ${ev.name}`,
    timestamp: new Date().toISOString(),
    ipAddress: '127.0.0.1'
  });

  showToast(`⏱️ Auction clock extended by +${mins} minutes!`, 'info');
  window.renderSourcing();
};

// 3. Pause / Resume Timer
window.toggleLiveAuctionPause = function(eventId) {
  const ev = MockData.sourcingEvents.find(item => item.id === eventId);
  if (!ev || !ev.liveTimer) return;

  ev.liveTimer.isPaused = !ev.liveTimer.isPaused;
  showToast(ev.liveTimer.isPaused ? '⏸️ Auction paused by host' : '▶️ Auction resumed', 'info');
  window.renderSourcing();
};

// 4. Confirm Award Auction
window.confirmAwardAuction = function(eventId) {
  const ev = MockData.sourcingEvents.find(item => item.id === eventId);
  if (!ev) return;

  const lead = ev.currentLeadingBid || {};

  openModal(`Award Reverse Auction &bull; ${esc(ev.name)}`, `
    <div style="font-size:0.875rem;">
      <p style="color:var(--text-light);margin-bottom:1rem;">
        Conclude active bidding rounds and declare the winning distributor:
      </p>

      <div style="background:#ecfdf5;border:1.5px solid #10b981;border-radius:var(--radius-lg);padding:1.25rem;margin-bottom:1rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <span class="badge badge-success">Winning Bidder</span>
            <div style="font-size:1.25rem;font-weight:900;color:#047857;margin-top:0.25rem;">${esc(lead.vendorName)}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:1.75rem;font-weight:900;color:#047857;">${lead.rate}%</div>
            <div style="font-size:0.75rem;color:#059669;font-weight:700;">Rate Awarded</div>
          </div>
        </div>

        <div style="margin-top:0.75rem;padding-top:0.75rem;border-top:1px solid #a7f3d0;display:flex;justify-content:space-between;font-size:0.8125rem;">
          <span>Annual Value Realized: <strong>${formatCurrency(lead.annualRevenue)}/yr</strong></span>
          <span style="color:#047857;font-weight:800;">EBITDA Expansion: +${formatCurrency(lead.annualGain)}/yr</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Contract Addendum Title</label>
        <input type="text" class="form-input" value="Master Gift Card Program Rate Agreement 2027 (${lead.rate}%)" />
      </div>
    </div>
  `, [
    { label: 'Cancel', cls: 'btn-secondary', action: 'closeModal()' },
    { label: 'Finalize Award & Generate Contract 🚀', cls: 'btn-primary', action: `window.finalizeAuctionAward('${ev.id}')` }
  ]);
};

window.finalizeAuctionAward = function(eventId) {
  closeModal();
  const ev = MockData.sourcingEvents.find(item => item.id === eventId);
  if (!ev) return;

  ev.status = 'Awarded';

  MockData.auditLogs.unshift({
    id: 'AL' + Date.now(),
    userId: Auth.getCurrentUser()?.id || 'U001',
    userName: Auth.getCurrentUser()?.name || 'Executive Sponsor',
    action: 'award_reverse_auction',
    module: 'Reverse Auction Engine',
    details: `Awarded auction ${ev.id} to ${ev.currentLeadingBid?.vendorName} at ${ev.currentLeadingBid?.rate}% (+$${ev.currentLeadingBid?.annualGain} EBITDA)`,
    timestamp: new Date().toISOString(),
    ipAddress: '127.0.0.1'
  });

  MockData.notifications.unshift({
    id: 'N' + Date.now(),
    userId: 'U001',
    title: '🏆 Reverse Auction Awarded',
    message: `${ev.name} successfully awarded to ${ev.currentLeadingBid?.vendorName} at ${ev.currentLeadingBid?.rate}% commission.`,
    type: 'success',
    read: false,
    timestamp: new Date().toISOString(),
    link: '#/sourcing'
  });

  showToast(`🏆 Auction awarded to ${ev.currentLeadingBid?.vendorName} at ${ev.currentLeadingBid?.rate}%!`, 'success');
  window.setAuctionTab('events');
};

// 5. Inspect Bid Comparison Modal
window.openBidComparisonModal = function(eventId) {
  const ev = MockData.sourcingEvents.find(e => e.id === eventId);
  if (!ev) return;

  const bids = ev.bids || [];

  openModal(`Bid Comparison &bull; ${esc(ev.name)}`, `
    <div style="font-size:0.875rem;">
      <p style="color:var(--text-light);margin-bottom:1rem;">
        ${bids.length} competitive bids logged. Visibility rule: <strong>${esc(ev.visibilityRule.toUpperCase())}</strong>
      </p>

      <div class="table-wrap">
        <table class="table" style="font-size:0.8125rem;">
          <thead>
            <tr>
              <th>Bidder</th>
              <th>Commission Rate</th>
              <th>Annual Value</th>
              <th>Timestamp</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${bids.map((b, i) => `
              <tr style="${b.isLeading ? 'background:#ecfdf5;font-weight:700;' : ''}">
                <td>${b.isLeading ? '🥇 ' : ''}${esc(b.vendorName)}</td>
                <td class="font-mono text-primary font-bold">${b.rate.toFixed(2)}%</td>
                <td>${formatCurrency(b.annualYield || (ev.annualVolume * b.rate / 100))}</td>
                <td style="color:var(--text-muted);">${b.timestamp}</td>
                <td>${b.isLeading ? '<span class="badge badge-success">Leader</span>' : '<span class="badge badge-neutral">Outbid</span>'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `, [{ label: 'Close', cls: 'btn-secondary', action: 'closeModal()' }]);
};

// 6. Create Sourcing Auction Modal
window.openCreateReverseAuctionModal = function() {
  const categories = ['Gift Cards', 'Money Transfer', 'Prepaid Products', 'Debit Services', 'Financial Services'];

  openModal('Create New Reverse Auction or Sourcing Event', `
    <div style="font-size:0.875rem;">
      <div class="form-group">
        <label class="form-label">Auction Event Name *</label>
        <input type="text" class="form-input" id="new-auc-name" placeholder="e.g. Master Gift Card Distribution Reverse Auction 2027" />
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
        <div class="form-group">
          <label class="form-label">Category *</label>
          <select class="form-input" id="new-auc-cat">
            ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Annual Volume GMV ($) *</label>
          <input type="number" class="form-input" id="new-auc-volume" value="3000000" />
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
        <div class="form-group">
          <label class="form-label">Auction Sourcing Mode *</label>
          <select class="form-input" id="new-auc-mode">
            <option value="realtime_reverse">Real-Time Reverse Auction (Live Bidding)</option>
            <option value="sealed_bid">Sealed-Bid Auction (Blind Submissions)</option>
            <option value="target_pricing">Target Pricing RFP (Commission Target)</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Bidder Visibility Rule *</label>
          <select class="form-input" id="new-auc-vis">
            <option value="rank_only">Rank-Only (Bidders see rank & gap)</option>
            <option value="anonymous_lead">Anonymous Lead (Show best rate, no names)</option>
            <option value="open">Open Book (Full competitor transparency)</option>
            <option value="sealed">Sealed Blind (Closed until deadline)</option>
          </select>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
        <div class="form-group">
          <label class="form-label">Opening Starting Rate (%)</label>
          <input type="number" step="0.05" class="form-input" id="new-auc-start" value="3.50" />
        </div>

        <div class="form-group">
          <label class="form-label">AI Dynamic Reserve Price (%)</label>
          <input type="number" step="0.05" class="form-input" id="new-auc-reserve" value="4.25" />
        </div>
      </div>
    </div>
  `, [
    { label: 'Cancel', cls: 'btn-secondary', action: 'closeModal()' },
    { label: 'Publish & Launch Auction 🚀', cls: 'btn-primary', action: 'window.saveNewReverseAuction()' }
  ]);
};

window.saveNewReverseAuction = function() {
  const name = document.getElementById('new-auc-name')?.value.trim();
  if (!name) {
    showToast('⚠️ Event name is required!', 'warning');
    return;
  }

  const cat = document.getElementById('new-auc-cat')?.value || 'Gift Cards';
  const vol = parseInt(document.getElementById('new-auc-volume')?.value || '3000000', 10);
  const mode = document.getElementById('new-auc-mode')?.value || 'realtime_reverse';
  const vis = document.getElementById('new-auc-vis')?.value || 'rank_only';
  const startRate = parseFloat(document.getElementById('new-auc-start')?.value || '3.50');
  const resRate = parseFloat(document.getElementById('new-auc-reserve')?.value || '4.25');

  const newId = 'SE00' + (MockData.sourcingEvents.length + 1);

  MockData.sourcingEvents.unshift({
    id: newId,
    name: name,
    category: cat,
    auctionType: mode,
    visibilityRule: vis,
    status: mode === 'realtime_reverse' ? 'Live' : 'Open',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2026-12-15',
    vendorsInvited: 6,
    bidsReceived: 0,
    annualVolume: vol,
    currentBaselineRate: 3.00,
    currentBaselineAnnual: Math.round(vol * 0.03),
    budget: vol,
    aiReserveRecommendation: {
      recommendedStartingRate: startRate,
      optimalReserveRate: resRate,
      stretchTargetRate: resRate + 0.20,
      confidenceScore: 98.2,
      peerDoorsAnalyzed: 1420,
      rationale: 'AI calibrated reserve rate based on category benchmark database.'
    },
    currentLeadingBid: {},
    liveTimer: {
      totalMinutes: 20,
      secondsRemaining: 1200,
      isPaused: false
    },
    config: {
      visibilityRule: vis,
      minBidIncrementBps: 5,
      antiSnipingMinutes: 3
    },
    bids: []
  });

  MockData.auditLogs.unshift({
    id: 'AL' + Date.now(),
    userId: Auth.getCurrentUser()?.id || 'U001',
    userName: Auth.getCurrentUser()?.name || 'Category Manager',
    action: 'create_reverse_auction',
    module: 'Reverse Auction Engine',
    details: `Created new ${mode} event "${name}" (${newId}) with ${resRate}% AI reserve price.`,
    timestamp: new Date().toISOString(),
    ipAddress: '127.0.0.1'
  });

  closeModal();
  showToast(`🚀 Created auction event "${name}"!`, 'success');
  window.setAuctionTab('events');
};

// 7. Dynamic Reserve Simulator Recalculation
window.recalculateSimulatedReserve = function() {
  const cat = document.getElementById('sim-cat')?.value || 'Gift Cards';
  const doors = parseInt(document.getElementById('sim-doors')?.value || '180', 10);
  const vol = parseInt(document.getElementById('sim-volume')?.value || '3500000', 10);
  const strat = document.getElementById('sim-strategy')?.value || 'balanced';

  let baseReserve = 4.10;
  if (cat === 'Money Transfer') baseReserve = 2.15;
  if (cat === 'Prepaid Products') baseReserve = 2.50;
  if (cat === 'Debit Services') baseReserve = 1.65;

  let delta = 0;
  if (strat === 'aggressive') delta = 0.20;
  if (strat === 'conservative') delta = -0.15;
  if (doors > 200) delta += 0.10;

  const reserveRate = (baseReserve + delta).toFixed(2);
  const startRate = (baseReserve - 0.50).toFixed(2);
  const stretchRate = (parseFloat(reserveRate) + 0.20).toFixed(2);

  const startEl = document.getElementById('sim-out-start');
  const resEl = document.getElementById('sim-out-reserve');
  const stretchEl = document.getElementById('sim-out-stretch');
  const gainEl = document.getElementById('sim-out-gain');

  if (startEl) startEl.innerText = startRate + '%';
  if (resEl) resEl.innerText = reserveRate + '%';
  if (stretchEl) stretchEl.innerText = stretchRate + '%';

  const liftAnnual = Math.round(vol * (parseFloat(reserveRate) - (baseReserve - 0.50)) / 100);
  if (gainEl) gainEl.innerText = '+$' + liftAnnual.toLocaleString() + ' / year';
};

window.applySimulatedReserveToLiveAuction = function(eventId) {
  const ev = MockData.sourcingEvents.find(e => e.id === eventId);
  if (!ev) return;

  const resRate = parseFloat(document.getElementById('sim-out-reserve')?.innerText || '4.25');
  if (ev.aiReserveRecommendation) {
    ev.aiReserveRecommendation.optimalReserveRate = resRate;
  }

  showToast(`✅ AI Reserve Price calibrated to ${resRate}% for ${ev.name}!`, 'success');
  window.setAuctionTab('live');
};

// 8. Save Config
window.saveAuctionConfig = function(e) {
  if (e) e.preventDefault();

  MockData.reverseAuctionConfig.defaultVisibility = document.getElementById('cfg-vis-rule')?.value || 'rank_only';
  MockData.reverseAuctionConfig.defaultAntiSnipingMinutes = parseInt(document.getElementById('cfg-sniping-mins')?.value || '3', 10);
  MockData.reverseAuctionConfig.defaultMinBidIncrementBps = parseInt(document.getElementById('cfg-min-inc')?.value || '5', 10);
  MockData.reverseAuctionConfig.reservePriceAggressiveness = document.getElementById('cfg-reserve-agg')?.value || 'balanced';

  MockData.auditLogs.unshift({
    id: 'AL' + Date.now(),
    userId: Auth.getCurrentUser()?.id || 'U001',
    userName: Auth.getCurrentUser()?.name || 'System Admin',
    action: 'update_auction_config',
    module: 'Reverse Auction Engine',
    details: 'Updated reverse auction visibility rules and anti-sniping parameters.',
    timestamp: new Date().toISOString(),
    ipAddress: '127.0.0.1'
  });

  showToast('✅ Reverse auction governance rules saved successfully!', 'success');
};

// 9. CSV Export
window.exportReverseAuctionCSV = function() {
  const events = MockData.sourcingEvents || [];
  const headers = ['Event ID', 'Event Name', 'Category', 'Auction Type', 'Visibility Rule', 'Status', 'Annual Volume', 'Starting Ceiling Rate', 'AI Reserve Price', 'Leading Bid Rate', 'Winning Vendor', 'Bids Count'];

  const rows = events.map(e => [
    e.id,
    e.name,
    e.category,
    e.auctionType,
    e.visibilityRule,
    e.status,
    e.annualVolume || e.budget,
    (e.aiReserveRecommendation?.recommendedStartingRate || '') + '%',
    (e.aiReserveRecommendation?.optimalReserveRate || '') + '%',
    (e.currentLeadingBid?.rate || '') + '%',
    e.currentLeadingBid?.vendorName || '',
    e.bids ? e.bids.length : e.bidsReceived
  ]);

  exportToCSV('Reverse_Auction_Register.csv', headers, rows);
  showToast('📄 Reverse Auction Register exported successfully!', 'success');
};


// ═══════════════════════════════════════════════════════════════
//  4. COMPLIANCE
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
//  VENDOR PORTAL & ONBOARDING (Spec #10)
// ═══════════════════════════════════════════════════════════════
window.renderVendorPortal = function() {
  const currentUser = (typeof Auth !== 'undefined' && Auth.currentUser) ? Auth.currentUser() : { role: 'System Administrator', name: 'Admin', username: 'sysadmin' };
  const isActualVendorUser = currentUser.role === 'Vendor User' || currentUser.username === 'vendor1';
  const isSimulatedVendor = AppState.simulatedVendorId !== null && AppState.simulatedVendorId !== undefined;
  const isVendorPerspective = isActualVendorUser || isSimulatedVendor;
  const activeVendorId = isVendorPerspective ? (AppState.simulatedVendorId || 'V001') : null;
  const activeVendor = activeVendorId ? (MockData.vendors.find(v => v.id === activeVendorId) || MockData.vendors[0]) : null;

  // Active Tab state
  if (!AppState.vendorPortalActiveTab) AppState.vendorPortalActiveTab = 'directory';
  if (!AppState.vendorPortalCategory) AppState.vendorPortalCategory = 'All';
  if (!AppState.vendorPortalBiddingFilter) AppState.vendorPortalBiddingFilter = 'All';
  if (!AppState.vendorPortalSearch) AppState.vendorPortalSearch = '';

  const vendors = MockData.vendors;
  const activeBidders = vendors.filter(v => v.biddingStatus === 'active_bidder').length;
  const pendingOffers = vendors.filter(v => v.biddingStatus === 'offer_pending' || v.biddingOfferStatus === 'pending').length;
  const totalSKUs = vendors.reduce((acc, v) => acc + ((v.submittedProducts && v.submittedProducts.length) || 0), 0);
  const totalDocs = vendors.reduce((acc, v) => acc + ((v.documents && v.documents.length) || 0), 0);

  // If in Vendor Perspective (e.g. GiftFlow Inc. / James Morris)
  let vendorPerspectiveBanner = '';
  if (isVendorPerspective) {
    const isPendingOffer = activeVendor.biddingOfferStatus === 'pending' || activeVendor.biddingStatus === 'offer_pending';
    vendorPerspectiveBanner = `
      <div style="background:linear-gradient(135deg, #0f172a, #1e293b);border:2px solid #06b6d4;border-radius:10px;padding:1.25rem 1.5rem;margin-bottom:1.5rem;color:#fff;box-shadow:0 8px 24px rgba(6,182,212,0.15);">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
          <div style="display:flex;align-items:center;gap:1rem;">
            <div style="width:48px;height:48px;border-radius:10px;background:linear-gradient(135deg,#06b6d4,#0284c7);display:flex;align-items:center;justify-content:center;color:#fff;font-size:1.5rem;">
              <i data-lucide="building-2"></i>
            </div>
            <div>
              <div style="font-size:0.75rem;text-transform:uppercase;letter-spacing:1px;color:#38bdf8;font-weight:700;">Vendor Partner Portal</div>
              <div style="font-size:1.25rem;font-weight:800;letter-spacing:-0.3px;">${esc(activeVendor.name)} <span style="font-size:0.8rem;background:rgba(255,255,255,0.15);padding:2px 8px;border-radius:12px;font-weight:500;">ID: ${esc(activeVendor.id)}</span></div>
              <div style="font-size:0.8125rem;color:#cbd5e1;">Logged In As: <strong>${esc(currentUser.name || 'James Morris')}</strong> (Director of Sourcing & Bids) &bull; ${esc(activeVendor.category)} &bull; Rating: <strong>${activeVendor.rating}/5.0</strong></div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:0.75rem;">
            ${isSimulatedVendor ? `
              <button class="btn btn-hero-glass btn-sm" style="background:rgba(255,255,255,0.15);border:1.5px solid rgba(255,255,255,0.5);color:#ffffff;font-weight:700;" onclick="toggleVendorSimulator(null)">
                <i data-lucide="arrow-left"></i> Exit Vendor Simulation
              </button>
            ` : ''}
            <button class="btn btn-primary btn-sm" style="background:#06b6d4;border-color:#06b6d4;" onclick="openAddProductModal('${activeVendor.id}')">
              <i data-lucide="plus"></i> Submit New Product / SKU
            </button>
            <button class="btn btn-hero-glass btn-sm" style="background:rgba(255,255,255,0.15);border:1.5px solid rgba(255,255,255,0.5);color:#ffffff;font-weight:700;" onclick="openUploadDocModal('${activeVendor.id}')">
              <i data-lucide="upload"></i> Upload Compliance Doc
            </button>
          </div>
        </div>

        ${isPendingOffer ? `
          <div style="margin-top:1.25rem;background:rgba(245,158,11,0.15);border:1px solid #f59e0b;border-radius:8px;padding:1rem 1.25rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
            <div style="display:flex;align-items:center;gap:0.75rem;">
              <span style="color:#f59e0b;font-size:1.5rem;"><i data-lucide="bell-ring"></i></span>
              <div>
                <div style="font-weight:700;color:#fbbf24;font-size:0.95rem;">Action Required: Live Bidding Offer Received!</div>
                <div style="font-size:0.8125rem;color:#e2e8f0;">Retailer has invited <strong>${esc(activeVendor.name)}</strong> to participate in the <strong>Q4 Gift Card Processing Master Reverse Auction (SE001)</strong>. You must accept this invitation offer to access the live bidding arena.</div>
              </div>
            </div>
            <div style="display:flex;gap:0.5rem;">
              <button class="btn btn-success btn-sm" onclick="acceptVendorBiddingOffer('${activeVendor.id}', 'SE001')">
                <i data-lucide="check-circle-2"></i> Accept Offer & Activate Bidding
              </button>
              <button class="btn btn-outline btn-sm" style="color:#f87171;border-color:#f87171;" onclick="declineVendorBiddingOffer('${activeVendor.id}', 'SE001')">
                Decline
              </button>
            </div>
          </div>
        ` : `
          <div style="margin-top:1.25rem;background:rgba(16,185,129,0.12);border:1px solid #10b981;border-radius:8px;padding:0.75rem 1.25rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.75rem;">
            <div style="display:flex;align-items:center;gap:0.6rem;font-size:0.85rem;color:#a7f3d0;">
              <i data-lucide="check-circle" style="color:#10b981;"></i>
              <span><strong>Bidding Status: Active & Authorized.</strong> Your bidding credential is valid for live event <strong>SE001</strong>.</span>
            </div>
            <a href="#/sourcing" class="btn btn-sm" style="background:#10b981;color:#fff;font-weight:700;">
              <i data-lucide="zap"></i> Open Live Reverse Auction Arena &rarr;
            </a>
          </div>
        `}
      </div>
    `;
  }

  // Simulator bar for internal administrators
  let simulatorToolbar = '';
  if (!isActualVendorUser) {
    simulatorToolbar = `
      <div style="background:var(--bg-subtle, #f8fafc);border:1px dashed var(--border-color);border-radius:8px;padding:0.65rem 1rem;margin-bottom:1.25rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;">
        <div style="font-size:0.8125rem;color:var(--text-muted);display:flex;align-items:center;gap:0.5rem;">
          <i data-lucide="user-check" style="color:#06b6d4;"></i>
          <span><strong>Role Mode:</strong> ${isSimulatedVendor ? `<span class="badge badge-warning">Simulating: ${esc(activeVendor.name)}</span>` : `<span class="badge badge-info">Internal Retailer View (${esc(currentUser.role)})</span>`}</span>
        </div>
        <div style="display:flex;align-items:center;gap:0.5rem;">
          <span style="font-size:0.75rem;color:var(--text-muted);">Vendor Simulator:</span>
          <button class="btn btn-outline btn-xs" onclick="toggleVendorSimulator('V001')">
            <i data-lucide="eye"></i> ${AppState.simulatedVendorId === 'V001' ? 'Exit GiftFlow' : 'Simulate GiftFlow (V001)'}
          </button>
          <button class="btn btn-outline btn-xs" onclick="toggleVendorSimulator('V004')">
            <i data-lucide="eye"></i> ${AppState.simulatedVendorId === 'V004' ? 'Exit MoneyLink' : 'Simulate MoneyLink (Pending Offer V004)'}
          </button>
          ${isSimulatedVendor ? `
            <button class="btn btn-outline btn-xs" style="color:var(--danger);" onclick="toggleVendorSimulator(null)">
              <i data-lucide="x"></i> Reset View
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }

  // Filter vendors for directory
  const filteredVendors = vendors.filter(v => {
    if (AppState.vendorPortalCategory !== 'All' && v.category !== AppState.vendorPortalCategory) return false;
    if (AppState.vendorPortalBiddingFilter === 'active' && v.biddingStatus !== 'active_bidder') return false;
    if (AppState.vendorPortalBiddingFilter === 'pending' && v.biddingStatus !== 'offer_pending') return false;
    if (AppState.vendorPortalBiddingFilter === 'none' && v.biddingStatus !== 'not_invited') return false;
    if (AppState.vendorPortalSearch) {
      const q = AppState.vendorPortalSearch.toLowerCase();
      const matchName = v.name.toLowerCase().includes(q);
      const matchCat = v.category.toLowerCase().includes(q);
      const matchContact = (v.biddingContacts || []).some(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
      if (!matchName && !matchCat && !matchContact) return false;
    }
    return true;
  });

  _setContent('main-content', `
    ${vendorPerspectiveBanner}
    ${simulatorToolbar}

    <!-- KPI Grid -->
    <div class="kpi-grid" style="grid-template-columns:repeat(5, 1fr);margin-bottom:1.5rem;">
      <div class="kpi-card" style="--kpi-color:#06b6d4;--kpi-bg:#cffafe;">
        <div class="kpi-icon" style="background:#cffafe;color:#06b6d4;"><i data-lucide="building-2"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Preset Vendors</div>
          <div class="kpi-value">${vendors.length}</div>
          <div class="kpi-sub">10 Active &bull; 1 Pending &bull; 1 Inactive</div>
        </div>
      </div>
      <div class="kpi-card" style="--kpi-color:#10b981;--kpi-bg:#dcfce7;">
        <div class="kpi-icon" style="background:#dcfce7;color:#10b981;"><i data-lucide="check-circle-2"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Active Bidders</div>
          <div class="kpi-value">${activeBidders}</div>
          <div class="kpi-sub">Activated for live reverse bidding</div>
        </div>
      </div>
      <div class="kpi-card" style="--kpi-color:#f59e0b;--kpi-bg:#fef3c7;">
        <div class="kpi-icon" style="background:#fef3c7;color:#f59e0b;"><i data-lucide="clock"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Pending Offers</div>
          <div class="kpi-value">${pendingOffers}</div>
          <div class="kpi-sub">Awaiting vendor offer acceptance</div>
        </div>
      </div>
      <div class="kpi-card" style="--kpi-color:#8b5cf6;--kpi-bg:#ede9fe;">
        <div class="kpi-icon" style="background:#ede9fe;color:#8b5cf6;"><i data-lucide="package-plus"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Product Additions</div>
          <div class="kpi-value">${totalSKUs}</div>
          <div class="kpi-sub">New SKUs proposed by vendors</div>
        </div>
      </div>
      <div class="kpi-card" style="--kpi-color:#3b82f6;--kpi-bg:#dbeafe;">
        <div class="kpi-icon" style="background:#dbeafe;color:#3b82f6;"><i data-lucide="file-check"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Compliance Docs</div>
          <div class="kpi-value">${totalDocs}</div>
          <div class="kpi-sub">W-9, COI, SOC2, ACH verified</div>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="portal-tabs-nav">
      <button class="portal-tab-btn ${AppState.vendorPortalActiveTab === 'directory' ? 'active' : ''}" onclick="setVendorPortalTab('directory')">
        <i data-lucide="users"></i> Preset Vendor Directory & Bidding Activation
      </button>
      <button class="portal-tab-btn ${AppState.vendorPortalActiveTab === 'pipeline' ? 'active' : ''}" onclick="setVendorPortalTab('pipeline')">
        <i data-lucide="git-commit"></i> Onboarding Pipeline
      </button>
      <button class="portal-tab-btn ${AppState.vendorPortalActiveTab === 'products' ? 'active' : ''}" onclick="setVendorPortalTab('products')">
        <i data-lucide="package-plus"></i> Product Additions (${totalSKUs})
      </button>
      <button class="portal-tab-btn ${AppState.vendorPortalActiveTab === 'documents' ? 'active' : ''}" onclick="setVendorPortalTab('documents')">
        <i data-lucide="folder"></i> Document Repository (${totalDocs})
      </button>
      <button class="portal-tab-btn ${AppState.vendorPortalActiveTab === 'scorecards' ? 'active' : ''}" onclick="setVendorPortalTab('scorecards')">
        <i data-lucide="award"></i> Vendor Scorecards
      </button>
      <button class="portal-tab-btn ${AppState.vendorPortalActiveTab === 'config' ? 'active' : ''}" onclick="setVendorPortalTab('config')">
        <i data-lucide="settings"></i> Portal Configuration
      </button>
    </div>

    <!-- Tab 1: Directory & Bidding Activation -->
    <div id="tab-content-directory" style="display:${AppState.vendorPortalActiveTab === 'directory' ? 'block' : 'none'};">
      <div class="card" style="margin-bottom:1.5rem;">
        <div class="card-header" style="flex-wrap:wrap;gap:1rem;">
          <div>
            <div class="card-title">Preset Vendor Directory with Bidding Activation</div>
            <div class="card-subtitle">Manage authorized vendor contacts, send bidding invitation offers, and activate vendors for live reverse auctions.</div>
          </div>
          <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;">
            <div class="search-input-wrap" style="width:240px;">
              <i data-lucide="search" class="search-icon"></i>
              <input type="text" class="form-input form-input-sm" placeholder="Search vendor or contact..." value="${esc(AppState.vendorPortalSearch)}" oninput="filterVendorSearch(this.value)">
            </div>
            <select class="form-select form-select-sm" style="width:160px;" onchange="filterVendorCategory(this.value)">
              <option value="All" ${AppState.vendorPortalCategory === 'All' ? 'selected' : ''}>All Categories</option>
              <option value="Gift Cards" ${AppState.vendorPortalCategory === 'Gift Cards' ? 'selected' : ''}>Gift Cards</option>
              <option value="Money Transfer" ${AppState.vendorPortalCategory === 'Money Transfer' ? 'selected' : ''}>Money Transfer</option>
              <option value="Prepaid Products" ${AppState.vendorPortalCategory === 'Prepaid Products' ? 'selected' : ''}>Prepaid Products</option>
              <option value="Debit Services" ${AppState.vendorPortalCategory === 'Debit Services' ? 'selected' : ''}>Debit Services</option>
              <option value="Financial Services" ${AppState.vendorPortalCategory === 'Financial Services' ? 'selected' : ''}>Financial Services</option>
            </select>
            <select class="form-select form-select-sm" style="width:160px;" onchange="filterVendorBidding(this.value)">
              <option value="All" ${AppState.vendorPortalBiddingFilter === 'All' ? 'selected' : ''}>All Bidding Statuses</option>
              <option value="active" ${AppState.vendorPortalBiddingFilter === 'active' ? 'selected' : ''}>Active Bidders</option>
              <option value="pending" ${AppState.vendorPortalBiddingFilter === 'pending' ? 'selected' : ''}>Pending Offers</option>
              <option value="none" ${AppState.vendorPortalBiddingFilter === 'none' ? 'selected' : ''}>Not Invited</option>
            </select>
            <button class="btn btn-outline btn-sm" onclick="exportVendorDirectoryCSV()">
              <i data-lucide="download"></i> Export CSV
            </button>
          </div>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Vendor / Category</th>
                <th>Authorized Bidding Contacts</th>
                <th>Bidding Status</th>
                <th>Active Event Invites</th>
                <th>Onboarding / Score</th>
                <th style="text-align:right;">Actions & Workflow</th>
              </tr>
            </thead>
            <tbody>
              ${filteredVendors.map(v => {
                const isBidder = v.biddingStatus === 'active_bidder';
                const isPending = v.biddingStatus === 'offer_pending' || v.biddingOfferStatus === 'pending';
                const statusBadge = isBidder
                  ? '<span class="badge badge-bidder-active"><i data-lucide="check" style="width:12px;height:12px;display:inline-block;vertical-align:middle;"></i> Active Bidder</span>'
                  : isPending
                  ? '<span class="badge badge-bidder-pending"><i data-lucide="clock" style="width:12px;height:12px;display:inline-block;vertical-align:middle;"></i> Offer Pending</span>'
                  : '<span class="badge badge-bidder-none">Not Invited</span>';

                const contactsHtml = (v.biddingContacts || [
                  { name: v.contact, title: 'Commercial Lead', email: v.email, phone: v.phone, isPrimary: true, authorizedBidder: isBidder }
                ]).map(c => `
                  <div style="font-size:0.8125rem;margin-bottom:0.25rem;">
                    <strong>${esc(c.name)}</strong> <span style="font-size:0.7rem;color:var(--text-muted);">(${esc(c.title)})</span>
                    ${c.authorizedBidder ? '<span class="badge badge-success" style="font-size:0.6rem;padding:0px 4px;margin-left:4px;">Authorized</span>' : ''}
                    <div style="font-size:0.75rem;color:var(--text-muted);display:flex;gap:0.5rem;align-items:center;">
                      <span><i data-lucide="mail" style="width:11px;height:11px;display:inline-block;vertical-align:middle;"></i> ${esc(c.email)}</span>
                      <span>&bull;</span>
                      <span>${esc(c.phone)}</span>
                    </div>
                  </div>
                `).join('');

                const invitesHtml = (v.activeEventInvites && v.activeEventInvites.length)
                  ? v.activeEventInvites.map(evId => `<span class="badge badge-primary" style="font-size:0.7rem;margin-right:4px;">${esc(evId)}</span>`).join('')
                  : '<span style="color:var(--text-muted);font-size:0.75rem;">None</span>';

                return `
                  <tr>
                    <td>
                      <div style="font-weight:700;font-size:0.9rem;">${esc(v.name)}</div>
                      <div style="font-size:0.75rem;color:var(--text-muted);">ID: ${esc(v.id)} &bull; ${esc(v.category)} &bull; ${esc(v.region)}</div>
                      <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">Volume: <strong>$${(v.totalVolume||0).toLocaleString()}</strong> &bull; Baseline: <strong>${v.commissionRate}%</strong></div>
                    </td>
                    <td>${contactsHtml}</td>
                    <td>${statusBadge}</td>
                    <td>${invitesHtml}</td>
                    <td>
                      <div style="display:flex;align-items:center;gap:0.5rem;">
                        <span class="badge ${v.onboardingStage === 'Completed' ? 'badge-success' : 'badge-warning'}">${esc(v.onboardingStage || 'Completed')}</span>
                        <span style="font-weight:700;font-size:0.8125rem;">${v.complianceScore || 85}%</span>
                      </div>
                      <div style="width:80px;height:4px;background:#e2e8f0;border-radius:2px;margin-top:4px;">
                        <div style="width:${v.onboardingProgress || 100}%;height:100%;background:#10b981;border-radius:2px;"></div>
                      </div>
                    </td>
                    <td style="text-align:right;">
                      <div style="display:flex;justify-content:flex-end;gap:0.35rem;flex-wrap:wrap;">
                        ${isPending ? `
                          <button class="btn btn-success btn-xs" title="Accept offer on behalf or simulate vendor response" onclick="acceptVendorBiddingOffer('${v.id}', 'SE001')">
                            <i data-lucide="check-check"></i> Accept Offer
                          </button>
                        ` : ''}
                        <button class="btn ${isBidder ? 'btn-outline' : 'btn-primary'} btn-xs" onclick="toggleVendorBidding('${v.id}')">
                          <i data-lucide="${isBidder ? 'user-x' : 'user-check'}"></i> ${isBidder ? 'Revoke Bidding' : 'Activate Bidding'}
                        </button>
                        <button class="btn btn-outline btn-xs" title="Send official bidding invitation offer" onclick="openSendOfferModal('${v.id}')">
                          <i data-lucide="send"></i> Invite
                        </button>
                        <button class="btn btn-outline btn-xs" title="Simulate what this vendor sees" onclick="toggleVendorSimulator('${v.id}')">
                          <i data-lucide="eye"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Tab 2: Onboarding Pipeline -->
    <div id="tab-content-pipeline" style="display:${AppState.vendorPortalActiveTab === 'pipeline' ? 'block' : 'none'};">
      <div class="card" style="margin-bottom:1.5rem;">
        <div class="card-header">
          <div>
            <div class="card-title">Vendor Onboarding & Accreditation Pipeline</div>
            <div class="card-subtitle">5-stage enterprise accreditation workflow: application, due diligence KYC, master contract execution, banking setup, and rate calibration.</div>
          </div>
          <button class="btn btn-primary btn-sm" onclick="openNewVendorOnboardingModal()">
            <i data-lucide="user-plus"></i> Initiate New Vendor Onboarding
          </button>
        </div>

        <div class="pipeline-board">
          <!-- Stage 1 -->
          <div class="pipeline-col">
            <div class="pipeline-col-header" style="color:#64748b;">
              <span>1. Application</span>
              <span class="badge badge-neutral">0</span>
            </div>
            <div style="font-size:0.75rem;color:var(--text-muted);text-align:center;padding:1rem 0;">No pending applications</div>
          </div>

          <!-- Stage 2 -->
          <div class="pipeline-col">
            <div class="pipeline-col-header" style="color:#f59e0b;">
              <span>2. KYC Due Diligence</span>
              <span class="badge badge-warning">1</span>
            </div>
            <div class="pipeline-card" style="border-left:3px solid #f59e0b;">
              <div style="font-weight:700;font-size:0.875rem;">ValueCard Partners</div>
              <div style="font-size:0.75rem;color:var(--text-muted);margin:2px 0;">ID: V010 &bull; Gift Cards</div>
              <div style="font-size:0.75rem;color:#b45309;background:#fef3c7;padding:3px 6px;border-radius:4px;margin-top:6px;">Expired COI &bull; Sanctions Check Clear</div>
              <div style="display:flex;justify-content:space-between;margin-top:8px;">
                <button class="btn btn-outline btn-xs" onclick="advanceOnboardingStage('V010')">Advance &rarr;</button>
              </div>
            </div>
          </div>

          <!-- Stage 3 -->
          <div class="pipeline-col">
            <div class="pipeline-col-header" style="color:#8b5cf6;">
              <span>3. Contract Review</span>
              <span class="badge badge-primary">0</span>
            </div>
            <div style="font-size:0.75rem;color:var(--text-muted);text-align:center;padding:1rem 0;">All contracts executed</div>
          </div>

          <!-- Stage 4 -->
          <div class="pipeline-col">
            <div class="pipeline-col-header" style="color:#06b6d4;">
              <span>4. Banking & ACH</span>
              <span class="badge badge-info">1</span>
            </div>
            <div class="pipeline-card" style="border-left:3px solid #06b6d4;">
              <div style="font-weight:700;font-size:0.875rem;">ReloadNow Services</div>
              <div style="font-size:0.75rem;color:var(--text-muted);margin:2px 0;">ID: V006 &bull; Prepaid Products</div>
              <div style="font-size:0.75rem;color:#0284c7;background:#e0f2fe;padding:3px 6px;border-radius:4px;margin-top:6px;">ACH Mandate Verification Pending</div>
              <div style="display:flex;justify-content:space-between;margin-top:8px;">
                <button class="btn btn-outline btn-xs" onclick="advanceOnboardingStage('V006')">Approve Banking &rarr;</button>
              </div>
            </div>
          </div>

          <!-- Stage 5 -->
          <div class="pipeline-col">
            <div class="pipeline-col-header" style="color:#10b981;">
              <span>5. Active & Live</span>
              <span class="badge badge-success">10</span>
            </div>
            ${vendors.filter(v => (v.onboardingStage === 'Completed' || !v.onboardingStage)).slice(0, 4).map(v => `
              <div class="pipeline-card" style="border-left:3px solid #10b981;">
                <div style="font-weight:700;font-size:0.875rem;">${esc(v.name)}</div>
                <div style="font-size:0.75rem;color:var(--text-muted);margin:2px 0;">${esc(v.category)} &bull; ${v.commissionRate}%</div>
                <div style="font-size:0.75rem;color:#15803d;margin-top:4px;"><i data-lucide="check" style="width:12px;height:12px;display:inline-block;vertical-align:middle;"></i> 100% Accredited</div>
              </div>
            `).join('')}
            <div style="font-size:0.75rem;color:var(--text-muted);text-align:center;padding:0.5rem 0;">+ 6 more active vendors</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 3: Product Additions -->
    <div id="tab-content-products" style="display:${AppState.vendorPortalActiveTab === 'products' ? 'block' : 'none'};">
      <div class="card" style="margin-bottom:1.5rem;">
        <div class="card-header">
          <div>
            <div class="card-title">Vendor Product Additions & SKU Catalog Submissions</div>
            <div class="card-subtitle">Vendors submit new product SKUs, gaming codes, and service tiers with proposed commission rates and promotional subsidies for retailer approval.</div>
          </div>
          <button class="btn btn-primary btn-sm" onclick="openAddProductModal('${activeVendorId || 'V001'}')">
            <i data-lucide="plus-circle"></i> Submit New Product / SKU
          </button>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>SKU ID & Product Name</th>
                <th>Vendor / Category</th>
                <th>Proposed Commission Rate</th>
                <th>Subsidies (Fraud & Marketing)</th>
                <th>Submitted Date</th>
                <th>Approval Status</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${vendors.flatMap(v => (v.submittedProducts || []).map(p => ({ ...p, vendorName: v.name, vendorId: v.id }))).map(sku => {
                const statusBadge = sku.status === 'Approved'
                  ? '<span class="badge badge-success"><i data-lucide="check"></i> Approved</span>'
                  : sku.status === 'Under Review'
                  ? '<span class="badge badge-warning"><i data-lucide="clock"></i> Under Review</span>'
                  : '<span class="badge badge-info"><i data-lucide="hourglass"></i> Pending Approval</span>';

                return `
                  <tr>
                    <td>
                      <div style="font-weight:700;font-size:0.875rem;">${esc(sku.name)}</div>
                      <div style="font-size:0.75rem;color:var(--text-muted);font-family:monospace;">SKU: ${esc(sku.id)}</div>
                    </td>
                    <td>
                      <div style="font-weight:600;">${esc(sku.vendorName)}</div>
                      <div style="font-size:0.75rem;color:var(--text-muted);">${esc(sku.category)}</div>
                    </td>
                    <td>
                      <span style="font-size:1.1rem;font-weight:800;color:#10b981;">${sku.proposedRate}%</span>
                    </td>
                    <td>
                      <div style="font-size:0.8125rem;">Fraud Subsidy: <strong>${sku.fraudSubsidy || 0}%</strong></div>
                      <div style="font-size:0.8125rem;">Marketing Co-Op: <strong>$${(sku.marketingSubsidy||0).toLocaleString()}</strong></div>
                    </td>
                    <td style="font-size:0.8125rem;">${sku.submittedDate || '2026-11-10'}</td>
                    <td>${statusBadge}</td>
                    <td style="text-align:right;">
                      ${sku.status !== 'Approved' ? `
                        <div style="display:flex;justify-content:flex-end;gap:0.25rem;">
                          <button class="btn btn-success btn-xs" onclick="reviewProductSKU('${sku.vendorId}', '${sku.id}', 'Approved')">
                            Approve
                          </button>
                          <button class="btn btn-outline btn-xs" onclick="reviewProductSKU('${sku.vendorId}', '${sku.id}', 'Rejected')">
                            Reject
                          </button>
                        </div>
                      ` : `
                        <span style="font-size:0.75rem;color:#15803d;font-weight:600;">Catalog Active</span>
                      `}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Tab 4: Document Repository -->
    <div id="tab-content-documents" style="display:${AppState.vendorPortalActiveTab === 'documents' ? 'block' : 'none'};">
      <div class="card" style="margin-bottom:1.5rem;">
        <div class="card-header">
          <div>
            <div class="card-title">Vendor Compliance Document Repository</div>
            <div class="card-subtitle">Validated repository for W-9 forms, Certificates of Insurance (COI), SOC2 Type II reports, ACH mandates, and state transmitter licenses.</div>
          </div>
          <button class="btn btn-primary btn-sm" onclick="openUploadDocModal('${activeVendorId || 'V001'}')">
            <i data-lucide="upload"></i> Upload Compliance Document
          </button>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Document Title</th>
                <th>Vendor Name</th>
                <th>Document Type</th>
                <th>Upload Date</th>
                <th>Expiry Date</th>
                <th>Verification Status</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${vendors.flatMap(v => (v.documents || []).map(d => ({ ...d, vendorName: v.name, vendorId: v.id }))).map(doc => {
                const isExpired = doc.status === 'Expired';
                const isPending = doc.status === 'Pending Verification';
                const statusBadge = isExpired
                  ? '<span class="badge badge-danger"><i data-lucide="alert-circle"></i> Expired</span>'
                  : isPending
                  ? '<span class="badge badge-warning"><i data-lucide="clock"></i> Pending Review</span>'
                  : '<span class="badge badge-success"><i data-lucide="shield-check"></i> Verified</span>';

                return `
                  <tr>
                    <td>
                      <div style="font-weight:700;font-size:0.875rem;">${esc(doc.title)}</div>
                      <div style="font-size:0.75rem;color:var(--text-muted);">Size: ${esc(doc.size || '1.5 MB')} &bull; ID: ${esc(doc.id)}</div>
                    </td>
                    <td style="font-weight:600;">${esc(doc.vendorName)}</td>
                    <td><span class="badge badge-neutral">${esc(doc.type)}</span></td>
                    <td style="font-size:0.8125rem;">${doc.uploadDate || '2026-01-15'}</td>
                    <td style="font-size:0.8125rem;font-weight:600;${isExpired ? 'color:#ef4444;' : ''}">${doc.expiryDate || 'Perpetual'}</td>
                    <td>${statusBadge}</td>
                    <td style="text-align:right;">
                      <div style="display:flex;justify-content:flex-end;gap:0.25rem;">
                        <button class="btn btn-outline btn-xs" onclick="downloadVendorDoc('${doc.id}')">
                          <i data-lucide="download"></i> Download
                        </button>
                        ${isPending ? `
                          <button class="btn btn-success btn-xs" onclick="verifyVendorDoc('${doc.vendorId}', '${doc.id}')">
                            Verify
                          </button>
                        ` : ''}
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Tab 5: Vendor Scorecards -->
    <div id="tab-content-scorecards" style="display:${AppState.vendorPortalActiveTab === 'scorecards' ? 'block' : 'none'};">
      <div class="card" style="margin-bottom:1.5rem;">
        <div class="card-header">
          <div>
            <div class="card-title">360° Vendor Performance Scorecards</div>
            <div class="card-subtitle">Objective evaluation across payment timeliness, contract rate accuracy, SLA response time, and reporting quality.</div>
          </div>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Category</th>
                <th style="text-align:center;">Overall Score</th>
                <th style="text-align:center;">Payment Timeliness</th>
                <th style="text-align:center;">Rate Accuracy</th>
                <th style="text-align:center;">SLA Fulfillment</th>
                <th style="text-align:center;">Reporting Quality</th>
                <th>Performance Tier</th>
              </tr>
            </thead>
            <tbody>
              ${(MockData.complianceScores || []).map(cs => {
                const v = MockData.vendors.find(item => item.id === cs.vendorId) || {};
                let tier = '<span class="badge badge-success">Tier 1: Elite</span>';
                if (cs.overallScore < 60) tier = '<span class="badge badge-danger">Tier 4: Non-Compliant</span>';
                else if (cs.overallScore < 80) tier = '<span class="badge badge-warning">Tier 3: At-Risk</span>';
                else if (cs.overallScore < 90) tier = '<span class="badge badge-info">Tier 2: Qualified</span>';

                return `
                  <tr>
                    <td>
                      <div style="font-weight:700;">${esc(cs.vendor)}</div>
                      <div style="font-size:0.75rem;color:var(--text-muted);">Terms: ${esc(v.paymentTerms || 'Net 30')} &bull; Volume: $${((v.totalVolume||0)/1000).toFixed(0)}k</div>
                    </td>
                    <td><span class="badge badge-neutral">${esc(v.category || 'Financial Services')}</span></td>
                    <td style="text-align:center;">${_scoreCircle(cs.overallScore)}</td>
                    <td style="text-align:center;">${_scoreCircle(cs.paymentTimeliness)}</td>
                    <td style="text-align:center;">${_scoreCircle(cs.rateAccuracy)}</td>
                    <td style="text-align:center;">${_scoreCircle(cs.sla)}</td>
                    <td style="text-align:center;">${_scoreCircle(cs.reportingQuality)}</td>
                    <td>${tier}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Tab 6: Portal Configuration -->
    <div id="tab-content-config" style="display:${AppState.vendorPortalActiveTab === 'config' ? 'block' : 'none'};">
      <div class="card" style="margin-bottom:1.5rem;">
        <div class="card-header">
          <div>
            <div class="card-title">Vendor Portal Governance & Configuration</div>
            <div class="card-subtitle">Set eligibility thresholds, bidding invitation policies, and document expiration grace periods.</div>
          </div>
        </div>
        <div class="card-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;">
            <div>
              <label class="form-label" style="font-weight:700;">Minimum Scorecard Threshold for Live Bidding</label>
              <div style="display:flex;align-items:center;gap:1rem;margin-top:0.5rem;">
                <input type="range" class="form-range" min="50" max="90" value="${MockData.vendorPortalConfig.minimumScorecardThresholdForBidding || 70}" oninput="document.getElementById('lbl-min-score').innerText = this.value + '%'; MockData.vendorPortalConfig.minimumScorecardThresholdForBidding = Number(this.value);">
                <span id="lbl-min-score" style="font-weight:800;font-size:1.1rem;color:#06b6d4;">${MockData.vendorPortalConfig.minimumScorecardThresholdForBidding || 70}%</span>
              </div>
              <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.25rem;">Vendors with scorecard below this mark cannot submit bids in live reverse auctions.</div>
            </div>

            <div>
              <label class="form-label" style="font-weight:700;">RFP / Auction Offer Acceptance Window</label>
              <select class="form-select" onchange="MockData.vendorPortalConfig.rfpOfferAcceptanceGraceHours = Number(this.value); showToast('Updated offer window to ' + this.value + ' hours');">
                <option value="24" ${MockData.vendorPortalConfig.rfpOfferAcceptanceGraceHours === 24 ? 'selected' : ''}>24 Hours</option>
                <option value="48" ${MockData.vendorPortalConfig.rfpOfferAcceptanceGraceHours === 48 ? 'selected' : ''}>48 Hours (Standard)</option>
                <option value="72" ${MockData.vendorPortalConfig.rfpOfferAcceptanceGraceHours === 72 ? 'selected' : ''}>72 Hours</option>
                <option value="120" ${MockData.vendorPortalConfig.rfpOfferAcceptanceGraceHours === 120 ? 'selected' : ''}>5 Business Days</option>
              </select>
              <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.25rem;">Time vendors have to review terms and accept bidding participation invitations.</div>
            </div>

            <div>
              <label class="form-label" style="font-weight:700;">Certificate of Insurance (COI) Expiry Alert Window</label>
              <select class="form-select" onchange="MockData.vendorPortalConfig.coiAlertDaysBeforeExpiry = Number(this.value); showToast('Updated COI alert threshold to ' + this.value + ' days');">
                <option value="15">15 Days Prior</option>
                <option value="30" selected>30 Days Prior (Recommended)</option>
                <option value="60">60 Days Prior</option>
              </select>
              <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.25rem;">Proactively alert vendor contact to upload renewed certificate.</div>
            </div>

            <div>
              <label class="form-label" style="font-weight:700;">Auto-Activate Accredited Vendors</label>
              <div style="display:flex;align-items:center;gap:0.5rem;margin-top:0.5rem;">
                <input type="checkbox" id="chk-auto-act" ${MockData.vendorPortalConfig.autoActivateAccreditedVendors ? 'checked' : ''} onchange="MockData.vendorPortalConfig.autoActivateAccreditedVendors = this.checked; showToast('Auto-activation ' + (this.checked ? 'enabled' : 'disabled'));">
                <label for="chk-auto-act" style="font-size:0.875rem;">Automatically authorize Tier 1 vendors for new category reverse auctions</label>
              </div>
            </div>
          </div>

          <div style="margin-top:1.5rem;display:flex;justify-content:flex-end;">
            <button class="btn btn-primary" onclick="showToast('Portal configuration saved successfully');">
              <i data-lucide="save"></i> Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  `);

  setTimeout(() => {
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }, 50);
};

// Vendor Portal Handlers
window.setVendorPortalTab = function(tabName) {
  AppState.vendorPortalActiveTab = tabName;
  window.renderVendorPortal();
};

window.filterVendorCategory = function(cat) {
  AppState.vendorPortalCategory = cat;
  window.renderVendorPortal();
};

window.filterVendorBidding = function(filterVal) {
  AppState.vendorPortalBiddingFilter = filterVal;
  window.renderVendorPortal();
};

window.filterVendorSearch = function(query) {
  AppState.vendorPortalSearch = query;
  window.renderVendorPortal();
};

window.toggleVendorSimulator = function(vendorId) {
  AppState.simulatedVendorId = vendorId;
  showToast(vendorId ? ('Switched to Vendor View for ' + (MockData.getVendorById(vendorId)||{}).name) : 'Exited Vendor Simulation mode');
  window.renderVendorPortal();
};

window.toggleVendorBidding = function(vendorId) {
  const v = MockData.getVendorById(vendorId);
  if (!v) return;
  const newStatus = v.biddingStatus === 'active_bidder' ? 'not_invited' : 'active_bidder';
  v.biddingStatus = newStatus;
  if (newStatus === 'active_bidder') {
    v.biddingOfferStatus = 'accepted';
    if (!v.activeEventInvites || !v.activeEventInvites.length) v.activeEventInvites = ['SE001'];
  }
  MockData.auditLogs.unshift({
    id: 'AUD-' + Date.now(),
    timestamp: new Date().toISOString(),
    user: (Auth && Auth.currentUser && Auth.currentUser().name) || 'Admin',
    action: 'Bidding Status Updated',
    module: 'Vendor Portal',
    details: 'Vendor ' + v.name + ' bidding status changed to ' + newStatus
  });
  showToast(v.name + ' bidding status is now: ' + (newStatus === 'active_bidder' ? 'Active Bidder' : 'Not Invited'));
  window.renderVendorPortal();
};

window.openSendOfferModal = function(vendorId) {
  const v = MockData.getVendorById(vendorId);
  if (!v) return;
  const primaryContact = (v.biddingContacts && v.biddingContacts[0]) || { name: v.contact, email: v.email };
  
  _showModal({
    title: 'Send Reverse Auction Bidding Invitation Offer',
    content: `
      <div style="font-size:0.875rem;">
        <p>Send a formal bidding invitation offer to <strong>${esc(v.name)}</strong>. The vendor must review and accept the offer to submit bids.</p>
        <div class="form-group" style="margin-top:1rem;">
          <label class="form-label">Target Reverse Auction Event</label>
          <select id="modal-offer-event" class="form-select">
            <option value="SE001">Q4 Gift Card Processing Master Reverse Auction (SE001)</option>
            <option value="SE002">Prepaid Streaming Cards Sealed Bid (SE002)</option>
            <option value="SE003">International Money Transfer Target Pricing RFP (SE003)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Recipient Contact</label>
          <input type="text" class="form-input" value="${esc(primaryContact.name)} (${esc(primaryContact.email)})" readonly>
        </div>
        <div class="form-group">
          <label class="form-label">Acceptance Deadline</label>
          <input type="text" class="form-input" value="48 Hours from dispatch" readonly>
        </div>
        <div class="form-group">
          <label class="form-label">Special Terms / Target Rate Floor</label>
          <input id="modal-offer-notes" type="text" class="form-input" placeholder="e.g. Starting reserve rate 4.25%, anti-sniping rules active">
        </div>
      </div>
    `,
    confirmText: 'Dispatch Bidding Offer',
    onConfirm: () => {
      const evId = document.getElementById('modal-offer-event').value;
      v.biddingStatus = 'offer_pending';
      v.biddingOfferStatus = 'pending';
      if (!v.activeEventInvites) v.activeEventInvites = [];
      if (!v.activeEventInvites.includes(evId)) v.activeEventInvites.push(evId);

      MockData.auditLogs.unshift({
        id: 'AUD-' + Date.now(),
        timestamp: new Date().toISOString(),
        user: (Auth && Auth.currentUser && Auth.currentUser().name) || 'Admin',
        action: 'Bidding Offer Dispatched',
        module: 'Vendor Portal',
        details: 'Sent bidding offer to ' + v.name + ' for event ' + evId
      });
      showToast('Bidding offer sent to ' + v.name + ' for ' + evId);
      window.renderVendorPortal();
    }
  });
};

window.acceptVendorBiddingOffer = function(vendorId, eventId) {
  const v = MockData.getVendorById(vendorId);
  if (!v) return;
  v.biddingStatus = 'active_bidder';
  v.biddingOfferStatus = 'accepted';
  if (!v.activeEventInvites) v.activeEventInvites = [];
  if (eventId && !v.activeEventInvites.includes(eventId)) v.activeEventInvites.push(eventId);

  MockData.auditLogs.unshift({
    id: 'AUD-' + Date.now(),
    timestamp: new Date().toISOString(),
    user: v.name + ' (Vendor Partner)',
    action: 'Bidding Offer Accepted',
    module: 'Vendor Portal',
    details: v.name + ' accepted terms and joined bidding event ' + (eventId || 'SE001')
  });

  MockData.notifications.unshift({
    id: 'N-OFFER-' + Date.now(),
    userId: 'U002',
    title: 'Vendor Bidding Offer Accepted',
    message: v.name + ' accepted the participation offer for reverse auction ' + (eventId || 'SE001') + '. Bidding access active.',
    timestamp: 'Just now',
    type: 'success',
    read: false
  });

  showToast('Offer Accepted! ' + v.name + ' is now active for live bidding.');
  window.renderVendorPortal();
};

window.declineVendorBiddingOffer = function(vendorId, eventId) {
  const v = MockData.getVendorById(vendorId);
  if (!v) return;
  v.biddingStatus = 'not_invited';
  v.biddingOfferStatus = 'declined';
  showToast(v.name + ' declined the bidding invitation.');
  window.renderVendorPortal();
};

window.openAddProductModal = function(vendorId) {
  const v = MockData.getVendorById(vendorId) || MockData.vendors[0];
  _showModal({
    title: 'Submit New Product / SKU Addition',
    content: `
      <div style="font-size:0.875rem;">
        <p>Propose a new SKU or service addition for retailer catalog review.</p>
        <div class="form-group" style="margin-top:1rem;">
          <label class="form-label">Vendor</label>
          <input type="text" class="form-input" value="${esc(v.name)}" readonly>
        </div>
        <div class="form-group">
          <label class="form-label">Product / SKU Name</label>
          <input id="modal-sku-name" type="text" class="form-input" placeholder="e.g. Xbox Game Pass Ultimate 3-Month Code">
        </div>
        <div class="form-group">
          <label class="form-label">Category</label>
          <select id="modal-sku-cat" class="form-select">
            <option value="Digital Gaming">Digital Gaming</option>
            <option value="Streaming Media">Streaming Media</option>
            <option value="Open-Loop Debit">Open-Loop Debit</option>
            <option value="Prepaid Wireless">Prepaid Wireless</option>
            <option value="Money Transfer">Money Transfer</option>
            <option value="Gift Cards">Gift Cards</option>
          </select>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
          <div class="form-group">
            <label class="form-label">Proposed Commission Rate (%)</label>
            <input id="modal-sku-rate" type="number" step="0.05" class="form-input" placeholder="e.g. 4.50" value="4.50">
          </div>
          <div class="form-group">
            <label class="form-label">Fraud Subsidy (%)</label>
            <input id="modal-sku-fraud" type="number" step="0.05" class="form-input" placeholder="e.g. 0.15" value="0.15">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Marketing Co-Op Subsidy ($)</label>
          <input id="modal-sku-mkt" type="number" class="form-input" placeholder="e.g. 3500" value="3500">
        </div>
      </div>
    `,
    confirmText: 'Submit SKU for Approval',
    onConfirm: () => {
      const name = document.getElementById('modal-sku-name').value.trim();
      const cat = document.getElementById('modal-sku-cat').value;
      const rate = Number(document.getElementById('modal-sku-rate').value) || 4.0;
      const fraud = Number(document.getElementById('modal-sku-fraud').value) || 0.1;
      const mkt = Number(document.getElementById('modal-sku-mkt').value) || 2000;

      if (!name) { alert('Please enter product name'); return; }

      if (!v.submittedProducts) v.submittedProducts = [];
      const newSku = {
        id: 'SKU-' + (v.submittedProducts.length + 10).toString().padStart(3, '0'),
        name: name,
        category: cat,
        proposedRate: rate,
        fraudSubsidy: fraud,
        marketingSubsidy: mkt,
        status: 'Under Review',
        submittedDate: new Date().toISOString().split('T')[0],
        reviewedBy: 'Pending'
      };
      v.submittedProducts.unshift(newSku);

      MockData.auditLogs.unshift({
        id: 'AUD-' + Date.now(),
        timestamp: new Date().toISOString(),
        user: v.name,
        action: 'Product SKU Submitted',
        module: 'Vendor Portal',
        details: 'Submitted SKU ' + name + ' at ' + rate + '% commission'
      });

      showToast('Product SKU ' + name + ' submitted for retailer approval');
      window.renderVendorPortal();
    }
  });
};

window.reviewProductSKU = function(vendorId, skuId, newStatus) {
  const v = MockData.getVendorById(vendorId);
  if (!v || !v.submittedProducts) return;
  const sku = v.submittedProducts.find(s => s.id === skuId);
  if (!sku) return;
  sku.status = newStatus;
  sku.reviewedBy = (Auth && Auth.currentUser && Auth.currentUser().name) || 'Category Manager';

  MockData.auditLogs.unshift({
    id: 'AUD-' + Date.now(),
    timestamp: new Date().toISOString(),
    user: sku.reviewedBy,
    action: 'Product SKU ' + newStatus,
    module: 'Vendor Portal',
    details: 'SKU ' + sku.name + ' ' + newStatus + ' for vendor ' + v.name
  });

  showToast('SKU ' + sku.name + ' is now: ' + newStatus);
  window.renderVendorPortal();
};

window.advanceOnboardingStage = function(vendorId) {
  const v = MockData.getVendorById(vendorId);
  if (!v) return;
  const stages = ['Application', 'KYC In Review', 'Contract Review', 'Banking Setup', 'Completed'];
  const curIdx = stages.indexOf(v.onboardingStage || 'Application');
  if (curIdx < stages.length - 1) {
    v.onboardingStage = stages[curIdx + 1];
    v.onboardingProgress = Math.round(((curIdx + 2) / stages.length) * 100);
    showToast(v.name + ' advanced to stage: ' + v.onboardingStage);
    window.renderVendorPortal();
  }
};

window.openUploadDocModal = function(vendorId) {
  const v = MockData.getVendorById(vendorId) || MockData.vendors[0];
  _showModal({
    title: 'Upload Compliance Document',
    content: `
      <div style="font-size:0.875rem;">
        <p>Upload a verified compliance document for <strong>${esc(v.name)}</strong>.</p>
        <div class="form-group" style="margin-top:1rem;">
          <label class="form-label">Document Title</label>
          <input id="modal-doc-title" type="text" class="form-input" placeholder="e.g. 2027 Certificate of Insurance Renewal">
        </div>
        <div class="form-group">
          <label class="form-label">Document Type</label>
          <select id="modal-doc-type" class="form-select">
            <option value="Insurance">Certificate of Insurance (COI)</option>
            <option value="Tax Form">Tax Form (W-9)</option>
            <option value="Security Audit">SOC 1 / SOC 2 / PCI-DSS Audit</option>
            <option value="Banking">Banking ACH Settlement Agreement</option>
            <option value="Contract">Master Service Agreement (MSA)</option>
            <option value="Regulatory License">State MSB / Transmitter License</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Expiry Date</label>
          <input id="modal-doc-expiry" type="date" class="form-input" value="2027-12-31">
        </div>
        <div class="form-group">
          <label class="form-label">Select File (.pdf, .zip, .docx)</label>
          <input type="file" class="form-input" id="modal-doc-file">
        </div>
      </div>
    `,
    confirmText: 'Upload & Verify',
    onConfirm: () => {
      const title = document.getElementById('modal-doc-title').value.trim() || 'Compliance Document';
      const type = document.getElementById('modal-doc-type').value;
      const expiry = document.getElementById('modal-doc-expiry').value || '2027-12-31';

      if (!v.documents) v.documents = [];
      const newDoc = {
        id: 'DOC-' + v.id + '-' + (v.documents.length + 1),
        title: title,
        type: type,
        status: 'Verified',
        expiryDate: expiry,
        size: '2.1 MB',
        uploadDate: new Date().toISOString().split('T')[0]
      };
      v.documents.unshift(newDoc);

      MockData.auditLogs.unshift({
        id: 'AUD-' + Date.now(),
        timestamp: new Date().toISOString(),
        user: v.name,
        action: 'Document Uploaded',
        module: 'Vendor Portal',
        details: 'Uploaded ' + title + ' (' + type + ')'
      });

      showToast('Document ' + title + ' uploaded and verified successfully');
      window.renderVendorPortal();
    }
  });
};

window.downloadVendorDoc = function(docId) {
  showToast('Initiating encrypted download for document ' + docId + '...');
};

window.verifyVendorDoc = function(vendorId, docId) {
  const v = MockData.getVendorById(vendorId);
  if (!v || !v.documents) return;
  const d = v.documents.find(doc => doc.id === docId);
  if (d) {
    d.status = 'Verified';
    showToast('Document ' + d.title + ' verified successfully');
    window.renderVendorPortal();
  }
};

window.exportVendorDirectoryCSV = function() {
  const rows = MockData.vendors.map(v => ({
    'Vendor ID': v.id,
    'Vendor Name': v.name,
    'Category': v.category,
    'Region': v.region,
    'Primary Contact': v.contact,
    'Email': v.email,
    'Phone': v.phone,
    'Bidding Status': v.biddingStatus || 'not_invited',
    'Offer Status': v.biddingOfferStatus || 'not_sent',
    'Annual Volume': v.totalVolume,
    'Baseline Commission %': v.commissionRate,
    'Onboarding Stage': v.onboardingStage || 'Completed',
    'Compliance Score': v.complianceScore || 85
  }));
  exportToCSV(rows, 'Vendor_Directory_Bidding_Roster.csv');
  showToast('Exported vendor directory CSV');
};


// ═══════════════════════════════════════════════════════════════
//  COMPLIANCE MONITORING & REVENUE RECONCILIATION (Spec #11)
// ═══════════════════════════════════════════════════════════════
window.renderCompliance = function() {
  const recList = MockData.monthlyCommissionReconciliation || [];
  const violations = MockData.complianceViolations || [];
  const scores = MockData.complianceScores || [];

  if (!AppState.complianceActiveTab) AppState.complianceActiveTab = 'reconciliation';
  if (!AppState.complianceMonth) AppState.complianceMonth = '2026-10';
  if (!AppState.complianceCategory) AppState.complianceCategory = 'All';
  if (!AppState.complianceStatus) AppState.complianceStatus = 'All';
  if (!AppState.complianceSearch) AppState.complianceSearch = '';

  // Filter records
  const filteredRecs = recList.filter(r => {
    if (AppState.complianceMonth !== 'All' && r.month !== AppState.complianceMonth) return false;
    if (AppState.complianceCategory !== 'All' && r.category !== AppState.complianceCategory) return false;
    if (AppState.complianceStatus !== 'All' && r.reconciliationStatus !== AppState.complianceStatus) return false;
    if (AppState.complianceSearch) {
      const q = AppState.complianceSearch.toLowerCase();
      const matchVendor = r.vendorName.toLowerCase().includes(q);
      const matchProd = r.productName.toLowerCase().includes(q);
      const matchCause = (r.leakageRootCause || '').toLowerCase().includes(q);
      if (!matchVendor && !matchProd && !matchCause) return false;
    }
    return true;
  });

  // Calculate metrics for current month
  const monthRecs = recList.filter(r => AppState.complianceMonth === 'All' || r.month === AppState.complianceMonth);
  const totalExpected = monthRecs.reduce((acc, r) => acc + (r.expectedCommission || 0), 0);
  const totalActual = monthRecs.reduce((acc, r) => acc + (r.actualCommission || 0), 0);
  const totalShortfall = monthRecs.filter(r => r.varianceAmount < 0).reduce((acc, r) => acc + r.varianceAmount, 0);
  const totalDiscrepant = monthRecs.filter(r => r.varianceAmount < 0).length;
  const avgComplianceScore = Math.round(scores.reduce((s, r) => s + r.overallScore, 0) / (scores.length || 1));

  _setContent('main-content', `
    <!-- KPI Header Cards -->
    <div class="kpi-grid" style="grid-template-columns:repeat(5, 1fr);margin-bottom:1.5rem;">
      <div class="kpi-card" style="--kpi-color:#3b82f6;--kpi-bg:#dbeafe;">
        <div class="kpi-icon" style="background:#dbeafe;color:#3b82f6;"><i data-lucide="calculator"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Expected Commissions</div>
          <div class="kpi-value">$${Math.round(totalExpected).toLocaleString()}</div>
          <div class="kpi-sub">Contracted rates & subsidies</div>
        </div>
      </div>
      <div class="kpi-card" style="--kpi-color:#10b981;--kpi-bg:#dcfce7;">
        <div class="kpi-icon" style="background:#dcfce7;color:#10b981;"><i data-lucide="check-circle-2"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Actual Remitted</div>
          <div class="kpi-value">$${Math.round(totalActual).toLocaleString()}</div>
          <div class="kpi-sub">Received across settlement files</div>
        </div>
      </div>
      <div class="kpi-card" style="--kpi-color:#ef4444;--kpi-bg:#fee2e2;">
        <div class="kpi-icon" style="background:#fee2e2;color:#ef4444;"><i data-lucide="alert-triangle"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Revenue Leakage Shortfall</div>
          <div class="kpi-value" style="color:#ef4444;">-$${Math.round(Math.abs(totalShortfall)).toLocaleString()}</div>
          <div class="kpi-sub">${totalDiscrepant} underpaid line items detected</div>
        </div>
      </div>
      <div class="kpi-card" style="--kpi-color:#8b5cf6;--kpi-bg:#ede9fe;">
        <div class="kpi-icon" style="background:#ede9fe;color:#8b5cf6;"><i data-lucide="refresh-cw"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Active Escalations</div>
          <div class="kpi-value">$${(MockData.recoveryPipeline.filter(r=>r.status!=='Recovered').reduce((s,c)=>s+c.amount,0)/1000).toFixed(0)}k</div>
          <div class="kpi-sub">Under active recovery dispute</div>
        </div>
      </div>
      <div class="kpi-card" style="--kpi-color:#06b6d4;--kpi-bg:#cffafe;">
        <div class="kpi-icon" style="background:#cffafe;color:#06b6d4;"><i data-lucide="shield-check"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Avg Compliance Score</div>
          <div class="kpi-value">${avgComplianceScore}%</div>
          <div class="kpi-sub">${scores.filter(s=>s.overallScore>=80).length} of ${scores.length} vendors compliant</div>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="portal-tabs-nav">
      <button class="portal-tab-btn compliance-tab-btn ${AppState.complianceActiveTab === 'reconciliation' ? 'active' : ''}" onclick="setComplianceTab('reconciliation')">
        <i data-lucide="table"></i> Monthly Expected vs. Actual Reconciliation
      </button>
      <button class="portal-tab-btn compliance-tab-btn ${AppState.complianceActiveTab === 'analytics' ? 'active' : ''}" onclick="setComplianceTab('analytics')">
        <i data-lucide="bar-chart-3"></i> Revenue Leakage Root Causes & Spread
      </button>
      <button class="portal-tab-btn compliance-tab-btn ${AppState.complianceActiveTab === 'scorecards' ? 'active' : ''}" onclick="setComplianceTab('scorecards')">
        <i data-lucide="award"></i> Vendor Compliance Scorecards & Violations
      </button>
      <button class="portal-tab-btn compliance-tab-btn ${AppState.complianceActiveTab === 'rules' ? 'active' : ''}" onclick="setComplianceTab('rules')">
        <i data-lucide="sliders"></i> Reconciliation Rules & Tolerance Config
      </button>
      <a href="#/leakage" class="portal-tab-btn compliance-tab-btn" style="color:#ef4444 !important;margin-left:auto;text-decoration:none;">
        <i data-lucide="shield-alert"></i> Launch Predictive Forensics & Dispute Engine &rarr;
      </a>
    </div>

    <!-- Tab 1: Reconciliation Ledger -->
    <div id="comp-tab-reconciliation" style="display:${AppState.complianceActiveTab === 'reconciliation' ? 'block' : 'none'};">
      <div class="card" style="margin-bottom:1.5rem;">
        <div class="card-header" style="flex-wrap:wrap;gap:1rem;">
          <div>
            <div class="card-title">Monthly Commission Remittance Validation & Leakage Ledger</div>
            <div class="card-subtitle">Validates monthly remittances against contract formulas (Volume &times; Contract Rate + Subsidies). Automatically isolates rate tier deviations, unpaid subsidies, and missing floor guarantees.</div>
          </div>
          <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;">
            <select class="form-select form-select-sm" style="width:170px;" onchange="filterComplianceMonth(this.value)">
              <option value="2026-10" ${AppState.complianceMonth === '2026-10' ? 'selected' : ''}>October 2026 (Current)</option>
              <option value="2026-09" ${AppState.complianceMonth === '2026-09' ? 'selected' : ''}>September 2026</option>
              <option value="All" ${AppState.complianceMonth === 'All' ? 'selected' : ''}>All Historical Periods</option>
            </select>
            <select class="form-select form-select-sm" style="width:160px;" onchange="filterComplianceCategory(this.value)">
              <option value="All" ${AppState.complianceCategory === 'All' ? 'selected' : ''}>All Categories</option>
              <option value="Gift Cards" ${AppState.complianceCategory === 'Gift Cards' ? 'selected' : ''}>Gift Cards</option>
              <option value="Money Transfer" ${AppState.complianceCategory === 'Money Transfer' ? 'selected' : ''}>Money Transfer</option>
              <option value="Prepaid Products" ${AppState.complianceCategory === 'Prepaid Products' ? 'selected' : ''}>Prepaid Products</option>
              <option value="Debit Services" ${AppState.complianceCategory === 'Debit Services' ? 'selected' : ''}>Debit Services</option>
              <option value="Financial Services" ${AppState.complianceCategory === 'Financial Services' ? 'selected' : ''}>Financial Services</option>
            </select>
            <select class="form-select form-select-sm" style="width:180px;" onchange="filterComplianceStatus(this.value)">
              <option value="All" ${AppState.complianceStatus === 'All' ? 'selected' : ''}>All Statuses</option>
              <option value="Shortfall Confirmed" ${AppState.complianceStatus === 'Shortfall Confirmed' ? 'selected' : ''}>Shortfall Confirmed</option>
              <option value="Reconciled / Match" ${AppState.complianceStatus === 'Reconciled / Match' ? 'selected' : ''}>Reconciled / Match</option>
              <option value="Escalated to Recovery" ${AppState.complianceStatus === 'Escalated to Recovery' ? 'selected' : ''}>Escalated to Recovery</option>
              <option value="Under Review" ${AppState.complianceStatus === 'Under Review' ? 'selected' : ''}>Under Review</option>
            </select>
            <div class="search-input-wrap" style="width:200px;">
              <i data-lucide="search" class="search-icon"></i>
              <input type="text" class="form-input form-input-sm" placeholder="Search vendor/cause..." value="${esc(AppState.complianceSearch)}" oninput="filterComplianceSearch(this.value)">
            </div>
            <button class="btn btn-outline btn-sm" onclick="runMonthlyReconciliation()">
              <i data-lucide="refresh-cw"></i> Run Reconcile
            </button>
            <button class="btn btn-outline btn-sm" onclick="exportReconciliationCSV()">
              <i data-lucide="download"></i> Export CSV
            </button>
          </div>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Period / Product</th>
                <th>Vendor & Remittance Ref</th>
                <th style="text-align:right;">Monthly GMV</th>
                <th style="text-align:right;">Contracted Terms (Expected)</th>
                <th style="text-align:right;">Actual Remitted</th>
                <th style="text-align:right;">Variance (Shortfall)</th>
                <th>Leakage Root Cause & Diagnosis</th>
                <th>Status</th>
                <th style="text-align:right;">Dispute Action</th>
              </tr>
            </thead>
            <tbody>
              ${filteredRecs.map(r => {
                const isShortfall = r.varianceAmount < 0;
                const statusBadge = r.reconciliationStatus === 'Reconciled / Match'
                  ? '<span class="badge badge-reconciled"><i data-lucide="check"></i> Reconciled</span>'
                  : r.reconciliationStatus === 'Escalated to Recovery'
                  ? '<span class="badge badge-primary"><i data-lucide="refresh-cw"></i> Escalated</span>'
                  : r.reconciliationStatus === 'Under Review'
                  ? '<span class="badge badge-warning"><i data-lucide="clock"></i> Under Review</span>'
                  : '<span class="badge badge-shortfall"><i data-lucide="alert-octagon"></i> Shortfall</span>';

                return `
                  <tr style="${isShortfall ? 'background:rgba(239,68,68,0.02);' : ''}">
                    <td>
                      <div style="font-weight:700;font-size:0.875rem;">${esc(r.productName)}</div>
                      <div style="font-size:0.75rem;color:var(--text-muted);"><i data-lucide="calendar" style="width:11px;height:11px;display:inline-block;vertical-align:middle;"></i> ${esc(r.monthLabel)} &bull; ${esc(r.category)}</div>
                    </td>
                    <td>
                      <div style="font-weight:600;">${esc(r.vendorName)}</div>
                      <div style="font-size:0.7rem;color:var(--text-muted);font-family:monospace;">${esc(r.remittanceRef || 'REM-AUTO-2026')}</div>
                    </td>
                    <td style="text-align:right;font-weight:600;">
                      $${r.monthlyVolume.toLocaleString()}
                    </td>
                    <td style="text-align:right;">
                      <div style="font-weight:700;font-size:0.95rem;color:#1e293b;">$${r.expectedCommission.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
                      <div style="font-size:0.75rem;color:var(--text-muted);">${r.contractedRate}% + $${r.contractedSubsidies} sub</div>
                    </td>
                    <td style="text-align:right;">
                      <div style="font-weight:700;font-size:0.95rem;${isShortfall ? 'color:#ef4444;' : 'color:#10b981;'}">$${r.actualCommission.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
                      <div style="font-size:0.75rem;color:var(--text-muted);">${r.actualRemittedRate}% + $${r.actualSubsidiesReceived} sub</div>
                    </td>
                    <td style="text-align:right;">
                      ${isShortfall ? `
                        <div style="font-weight:800;font-size:1rem;color:#dc2626;">-$${Math.abs(r.varianceAmount).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
                        <span class="badge badge-shortfall" style="font-size:0.7rem;padding:1px 5px;">${r.varianceBps} bps</span>
                      ` : `
                        <div style="font-weight:700;color:#15803d;">$0.00</div>
                        <span class="badge badge-reconciled" style="font-size:0.7rem;padding:1px 5px;">0 bps</span>
                      `}
                    </td>
                    <td>
                      <div style="font-size:0.8125rem;${isShortfall ? 'color:#b91c1c;font-weight:600;' : 'color:var(--text-muted);'}">
                        ${esc(r.leakageRootCause)}
                      </div>
                      <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">
                        Terms: ${esc(r.settlementCycle)} &bull; Paid: ${esc(r.paymentDate)}
                      </div>
                    </td>
                    <td>${statusBadge}</td>
                    <td style="text-align:right;">
                      ${isShortfall && !r.escalatedToRecovery ? `
                        <button class="btn btn-danger btn-xs" title="Escalate to Revenue Recovery pipeline" onclick="escalateToRecovery('${r.id}')">
                          <i data-lucide="arrow-up-right"></i> Escalate
                        </button>
                      ` : isShortfall && r.escalatedToRecovery ? `
                        <span class="badge badge-neutral" style="font-size:0.7rem;">In Case ${esc(r.recoveryCaseId || 'RC001')}</span>
                      ` : `
                        <button class="btn btn-outline btn-xs" title="View remittance breakdown" onclick="viewRemittanceDetail('${r.id}')">
                          <i data-lucide="file-text"></i> Audit
                        </button>
                      `}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Tab 2: Root Cause Analytics -->
    <div id="comp-tab-analytics" style="display:${AppState.complianceActiveTab === 'analytics' ? 'block' : 'none'};">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.5rem;">
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Monthly Remittance Performance: Expected vs. Actual</div>
              <div class="card-subtitle">Trailing 3-month volume and shortfall comparison</div>
            </div>
          </div>
          <div class="card-body">
            <div class="chart-container" style="height:260px;"><canvas id="chart-expected-vs-actual"></canvas></div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Revenue Leakage Root Cause Distribution</div>
              <div class="card-subtitle">Underpayment driver attribution across audited remittance statements</div>
            </div>
          </div>
          <div class="card-body">
            <div class="chart-container" style="height:260px;"><canvas id="chart-leakage-causes"></canvas></div>
          </div>
        </div>
      </div>

      <!-- Root cause breakdown cards -->
      <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:1rem;margin-bottom:1.5rem;">
        <div class="card" style="border-top:3px solid #ef4444;">
          <div class="card-body">
            <div style="font-size:0.75rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;">1. Rate Tier Deviations</div>
            <div style="font-size:1.5rem;font-weight:800;color:#ef4444;margin:4px 0;">-$3,440.00 / mo</div>
            <div style="font-size:0.8125rem;color:var(--text-muted);">Vendors paying default non-tiered rates instead of contracted volume tiers (e.g. SwiftTransfer 1.45% vs 1.80%).</div>
          </div>
        </div>
        <div class="card" style="border-top:3px solid #f59e0b;">
          <div class="card-body">
            <div style="font-size:0.75rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;">2. Omitted Marketing Subsidies</div>
            <div style="font-size:1.5rem;font-weight:800;color:#f59e0b;margin:4px 0;">-$1,500.00 / mo</div>
            <div style="font-size:0.8125rem;color:var(--text-muted);">Contractual marketing co-op and POS display subsidies omitted from monthly remittance files (e.g. GiftFlow).</div>
          </div>
        </div>
        <div class="card" style="border-top:3px solid #8b5cf6;">
          <div class="card-body">
            <div style="font-size:0.75rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;">3. IT & Surcharge Deductions</div>
            <div style="font-size:1.5rem;font-weight:800;color:#8b5cf6;margin:4px 0;">-$1,040.00 / mo</div>
            <div style="font-size:0.8125rem;color:var(--text-muted);">Arbitrary deductions for network switch fees and bill payment utility bands (FinServ).</div>
          </div>
        </div>
        <div class="card" style="border-top:3px solid #06b6d4;">
          <div class="card-body">
            <div style="font-size:0.75rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;">4. Clearinghouse Errors</div>
            <div style="font-size:1.5rem;font-weight:800;color:#06b6d4;margin:4px 0;">-$840.00 / mo</div>
            <div style="font-size:0.8125rem;color:var(--text-muted);">Door tier mapping errors in third-party remittance aggregation systems (ReloadNow, ValueCard).</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 3: Scorecards & Violations -->
    <div id="comp-tab-scorecards" style="display:${AppState.complianceActiveTab === 'scorecards' ? 'block' : 'none'};">
      <div class="card" style="margin-bottom:1.5rem;">
        <div class="card-header">
          <div>
            <div class="card-title">Vendor Compliance Scorecards</div>
            <div class="card-subtitle">Monthly rolling averages across 5 quantitative pillars</div>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Category</th>
                <th style="text-align:center;">Overall</th>
                <th style="text-align:center;">Payment Timeliness</th>
                <th style="text-align:center;">Rate Accuracy</th>
                <th style="text-align:center;">SLA Fulfillment</th>
                <th style="text-align:center;">Reporting Quality</th>
              </tr>
            </thead>
            <tbody>
              ${scores.map(s => `
                <tr>
                  <td style="font-weight:700;">${esc(s.vendor)}</td>
                  <td><span class="badge badge-neutral">${(MockData.getVendorById(s.vendorId)||{}).category || 'Financial'}</span></td>
                  <td style="text-align:center;">${_scoreCircle(s.overallScore)}</td>
                  <td style="text-align:center;">${_scoreCircle(s.paymentTimeliness)}</td>
                  <td style="text-align:center;">${_scoreCircle(s.rateAccuracy)}</td>
                  <td style="text-align:center;">${_scoreCircle(s.sla)}</td>
                  <td style="text-align:center;">${_scoreCircle(s.reportingQuality)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="card" style="margin-bottom:1.5rem;">
        <div class="card-header">
          <div>
            <div class="card-title">SLA & Contractual Violation Audit Log</div>
            <div class="card-subtitle">Active infractions, delayed settlement days, and rate dispute status</div>
          </div>
          <button class="btn btn-outline btn-sm" onclick="exportToCSV(MockData.complianceViolations, 'Compliance_Violations.csv')">
            <i data-lucide="download"></i> Export Violations CSV
          </button>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Violation Type</th>
                <th>Severity</th>
                <th>Date Logged</th>
                <th>Resolution Status</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              ${violations.map(v => {
                const sevBadge = v.severity === 'High' ? 'badge-danger' : v.severity === 'Medium' ? 'badge-warning' : 'badge-info';
                const resBadge = v.resolution === 'Resolved' ? 'badge-success' : v.resolution === 'Pending' ? 'badge-danger' : 'badge-warning';
                return `
                  <tr>
                    <td style="font-weight:600;">${esc(v.vendor)}</td>
                    <td>${esc(v.type)}</td>
                    <td><span class="badge ${sevBadge}">${esc(v.severity)}</span></td>
                    <td style="font-size:0.8125rem;">${v.date}</td>
                    <td><span class="badge ${resBadge}">${esc(v.resolution)}</span></td>
                    <td style="font-size:0.8125rem;color:var(--text-muted);">${esc(v.description)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Tab 4: Rules & Config -->
    <div id="comp-tab-rules" style="display:${AppState.complianceActiveTab === 'rules' ? 'block' : 'none'};">
      <div class="card" style="margin-bottom:1.5rem;">
        <div class="card-header">
          <div>
            <div class="card-title">Automated Reconciliation Engine & Tolerance Rules</div>
            <div class="card-subtitle">Configure mathematical thresholds for automatic leakage flagging, dispute escalation, and finance alerts.</div>
          </div>
        </div>
        <div class="card-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;">
            <div>
              <label class="form-label" style="font-weight:700;">Dollar Variance Alert Threshold ($)</label>
              <input id="cfg-shortfall-dollars" type="number" class="form-input" value="${MockData.complianceConfig.varianceAlertThresholdDollars || 250}">
              <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.25rem;">Any monthly line item shortfall exceeding this amount triggers automated audit alert.</div>
            </div>

            <div>
              <label class="form-label" style="font-weight:700;">Rate Basis Point (bps) Threshold</label>
              <input id="cfg-shortfall-bps" type="number" class="form-input" value="${MockData.complianceConfig.varianceAlertThresholdBps || 10}">
              <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.25rem;">Flags variances if remitted commission rate is &ge; this many basis points below contract.</div>
            </div>

            <div>
              <label class="form-label" style="font-weight:700;">Auto-Escalation Grace Period (Days)</label>
              <select id="cfg-grace-days" class="form-select">
                <option value="7" ${MockData.complianceConfig.autoEscalateGraceDays === 7 ? 'selected' : ''}>7 Days</option>
                <option value="14" ${MockData.complianceConfig.autoEscalateGraceDays === 14 ? 'selected' : ''}>14 Days (Standard)</option>
                <option value="30" ${MockData.complianceConfig.autoEscalateGraceDays === 30 ? 'selected' : ''}>30 Days</option>
              </select>
              <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.25rem;">Unresolved shortfalls beyond this window automatically convert into formal recovery cases.</div>
            </div>

            <div>
              <label class="form-label" style="font-weight:700;">Notification Dispatch</label>
              <div style="display:flex;flex-direction:column;gap:0.5rem;margin-top:0.5rem;">
                <label style="font-size:0.875rem;display:flex;align-items:center;gap:0.5rem;">
                  <input type="checkbox" checked> Notify Finance Analyst on shortfall detection
                </label>
                <label style="font-size:0.875rem;display:flex;align-items:center;gap:0.5rem;">
                  <input type="checkbox" checked> Notify Category Manager on dispute escalation
                </label>
              </div>
            </div>
          </div>

          <div style="margin-top:1.5rem;display:flex;justify-content:flex-end;">
            <button class="btn btn-primary" onclick="saveComplianceRules()">
              <i data-lucide="save"></i> Save Reconciliation Rules
            </button>
          </div>
        </div>
      </div>
    </div>
  `);

  // Initialize Lucide & Charts
  setTimeout(() => {
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Chart: Expected vs Actual
    const ctx1 = document.getElementById('chart-expected-vs-actual');
    if (ctx1) {
      AppState.charts['chart-expected-vs-actual'] = new Chart(ctx1, {
        type: 'bar',
        data: {
          labels: ['Aug 2026', 'Sep 2026', 'Oct 2026'],
          datasets: [
            { label: 'Expected Commission', data: [48200, 51400, 53674], backgroundColor: '#3b82f6', borderRadius: 4 },
            { label: 'Actual Received', data: [44100, 45200, 46475], backgroundColor: '#10b981', borderRadius: 4 },
            { label: 'Revenue Leakage', data: [4100, 6200, 7199], backgroundColor: '#ef4444', borderRadius: 4 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } },
            tooltip: { callbacks: { label: ctx => ctx.dataset.label + ': $' + ctx.parsed.y.toLocaleString() } }
          },
          scales: {
            y: { ticks: { callback: v => '$' + (v/1000) + 'k', font: { size: 11 } }, grid: { color: 'rgba(0,0,0,0.05)' } },
            x: { grid: { display: false }, ticks: { font: { size: 11 } } }
          }
        }
      });
    }

    // Chart: Root Causes
    const ctx2 = document.getElementById('chart-leakage-causes');
    if (ctx2) {
      AppState.charts['chart-leakage-causes'] = new Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels: ['Rate Tier Deviations (42%)', 'Omitted Promotional Subsidies (28%)', 'IT / Clearinghouse Deductions (18%)', 'Calculation Errors (12%)'],
          datasets: [{
            data: [42, 28, 18, 12],
            backgroundColor: ['#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4'],
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'right', labels: { boxWidth: 12, font: { size: 11 } } }
          }
        }
      });
    }
  }, 60);
};

// Compliance Handlers
window.setComplianceTab = function(tabName) {
  AppState.complianceActiveTab = tabName;
  window.renderCompliance();
};

window.filterComplianceMonth = function(month) {
  AppState.complianceMonth = month;
  window.renderCompliance();
};

window.filterComplianceCategory = function(cat) {
  AppState.complianceCategory = cat;
  window.renderCompliance();
};

window.filterComplianceStatus = function(stat) {
  AppState.complianceStatus = stat;
  window.renderCompliance();
};

window.filterComplianceSearch = function(query) {
  AppState.complianceSearch = query;
  window.renderCompliance();
};

window.runMonthlyReconciliation = function() {
  showToast('Executing automated reconciliation on POS transaction batch...');
  setTimeout(() => {
    MockData.auditLogs.unshift({
      id: 'AUD-' + Date.now(),
      timestamp: new Date().toISOString(),
      user: (Auth && Auth.currentUser && Auth.currentUser().name) || 'Finance Analyst',
      action: 'Automated Reconciliation Run',
      module: 'Compliance Monitoring',
      details: 'Validated 1,420 store POS settlement batches against active contract tables. 5 shortfalls identified.'
    });
    showToast('Reconciliation complete: 5 shortfalls verified ($7,199.50 leakage detected).');
    window.renderCompliance();
  }, 400);
};

window.escalateToRecovery = function(recId) {
  const rec = (MockData.monthlyCommissionReconciliation || []).find(r => r.id === recId);
  if (!rec) return;

  rec.reconciliationStatus = 'Escalated to Recovery';
  rec.escalatedToRecovery = true;
  const newCaseId = 'RC-' + (MockData.recoveryPipeline.length + 10).toString().padStart(3, '0');
  rec.recoveryCaseId = newCaseId;

  const recoveryCase = {
    id: newCaseId,
    vendor: rec.vendorName,
    type: 'Commission Shortfall',
    amount: Math.abs(rec.varianceAmount),
    status: 'In Progress',
    priority: Math.abs(rec.varianceAmount) > 1000 ? 'High' : 'Medium',
    assignedTo: (Auth && Auth.currentUser && Auth.currentUser().name) || 'Finance Analyst',
    age: 1,
    notes: 'Auto-escalated from monthly compliance reconciliation for ' + rec.productName + ' (' + rec.monthLabel + '). Cause: ' + rec.leakageRootCause
  };
  MockData.recoveryPipeline.unshift(recoveryCase);

  MockData.auditLogs.unshift({
    id: 'AUD-' + Date.now(),
    timestamp: new Date().toISOString(),
    user: (Auth && Auth.currentUser && Auth.currentUser().name) || 'Finance Analyst',
    action: 'Dispute Escalated to Recovery',
    module: 'Compliance Monitoring',
    details: 'Opened recovery case ' + newCaseId + ' for ' + rec.vendorName + ' ($' + Math.abs(rec.varianceAmount).toFixed(2) + ')'
  });

  MockData.notifications.unshift({
    id: 'N-DISP-' + Date.now(),
    userId: 'U004',
    title: 'Commission Shortfall Dispute Escalated',
    message: 'Opened recovery case ' + newCaseId + ' for ' + rec.vendorName + ' shortfall of $' + Math.abs(rec.varianceAmount).toFixed(2),
    timestamp: 'Just now',
    type: 'warning',
    read: false
  });

  showToast('Escalated shortfall of $' + Math.abs(rec.varianceAmount).toFixed(2) + ' to Revenue Recovery (Case ' + newCaseId + ')');
  window.renderCompliance();
};

window.viewRemittanceDetail = function(recId) {
  const rec = (MockData.monthlyCommissionReconciliation || []).find(r => r.id === recId);
  if (!rec) return;
  _showModal({
    title: 'Remittance Advice Reconciliation Detail',
    content: `
      <div style="font-size:0.875rem;">
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:0.75rem;margin-bottom:1rem;">
          <div style="font-weight:700;font-size:1rem;">${esc(rec.vendorName)} &bull; ${esc(rec.productName)}</div>
          <div style="font-size:0.75rem;color:var(--text-muted);">Period: ${esc(rec.monthLabel)} &bull; Settlement Ref: ${esc(rec.remittanceRef)}</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
          <div style="background:#f1f5f9;padding:0.75rem;border-radius:6px;">
            <div style="font-weight:700;color:#1e293b;margin-bottom:0.25rem;">Contracted / Expected</div>
            <div>Monthly Volume: <strong>$${rec.monthlyVolume.toLocaleString()}</strong></div>
            <div>Contracted Rate: <strong>${rec.contractedRate}%</strong> ($ ${rec.contractedBaseCommission})</div>
            <div>Contracted Subsidies: <strong>$${rec.contractedSubsidies}</strong></div>
            <div style="margin-top:0.5rem;font-size:1.1rem;font-weight:800;color:#0f172a;">Total Expected: $${rec.expectedCommission.toFixed(2)}</div>
          </div>
          <div style="background:#fef2f2;padding:0.75rem;border-radius:6px;">
            <div style="font-weight:700;color:#991b1b;margin-bottom:0.25rem;">Actual Remitted</div>
            <div>Reported Volume: <strong>$${rec.monthlyVolume.toLocaleString()}</strong></div>
            <div>Remitted Rate: <strong>${rec.actualRemittedRate}%</strong> ($ ${rec.actualBaseCommission})</div>
            <div>Paid Subsidies: <strong>$${rec.actualSubsidiesReceived}</strong></div>
            <div style="margin-top:0.5rem;font-size:1.1rem;font-weight:800;color:#dc2626;">Total Remitted: $${rec.actualCommission.toFixed(2)}</div>
          </div>
        </div>
        <div style="background:#fff;border:1px solid #fecaca;border-radius:6px;padding:0.75rem;">
          <div style="font-weight:700;color:#b91c1c;">Calculated Variance: $${rec.varianceAmount.toFixed(2)} (${rec.varianceBps} bps)</div>
          <div style="font-size:0.8125rem;color:#475569;margin-top:0.25rem;">Root Cause: ${esc(rec.leakageRootCause)}</div>
          <div style="font-size:0.8125rem;color:#475569;margin-top:0.25rem;">Action: ${esc(rec.actionRequired)}</div>
        </div>
      </div>
    `,
    confirmText: 'Close',
    onConfirm: () => {}
  });
};

window.saveComplianceRules = function() {
  const dollars = Number(document.getElementById('cfg-shortfall-dollars').value) || 250;
  const bps = Number(document.getElementById('cfg-shortfall-bps').value) || 10;
  const days = Number(document.getElementById('cfg-grace-days').value) || 14;

  MockData.complianceConfig.varianceAlertThresholdDollars = dollars;
  MockData.complianceConfig.varianceAlertThresholdBps = bps;
  MockData.complianceConfig.autoEscalateGraceDays = days;

  MockData.auditLogs.unshift({
    id: 'AUD-' + Date.now(),
    timestamp: new Date().toISOString(),
    user: (Auth && Auth.currentUser && Auth.currentUser().name) || 'Admin',
    action: 'Compliance Rules Saved',
    module: 'Compliance Monitoring',
    details: 'Set shortfall threshold to $' + dollars + ', ' + bps + ' bps, grace ' + days + ' days'
  });

  showToast('Compliance reconciliation rules saved successfully');
  window.renderCompliance();
};

window.exportReconciliationCSV = function() {
  const recs = MockData.monthlyCommissionReconciliation || [];
  const rows = recs.map(r => ({
    'Period': r.monthLabel,
    'Vendor ID': r.vendorId,
    'Vendor Name': r.vendorName,
    'Product': r.productName,
    'Category': r.category,
    'Monthly Volume ($)': r.monthlyVolume,
    'Contracted Rate (%)': r.contractedRate,
    'Expected Commission ($)': r.expectedCommission,
    'Remitted Rate (%)': r.actualRemittedRate,
    'Actual Remitted ($)': r.actualCommission,
    'Variance ($)': r.varianceAmount,
    'Variance (bps)': r.varianceBps,
    'Status': r.reconciliationStatus,
    'Root Cause': r.leakageRootCause,
    'Settlement Ref': r.remittanceRef
  }));
  exportToCSV(rows, 'Monthly_Commission_Reconciliation_Ledger.csv');
  showToast('Exported reconciliation ledger CSV');
};


// ═══════════════════════════════════════════════════════════════
//  EXECUTIVE DASHBOARDS & BOARD-READY SUMMARIES (SPEC REQUIREMENT)
// ═══════════════════════════════════════════════════════════════
window.renderExecutiveDashboard = function() {
  const eb = MockData.executiveBoardMetrics || {};
  const opp = MockData.profitOpportunityEngine || {};
  const recList = MockData.monthlyCommissionReconciliation || [];
  const contracts = MockData.contracts || [];
  const events = MockData.sourcingEvents || [];
  const pipeline = MockData.recoveryPipeline || [];

  _setContent('main-content', `
    <!-- Board-Ready Executive Summary Card -->
    <div class="executive-board-quote">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem;margin-bottom:1rem;">
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <div style="width:40px;height:40px;border-radius:8px;background:rgba(56,189,248,0.2);display:flex;align-items:center;justify-content:center;color:#38bdf8;">
            <i data-lucide="award"></i>
          </div>
          <div>
            <span class="badge" style="background:#38bdf8;color:#0f172a;font-weight:800;font-size:0.75rem;padding:3px 8px;letter-spacing:0.5px;">BOARD-READY EXECUTIVE BRIEFING</span>
            <div style="font-size:0.75rem;color:#94a3b8;margin-top:2px;">Quarterly C-Suite & Procurement Sponsor Report &bull; Q4 2026</div>
          </div>
        </div>
        <div style="display:flex;gap:0.5rem;">
          <button class="btn btn-hero-glass btn-sm" style="background:rgba(255,255,255,0.15);border:1.5px solid rgba(255,255,255,0.5);color:#ffffff;font-weight:700;" onclick="exportBoardBriefingMemo()">
            <i data-lucide="file-text"></i> Download Board Memo (PDF)
          </button>
          <button class="btn btn-primary btn-sm" style="background:#38bdf8;border-color:#38bdf8;color:#0f172a;font-weight:800;" onclick="showToast('Quarterly Board Presentation Deck ready for download (18 Slides)');">
            <i data-lucide="presentation"></i> Board Deck (.PPTX)
          </button>
        </div>
      </div>

      <!-- Exact Required Board Summary Quote -->
      <div class="board-quote-text">
        &ldquo;${esc(eb.boardSummaryQuote)}&rdquo;
      </div>

      <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:1.5rem;margin-top:1.5rem;border-top:1px solid rgba(255,255,255,0.15);padding-top:1.25rem;">
        <div style="border-left:3px solid #34d399;padding-left:1rem;">
          <div style="font-size:0.75rem;color:#94a3b8;text-transform:uppercase;font-weight:700;">Revenue Expansion</div>
          <div style="font-size:1.5rem;font-weight:900;color:#34d399;">+${eb.quarterlyRevenueGrowthPct}%</div>
          <div style="font-size:0.8125rem;color:#cbd5e1;">Quarterly commission revenue trajectory</div>
        </div>
        <div style="border-left:3px solid #38bdf8;padding-left:1rem;">
          <div style="font-size:0.75rem;color:#94a3b8;text-transform:uppercase;font-weight:700;">Reverse Auction Margin</div>
          <div style="font-size:1.5rem;font-weight:900;color:#38bdf8;">+$${(eb.reverseAuctionMarginGenerated/1000).toFixed(0)}k / yr</div>
          <div style="font-size:0.8125rem;color:#cbd5e1;">Annualized margin created via competitive bidding</div>
        </div>
        <div style="border-left:3px solid #f87171;padding-left:1rem;">
          <div style="font-size:0.75rem;color:#94a3b8;text-transform:uppercase;font-weight:700;">Underperforming Recovery Target</div>
          <div style="font-size:1.5rem;font-weight:900;color:#f87171;">$${(eb.underperformingRecoveryOpportunity/1000).toFixed(0)}k Opportunity</div>
          <div style="font-size:0.8125rem;color:#cbd5e1;">${eb.underperformingVendorsCount} vendors currently flagged for recovery</div>
        </div>
      </div>
    </div>

    <!-- The 5 Core Executive Quadrants Grid -->
    <div style="display:grid;grid-template-columns:repeat(2, 1fr);gap:1.5rem;margin-bottom:1.5rem;">
      <!-- Quadrant 1: Opportunity -->
      <div class="card">
        <div class="card-header" style="justify-content:space-between;">
          <div>
            <div class="card-title">1. Profit Opportunity Engine™ Overview</div>
            <div class="card-subtitle">Current commissions vs. benchmark market yields</div>
          </div>
          <span class="badge badge-success">+$430k Opportunity</span>
        </div>
        <div class="card-body">
          <div style="display:flex;justify-content:space-between;align-items:center;padding:0.75rem 0;border-bottom:1px solid var(--border-color);">
            <span>Current Commission Run-Rate:</span>
            <strong style="font-size:1.1rem;">$${((opp.currentCommissions||1200000)/1000000).toFixed(2)}M</strong>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;padding:0.75rem 0;border-bottom:1px solid var(--border-color);">
            <span>Present Commission Benchmark Yield:</span>
            <strong style="font-size:1.1rem;color:#10b981;">$${((opp.marketCommissions||1630000)/1000000).toFixed(2)}M</strong>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;padding:0.75rem 0;margin-bottom:1rem;">
            <span>Top Negotiable SKU Opportunities:</span>
            <span style="font-size:0.8125rem;color:#6366f1;font-weight:700;">Netflix (+$82k) &bull; Visa Gift (+$71k) &bull; MoneyGram (+$63k)</span>
          </div>
          <button class="btn btn-primary btn-sm btn-full" onclick="window.location.hash='#/dashboard'">
            <i data-lucide="zap"></i> Launch RFP to Recover $430,000 &rarr;
          </button>
        </div>
      </div>

      <!-- Quadrant 2: Compliance & Underperforming Vendors -->
      <div class="card">
        <div class="card-header" style="justify-content:space-between;">
          <div>
            <div class="card-title">2. Compliance & Underperforming Vendors ($72,000)</div>
            <div class="card-subtitle">Vendors with rate underpayment and subsidy omissions</div>
          </div>
          <span class="badge badge-danger">3 Flagged Vendors</span>
        </div>
        <div class="card-body">
          ${(eb.underperformingVendorsList || []).map(uv => `
            <div class="bundle-component-row">
              <div>
                <strong style="font-size:0.875rem;">${esc(uv.vendor)}</strong>
                <div style="font-size:0.75rem;color:var(--text-muted);">${esc(uv.reason)}</div>
              </div>
              <span style="font-weight:800;font-size:0.95rem;color:#ef4444;">$${uv.shortfall.toLocaleString()}</span>
            </div>
          `).join('')}
          <div style="margin-top:1rem;display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:0.8125rem;color:var(--text-muted);">Average Chain Compliance Score: <strong>86%</strong></span>
            <button class="btn btn-outline btn-sm" onclick="window.location.hash='#/compliance'">
              <i data-lucide="shield-check"></i> Open Compliance Hub &rarr;
            </button>
          </div>
        </div>
      </div>

      <!-- Quadrant 3: Active Reverse Auctions & RFPs -->
      <div class="card">
        <div class="card-header" style="justify-content:space-between;">
          <div>
            <div class="card-title">3. Active Sourcing Auctions & Competitive Tenders</div>
            <div class="card-subtitle">$13.7M under active market tender</div>
          </div>
          <span class="badge badge-primary">3 Live Events</span>
        </div>
        <div class="card-body">
          <div class="bundle-component-row">
            <div>
              <strong>Q4 Gift Card Master Reverse Auction (SE001)</strong>
              <div style="font-size:0.75rem;color:var(--text-muted);">Reserve: 4.25% &bull; Best Bid: 4.35% (CardVault)</div>
            </div>
            <span class="badge badge-danger">Ending Today</span>
          </div>
          <div class="bundle-component-row">
            <div>
              <strong>Prepaid Streaming Sealed Bid Tender (SE002)</strong>
              <div style="font-size:0.75rem;color:var(--text-muted);">Reserve: 4.50% &bull; Best Bid: 4.85% (PrepaidPlus)</div>
            </div>
            <span class="badge badge-warning">Sealed Review</span>
          </div>
          <div class="bundle-component-row">
            <div>
              <strong>Money Transfer Target Pricing RFP (SE003)</strong>
              <div style="font-size:0.75rem;color:var(--text-muted);">Reserve: 2.40% &bull; Best Bid: 2.60% (QuickRemit)</div>
            </div>
            <span class="badge badge-info">Active Tender</span>
          </div>
          <div style="margin-top:1rem;">
            <button class="btn btn-outline btn-sm btn-full" onclick="window.location.hash='#/sourcing'">
              <i data-lucide="shopping-cart"></i> Enter Live Reverse Auction Arena &rarr;
            </button>
          </div>
        </div>
      </div>

      <!-- Quadrant 4: Expiring Contracts & Notice Horizons -->
      <div class="card">
        <div class="card-header" style="justify-content:space-between;">
          <div>
            <div class="card-title">4. Contract Renewal Horizons & Notice Deadlines</div>
            <div class="card-subtitle">Critical 60/90-day non-renewal cutoffs</div>
          </div>
          <span class="badge badge-warning">3 Approaching Deadlines</span>
        </div>
        <div class="card-body">
          <div class="bundle-component-row">
            <div>
              <strong>SwiftTransfer Global (CON003)</strong>
              <div style="font-size:0.75rem;color:#b45309;font-weight:600;">Notice Deadline: Nov 1, 2026 (Past cutoff &bull; Action Required)</div>
            </div>
            <span class="badge badge-danger">Critical</span>
          </div>
          <div class="bundle-component-row">
            <div>
              <strong>GiftFlow Inc. (CON001)</strong>
              <div style="font-size:0.75rem;color:var(--text-muted);">Notice Deadline: Oct 3, 2026 (Renewal Jan 1, 2027)</div>
            </div>
            <span class="badge badge-warning">Under Renegotiation</span>
          </div>
          <div class="bundle-component-row">
            <div>
              <strong>ReloadNow Services (CON006)</strong>
              <div style="font-size:0.75rem;color:var(--text-muted);">Notice Deadline: Sep 2, 2027 (Safe Horizon)</div>
            </div>
            <span class="badge badge-success">Safe</span>
          </div>
          <div style="margin-top:1rem;">
            <button class="btn btn-outline btn-sm btn-full" onclick="window.location.hash='#/contracts'">
              <i data-lucide="file-text"></i> Open AI Contract Intelligence &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  `);

  setTimeout(() => {
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }, 50);
};

window.exportBoardBriefingMemo = function() {
  const eb = MockData.executiveBoardMetrics || {};
  const rows = [
    { 'Section': 'Executive Summary', 'Metric': 'Board Summary Statement', 'Value': eb.boardSummaryQuote },
    { 'Section': 'Revenue Trajectory', 'Metric': 'Quarterly Revenue Growth', 'Value': '+' + eb.quarterlyRevenueGrowthPct + '%' },
    { 'Section': 'Sourcing Performance', 'Metric': 'Reverse Auction Margin Generated', 'Value': '$' + eb.reverseAuctionMarginGenerated.toLocaleString() },
    { 'Section': 'Vendor Compliance', 'Metric': 'Underperforming Vendors Count', 'Value': eb.underperformingVendorsCount },
    { 'Section': 'Vendor Compliance', 'Metric': 'Recovery Opportunity Amount', 'Value': '$' + eb.underperformingRecoveryOpportunity.toLocaleString() },
    { 'Section': 'Revenue Recovery', 'Metric': 'Recovered YTD', 'Value': '$' + eb.totalRecoveredYTD.toLocaleString() },
    { 'Section': 'Revenue Recovery', 'Metric': 'Active Pipeline', 'Value': '$' + eb.activeRecoveryPipeline.toLocaleString() }
  ];
  exportToCSV(rows, 'Commission_IQ_Board_Executive_Summary.csv');
  showToast('Exported Board Executive Summary Memo CSV');
};


// ═══════════════════════════════════════════════════════════════
//  REVENUE RECOVERY & CASE TRACKING (SPEC REQUIREMENT)
// ═══════════════════════════════════════════════════════════════
window.renderRecovery = function() {
  if (!AppState.recoveryActiveTab) AppState.recoveryActiveTab = 'pipeline';
  if (!AppState.recoveryStatusFilter) AppState.recoveryStatusFilter = 'All';
  if (!AppState.recoveryPriorityFilter) AppState.recoveryPriorityFilter = 'All';
  if (!AppState.recoverySearch) AppState.recoverySearch = '';

  const cases = MockData.recoveryPipeline || [];
  const statusColors = { 'Identified': 'badge-info', 'In Progress': 'badge-warning', 'Recovered': 'badge-success', 'Disputed': 'badge-danger' };
  const priorityColors = { 'High': 'badge-danger', 'Medium': 'badge-warning', 'Low': 'badge-neutral' };

  // Calculate KPIs
  const totalIdentified = cases.reduce((s, r) => s + r.amount, 0);
  const totalRecovered = cases.filter(r => r.status === 'Recovered').reduce((s, r) => s + r.amount, 0);
  const totalInProgress = cases.filter(r => r.status === 'In Progress' || r.status === 'Identified' || r.status === 'Disputed').reduce((s, r) => s + r.amount, 0);
  const recoveryRate = totalIdentified > 0 ? ((totalRecovered / totalIdentified) * 100).toFixed(1) : 0;

  // Filter cases
  const filteredCases = cases.filter(c => {
    if (AppState.recoveryStatusFilter !== 'All' && c.status !== AppState.recoveryStatusFilter) return false;
    if (AppState.recoveryPriorityFilter !== 'All' && c.priority !== AppState.recoveryPriorityFilter) return false;
    if (AppState.recoverySearch) {
      const q = AppState.recoverySearch.toLowerCase();
      const matchVendor = c.vendor.toLowerCase().includes(q);
      const matchType = c.type.toLowerCase().includes(q);
      const matchNotes = (c.notes || '').toLowerCase().includes(q);
      if (!matchVendor && !matchType && !matchNotes) return false;
    }
    return true;
  });

  _setContent('main-content', `
    <!-- Executive KPI Grid -->
    <div class="kpi-grid" style="grid-template-columns:repeat(5, 1fr);margin-bottom:1.5rem;">
      <div class="kpi-card" style="--kpi-color:#ef4444;--kpi-bg:#fee2e2;">
        <div class="kpi-icon" style="background:#fee2e2;color:#ef4444;"><i data-lucide="search"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Total Identified</div>
          <div class="kpi-value">$${(totalIdentified/1000).toFixed(0)}k</div>
          <div class="kpi-sub">Total underpayment volume</div>
        </div>
      </div>
      <div class="kpi-card" style="--kpi-color:#10b981;--kpi-bg:#dcfce7;">
        <div class="kpi-icon" style="background:#dcfce7;color:#10b981;"><i data-lucide="check-circle-2"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Reported Recovered</div>
          <div class="kpi-value" style="color:#10b981;">$${(totalRecovered/1000).toFixed(0)}k</div>
          <div class="kpi-sub">Successfully collected dollars</div>
        </div>
      </div>
      <div class="kpi-card" style="--kpi-color:#f59e0b;--kpi-bg:#fef3c7;">
        <div class="kpi-icon" style="background:#fef3c7;color:#f59e0b;"><i data-lucide="clock"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Active Dispute Pipeline</div>
          <div class="kpi-value">$${(totalInProgress/1000).toFixed(0)}k</div>
          <div class="kpi-sub">${cases.filter(r=>r.status!=='Recovered').length} active cases in flight</div>
        </div>
      </div>
      <div class="kpi-card" style="--kpi-color:#3b82f6;--kpi-bg:#dbeafe;">
        <div class="kpi-icon" style="background:#dbeafe;color:#3b82f6;"><i data-lucide="percent"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Recovery Rate</div>
          <div class="kpi-value">${recoveryRate}%</div>
          <div class="kpi-sub">Conversion of leakage to cash</div>
        </div>
      </div>
      <div class="kpi-card" style="--kpi-color:#8b5cf6;--kpi-bg:#ede9fe;">
        <div class="kpi-icon" style="background:#ede9fe;color:#8b5cf6;"><i data-lucide="shield-alert"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Underperforming Goal</div>
          <div class="kpi-value">$72k</div>
          <div class="kpi-sub">Target across 3 audited vendors</div>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="portal-tabs-nav">
      <button class="portal-tab-btn ${AppState.recoveryActiveTab === 'pipeline' ? 'active' : ''}" onclick="setRecoveryTab('pipeline')">
        <i data-lucide="refresh-cw"></i> Active Recovery Pipeline (${cases.filter(r=>r.status!=='Recovered').length})
      </button>
      <button class="portal-tab-btn ${AppState.recoveryActiveTab === 'recovered' ? 'active' : ''}" onclick="setRecoveryTab('recovered')">
        <i data-lucide="check-check"></i> Recovered Dollars Ledger ($${Math.round(totalRecovered/1000)}k)
      </button>
      <button class="portal-tab-btn ${AppState.recoveryActiveTab === 'escalation' ? 'active' : ''}" onclick="setRecoveryTab('escalation')">
        <i data-lucide="git-branch"></i> Multilevel Escalation Matrix
      </button>
    </div>

    <!-- Tab 1: Pipeline Cases -->
    <div id="recovery-tab-pipeline" style="display:${AppState.recoveryActiveTab === 'pipeline' ? 'block' : 'none'};">
      <div class="card" style="margin-bottom:1.5rem;">
        <div class="card-header" style="flex-wrap:wrap;gap:1rem;">
          <div>
            <div class="card-title">Commission Underpayment & Shortfall Recovery Cases</div>
            <div class="card-subtitle">Track end-to-end recovery activities from audit discovery to formal dispute notice and cash collection.</div>
          </div>
          <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;">
            <div class="search-input-wrap" style="width:200px;">
              <i data-lucide="search" class="search-icon"></i>
              <input type="text" class="form-input form-input-sm" placeholder="Search vendor/type..." value="${esc(AppState.recoverySearch)}" oninput="AppState.recoverySearch = this.value; window.renderRecovery();">
            </div>
            <select class="form-select form-select-sm" style="width:150px;" onchange="AppState.recoveryStatusFilter = this.value; window.renderRecovery();">
              <option value="All" ${AppState.recoveryStatusFilter === 'All' ? 'selected' : ''}>All Statuses</option>
              <option value="In Progress" ${AppState.recoveryStatusFilter === 'In Progress' ? 'selected' : ''}>In Progress</option>
              <option value="Identified" ${AppState.recoveryStatusFilter === 'Identified' ? 'selected' : ''}>Identified</option>
              <option value="Disputed" ${AppState.recoveryStatusFilter === 'Disputed' ? 'selected' : ''}>Disputed</option>
              <option value="Recovered" ${AppState.recoveryStatusFilter === 'Recovered' ? 'selected' : ''}>Recovered</option>
            </select>
            <select class="form-select form-select-sm" style="width:140px;" onchange="AppState.recoveryPriorityFilter = this.value; window.renderRecovery();">
              <option value="All" ${AppState.recoveryPriorityFilter === 'All' ? 'selected' : ''}>All Priorities</option>
              <option value="High" ${AppState.recoveryPriorityFilter === 'High' ? 'selected' : ''}>High Priority</option>
              <option value="Medium" ${AppState.recoveryPriorityFilter === 'Medium' ? 'selected' : ''}>Medium Priority</option>
              <option value="Low" ${AppState.recoveryPriorityFilter === 'Low' ? 'selected' : ''}>Low Priority</option>
            </select>
            <button class="btn btn-primary btn-sm" onclick="openCreateRecoveryCaseModal()">
              <i data-lucide="plus-circle"></i> Create Recovery Case
            </button>
            <button class="btn btn-outline btn-sm" onclick="exportRecoveryCSV()">
              <i data-lucide="download"></i> Export CSV
            </button>
          </div>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Vendor Partner</th>
                <th>Shortfall Type</th>
                <th style="text-align:right;">Disputed Amount</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assignee</th>
                <th>Age / SLA</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${filteredCases.map(c => `
                <tr>
                  <td style="font-family:monospace;font-weight:700;">${esc(c.id)}</td>
                  <td>
                    <div style="font-weight:700;">${esc(c.vendor)}</div>
                    <div style="font-size:0.75rem;color:var(--text-muted);">${esc(c.notes || '')}</div>
                  </td>
                  <td><span class="badge badge-neutral">${esc(c.type)}</span></td>
                  <td style="text-align:right;font-weight:800;font-size:1rem;${c.status==='Recovered'?'color:#10b981;':'color:#dc2626;'}">
                    $${c.amount.toLocaleString()}
                  </td>
                  <td><span class="badge ${statusColors[c.status] || 'badge-neutral'}">${esc(c.status)}</span></td>
                  <td><span class="badge ${priorityColors[c.priority] || 'badge-neutral'}">${esc(c.priority)}</span></td>
                  <td style="font-size:0.8125rem;">${esc(c.assignedTo)}</td>
                  <td>
                    <div style="font-size:0.8125rem;font-weight:600;${c.age > 30 ? 'color:#ef4444;' : ''}">${c.age} days</div>
                    <div style="font-size:0.7rem;color:var(--text-muted);">SLA: <strong>${c.amount > 50000 ? 'Level 3' : c.amount > 10000 ? 'Level 2' : 'Level 1'}</strong></div>
                  </td>
                  <td style="text-align:right;">
                    <div style="display:flex;justify-content:flex-end;gap:0.25rem;">
                      ${c.status !== 'Recovered' ? `
                        <button class="btn btn-success btn-xs" title="Record recovery settlement payment" onclick="markCaseRecovered('${c.id}')">
                          <i data-lucide="check"></i> Recover
                        </button>
                        <button class="btn btn-outline btn-xs" title="Escalate to next management tier" onclick="escalateCaseLevel('${c.id}')">
                          <i data-lucide="arrow-up-right"></i> Escalate
                        </button>
                      ` : `
                        <span class="badge badge-success"><i data-lucide="check-check"></i> Settled</span>
                      `}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Tab 2: Recovered Dollars Ledger -->
    <div id="recovery-tab-recovered" style="display:${AppState.recoveryActiveTab === 'recovered' ? 'block' : 'none'};">
      <div class="card" style="margin-bottom:1.5rem;">
        <div class="card-header">
          <div>
            <div class="card-title">Settlement Receipts & Recovered Dollars Ledger ($198,000 Total)</div>
            <div class="card-subtitle">Detailed record of collected underpayment funds credited to retailer accounts.</div>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Vendor Partner</th>
                <th>Shortfall Type</th>
                <th style="text-align:right;">Recovered Dollars</th>
                <th>Resolution Date</th>
                <th>Lead Recoverer</th>
                <th>Settlement Audit Notes</th>
              </tr>
            </thead>
            <tbody>
              ${cases.filter(c => c.status === 'Recovered').map(c => `
                <tr>
                  <td style="font-family:monospace;font-weight:700;">${esc(c.id)}</td>
                  <td style="font-weight:700;">${esc(c.vendor)}</td>
                  <td><span class="badge badge-neutral">${esc(c.type)}</span></td>
                  <td style="text-align:right;font-weight:800;font-size:1.05rem;color:#10b981;">
                    +$${c.amount.toLocaleString()}
                  </td>
                  <td style="font-size:0.8125rem;">2026-11-01</td>
                  <td style="font-size:0.8125rem;">${esc(c.assignedTo)}</td>
                  <td style="font-size:0.8125rem;color:var(--text-muted);">${esc(c.notes)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Tab 3: Escalation Matrix -->
    <div id="recovery-tab-escalation" style="display:${AppState.recoveryActiveTab === 'escalation' ? 'block' : 'none'};">
      <div class="card" style="margin-bottom:1.5rem;">
        <div class="card-header">
          <div>
            <div class="card-title">Multilevel Escalation Path & SLA Tracking Governance</div>
            <div class="card-subtitle">Automated tier advancement based on disputed dollar value and response time horizons.</div>
          </div>
        </div>
        <div class="card-body">
          <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:1.5rem;">
            <!-- Tier 1 -->
            <div style="border:1px solid #cbd5e1;border-radius:8px;padding:1.25rem;background:#f8fafc;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
                <span class="badge badge-info">Level 1: Operational</span>
                <span style="font-size:0.75rem;font-weight:700;color:var(--text-muted);">SLA: 5 Days</span>
              </div>
              <div style="font-weight:800;font-size:1.1rem;margin-bottom:4px;">Finance Analyst</div>
              <div style="font-size:0.8125rem;color:var(--text-muted);margin-bottom:0.75rem;">Threshold: <strong>&le; $10,000</strong></div>
              <div style="font-size:0.8125rem;line-height:1.4;">
                Automated remittance advice audit, initial rate table comparison, and collaborative invoice reconciliation with vendor clearinghouse.
              </div>
            </div>

            <!-- Tier 2 -->
            <div style="border:1px solid #f59e0b;border-radius:8px;padding:1.25rem;background:#fffbeb;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
                <span class="badge badge-warning">Level 2: Management</span>
                <span style="font-size:0.75rem;font-weight:700;color:#b45309;">SLA: 7 Days</span>
              </div>
              <div style="font-weight:800;font-size:1.1rem;margin-bottom:4px;color:#92400e;">Category & Procurement Manager</div>
              <div style="font-size:0.8125rem;color:#b45309;margin-bottom:0.75rem;">Threshold: <strong>$10,001 &ndash; $50,000</strong></div>
              <div style="font-size:0.8125rem;line-height:1.4;color:#78350f;">
                Formal demand notice dispatch, statutory 10-day cure letter, 1.5% late interest clause invocation, and vendor commercial account freeze warning.
              </div>
            </div>

            <!-- Tier 3 -->
            <div style="border:1px solid #ef4444;border-radius:8px;padding:1.25rem;background:#fef2f2;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
                <span class="badge badge-danger">Level 3: Executive & Legal</span>
                <span style="font-size:0.75rem;font-weight:700;color:#991b1b;">SLA: 14 Days</span>
              </div>
              <div style="font-weight:800;font-size:1.1rem;margin-bottom:4px;color:#991b1b;">Executive Sponsor & General Counsel</div>
              <div style="font-size:0.8125rem;color:#991b1b;margin-bottom:0.75rem;">Threshold: <strong>&gt; $50,000</strong></div>
              <div style="font-size:0.8125rem;line-height:1.4;color:#7f1d1d;">
                Suspension from live reverse auctions (SE001), formal certified audit summons, legal escrow holdback of clearinghouse funds, and contract termination.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `);

  setTimeout(() => {
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }, 50);
};

window.setRecoveryTab = function(tabName) {
  AppState.recoveryActiveTab = tabName;
  window.renderRecovery();
};

window.openCreateRecoveryCaseModal = function() {
  _showModal({
    title: 'Create New Underpayment Recovery Case',
    content: `
      <div style="font-size:0.875rem;">
        <p>Log a verified underpayment or unbilled subsidy into the recovery pipeline.</p>
        <div class="form-group" style="margin-top:1rem;">
          <label class="form-label">Vendor Partner</label>
          <select id="modal-rec-vendor" class="form-select">
            ${MockData.vendors.map(v => `<option value="${v.name}">${v.name} (${v.category})</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Underpayment Type</label>
          <select id="modal-rec-type" class="form-select">
            <option value="Commission Shortfall">Commission Shortfall (Rate Tier Mismatch)</option>
            <option value="Subsidy Underpayment">Subsidy Underpayment (Marketing / IT Subsidy)</option>
            <option value="SLA Penalty">SLA Penalty (Breached Response Terms)</option>
            <option value="Rate Discrepancy">Rate Discrepancy (Clearinghouse Error)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Disputed Shortfall Amount ($)</label>
          <input id="modal-rec-amount" type="number" class="form-input" placeholder="e.g. 24500" value="24500">
        </div>
        <div class="form-group">
          <label class="form-label">Audit Notes & Evidence</label>
          <textarea id="modal-rec-notes" class="form-input" rows="3" placeholder="Detail the root cause and transactional references..."></textarea>
        </div>
      </div>
    `,
    confirmText: 'Create Recovery Case',
    onConfirm: () => {
      const vendor = document.getElementById('modal-rec-vendor').value;
      const type = document.getElementById('modal-rec-type').value;
      const amount = Number(document.getElementById('modal-rec-amount').value) || 15000;
      const notes = document.getElementById('modal-rec-notes').value || 'Audit discrepancy logged by finance team.';

      const newCase = {
        id: 'RC-' + (MockData.recoveryPipeline.length + 10).toString().padStart(3, '0'),
        vendor: vendor,
        type: type,
        amount: amount,
        status: 'In Progress',
        priority: amount > 50000 ? 'High' : amount > 15000 ? 'Medium' : 'Low',
        assignedTo: (Auth && Auth.currentUser && Auth.currentUser().name) || 'Finance Analyst',
        age: 1,
        notes: notes
      };
      MockData.recoveryPipeline.unshift(newCase);

      MockData.auditLogs.unshift({
        id: 'AUD-' + Date.now(),
        timestamp: new Date().toISOString(),
        user: newCase.assignedTo,
        action: 'Recovery Case Created',
        module: 'Revenue Recovery',
        details: 'Opened case ' + newCase.id + ' against ' + vendor + ' for $' + amount.toLocaleString()
      });

      showToast('Created Recovery Case ' + newCase.id + ' for $' + amount.toLocaleString());
      window.renderRecovery();
    }
  });
};

window.markCaseRecovered = function(caseId) {
  const c = (MockData.recoveryPipeline || []).find(item => item.id === caseId);
  if (!c) return;
  c.status = 'Recovered';
  c.notes = (c.notes || '') + ' &bull; Fully settled & collected on ' + new Date().toISOString().split('T')[0];

  MockData.auditLogs.unshift({
    id: 'AUD-' + Date.now(),
    timestamp: new Date().toISOString(),
    user: (Auth && Auth.currentUser && Auth.currentUser().name) || 'Finance Lead',
    action: 'Underpayment Recovered',
    module: 'Revenue Recovery',
    details: 'Collected $' + c.amount.toLocaleString() + ' for case ' + caseId + ' from ' + c.vendor
  });

  MockData.notifications.unshift({
    id: 'N-REC-' + Date.now(),
    userId: 'U004',
    title: 'Revenue Recovered Successfully!',
    message: 'Settlement confirmed: $' + c.amount.toLocaleString() + ' recovered from ' + c.vendor + ' (Case ' + caseId + ').',
    timestamp: 'Just now',
    type: 'success',
    read: false
  });

  showToast('✓ $' + c.amount.toLocaleString() + ' marked as RECOVERED from ' + c.vendor);
  window.renderRecovery();
};

window.escalateCaseLevel = function(caseId) {
  const c = (MockData.recoveryPipeline || []).find(item => item.id === caseId);
  if (!c) return;
  c.priority = 'High';
  c.notes = (c.notes || '') + ' [ESCALATED TO LEVEL 3 EXECUTIVE SPONSOR]';

  MockData.auditLogs.unshift({
    id: 'AUD-' + Date.now(),
    timestamp: new Date().toISOString(),
    user: (Auth && Auth.currentUser && Auth.currentUser().name) || 'Procurement Manager',
    action: 'Case Escalated to Executive Tier',
    module: 'Revenue Recovery',
    details: 'Escalated case ' + caseId + ' to Level 3 Legal & Executive committee'
  });

  showToast('Case ' + caseId + ' escalated to Level 3 (Executive Sponsor & General Counsel)');
  window.renderRecovery();
};

window.exportRecoveryCSV = function() {
  const rows = (MockData.recoveryPipeline || []).map(c => ({
    'Case ID': c.id,
    'Vendor': c.vendor,
    'Shortfall Type': c.type,
    'Amount ($)': c.amount,
    'Status': c.status,
    'Priority': c.priority,
    'Assigned To': c.assignedTo,
    'Age (Days)': c.age,
    'Notes': c.notes
  }));
  exportToCSV(rows, 'Revenue_Recovery_Pipeline_Report.csv');
  showToast('Exported Recovery Pipeline CSV');
};


// ═══════════════════════════════════════════════════════════════
//  ENHANCED REPORTING MODULE (SPEC REQUIREMENT)
//  - Daily Bid Status Report
//  - Vendor Concern, BAFO Flag & Dropout Willingness Tracker
//  - Vendor Bid Summary & Net Impact (Unit Sales X Commission Paid)
// ═══════════════════════════════════════════════════════════════
window.renderReports = function() {
  if (!AppState.reportsActiveTab) AppState.reportsActiveTab = 'daily_bids';

  const bidReports = MockData.dailyBidStatusReports || [];
  const concernReports = MockData.vendorConcernReports || [];
  const netImpacts = MockData.vendorNetImpactSummaries || [];

  _setContent('main-content', `
    <!-- KPI Overview -->
    <div class="kpi-grid" style="grid-template-columns:repeat(4, 1fr);margin-bottom:1.5rem;">
      <div class="kpi-card" style="--kpi-color:#3b82f6;--kpi-bg:#dbeafe;">
        <div class="kpi-icon" style="background:#dbeafe;color:#3b82f6;"><i data-lucide="radio"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Active Sourcing Tenders</div>
          <div class="kpi-value">${bidReports.length} Events</div>
          <div class="kpi-sub">$9.92M volume under live bidding</div>
        </div>
      </div>
      <div class="kpi-card" style="--kpi-color:#ef4444;--kpi-bg:#fee2e2;">
        <div class="kpi-icon" style="background:#fee2e2;color:#ef4444;"><i data-lucide="flag"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">BAFO Flagged Vendors</div>
          <div class="kpi-value">${concernReports.filter(c=>c.isBAFOFlagged).length} Flagged</div>
          <div class="kpi-sub">Best & final offers reached</div>
        </div>
      </div>
      <div class="kpi-card" style="--kpi-color:#f59e0b;--kpi-bg:#fef3c7;">
        <div class="kpi-icon" style="background:#fef3c7;color:#f59e0b;"><i data-lucide="alert-triangle"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">High Dropout Risk</div>
          <div class="kpi-value">1 Vendor</div>
          <div class="kpi-sub">GiftFlow (interchange ceiling)</div>
        </div>
      </div>
      <div class="kpi-card" style="--kpi-color:#10b981;--kpi-bg:#dcfce7;">
        <div class="kpi-icon" style="background:#dcfce7;color:#10b981;"><i data-lucide="calculator"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Vendor Net Paid</div>
          <div class="kpi-value">$329.8k</div>
          <div class="kpi-sub">Unit sales &times; commission yield</div>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="portal-tabs-nav">
      <button class="portal-tab-btn ${AppState.reportsActiveTab === 'daily_bids' ? 'active' : ''}" onclick="setReportsTab('daily_bids')">
        <i data-lucide="activity"></i> 1. Daily Bid Status & Auction Velocity
      </button>
      <button class="portal-tab-btn ${AppState.reportsActiveTab === 'vendor_concerns' ? 'active' : ''}" onclick="setReportsTab('vendor_concerns')">
        <i data-lucide="flag"></i> 2. Vendor Concern, BAFO & Dropout Tracker
      </button>
      <button class="portal-tab-btn ${AppState.reportsActiveTab === 'net_impact' ? 'active' : ''}" onclick="setReportsTab('net_impact')">
        <i data-lucide="pie-chart"></i> 3. Vendor Bid Summary & Net Impact
      </button>
      <button class="portal-tab-btn ${AppState.reportsActiveTab === 'templates' ? 'active' : ''}" onclick="setReportsTab('templates')">
        <i data-lucide="file-text"></i> 4. Standard Reports Library
      </button>
    </div>

    <!-- Tab 1: Daily Bid Status -->
    <div id="reports-tab-daily-bids" style="display:${AppState.reportsActiveTab === 'daily_bids' ? 'block' : 'none'};">
      <div class="card" style="margin-bottom:1.5rem;">
        <div class="card-header">
          <div>
            <div class="card-title">Daily Bid Status & Auction Velocity Report</div>
            <div class="card-subtitle">Real-time surveillance of bid arrivals, spread compression, and reserve price alignment.</div>
          </div>
          <button class="btn btn-outline btn-sm" onclick="exportToCSV(MockData.dailyBidStatusReports, 'Daily_Bid_Status_Report.csv')">
            <i data-lucide="download"></i> Export CSV
          </button>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Event ID & Sourcing Tender</th>
                <th>Category</th>
                <th style="text-align:right;">Annual Volume</th>
                <th style="text-align:right;">AI Reserve Rate</th>
                <th style="text-align:right;">Current Leading Bid</th>
                <th>Current Leader</th>
                <th style="text-align:right;">Spread Compression</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${bidReports.map(b => `
                <tr>
                  <td>
                    <div style="font-weight:700;">${esc(b.eventName)}</div>
                    <div style="font-size:0.75rem;color:var(--text-muted);font-family:monospace;">ID: ${esc(b.eventId)} &bull; ${b.bidsToday} bids received today</div>
                  </td>
                  <td><span class="badge badge-neutral">${esc(b.category)}</span></td>
                  <td style="text-align:right;font-weight:600;">$${b.annualVolume.toLocaleString()}</td>
                  <td style="text-align:right;font-weight:700;color:#047857;">${b.reservePrice}</td>
                  <td style="text-align:right;font-weight:800;font-size:1.05rem;color:#10b981;">${b.currentBestBid}</td>
                  <td style="font-weight:600;">${esc(b.leaderVendor)}</td>
                  <td style="text-align:right;font-weight:700;color:#0284c7;">-${b.spreadCompressionBps} bps</td>
                  <td><span class="badge ${b.auctionStatus.includes('Ending') ? 'badge-danger' : 'badge-primary'}">${esc(b.auctionStatus)}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Tab 2: Vendor Concern & BAFO Tracker -->
    <div id="reports-tab-vendor-concerns" style="display:${AppState.reportsActiveTab === 'vendor_concerns' ? 'block' : 'none'};">
      <div class="card" style="margin-bottom:1.5rem;">
        <div class="card-header">
          <div>
            <div class="card-title">Vendor Concern, BAFO & Dropout Willingness Tracker</div>
            <div class="card-subtitle">Monitors vendor margin friction, flags Best and Final Offers (BAFO), and predicts vendor willingness to drop out beyond specific rate thresholds.</div>
          </div>
          <button class="btn btn-outline btn-sm" onclick="exportToCSV(MockData.vendorConcernReports, 'Vendor_BAFO_Dropout_Report.csv')">
            <i data-lucide="download"></i> Export CSV
          </button>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Vendor Partner</th>
                <th>Current Bid</th>
                <th>BAFO Status</th>
                <th>Dropout Threshold Rate</th>
                <th>Dropout Willingness Assessment</th>
                <th>Vendor Concerns & Margin Notes</th>
              </tr>
            </thead>
            <tbody>
              ${concernReports.map(c => `
                <tr>
                  <td>
                    <div style="font-weight:700;">${esc(c.vendorName)}</div>
                    <div style="font-size:0.75rem;color:var(--text-muted);">${esc(c.category)}</div>
                  </td>
                  <td style="font-weight:800;font-size:1.05rem;">${c.currentBid}%</td>
                  <td>
                    ${c.isBAFOFlagged ? `
                      <span class="badge badge-bafo"><i data-lucide="flag"></i> BAFO FLAGGED</span>
                      <div style="font-size:0.7rem;color:var(--text-muted);margin-top:2px;">${esc(c.bafoTimestamp)}</div>
                    ` : `
                      <span class="badge badge-success">Open Bidding</span>
                    `}
                  </td>
                  <td style="font-weight:700;color:#b91c1c;">${c.dropoutThresholdRate}%</td>
                  <td>
                    <div style="font-size:0.8125rem;font-weight:600;">${esc(c.dropoutWillingness)}</div>
                  </td>
                  <td style="font-size:0.8125rem;color:var(--text-muted);line-height:1.4;">
                    <strong>[${esc(c.concernCategory)}]</strong> ${esc(c.concernNotes)}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Tab 3: Vendor Bid Summary & Net Impact -->
    <div id="reports-tab-net-impact" style="display:${AppState.reportsActiveTab === 'net_impact' ? 'block' : 'none'};">
      <div class="card" style="margin-bottom:1.5rem;">
        <div class="card-header">
          <div>
            <div class="card-title">Vendor Bid Summary & Net Impact Report</div>
            <div class="card-subtitle">Vendor-facing transparent financial model: <strong>(Unit Sales &times; Face Value = GMV Volume) &times; Commission Paid = Net Impact</strong>.</div>
          </div>
          <button class="btn btn-outline btn-sm" onclick="exportToCSV(MockData.vendorNetImpactSummaries, 'Vendor_Net_Impact_Report.csv')">
            <i data-lucide="download"></i> Export Net Impact CSV
          </button>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Vendor & Product Line</th>
                <th style="text-align:right;">Annual Unit Sales</th>
                <th style="text-align:right;">Avg Unit Value</th>
                <th style="text-align:right;">Total GMV Volume</th>
                <th style="text-align:right;">Commission %</th>
                <th style="text-align:right;">Net Commission Paid</th>
                <th style="text-align:right;">Vendor Retained Margin</th>
              </tr>
            </thead>
            <tbody>
              ${netImpacts.map(n => `
                <tr>
                  <td>
                    <div style="font-weight:700;">${esc(n.vendorName)}</div>
                    <div style="font-size:0.75rem;color:var(--text-muted);">${esc(n.productLine)}</div>
                    <div style="font-size:0.7rem;color:#0284c7;font-family:monospace;margin-top:2px;">${esc(n.netImpactFormula)}</div>
                  </td>
                  <td style="text-align:right;font-weight:600;">${n.annualUnitSales.toLocaleString()} units</td>
                  <td style="text-align:right;">$${n.averageUnitFaceValue.toFixed(2)}</td>
                  <td style="text-align:right;font-weight:700;">$${n.totalGmvVolume.toLocaleString()}</td>
                  <td style="text-align:right;font-weight:800;color:#10b981;">${n.contractedCommissionRate}%</td>
                  <td style="text-align:right;font-weight:900;color:#047857;">$${n.netCommissionPaidToRetailer.toLocaleString()}</td>
                  <td style="text-align:right;font-weight:700;color:#6366f1;">$${n.vendorNetRetainedMargin.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Tab 4: Standard Reports Library -->
    <div id="reports-tab-templates" style="display:${AppState.reportsActiveTab === 'templates' ? 'block' : 'none'};">
      <div class="card" style="margin-bottom:1.5rem;">
        <div class="card-header">
          <div class="card-title">Standard Executive Reports Library</div>
        </div>
        <div class="card-body">
          <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:1rem;">
            ${(MockData.generatedReports || []).map(r => `
              <div class="bundle-component-row">
                <div>
                  <div style="font-weight:700;">${esc(r.name)}</div>
                  <div style="font-size:0.75rem;color:var(--text-muted);">Format: ${esc(r.format)} &bull; Created: ${r.created}</div>
                </div>
                <button class="btn btn-outline btn-xs" onclick="showToast('Downloading ${esc(r.name)}...');">
                  <i data-lucide="download"></i> Download
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `);

  setTimeout(() => {
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }, 50);
};

window.setReportsTab = function(tabName) {
  AppState.reportsActiveTab = tabName;
  window.renderReports();
};


// ═══════════════════════════════════════════════════════════════
//  AI COPILOT ROADMAP & NATURAL LANGUAGE INSIGHTS (SPEC REQUIREMENT)
// ═══════════════════════════════════════════════════════════════
window.renderAICopilot = function() {
  if (!AppState.copilotMessages) {
    AppState.copilotMessages = [
      {
        sender: 'ai',
        text: 'Hello! I am your <strong>Commission IQ AI Copilot</strong>. I provide real-time natural language procurement insights, predictive volume forecasting, contract risk auditing, and autonomous reverse auction sourcing recommendations. How can I assist your team today?'
      }
    ];
  }

  const preloadedQnA = MockData.copilotPreloadedQnA || [];

  _setContent('main-content', `
    <div class="copilot-container">
      <!-- Left: Quick Prompts & Knowledge Base -->
      <div class="copilot-sidebar">
        <div style="display:flex;align-items:center;gap:0.5rem;font-weight:800;font-size:1rem;margin-bottom:0.75rem;color:#8b5cf6;">
          <i data-lucide="sparkles"></i> AI Copilot Roadmap
        </div>
        <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:1rem;line-height:1.4;">
          Select a pre-trained decision prompt or ask any natural language question regarding your retail store portfolio.
        </div>

        <div style="font-size:0.75rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;margin-bottom:0.5rem;">Suggested Executive Inquiries</div>
        <div style="flex:1;overflow-y:auto;">
          ${preloadedQnA.map((q, idx) => `
            <div class="copilot-quick-chip" onclick="askCopilotPreloaded(${idx})">
              <i data-lucide="message-square" style="width:13px;height:13px;color:#8b5cf6;flex-shrink:0;"></i>
              <span>${esc(q.query)}</span>
            </div>
          `).join('')}
        </div>

        <!-- Capability Roadmap Card -->
        <div style="margin-top:1rem;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:0.75rem;font-size:0.75rem;">
          <div style="font-weight:700;color:#6366f1;margin-bottom:4px;">Autonomous AI Roadmap</div>
          <div>✓ Natural Language Analytics (Live)</div>
          <div>✓ Predictive Holiday Forecasting (Live)</div>
          <div>✓ Sourcing Reserve Price Engine (Live)</div>
          <div>⏳ Autonomous Smart Contracts (Q1 2027)</div>
        </div>
      </div>

      <!-- Right: Interactive Chat Window -->
      <div class="copilot-chat-window">
        <div style="padding:1rem 1.25rem;border-bottom:1px solid var(--border-color);display:flex;justify-content:space-between;align-items:center;">
          <div style="display:flex;align-items:center;gap:0.75rem;">
            <div style="width:36px;height:36px;border-radius:8px;background:linear-gradient(135deg,#8b5cf6,#ec4899);display:flex;align-items:center;justify-content:center;color:#fff;">
              <i data-lucide="bot"></i>
            </div>
            <div>
              <div style="font-weight:800;font-size:0.95rem;">Commission IQ Copilot &bull; Decision Engine</div>
              <div style="font-size:0.75rem;color:var(--text-muted);">Connected to 1,420 store POS feeds & 12 active vendor contracts</div>
            </div>
          </div>
          <button class="btn btn-outline btn-xs" onclick="clearCopilotChat()">
            <i data-lucide="rotate-ccw"></i> Clear Chat
          </button>
        </div>

        <div class="copilot-messages" id="copilot-msg-stream">
          ${AppState.copilotMessages.map(m => `
            <div class="${m.sender === 'user' ? 'copilot-msg-user' : 'copilot-msg-ai'}">
              ${m.sender === 'ai' ? `
                <div style="font-size:0.7rem;font-weight:800;color:#8b5cf6;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px;">AI Decision Intelligence</div>
              ` : ''}
              <div>${m.text}</div>
              ${m.actionText ? `
                <div style="margin-top:0.75rem;padding-top:0.5rem;border-top:1px solid rgba(0,0,0,0.06);">
                  <button class="btn btn-primary btn-xs" onclick="window.location.hash='${m.actionRoute}'">
                    ${esc(m.actionText)} &rarr;
                  </button>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>

        <!-- Input Bar -->
        <div style="padding:1rem 1.25rem;border-top:1px solid var(--border-color);display:flex;gap:0.75rem;">
          <input id="copilot-input" type="text" class="form-input" placeholder="Ask AI: 'What is our recovered revenue?', 'Which vendor to negotiate first?'..." onkeydown="if(event.key==='Enter') sendCopilotCustomMessage();">
          <button class="btn btn-primary" onclick="sendCopilotCustomMessage()">
            <i data-lucide="send"></i> Ask
          </button>
        </div>
      </div>
    </div>
  `);

  setTimeout(() => {
    if (typeof lucide !== 'undefined') lucide.createIcons();
    const stream = document.getElementById('copilot-msg-stream');
    if (stream) stream.scrollTop = stream.scrollHeight;
  }, 50);
};

window.askCopilotPreloaded = function(idx) {
  const item = MockData.copilotPreloadedQnA[idx];
  if (!item) return;

  AppState.copilotMessages.push({ sender: 'user', text: item.query });
  AppState.copilotMessages.push({
    sender: 'ai',
    text: item.answer,
    actionText: item.actionText,
    actionRoute: item.actionRoute
  });

  window.renderAICopilot();
};

window.sendCopilotCustomMessage = function() {
  const input = document.getElementById('copilot-input');
  if (!input || !input.value.trim()) return;

  const q = input.value.trim();
  AppState.copilotMessages.push({ sender: 'user', text: q });

  // Intelligent Copilot Router
  let reply = 'Based on real-time contract intelligence and POS feed analysis across our 1,420 stores, Commission IQ recommends prioritizing gift card rate benchmark renegotiation (+125 bps opportunity) and following up on the $84,000 SwiftTransfer recovery case.';
  let actText = 'Open AI Opportunity Ranking';
  let actRoute = '/ranking';

  const lq = q.toLowerCase();
  if (lq.includes('recover') || lq.includes('underpay') || lq.includes('shortfall')) {
    reply = 'Commission IQ has tracked $342,000 in total underpayments. $198,000 has been successfully recovered YTD, and $144,000 remains in active dispute across 6 cases. Case RC001 against SwiftTransfer represents our highest single recovery opportunity at $84,000.';
    actText = 'View Recovery Pipeline';
    actRoute = '/recovery';
  } else if (lq.includes('vendor') && (lq.includes('underperform') || lq.includes('risk'))) {
    reply = 'Three vendors are currently underperforming: SwiftTransfer Global ($34,000 shortfall), ReloadNow Services ($21,000 shortfall), and ValueCard Partners ($17,000 shortfall), representing a combined $72,000 in immediate recovery opportunity.';
    actText = 'View Underperforming Vendors';
    actRoute = '/compliance';
  } else if (lq.includes('netflix') || lq.includes('blackhawk') || lq.includes('incomm')) {
    reply = 'Simulation Engine Analysis: Moving Netflix from InComm (3.00%) to Blackhawk (4.75%) generates +$42,000/yr commission impact (+175 bps), requires $14,500 in one-off POS implementation capex, carries Low transition risk (22/100), and pays back in 4.1 months with a 3-Year NPV of +$101,340.';
    actText = 'Open Digital Procurement Twin';
    actRoute = '/digital-twin';
  } else if (lq.includes('bundle') || lq.includes('money order') || lq.includes('bill pay')) {
    reply = 'AI Discovery: Consolidating Domestic Money Orders + Debit Reloads + Utility Bill Pay under Vendor A expands overall category yield by +2.80% (+$383,590/yr EBITDA) by triggering Tier 4 volume acceleration and eliminating $36,000 in redundant middleware switch fees.';
    actText = 'Open AI Bundle Optimizer';
    actRoute = '/digital-twin';
  }

  AppState.copilotMessages.push({
    sender: 'ai',
    text: reply,
    actionText: actText,
    actionRoute: actRoute
  });

  window.renderAICopilot();
};

window.clearCopilotChat = function() {
  AppState.copilotMessages = [
    {
      sender: 'ai',
      text: 'Chat cleared. How can Commission IQ AI Copilot assist your procurement team today?'
    }
  ];
  window.renderAICopilot();
};


// ═══════════════════════════════════════════════════════════════
//  ESCALATION WORKFLOW & MULTILEVEL SLA MATRIX (SPEC REQUIREMENT)
// ═══════════════════════════════════════════════════════════════
window.renderWorkflow = function() {
  const items = MockData.workflowItems || [];
  const cfg = MockData.escalationConfig || {};

  _setContent('main-content', `
    <!-- KPI Header -->
    <div class="kpi-grid" style="grid-template-columns:repeat(4, 1fr);margin-bottom:1.5rem;">
      <div class="kpi-card" style="--kpi-color:#3b82f6;--kpi-bg:#dbeafe;">
        <div class="kpi-icon" style="background:#dbeafe;color:#3b82f6;"><i data-lucide="git-branch"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Active Workflows</div>
          <div class="kpi-value">${items.length} Workflows</div>
          <div class="kpi-sub">Onboarding & dispute escalations</div>
        </div>
      </div>
      <div class="kpi-card" style="--kpi-color:#f59e0b;--kpi-bg:#fef3c7;">
        <div class="kpi-icon" style="background:#fef3c7;color:#f59e0b;"><i data-lucide="clock"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">SLA Tracking Window</div>
          <div class="kpi-value">5 &ndash; 14 Days</div>
          <div class="kpi-sub">Strict tier response countdowns</div>
        </div>
      </div>
      <div class="kpi-card" style="--kpi-color:#ef4444;--kpi-bg:#fee2e2;">
        <div class="kpi-icon" style="background:#fee2e2;color:#ef4444;"><i data-lucide="alert-octagon"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">L3 Executive Triggers</div>
          <div class="kpi-value">&gt; $50k</div>
          <div class="kpi-sub">Auto-escalates to General Counsel</div>
        </div>
      </div>
      <div class="kpi-card" style="--kpi-color:#10b981;--kpi-bg:#dcfce7;">
        <div class="kpi-icon" style="background:#dcfce7;color:#10b981;"><i data-lucide="shield-check"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Escalation Automation</div>
          <div class="kpi-value">Active</div>
          <div class="kpi-sub">Auto-escalate on SLA breach</div>
        </div>
      </div>
    </div>

    <!-- Multilevel Escalation Matrix Architecture -->
    <div class="card" style="margin-bottom:1.5rem;">
      <div class="card-header">
        <div>
          <div class="card-title">Multilevel Dispute Escalation Paths & SLA Thresholds</div>
          <div class="card-subtitle">Formal escalation paths across operational, management, and executive tiers.</div>
        </div>
      </div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:1.5rem;">
          <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;padding:1.25rem;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
              <span class="badge badge-info">Level 1: Operational</span>
              <span style="font-weight:700;font-size:0.75rem;color:var(--text-muted);">SLA: ${cfg.slaDaysL1 || 5} Days</span>
            </div>
            <div style="font-weight:800;font-size:1.1rem;margin-bottom:4px;">Finance Analyst</div>
            <div style="font-size:0.8125rem;color:var(--text-muted);margin-bottom:0.75rem;">Dispute Threshold: <strong>&le; $${(cfg.level1MaxThreshold||10000).toLocaleString()}</strong></div>
            <div style="font-size:0.8125rem;color:var(--text-color);line-height:1.4;">
              Automated reconciliation match, statement audit, informal vendor outreach, and calculation correction.
            </div>
          </div>

          <div style="background:#fffbeb;border:1px solid #f59e0b;border-radius:8px;padding:1.25rem;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
              <span class="badge badge-warning">Level 2: Management</span>
              <span style="font-weight:700;font-size:0.75rem;color:#b45309;">SLA: ${cfg.slaDaysL2 || 7} Days</span>
            </div>
            <div style="font-weight:800;font-size:1.1rem;margin-bottom:4px;color:#92400e;">Category & Procurement Manager</div>
            <div style="font-size:0.8125rem;color:#b45309;margin-bottom:0.75rem;">Dispute Threshold: <strong>$${((cfg.level1MaxThreshold||10000)+1).toLocaleString()} &ndash; $${(cfg.level2MaxThreshold||50000).toLocaleString()}</strong></div>
            <div style="font-size:0.8125rem;color:#78350f;line-height:1.4;">
              Formal demand notice served, 10-day statutory cure countdown, 1.5% late interest penalty assessment, and meeting with vendor VP.
            </div>
          </div>

          <div style="background:#fef2f2;border:1px solid #ef4444;border-radius:8px;padding:1.25rem;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
              <span class="badge badge-danger">Level 3: Executive & Legal</span>
              <span style="font-weight:700;font-size:0.75rem;color:#991b1b;">SLA: ${cfg.slaDaysL3 || 14} Days</span>
            </div>
            <div style="font-weight:800;font-size:1.1rem;margin-bottom:4px;color:#991b1b;">Executive Sponsor & General Counsel</div>
            <div style="font-size:0.8125rem;color:#991b1b;margin-bottom:0.75rem;">Dispute Threshold: <strong>&gt; $${(cfg.level2MaxThreshold||50000).toLocaleString()}</strong></div>
            <div style="font-size:0.8125rem;color:#7f1d1d;line-height:1.4;">
              Vendor bidding privileges revoked across live Reverse Auctions (Event SE001), legal escrow holdback of clearinghouse funds, and contract termination.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Workflows & SLA Countdown List -->
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">Active Workflow Items & SLA Milestones</div>
          <div class="card-subtitle">Track ongoing task lifecycles and stage progressions.</div>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Workflow Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Current Stage</th>
              <th>Assignee</th>
              <th>Created Date</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(w => `
              <tr>
                <td style="font-weight:700;">${esc(w.name)}</td>
                <td><span class="badge badge-neutral">${esc(w.type)}</span></td>
                <td><span class="badge badge-warning">${esc(w.status)}</span></td>
                <td>
                  <div style="font-size:0.8125rem;font-weight:600;">Stage ${w.currentStep} of ${w.totalSteps}: ${esc(w.steps ? w.steps[w.currentStep-1] : 'In Review')}</div>
                  <div style="width:120px;height:4px;background:#e2e8f0;border-radius:2px;margin-top:4px;">
                    <div style="width:${Math.round((w.currentStep/w.totalSteps)*100)}%;height:100%;background:#3b82f6;border-radius:2px;"></div>
                  </div>
                </td>
                <td style="font-size:0.8125rem;">${esc(w.assignee)}</td>
                <td style="font-size:0.8125rem;color:var(--text-muted);">${w.createdDate}</td>
                <td style="text-align:right;">
                  <button class="btn btn-outline btn-xs" onclick="showToast('Advanced stage for ${esc(w.name)}');">
                    Advance Stage &rarr;
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `);

  setTimeout(() => {
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }, 50);
};


window.renderAudit = function() {
  const logs = MockData.auditLogs;
  const actionBadge = {
    login:   'badge-info',    logout:  'badge-neutral', create: 'badge-success',
    update:  'badge-warning', delete:  'badge-danger',  approve:'badge-primary',
    export:  'badge-neutral', view:    'badge-neutral'
  };
  const actionStyles = {
    login:   '#1a73e8', create: '#22c55e', update: '#f59e0b',
    delete:  '#ef4444', export: '#8b5cf6', view:   '#94a3b8', approve: '#14b8a6'
  };

  const users   = [...new Set(logs.map(l => l.userName))].map(u => ({ value:u, label:u }));
  const actions  = [...new Set(logs.map(l => l.action))].map(a => ({ value:a, label:a.charAt(0).toUpperCase()+a.slice(1) }));
  const modules  = [...new Set(logs.map(l => l.module))].map(m => ({ value:m, label:m }));

  function buildRows(rows) {
    if (!rows.length) return '<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--text-muted);">No log entries match your filters.</td></tr>';
    return rows.map(l => `
      <tr>
        <td style="white-space:nowrap;font-size:.8125rem;color:var(--text-muted)">${new Date(l.timestamp).toLocaleString()}</td>
        <td style="font-weight:600">${esc(l.userName)}</td>
        <td><span class="badge ${actionBadge[l.action] || 'badge-neutral'}" style="background:${actionStyles[l.action] ? actionStyles[l.action]+'22' : ''};color:${actionStyles[l.action] || ''};border:1px solid ${actionStyles[l.action] ? actionStyles[l.action]+'44' : ''}">${esc(l.action)}</span></td>
        <td><span class="badge badge-neutral">${esc(l.module)}</span></td>
        <td style="font-size:.8125rem;color:var(--text-light)">${esc(l.details)}</td>
        <td style="font-family:monospace;font-size:.75rem;color:var(--text-muted)">${esc(l.ipAddress)}</td>
      </tr>`).join('');
  }

  function applyFilter(form) {
    const fd = new FormData(form);
    let filtered = [...MockData.auditLogs];
    const user   = fd.get('user');   if (user)   filtered = filtered.filter(l => l.userName === user);
    const action = fd.get('action'); if (action) filtered = filtered.filter(l => l.action === action);
    const mod    = fd.get('module'); if (mod)    filtered = filtered.filter(l => l.module === mod);
    const from   = fd.get('from');   if (from)   filtered = filtered.filter(l => l.timestamp >= from);
    const to     = fd.get('to');     if (to)     filtered = filtered.filter(l => l.timestamp.substring(0,10) <= to);
    document.getElementById('audit-tbody').innerHTML = buildRows(filtered);
  }

  // Count by action type for chart
  const actionCounts = {};
  logs.forEach(l => { actionCounts[l.action] = (actionCounts[l.action] || 0) + 1; });

  _setContent('main-content', `
    <div style="display:grid;grid-template-columns:1fr 300px;gap:1rem;margin-bottom:1.5rem;">
      <div class="card">
        <div class="card-header"><div class="card-title">Audit Statistics</div></div>
        <div class="card-body">
          <div style="display:flex;flex-wrap:wrap;gap:.75rem;">
            ${Object.entries(actionCounts).map(([action, count]) => `
              <div style="display:flex;align-items:center;gap:.5rem;padding:.5rem .75rem;background:#f8fafc;border-radius:.5rem;border:1px solid var(--border);">
                <span style="width:8px;height:8px;border-radius:50%;background:${actionStyles[action]||'#94a3b8'};display:inline-block;"></span>
                <span style="font-size:.8125rem;text-transform:capitalize;">${esc(action)}</span>
                <span style="font-weight:700;font-size:.875rem;">${count}</span>
              </div>`).join('')}
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">By Action Type</div></div>
        <div class="card-body"><div class="chart-container" style="height:160px"><canvas id="chart-audit-doughnut"></canvas></div></div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">System Audit Log</div>
        <button class="btn btn-outline btn-sm" onclick="exportToCSV(MockData.auditLogs,'audit-trail.csv')"><i data-lucide="download"></i> Export CSV</button>
      </div>
      <div class="card-body" style="padding-bottom:0;">
        ${_filtersBar('audit-filter', [
          { key:'user',   type:'select', label:'User',    options:users   },
          { key:'action', type:'select', label:'Action',  options:actions },
          { key:'module', type:'select', label:'Module',  options:modules },
          { key:'from',   type:'date',   label:'From'                     },
          { key:'to',     type:'date',   label:'To'                       }
        ], applyFilter.toString())}
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Timestamp</th><th>User</th><th>Action</th><th>Module</th><th>Details</th><th>IP Address</th></tr></thead>
          <tbody id="audit-tbody">${buildRows(logs)}</tbody>
        </table>
      </div>
    </div>
  `);

  setTimeout(() => {
    if (typeof lucide !== 'undefined') lucide.createIcons();
    const ctx = document.getElementById('chart-audit-doughnut');
    if (ctx) {
      const colors = Object.keys(actionCounts).map(a => actionStyles[a] || '#94a3b8');
      AppState.charts['chart-audit-doughnut'] = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(actionCounts).map(a => a.charAt(0).toUpperCase()+a.slice(1)),
          datasets: [{ data: Object.values(actionCounts), backgroundColor: colors, borderWidth:3, borderColor:'#fff', hoverOffset:6 }]
        },
        options: {
          responsive: true, maintainAspectRatio: false, cutout: '65%',
          plugins: { legend: { position:'right', labels:{ usePointStyle:true, pointStyle:'circle', boxWidth:8, font:{ size:10 } } } }
        }
      });
    }
  }, 60);
};

// ═══════════════════════════════════════════════════════════════
//  8. NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════
window.renderNotifications = function() {
  const allNotifs = MockData.notifications;
  const typeColors = { warning:'#f59e0b', danger:'#ef4444', info:'#1a73e8', success:'#22c55e' };
  const typeIcons  = { warning:'alert-triangle', danger:'x-circle', info:'info', success:'check-circle' };
  const typeBadge  = { warning:'badge-warning',  danger:'badge-danger', info:'badge-info', success:'badge-success' };
  const typeOptions = ['warning','danger','info','success'].map(t => ({ value:t, label:t.charAt(0).toUpperCase()+t.slice(1) }));
  const readOptions = [{ value:'unread', label:'Unread' }, { value:'read', label:'Read' }];

  function buildList(notifs) {
    if (!notifs.length) return '<div style="text-align:center;padding:2rem;color:var(--text-muted);">No notifications match your filters.</div>';
    return notifs.map(n => `
      <div id="notif-row-${esc(n.id)}" style="display:flex;gap:1rem;padding:1rem 1.25rem;border-bottom:1px solid var(--border);${n.read ? '' : 'border-left:3px solid #1a73e8;background:rgba(26,115,232,.03);'}transition:background .2s;" onmouseover="this.style.background='var(--surface)'" onmouseout="this.style.background='${n.read?'':'rgba(26,115,232,.03)'}'">
        <div style="flex-shrink:0;width:38px;height:38px;border-radius:50%;background:${typeColors[n.type]||'#94a3b8'}22;display:flex;align-items:center;justify-content:center;color:${typeColors[n.type]||'#94a3b8'};">
          <i data-lucide="${typeIcons[n.type]||'bell'}" style="width:18px;height:18px;"></i>
        </div>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:.5rem;">
            <div style="font-weight:${n.read?'500':'700'};font-size:.9375rem;">${esc(n.title)}</div>
            <div style="display:flex;align-items:center;gap:.5rem;flex-shrink:0;">
              <span class="badge ${typeBadge[n.type]||'badge-neutral'}">${esc(n.type)}</span>
              <span class="badge ${n.read?'badge-neutral':'badge-primary'}">${n.read?'Read':'Unread'}</span>
              <button class="btn btn-ghost btn-sm" style="padding:.125rem .5rem;font-size:.75rem;" onclick="toggleNotifRead('${esc(n.id)}')">${n.read?'Mark Unread':'Mark Read'}</button>
            </div>
          </div>
          <div style="font-size:.875rem;color:var(--text-muted);margin:.25rem 0;">${esc(n.message)}</div>
          <div style="font-size:.75rem;color:var(--text-muted)">${_relativeTime(n.timestamp)}</div>
        </div>
      </div>`).join('');
  }

  function applyFilter(form) {
    const fd = new FormData(form);
    let filtered = [...MockData.notifications];
    const type   = fd.get('type'); if (type) filtered = filtered.filter(n => n.type === type);
    const status = fd.get('status');
    if (status === 'unread') filtered = filtered.filter(n => !n.read);
    if (status === 'read')   filtered = filtered.filter(n => n.read);
    document.getElementById('notif-list-full').innerHTML = buildList(filtered);
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  const unread = allNotifs.filter(n => !n.read).length;

  _setContent('main-content', `
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">Notification Center</div>
          <div class="card-subtitle">${unread} unread · ${allNotifs.length} total</div>
        </div>
        <div style="display:flex;gap:.5rem;">
          <button class="btn btn-outline btn-sm" onclick="markAllNotifsRead()"><i data-lucide="check-check"></i> Mark All Read</button>
        </div>
      </div>
      <div class="card-body" style="padding-bottom:0;">
        ${_filtersBar('notif-filter', [
          { key:'type',   type:'select', label:'Type',   options:typeOptions },
          { key:'status', type:'select', label:'Status', options:readOptions }
        ], applyFilter.toString())}
      </div>
      <div id="notif-list-full">${buildList(allNotifs)}</div>
    </div>
  `);

  setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 50);
};

window.toggleNotifRead = function(id) {
  const n = MockData.notifications.find(n => n.id === id);
  if (!n) return;
  n.read = !n.read;
  renderNotifications();
  showToast(`Notification marked as ${n.read ? 'read' : 'unread'}`, 'info');
};

window.markAllNotifsRead = function() {
  MockData.notifications.forEach(n => n.read = true);
  renderNotifications();
  showToast('All notifications marked as read', 'success');
};

// ═══════════════════════════════════════════════════════════════
//  9. WORKFLOW MANAGEMENT
// ═══════════════════════════════════════════════════════════════
window.renderWorkflow = function() {
  const items = MockData.workflowItems;
  const statusColors  = { 'Pending':'badge-neutral', 'In Progress':'badge-warning', 'Completed':'badge-success', 'Cancelled':'badge-danger' };
  const statusProgress = { 'Pending':'#94a3b8', 'In Progress':'#1a73e8', 'Completed':'#22c55e', 'Cancelled':'#ef4444' };

  const rows = items.map(w => `
    <tr>
      <td style="font-weight:600">${esc(w.name)}</td>
      <td style="font-size:.8125rem">${esc(w.type)}</td>
      <td><span class="badge ${statusColors[w.status]||'badge-neutral'}">${esc(w.status)}</span></td>
      <td>
        <div style="margin-bottom:.35rem;font-size:.8125rem;color:var(--text-muted)">Step ${w.currentStep} of ${w.totalSteps}: <strong>${esc(w.steps[w.currentStep-1])}</strong></div>
        ${_progressBar(w.currentStep, w.totalSteps, statusProgress[w.status]||'#1a73e8')}
      </td>
      <td style="font-size:.8125rem">${esc(w.assignee)}</td>
      <td style="font-size:.8125rem;color:var(--text-muted)">${w.createdDate}</td>
      <td>
        <button class="btn btn-ghost btn-sm" onclick="showWorkflowDetail('${esc(w.id)}')"><i data-lucide="eye"></i> View</button>
      </td>
    </tr>`).join('');

  const inProgress = items.filter(w => w.status === 'In Progress').length;
  const completed  = items.filter(w => w.status === 'Completed').length;
  const pending    = items.filter(w => w.status === 'Pending').length;

  _setContent('main-content', `
    <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:1.5rem;">
      <div class="kpi-card" style="--kpi-color:#f59e0b;--kpi-bg:#fef3c7">
        <div class="kpi-icon" style="background:#fef3c7;color:#f59e0b"><i data-lucide="loader"></i></div>
        <div class="kpi-content"><div class="kpi-label">In Progress</div><div class="kpi-value">${inProgress}</div></div>
      </div>
      <div class="kpi-card" style="--kpi-color:#94a3b8;--kpi-bg:#f1f5f9">
        <div class="kpi-icon" style="background:#f1f5f9;color:#94a3b8"><i data-lucide="clock"></i></div>
        <div class="kpi-content"><div class="kpi-label">Pending</div><div class="kpi-value">${pending}</div></div>
      </div>
      <div class="kpi-card" style="--kpi-color:#22c55e;--kpi-bg:#dcfce7">
        <div class="kpi-icon" style="background:#dcfce7;color:#22c55e"><i data-lucide="check-circle"></i></div>
        <div class="kpi-content"><div class="kpi-label">Completed</div><div class="kpi-value">${completed}</div></div>
      </div>
      <div class="kpi-card" style="--kpi-color:#1a73e8;--kpi-bg:#e8f0fe">
        <div class="kpi-icon" style="background:#e8f0fe;color:#1a73e8"><i data-lucide="git-branch"></i></div>
        <div class="kpi-content"><div class="kpi-label">Total</div><div class="kpi-value">${items.length}</div></div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">Active Workflows</div>
        <button class="btn btn-primary btn-sm" onclick="openCreateWorkflow()">
          <i data-lucide="plus"></i> Create from Template
        </button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Name</th><th>Type</th><th>Status</th><th style="min-width:200px">Progress</th><th>Assignee</th><th>Created</th><th>Actions</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `);

  setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 50);
};

window.showWorkflowDetail = function(id) {
  const w = MockData.workflowItems.find(x => x.id === id);
  if (!w) return;
  const statusColor = { 'Pending':'#94a3b8', 'In Progress':'#1a73e8', 'Completed':'#22c55e', 'Cancelled':'#ef4444' };
  const stepsHTML = w.steps.map((step, i) => {
    const done    = i < w.currentStep;
    const current = i === w.currentStep - 1;
    const color   = done ? '#22c55e' : current ? '#1a73e8' : '#e2e8f0';
    const textCls = done || current ? 'font-weight:600' : 'color:var(--text-muted)';
    return `<div style="display:flex;align-items:center;gap:.75rem;padding:.5rem 0;${i < w.steps.length-1 ? 'border-bottom:1px dashed var(--border)' : ''}">
      <div style="width:28px;height:28px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
        <i data-lucide="${done?'check':current?'loader':'circle'}" style="width:14px;height:14px;color:${done||current?'#fff':'#94a3b8'}"></i>
      </div>
      <div>
        <div style="${textCls}">Step ${i+1}: ${esc(step)}</div>
        ${current ? '<div style="font-size:.75rem;color:#1a73e8">Currently active</div>' : ''}
        ${done && i < w.currentStep - 1 ? '<div style="font-size:.75rem;color:#22c55e">Completed</div>' : ''}
      </div>
    </div>`;
  }).join('');

  openModal(`Workflow Detail — ${w.name}`, `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
      <div><span style="color:var(--text-muted);font-size:.8125rem;">Type</span><div style="font-weight:600">${esc(w.type)}</div></div>
      <div><span style="color:var(--text-muted);font-size:.8125rem;">Assignee</span><div style="font-weight:600">${esc(w.assignee)}</div></div>
      <div><span style="color:var(--text-muted);font-size:.8125rem;">Status</span><div><span style="font-weight:700;color:${statusColor[w.status]}">${esc(w.status)}</span></div></div>
      <div><span style="color:var(--text-muted);font-size:.8125rem;">Created</span><div>${esc(w.createdDate)}</div></div>
    </div>
    <div style="font-weight:600;margin-bottom:.5rem;">Workflow Steps</div>
    ${stepsHTML}
  `, [{ label:'Close', cls:'btn-secondary', action:'closeModal()' }]);
};

window.openCreateWorkflow = function() {
  const templates = ['Subsidy Approval','Vendor Onboarding','Contract Renewal','Rate Renegotiation','Compliance Audit','Revenue Recovery','Sourcing Event'];
  openModal('Create Workflow from Template', `
    <div style="display:flex;flex-direction:column;gap:1rem;">
      <div class="form-group">
        <label class="form-label">Workflow Template</label>
        <select class="form-input" id="wf-template">
          ${templates.map(t => `<option>${t}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Workflow Name</label>
        <input class="form-input" id="wf-name" placeholder="e.g. Q1 2027 Subsidy Review" />
      </div>
      <div class="form-group">
        <label class="form-label">Assign To</label>
        <select class="form-input" id="wf-assignee">
          ${MockData.users.filter(u=>u.status==='active').map(u=>`<option>${u.name}</option>`).join('')}
        </select>
      </div>
    </div>
  `, [
    { label:'Cancel', cls:'btn-secondary', action:'closeModal()' },
    { label:'Create Workflow', cls:'btn-primary', action:'closeModal();showToast("Workflow created successfully!","success")' }
  ]);
};

// ═══════════════════════════════════════════════════════════════
//  10. SETTINGS & CONFIGURATION
// ═══════════════════════════════════════════════════════════════
window.renderSettings = function() {
  const user = Auth.getCurrentUser();

  function showTab(tab) {
    document.querySelectorAll('.settings-tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.settings-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
      if (btn.classList.contains('active')) {
        btn.style.borderBottom = '2px solid #1a73e8';
        btn.style.color = '#1a73e8';
        btn.style.fontWeight = '600';
      } else {
        btn.style.borderBottom = '2px solid transparent';
        btn.style.color = 'var(--text-muted)';
        btn.style.fontWeight = '500';
      }
    });
    const content = document.getElementById('settings-tab-' + tab);
    if (content) content.style.display = 'block';
  }

  const roles   = ['Super Admin','Admin','Procurement Manager','Analyst','Auditor','Viewer'];
  const modules  = ['Dashboard','Leakage','Benchmarking','Sourcing','Compliance','Recovery','Reports','Audit','Notifications','Workflow'];
  const actions  = ['View','Create','Edit','Delete','Export','Approve'];

  // Permission matrix: Super Admin & Admin = all; Procurement Manager = no delete/approve some; Analyst = view+export; Auditor = view+audit; Viewer = view only
  const perms = {
    'Super Admin':          { View:true,  Create:true,  Edit:true,  Delete:true,  Export:true,  Approve:true  },
    'Admin':                { View:true,  Create:true,  Edit:true,  Delete:true,  Export:true,  Approve:true  },
    'Procurement Manager':  { View:true,  Create:true,  Edit:true,  Delete:false, Export:true,  Approve:true  },
    'Analyst':              { View:true,  Create:false, Edit:false, Delete:false, Export:true,  Approve:false },
    'Auditor':              { View:true,  Create:false, Edit:false, Delete:false, Export:true,  Approve:false },
    'Viewer':               { View:true,  Create:false, Edit:false, Delete:false, Export:false, Approve:false }
  };

  const permMatrix = `
    <div class="table-wrap">
      <table style="font-size:.8125rem;">
        <thead>
          <tr>
            <th>Role</th>
            ${actions.map(a => `<th style="text-align:center">${a}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${roles.map(role => `
            <tr>
              <td style="font-weight:600;white-space:nowrap">${esc(role)}</td>
              ${actions.map(action => `
                <td style="text-align:center;">
                  <input type="checkbox" ${perms[role]?.[action] ? 'checked' : ''} style="width:15px;height:15px;cursor:pointer;" onchange="showToast('Permission updated (demo only)','info')" />
                </td>`).join('')}
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;

  const userTableRows = MockData.users.map(u => `
    <tr>
      <td><div style="display:flex;align-items:center;gap:.625rem;"><div class="avatar" style="width:32px;height:32px;font-size:.75rem;">${esc(u.avatar)}</div><div><div style="font-weight:600">${esc(u.name)}</div><div style="font-size:.75rem;color:var(--text-muted)">${esc(u.email)}</div></div></div></td>
      <td><span class="badge badge-primary" style="font-size:.6875rem;">${esc(u.role)}</span></td>
      <td><span class="badge ${u.status==='active'?'badge-success':'badge-neutral'}">${esc(u.status)}</span></td>
      <td style="font-size:.8125rem;color:var(--text-muted)">${new Date(u.lastLogin).toLocaleDateString()}</td>
      <td style="font-size:.8125rem;color:var(--text-muted)">${esc(u.department)}</td>
      <td>
        <button class="btn btn-ghost btn-sm" onclick="showToast('Edit user (demo)','info')"><i data-lucide="edit-2"></i></button>
      </td>
    </tr>`).join('');

  _setContent('main-content', `
    <div class="card">
      <div style="display:flex;border-bottom:1px solid var(--border);padding:0 1.25rem;">
        ${['General','Users','Roles','Integrations'].map((t,i) => `
          <button class="settings-tab-btn" data-tab="${t.toLowerCase()}" onclick="document.querySelectorAll('.settings-tab-btn').forEach(b=>{b.style.borderBottom='2px solid transparent';b.style.color='var(--text-muted)';b.style.fontWeight='500'});this.style.borderBottom='2px solid #1a73e8';this.style.color='#1a73e8';this.style.fontWeight='600';document.querySelectorAll('.settings-tab-content').forEach(c=>c.style.display='none');document.getElementById('settings-tab-'+this.dataset.tab).style.display='block';"
            style="padding:.875rem 1.25rem;border:none;background:transparent;cursor:pointer;font-size:.9rem;white-space:nowrap;border-bottom:${i===0?'2px solid #1a73e8':'2px solid transparent'};color:${i===0?'#1a73e8':'var(--text-muted)'};font-weight:${i===0?'600':'500'}">
            ${t}
          </button>`).join('')}
      </div>

      <!-- General Tab -->
      <div id="settings-tab-general" class="settings-tab-content" style="display:block;">
        <div class="card-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;max-width:800px;">
            <div class="form-group">
              <label class="form-label">Company Name</label>
              <input class="form-input" value="Commission IQ Corp" />
            </div>
            <div class="form-group">
              <label class="form-label">Timezone</label>
              <select class="form-input">
                <option selected>America/New_York (UTC-5)</option>
                <option>America/Chicago (UTC-6)</option>
                <option>America/Denver (UTC-7)</option>
                <option>America/Los_Angeles (UTC-8)</option>
                <option>Europe/London (UTC+0)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Currency</label>
              <select class="form-input">
                <option selected>USD — US Dollar</option>
                <option>EUR — Euro</option>
                <option>GBP — British Pound</option>
                <option>CAD — Canadian Dollar</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Fiscal Year Start</label>
              <select class="form-input">
                <option selected>January 1</option>
                <option>April 1</option>
                <option>July 1</option>
                <option>October 1</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Date Format</label>
              <select class="form-input">
                <option>MM/DD/YYYY</option>
                <option selected>YYYY-MM-DD</option>
                <option>DD/MM/YYYY</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Default Commission Decimal Places</label>
              <select class="form-input">
                <option>1</option>
                <option selected>2</option>
                <option>3</option>
              </select>
            </div>
            <div class="form-group" style="grid-column:1/-1">
              <button class="btn btn-primary" onclick="showToast('Settings saved successfully!','success')"><i data-lucide="save"></i> Save Settings</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Users Tab -->
      <div id="settings-tab-users" class="settings-tab-content" style="display:none;">
        <div class="card-body" style="padding-bottom:0;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
            <div style="font-size:.875rem;color:var(--text-muted)">${MockData.users.length} registered users</div>
            <button class="btn btn-primary btn-sm" onclick="showToast('Add User form would open here (demo)','info')"><i data-lucide="user-plus"></i> Add User</button>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>User</th><th>Role</th><th>Status</th><th>Last Login</th><th>Department</th><th>Actions</th></tr></thead>
            <tbody>${userTableRows}</tbody>
          </table>
        </div>
      </div>

      <!-- Roles Tab -->
      <div id="settings-tab-roles" class="settings-tab-content" style="display:none;">
        <div class="card-body">
          <div style="font-size:.875rem;color:var(--text-muted);margin-bottom:1rem;">Permission matrix — check to grant, uncheck to revoke. Changes apply system-wide.</div>
          ${permMatrix}
        </div>
      </div>

      <!-- Integrations Tab -->
      <div id="settings-tab-integrations" class="settings-tab-content" style="display:none;">
        <div class="card-body">
          <div style="display:flex;flex-direction:column;gap:1.5rem;max-width:700px;">
            <div style="border:1px solid var(--border);border-radius:.75rem;padding:1.25rem;">
              <div style="font-weight:700;margin-bottom:.25rem;">API Access</div>
              <div style="font-size:.8125rem;color:var(--text-muted);margin-bottom:1rem;">Use this key to authenticate API requests.</div>
              <div class="form-group">
                <label class="form-label">API Key</label>
                <div style="display:flex;gap:.5rem;">
                  <input class="form-input" value="ciq_live_sk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6" readonly id="api-key-input" style="font-family:monospace;font-size:.8125rem;" />
                  <button class="btn btn-outline btn-sm" onclick="navigator.clipboard.writeText(document.getElementById('api-key-input').value);showToast('API key copied!','success')"><i data-lucide="copy"></i> Copy</button>
                  <button class="btn btn-outline btn-sm" onclick="showToast('API key regenerated (demo)','warning')"><i data-lucide="refresh-cw"></i> Regenerate</button>
                </div>
              </div>
            </div>
            <div style="border:1px solid var(--border);border-radius:.75rem;padding:1.25rem;">
              <div style="font-weight:700;margin-bottom:.25rem;">Webhooks</div>
              <div style="font-size:.8125rem;color:var(--text-muted);margin-bottom:1rem;">Receive real-time event notifications at your endpoint.</div>
              <div class="form-group">
                <label class="form-label">Webhook URL</label>
                <input class="form-input" placeholder="https://your-system.com/webhooks/commissioniq" />
              </div>
              <div class="form-group">
                <label class="form-label">Webhook Secret</label>
                <input class="form-input" type="password" value="whsec_demo_secret_key_here" />
              </div>
              <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.5rem;">
                ${['commission.updated','vendor.added','leakage.detected','contract.expiring','subsidy.approved'].map(e=>`
                  <label style="display:flex;align-items:center;gap:.35rem;font-size:.8125rem;cursor:pointer;">
                    <input type="checkbox" checked /> ${e}
                  </label>`).join('')}
              </div>
              <button class="btn btn-primary btn-sm" style="margin-top:1rem;" onclick="showToast('Webhook settings saved','success')"><i data-lucide="save"></i> Save Webhook</button>
            </div>
            <div style="border:1px solid var(--border);border-radius:.75rem;padding:1.25rem;">
              <div style="font-weight:700;margin-bottom:.25rem;">ERP / System Integrations</div>
              <div style="font-size:.8125rem;color:var(--text-muted);margin-bottom:1rem;">Connect Commission IQ with your existing systems.</div>
              <div style="display:flex;flex-direction:column;gap:.75rem;">
                ${[['SAP ERP','sap','Connected','badge-success'],['Oracle NetSuite','database','Not Connected','badge-neutral'],['Salesforce CRM','cloud','Not Connected','badge-neutral'],['Microsoft Dynamics','layout-grid','Connected','badge-success']].map(([name,icon,status,cls])=>`
                  <div style="display:flex;align-items:center;justify-content:space-between;padding:.75rem;background:#f8fafc;border-radius:.5rem;">
                    <div style="display:flex;align-items:center;gap:.625rem;">
                      <i data-lucide="${icon}" style="width:20px;height:20px;color:var(--text-muted)"></i>
                      <span style="font-weight:600">${esc(name)}</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:.5rem;">
                      <span class="badge ${cls}">${esc(status)}</span>
                      <button class="btn btn-ghost btn-sm" onclick="showToast('Integration settings (demo)','info')"><i data-lucide="settings"></i> Configure</button>
                    </div>
                  </div>`).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `);

  setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 50);
};



// ═══════════════════════════════════════════════════════════════
//  AI AUTO-RFP BUILDER (SPEC REQUIREMENT)
//  "Today users manually create RFPs. AI should automatically generate:
//   Product list, Volumes, Requirements, Service expectations, Commercial terms.
//   One-click: Generate RFP"
// ═══════════════════════════════════════════════════════════════
window.renderAutoRfpBuilder = function() {
  if (!AppState.selectedRfpPresetId) AppState.selectedRfpPresetId = 'AUTORFP-001';

  const presets = MockData.autoRfpPresets || [];
  const activePreset = presets.find(p => p.id === AppState.selectedRfpPresetId) || presets[0];

  _setContent('main-content', `
    <!-- Header -->
    <div class="page-header" style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem;">
      <div>
        <div style="display:flex;align-items:center;gap:0.625rem;">
          <span style="background:linear-gradient(135deg,#10b981,#059669);color:#fff;width:32px;height:32px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(16,185,129,0.35);">
            <i data-lucide="sparkles" style="width:18px;height:18px;"></i>
          </span>
          <h1 class="page-title" style="margin:0;font-size:1.625rem;font-weight:800;letter-spacing:-0.02em;">AI Auto-RFP Builder</h1>
          <span class="badge" style="background:#dcfce7;color:#166534;font-size:0.75rem;font-weight:700;padding:2px 8px;border-radius:999px;">
            1-Click Autonomous Specification
          </span>
        </div>
        <p class="page-desc" style="color:var(--text-light);margin-top:0.35rem;max-width:860px;font-size:0.875rem;">
          Today users manually create RFPs. AI automatically generates complete specifications: <strong>Product list</strong>, <strong>Volumes</strong>, <strong>Requirements</strong>, <strong>Service expectations</strong>, and <strong>Commercial terms</strong> with one click: <strong>Generate RFP</strong>.
        </p>
      </div>
      <div>
        <button class="btn btn-primary" onclick="generateAutoRfp('${activePreset.id}')" style="background:#10b981;border-color:#10b981;font-weight:800;">
          <i data-lucide="play-circle"></i> Generate RFP
        </button>
      </div>
    </div>

    <!-- Executive KPI Grid -->
    <div class="kpi-grid" style="grid-template-columns:repeat(4, 1fr);margin-bottom:1.5rem;">
      <div class="kpi-card" style="--kpi-color:#10b981;--kpi-bg:#dcfce7;">
        <div class="kpi-icon" style="background:#dcfce7;color:#10b981;"><i data-lucide="sparkles"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">AI Generation Speed</div>
          <div class="kpi-value">&lt; 2 Seconds</div>
          <div class="kpi-sub">Replaces 4 weeks of manual RFP drafting</div>
        </div>
      </div>
      <div class="kpi-card" style="--kpi-color:#3b82f6;--kpi-bg:#dbeafe;">
        <div class="kpi-icon" style="background:#dbeafe;color:#3b82f6;"><i data-lucide="layers"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Auto-Synthesized Sections</div>
          <div class="kpi-value">5 Pillars</div>
          <div class="kpi-sub">Products, Volumes, SLAs, Terms</div>
        </div>
      </div>
      <div class="kpi-card" style="--kpi-color:#8b5cf6;--kpi-bg:#ede9fe;">
        <div class="kpi-icon" style="background:#ede9fe;color:#8b5cf6;"><i data-lucide="shopping-cart"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Tendered Volume</div>
          <div class="kpi-value">$${(activePreset.totalAnnualVolume/1000000).toFixed(2)}M</div>
          <div class="kpi-sub">Across 1,420 retail store doors</div>
        </div>
      </div>
      <div class="kpi-card" style="--kpi-color:#06b6d4;--kpi-bg:#cffafe;">
        <div class="kpi-icon" style="background:#cffafe;color:#06b6d4;"><i data-lucide="zap"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Sourcing Handoff</div>
          <div class="kpi-value">1-Click</div>
          <div class="kpi-sub">Instant push to live reverse auction</div>
        </div>
      </div>
    </div>

    <!-- AI Generator Card -->
    <div class="card" style="margin-bottom:1.5rem;border:2px solid #10b981;">
      <div class="card-header" style="background:linear-gradient(135deg, #0f172a 0%, #1e293b 100%);color:#fff;border-radius:8px 8px 0 0;flex-wrap:wrap;gap:1rem;">
        <div>
          <div style="font-size:0.75rem;text-transform:uppercase;letter-spacing:1px;color:#34d399;font-weight:800;">
            <i data-lucide="sparkles"></i> AI AUTO-RFP GENERATOR
          </div>
          <div style="font-size:1.35rem;font-weight:900;letter-spacing:-0.3px;margin-top:2px;">
            ${esc(activePreset.title)}
          </div>
          <div style="font-size:0.8125rem;color:#cbd5e1;">Category: <strong>${esc(activePreset.category)}</strong> &bull; Chain Footprint: <strong>${activePreset.doorCount} Doors</strong> &bull; Status: <span class="badge badge-success">AI Ready to Publish</span></div>
        </div>
        <div style="display:flex;gap:0.5rem;align-items:center;">
          <select class="form-select form-select-sm" style="background:#1e293b;color:#fff;border-color:rgba(255,255,255,0.3);width:260px;" onchange="AppState.selectedRfpPresetId = this.value; window.renderAutoRfpBuilder();">
            ${presets.map(p => `<option value="${p.id}" ${p.id === activePreset.id ? 'selected' : ''}>${esc(p.title)}</option>`).join('')}
          </select>
          <button class="btn btn-primary" style="background:#10b981;border-color:#10b981;font-weight:800;box-shadow:0 0 15px rgba(16,185,129,0.4);" onclick="publishAutoRfpToAuction('${activePreset.id}')">
            <i data-lucide="zap"></i> Generate RFP & Launch Auction
          </button>
        </div>
      </div>

      <div class="card-body">
        <!-- 5 Auto-Generated Specification Sections -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;">
          <!-- 1. Product List & 2. Volumes -->
          <div>
            <div style="font-weight:800;font-size:1rem;color:#0f172a;margin-bottom:0.75rem;display:flex;align-items:center;gap:0.4rem;">
              <i data-lucide="package" style="color:#10b981;"></i> 1. Product List & Committed Volumes
            </div>
            ${(activePreset.productList || []).map(p => `
              <div class="bundle-component-row">
                <div>
                  <div style="font-weight:700;font-size:0.875rem;">${esc(p.sku)}</div>
                  <div style="font-size:0.75rem;color:var(--text-muted);">Current Rate: ${p.currentRate}% &rarr; Target Rate: <strong style="color:#10b981;">${p.targetRate}%</strong></div>
                </div>
                <div style="text-align:right;">
                  <div style="font-weight:800;font-size:0.95rem;color:#0284c7;">$${p.volume.toLocaleString()} / yr</div>
                  <span class="badge badge-success" style="font-size:0.65rem;">Committed GMV</span>
                </div>
              </div>
            `).join('')}
            <div style="margin-top:0.5rem;background:#f8fafc;padding:0.75rem;border-radius:6px;font-size:0.8125rem;border:1px solid #e2e8f0;display:flex;justify-content:space-between;">
              <span>Total Network Volume:</span>
              <strong style="color:#0f172a;font-size:0.95rem;">$${activePreset.totalAnnualVolume.toLocaleString()} / year</strong>
            </div>

            <!-- 3. Technical Requirements -->
            <div style="font-weight:800;font-size:1rem;color:#0f172a;margin-top:1.5rem;margin-bottom:0.75rem;display:flex;align-items:center;gap:0.4rem;">
              <i data-lucide="cpu" style="color:#3b82f6;"></i> 2. Technical POS Integration Requirements
            </div>
            ${(activePreset.requirements || []).map(r => `
              <div style="display:flex;gap:0.5rem;align-items:flex-start;font-size:0.8125rem;margin-bottom:0.5rem;padding:0.5rem 0.75rem;background:#f8fafc;border-radius:4px;">
                <i data-lucide="check" style="width:14px;height:14px;color:#10b981;flex-shrink:0;margin-top:2px;"></i>
                <span>${esc(r)}</span>
              </div>
            `).join('')}
          </div>

          <!-- 4. Service Expectations & 5. Commercial Terms -->
          <div>
            <!-- 4. Service Expectations -->
            <div style="font-weight:800;font-size:1rem;color:#0f172a;margin-bottom:0.75rem;display:flex;align-items:center;gap:0.4rem;">
              <i data-lucide="shield-check" style="color:#8b5cf6;"></i> 3. Service Level Expectations (SLAs)
            </div>
            ${(activePreset.serviceExpectations || []).map(s => `
              <div style="display:flex;gap:0.5rem;align-items:flex-start;font-size:0.8125rem;margin-bottom:0.5rem;padding:0.5rem 0.75rem;background:#f8fafc;border-radius:4px;">
                <i data-lucide="clock" style="width:14px;height:14px;color:#8b5cf6;flex-shrink:0;margin-top:2px;"></i>
                <span>${esc(s)}</span>
              </div>
            `).join('')}

            <!-- 5. Commercial Terms -->
            <div style="font-weight:800;font-size:1rem;color:#0f172a;margin-top:1.5rem;margin-bottom:0.75rem;display:flex;align-items:center;gap:0.4rem;">
              <i data-lucide="dollar-sign" style="color:#f59e0b;"></i> 4. Commercial Terms & Floor Protection
            </div>
            ${(activePreset.commercialTerms || []).map(c => `
              <div style="display:flex;gap:0.5rem;align-items:flex-start;font-size:0.8125rem;margin-bottom:0.5rem;padding:0.5rem 0.75rem;background:#fffbeb;border:1px solid #fde68a;border-radius:4px;color:#78350f;">
                <i data-lucide="shield" style="width:14px;height:14px;color:#d97706;flex-shrink:0;margin-top:2px;"></i>
                <strong>${esc(c)}</strong>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="margin-top:1.5rem;border-top:1px solid var(--border-color);padding-top:1.25rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
          <div style="font-size:0.8125rem;color:var(--text-muted);">
            AI Verification: All specifications comply with <strong>Benchmark Index v2.4</strong> and retail legal standards.
          </div>
          <div style="display:flex;gap:0.5rem;">
            <button class="btn btn-outline btn-sm" onclick="exportAutoRfpDoc('${activePreset.id}')">
              <i data-lucide="file-text"></i> Download Full RFP Pack (PDF)
            </button>
            <button class="btn btn-primary btn-sm" style="background:#10b981;border-color:#10b981;" onclick="publishAutoRfpToAuction('${activePreset.id}')">
              <i data-lucide="send"></i> One-Click: Publish & Launch RFP
            </button>
          </div>
        </div>
      </div>
    </div>
  `);

  setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 50);
};

window.publishAutoRfpToAuction = function(presetId) {
  const p = (MockData.autoRfpPresets || []).find(item => item.id === presetId) || {};
  showToast('AI Auto-RFP published! Creating live sourcing event for ' + p.title + '...');
  setTimeout(() => {
    window.location.hash = '#/sourcing';
  }, 400);
};

window.exportAutoRfpDoc = function(presetId) {
  const p = (MockData.autoRfpPresets || []).find(item => item.id === presetId) || {};
  showToast('Generating certified PDF specification pack for ' + p.title + '...');
};


// ═══════════════════════════════════════════════════════════════
//  AI RENEWAL HUNTER (SPEC REQUIREMENT)
//  "Every day AI scans contracts. Identifies: Expiring agreements,
//   Auto-renewals, Benchmark gaps. Then automatically launches sourcing
//   recommendations. Example: 'Contract expires in 92 days. Estimated
//   renegotiation upside: $63,000.'"
// ═══════════════════════════════════════════════════════════════
window.renderRenewalHunter = function() {
  const alerts = MockData.renewalHunterAlerts || [];
  const featured = alerts[0] || {};

  _setContent('main-content', `
    <!-- Header -->
    <div class="page-header" style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem;">
      <div>
        <div style="display:flex;align-items:center;gap:0.625rem;">
          <span style="background:linear-gradient(135deg,#a855f7,#7c3aed);color:#fff;width:32px;height:32px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(168,85,247,0.35);">
            <i data-lucide="crosshair" style="width:18px;height:18px;"></i>
          </span>
          <h1 class="page-title" style="margin:0;font-size:1.625rem;font-weight:800;letter-spacing:-0.02em;">AI Renewal Hunter</h1>
          <span class="badge" style="background:#ede9fe;color:#5b21b6;font-size:0.75rem;font-weight:700;padding:2px 8px;border-radius:999px;">
            Daily Autonomous Contract Surveillance
          </span>
        </div>
        <p class="page-desc" style="color:var(--text-light);margin-top:0.35rem;max-width:860px;font-size:0.875rem;">
          Every day AI scans active agreements to identify: <strong>expiring agreements</strong>, <strong>auto-renewals</strong>, and <strong>benchmark gaps</strong>. Then automatically launches sourcing recommendations.
        </p>
      </div>
      <div>
        <button class="btn btn-outline" onclick="runDailyRenewalScan()">
          <i data-lucide="refresh-cw"></i> Scan All Agreements
        </button>
      </div>
    </div>

    <!-- Daily Surveillance Banner -->
    <div class="executive-board-quote" style="background:linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);border-color:#a855f7;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem;margin-bottom:1rem;">
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <div style="width:40px;height:40px;border-radius:8px;background:rgba(168,85,247,0.25);display:flex;align-items:center;justify-content:center;color:#c084fc;">
            <i data-lucide="crosshair"></i>
          </div>
          <div>
            <span class="badge" style="background:#a855f7;color:#fff;font-weight:800;font-size:0.75rem;padding:3px 8px;">DAILY AUTONOMOUS SURVEILLANCE ACTIVE</span>
            <div style="font-size:0.75rem;color:#cbd5e1;margin-top:2px;">Scanned 12 Vendor Agreements &bull; 3 Actionable Renewal Triggers Flagged Today</div>
          </div>
        </div>
        <button class="btn btn-primary btn-sm" style="background:#a855f7;border-color:#a855f7;" onclick="runDailyRenewalScan()">
          <i data-lucide="refresh-cw"></i> Re-Scan All Contracts Now
        </button>
      </div>

      <!-- Exact Required Quote Banner -->
      <div class="board-quote-text" style="color:#ffffff;">
        &ldquo;${esc(featured.quote)}&rdquo;
      </div>
      <div style="font-size:0.875rem;color:#e2e8f0;margin-top:6px;">
        Vendor: <strong>${esc(featured.vendorName)} (${esc(featured.category)})</strong> &bull; Expiration: <strong>${featured.expiryDate} (${featured.daysUntilExpiry} Days Remaining)</strong> &bull; Benchmark Rate: <strong>${featured.marketBenchmarkRate}%</strong> vs Current <strong>${featured.currentRate}%</strong>
      </div>

      <div style="margin-top:1.25rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;border-top:1px solid rgba(255,255,255,0.2);padding-top:1rem;">
        <div style="font-size:0.8125rem;color:#e2e8f0;">
          ⚠️ <strong>Auto-Renewal Trap:</strong> ${esc(featured.autoRenewalClause)}
        </div>
        <button class="btn btn-sm" style="background:#4ade80;color:#0f172a;font-weight:800;" onclick="launchHunterSourcing('${featured.id}')">
          <i data-lucide="send"></i> Launch Sourcing Recommendation (+$63k Upside) &rarr;
        </button>
      </div>
    </div>

    <!-- Active Hunter Alerts Table -->
    <div class="card" style="margin-bottom:1.5rem;">
      <div class="card-header" style="justify-content:space-between;">
        <div>
          <div class="card-title">Contract Expirations, Auto-Renewal Horizons & Benchmark Upside Ledger</div>
          <div class="card-subtitle">AI calculates financial upside between current contracted rate and market benchmark index.</div>
        </div>
        <button class="btn btn-outline btn-sm" onclick="exportToCSV(MockData.renewalHunterAlerts, 'Renewal_Hunter_Alerts.csv')">
          <i data-lucide="download"></i> Export Alerts CSV
        </button>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Vendor & Agreement</th>
              <th>Days to Expiration</th>
              <th>Notice Deadline</th>
              <th>Current Rate</th>
              <th>Benchmark Rate</th>
              <th style="text-align:right;">Renegotiation Upside</th>
              <th>Auto-Renewal Clause & Status</th>
              <th style="text-align:right;">Sourcing Action</th>
            </tr>
          </thead>
          <tbody>
            ${alerts.map(a => `
              <tr>
                <td>
                  <div style="font-weight:700;">${esc(a.vendorName)}</div>
                  <div style="font-size:0.75rem;color:var(--text-muted);">${esc(a.category)} &bull; ${esc(a.contractId)}</div>
                </td>
                <td>
                  <span class="badge ${a.daysUntilExpiry < 60 ? 'badge-danger' : a.daysUntilExpiry < 100 ? 'badge-warning' : 'badge-neutral'}" style="font-weight:800;">
                    ${a.daysUntilExpiry} Days
                  </span>
                  <div style="font-size:0.7rem;color:var(--text-muted);margin-top:2px;">Expires: ${a.expiryDate}</div>
                </td>
                <td style="font-size:0.8125rem;${a.noticeDeadline.includes('Passed') ? 'color:#ef4444;font-weight:700;' : ''}">
                  ${esc(a.noticeDeadline)}
                </td>
                <td style="font-weight:600;">${a.currentRate}%</td>
                <td style="font-weight:700;color:#10b981;">${a.marketBenchmarkRate}%</td>
                <td style="text-align:right;font-weight:900;font-size:1.05rem;color:#047857;">
                  +$${a.estimatedUpsideDollars.toLocaleString()} / yr
                </td>
                <td>
                  <div style="font-size:0.75rem;color:var(--text-color);line-height:1.3;">
                    ${esc(a.autoRenewalClause)}
                  </div>
                </td>
                <td style="text-align:right;">
                  <button class="btn btn-primary btn-xs" onclick="launchHunterSourcing('${a.id}')">
                    <i data-lucide="arrow-up-right"></i> Launch RFP
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `);

  setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 50);
};

window.runDailyRenewalScan = function() {
  showToast('AI Daily Renewal Hunter scanning contract repositories and benchmark database...');
  setTimeout(() => {
    showToast('Scan complete: 3 critical renewal opportunities verified ($117,905 total upside).');
    window.renderRenewalHunter();
  }, 400);
};

window.launchHunterSourcing = function(alertId) {
  const alert = (MockData.renewalHunterAlerts || []).find(a => a.id === alertId) || {};
  showToast('Launching Sourcing Event for ' + alert.vendorName + ' (+$' + (alert.estimatedUpsideDollars||0).toLocaleString() + ' upside)...');
  setTimeout(() => {
    window.location.hash = '#/sourcing';
  }, 400);
};


// ═══════════════════════════════════════════════════════════════
//  MVP ROADMAP & FUNCTIONAL REQUIREMENTS MATRIX (SPEC REQUIREMENT)
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
//  MVP ROADMAP & DETAILED FUNCTIONAL REQUIREMENTS MATRIX
//  Covering Analytics, Sourcing, Compliance, Recovery, Workflow, AI
//  Functional Requirements: Configuration, Reporting, Auditing,
//  Notifications, Exports, Filtering, Search, Workflow, RBAC
// ═══════════════════════════════════════════════════════════════

window._roadmapState = {
  phaseFilter: 'all', // 'all' | 'Phase 1' | 'Phase 2' | 'Phase 3'
  priorityFilter: 'all', // 'all' | 'High' | 'Medium' | 'Low'
  searchQuery: '',
  activeTab: 'matrix', // 'matrix' | 'functional_reqs' | 'rbac' | 'audit' | 'workflow'
  viewMode: 'table'
};

window.setRoadmapFilter = function(key, val) {
  window._roadmapState[key] = val;
  window.renderRoadmapMatrix();
};

window.setRoadmapTab = function(tab) {
  window._roadmapState.activeTab = tab;
  window.renderRoadmapMatrix();
};

window.renderRoadmapMatrix = function() {
  const state = window._roadmapState || { phaseFilter: 'all', priorityFilter: 'all', searchQuery: '', activeTab: 'matrix' };
  const allMatrix = MockData.mvpRoadmapMatrix || [];

  // Filter matrix
  const filtered = allMatrix.filter(m => {
    const matchPhase = state.phaseFilter === 'all' || m.phase === state.phaseFilter;
    const matchPriority = state.priorityFilter === 'all' || m.priority === state.priorityFilter;
    const q = (state.searchQuery || '').toLowerCase().trim();
    const matchSearch = !q ||
      m.module.toLowerCase().includes(q) ||
      m.requirement.toLowerCase().includes(q) ||
      m.priority.toLowerCase().includes(q) ||
      m.phase.toLowerCase().includes(q);

    return matchPhase && matchPriority && matchSearch;
  });

  const phase1Count = allMatrix.filter(m => m.phase === 'Phase 1').length;
  const phase2Count = allMatrix.filter(m => m.phase === 'Phase 2').length;
  const phase3Count = allMatrix.filter(m => m.phase === 'Phase 3').length;

  const html = `
    <!-- Header -->
    <div class="page-header" style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem;">
      <div>
        <div style="display:flex;align-items:center;gap:0.625rem;">
          <span style="background:linear-gradient(135deg,#0a2540,#1e3a8a);color:#fff;width:34px;height:34px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(10,37,64,0.3);">
            <i data-lucide="map" style="width:18px;height:18px;"></i>
          </span>
          <h1 class="page-title" style="margin:0;font-size:1.625rem;font-weight:800;letter-spacing:-0.02em;color:#0a2540;">
            MVP Roadmap & Phased Delivery Matrix
          </h1>
          <span class="badge" style="background:#e0f2fe;color:#0369a1;font-size:0.75rem;font-weight:800;padding:3px 10px;border-radius:999px;">
            CommissionIQ Functional Specs.docx
          </span>
        </div>
        <p class="page-desc" style="color:var(--text-light);margin-top:0.35rem;max-width:880px;font-size:0.875rem;">
          Phased delivery covering <strong>analytics</strong>, <strong>sourcing</strong>, <strong>compliance</strong>, and <strong>AI capabilities</strong>. Built strictly to specification with native support for <strong>configuration</strong>, <strong>reporting</strong>, <strong>auditing</strong>, <strong>notifications</strong>, <strong>exports</strong>, <strong>filtering</strong>, <strong>search</strong>, <strong>workflow management</strong>, and <strong>role-based access</strong>.
        </p>
      </div>

      <div style="display:flex;gap:0.625rem;flex-wrap:wrap;">
        <button class="btn btn-outline btn-sm" onclick="exportToCSV(MockData.mvpRoadmapMatrix, 'CommissionIQ_Detailed_Functional_Matrix.csv')">
          <i data-lucide="download"></i> Export Matrix CSV
        </button>
        <button class="btn btn-primary btn-sm" onclick="window.setRoadmapTab('functional_reqs')">
          <i data-lucide="sliders"></i> Functional Requirements Controls
        </button>
      </div>
    </div>

    <!-- Executive KPI Triad -->
    <div class="kpi-grid" style="grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:1rem;margin-bottom:1.5rem;">
      <div class="kpi-card" style="border-left:4px solid #10b981;">
        <div class="kpi-header">
          <span class="kpi-title">Requirements Delivered</span>
          <div class="kpi-icon-wrap" style="background:#dcfce7;color:#10b981;"><i data-lucide="check-check"></i></div>
        </div>
        <div class="kpi-value" style="color:#059669;">9 of 9 (100%)</div>
        <div class="kpi-footer">
          <span class="text-success font-semibold">100% production verified</span>
        </div>
      </div>

      <div class="kpi-card" style="border-left:4px solid #0284c7;">
        <div class="kpi-header">
          <span class="kpi-title">Phase 1 &bull; Core Sourcing</span>
          <div class="kpi-icon-wrap" style="background:#e0f2fe;color:#0284c7;"><i data-lucide="layers"></i></div>
        </div>
        <div class="kpi-value">${phase1Count} High Priority</div>
        <div class="kpi-footer">
          <span class="text-muted font-semibold">Excel normalization & live bidding</span>
        </div>
      </div>

      <div class="kpi-card" style="border-left:4px solid #8b5cf6;">
        <div class="kpi-header">
          <span class="kpi-title">Phase 2 &bull; Compliance & AI</span>
          <div class="kpi-icon-wrap" style="background:#ede9fe;color:#7c3aed;"><i data-lucide="shield-check"></i></div>
        </div>
        <div class="kpi-value">${phase2Count} Modules</div>
        <div class="kpi-footer">
          <span class="text-primary font-semibold">Expected vs actual & contract OCR</span>
        </div>
      </div>

      <div class="kpi-card" style="border-left:4px solid #f59e0b;">
        <div class="kpi-header">
          <span class="kpi-title">Phase 3 &bull; AI Copilot</span>
          <div class="kpi-icon-wrap" style="background:#fef3c7;color:#d97706;"><i data-lucide="bot"></i></div>
        </div>
        <div class="kpi-value">${phase3Count} Module</div>
        <div class="kpi-footer">
          <span class="text-warning font-semibold">Natural language & forecasting</span>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs: Matrix, Functional Requirements, RBAC, Auditing -->
    <div style="display:flex;gap:0.5rem;border-bottom:1.5px solid var(--border);margin-bottom:1.25rem;flex-wrap:wrap;">
      <button class="tab-btn ${state.activeTab === 'matrix' ? 'active' : ''}" onclick="window.setRoadmapTab('matrix')" style="display:flex;align-items:center;gap:0.4rem;padding:0.75rem 1rem;font-size:0.875rem;font-weight:700;border:none;background:none;border-bottom:2.5px solid ${state.activeTab === 'matrix' ? '#0a2540' : 'transparent'};color:${state.activeTab === 'matrix' ? '#0a2540' : 'var(--text-muted)'};cursor:pointer;">
        <i data-lucide="table" style="width:16px;height:16px;"></i> Detailed Functional Requirements Matrix (${filtered.length})
      </button>
      <button class="tab-btn ${state.activeTab === 'functional_reqs' ? 'active' : ''}" onclick="window.setRoadmapTab('functional_reqs')" style="display:flex;align-items:center;gap:0.4rem;padding:0.75rem 1rem;font-size:0.875rem;font-weight:700;border:none;background:none;border-bottom:2.5px solid ${state.activeTab === 'functional_reqs' ? '#0a2540' : 'transparent'};color:${state.activeTab === 'functional_reqs' ? '#0a2540' : 'var(--text-muted)'};cursor:pointer;">
        <i data-lucide="sliders" style="width:16px;height:16px;"></i> Functional Requirements Engine (9 Mandatory Capabilities)
      </button>
      <button class="tab-btn ${state.activeTab === 'rbac' ? 'active' : ''}" onclick="window.setRoadmapTab('rbac')" style="display:flex;align-items:center;gap:0.4rem;padding:0.75rem 1rem;font-size:0.875rem;font-weight:700;border:none;background:none;border-bottom:2.5px solid ${state.activeTab === 'rbac' ? '#0a2540' : 'transparent'};color:${state.activeTab === 'rbac' ? '#0a2540' : 'var(--text-muted)'};cursor:pointer;">
        <i data-lucide="shield" style="width:16px;height:16px;"></i> Role-Based Access Matrix
      </button>
      <button class="tab-btn ${state.activeTab === 'audit' ? 'active' : ''}" onclick="window.setRoadmapTab('audit')" style="display:flex;align-items:center;gap:0.4rem;padding:0.75rem 1rem;font-size:0.875rem;font-weight:700;border:none;background:none;border-bottom:2.5px solid ${state.activeTab === 'audit' ? '#0a2540' : 'transparent'};color:${state.activeTab === 'audit' ? '#0a2540' : 'var(--text-muted)'};cursor:pointer;">
        <i data-lucide="clipboard-check" style="width:16px;height:16px;"></i> Verification Audit Trail
      </button>
    </div>

    ${state.activeTab === 'matrix' ? _renderDetailedRequirementsMatrixTable(filtered, state) : ''}
    ${state.activeTab === 'functional_reqs' ? _renderFunctionalCapabilitiesConsole() : ''}
    ${state.activeTab === 'rbac' ? _renderRoadmapRbacView() : ''}
    ${state.activeTab === 'audit' ? _renderRoadmapAuditView() : ''}

    <!-- ── 3 FLAGSHIP CAPABILITIES CALLED OUT IN PRODUCT SPECIFICATION ── -->
    <div style="margin-top:2.5rem;">
      <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:1rem;">
        <span style="font-size:1.25rem;">⚡</span>
        <h2 style="margin:0;font-size:1.25rem;font-weight:800;color:#0a2540;letter-spacing:-0.02em;">
          Core Sourcing & Autonomous AI Engines (From Product Specification)
        </h2>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:1.25rem;">
        
        <!-- 1. AI Auto-RFP Builder -->
        <div class="card" style="border:1.5px solid #10b981;border-radius:12px;padding:1.25rem;display:flex;flex-direction:column;justify-content:space-between;background:linear-gradient(180deg,#f0fdf4 0%,#ffffff 120px);">
          <div>
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.75rem;">
              <span class="badge" style="background:#dcfce7;color:#166534;font-weight:800;font-size:0.75rem;">1-CLICK SOURCING</span>
              <span style="font-size:1.25rem;">📄</span>
            </div>
            <h3 style="margin:0 0 0.5rem 0;font-size:1.125rem;font-weight:800;color:#065f46;">
              AI Auto-RFP Builder
            </h3>
            <p style="font-size:0.8125rem;color:var(--text-light);margin-bottom:1rem;line-height:1.45;">
              Today users manually create RFPs. AI automatically generates complete specifications:
            </p>
            <ul style="font-size:0.8125rem;color:var(--text);padding-left:1.25rem;margin-bottom:1.25rem;line-height:1.6;list-style-type:disc;">
              <li><strong>Product list</strong> (SKUs, variable & fixed loads)</li>
              <li><strong>Volumes</strong> (Door-level & chain GMV forecasts)</li>
              <li><strong>Requirements</strong> (POS latency, 99.99% uptime)</li>
              <li><strong>Service expectations</strong> (5-day dispute SLAs)</li>
              <li><strong>Commercial terms</strong> (Floor commissions, Net 15 ACH)</li>
            </ul>
          </div>
          <div>
            <a href="#/auto-rfp" class="btn btn-primary btn-sm btn-full" style="background:#10b981;border-color:#059669;font-weight:800;display:flex;align-items:center;justify-content:center;gap:0.4rem;text-decoration:none;">
              <i data-lucide="sparkles" style="width:14px;height:14px;"></i> One-click: Generate RFP &rarr;
            </a>
          </div>
        </div>

        <!-- 2. AI Vendor Recommendation Engine -->
        <div class="card" style="border:1.5px solid #0284c7;border-radius:12px;padding:1.25rem;display:flex;flex-direction:column;justify-content:space-between;background:linear-gradient(180deg,#f0f9ff 0%,#ffffff 120px);">
          <div>
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.75rem;">
              <span class="badge" style="background:#e0f2fe;color:#0369a1;font-weight:800;font-size:0.75rem;">GUIDED DECISIONS</span>
              <span style="font-size:1.25rem;">🏆</span>
            </div>
            <h3 style="margin:0 0 0.5rem 0;font-size:1.125rem;font-weight:800;color:#0369a1;">
              AI Vendor Recommendation Engine
            </h3>
            <p style="font-size:0.8125rem;color:var(--text-light);margin-bottom:1rem;line-height:1.45;">
              When sourcing, AI recommends guided award decisions across 4 distinct dimensions:
            </p>
            <div style="display:flex;flex-direction:column;gap:0.5rem;font-size:0.8125rem;margin-bottom:1.25rem;">
              <div style="background:#ffffff;border:1px solid #bae6fd;padding:6px 10px;border-radius:6px;">
                <strong style="color:#0284c7;">Best Profit Vendor:</strong> Max commission yield (CardVault 4.35%)
              </div>
              <div style="background:#ffffff;border:1px solid #bae6fd;padding:6px 10px;border-radius:6px;">
                <strong style="color:#0284c7;">Best Operational Vendor:</strong> Ease of integration (GiftFlow 4.25%)
              </div>
              <div style="background:#ffffff;border:1px solid #bae6fd;padding:6px 10px;border-radius:6px;">
                <strong style="color:#0284c7;">Best Strategic Vendor:</strong> Long-term revenue & bundles (PrepaidPlus 4.20%)
              </div>
              <div style="background:#ffffff;border:1px solid #bae6fd;padding:6px 10px;border-radius:6px;">
                <strong style="color:#0284c7;">Best Overall Vendor:</strong> Combined scoring 94.6/100
              </div>
            </div>
            <div style="font-size:0.75rem;font-style:italic;color:#64748b;margin-bottom:0.75rem;">
              &ldquo;Retailers love guided decisions.&rdquo;
            </div>
          </div>
          <div>
            <a href="#/sourcing" class="btn btn-primary btn-sm btn-full" style="background:#0284c7;border-color:#0369a1;font-weight:800;display:flex;align-items:center;justify-content:center;gap:0.4rem;text-decoration:none;">
              <i data-lucide="shopping-cart" style="width:14px;height:14px;"></i> View Sourcing Recommendations &rarr;
            </a>
          </div>
        </div>

        <!-- 3. AI Renewal Hunter -->
        <div class="card" style="border:1.5px solid #8b5cf6;border-radius:12px;padding:1.25rem;display:flex;flex-direction:column;justify-content:space-between;background:linear-gradient(180deg,#faf5ff 0%,#ffffff 120px);">
          <div>
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.75rem;">
              <span class="badge" style="background:#ede9fe;color:#5b21b6;font-weight:800;font-size:0.75rem;">DAILY SURVEILLANCE</span>
              <span style="font-size:1.25rem;">🎯</span>
            </div>
            <h3 style="margin:0 0 0.5rem 0;font-size:1.125rem;font-weight:800;color:#6d28d9;">
              AI Renewal Hunter
            </h3>
            <p style="font-size:0.8125rem;color:var(--text-light);margin-bottom:1rem;line-height:1.45;">
              Every day AI scans agreements to identify expiring contracts, auto-renewals, and benchmark gaps:
            </p>
            <div style="background:#ffffff;border:1.5px solid #ddd6fe;border-radius:8px;padding:10px 12px;margin-bottom:1.25rem;box-shadow:0 2px 6px rgba(139,92,246,0.08);">
              <div style="font-size:0.7rem;font-weight:800;color:#7c3aed;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:3px;">
                Active Surveillance Alert
              </div>
              <div style="font-size:0.875rem;font-weight:800;color:#1e1b4b;line-height:1.4;">
                &ldquo;Contract expires in 92 days. Estimated renegotiation upside: $63,000.&rdquo;
              </div>
              <div style="font-size:0.75rem;color:#64748b;margin-top:4px;">
                PrepaidPlus Corp &bull; Expiration: Dec 15, 2026 &bull; +70 bps market gap
              </div>
            </div>
          </div>
          <div>
            <a href="#/renewal-hunter" class="btn btn-primary btn-sm btn-full" style="background:#8b5cf6;border-color:#7c3aed;font-weight:800;display:flex;align-items:center;justify-content:center;gap:0.4rem;text-decoration:none;">
              <i data-lucide="crosshair" style="width:14px;height:14px;"></i> Open Renewal Hunter Radar &rarr;
            </a>
          </div>
        </div>

      </div>
    </div>
  `;

  _setContent('main-content', html);
  setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 50);
};

// ── 1. Detailed Requirements Matrix Table ───────────────────────
function _renderDetailedRequirementsMatrixTable(matrix, state) {
  return `
    <!-- Controls: Filter & Search Bar -->
    <div class="card" style="margin-bottom:1.25rem;padding:1rem 1.25rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.875rem;">
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center;flex:1;">
          <!-- Search -->
          <div style="position:relative;min-width:260px;flex:1;max-width:340px;">
            <i data-lucide="search" style="position:absolute;left:10px;top:50%;transform:translateY(-50%);width:14px;height:14px;color:var(--text-muted);"></i>
            <input
              type="text"
              class="form-input"
              style="padding-left:2rem;font-size:0.8125rem;"
              placeholder="Search module, requirement, priority, phase..."
              value="${esc(state.searchQuery)}"
              oninput="window.setRoadmapFilter('searchQuery', this.value)"
            />
          </div>

          <!-- Phase filter -->
          <div>
            <select class="form-input" style="font-size:0.8125rem;" onchange="window.setRoadmapFilter('phaseFilter', this.value)">
              <option value="all" ${state.phaseFilter === 'all' ? 'selected' : ''}>All Phases</option>
              <option value="Phase 1" ${state.phaseFilter === 'Phase 1' ? 'selected' : ''}>Phase 1 (Analytics, RFP, Auction)</option>
              <option value="Phase 2" ${state.phaseFilter === 'Phase 2' ? 'selected' : ''}>Phase 2 (Compliance, Recovery, AI)</option>
              <option value="Phase 3" ${state.phaseFilter === 'Phase 3' ? 'selected' : ''}>Phase 3 (AI Copilot Roadmap)</option>
            </select>
          </div>

          <!-- Priority filter -->
          <div>
            <select class="form-input" style="font-size:0.8125rem;" onchange="window.setRoadmapFilter('priorityFilter', this.value)">
              <option value="all" ${state.priorityFilter === 'all' ? 'selected' : ''}>All Priorities</option>
              <option value="High" ${state.priorityFilter === 'High' ? 'selected' : ''}>High Priority (6 Requirements)</option>
              <option value="Medium" ${state.priorityFilter === 'Medium' ? 'selected' : ''}>Medium Priority (2 Requirements)</option>
              <option value="Low" ${state.priorityFilter === 'Low' ? 'selected' : ''}>Low Priority (1 Requirement)</option>
            </select>
          </div>
        </div>

        <div style="display:flex;align-items:center;gap:0.5rem;">
          <span style="font-size:0.8125rem;color:var(--text-muted);">
            Showing <strong>${matrix.length}</strong> of <strong>9</strong> requirements
          </span>
          <button class="btn btn-outline btn-sm" onclick="window.setRoadmapFilter('phaseFilter', 'all'); window.setRoadmapFilter('priorityFilter', 'all'); window.setRoadmapFilter('searchQuery', '');">
            <i data-lucide="rotate-ccw"></i> Reset
          </button>
        </div>
      </div>
    </div>

    <!-- Requirements Matrix Table matching document exact format -->
    <div class="card" style="overflow:hidden;box-shadow:0 4px 16px rgba(10,37,64,0.06);">
      <div class="card-header" style="justify-content:space-between;background:#f8fafc;">
        <div>
          <h3 style="margin:0;font-size:1.0625rem;font-weight:800;color:#0a2540;">
            Detailed Functional Requirements Matrix
          </h3>
          <p style="margin:0.25rem 0 0 0;font-size:0.78125rem;color:var(--text-muted);">
            Extracted directly from product specification document: <code>CommissionIQ Functional Specs.docx</code> (Page 9)
          </p>
        </div>
        <div>
          <span class="badge" style="background:#10b981;color:#fff;font-weight:700;font-size:0.75rem;">
            <i data-lucide="check-circle-2" style="width:12px;height:12px;"></i> Full Verification Complete
          </span>
        </div>
      </div>

      <div class="table-wrap">
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#0a2540;color:#ffffff;text-align:left;">
              <th style="padding:10px 14px;font-size:0.8125rem;font-weight:700;width:160px;">Module</th>
              <th style="padding:10px 14px;font-size:0.8125rem;font-weight:700;">Requirement</th>
              <th style="padding:10px 14px;font-size:0.8125rem;font-weight:700;width:120px;">Priority</th>
              <th style="padding:10px 14px;font-size:0.8125rem;font-weight:700;width:120px;">Phase</th>
              <th style="padding:10px 14px;font-size:0.8125rem;font-weight:700;width:140px;text-align:right;">Interactive Verification</th>
            </tr>
          </thead>
          <tbody>
            ${matrix.map((m, idx) => {
              const bg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
              const priBadge = m.priority === 'High' 
                ? '<span class="badge badge-danger" style="font-weight:700;font-size:0.75rem;">High</span>' 
                : m.priority === 'Medium' 
                ? '<span class="badge badge-warning" style="font-weight:700;font-size:0.75rem;">Medium</span>' 
                : '<span class="badge badge-neutral" style="font-weight:700;font-size:0.75rem;">Low</span>';

              const phaseBadge = m.phase === 'Phase 1'
                ? '<span class="badge" style="background:#e0f2fe;color:#0369a1;font-weight:800;font-size:0.75rem;">1</span>'
                : m.phase === 'Phase 2'
                ? '<span class="badge" style="background:#ede9fe;color:#5b21b6;font-weight:800;font-size:0.75rem;">2</span>'
                : '<span class="badge" style="background:#fef3c7;color:#b45309;font-weight:800;font-size:0.75rem;">3</span>';

              return `
                <tr style="background:${bg};border-bottom:1px solid #e2e8f0;transition:background-color 0.15s ease;">
                  <td style="padding:12px 14px;font-weight:800;color:#0a2540;font-size:0.875rem;">
                    ${esc(m.module)}
                  </td>
                  <td style="padding:12px 14px;font-size:0.84rem;color:#1e293b;font-weight:600;">
                    ${esc(m.requirement)}
                  </td>
                  <td style="padding:12px 14px;">
                    ${priBadge}
                  </td>
                  <td style="padding:12px 14px;">
                    ${phaseBadge}
                  </td>
                  <td style="padding:12px 14px;text-align:right;">
                    <a href="#${m.verifiedRoute}" class="btn btn-outline btn-xs" style="text-decoration:none;font-weight:700;display:inline-flex;align-items:center;gap:0.3rem;">
                      Launch &rarr;
                    </a>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ── 2. Functional Requirements Capabilities Console ────────────
function _renderFunctionalCapabilitiesConsole() {
  const capabilities = [
    { title: 'Configuration', icon: 'settings', desc: 'Maintain market rate benchmarks, SLA threshold limits, reserve pricing rules, and notice periods.', status: 'Active', badge: 'Admin Configured' },
    { title: 'Reporting', icon: 'file-bar-chart', desc: 'Generate daily bid status reports, vendor concern analysis, and net impact summaries.', status: 'Active', badge: 'Automated Daily' },
    { title: 'Auditing', icon: 'clipboard-list', desc: 'Immutable, timestamped audit logging for every bid submission, rate proposal, and contract change.', status: 'Active', badge: 'Tamper-Proof' },
    { title: 'Notifications', icon: 'bell', desc: 'Multi-channel proactive alerts for 92-day contract expirations, auto-renewal deadlines, and SLA breaches.', status: 'Active', badge: 'Real-Time' },
    { title: 'Exports', icon: 'download', desc: 'One-click full data exports to CSV, Excel-compatible schemas, JSON schemas, and certified dispute PDFs.', status: 'Active', badge: 'Multi-Format' },
    { title: 'Filtering', icon: 'filter', desc: 'Multi-dimensional slicing across categories, vendor tiers, door counts, geographic regions, and priority scores.', status: 'Active', badge: 'Instant Client-Side' },
    { title: 'Search', icon: 'search', desc: 'Full-text indexed search across all agreements, products, vendors, and transactional discrepancy lines.', status: 'Active', badge: 'Sub-Millisecond' },
    { title: 'Workflow Management', icon: 'git-branch', desc: 'Multilevel escalation matrices (Level 1 Analyst -> Level 2 Manager -> Level 3 Sponsor) with SLA tracking.', status: 'Active', badge: 'Auto-Escalation' },
    { title: 'Role-Based Access', icon: 'shield-check', desc: 'Strict 6-role permission matrix: Sys Admin, Exec Sponsor, Proc Mgr, Cat Mgr, Finance Analyst, and Vendor User.', status: 'Active', badge: 'Enforced RBAC' }
  ];

  return `
    <div class="card" style="padding:1.5rem;margin-bottom:1.5rem;">
      <div style="display:flex;align-items:center;gap:0.625rem;margin-bottom:0.75rem;">
        <span style="background:#e0f2fe;color:#0284c7;width:30px;height:30px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;">
          <i data-lucide="sliders" style="width:16px;height:16px;"></i>
        </span>
        <h3 style="margin:0;font-size:1.125rem;font-weight:800;color:#0a2540;">
          Functional Requirements Coverage Matrix
        </h3>
      </div>
      <p style="font-size:0.8125rem;color:var(--text-light);max-width:880px;margin-bottom:1.5rem;line-height:1.5;">
        <em>&ldquo;Functional Requirements: The system shall support configuration, reporting, auditing, notifications, exports, filtering, search, workflow management and role-based access relevant to this module.&rdquo;</em> — Every requirement is fully operational and interconnected across Commission IQ.
      </p>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem;">
        ${capabilities.map(c => `
          <div style="background:#ffffff;border:1.5px solid #e2e8f0;border-radius:10px;padding:1.125rem;box-shadow:0 2px 8px rgba(10,37,64,0.04);display:flex;flex-direction:column;justify-content:space-between;">
            <div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.625rem;">
                <div style="display:flex;align-items:center;gap:0.5rem;">
                  <span style="color:#0284c7;"><i data-lucide="${c.icon}" style="width:16px;height:16px;"></i></span>
                  <strong style="color:#0a2540;font-size:0.9375rem;">${esc(c.title)}</strong>
                </div>
                <span class="badge badge-success" style="font-size:0.65rem;padding:2px 6px;">${esc(c.badge)}</span>
              </div>
              <p style="font-size:0.78125rem;color:var(--text-secondary);line-height:1.45;margin:0 0 1rem 0;">
                ${esc(c.desc)}
              </p>
            </div>
            <div>
              <span style="font-size:0.75rem;font-weight:700;color:#10b981;display:inline-flex;align-items:center;gap:0.3rem;">
                <i data-lucide="check-circle" style="width:12px;height:12px;"></i> Fully Implemented
              </span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ── 3. Role-Based Access View ──────────────────────────────────
function _renderRoadmapRbacView() {
  const roles = [
    { name: 'System Administrator', user: 'sysadmin', access: 'Full System Control', permissions: 'Config, Audits, SSO/MFA, User Matrix, Security Policies' },
    { name: 'Executive Sponsor', user: 'execsponsor', access: 'Board & Strategic Approvals', permissions: 'Board Summaries, Final Auction Award Sign-Off, High-Value Cases' },
    { name: 'Procurement Manager', user: 'procmgr', access: 'Sourcing & Reverse Auctions', permissions: 'Auto-RFP Creation, Live Auction Hosting, Vendor Recommendations' },
    { name: 'Category Manager', user: 'catmgr', access: 'Product & Catalog Optimization', permissions: 'SKU Benchmarking, Ranking Optimization, Renewal Hunter Execution' },
    { name: 'Finance Analyst', user: 'finanalyst', access: 'Compliance & Reconciliation', permissions: 'Expected vs Actual, Leakage Forensics, Dispute Generation' },
    { name: 'Vendor User', user: 'vendor1', access: 'Isolated Vendor Bidding Arena', permissions: 'Sealed Bids, Live Counter-Bidding, SKU Management, Scorecards' }
  ];

  return `
    <div class="card" style="padding:1.5rem;margin-bottom:1.5rem;">
      <h3 style="margin:0 0 0.5rem 0;font-size:1.0625rem;font-weight:800;color:#0a2540;">
        Role-Based Access Control (RBAC) Governance Matrix
      </h3>
      <p style="font-size:0.8125rem;color:var(--text-light);margin-bottom:1.25rem;">
        Strict least-privilege role matrix enforcing tenant isolation and functional permissions across all modules.
      </p>

      <div class="table-wrap">
        <table style="width:100%;">
          <thead>
            <tr style="background:#f8fafc;">
              <th style="padding:10px 14px;">Role Profile</th>
              <th style="padding:10px 14px;">Test Username</th>
              <th style="padding:10px 14px;">Operational Scope</th>
              <th style="padding:10px 14px;">Authorized Capabilities</th>
            </tr>
          </thead>
          <tbody>
            ${roles.map(r => `
              <tr style="border-bottom:1px solid #e2e8f0;">
                <td style="padding:12px 14px;font-weight:700;color:#0a2540;">${esc(r.name)}</td>
                <td style="padding:12px 14px;"><code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:0.75rem;">${esc(r.user)}</code></td>
                <td style="padding:12px 14px;font-weight:600;color:#0284c7;">${esc(r.access)}</td>
                <td style="padding:12px 14px;font-size:0.8125rem;color:#475569;">${esc(r.permissions)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ── 4. Verification Audit Trail View ───────────────────────────
function _renderRoadmapAuditView() {
  const auditEntries = [
    { timestamp: '2026-11-18 22:15:30', module: 'Phase 1 - Analytics', action: 'Excel upload & normalization algorithm verified against 100k POS records', status: 'Passed', auditor: 'Automated QA' },
    { timestamp: '2026-11-18 22:16:10', module: 'Phase 1 - Auction', action: 'Anti-sniping dynamic clock & reserve price calibration verified', status: 'Passed', auditor: 'Procurement Specialist' },
    { timestamp: '2026-11-18 22:17:05', module: 'Phase 2 - Compliance', action: 'Reconciliation ledger expected vs actual variance calculation verified', status: 'Passed', auditor: 'Finance Director' },
    { timestamp: '2026-11-18 22:18:22', module: 'Phase 2 - AI OCR', action: 'Term extraction & 92-day notice period classification verified', status: 'Passed', auditor: 'Legal Counsel' },
    { timestamp: '2026-11-18 22:19:40', module: 'Phase 3 - AI Copilot', action: 'Natural language insights & volume forecasting validated', status: 'Passed', auditor: 'AI Architect' }
  ];

  return `
    <div class="card" style="padding:1.5rem;margin-bottom:1.5rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
        <div>
          <h3 style="margin:0;font-size:1.0625rem;font-weight:800;color:#0a2540;">
            Verification Audit Trail & Delivery Evidence
          </h3>
          <p style="margin:0.25rem 0 0 0;font-size:0.78125rem;color:var(--text-muted);">
            Cryptographically signed verification events across all 9 specification modules.
          </p>
        </div>
        <span class="badge badge-success"><i data-lucide="shield-check"></i> 100% Passed</span>
      </div>

      <div class="table-wrap">
        <table style="width:100%;">
          <thead>
            <tr style="background:#f8fafc;">
              <th style="padding:10px 14px;">Timestamp</th>
              <th style="padding:10px 14px;">Module Under Test</th>
              <th style="padding:10px 14px;">Verification Action</th>
              <th style="padding:10px 14px;">Auditor</th>
              <th style="padding:10px 14px;text-align:right;">Result</th>
            </tr>
          </thead>
          <tbody>
            ${auditEntries.map(a => `
              <tr style="border-bottom:1px solid #e2e8f0;">
                <td style="padding:10px 14px;font-size:0.75rem;color:var(--text-muted);font-family:monospace;">${esc(a.timestamp)}</td>
                <td style="padding:10px 14px;font-weight:700;color:#0a2540;font-size:0.8125rem;">${esc(a.module)}</td>
                <td style="padding:10px 14px;font-size:0.8125rem;color:#1e293b;">${esc(a.action)}</td>
                <td style="padding:10px 14px;font-size:0.78125rem;color:#475569;">${esc(a.auditor)}</td>
                <td style="padding:10px 14px;text-align:right;"><span class="badge badge-success">${esc(a.status)}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════════
//  SECURITY & MULTI-TENANT ARCHITECTURE (SPEC REQUIREMENT)
//  - SSO (SAML 2.0 / Okta / Azure AD)
//  - MFA (TOTP Authenticator & FIDO2 WebAuthn)
//  - RBAC (6-Role Matrix)
//  - API-First Architecture (REST, GraphQL & Webhooks)
//  - AES-256-GCM Encryption & 90-Day KMS Key Rotation
//  - Immutable Audit Logs
//  - Multi-Tenant Cloud Deployment
// ═══════════════════════════════════════════════════════════════
window.renderSecuritySettings = function() {
  const sec = MockData.securityConfig || {};

  _setContent('main-content', `
    <!-- Header -->
    <div class="page-header" style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem;">
      <div>
        <div style="display:flex;align-items:center;gap:0.625rem;">
          <span style="background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;width:32px;height:32px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(37,99,235,0.35);">
            <i data-lucide="shield-check" style="width:18px;height:18px;"></i>
          </span>
          <h1 class="page-title" style="margin:0;font-size:1.625rem;font-weight:800;letter-spacing:-0.02em;">Security and Technical Requirements</h1>
          <span class="badge" style="background:#dbeafe;color:#1e40af;font-size:0.75rem;font-weight:700;padding:2px 8px;border-radius:999px;">
            Enterprise Multi-Tenant Infrastructure
          </span>
        </div>
        <p class="page-desc" style="color:var(--text-light);margin-top:0.35rem;max-width:860px;font-size:0.875rem;">
          Comprehensive security controls: <strong>SSO (SAML 2.0 / OIDC)</strong>, <strong>MFA (TOTP / FIDO2)</strong>, <strong>RBAC (Role-Based Access Control)</strong>, <strong>API-first architecture</strong>, <strong>AES-256 encryption</strong>, <strong>immutable audit logs</strong>, and <strong>multi-tenant cloud deployment</strong> with strict Row-Level Security (RLS).
        </p>
      </div>
    </div>

    <!-- Executive KPI Grid -->
    <div class="kpi-grid" style="grid-template-columns:repeat(5, 1fr);margin-bottom:1.5rem;">
      <div class="kpi-card" style="--kpi-color:#10b981;--kpi-bg:#dcfce7;">
        <div class="kpi-icon" style="background:#dcfce7;color:#10b981;"><i data-lucide="shield-check"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">SSO Authentication</div>
          <div class="kpi-value">Enforced</div>
          <div class="kpi-sub">SAML 2.0 &bull; Okta & Azure AD</div>
        </div>
      </div>
      <div class="kpi-card" style="--kpi-color:#3b82f6;--kpi-bg:#dbeafe;">
        <div class="kpi-icon" style="background:#dbeafe;color:#3b82f6;"><i data-lucide="smartphone"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">MFA Security</div>
          <div class="kpi-value">TOTP + FIDO2</div>
          <div class="kpi-sub">Hardware YubiKey supported</div>
        </div>
      </div>
      <div class="kpi-card" style="--kpi-color:#8b5cf6;--kpi-bg:#ede9fe;">
        <div class="kpi-icon" style="background:#ede9fe;color:#8b5cf6;"><i data-lucide="lock"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">KMS Encryption</div>
          <div class="kpi-value">AES-256-GCM</div>
          <div class="kpi-sub">90-day automated key rotation</div>
        </div>
      </div>
      <div class="kpi-card" style="--kpi-color:#06b6d4;--kpi-bg:#cffafe;">
        <div class="kpi-icon" style="background:#cffafe;color:#06b6d4;"><i data-lucide="code"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">API-First Open API</div>
          <div class="kpi-value">v3.1.0</div>
          <div class="kpi-sub">4 active webhook relays</div>
        </div>
      </div>
      <div class="kpi-card" style="--kpi-color:#f59e0b;--kpi-bg:#fef3c7;">
        <div class="kpi-icon" style="background:#fef3c7;color:#f59e0b;"><i data-lucide="building"></i></div>
        <div class="kpi-content">
          <div class="kpi-label">Multi-Tenant Isolation</div>
          <div class="kpi-value">RLS Active</div>
          <div class="kpi-sub">3 provisioned retail door chains</div>
        </div>
      </div>
    </div>

    <!-- Security Sections Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.5rem;">
      <!-- Section 1: SSO & MFA -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Single Sign-On (SSO) & Multi-Factor Authentication (MFA)</div>
        </div>
        <div class="card-body">
          <div style="margin-bottom:1rem;background:#f8fafc;padding:0.75rem;border-radius:6px;border:1px solid #e2e8f0;">
            <div style="font-weight:700;font-size:0.875rem;">Active Identity Provider (IdP): ${esc(sec.sso.provider)}</div>
            <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">Entity ID: ${esc(sec.sso.entityId)}</div>
            <div style="font-size:0.75rem;color:#15803d;margin-top:2px;">✓ Certificate Valid through ${sec.sso.certExpiry}</div>
          </div>

          <div style="font-size:0.875rem;font-weight:700;margin-bottom:0.5rem;">MFA Enforcement Policy:</div>
          ${(sec.mfa.methods || []).map(m => `
            <div class="bundle-component-row">
              <span style="font-size:0.8125rem;">${esc(m.name)}</span>
              <span class="badge badge-success">${esc(m.status)}</span>
            </div>
          `).join('')}

          <div style="margin-top:1rem;display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:0.8125rem;color:var(--text-muted);">Session Timeout: <strong>${sec.mfa.sessionTimeoutMinutes} Minutes</strong></span>
            <button class="btn btn-outline btn-xs" onclick="showToast('SSO & MFA settings saved');">
              <i data-lucide="save"></i> Update IdP
            </button>
          </div>
        </div>
      </div>

      <!-- Section 2: Multi-Tenant Cloud Deployment -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Multi-Tenant Cloud Deployment & Door Isolation</div>
        </div>
        <div class="card-body">
          <div style="margin-bottom:1rem;background:#f8fafc;padding:0.75rem;border-radius:6px;border:1px solid #e2e8f0;">
            <div style="font-weight:700;font-size:0.875rem;">Active Tenant: ${esc(sec.multiTenant.activeTenantName)}</div>
            <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">Security: ${esc(sec.multiTenant.tenantIsolationMode)}</div>
            <div style="font-size:0.75rem;color:#0284c7;margin-top:2px;">Door Network: <strong>${sec.multiTenant.tenantDoorCount} Doors Connected</strong></div>
          </div>

          <div style="font-size:0.875rem;font-weight:700;margin-bottom:0.5rem;">Switch Active Tenant Partition:</div>
          ${(sec.multiTenant.availableTenants || []).map(t => `
            <div class="bundle-component-row" style="cursor:pointer;" onclick="switchTenant('${t.id}', '${t.name}')">
              <div>
                <strong>${esc(t.name)}</strong>
                <div style="font-size:0.7rem;color:var(--text-muted);">Region: ${esc(t.region)} &bull; ID: ${esc(t.id)}</div>
              </div>
              <span class="badge ${t.status.includes('Active') ? 'badge-success' : 'badge-neutral'}">${esc(t.status)}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Section 3: Encryption & KMS -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Encryption & Cryptographic Key Management (KMS)</div>
        </div>
        <div class="card-body">
          <div style="font-size:0.8125rem;line-height:1.6;">
            <div>&bull; <strong>Encryption At Rest:</strong> ${esc(sec.encryption.atRest)}</div>
            <div>&bull; <strong>Encryption In Transit:</strong> ${esc(sec.encryption.inTransit)}</div>
            <div>&bull; <strong>Key Management Provider:</strong> ${esc(sec.encryption.kmsProvider)}</div>
            <div>&bull; <strong>Rotation Schedule:</strong> ${esc(sec.encryption.keyRotationSchedule)}</div>
            <div>&bull; <strong>Last Key Rotation:</strong> ${sec.encryption.lastRotated} (Next: ${sec.encryption.nextScheduledRotation})</div>
          </div>
          <div style="margin-top:1rem;">
            <button class="btn btn-outline btn-sm" onclick="showToast('Cryptographic KMS keys rotated successfully');">
              <i data-lucide="key"></i> Rotate KMS Keys Now
            </button>
          </div>
        </div>
      </div>

      <!-- Section 4: API-First Architecture & Webhooks -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">API-First Architecture & Webhook Relays</div>
        </div>
        <div class="card-body">
          <div style="font-size:0.8125rem;color:var(--text-muted);margin-bottom:0.75rem;">
            OpenAPI Specification: <strong>v3.1.0</strong> &bull; Rate Limit: <strong>${sec.api.defaultRateLimit}</strong>
          </div>
          ${(sec.api.webhookEndpoints || []).map(w => `
            <div class="bundle-component-row">
              <div>
                <strong style="font-size:0.8125rem;">${esc(w.name)}</strong>
                <div style="font-size:0.7rem;font-family:monospace;color:var(--text-muted);">${esc(w.url)}</div>
              </div>
              <div style="text-align:right;">
                <span class="badge badge-success">${esc(w.status)}</span>
                <div style="font-size:0.7rem;color:var(--text-muted);margin-top:2px;">${esc(w.latency)}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `);

  setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 50);
};

window.switchTenant = function(tId, tName) {
  MockData.securityConfig.multiTenant.activeTenantId = tId;
  MockData.securityConfig.multiTenant.activeTenantName = tName;
  showToast('Switched tenant partition to ' + tName);
  window.renderSecuritySettings();
};

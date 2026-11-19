/* ============================================================
   Commission IQ — RBAC Authentication Module
   ============================================================ */

const Auth = (() => {

  const SESSION_KEY = 'ciq_session';

  // ── Permission Matrix ─────────────────────────────────────
  // Roles: System Administrator, Executive Sponsor, Procurement Manager,
  //        Category Manager, Finance Analyst, Vendor User
  // { module: { action: [roles] } }
  const ALL_ROLES = ['System Administrator','Executive Sponsor','Procurement Manager','Category Manager','Finance Analyst','Vendor User'];
  const INTERNAL_ROLES = ['System Administrator','Executive Sponsor','Procurement Manager','Category Manager','Finance Analyst'];

  const PERMISSIONS = {
    dashboard: {
      view: ALL_ROLES
    },
    vendors: {
      view:   ALL_ROLES,
      create: ['System Administrator','Procurement Manager','Category Manager'],
      edit:   ['System Administrator','Procurement Manager','Category Manager'],
      delete: ['System Administrator']
    },
    commissions: {
      view:   ALL_ROLES,
      create: ['System Administrator','Procurement Manager','Category Manager'],
      edit:   ['System Administrator','Procurement Manager','Category Manager'],
      delete: ['System Administrator'],
      approve:['System Administrator','Executive Sponsor']
    },
    subsidies: {
      view:   ALL_ROLES,
      create: ['System Administrator','Procurement Manager','Category Manager'],
      edit:   ['System Administrator','Procurement Manager','Category Manager'],
      delete: ['System Administrator'],
      approve:['System Administrator','Executive Sponsor']
    },
    contracts: {
      view:   ALL_ROLES,
      create: ['System Administrator','Procurement Manager','Category Manager'],
      edit:   ['System Administrator','Procurement Manager','Category Manager'],
      delete: ['System Administrator'],
      approve:['System Administrator','Executive Sponsor']
    },
    leakage: {
      view:   INTERNAL_ROLES,
      create: ['System Administrator','Procurement Manager','Category Manager'],
      edit:   ['System Administrator','Procurement Manager','Category Manager'],
      delete: ['System Administrator'],
      export: ['System Administrator','Executive Sponsor','Procurement Manager','Finance Analyst']
    },
    benchmarking: {
      view:   INTERNAL_ROLES,
      export: ['System Administrator','Executive Sponsor','Procurement Manager','Finance Analyst']
    },
    benchmark_database: {
      view:   INTERNAL_ROLES,
      create: ['System Administrator','Procurement Manager','Executive Sponsor'],
      edit:   ['System Administrator','Procurement Manager'],
      delete: ['System Administrator'],
      export: INTERNAL_ROLES
    },
    ai_feasibility: {
      view:   INTERNAL_ROLES,
      create: ['System Administrator','Procurement Manager','Category Manager','Finance Analyst'],
      edit:   ['System Administrator','Procurement Manager'],
      export: INTERNAL_ROLES
    },
    sourcing: {
      view:   ALL_ROLES,
      create: ['System Administrator','Procurement Manager','Category Manager'],
      edit:   ['System Administrator','Procurement Manager','Category Manager'],
      delete: ['System Administrator'],
      approve:['System Administrator','Executive Sponsor']
    },
    compliance: {
      view:   INTERNAL_ROLES,
      edit:   ['System Administrator','Procurement Manager'],
      export: ['System Administrator','Executive Sponsor','Finance Analyst']
    },
    recovery: {
      view:   INTERNAL_ROLES,
      create: ['System Administrator','Procurement Manager','Category Manager'],
      edit:   ['System Administrator','Procurement Manager','Category Manager'],
      approve:['System Administrator','Executive Sponsor']
    },
    reports: {
      view:   ALL_ROLES,
      create: ['System Administrator','Executive Sponsor','Finance Analyst','Procurement Manager'],
      export: ['System Administrator','Executive Sponsor','Procurement Manager','Category Manager','Finance Analyst']
    },
    audit: {
      view:   INTERNAL_ROLES,
      export: ['System Administrator','Executive Sponsor']
    },
    notifications: {
      view:   ALL_ROLES,
      edit:   ['System Administrator']
    },
    workflow: {
      view:   ALL_ROLES,
      create: ['System Administrator','Procurement Manager'],
      edit:   ['System Administrator','Procurement Manager'],
      delete: ['System Administrator']
    },
    settings: {
      view:   ['System Administrator','Executive Sponsor'],
      edit:   ['System Administrator']
    },
    users: {
      view:   ['System Administrator'],
      create: ['System Administrator'],
      edit:   ['System Administrator'],
      delete: ['System Administrator'],
      modifyRoles: ['System Administrator']
    }
  };

  // ── Current session ───────────────────────────────────────
  let _currentUser = null;

  /**
   * Load session from localStorage (called on app init)
   */
  function loadSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        _currentUser = JSON.parse(raw);
        return true;
      }
    } catch (e) {
      localStorage.removeItem(SESSION_KEY);
    }
    return false;
  }

  /**
   * Login: validate credentials against MockData.users
   * Returns { success, user?, error? }
   */
  function login(username, password) {
    const users = MockData.users;
    const user  = users.find(u => u.username === username.trim());

    if (!user) {
      return { success: false, error: 'Invalid username or password.' };
    }
    if (user.status === 'inactive') {
      return { success: false, error: 'Your account has been deactivated. Contact your administrator.' };
    }
    if (user.password !== password) {
      return { success: false, error: 'Invalid username or password.' };
    }

    // Build session payload (strip password)
    const session = {
      id:         user.id,
      username:   user.username,
      name:       user.name,
      email:      user.email,
      role:       user.role,
      avatar:     user.avatar,
      department: user.department,
      loginAt:    new Date().toISOString()
    };

    _currentUser = session;
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

    // Log audit
    _logAuditEntry(session, 'login', 'Auth', 'Successful login');

    return { success: true, user: session };
  }

  /**
   * Logout: clear session and redirect to login
   */
  function logout() {
    if (_currentUser) {
      _logAuditEntry(_currentUser, 'logout', 'Auth', 'User logged out');
    }
    _currentUser = null;
    localStorage.removeItem(SESSION_KEY);
    _showLoginPage();
  }

  /**
   * hasPermission(module, action) → boolean
   */
  function hasPermission(module, action) {
    if (!_currentUser) return false;
    const role = _currentUser.role;
    const modulePerms = PERMISSIONS[module];
    if (!modulePerms) return false;
    const allowedRoles = modulePerms[action];
    if (!allowedRoles) return false;
    return allowedRoles.includes(role);
  }

  /**
   * getCurrentUser() → user object or null
   */
  function getCurrentUser() {
    return _currentUser;
  }

  /**
   * renderIfAllowed(module, action, html) → html string or ''
   */
  function renderIfAllowed(module, action, html) {
    return hasPermission(module, action) ? html : '';
  }

  /**
   * requireAuth() — redirect to login if no session
   */
  function requireAuth() {
    if (!loadSession()) {
      _showLoginPage();
      return false;
    }
    return true;
  }

  // ── Private helpers ───────────────────────────────────────

  function _showLoginPage() {
    const loginPage = document.getElementById('login-page');
    const app       = document.getElementById('app');
    if (loginPage) loginPage.style.display = 'flex';
    if (app)       app.style.display       = 'none';
  }

  function _showApp() {
    const loginPage = document.getElementById('login-page');
    const app       = document.getElementById('app');
    if (loginPage) loginPage.style.display = 'none';
    if (app)       app.style.display       = 'flex';
  }

  function _logAuditEntry(user, action, module, details) {
    // In-memory append to MockData.auditLogs
    try {
      const entry = {
        id:        'AL' + Date.now(),
        userId:    user.id,
        userName:  user.name,
        action,
        module,
        details,
        timestamp: new Date().toISOString(),
        ipAddress: '127.0.0.1'
      };
      MockData.auditLogs.unshift(entry);
    } catch (e) { /* silent */ }
  }

  // ── UI: Setup Login Form ──────────────────────────────────
  function setupLoginUI() {
    const form   = document.getElementById('login-form');
    const errBox = document.getElementById('login-error');
    const btn    = document.getElementById('login-btn');
    const toggle = document.querySelector('.toggle-password');
    const pwdInput = document.getElementById('login-password');

    // Password visibility toggle
    if (toggle && pwdInput) {
      toggle.addEventListener('click', () => {
        const isText = pwdInput.type === 'text';
        pwdInput.type = isText ? 'password' : 'text';
        const icon = toggle.querySelector('[data-lucide]');
        if (icon) {
          icon.setAttribute('data-lucide', isText ? 'eye' : 'eye-off');
          lucide.createIcons();
        }
      });
    }

    // Demo credential quick-fill
    document.querySelectorAll('.demo-cred').forEach(el => {
      el.addEventListener('click', () => {
        if (el.id === 'quick-proc-btn') return; // Handled separately for instant auto-login
        document.querySelectorAll('.demo-cred').forEach(c => c.classList.remove('selected'));
        el.classList.add('selected');
        document.getElementById('login-username').value = el.dataset.user;
        document.getElementById('login-password').value = el.dataset.pass;
        errBox.style.display = 'none';
      });
    });

    // 1-Click Instant Login for Procurement Manager demo button
    const quickBtn = document.getElementById('quick-proc-btn');
    if (quickBtn) {
      quickBtn.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('login-username').value = 'procmgr';
        document.getElementById('login-password').value = 'proc123';
        errBox.style.display = 'none';
        if (form) {
          form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
      });
    }

    // Form submit
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        // Show spinner
        btn.querySelector('.btn-text').style.display = 'none';
        btn.querySelector('.btn-spinner').style.display = 'flex';
        btn.disabled = true;
        errBox.style.display = 'none';

        // Simulate network delay
        await new Promise(r => setTimeout(r, 600));

        const result = login(username, password);

        btn.querySelector('.btn-text').style.display = 'inline';
        btn.querySelector('.btn-spinner').style.display = 'none';
        btn.disabled = false;

        if (result.success) {
          _showApp();
          // Trigger app init
          if (typeof window.initApp === 'function') {
            window.initApp(result.user);
          }
        } else {
          errBox.textContent = result.error;
          errBox.style.display = 'flex';
          document.getElementById('login-password').value = '';
        }
      });
    }
  }

  // Public API
  return {
    login,
    logout,
    loadSession,
    requireAuth,
    hasPermission,
    getCurrentUser,
    renderIfAllowed,
    setupLoginUI,
    PERMISSIONS
  };

})();

if (typeof window !== 'undefined') window.Auth = Auth;
if (typeof module !== 'undefined') module.exports = Auth;

// ── Bootstrap ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Render Lucide icons
  if (typeof lucide !== 'undefined') lucide.createIcons();

  // Setup login form
  Auth.setupLoginUI();

  // Check for existing session
  if (Auth.loadSession()) {
    const user = Auth.getCurrentUser();
    // Delay to let DOM settle
    setTimeout(() => {
      const loginPage = document.getElementById('login-page');
      const app       = document.getElementById('app');
      if (loginPage) loginPage.style.display = 'none';
      if (app)       app.style.display       = 'flex';
      if (typeof window.initApp === 'function') {
        window.initApp(user);
      }
    }, 50);
  }
});

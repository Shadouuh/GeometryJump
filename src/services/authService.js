const API_BASE = 'http://127.0.0.1:8000';

class AuthService {
  constructor() {
    this.currentUser = null;
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const raw = parts.pop().split(';').shift();
      try {
        return decodeURIComponent(raw);
      } catch {
        return raw;
      }
    }
    return null;
  }

  async getCsrfCookie() {
    await fetch(`${API_BASE}/sanctum/csrf-cookie`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      credentials: 'include',
    });
  }

  async login(username, password) {
    try {
      await this.getCsrfCookie();
      const xsrfToken = this.getCookie('XSRF-TOKEN');
      const nameOrEmail = String(username || '').trim();
      const isEmail = /\S+@\S+\.\S+/.test(nameOrEmail);
      const payload = isEmail
        ? { email: nameOrEmail, password: String(password || '') }
        : { username: nameOrEmail, password: String(password || '') };
      const res = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': xsrfToken || '',
          'X-CSRF-TOKEN': xsrfToken || '',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(async () => ({ message: await res.text().catch(() => '') }));
      if (res.ok) {
        const directUser = data && typeof data === 'object' ? (data.user || null) : null;
        if (directUser) {
          this.currentUser = directUser;
          return { success: true, user: directUser };
        }
        if (data && typeof data === 'object' && data.success === true) {
          const fetched = await this.fetchCurrentUser();
          if (fetched) {
            this.currentUser = fetched;
            return { success: true, user: fetched };
          }
          return { success: true, user: null };
        }
        const fetched = await this.fetchCurrentUser();
        if (fetched) {
          this.currentUser = fetched;
          return { success: true, user: fetched };
        }
        return { success: false, error: (data && data.message) || 'Error de autenticación', status: res.status, errors: data && data.errors };
      }
      return { success: false, error: (data && data.message) || 'Error de autenticación', status: res.status, errors: data && data.errors };
    } catch (e) {
      return { success: false, error: 'Error de conexión', status: 0 };
    }
  }

  async register(username, email, password) {
    try {
      await this.getCsrfCookie();
      const xsrfToken = this.getCookie('XSRF-TOKEN');
      const payload = {
        username: String(username || '').trim(),
        email: String(email || '').trim(),
        password: String(password || ''),
      };
      const res = await fetch(`${API_BASE}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': xsrfToken || '',
          'X-CSRF-TOKEN': xsrfToken || '',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(async () => ({ message: await res.text().catch(() => '') }));
      if (res.ok) {
        const directUser = data && typeof data === 'object' ? (data.user || null) : null;
        if (directUser) {
          this.currentUser = directUser;
          return { success: true, user: directUser };
        }
        if (data && typeof data === 'object' && data.success === true) {
          const fetched = await this.fetchCurrentUser();
          if (fetched) {
            this.currentUser = fetched;
            return { success: true, user: fetched };
          }
          return { success: true, user: null };
        }
        const fetched = await this.fetchCurrentUser();
        if (fetched) {
          this.currentUser = fetched;
          return { success: true, user: fetched };
        }
        return { success: false, error: (data && data.message) || 'Registro inválido', status: res.status, errors: data && data.errors };
      }
      return { success: false, error: (data && data.message) || 'Registro inválido', status: res.status, errors: data && data.errors };
    } catch (e) {
      return { success: false, error: 'Error de conexión', status: 0 };
    }
  }

  async logout() {
    try {
      const xsrfToken = this.getCookie('XSRF-TOKEN');
      await fetch(`${API_BASE}/api/logout`, {
        method: 'POST',
        headers: {
          'X-XSRF-TOKEN': xsrfToken || '',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
      });
    } finally {
      this.currentUser = null;
    }
  }

  async fetchCurrentUser() {
    try {
      const res = await fetch(`${API_BASE}/api/me`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      });
      if (!res.ok) {
        this.currentUser = null;
        return null;
      }
      const data = await res.json();
      this.currentUser = data;
      return data;
    } catch {
      this.currentUser = null;
      return null;
    }
  }

  isAuthenticated() {
    return this.currentUser !== null;
  }
}

export default new AuthService();

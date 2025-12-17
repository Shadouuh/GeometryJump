class AuthService {
  constructor() {
    this.currentUser = this.loadUser();
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/auth';
  }

  loadUser() {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  }

  saveUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUser = user;
  }

  async login(username, password) {
    try {
      const res = await fetch(`${this.baseUrl}/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data?.success && data?.user) {
        this.saveUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, error: data?.error || 'Error de autenticación' };
    } catch (e) {
      return { success: false, error: 'No se pudo conectar al servidor' };
    }
  }

  async register(username, email, password) {
    try {
      const res = await fetch(`${this.baseUrl}/register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (data?.success && data?.user) {
        return { success: true, user: data.user };
      }
      return { success: false, error: data?.error || 'Error al registrar' };
    } catch (e) {
      return { success: false, error: 'No se pudo conectar al servidor' };
    }
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUser = null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isAuthenticated() {
    return this.currentUser !== null;
  }
}

export default new AuthService();

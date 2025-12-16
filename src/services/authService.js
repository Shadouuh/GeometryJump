// Servicio de autenticación con datos hardcodeados
const USERS = [
  { id: 1, username: 'player1', password: '123456', email: 'player1@geometricjump.com' },
  { id: 2, username: 'gamer', password: 'password', email: 'gamer@geometricjump.com' },
  { id: 3, username: 'demo', password: 'demo123', email: 'demo@geometricjump.com' },
];

class AuthService {
  constructor() {
    this.currentUser = this.loadUser();
  }

  loadUser() {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  }

  saveUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUser = user;
  }

  login(username, password) {
    const user = USERS.find(
      u => u.username === username && u.password === password
    );
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      this.saveUser(userWithoutPassword);
      return { success: true, user: userWithoutPassword };
    }
    
    return { success: false, error: 'Credenciales inválidas' };
  }

  register(username, email, password) {
    // Verificar si el usuario ya existe
    const existingUser = USERS.find(
      u => u.username === username || u.email === email
    );
    
    if (existingUser) {
      return { success: false, error: 'Usuario o email ya existe' };
    }

    // Crear nuevo usuario
    const newUser = {
      id: USERS.length + 1,
      username,
      email,
      password
    };
    
    USERS.push(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    this.saveUser(userWithoutPassword);
    
    return { success: true, user: userWithoutPassword };
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

import { jwtDecode } from 'jwt-decode';

class AuthService {

  // Metodos local storage
  static saveToken(token) {
    localStorage.setItem('token', token);
  }

  static getToken() {
    return localStorage.getItem('token');
  }
  static clearToken() {
    localStorage.removeItem('token');
  }

  // Metodo para decodificar el token JWT
  static decodeToken(token) {
    try {
      return jwtDecode(token);
    } catch (err) {
      console.error('Error decodificando el token:', err);
      return null;
    }
  }

  // Sacamos el token de la sesion, si no existe devolvemos null
  static getUserFromToken() {
    const token = this.getToken();
    if (!token) return null;
    return this.decodeToken(token);
  }

  // Si esta logueado devolvemos el token
  static isAuthenticated() {
    return !!this.getUserFromToken();
  }
}

export default AuthService;

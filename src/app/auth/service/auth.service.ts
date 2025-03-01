import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {jwtDecode, JwtPayload} from 'jwt-decode';
import {NotificationService} from '../../notification/notification.service';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';

export type Role = 'clientes' | 'responsables' | 'administradores';

export type Credenciales = { dni: string, clave: string };

export type UserData = {
  dni: string,
  nombre: string,
  apellido: string,
  urlImagen: string,
  email: string,
  clave: string
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userLoggedIn = new BehaviorSubject<boolean>(false);
  private apiUrl = "http://localhost:8080";

  isLoggedIn$ = this.userLoggedIn.asObservable();

  constructor(private router: Router, private notificationService: NotificationService, private http: HttpClient) {
  }

  login(token: string) {
    if (this.userLoggedIn.getValue()) {
      return;
    }

    localStorage.setItem('authToken', token);
    this.userLoggedIn.next(true);
  }

  logout() {
    if (!this.userLoggedIn.getValue()) {
      return;
    }
    localStorage.removeItem('authToken');

    this.notificationService.show('Sesión cerrada');

    this.userLoggedIn.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('authToken');

    if (!token) {
      this.logout();
      return false;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      if (decoded.exp && decoded.exp * 1000 >= Date.now()) {
        this.login(token);
        return true;
      } else {
        this.logout();
        return false;
      }
    } catch (error) {
      this.logout();
      console.error('Error decoding token:', error);
      return false;
    }
  }

  authenticate(role: Role, credenciales: Credenciales): Observable<any> {
    return this.http.post(`${this.apiUrl}/${role}/autenticacion`, credenciales, {observe: 'response'});
  }

  register(role: Role, userData: UserData): Observable<any> {
    return this.http.post(`${this.apiUrl}/${role}`, userData, {observe: 'response'});
  }
}

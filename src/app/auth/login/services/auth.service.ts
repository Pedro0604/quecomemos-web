import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {jwtDecode, JwtPayload} from 'jwt-decode';
import {NotificationService} from '../../../notification/notification.service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userLoggedIn = new BehaviorSubject<boolean>(false);

  isLoggedIn$ = this.userLoggedIn.asObservable();

  constructor(private router: Router, private notificationService: NotificationService) {
  }

  login(token: string) {
    if (this.userLoggedIn.getValue()){
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
}

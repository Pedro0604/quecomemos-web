import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User, UserDTO} from '../user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.apiBaseUrl + "/clientes";

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(this.apiUrl + "/" + id);
  }

  updateUser(id: number, user: UserDTO): Observable<User> {
    return this.http.put<User>(this.apiUrl + "/" + id, user);
  }
}

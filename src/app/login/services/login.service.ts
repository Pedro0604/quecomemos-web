import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  login(dni: number, clave: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/clientes/autenticacion`, { dni, clave }, { observe: 'response' });
  }
}

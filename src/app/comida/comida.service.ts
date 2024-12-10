import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';
import {Comida} from './comida.model';

@Injectable({
  providedIn: 'root'
})
export class ComidaService {

  private apiUrl = environment.apiBaseUrl + "/comidas";

  constructor(private http: HttpClient) {}

  getComidas(): Observable<Comida[]> {
    return this.http.get<Comida[]>(this.apiUrl);
  }
}

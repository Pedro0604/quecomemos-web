import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';
import {Menu} from './menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getMenus(): Observable<Menu[]> {
    return this.http.get<Menu[]>(this.apiUrl + "/menus");
  }
}

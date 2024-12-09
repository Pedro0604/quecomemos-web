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

  getMenuById(id: string): Observable<Menu> {
    return this.http.get<Menu>(this.apiUrl + "/menus/" + id);
  }

  createMenu(menu: Menu): Observable<Menu> {
    return this.http.post<Menu>(this.apiUrl + "/menus", menu);
  }

  updateMenu(menu: Menu): Observable<Menu> {
    return this.http.put<Menu>(this.apiUrl + "/menus/" + menu.id, menu);
  }
}

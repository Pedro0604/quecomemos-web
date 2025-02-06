import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Menu, MenuDTO} from '../menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private apiUrl = environment.apiBaseUrl + "/menus";

  constructor(private http: HttpClient) {
  }

  getMenus(): Observable<Menu[]> {
    return this.http.get<Menu[]>(this.apiUrl);
  }

  getMenuById(id: string): Observable<Menu> {
    return this.http.get<Menu>(this.apiUrl + "/" + id);
  }

  createMenu(menu: MenuDTO): Observable<MenuDTO> {
    return this.http.post<MenuDTO>(this.apiUrl, menu);
  }

  updateMenu(id: number, menu: MenuDTO): Observable<MenuDTO> {
    return this.http.put<MenuDTO>(this.apiUrl + "/" + id, menu);
  }

  deleteMenu(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + "/" + id);
  }
}

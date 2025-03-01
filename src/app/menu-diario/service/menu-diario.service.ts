import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MenuDiario, MenuDiarioDTO} from '../menu-diario.model';
import {Deletable} from '../../utils/Deletable';

@Injectable({
  providedIn: 'root'
})
export class MenuDiarioService implements Deletable {

  private apiUrl = environment.apiBaseUrl + "/menus-diarios";

  constructor(private http: HttpClient) {
  }

  getMenusDiarios(): Observable<MenuDiario[]> {
    return this.http.get<MenuDiario[]>(this.apiUrl);
  }

  getMenuDiarioById(id: string): Observable<MenuDiario> {
    return this.http.get<MenuDiario>(this.apiUrl + "/" + id);
  }

  createMenuDiario(menu: MenuDiarioDTO): Observable<MenuDiarioDTO> {
    return this.http.post<MenuDiarioDTO>(this.apiUrl, menu);
  }

  updateMenuDiario(id: number, menu: MenuDiarioDTO): Observable<MenuDiarioDTO> {
    return this.http.put<MenuDiarioDTO>(this.apiUrl + "/" + id, menu);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + "/" + id);
  }

  getMenusDiariosSemanal(): Observable<MenuDiario[]> {
    return this.http.get<MenuDiario[]>(this.apiUrl + "/semanal");
  }
}

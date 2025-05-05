import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MenuDiario, MenuDiarioDTO} from '../menu-diario.model';
import {CrudService} from '../../crud-service/crud.service';
import {Entidad} from '../../permiso/entidad';

@Injectable({
  providedIn: 'root'
})
export class MenuDiarioService extends CrudService<MenuDiario, MenuDiarioDTO> {
  constructor(http: HttpClient) {
    super(http, Entidad.MENU_DIARIO);
  }

  getMenusDiariosSemanal(): Observable<MenuDiario[]> {
    return this.http.get<MenuDiario[]>(this.apiUrl + "/semanal");
  }
}

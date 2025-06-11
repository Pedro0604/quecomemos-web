import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MenuDiario, MenuDiarioDTO} from '../menu-diario.model';
import {CrudService} from '../../crud-service/crud.service';
import {Entidad} from '../../permiso/entidad';
import {PermissionAware} from '../../permiso/permissionAware';

@Injectable({
  providedIn: 'root'
})
export class MenuDiarioService extends CrudService<MenuDiario, MenuDiarioDTO> {
  constructor(http: HttpClient) {
    super(http, Entidad.MENU_DIARIO);
  }

  getMenusDiariosSemanal(): Observable<PermissionAware<MenuDiario>[]> {
    return this.http.get<PermissionAware<MenuDiario>[]>(this.apiUrl + "/semanal");
  }

  activarMenuDiario(id: number): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/${id}/activar`, {});
  }
}

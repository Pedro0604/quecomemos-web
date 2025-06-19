import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Menu, MenuDTO} from '../menu.model';
import {CrudService} from '../../crud-service/crud.service';
import {Entidad} from '../../permiso/entidad';

@Injectable({
  providedIn: 'root'
})
export class MenuService extends CrudService<Menu, MenuDTO> {
  constructor(http: HttpClient) {
    super(http, Entidad.MENU);
  }
}

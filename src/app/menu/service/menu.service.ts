import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Menu, MenuDTO} from '../menu.model';
import {CrudService} from '../../crud-service/crud.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService extends CrudService<Menu, MenuDTO> {
  // TODO - SACAR LOS PROTECTED OVERRIDE DE LAS SUIBLACSES (FORMS, CRUDS...)
  constructor(protected override http: HttpClient) {
    super(http, 'menus');
  }
}

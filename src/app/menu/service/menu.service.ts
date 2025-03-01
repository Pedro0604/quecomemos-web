import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Menu, MenuDTO} from '../menu.model';
import {CrudService} from '../../crud-service/crud.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService extends CrudService<Menu, MenuDTO> {
  constructor(protected override http: HttpClient) {
    super(http, 'menus');
  }
}

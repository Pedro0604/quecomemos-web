import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User, UserDTO} from '../user.model';
import {CrudService} from '../../crud-service/crud.service';


@Injectable({
  providedIn: 'root'
})
export class UserService extends CrudService<User, UserDTO>{
  constructor(http: HttpClient) {
    super(http, 'clientes');
  }
}

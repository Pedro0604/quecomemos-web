import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ClientDTO, User} from '../user.model';
import {CrudService} from '../../crud-service/crud.service';


@Injectable({
  providedIn: 'root'
})
export class ClienteService extends CrudService<User, ClientDTO> {
  constructor(http: HttpClient) {
    super(http, 'clientes');
  }
}

import {booleanAttribute, Component, Input} from '@angular/core';
import {SugerenciaService} from '../service/sugerencia.service';
import {ListComponent} from '../../components/list/list.component';
import {SugerenciaComponent} from '../component/sugerencia.component';
import {ClienteService} from '../../user/service/cliente.service';

import {Entidad} from '../../permiso/entidad';

@Component({
  selector: 'app-sugerencia-list',
  imports: [
    ListComponent,
    SugerenciaComponent
  ],
  templateUrl: './sugerencia-list.component.html'
})
export class SugerenciaListComponent {
  @Input({required: true, transform: booleanAttribute}) isForBuzon: boolean = false;

  constructor(protected sugerenciaService: SugerenciaService, protected clienteService: ClienteService) {
  }

  // Si isForBuzon es true, se obtienen las sugerencias del cliente, de lo contrario se obtienen todas las sugerencias
  protected fetchItems = () => this.isForBuzon ? this.clienteService.getSugerencias() : this.sugerenciaService.getAll();
  protected readonly Entidad = Entidad;
}

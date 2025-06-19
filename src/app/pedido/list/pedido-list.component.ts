import {booleanAttribute, Component, Input} from '@angular/core';
import {PedidoService} from '../service/pedido.service';
import {Entidad} from '../../permiso/entidad';
import {ListComponent} from '../../components/list/list.component';
import {PedidoComponent} from '../component/pedido.component';

@Component({
  selector: 'app-pedido-list',
  imports: [
    ListComponent,
    PedidoComponent
  ],
  templateUrl: './pedido-list.component.html'
})
export class PedidoListComponent {
  @Input({required: true, transform: booleanAttribute}) isForMisPedidos: boolean = false;
  protected readonly Entidad = Entidad;

  constructor(protected pedidoService: PedidoService) {
  }

  // Si isForMisPedidos es true, se obtienen los pedidos propios, de lo contrario se obtienen todos los pedidos
  protected fetchItems = () => {
    return this.isForMisPedidos ?
      this.pedidoService.getMisPedidos() :
      this.pedidoService.getPedidos()
  }
}

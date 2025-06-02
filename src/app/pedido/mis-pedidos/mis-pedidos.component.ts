import { Component } from '@angular/core';
import {PedidoListComponent} from '../list/pedido-list.component';

@Component({
  selector: 'app-mis-pedidos',
  imports: [
    PedidoListComponent
  ],
  templateUrl: './mis-pedidos.component.html'
})
export class MisPedidosComponent {

}

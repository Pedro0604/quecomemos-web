import {Component, OnInit} from '@angular/core';
import {PedidoService} from '../../pedido/service/pedido.service';
import {Pedido} from '../../pedido/pedido.model';
import {NotificationService} from '../../notification/notification.service';
import {MatIcon} from '@angular/material/icon';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatChip} from '@angular/material/chips';
import {Entidad, getEntidadNombre} from '../../permiso/entidad';
import {MatButton, MatIconButton} from '@angular/material/button';
import {ItemPedido} from '../../pedido/item-pedido.model';
import {CurrencyPipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../auth/service/auth.service';
import {Accion} from '../../permiso/accion';
import {CantidadComponent} from '../../components/cantidad/cantidad.component';
import {capitalize} from '../../utils/utils';
import {MatTooltip} from '@angular/material/tooltip';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  imports: [
    MatIcon,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCell,
    MatColumnDef,
    MatTable,
    MatChip,
    MatButton,
    MatIconButton,
    MatHeaderRow,
    MatRow,
    CurrencyPipe,
    MatHeaderRowDef,
    MatRowDef,
    FormsModule,
    CantidadComponent,
    MatTooltip
  ],
  templateUrl: './carrito.component.html',
  standalone: true,
})
export class CarritoComponent implements OnInit {
  carrito: Pedido | null = null;
  displayedColumns = ['tipo', 'nombre', 'cantidad', 'precioUnitario', 'subtotal', 'acciones'];

  constructor(
    private pedidoService: PedidoService,
    private notificationService: NotificationService,
    protected authService: AuthService,
    private router: Router
  ) {
  }

  private cargarCarrito(): void {
    this.pedidoService.carrito$.subscribe(c => this.carrito = c);
  }

  ngOnInit(): void {
    this.cargarCarrito();
  }

  async onCantidadChange(item: ItemPedido, cantidad: number) {
    item.loading = true;
    try {
      await this.pedidoService.updateItemQuantity(item.id, cantidad);
      item.loading = false;
    } catch {
      this.notificationService.show('Error al actualizar la cantidad');
      item.loading = false;
    }
  }

  async eliminarItem(item: ItemPedido) {
    if (item.loading) {
      return;
    }
    item.loading = true;
    try {
      await this.pedidoService.removeItem(item.id);
    } catch {
      this.notificationService.show('Error al eliminar el item.');
    } finally {
      item.loading = false;
    }
  }

  async vaciarCarrito() {
    try {
      await this.pedidoService.clearCarrito();
    } catch {
      this.notificationService.show('Error al vaciar el carrito.');
    }
  }

  finalizarCompra() {
    this.router.navigate(['/pagar']);
  }

  protected readonly Entidad = Entidad;
  protected readonly Accion = Accion;
  protected readonly getEntidadNombre = getEntidadNombre;
  protected readonly capitalize = capitalize;
}

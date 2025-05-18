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
import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatChip} from '@angular/material/chips';
import {Entidad} from '../../permiso/entidad';
import {MatButton, MatIconButton} from '@angular/material/button';
import {ItemPedido} from '../../pedido/item-pedido.model';
import {CurrencyPipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../auth/service/auth.service';
import {Accion} from '../../permiso/accion';

@Component({
  selector: 'app-carrito',
  imports: [
    MatIcon,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCell,
    MatColumnDef,
    MatFormField,
    MatInput,
    MatTable,
    MatChip,
    MatButton,
    MatIconButton,
    MatHeaderRow,
    MatRow,
    CurrencyPipe,
    MatHeaderRowDef,
    MatRowDef,
    FormsModule
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
    protected authService: AuthService
  ) {
  }

  private cargarCarrito(): void {
    this.pedidoService.carrito$.subscribe(c => this.carrito = c);
  }

  ngOnInit(): void {
    this.cargarCarrito();
  }

  async onCantidadChange(item: ItemPedido) {
    const cantidad = item.cantidad;
    if (cantidad < 1) {
      this.notificationService.show('La cantidad debe ser al menos 1.');
      return;
    }
    try {
      await this.pedidoService.updateItemQuantity(item.id, cantidad);
    } catch {
      this.notificationService.show('Error al actualizar la cantidad.');
    }
  }

  async eliminarItem(item: ItemPedido) {
    try {
      await this.pedidoService.removeItem(item.id);
    } catch {
      this.notificationService.show('Error al eliminar el item.');
    }
  }

  async vaciarCarrito() {
    try {
      await this.pedidoService.clearCarrito();
    } catch {
      this.notificationService.show('Error al vaciar el carrito.');
    }
  }

  protected readonly Entidad = Entidad;
  protected readonly Accion = Accion;
}

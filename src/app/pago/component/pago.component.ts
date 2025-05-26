import {Component, OnInit} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {CurrencyPipe, NgForOf} from '@angular/common';
import {Pedido} from '../../pedido/pedido.model';
import {PedidoService} from '../../pedido/service/pedido.service';
import {MetodoDePago} from '../pago.model';
import {PagoService} from '../service/pago.service';
import {NotificationService} from '../../notification/notification.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatButtonModule, CurrencyPipe, NgForOf],
})
export class PagoComponent implements OnInit {
  carrito: Pedido | null = null;
  metodoSeleccionado: MetodoDePago | null = null;

  metodosDePago: MetodoDePago[] = ['CREDITO', 'EFECTIVO', 'DEBITO', 'MERCADO_PAGO', 'CUENTA_DNI'];

  constructor(
    private pedidoService: PedidoService,
    private pagoService: PagoService,
    private notificationService: NotificationService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.pedidoService.carrito$.subscribe(c => this.carrito = c);
  }

  pagar() {
    if (!this.metodoSeleccionado) return;
    this.pagoService.create({metodoPago: this.metodoSeleccionado}).subscribe({
      next: async result => {
        await this.pedidoService.refreshCarrito();
        await this.router.navigate(['/']);
        this.notificationService.show("Pago registrado correctamente");
      },
      error: error => {
        console.log(error);
        this.notificationService.show("Error al pagar el pedido");
      }
    })
  }
}

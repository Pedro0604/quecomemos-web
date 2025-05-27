import {Component, OnInit} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {Pedido} from '../../pedido/pedido.model';
import {PedidoService} from '../../pedido/service/pedido.service';
import {MetodoDePago} from '../pago.model';
import {PagoService} from '../service/pago.service';
import {NotificationService} from '../../notification/notification.service';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatButtonModule, CurrencyPipe, NgForOf, FormsModule, MatInput, NgIf],
})
export class PagoComponent implements OnInit {
  carrito: Pedido | null = null;
  metodoSeleccionado: MetodoDePago | null = null;

  metodosDePago: MetodoDePago[] = ['CREDITO', 'DEBITO', 'MERCADO_PAGO', 'CUENTA_DNI'];

  datosPago: any = {}; // se completará según el metodo

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

  formularioValido(): boolean {
    if (!this.metodoSeleccionado) return false;

    if (this.metodoSeleccionado === 'CREDITO' || this.metodoSeleccionado === 'DEBITO') {
      return this.datosPago.titular?.trim() &&
        /^[0-9]{16}$/.test(this.datosPago.numeroTarjeta) &&
        /^[0-9]{3,4}$/.test(this.datosPago.codigo);
    }

    if (this.metodoSeleccionado === 'MERCADO_PAGO' || this.metodoSeleccionado === 'CUENTA_DNI') {
      return this.datosPago.titular?.trim();
    }

    return false;
  }
}

import {Component, OnInit} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {CurrencyPipe, NgForOf, NgIf, NgStyle} from '@angular/common';
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
  imports: [MatFormFieldModule, MatSelectModule, MatButtonModule, CurrencyPipe, NgForOf, FormsModule, MatInput, NgIf, NgStyle],
})
export class PagoComponent implements OnInit {
  carrito: Pedido | null = null;
  metodoSeleccionado: MetodoDePago | null = null;
  metodosDePago: MetodoDePago[] = ['CREDITO', 'DEBITO', 'MERCADO_PAGO', 'CUENTA_DNI'];
  datosPago: any = {};
  mostrarBurbuja = false;
  iconoVisible = false;


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

    this.mostrarBurbuja = true;

    // Mostrar el ícono de éxito 800ms después de empezar la animación
    setTimeout(() => {
      this.iconoVisible = true;
    }, 800);

    // Ejecutar el pago tras 1s
    setTimeout(() => {
      this.pagoService.create({metodoPago: this.metodoSeleccionado!}).subscribe({
        next: async (pago) => {
          await this.pedidoService.refreshCarrito();
          this.notificationService.show("Pago registrado correctamente");
          await this.router.navigate(['/confirmacion/' + pago.pedidoId]);
        },
        error: error => {
          console.error(error);
          this.notificationService.show("Error al pagar el pedido");
          this.mostrarBurbuja = false;
          this.iconoVisible = false;
        }
      });
    }, 1000);
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

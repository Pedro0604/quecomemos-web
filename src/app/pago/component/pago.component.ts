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
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {SpinnerComponent} from '../../components/spinner/spinner.component';
import {FormStateComponent} from '../../forms/components/form-state/form-state.component';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatButtonModule, CurrencyPipe, NgForOf, FormsModule, MatInput, NgIf, NgStyle, SpinnerComponent, FormStateComponent, RouterLink],
})
export class PagoComponent implements OnInit {
  carrito: Pedido | null = null;
  metodoSeleccionado: MetodoDePago | null = null;
  metodosDePago: MetodoDePago[] = ['CREDITO', 'DEBITO', 'MERCADO_PAGO', 'CUENTA_DNI'];
  datosPago: any = {};
  mostrarBurbuja = false;
  iconoVisible = false;
  cargando = false;
  error = false;

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

    this.cargando = true;
    this.iconoVisible = false;

    this.pagoService.create({metodoPago: this.metodoSeleccionado!}).subscribe({
      next: async (pago) => {
        await this.pedidoService.refreshCarrito();
        this.cargando = false;
        this.mostrarBurbuja = true;

        // Mostrar ícono luego de 800ms
        setTimeout(() => {
          this.iconoVisible = true;

          // Redirige después de 1.5s
          setTimeout(() => {
            this.router.navigate(['/confirmacion/' + pago.pedidoId]);
          }, 1500);
        }, 800);
      },
      error: (error) => {
        console.error(error);
        this.cargando = false;
        this.mostrarBurbuja = true;
        this.error = true;

        setTimeout(() => {
          this.iconoVisible = true;
        }, 800);
      }
    });
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

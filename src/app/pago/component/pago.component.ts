import {Component, OnInit} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {Pedido} from '../../pedido/pedido.model';
import {Router} from '@angular/router';
import {PedidoService} from '../../pedido/service/pedido.service';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatButtonModule, NgIf, CurrencyPipe, NgForOf],
})
export class PagoComponent implements OnInit {
  carrito: Pedido | null = null;
  metodoSeleccionado: string | null = null;

  metodosDePago = ['CREDITO', 'EFECTIVO', 'DEBITO', 'MERCADO_PAGO', 'CUENTA_DNI'];

  constructor(private pedidoService: PedidoService, private router: Router) {}

  ngOnInit() {
    this.pedidoService.carrito$.subscribe(c => this.carrito = c);
  }

  pagar() {
    if (!this.metodoSeleccionado) return;

    // Acá podrías llamar al backend para procesar el pago
    console.log('Pagando con método:', this.metodoSeleccionado);
    this.router.navigate(['/']);
  }
}

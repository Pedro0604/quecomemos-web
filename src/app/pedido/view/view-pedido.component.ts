import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CurrencyPipe} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {PedidoService} from '../service/pedido.service';
import {NotificationService} from '../../notification/notification.service';
import {Pedido} from '../pedido.model';
import {AuthService} from '../../auth/service/auth.service';
import {Entidad} from '../../permiso/entidad';
import {Accion} from '../../permiso/accion';

@Component({
  selector: 'app-view-pedido',
  imports: [
    MatButton,
    CurrencyPipe
  ],
  templateUrl: './view-pedido.component.html'
})
export class ViewPedidoComponent implements OnInit {
  pedido: Pedido | null = null;
  pedidoId: number = 0;
  protected readonly Entidad = Entidad;
  protected readonly Accion = Accion;

  constructor(
    private route: ActivatedRoute,
    private pedidoService: PedidoService,
    private notificationService: NotificationService,
    protected authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.pedidoId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.pedidoId) {
      this.notificationService.show("Se debe indicar un pedido.")
    }
    this.pedidoService.getPedidoById(this.pedidoId).subscribe({
      next: pedido => {
        this.pedido = pedido;
      },
      error: error => {
        this.notificationService.show("Hubo un error al cargar el pedido. Por favor, intentalo nuevamente.")
        console.log(error);
      }
    });
  }

  marcarComoEntregado(): void {
    this.pedidoService.marcarComoEntregado(this.pedidoId).subscribe({
      next: () => {
        if (!this.pedido) {
          this.notificationService.show("Pedido inexistente.");
          return;
        }
        this.pedido.entregado = true;
        this.notificationService.show("Pedido Entregado!");
      },
      error: (err) => {
        this.notificationService.show("Error al marcar el pedido como entregado. Por favor, intentalo nuevamente.");
        console.error(err);
      }
    });
  }
}


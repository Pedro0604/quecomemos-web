import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {PedidoService} from '../service/pedido.service';

@Component({
  selector: 'app-pedido',
  imports: [
    NgIf,
    MatButton,
    NgForOf,
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './pedido.component.html'
})
export class PedidoComponent implements OnInit {
  pedido: any;
  pedidoId!: number;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    this.pedidoId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarPedido();
  }

  cargarPedido(): void {
    this.pedidoService.getPedidoById(this.pedidoId);
  }

  marcarComoEntregado(): void {
    this.http.post(`/api/pedido/${this.pedidoId}/entregado`, {}).subscribe({
      next: () => {
        this.pedido.entregado = true;
        alert('Pedido marcado como entregado');
      },
      error: (err) => {
        console.error('Error al marcar como entregado:', err);
        alert('Ocurrió un error al marcar el pedido');
      }
    });
  }
}


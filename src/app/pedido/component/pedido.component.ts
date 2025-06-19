import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AuthService} from '../../auth/service/auth.service';
import {Accion} from '../../permiso/accion';
import {Pedido} from '../pedido.model';
import {Entidad, getEntidadLink} from '../../permiso/entidad';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {RouterLink} from '@angular/router';
import {MatTooltip} from '@angular/material/tooltip';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-pedido',
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    RouterLink,
    MatTooltip,
    MatButton
  ],
  templateUrl: './pedido.component.html'
})
export class PedidoComponent {
  @Input({required: true}) pedido!: Pedido;

  @Output() onDelete = new EventEmitter<number>();
  protected readonly Entidad = Entidad;
  protected readonly Accion = Accion;
  protected readonly getEntidadLink = getEntidadLink;

  constructor(protected authService: AuthService) {
  }
}

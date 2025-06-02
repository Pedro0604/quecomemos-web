import {booleanAttribute, Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Comida, tipoComidaToString} from '../comida.model';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {DialogEliminarComponent} from '../../components/dialog-eliminar/dialog-eliminar.component';
import {ComidaService} from '../service/comida.service';
import {EntityCardActionsComponent} from '../../components/entity-card-actions/entity-card-actions.component';

import {Entidad} from '../../permiso/entidad';
import {PermissionResult} from '../../permiso/permissionAware';
import {Accion} from '../../permiso/accion';
import {PedidoService} from '../../pedido/service/pedido.service';
import {MatIconButton} from '@angular/material/button';
import {AuthService} from '../../auth/service/auth.service';
import {MatTooltip} from '@angular/material/tooltip';
import {DefaultImageDirective} from '../../directives/default-image-directive/default-image.directive';
import {Pedido} from '../../pedido/pedido.model';

@Component({
  selector: 'app-comida',
  templateUrl: './comida.component.html',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatIcon,
    MatCardContent,
    MatCardTitle,
    MatCardSubtitle,
    EntityCardActionsComponent,
    MatIconButton,
    MatTooltip,
    DefaultImageDirective,
  ],
})

export class ComidaComponent implements OnInit {
  dialog = inject(MatDialog);
  @Input({required: true}) comida!: Comida;
  @Input({transform: booleanAttribute}) showButtons: boolean = true;
  @Input({required: true}) permisos!: Partial<Record<Accion, PermissionResult>>;
  @Output() onDelete = new EventEmitter<number>();

  carrito: Pedido | null = null;

  isInCarrito() {
    return this.carrito && this.carrito.items.some(i => i.item.id === this.comida.id);
  }

  constructor(
    private comidaService: ComidaService,
    protected authService: AuthService,
    protected pedidoService: PedidoService
  ) {
  }

  ngOnInit() {
    this.pedidoService.carrito$.subscribe(c => this.carrito = c);
  }

  openDialogEliminar(): void {
    this.dialog.open(DialogEliminarComponent<Comida, ComidaService>, {
      data: {
        entity: this.comida,
        service: this.comidaService,
        baseEntityName: 'la comida',
        deletingEntityName: this.comida.nombre,
      }
    }).afterClosed().subscribe((deleted) => {
      if (deleted) {
        this.onDelete.emit(this.comida.id);
      }
    });
  }

  protected readonly Entidad = Entidad;
  protected readonly tipoComidaToString = tipoComidaToString;
  protected readonly Accion = Accion;
}

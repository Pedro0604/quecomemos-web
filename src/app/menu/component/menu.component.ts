import {booleanAttribute, Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {MatCardAppearance, MatCardModule} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatDivider} from '@angular/material/divider';
import {Menu} from '../menu.model';
import {RouterLink} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {DialogEliminarComponent} from '../../components/dialog-eliminar/dialog-eliminar.component';
import {MenuService} from '../service/menu.service';
import {AuthService} from '../../auth/service/auth.service';
import {EntityCardActionsComponent} from '../../components/entity-card-actions/entity-card-actions.component';
import {Entidad} from '../../permiso/entidad';
import {Accion} from '../../permiso/accion';
import {PermissionResult} from '../../permiso/permissionAware';
import {MatIconButton} from '@angular/material/button';
import {PedidoService} from '../../pedido/service/pedido.service';
import {tipoComidaToString} from '../../comida/comida.model';
import {MatTooltip} from "@angular/material/tooltip";
import {DefaultImageDirective} from '../../directives/default-image-directive/default-image.directive';
import {Pedido} from '../../pedido/pedido.model';

@Component({
  selector: 'app-menu',
  imports: [MatCardModule, MatIcon, MatDivider, RouterLink, EntityCardActionsComponent, MatIconButton, MatTooltip, DefaultImageDirective],
  templateUrl: './menu.component.html',
  standalone: true,
})

export class MenuComponent implements OnInit {
  dialog = inject(MatDialog);
  @Input({required: true}) menu!: Menu;
  @Input({transform: booleanAttribute}) showButtons: boolean = true;
  @Input() appearance: MatCardAppearance = "outlined";
  @Input({transform: booleanAttribute}) straightLeftBorder: boolean = false;
  @Input({transform: booleanAttribute}) straightRightBorder: boolean = false;
  @Input({transform: booleanAttribute}) hasLink: boolean = false;
  @Input({required: true}) permisos!: Partial<Record<Accion, PermissionResult>>;
  @Input({required: true, transform: booleanAttribute}) showAniadirAlCarrito: boolean = false;

  @Output() onDelete = new EventEmitter<number>();

  carrito: Pedido | null = null;

  isInCarrito() {
    return this.carrito && this.carrito.items.some(i => i.item.id === this.menu.id);
  }

  constructor(
    private menuService: MenuService,
    protected authService: AuthService,
    protected pedidoService: PedidoService
  ) {
  }

  ngOnInit() {
    this.pedidoService.carrito$.subscribe(c => this.carrito = c);
  }


  openDialogEliminar(): void {
    this.dialog.open(DialogEliminarComponent<Menu, MenuService>, {
      data: {
        entity: this.menu,
        service: this.menuService,
        baseEntityName: 'el menú',
        deletingEntityName: this.menu.nombre,
      }
    }).afterClosed().subscribe((deleted) => {
      if (deleted) {
        this.onDelete.emit(this.menu.id);
      }
    });
  }

  protected readonly Accion = Accion;
  protected readonly Entidad = Entidad;
  protected readonly tipoComidaToString = tipoComidaToString;
}

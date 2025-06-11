import {booleanAttribute, Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MenuDiario, traduccionDiasSemana} from '../menu-diario.model';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MenuComponent} from '../../menu/component/menu.component';
import {DialogEliminarComponent} from '../../components/dialog-eliminar/dialog-eliminar.component';
import {MenuDiarioService} from '../service/menu-diario.service';
import {EntityCardActionsComponent} from '../../components/entity-card-actions/entity-card-actions.component';

import {Entidad} from '../../permiso/entidad';
import {Accion} from '../../permiso/accion';
import {PermissionResult} from '../../permiso/permissionAware';
import {MatButton} from '@angular/material/button';
import {AuthService} from '../../auth/service/auth.service';
import {MatTooltip} from '@angular/material/tooltip';
import {NotificationService} from '../../notification/notification.service';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-menu-diario',
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MenuComponent,
    EntityCardActionsComponent,
    MatButton,
    MatTooltip,
    MatIcon
  ],
  templateUrl: './menu-diario.component.html',
  standalone: true,
})
export class MenuDiarioComponent {
  dialog = inject(MatDialog);
  @Input({required: true}) menuDiario!: MenuDiario;
  @Input({transform: booleanAttribute}) showButtons: boolean = true;
  @Input({transform: booleanAttribute}) showDia: boolean = true;
  @Input({required: true}) permisos!: Partial<Record<Accion, PermissionResult>>;
  @Input({required: true, transform: booleanAttribute}) showAniadirAlCarrito: boolean = false;

  @Output() onDelete = new EventEmitter<number>();
  protected readonly traduccionDiasSemana = traduccionDiasSemana;

  constructor(private menuDiarioService: MenuDiarioService, protected authService: AuthService, private notificationService: NotificationService) {
  }

  openDialogEliminar(): void {
    this.dialog.open(DialogEliminarComponent<MenuDiario, MenuDiarioService>, {
      data: {
        entity: this.menuDiario,
        service: this.menuDiarioService,
        baseEntityName: 'el menú diario',
        deletingEntityName: `${traduccionDiasSemana(this.menuDiario.dia)}: ${this.menuDiario.menuVegetariano.data.nombre} - ${this.menuDiario.menuNoVegetariano.data.nombre}`,
      }
    }).afterClosed().subscribe((deleted) => {
      if (deleted) {
        this.onDelete.emit(this.menuDiario.id);
      }
    });
  }

  activar() {
    this.menuDiarioService.activarMenuDiario(this.menuDiario.id).subscribe({
      next: () => {
        window.location.reload();
      },
      error: (error) => {
        console.error('Error al activar el menú diario:', error);
        this.notificationService.show("Error al activar el menú diario");
      }
    });
  }

  protected readonly Entidad = Entidad;
  protected readonly Accion = Accion;
}

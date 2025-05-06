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

@Component({
  selector: 'app-menu-diario',
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MenuComponent,
    EntityCardActionsComponent
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

  @Output() onDelete = new EventEmitter<number>();
  protected readonly traduccionDiasSemana = traduccionDiasSemana;

  constructor(private menuDiarioService: MenuDiarioService) {
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

  protected readonly Entidad = Entidad;
}

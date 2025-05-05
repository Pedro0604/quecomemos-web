import {booleanAttribute, Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Comida} from '../comida.model';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {DialogEliminarComponent} from '../../components/dialog-eliminar/dialog-eliminar.component';
import {ComidaService} from '../service/comida.service';
import {DefaultImageDirective} from '../../directives/default-image-directive/default-image.directive';
import {EntityCardActionsComponent} from '../../components/entity-card-actions/entity-card-actions.component';

import {Entidad} from '../../permiso/entidad';
import {PermissionResult} from '../../permiso/permissionAware';
import {Accion} from '../../permiso/accion';

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
    DefaultImageDirective,
    EntityCardActionsComponent,
  ],
})

export class ComidaComponent {
  dialog = inject(MatDialog);
  @Input({required: true}) comida!: Comida;
  @Input({transform: booleanAttribute}) showButtons: boolean = true;
  @Input({required: true}) permisos!: Partial<Record<Accion, PermissionResult>>;
  @Output() onDelete = new EventEmitter<number>();

  constructor(private comidaService: ComidaService) {
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
}

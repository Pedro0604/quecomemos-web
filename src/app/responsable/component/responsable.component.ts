import {booleanAttribute, Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {PermissionResult} from '../../permiso/permissionAware';
import {AuthService} from '../../auth/service/auth.service';
import {DialogEliminarComponent} from '../../components/dialog-eliminar/dialog-eliminar.component';
import {Responsable} from '../responsable.model';
import {Accion} from '../../permiso/accion';
import {ResponsableService} from '../service/responsable.service';
import {EntityCardActionsComponent} from '../../components/entity-card-actions/entity-card-actions.component';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {DefaultImageDirective} from '../../directives/default-image-directive/default-image.directive';
import {Entidad} from '../../permiso/entidad';

@Component({
  selector: 'app-responsable',
  imports: [
    EntityCardActionsComponent,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    DefaultImageDirective
  ],
  templateUrl: './responsable.component.html',
  standalone: true,
})
export class ResponsableComponent {
  dialog = inject(MatDialog);
  @Input({required: true}) responsable!: Responsable;
  @Input({transform: booleanAttribute}) showButtons: boolean = true;
  @Input({required: true}) permisos!: Partial<Record<Accion, PermissionResult>>;

  @Output() onDelete = new EventEmitter<number>();

  constructor(private responsableService: ResponsableService, protected authService: AuthService) {
  }

  openDialogEliminar(): void {
    this.dialog.open(DialogEliminarComponent<Responsable, ResponsableService>, {
      data: {
        entity: this.responsable,
        service: this.responsableService,
        baseEntityName: 'el responsable',
        deletingEntityName: `${this.responsable.nombre} ${this.responsable.apellido}`,
      }
    }).afterClosed().subscribe((deleted) => {
      if (deleted) {
        this.onDelete.emit(this.responsable.id);
      }
    });
  }

  protected readonly Entidad = Entidad;
}

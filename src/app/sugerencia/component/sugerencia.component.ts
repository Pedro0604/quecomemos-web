import {booleanAttribute, Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Sugerencia, tipoSugerenciaToString} from '../sugerencia.model';
import {SugerenciaService} from '../service/sugerencia.service';
import {DialogEliminarComponent} from '../../components/dialog-eliminar/dialog-eliminar.component';
import {limitString} from '../../utils/utils';
import {EntityCardActionsComponent} from '../../components/entity-card-actions/entity-card-actions.component';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';

@Component({
  selector: 'app-sugerencia',
  imports: [
    EntityCardActionsComponent,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle
  ],
  templateUrl: './sugerencia.component.html',
  standalone: true,
})
export class SugerenciaComponent {
  dialog = inject(MatDialog);
  @Input({required: true}) sugerencia!: Sugerencia;
  @Input({transform: booleanAttribute}) showButtons: boolean = true;
  @Output() onDelete = new EventEmitter<number>();

  constructor(private sugerenciaService: SugerenciaService) {
  }

  openDialogEliminar(): void {
    this.dialog.open(DialogEliminarComponent<Sugerencia, SugerenciaService>, {
      data: {
        entity: this.sugerencia,
        service: this.sugerenciaService,
        baseEntityName: 'la sugerencia',
        deletingEntityName: limitString(this.sugerencia.descripcion, 15),
      }
    }).afterClosed().subscribe((deleted) => {
      if (deleted) {
        this.onDelete.emit(this.sugerencia.id);
      }
    });
  }

  protected readonly tipoSugerenciaToString = tipoSugerenciaToString;
}

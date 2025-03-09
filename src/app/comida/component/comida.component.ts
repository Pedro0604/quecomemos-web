import {booleanAttribute, Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Comida} from '../comida.model';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatAnchor, MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {DialogEliminarComponent} from '../../components/dialog-eliminar/dialog-eliminar.component';
import {ComidaService} from '../service/comida.service';
import {DefaultImageDirective} from '../../directives/default-image-directive/default-image.directive';

@Component({
  selector: 'app-comida',
  templateUrl: './comida.component.html',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatIcon,
    MatCardContent,
    MatCardActions,
    MatCardTitle,
    MatCardSubtitle,
    MatAnchor,
    MatButton,
    RouterLink,
    DefaultImageDirective,
  ],
})

export class ComidaComponent {
  dialog = inject(MatDialog);
  @Input({required: true}) comida!: Comida;
  @Input({transform: booleanAttribute}) showButtons: boolean = true;
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
}

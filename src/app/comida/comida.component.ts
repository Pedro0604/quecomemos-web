import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Comida} from './comida.model';
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
import {DialogEliminarComidaComponent} from "../dialog-eliminar-comida/dialog-eliminar-comida.component";

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
    RouterLink
  ],
  styleUrl: './comida.component.scss'
})

export class ComidaComponent {
  dialog = inject(MatDialog);
  @Input({required: true}) comida!: Comida;
  @Input() showButtons: boolean = true;
  @Output() onDelete = new EventEmitter<number>();

  constructor() {
  }

  openDialogEliminar(): void {
    const dialogRef = this.dialog.open(DialogEliminarComidaComponent, {
      data: {comida: this.comida},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onDelete.emit(this.comida.id);
      }
    });
  }
}

import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MenuDiario, traduccionDiasSemana} from '../menu-diario.model';
import {DialogEliminarMenuDiarioComponent} from '../dialog-eliminar/dialog-eliminar-menu-diario.component';
import {MatAnchor, MatButton} from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle
} from '@angular/material/card';
import {RouterLink} from '@angular/router';
import {MenuComponent} from '../../menu/component/menu.component';

@Component({
  selector: 'app-menu-diario',
  imports: [
    MatAnchor,
    MatButton,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    RouterLink,
    MenuComponent
  ],
  templateUrl: './menu-diario.component.html',
  standalone: true,
})
export class MenuDiarioComponent {
  dialog = inject(MatDialog);
  @Input({required: true}) menuDiario!: MenuDiario;
  @Input() showButtons: boolean = true;
  @Input() showDia: boolean = true;
  @Output() onDelete = new EventEmitter<number>();

  constructor() {
  }

  openDialogEliminar(): void {
    const dialogRef = this.dialog.open(DialogEliminarMenuDiarioComponent, {
      data: {menuDiario: this.menuDiario},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onDelete.emit(this.menuDiario.id);
      }
    });
  }

  protected readonly traduccionDiasSemana = traduccionDiasSemana;
}

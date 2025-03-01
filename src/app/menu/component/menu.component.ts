import {booleanAttribute, Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {MatCardAppearance, MatCardModule} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatDivider} from '@angular/material/divider';
import {MatAnchor, MatButton} from '@angular/material/button';
import {Menu} from '../menu.model';
import {RouterLink} from '@angular/router';
import {DialogEliminarMenuComponent} from '../dialog-eliminar/dialog-eliminar-menu.component';
import {MatDialog} from '@angular/material/dialog';
import {DefaultImageDirective} from '../../directives/default-image-directive/default-image.directive';

@Component({
  selector: 'app-menu',
  imports: [MatCardModule, MatIcon, MatDivider, MatButton, MatAnchor, RouterLink, DefaultImageDirective],
  templateUrl: './menu.component.html',
  standalone: true,
})

export class MenuComponent {
  dialog = inject(MatDialog);
  @Input({required: true}) menu!: Menu;
  @Input() showButtons: boolean = true;
  @Input() appearance: MatCardAppearance = "outlined";
  @Input({transform: booleanAttribute}) straightLeftBorder: boolean = false;
  @Input({transform: booleanAttribute}) straightRightBorder: boolean = false;
  @Output() onDelete = new EventEmitter<number>();

  constructor() {
  }

  openDialogEliminar(): void {
    const dialogRef = this.dialog.open(DialogEliminarMenuComponent, {
      data: {menu: this.menu},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onDelete.emit(this.menu.id);
      }
    });
  }
}

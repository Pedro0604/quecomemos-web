import {booleanAttribute, Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {MatCardAppearance, MatCardModule} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatDivider} from '@angular/material/divider';
import {MatAnchor, MatButton} from '@angular/material/button';
import {Menu} from '../menu.model';
import {RouterLink} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {DialogEliminarComponent} from '../../components/dialog-eliminar/dialog-eliminar.component';
import {MenuService} from '../service/menu.service';

@Component({
  selector: 'app-menu',
  imports: [MatCardModule, MatIcon, MatDivider, MatButton, MatAnchor, RouterLink],
  templateUrl: './menu.component.html',
  standalone: true,
})

export class MenuComponent {
  dialog = inject(MatDialog);
  @Input({required: true}) menu!: Menu;
  @Input({transform: booleanAttribute}) showButtons: boolean = true;
  @Input() appearance: MatCardAppearance = "outlined";
  @Input({transform: booleanAttribute}) straightLeftBorder: boolean = false;
  @Input({transform: booleanAttribute}) straightRightBorder: boolean = false;
  @Output() onDelete = new EventEmitter<number>();

  constructor(private menuService: MenuService) {
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
}

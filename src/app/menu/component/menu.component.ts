import {booleanAttribute, Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {MatCardAppearance, MatCardModule} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatDivider} from '@angular/material/divider';
import {Menu} from '../menu.model';
import {RouterLink} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {DialogEliminarComponent} from '../../components/dialog-eliminar/dialog-eliminar.component';
import {MenuService} from '../service/menu.service';
import {DefaultImageDirective} from '../../directives/default-image-directive/default-image.directive';
import {AuthService} from '../../auth/service/auth.service';
import {EntityCardActionsComponent} from '../../components/entity-card-actions/entity-card-actions.component';

@Component({
  selector: 'app-menu',
  imports: [MatCardModule, MatIcon, MatDivider, RouterLink, DefaultImageDirective, EntityCardActionsComponent],
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
  @Input({transform: booleanAttribute}) hasLink: boolean = false;

  @Output() onDelete = new EventEmitter<number>();

  protected puedeEditar;
  protected puedeEliminar;

  constructor(private menuService: MenuService, protected authService: AuthService) {
    this.puedeEditar = this.authService.hasPermission('editar_menu');
    this.puedeEliminar = this.authService.hasPermission('eliminar_menu');
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

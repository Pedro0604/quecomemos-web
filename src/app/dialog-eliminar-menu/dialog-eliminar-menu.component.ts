import {Component, inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef, MatDialogTitle
} from '@angular/material/dialog';
import {Menu} from '../menu/menu.model';
import {MatButton} from '@angular/material/button';
import {MenuService} from '../menu/menu.service';
import {NotificationService} from '../notification.service';

export type DialogData = {
  menu: Menu;
}

@Component({
  selector: 'app-dialog-eliminar-menu',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogTitle
  ],
  templateUrl: './dialog-eliminar-menu.component.html',
  standalone: true,
  styleUrl: './dialog-eliminar-menu.component.css'
})
export class DialogEliminarMenuComponent {
  readonly dialogRef = inject(MatDialogRef<DialogEliminarMenuComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  private isDeleting = false;

  constructor(private menuService: MenuService, private notificationService: NotificationService) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteMenu() {
    if (this.isDeleting) {
      return;
    }

    this.menuService.deleteMenu(this.data.menu.id).subscribe({
      next: () => {
        this.notificationService.show('El menú se eliminó correctamente.');
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error al eliminar el menú:', error);
        this.notificationService.show(
          'Ocurrió un error al intentar eliminar el menú. Por favor, intenta nuevamente más tarde.'
        );
        this.dialogRef.close(true);
      },
      complete: () => {
        this.isDeleting = false; // Resetea la bandera al terminar.
      },
    });
  }
}

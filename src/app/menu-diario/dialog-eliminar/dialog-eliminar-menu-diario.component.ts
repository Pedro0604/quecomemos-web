import {Component, inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {NotificationService} from '../../notification/notification.service';
import {MenuDiarioService} from '../service/menu-diario.service';
import {MenuDiario, traduccionDiasSemana} from '../menu-diario.model';
import {MatButton} from '@angular/material/button';

export type DialogData = {
  menuDiario: MenuDiario;
}

@Component({
  selector: 'app-dialog-eliminar-menu-diario',
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle
  ],
  templateUrl: './dialog-eliminar-menu-diario.component.html',
  standalone: true,
  styleUrl: './dialog-eliminar-menu-diario.component.css'
})
export class DialogEliminarMenuDiarioComponent {
  readonly dialogRef = inject(MatDialogRef<DialogEliminarMenuDiarioComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  private isDeleting = false;

  constructor(private menuDiarioService: MenuDiarioService, private notificationService: NotificationService) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteMenuDiario() {
    if (this.isDeleting) {
      return;
    }

    this.menuDiarioService.deleteMenuDiario(this.data.menuDiario.id).subscribe({
      next: () => {
        this.notificationService.show('El menú diario se eliminó correctamente.');
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error al eliminar el menú diario:', error);
        this.notificationService.show(
          'Ocurrió un error al intentar eliminar el menú diario. Por favor, intenta nuevamente más tarde.'
        );
        this.dialogRef.close(true);
      },
      complete: () => {
        this.isDeleting = false;
      },
    });
  }

  protected readonly traduccionDiasSemana = traduccionDiasSemana;
}

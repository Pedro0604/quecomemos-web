import {Component, inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {ComidaService} from '../service/comida.service';
import {NotificationService} from '../../notification/notification.service';
import {Comida} from '../comida.model';
import {MatButton} from '@angular/material/button';

export type DialogData = {
  comida: Comida;
}

@Component({
  selector: 'app-dialog-eliminar-comida',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton
  ],
  templateUrl: './dialog-eliminar-comida.component.html',
  standalone: true,
  styleUrl: './dialog-eliminar-comida.component.css'
})

export class DialogEliminarComidaComponent {
  readonly dialogRef = inject(MatDialogRef<DialogEliminarComidaComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  private isDeleting = false;

  constructor(private comidaService: ComidaService, private notificationService: NotificationService) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteComida() {
    if (this.isDeleting) {
      return;
    }

    this.comidaService.deleteComida(this.data.comida.id).subscribe({
      next: () => {
        this.notificationService.show('La comida se eliminó correctamente.');
        this.dialogRef.close(true);
      },
      error: (error: any) => {
        console.error('Error al eliminar la comida:', error);
        this.notificationService.show(
          'Ocurrió un error al intentar eliminar la comida. Por favor, intenta nuevamente más tarde.'
        );
        this.dialogRef.close(false);
      },
      complete: () => {
        this.isDeleting = false; // Resetea la bandera al terminar.
      },
    });
  }
}

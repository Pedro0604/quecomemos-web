import {Component, inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { NotificationService } from '../../notification/notification.service';
import { MatButton } from '@angular/material/button';
import {Deletable} from '../../utils/Deletable';
import {SpinnerComponent} from '../spinner/spinner.component';
import {MatTooltip} from '@angular/material/tooltip';

export interface DeleteDialogData<T, S> {
  entity: T;
  service: S;
  baseEntityName: string;
  deletingEntityName: string;
}

@Component({
  selector: 'app-dialog-eliminar',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton, SpinnerComponent, MatTooltip],
  templateUrl: './dialog-eliminar.component.html',
  standalone: true,
})
export class DialogEliminarComponent<T extends { id: number }, S extends Deletable> {
  readonly dialogRef = inject(MatDialogRef<DialogEliminarComponent<T, S>>);
  readonly data = inject<DeleteDialogData<T, S>>(MAT_DIALOG_DATA);
  protected isDeleting = false;

  constructor(private notificationService: NotificationService) {}

  onNoClick(): void {
    if (this.isDeleting) {
      return;
    }

    this.dialogRef.close();
  }

  deleteEntity() {
    if (this.isDeleting) {
      return;
    }

    this.isDeleting = true;
    this.data.service.delete(this.data.entity.id).subscribe({
      next: () => {
        this.notificationService.show(`Eliminación exitosa de ${this.data.baseEntityName} '${this.data.deletingEntityName}'.`);
        this.dialogRef.close(true);
      },
      error: (error: any) => {
        console.error(`Error al eliminar ${this.data.baseEntityName} '${this.data.deletingEntityName}':`, error);
        this.notificationService.show(
          `Ocurrió un error al intentar eliminar ${this.data.baseEntityName} '${this.data.deletingEntityName}'. Por favor, intenta nuevamente.`
        );
        this.dialogRef.close(false);
      },
      complete: () => {
        this.isDeleting = false;
      },
    });
  }
}

import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {
  }

  show(message: string, duration: number = 3000, className: string = '') {
    this.snackBar.open(message, 'Cerrar', {
      duration,
      panelClass: [className || 'snack-bar'],
    });
  }
}

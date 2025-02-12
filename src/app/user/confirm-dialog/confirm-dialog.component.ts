import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogTitle,
  MatDialogActions
} from '@angular/material/dialog';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField} from '@angular/material/form-field';
import {MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {MatError} from '@angular/material/form-field';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  standalone: true,
  imports: [
    MatDialogContent,
    MatFormField,
    MatInput,
    MatDialogTitle,
    ReactiveFormsModule,
    MatDialogActions,
    MatButton,
    NgIf,
    MatError,
    MatLabel
  ],
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  confirm(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value.password); // Devuelve la contraseña
    }
  }

  cancel(): void {
    this.dialogRef.close(null); // Cancela la acción
  }
}

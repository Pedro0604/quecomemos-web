import {Component, inject} from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {InputComponent} from '../../forms/components/fields/input/input.component';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './dialog-confirm-with-password.component.html',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    ReactiveFormsModule,
    MatDialogActions,
    MatButton,
    InputComponent
  ]
})
export class DialogConfirmWithPassword {
  readonly dialogRef = inject(MatDialogRef<DialogConfirmWithPassword>);
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      password: ['']
    });
  }

  confirm(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value.password);
    }
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}

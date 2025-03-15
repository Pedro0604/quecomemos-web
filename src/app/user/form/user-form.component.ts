import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ClientDTO, User} from '../user.model';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../../notification/notification.service';
import {MatDialog} from '@angular/material/dialog';
import {FormService, onlyLettersValidator, urlValidator} from '../../forms/service/form.service';
import {SubmitButtonComponent} from '../../forms/components/submit-button/submit-button.component';
import {FormComponent} from '../../forms/components/form/form.component';
import {TitleComponent} from '../../components/title/title.component';
import {InputComponent} from '../../forms/components/fields/input/input.component';
import {FormStateComponent} from '../../forms/components/form-state/form-state.component';
import {BaseEntityForm} from '../../forms/BaseEntityForm';
import {ClienteService} from '../service/cliente.service';
import {DialogConfirmWithPassword} from '../../components/dialog-confirmar/dialog-confirm-with-password.component';
import {firstValueFrom} from 'rxjs';
import {AuthService} from '../../auth/service/auth.service';
import {HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-user-form',
  imports: [
    ReactiveFormsModule,
    SubmitButtonComponent,
    FormComponent,
    TitleComponent,
    InputComponent,
    FormStateComponent,
  ],
  templateUrl: './user-form.component.html',
  standalone: true
})
export class UserFormComponent extends BaseEntityForm<User, ClientDTO, void> implements OnInit {
  user: User | null = null;

  form: FormGroup

  protected override redirectUrlOnCreation: string = '/carta';

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private authService: AuthService,
    router: Router,
    notificationService: NotificationService,
    formService: FormService,
    service: ClienteService,
    route: ActivatedRoute,
  ) {
    super(router, notificationService, formService, service, route, 'cliente', false, new HttpHeaders({'X-Skip-Auth-Redirect': 'true'}));
    this.form = this.fb.group({
      nombre: ['', [onlyLettersValidator]],
      apellido: ['', [onlyLettersValidator]],
      dni: [''],
      email: [''],
      urlImagen: ['', [urlValidator]],
      clave: ['']
    });
  }

  protected override extraOnInit(): void {
    if (!this.entity) {
      this.error = true;
    }
  }

  mapToDTO(formValue: any): ClientDTO {
    formValue.dni = this.form.get('dni')?.value;
    return formValue as ClientDTO;
  }

  protected override async beforeSavingEntity(): Promise<boolean> {
    const dialogRef = this.dialog.open(DialogConfirmWithPassword, {
      width: '400px',
      disableClose: true
    });

    const password = await firstValueFrom(dialogRef.afterClosed());

    if (password) {
      this.form.get('clave')?.setValue(password);
      return true;
    }
    return false;
  }

  protected override onSubmitError(error: any): boolean {
    if (error.status == 403) {
      this.notificationService.show('Contraseña incorrecta. Intentá nuevamente.')
      return true
    }
    return false;
  }

  protected override onSubmitSuccess(usuarioCreado: User): void {
    this.authService.updateUserInfo(usuarioCreado);
  }
}

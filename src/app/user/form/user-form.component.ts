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
import {ClienteService} from '../service/cliente.service';
import {AuthService} from '../../auth/service/auth.service';
import {Entidad} from '../../permiso/entidad';
import {BaseEntityFormWithPasswordConfirmation} from '../../forms/BaseEntityFormWithPasswordConfirmation';

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
export class UserFormComponent extends BaseEntityFormWithPasswordConfirmation<User, ClientDTO, void> implements OnInit {
  user: User | null = null;

  form: FormGroup

  protected override redirectUrlOnCreation: string = '/';

  constructor(
    private fb: FormBuilder,
    dialog: MatDialog,
    authService: AuthService,
    router: Router,
    notificationService: NotificationService,
    formService: FormService,
    service: ClienteService,
    route: ActivatedRoute,
  ) {
    super(router, notificationService, formService, service, route, Entidad.CLIENTE, dialog, authService);
    this.form = this.fb.group({
      nombre: ['', [onlyLettersValidator]],
      apellido: ['', [onlyLettersValidator]],
      dni: [''],
      email: [''],
      urlImagen: ['', [urlValidator]]
    });
  }

  mapToDTO(formValue: any): ClientDTO {
    formValue.dni = this.form.get('dni')?.value;
    return formValue as ClientDTO;
  }

  protected override extraOnInit(): void {
    if (!this.entity) {
      this.error = true;
    }
  }

  protected override onSubmitSuccess(usuarioCreado: User): void {
    this.authService.refreshUserToken();
  }
}

import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../../notification/notification.service';
import {
  confirmationMatchesPasswordValidator,
  FormService,
  inArrayValidator,
  onlyLettersValidator,
  urlValidator
} from '../../forms/service/form.service';
import {Entidad, getEntidadLink} from '../../permiso/entidad';
import {Responsable, ResponsableDTO, turnos, turnoToString} from '../responsable.model';
import {ResponsableService} from '../service/responsable.service';
import {FormComponent} from '../../forms/components/form/form.component';
import {FormStateComponent} from '../../forms/components/form-state/form-state.component';
import {SelectComponent} from '../../forms/components/fields/select/select.component';
import {SubmitButtonComponent} from '../../forms/components/submit-button/submit-button.component';
import {TitleComponent} from '../../components/title/title.component';
import {InputComponent} from '../../forms/components/fields/input/input.component';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../../auth/service/auth.service';
import {BaseEntityFormWithPasswordConfirmation} from '../../forms/BaseEntityFormWithPasswordConfirmation';

@Component({
  selector: 'app-responsable-form',
  imports: [
    FormComponent,
    FormStateComponent,
    SelectComponent,
    SubmitButtonComponent,
    TitleComponent,
    InputComponent
  ],
  templateUrl: './responsable-form.component.html',
  standalone: true,
})
export class ResponsableFormComponent extends BaseEntityFormWithPasswordConfirmation<Responsable, ResponsableDTO, void> implements OnInit {
  turnosOptions = turnos.map(turno => ({
    value: turno,
    name: turnoToString(turno)
  }));
  protected override redirectUrlOnCreation: string = getEntidadLink(Entidad.RESPONSABLE_DE_TURNO);
  protected override form: FormGroup;

  constructor(
    router: Router,
    notificationService: NotificationService,
    formService: FormService,
    service: ResponsableService,
    route: ActivatedRoute,
    dialog: MatDialog,
    authService: AuthService,
    private fb: FormBuilder,
  ) {
    super(router, notificationService, formService, service, route, Entidad.RESPONSABLE_DE_TURNO, dialog, authService);

    this.form = this.fb.group({
      dni: [''],
      nombre: ['', [onlyLettersValidator]],
      apellido: ['', [onlyLettersValidator]],
      urlImagen: ['', [urlValidator]],
      turno: ['', [inArrayValidator(turnos)]],
      clave: [''],
      confirmClave: [''],
    }, {
      validators: confirmationMatchesPasswordValidator
    });
  }

  protected override extraOnInit(): void {
    if (!!this.entity) {
      this.redirectUrlOnCreation = '/';
    }
  }

  override mapToDTO(formValue: any): ResponsableDTO {
    return formValue as ResponsableDTO;
  }

  protected override onSubmitSuccess(responsableCreado: Responsable): void {
    this.authService.refreshUserToken();
  }
}

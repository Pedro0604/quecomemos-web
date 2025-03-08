import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Comida, ComidaDTO, TipoComida, tipoComidaToString} from '../comida.model';
import {ComidaService} from '../service/comida.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../../notification/notification.service';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatCheckbox} from '@angular/material/checkbox';
import {InputComponent} from '../../components/input/input.component';
import {SelectComponent} from '../../components/select/select.component';
import {FormService, inArrayValidator, urlValidator} from '../../form-service/form.service';
import {SubmitButtonComponent} from '../../components/submit-button/submit-button.component';
import {TitleComponent} from '../../components/title/title.component';
import {
  FocusFirstInvalidFieldDirective
} from '../../directives/focus-first-invalid-field.directive/focus-first-invalid-field.directive';
import {FormStateComponent} from '../../components/form-state/form-state.component';
import {BaseEntityForm} from '../../utils/BaseEntityForm';
import {FormComponent} from '../../components/form/form.component';

@Component({
  selector: 'app-comida-form',
  imports: [
    MatCard,
    MatCardContent,
    ReactiveFormsModule,
    MatCheckbox,
    InputComponent,
    SelectComponent,
    SubmitButtonComponent,
    TitleComponent,
    FocusFirstInvalidFieldDirective,
    FormStateComponent,
    FormComponent,
  ],
  templateUrl: './comida-form.component.html',
  standalone: true,
  styleUrl: './comida-form.component.css',
})

export class ComidaFormComponent extends BaseEntityForm<Comida, ComidaDTO, void> implements OnInit {
  redirectUrlOnCreation: string = '/comidas';
  form: FormGroup

  tiposDeComida: TipoComida[] = ['OTRO', 'POSTRE', 'ENTRADA', 'BEBIDA', 'PLATO_PRINCIPAL'];
  tiposDeComidaOptions = this.tiposDeComida.map(tipoComida => ({
    value: tipoComida,
    name: tipoComidaToString(tipoComida)
  }));

  constructor(
    private fb: FormBuilder,
    protected override router: Router,
    protected override notificationService: NotificationService,
    protected override formService: FormService,
    protected override service: ComidaService,
    protected override route: ActivatedRoute
  ) {
    super(router, notificationService, formService, service, route);

    this.form = this.fb.group({
      nombre: [''],
      precio: ['', [Validators.min(0)]],
      vegetariana: [false],
      tipoComida: ['', [inArrayValidator(this.tiposDeComida)]],
      urlImagen: ['', [urlValidator]]
    });
  }

  protected extraOnInit(): void {
    if (!this.isEdition()) {
      const tipoComidaInicial = this.route.snapshot.queryParams['tipo-comida'] as TipoComida;
      this.form.get('tipoComida')?.setValue(tipoComidaInicial);

      const vegetarianaInicial = this.route.snapshot.queryParams['vegetariana'] as boolean;
      this.form.get('vegetariana')?.setValue(vegetarianaInicial);
    }
  }

  override mapToDTO(formValue: any): ComidaDTO {
    return formValue as ComidaDTO;
  }
}

import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Comida, ComidaDTO, TipoComida, tipoComidaToString} from '../comida.model';
import {ComidaService} from '../service/comida.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../../notification/notification.service';
import {MatCheckbox} from '@angular/material/checkbox';
import {InputComponent} from '../../forms/components/fields/input/input.component';
import {SelectComponent} from '../../forms/components/fields/select/select.component';
import {FormService, inArrayValidator, urlValidator} from '../../forms/service/form.service';
import {SubmitButtonComponent} from '../../forms/components/submit-button/submit-button.component';
import {TitleComponent} from '../../components/title/title.component';
import {BaseEntityForm} from '../../forms/BaseEntityForm';
import {FormComponent} from '../../forms/components/form/form.component';
import {FormStateComponent} from '../../forms/components/form-state/form-state.component';

@Component({
  selector: 'app-comida-form',
  imports: [
    ReactiveFormsModule,
    MatCheckbox,
    InputComponent,
    SelectComponent,
    SubmitButtonComponent,
    TitleComponent,
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
    super(router, notificationService, formService, service, route, 'comida', true);

    this.form = this.fb.group({
      nombre: [''],
      precio: ['', [Validators.min(0)]],
      vegetariana: [false],
      tipoComida: ['', [inArrayValidator(this.tiposDeComida)]],
      urlImagen: ['', [urlValidator]]
    });
  }

  protected extraOnInit(): void {
    if (!this.entity) {
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

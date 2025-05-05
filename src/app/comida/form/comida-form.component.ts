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
import {Entidad, getEntidadLink} from '../../permiso/entidad';

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
  tiposDeComida: TipoComida[] = ['OTRO', 'POSTRE', 'ENTRADA', 'BEBIDA', 'PLATO_PRINCIPAL'];
  tiposDeComidaOptions = this.tiposDeComida.map(tipoComida => ({
    value: tipoComida,
    name: tipoComidaToString(tipoComida)
  }));
  protected override redirectUrlOnCreation: string = getEntidadLink(Entidad.COMIDA);
  protected override form: FormGroup

  constructor(
    router: Router,
    notificationService: NotificationService,
    formService: FormService,
    service: ComidaService,
    route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    super(router, notificationService, formService, service, route, Entidad.COMIDA);

    this.form = this.fb.group({
      nombre: [''],
      precio: ['', [Validators.min(0)]],
      vegetariana: [false],
      tipoComida: ['', [inArrayValidator(this.tiposDeComida)]],
      urlImagen: ['', [urlValidator]]
    });
  }

  override mapToDTO(formValue: any): ComidaDTO {
    return formValue as ComidaDTO;
  }

  protected override extraOnInit(): void {
    if (!this.entity) {
      const tipoComidaInicial = this.route.snapshot.queryParams['tipo-comida'] as TipoComida;
      this.form.get('tipoComida')?.setValue(tipoComidaInicial);

      const vegetarianaInicial = this.route.snapshot.queryParams['vegetariana'] as boolean;
      this.form.get('vegetariana')?.setValue(vegetarianaInicial);
    } else {
      // EDICIÓN: deshabilitar el checkbox
      this.form.get('vegetariana')?.disable();
    }
  }
}

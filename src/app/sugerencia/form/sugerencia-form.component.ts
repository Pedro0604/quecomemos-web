import {Component, OnInit} from '@angular/core';
import {BaseEntityForm} from '../../forms/BaseEntityForm';
import {Sugerencia, SugerenciaDTO, tiposSugerencias, tipoSugerenciaToString} from '../sugerencia.model';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../../notification/notification.service';
import {FormService, inArrayValidator} from '../../forms/service/form.service';
import {SugerenciaService} from '../service/sugerencia.service';
import {FormComponent} from '../../forms/components/form/form.component';
import {FormStateComponent} from '../../forms/components/form-state/form-state.component';
import {SelectComponent} from '../../forms/components/fields/select/select.component';
import {SubmitButtonComponent} from '../../forms/components/submit-button/submit-button.component';
import {TitleComponent} from '../../components/title/title.component';
import {TextAreaComponent} from '../../forms/components/fields/text-area/text-area.component';

@Component({
  selector: 'app-sugerencia-form',
  imports: [
    FormComponent,
    FormStateComponent,
    FormsModule,
    ReactiveFormsModule,
    SelectComponent,
    SubmitButtonComponent,
    TitleComponent,
    TextAreaComponent
  ],
  templateUrl: './sugerencia-form.component.html',
  standalone: true,
})
export class SugerenciaFormComponent extends BaseEntityForm<Sugerencia, SugerenciaDTO, void> implements OnInit {
  tiposSugerenciasOptions = tiposSugerencias.map(tipoSugerencia => ({
    value: tipoSugerencia,
    name: tipoSugerenciaToString(tipoSugerencia)
  }));
  // TODO - REDIRIGIR A BUZÓN
  protected override redirectUrlOnCreation: string = '/sugerencia';
  protected override form: FormGroup;

  constructor(
    router: Router,
    notificationService: NotificationService,
    formService: FormService,
    service: SugerenciaService,
    route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    super(router, notificationService, formService, service, route, 'sugerencia', true);

    this.form = this.fb.group({
      descripcion: [''],
      tipo: ['', [inArrayValidator(tiposSugerencias)]]
    });
  }

  override mapToDTO(formValue: any): SugerenciaDTO {
    return formValue as SugerenciaDTO;
  }
}

import {Component, OnInit} from '@angular/core';
import {diasSemanaArray, MenuDiario, MenuDiarioDTO, traduccionDiasSemana} from '../menu-diario.model';
import {Menu} from '../../menu/menu.model';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MenuService} from '../../menu/service/menu.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {NotificationService} from '../../notification/notification.service';
import {MenuDiarioService} from '../service/menu-diario.service';
import {firstValueFrom} from 'rxjs';
import {MatAnchor} from '@angular/material/button';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {SelectComponent} from '../../components/select/select.component';
import {AutocompleteComponent} from '../../components/autocomplete/autocomplete.component';
import {FormService, inArrayValidator} from "../../form-service/form.service";
import {SubmitButtonComponent} from '../../components/submit-button/submit-button.component';
import {TitleComponent} from '../../components/title/title.component';
import {
  FocusFirstInvalidFieldDirective
} from '../../directives/focus-first-invalid-field.directive/focus-first-invalid-field.directive';
import {FormStateComponent} from '../../components/form-state/form-state.component';
import {BaseEntityForm} from '../../utils/BaseEntityForm';
import {MatError} from '@angular/material/input';
import {FormComponent} from '../../components/form/form.component';

type CampoMenu = {
  nombre: string,
  label: string,
  menus: Menu[],
  vegetariano: boolean
}

@Component({
  selector: 'app-menu-diario-form',
  imports: [
    MatAnchor,
    MatCard,
    MatCardContent,
    MatError,
    MatIcon,
    ReactiveFormsModule,
    RouterLink,
    SelectComponent,
    AutocompleteComponent,
    SubmitButtonComponent,
    TitleComponent,
    FocusFirstInvalidFieldDirective,
    FormStateComponent,
    FormComponent,
  ],
  templateUrl: './menu-diario-form.component.html',
  standalone: true,
})

// TODO - Agregar a Menu, MenuDiario y Comida una forma general de saber si son femenino o masculino y su nombre de entidad (aplicar a todos los lugares generales (list, form, eliminacion, ...))
// TODO - QUIZAS TAMBIEN UNA DISPLAYFN GENERAL PARA MOSTRAR EL NOMBRE DE UNA ENTIDAD EN PARTICULAR
export class MenuDiarioFormComponent extends BaseEntityForm<MenuDiario, MenuDiarioDTO, Menu> implements OnInit {
  form: FormGroup
  redirectUrlOnCreation: string = '/menu-diario';

  diasDeSemanaOptions = diasSemanaArray.map(diaSemana => ({
    value: diaSemana,
    name: traduccionDiasSemana(diaSemana)
  }));

  camposDeMenus: CampoMenu[] = [
    {
      nombre: 'menuVegetariano',
      label: 'Menú vegetariano',
      menus: [],
      vegetariano: true
    },
    {
      nombre: 'menuNoVegetariano',
      label: 'Menú no vegetariano',
      menus: [],
      vegetariano: false
    },
  ];

  constructor(
    private fb: FormBuilder,
    private menuService: MenuService,
    protected override router: Router,
    protected override notificationService: NotificationService,
    protected override formService: FormService,
    protected override service: MenuDiarioService,
    protected override route: ActivatedRoute
  ) {
    super(router, notificationService, formService, service, route);

    this.form = this.fb.group({
      dia: ['', [inArrayValidator(diasSemanaArray)]],
      menuVegetariano: [{value: '', disabled: true}],
      menuNoVegetariano: [{value: '', disabled: true}],
    });
  }

  protected override loadRelatedData(): Promise<Menu[]> {
    return firstValueFrom(this.menuService.getAll());
  }

  protected extraOnInit(): void {
      this.camposDeMenus.forEach(campo => {
        campo.menus = this.relatedData.filter(menu => menu.vegetariano == campo.vegetariano);
      });
  }

  override mapToDTO(formValue: any): MenuDiarioDTO {
    return {
      dia: formValue.dia,
      menuVegetarianoId: formValue.menuVegetariano.id,
      menuNoVegetarianoId: formValue.menuNoVegetariano.id,
    }
  }

  displayFn(menu: Menu): string {
    return menu && menu.nombre ? menu.nombre : '';
  }
}

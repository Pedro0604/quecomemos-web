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
import {MatIcon} from '@angular/material/icon';
import {SelectComponent} from '../../forms/components/fields/select/select.component';
import {AutocompleteComponent} from '../../forms/components/fields/autocomplete/autocomplete.component';
import {FormService, inArrayValidator} from "../../forms/service/form.service";
import {SubmitButtonComponent} from '../../forms/components/submit-button/submit-button.component';
import {TitleComponent} from '../../components/title/title.component';
import {BaseEntityForm} from '../../forms/BaseEntityForm';
import {MatError} from '@angular/material/input';
import {FormStateComponent} from '../../forms/components/form-state/form-state.component';
import {FormComponent} from '../../forms/components/form/form.component';

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
    MatError,
    MatIcon,
    ReactiveFormsModule,
    RouterLink,
    SelectComponent,
    AutocompleteComponent,
    SubmitButtonComponent,
    TitleComponent,
    FormStateComponent,
    FormComponent,
  ],
  templateUrl: './menu-diario-form.component.html',
  standalone: true,
})

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
    super(router, notificationService, formService, service, route, 'menú diario', false);

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

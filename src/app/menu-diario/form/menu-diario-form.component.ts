import {Component, OnInit} from '@angular/core';
import {diasSemanaArray, MenuDiario, MenuDiarioDTO, traduccionDiasSemana} from '../menu-diario.model';
import {Menu} from '../../menu/menu.model';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MenuService} from '../../menu/service/menu.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {LayoutService} from '../../layout/layout.service';
import {NotificationService} from '../../notification/notification.service';
import {MenuDiarioService} from '../service/menu-diario.service';
import {firstValueFrom} from 'rxjs';
import {MatAnchor} from '@angular/material/button';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatError} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {SelectComponent} from '../../components/select/select.component';
import {SpinnerComponent} from '../../components/spinner/spinner.component';
import {AutocompleteComponent} from '../../components/autocomplete/autocomplete.component';
import {FormService, inArrayValidator} from "../../form-service/form.service";
import {FormStateHandler} from '../../utils/FormStateHandler';
import {SubmitButtonComponent} from '../../components/submit-button/submit-button.component';
import {TitleExtraComponent} from '../../components/title-extra/title-extra.component';
import {
  FocusFirstInvalidFieldDirective
} from '../../directives/focus-first-invalid-field.directive/focus-first-invalid-field.directive';

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
    SpinnerComponent,
    AutocompleteComponent,
    SubmitButtonComponent,
    TitleExtraComponent,
    FocusFirstInvalidFieldDirective,
  ],
  templateUrl: './menu-diario-form.component.html',
  standalone: true,
})
export class MenuDiarioFormComponent extends FormStateHandler implements OnInit {
  menuDiario: MenuDiario | null = null;
  menus: Menu[] = [];

  form: FormGroup

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
    private menuDiarioService: MenuDiarioService,
    private route: ActivatedRoute,
    private router: Router,
    private layoutService: LayoutService,
    private notificationService: NotificationService,
    private menuService: MenuService,
    protected formService: FormService,
    private fb: FormBuilder
  ) {
    super();
    this.form = this.fb.group({
      dia: ['', [inArrayValidator(diasSemanaArray)]],
      menuVegetariano: [{value: '', disabled: true}],
      menuNoVegetariano: [{value: '', disabled: true}],
    });
  }

  private async cargarMenus(): Promise<void> {
    try {
      this.loading = true;
      this.menus = await firstValueFrom(this.menuService.getMenus());
      this.menus ??= [];
    } catch (error) {
      console.error('Error al obtener los menús');
      console.error(error);
      this.error = true;
    } finally {
      this.loading = false;
    }
  }

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.menuDiarioService.getMenuDiarioById(id).subscribe({
        next: (data) => {
          this.menuDiario = data;
          this.form.get('dia')?.setValue(this.menuDiario.dia)
          this.form.get('menuVegetariano')?.setValue(this.menuDiario.menuVegetariano)
          this.form.get('menuNoVegetariano')?.setValue(this.menuDiario.menuNoVegetariano)
        },
        error: error => {
          this.error = true;
          console.error('Error al obtener el menú diario', error);
          this.notificationService.show('Ha ocurrido un error. Por favor, intente nuevamente más tarde');
        },
      });
      this.layoutService.setTitle('Modificar Menú Diario');
    } else {
      this.layoutService.setTitle('Crear Menú Diario');
    }

    await this.cargarMenus();

    this.camposDeMenus.forEach(campo => {
      campo.menus = this.menus.filter(menu => menu.vegetariano == campo.vegetariano);
    });
  }

  displayFn(menu: Menu): string {
    return menu && menu.nombre ? menu.nombre : '';
  }

  private saveMenuDiario(dto: MenuDiarioDTO): void {
    const getPostOptions = (isModification: boolean) => {
      return {
        complete: () => {
          this.notificationService.show(isModification ? 'Menú diario modificado exitosamente' : 'Menú diario creado exitosamente');
          this.router.navigate(['/menu-diario']);
        },
        error: (error: any) => {
          const message = isModification ? 'Error al modificar el menú diario' : 'Error al crear el menú diario'
          this.notificationService.show(message);
          console.error(message);
          console.error(error);
        }
      };
    }

    if (this.menuDiario) {
      this.menuDiarioService.updateMenuDiario(this.menuDiario.id, dto).subscribe(getPostOptions(true));
    } else {
      this.menuDiarioService.createMenuDiario(dto).subscribe(getPostOptions(false));
    }
  }

  onSubmit(): void {
    if (this.form.valid && this.form.dirty) {
      const menuDiarioData = this.form.value;
      const menuDiarioDTO: MenuDiarioDTO = {
        dia: menuDiarioData.dia,
        menuVegetarianoId: menuDiarioData.menuVegetariano.id,
        menuNoVegetarianoId: menuDiarioData.menuNoVegetariano.id,
      }
      this.saveMenuDiario(menuDiarioDTO);
    } else {
      this.formService.validateAllFields(this.form);
    }
  }

  protected readonly history = history;
}

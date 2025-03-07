import {Component, OnInit, signal} from '@angular/core';
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
import {MatError} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {SelectComponent} from '../../components/select/select.component';
import {SpinnerComponent} from '../../components/spinner/spinner.component';
import {AutocompleteComponent} from '../../components/autocomplete/autocomplete.component';
import {FormService, inArrayValidator} from "../../form-service/form.service";
import {FormStateHandler} from '../../utils/FormStateHandler';
import {SubmitButtonComponent} from '../../components/submit-button/submit-button.component';
import {TitleComponent} from '../../components/title/title.component';
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
    TitleComponent,
    FocusFirstInvalidFieldDirective,
  ],
  templateUrl: './menu-diario-form.component.html',
  standalone: true,
})
export class MenuDiarioFormComponent extends FormStateHandler implements OnInit {
  menuDiario: MenuDiario | null = null;
  menus: Menu[] = [];

  form: FormGroup

  readonly title = signal('Crear Menú Diario')

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

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.params['id'];
    this.loading = true;

    try {
      const menuDiarioPromise: Promise<MenuDiario | null> = id
        ? firstValueFrom(this.menuDiarioService.getById(id))
        : Promise.resolve(null);
      const menusPromise: Promise<Menu[]> = firstValueFrom(this.menuService.getAll());
      const [menuDiarioData, menus] = await Promise.all([menuDiarioPromise, menusPromise]);
      this.menus = menus;

      if (menuDiarioData) {
        this.menuDiario = menuDiarioData;
        this.form.patchValue({
          dia: this.menuDiario.dia,
          menuVegetariano: this.menuDiario.menuVegetariano,
          menuNoVegetariano: this.menuDiario.menuNoVegetariano
        });
        this.title.set('Modificar Menú Diario');
      }
    } catch (error) {
      this.error = true;
      console.error('Error al obtener datos');
      console.error(error);
      this.notificationService.show('Ha ocurrido un error. Por favor, intente nuevamente más tarde');
    } finally {
      this.loading = false;
    }

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
      this.menuDiarioService.update(this.menuDiario.id, dto).subscribe(getPostOptions(true));
    } else {
      this.menuDiarioService.create(dto).subscribe(getPostOptions(false));
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

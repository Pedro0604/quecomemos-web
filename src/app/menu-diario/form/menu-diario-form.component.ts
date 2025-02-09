import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {
  diasSemanaArray,
  MenuDiario,
  MenuDiarioDTO,
  MenuDiarioFormData,
  traduccionDiasSemana
} from '../menu-diario.model';
import {Menu} from '../../menu/menu.model';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {MenuService} from '../../menu/service/menu.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {LayoutService} from '../../layout/layout.service';
import {NotificationService} from '../../notification/notification.service';
import {MenuDiarioService} from '../service/menu-diario.service';
import {firstValueFrom} from 'rxjs';
import {MatAnchor, MatButton} from '@angular/material/button';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatError, MatFormField, MatHint, MatLabel} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {MatSelect} from '@angular/material/select';
import {FormErrorService, inArrayValidator} from '../../formError/form-error.service';

type CampoMenu = {
  nombre: string,
  label: string,
  menusFiltrados: Menu[],
  menusIniciales: Menu[],
  vegetariano: boolean
}

@Component({
  selector: 'app-menu-diario-form',
  imports: [
    MatAnchor,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatButton,
    MatCard,
    MatCardContent,
    MatError,
    MatFormField,
    MatHint,
    MatIcon,
    MatInput,
    MatLabel,
    MatOption,
    ReactiveFormsModule,
    RouterLink,
    MatSelect
  ],
  templateUrl: './menu-diario-form.component.html',
  standalone: true,
  styleUrl: './menu-diario-form.component.css'
})
export class MenuDiarioFormComponent implements OnInit, AfterViewInit {
  menuDiario: MenuDiario | null = null;
  menus: Menu[] = [];

  loading: boolean = false;
  error: boolean = false;

  form: FormGroup

  errorMessages: { [key: string]: string } = {};
  hints: { [key: string]: string } = {}

  camposDeMenus: CampoMenu[] = [
    {
      nombre: 'menuVegetariano',
      label: 'Menú vegetariano',
      menusFiltrados: [],
      menusIniciales: [],
      vegetariano: true
    },
    {
      nombre: 'menuNoVegetariano',
      label: 'Menú no vegetariano',
      menusFiltrados: [],
      menusIniciales: [],
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
    private formErrorService: FormErrorService) {
    this.form = new FormGroup({
      dia: new FormControl('', [Validators.required, inArrayValidator(diasSemanaArray)]),
      menuVegetariano: new FormControl('', [Validators.required]),
      menuNoVegetariano: new FormControl('', [Validators.required]),
    });
  }

  menuSeleccionadoValidator(menusFiltrados: Menu[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const menuSeleccionado = control.value;
      if (menuSeleccionado) {
        const menuValido = menusFiltrados.some(menu => menu.id === menuSeleccionado?.id);
        return menuValido ? null : {menuInvalido: true};
      }
      return null;
    };
  }

  private filtrarMenus(campo: CampoMenu): void {
    const field = this.form.get(campo.nombre)
    const valorCampo = field?.value;
    const nombre = valorCampo ? typeof valorCampo == 'string' ? valorCampo : valorCampo.nombre : '';

    campo.menusFiltrados = campo.menusIniciales.filter(menu => {
      return menu.nombre.toLowerCase().includes(nombre.toLowerCase());
    });

    field?.setValidators([
      this.menuSeleccionadoValidator(campo.menusFiltrados),
      Validators.required
    ]);
    field?.updateValueAndValidity({emitEvent: false});
    this.updateErrorMessage(campo.nombre);
  }

  async cargarMenusDiarios(): Promise<void> {
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
        }
      });
      this.layoutService.setTitle('Modificar Menú Diario');
    } else {
      this.layoutService.setTitle('Crear Menú Diario');
    }

    await this.cargarMenusDiarios();

    this.camposDeMenus.forEach(campo => {
      campo.menusIniciales = this.menus.filter(menu => menu.vegetariano == campo.vegetariano);

      const field = this.form.get(campo.nombre);
      this.filtrarMenus(campo);
      field?.valueChanges.subscribe(() => {
        this.filtrarMenus(campo);
      });

      if (campo.menusIniciales.length === 0) {
        this.hints[campo.nombre] = `No hay menús ${campo.vegetariano ? 'vegetarianos' : 'no vegetarianos'}`;
        field?.disable();
      }
    });
  }

  displayFn(menu: Menu): string {
    return menu && menu.nombre ? menu.nombre : '';
  }

  selectMenuIfNameMatches(nombreCampo: string): void {
    const field = this.form.get(nombreCampo);
    const inputValue = field?.value || '';

    const campoMenu = this.camposDeMenus.find(campo => campo.nombre === nombreCampo);

    const menuSeleccionado = campoMenu?.menusIniciales.find(menu => menu.nombre.toLowerCase() === inputValue.toLowerCase());

    if (menuSeleccionado) {
      field?.setValue(menuSeleccionado);
    }
  }

  updateErrorMessage(controlName: string) {
    const control = this.form.get(controlName);
    this.errorMessages[controlName] = this.formErrorService.updateErrorMessage(control);
  }

  saveMenu(menuData: MenuDiarioFormData): void {
    const dto: MenuDiarioDTO = {
      dia: menuData.dia,
      menuVegetarianoId: menuData.menuVegetariano.id,
      menuNoVegetarianoId: menuData.menuNoVegetariano.id,
    }

    if (this.menuDiario) {
      this.menuDiarioService.updateMenuDiario(this.menuDiario.id, dto).subscribe({
        complete: () => {
          this.notificationService.show('Menú diario modificado exitosamente');
          this.router.navigate(['/menu-diario'])
        },
        error: error => {
          this.notificationService.show('Error al modificar el menú diario. Por favor, intente nuevamente');
          console.error("Error al modificar el menú diario");
          console.error(error);
        }
      });
    } else {
      this.menuDiarioService.createMenuDiario(dto).subscribe({
        complete: () => {
          this.notificationService.show('Menú diario creado exitosamente');
          this.router.navigate(['/menu-diario'])
        },
        error: error => {
          this.notificationService.show('Error al crear el menú diario. Por favor, intente nuevamente');
          console.error("Error al crear el menú diario");
          console.error(error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const menuDiarioData: MenuDiarioFormData = this.form.value;
      this.saveMenu(menuDiarioData);
    } else {
      this.notificationService.show('Error en el formulario. Vuelva a intentarlo');
    }
  }

  @ViewChild('extra') extraTemplate!: TemplateRef<any> | null;

  ngAfterViewInit(): void {
    this.layoutService.setExtra(this.extraTemplate);
  }

  protected readonly history = history;
  protected readonly diasSemanaArray = diasSemanaArray;
  protected readonly traduccionDiasSemana = traduccionDiasSemana;
}

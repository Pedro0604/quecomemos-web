import {Component, OnInit, signal} from '@angular/core';
import {Menu, MenuDTO} from '../menu.model';
import {MenuService} from '../service/menu.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {NotificationService} from '../../notification/notification.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {MatError} from '@angular/material/input';
import {MatAnchor} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatCheckbox} from '@angular/material/checkbox';
import {Comida, TipoComida, tipoComidaToString} from '../../comida/comida.model';
import {MatCard, MatCardContent,} from '@angular/material/card';
import {ComidaService} from '../../comida/service/comida.service';
import {firstValueFrom} from 'rxjs';
import {InputComponent} from '../../components/input/input.component';
import {SpinnerComponent} from '../../components/spinner/spinner.component';
import {AutocompleteComponent} from '../../components/autocomplete/autocomplete.component';
import {FormService} from '../../form-service/form.service';
import {FormStateHandler} from '../../utils/FormStateHandler';
import {SubmitButtonComponent} from '../../components/submit-button/submit-button.component';
import {TitleComponent} from '../../components/title/title.component';
import {
  FocusFirstInvalidFieldDirective
} from '../../directives/focus-first-invalid-field.directive/focus-first-invalid-field.directive';

type CampoComida = {
  nombre: string,
  masculino: boolean,
  comidas: Comida[],
  tipoComida: TipoComida
}

@Component({
  selector: 'app-menu-form',
  imports: [
    ReactiveFormsModule,
    MatIcon,
    MatError,
    MatCheckbox,
    RouterLink,
    MatAnchor,
    MatCard,
    MatCardContent,
    InputComponent,
    SpinnerComponent,
    AutocompleteComponent,
    SubmitButtonComponent,
    TitleComponent,
    FocusFirstInvalidFieldDirective
  ],
  templateUrl: './menu-form.component.html',
  standalone: true,
  styleUrl: './menu-form.component.css'
})
export class MenuFormComponent extends FormStateHandler implements OnInit {
  menu: Menu | null = null;
  comidas: Comida[] = []

  form: FormGroup

  readonly title = signal('Crear Menú')

  camposSinComidas: CampoComida[] = [];

  camposDeComida: CampoComida[] = [
    {
      nombre: 'entrada',
      masculino: false,
      comidas: [],
      tipoComida: 'ENTRADA'
    },
    {
      nombre: 'principal',
      masculino: true,
      comidas: [],
      tipoComida: 'PLATO_PRINCIPAL'
    },
    {
      nombre: 'postre',
      masculino: true,
      comidas: [],
      tipoComida: 'POSTRE'
    },
    {
      nombre: 'bebida',
      masculino: false,
      comidas: [],
      tipoComida: 'BEBIDA'
    },
  ];

  updateComidasValidity() {
    this.camposDeComida.forEach(campo => {
      this.form.get(campo.nombre)?.updateValueAndValidity({onlySelf: true});
    })
    this.form.updateValueAndValidity();
  }

  alMenosUnaComidaSeleccionadaValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const controls = group.value;

      const algunoSeleccionado = this.camposDeComida.some(campo => {
        const valor = controls[campo.nombre];
        return valor && typeof valor === 'object' && valor.nombre;
      });

      if (algunoSeleccionado) {
        return null;
      }

      this.camposDeComida.forEach(campo => {
        group.get(campo.nombre)?.setErrors({...group.get(campo.nombre)?.errors, ningunaComidaSeleccionada: true});
      })

      return {ningunaComidaSeleccionada: true};
    };
  }

  constructor(
    private menuService: MenuService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private comidaService: ComidaService,
    protected formService: FormService,
    private fb: FormBuilder,
  ) {
    super();
    this.form = this.fb.group({
      nombre: [''],
      precio: ['', [Validators.min(0)]],
      vegetariano: [false],
      entrada: [''],
      principal: [''],
      postre: [''],
      bebida: [''],
    }, {validators: this.alMenosUnaComidaSeleccionadaValidator()});
  }

  async cargarComidas(): Promise<void> {
    try {
      this.loading = true;
      this.comidas = await firstValueFrom(this.comidaService.getAll());
    } catch (error) {
      console.error('Error al obtener las comidas');
      console.error(error);
      this.error = true;
    } finally {
      this.loading = false;
    }
  }

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.menuService.getById(id).subscribe({
        next: (data) => {
          this.menu = data
          this.form.get('nombre')?.setValue(this.menu.nombre)
          this.form.get('precio')?.setValue(this.menu.precio)
          this.form.get('vegetariano')?.setValue(this.menu.vegetariano)
          this.menu.comidas.forEach(comida => {
            const campoComida = this.camposDeComida.find(campoComida => campoComida.tipoComida === comida.tipoComida)
            if (campoComida) {
              const comidaField = this.form.get(campoComida.nombre);
              comidaField?.setValue(comida);
              comidaField?.markAsTouched();
            }
          })
        },
        error: error => {
          this.error = true;
          console.error('Error al obtener el menú', error);
          this.notificationService.show('Ha ocurrido un error. Por favor, intente nuevamente más tarde');
        }
      });
      this.title.set('Modificar Menú');
    }

    const vegetarianoInicial = this.route.snapshot.queryParams['vegetariano'] as boolean;
    this.form.get('vegetariano')?.setValue(vegetarianoInicial);

    await this.cargarComidas();

    function filterComida(comida: Comida, tipoComida: TipoComida, menuVegetariano: boolean): boolean {
      return comida.tipoComida == tipoComida && (menuVegetariano ? comida.vegetariana : true);
    }

    const calculateCamposSinComidas = () => {
      this.camposSinComidas = this.camposDeComida.filter(campo => campo.comidas.length === 0);
    }

    this.camposDeComida.forEach(campo => {
      campo.comidas = this.comidas.filter(comida => filterComida(comida, campo.tipoComida, false));
    });

    calculateCamposSinComidas();

    this.form.get('vegetariano')?.valueChanges.subscribe(menuVegetariano => {
      this.camposDeComida.forEach(campo => {
        campo.comidas = this.comidas.filter(comida => filterComida(comida, campo.tipoComida, menuVegetariano));
      });
      calculateCamposSinComidas();
    });
  }

  algunaComidaTouched(): boolean {
    return this.camposDeComida.some(campo => {
      const field = this.form.get(campo.nombre);
      return field?.touched;
    });
  }

  getTextoSinComidas(campo: CampoComida): string {
    return `No hay
    ${campo.masculino ? 'ningún' : 'ninguna'} ${tipoComidaToString(campo.tipoComida).toLowerCase()} ${this.form.get("vegetariano")?.value ? ('vegetarian' + (campo.masculino ? 'o' : 'a')) : ''}
    disponible`
  }

  getTextoSinComidasMultiple(campos: CampoComida[]): string {
    const tiposComida = campos.map(campo => {
      return tipoComidaToString(campo.tipoComida).toLowerCase();
    });

    const listaFormateada = this.formatearLista(tiposComida);
    const allFemeninas = campos.every(campo => !campo.masculino);

    return `No hay ${campos[0].masculino ? 'ningún' : 'ninguna'} ${listaFormateada} ${this.form.get("vegetariano")?.value ? (allFemeninas ? 'vegetarianas' : 'vegetarianos') : ''} disponibles.`;
  }

  formatearLista(items: string[]): string {
    if (items.length === 1) return items[0];
    if (items.length === 2) return items.join(' o ');
    return items.slice(0, -1).join(', ') + ' o ' + items[items.length - 1];
  }

  getQueryParams(campo: CampoComida): { [key: string]: string } {
    return {
      'tipo-comida': campo.tipoComida,
      ...(this.form.get('vegetariano')?.value ? {vegetariana: '1'} : {})
    }
  }

  displayFn(comida: Comida): string {
    return comida && comida.nombre ? comida.nombre : '';
  }

  private saveMenu(dto: MenuDTO): void {
    const getPostOptions = (isModification: boolean) => {
      return {
        complete: () => {
          this.notificationService.show(isModification ? 'Menú modificado exitosamente' : 'Menú creado exitosamente');
          this.router.navigate(['/menu']);
        },
        error: (error: any) => {
          const message = isModification ? 'Error al modificar el menú' : 'Error al crear el menú'
          this.notificationService.show(message + ". Por favor, intente nuevamente");
          console.error(message);
          console.error(error);
        }
      };
    }

    if (this.menu) {
      this.menuService.update(this.menu.id, dto).subscribe(getPostOptions(true));
    } else {
      this.menuService.create(dto).subscribe(getPostOptions(false));
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const menuData = this.form.value;
      const comidaIds = [];
      if (menuData.entrada) {
        comidaIds.push(menuData.entrada.id);
      }
      if (menuData.principal) {
        comidaIds.push(menuData.principal.id);
      }
      if (menuData.postre) {
        comidaIds.push(menuData.postre.id);
      }
      if (menuData.bebida) {
        comidaIds.push(menuData.bebida.id);
      }
      const menuDTO: MenuDTO = {
        nombre: menuData.nombre,
        precio: menuData.precio,
        vegetariano: menuData.vegetariano,
        comidaIds: comidaIds,
      }
      this.saveMenu(menuDTO);
    } else {
      this.formService.validateAllFields(this.form);
    }
  }

  protected readonly history = history;
  protected readonly tipoComidaToString = tipoComidaToString;
}

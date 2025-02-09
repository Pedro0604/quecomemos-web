import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Menu, MenuDTO, MenuFormData} from '../menu.model';
import {MenuService} from '../service/menu.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {LayoutService} from '../../layout/layout.service';
import {NotificationService} from '../../notification/notification.service';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {MatError, MatFormField, MatHint, MatInput, MatLabel, MatPrefix} from '@angular/material/input';
import {MatAnchor, MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {Comida, TipoComida} from '../../comida/comida.model';
import {MatCard, MatCardContent,} from '@angular/material/card';
import {ComidaService} from '../../comida/service/comida.service';
import {firstValueFrom} from 'rxjs';
import {FormErrorService} from '../../formError/form-error.service';

type CampoComida = {
  nombre: string,
  label: string,
  masculino: boolean,
  comidasFiltradas: Comida[],
  comidasIniciales: Comida[],
  tipoComida: TipoComida
}

@Component({
  selector: 'app-menu-form',
  imports: [
    ReactiveFormsModule,
    MatInput,
    MatFormField,
    MatButton,
    MatLabel,
    MatIcon,
    MatPrefix,
    MatError,
    MatHint,
    MatCheckbox,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    RouterLink,
    MatAnchor,
    MatCard,
    MatCardContent,
  ],
  templateUrl: './menu-form.component.html',
  standalone: true,
  styleUrl: './menu-form.component.css'
})
export class MenuFormComponent implements OnInit, AfterViewInit {
  menu: Menu | null = null;
  comidas: Comida[] = []

  error: boolean = false;
  loading: boolean = true;

  form: FormGroup

  errorMessages: { [key: string]: string } = {};
  hints: { [key: string]: string } = {}
  mostrarErrorSinComidas = false;

  camposDeComida: CampoComida[] = [
    {
      nombre: 'entrada',
      label: 'Entrada',
      masculino: false,
      comidasFiltradas: [],
      comidasIniciales: [],
      tipoComida: 'ENTRADA'
    },
    {
      nombre: 'principal',
      label: 'Plato Principal',
      masculino: true,
      comidasFiltradas: [],
      comidasIniciales: [],
      tipoComida: 'PLATO_PRINCIPAL'
    },
    {
      nombre: 'postre',
      label: 'Postre',
      masculino: true,
      comidasFiltradas: [],
      comidasIniciales: [],
      tipoComida: 'POSTRE'
    },
    {
      nombre: 'bebida',
      label: 'Bebida',
      masculino: false,
      comidasFiltradas: [],
      comidasIniciales: [],
      tipoComida: 'BEBIDA'
    },
  ];

  alMenosUnaComidaSeleccionadaValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const controls = group.value;

      const algunoSeleccionado = this.camposDeComida.some(campo => {
        const valor = controls[campo.nombre];
        return valor && typeof valor === 'object' && valor.nombre;
      });

      return algunoSeleccionado ? null : {ningunaSeleccionada: true};
    };
  }

  constructor(
    private menuService: MenuService,
    private route: ActivatedRoute,
    private router: Router,
    private layoutService: LayoutService,
    private notificationService: NotificationService,
    private comidaService: ComidaService,
    private formErrorService: FormErrorService) {
    this.form = new FormGroup({
        nombre: new FormControl('', [Validators.required, Validators.maxLength(255)]),
        precio: new FormControl('', [Validators.required, Validators.min(0)]),
        vegetariano: new FormControl(''),
        entrada: new FormControl(''),
        principal: new FormControl(''),
        postre: new FormControl(''),
        bebida: new FormControl(''),
      },
      {validators: this.alMenosUnaComidaSeleccionadaValidator()})
  }

  comidaSeleccionadaValidator(comidasFiltradas: Comida[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const comidaSeleccionada = control.value;
      if (comidaSeleccionada) {
        const comidaValida = comidasFiltradas.some(comida => comida.id === comidaSeleccionada?.id);
        return comidaValida ? null : {comidaInvalida: true};
      }
      return null;
    };
  }

  private filtrarComidas(campo: CampoComida): void {
    const field = this.form.get(campo.nombre)
    const valorCampo = field?.value;
    const menuVegetariano = this.form.get('vegetariano')?.value;
    const nombre = valorCampo ? typeof valorCampo == 'string' ? valorCampo : valorCampo.nombre : '';

    campo.comidasFiltradas = campo.comidasIniciales.filter(comida => {
      const coincideEntrada = comida.nombre.toLowerCase().includes(nombre.toLowerCase());
      const esVegetariana = menuVegetariano ? comida.vegetariana : true;

      return coincideEntrada && esVegetariana;
    });

    field?.setValidators([
      this.comidaSeleccionadaValidator(campo.comidasFiltradas),
    ]);
    field?.updateValueAndValidity({emitEvent: false});
    this.updateErrorMessage(campo.nombre);
  }

  disableSiNoTieneComidasVegetarianas(menuVegetariano: boolean, campo: CampoComida) {
    if (campo.comidasIniciales.length === 0) {
      return;
    }
    const field = this.form.get(campo.nombre);
    if (menuVegetariano) {
      const tieneComidasVegetarianas = this.comidas.some(comida => comida.tipoComida === campo.tipoComida && comida.vegetariana);
      if (!tieneComidasVegetarianas) {
        this.hints[campo.nombre] = 'No hay comidas vegetarianas de este tipo';
        field?.disable();
      }
    } else {
      this.hints[campo.nombre] = '';
      field?.enable();
    }
  }

  async cargarComidas(): Promise<void> {
    try {
      this.loading = true;
      this.comidas = await firstValueFrom(this.comidaService.getComidas());
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
      this.menuService.getMenuById(id).subscribe({
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
      this.layoutService.setTitle('Modificar Menú');
    } else {
      this.layoutService.setTitle('Crear Menú');
    }

    const vegetarianoInicial = this.route.snapshot.queryParams['vegetariano'];
    if (vegetarianoInicial) {
      this.form.get('vegetariano')?.setValue(true);
    }

    await this.cargarComidas();

    this.camposDeComida.forEach(campo => {
      campo.comidasIniciales = this.comidas.filter(comida => comida.tipoComida == campo.tipoComida);

      const field = this.form.get(campo.nombre);
      this.filtrarComidas(campo);
      field?.valueChanges.subscribe(() => {
        this.filtrarComidas(campo);
      });

      if (campo.comidasIniciales.length === 0) {
        this.hints[campo.nombre] = 'No hay comidas de este tipo';
        field?.disable();
      }
    });

    this.mostrarErrorSinComidas = this.camposDeComida.every(campo => campo.comidasIniciales.length === 0)

    this.form.get('vegetariano')?.valueChanges.subscribe(menuVegetariano => {
      this.camposDeComida.forEach(campo => {
        this.filtrarComidas(campo);
        this.disableSiNoTieneComidasVegetarianas(menuVegetariano, campo);
      })
    });
  }

  deberiaMostrarErrorAlMenosUnaComida(): boolean {
    return this.camposDeComida.some(campo => {
      const field = this.form.get(campo.nombre);
      return field?.dirty;
    });
  }

  displayFn(comida: Comida): string {
    return comida && comida.nombre ? comida.nombre : '';
  }

  selectComidaIfNameMatches(nombreCampo: string): void {
    const field = this.form.get(nombreCampo);
    const inputValue = field?.value || '';

    const comidaSeleccionada = this.comidas.find(comida => comida.nombre.toLowerCase() === inputValue.toLowerCase());

    if (comidaSeleccionada) {
      field?.setValue(comidaSeleccionada);
    }
  }

  updateErrorMessage(controlName: string) {
    const control = this.form.get(controlName);
    this.errorMessages[controlName] = this.formErrorService.updateErrorMessage(control);
  }

  saveMenu(menuData: MenuFormData): void {
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

    const dto: MenuDTO = {
      nombre: menuData.nombre,
      precio: menuData.precio,
      vegetariano: menuData.vegetariano,
      comidaIds: comidaIds,
    }

    if (this.menu) {
      this.menuService.updateMenu(this.menu.id, dto).subscribe({
        complete: () => {
          this.notificationService.show('Menú modificado exitosamente');
          this.router.navigate(['/menu'])
        },
        error: error => {
          this.notificationService.show('Error al modificar el menú. Por favor, intente nuevamente');
          console.error("Error al modificar el menú");
          console.error(error);
        }
      });
    } else {
      this.menuService.createMenu(dto).subscribe({
        complete: () => {
          this.notificationService.show('Menú creado exitosamente');
          this.router.navigate(['/menu'])
        },
        error: error => {
          this.notificationService.show('Error al crear el menú. Por favor, intente nuevamente');
          console.error("Error al crear el menú");
          console.error(error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const menuData: MenuFormData = this.form.value;
      this.saveMenu(menuData);
    } else {
      this.notificationService.show('Error en el formulario. Vuelva a intentarlo');
    }
  }

  @ViewChild('extra') extraTemplate!: TemplateRef<any> | null;

  ngAfterViewInit(): void {
    this.layoutService.setExtra(this.extraTemplate);
  }

  protected readonly history = history;
}

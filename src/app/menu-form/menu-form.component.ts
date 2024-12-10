import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Menu} from '../menu/menu.model';
import {MenuService} from '../menu/menu.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {LayoutService} from '../layout/layout.service';
import {NotificationService} from '../notification.service';
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
import {Comida, TipoComida} from '../comida/comida.model';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {MatDivider} from '@angular/material/divider';

type CampoComida = {
  nombre: string,
  label: string,
  masculino: boolean,
  comidasFiltradas: Comida[],
  comidasIniciales: Comida[],
  tipoComida: TipoComida
}

type PossibleErrorFunction = { (control: AbstractControl): string; }

type PossibleError = { name: string, errorFunction: PossibleErrorFunction }

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
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    MatDivider,
  ],
  templateUrl: './menu-form.component.html',
  standalone: true,
  styleUrl: './menu-form.component.css'
})
export class MenuFormComponent implements OnInit, AfterViewInit {
  menu: Menu | null = null;
  errorMessages: { [key: string]: string } = {};
  hints: { [key: string]: string } = {}
  form: FormGroup
  mostrarErrorSinComidas = false;
  comidas: Comida[] = [
    {
      id: 1, nombre: 'Principal',
      urlImagen: null,
      tipoComida: 'PLATO_PRINCIPAL',
      precio: 234,
      vegetariana: true
    },
    {
      id: 2, nombre: 'Postre',
      urlImagen: null,
      tipoComida: 'POSTRE',
      precio: 3435,
      vegetariana: false
    },
    {
      id: 3, nombre: 'Entrada',
      urlImagen: null,
      tipoComida: 'ENTRADA',
      precio: 3434,
      vegetariana: false
    },
    {
      id: 4, nombre: 'Otro',
      urlImagen: null,
      tipoComida: 'OTRO',
      precio: 123123,
      vegetariana: false
    },
    {
      id: 5, nombre: 'Bebida',
      urlImagen: null,
      tipoComida: 'ENTRADA',
      precio: 12323,
      vegetariana: true
    },
  ]

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

  possibleErrors: PossibleError[] = [
    {name: 'required', errorFunction: () => 'El campo es obligatorio'},
    {name: 'email', errorFunction: () => 'El email no es válido'},
    {
      name: 'minlength',
      errorFunction: (control: AbstractControl) => `La longitud mínima es: ${control.errors?.['minlength'].requiredLength} caracteres`
    },
    {
      name: 'maxlength',
      errorFunction: (control: AbstractControl) => `La longitud máxima es: ${control.errors?.['maxlength'].requiredLength} caracteres`
    },
    {
      name: 'min', errorFunction: (control: AbstractControl) => {
        if (control.errors?.['min'].min === 0) {
          return 'El valor no puede ser negativo';
        } else {
          return `El valor mínimo es: ${control.errors?.['min'].min}`;
        }
      }
    },
    {name: 'max', errorFunction: (control: AbstractControl) => `El valor máximo es: ${control.errors?.['max'].max}`},
    {name: 'comidaInvalida', errorFunction: () => `La comida ingresada no es válida`},
  ]

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
    private notificationService: NotificationService) {
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

  deberiaMostrarErrorAlMenosUnaComida(): boolean {
    return this.camposDeComida.some(campo => {
      const field = this.form.get(campo.nombre);
      return field?.dirty;
    });
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

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.menuService.getMenuById(id).subscribe((data) => (this.menu = data));
      this.layoutService.setTitle('Modificar Menú');
    } else {
      this.layoutService.setTitle('Crear Menú');
    }

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

  saveMenu(menuData: Menu): void {
    if (this.menu) {
      this.menuService.updateMenu(menuData).subscribe({
        complete: () => {
          this.notificationService.show('Menú creado exitosamente');
          this.router.navigate(['/menus'])
        },
        error: error => {
          this.notificationService.show('Error al crear el menú');
          console.error("Error al crear el menú");
          console.error(error);
        }
      });
    } else {
      this.menuService.createMenu(menuData).subscribe({
        complete: () => {
          this.notificationService.show('Menú modificado exitosamente');
          this.router.navigate(['/menus'])
        },
        error: error => {
          this.notificationService.show('Error al modificar el menú');
          console.error("Error al modificar el menú");
          console.error(error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const menuData = this.form.value;
      this.notificationService.show('Guardar');
      console.log(menuData);
      // this.saveMenu(menuData);
    } else {
      this.notificationService.show('Error en el formulario. Vuelva a intentarlo');
    }
  }

  updateErrorMessage(controlName: string) {
    const control = this.form.get(controlName);
    if (control && control.touched && control.invalid) {
      this.possibleErrors.forEach(error => {
        if (control.hasError(error.name)) {
          this.errorMessages[controlName] = error.errorFunction(control);
        }
      })
    }
  }

  @ViewChild('extra') extraTemplate!: TemplateRef<any> | null;

  ngAfterViewInit(): void {
    this.layoutService.setExtra(this.extraTemplate);
  }
}

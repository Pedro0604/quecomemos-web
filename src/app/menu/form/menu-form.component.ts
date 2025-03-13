import {Component, OnInit} from '@angular/core';
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
import {ComidaService} from '../../comida/service/comida.service';
import {firstValueFrom} from 'rxjs';
import {InputComponent} from '../../forms/components/fields/input/input.component';
import {AutocompleteComponent} from '../../forms/components/fields/autocomplete/autocomplete.component';
import {FormService} from '../../forms/service/form.service';
import {SubmitButtonComponent} from '../../forms/components/submit-button/submit-button.component';
import {TitleComponent} from '../../components/title/title.component';
import {BaseEntityForm} from '../../forms/BaseEntityForm';
import {FormStateComponent} from '../../forms/components/form-state/form-state.component';
import {FormComponent} from '../../forms/components/form/form.component';
import {DefaultImageDirective} from '../../directives/default-image-directive/default-image.directive';

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
    InputComponent,
    AutocompleteComponent,
    SubmitButtonComponent,
    TitleComponent,
    FormStateComponent,
    FormComponent,
    DefaultImageDirective
  ],
  templateUrl: './menu-form.component.html',
  standalone: true,
  styleUrl: './menu-form.component.css'
})
export class MenuFormComponent extends BaseEntityForm<Menu, MenuDTO, Comida> implements OnInit {
  protected override form: FormGroup
  protected override redirectUrlOnCreation: string = '/menu';

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
      this.form.get(campo.nombre)?.markAsDirty();
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
    private fb: FormBuilder,
    private comidaService: ComidaService,
    protected override router: Router,
    protected override notificationService: NotificationService,
    protected override formService: FormService,
    protected override service: MenuService,
    protected override route: ActivatedRoute
  ) {
    super(router, notificationService, formService, service, route, 'menú', false);

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

  protected override loadRelatedData(): Promise<Comida[]> {
    return firstValueFrom(this.comidaService.getAll());
  }

  protected override extraOnInit(): void {
    if (this.entity) {
      this.entity.comidas.forEach(comida => {
        const campoComida = this.camposDeComida.find(campoComida => campoComida.tipoComida === comida.tipoComida);
        if (campoComida) {
          const comidaField = this.form.get(campoComida.nombre);
          comidaField?.setValue(comida);
          comidaField?.markAsTouched();
        }
      });
    } else {
      const vegetarianoInicial = this.route.snapshot.queryParams['vegetariano'] as boolean;
      this.form.get('vegetariano')?.setValue(vegetarianoInicial);
    }

    function filterComida(comida: Comida, tipoComida: TipoComida, menuVegetariano: boolean): boolean {
      return comida.tipoComida == tipoComida && (menuVegetariano ? comida.vegetariana : true);
    }

    const calculateCamposSinComidas = () => {
      this.camposSinComidas = this.camposDeComida.filter(campo => campo.comidas.length === 0);
    }

    this.camposDeComida.forEach(campo => {
      campo.comidas = this.relatedData.filter(comida => filterComida(comida, campo.tipoComida, false));
    });

    this.form.get('vegetariano')?.valueChanges.subscribe(menuVegetariano => {
      this.camposDeComida.forEach(campo => {
        campo.comidas = this.relatedData.filter(comida => filterComida(comida, campo.tipoComida, menuVegetariano));
      });
      calculateCamposSinComidas();
    });

    calculateCamposSinComidas();
  }

  override mapToDTO(formValue: any): MenuDTO {
    return {
      nombre: formValue.nombre,
      precio: formValue.precio,
      vegetariano: formValue.vegetariano,
      comidaIds: this.camposDeComida
        .map(campo => formValue[campo.nombre]?.id)
        .filter(id => !!id)
    };
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

  protected readonly tipoComidaToString = tipoComidaToString;
}

import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Comida, ComidaDTO, TipoComida, tipoComidaToString} from '../comida.model';
import {ComidaService} from '../service/comida.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LayoutService} from '../../layout/layout.service';
import {NotificationService} from '../../notification/notification.service';
import {MatError} from '@angular/material/form-field';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatCheckbox} from '@angular/material/checkbox';
import {InputComponent} from '../../components/input/input.component';
import {SelectComponent} from '../../components/select/select.component';
import {FormService, inArrayValidator, urlValidator} from '../../form-service/form.service';
import {SubmitButtonComponent} from '../../components/submit-button/submit-button.component';
import {TitleExtraComponent} from '../../components/title-extra/title-extra.component';
import {
  FocusFirstInvalidFieldDirective
} from '../../directives/focus-first-invalid-field.directive/focus-first-invalid-field.directive';

@Component({
  selector: 'app-comida-form',
  imports: [
    MatError,
    MatCard,
    MatCardContent,
    ReactiveFormsModule,
    MatCheckbox,
    InputComponent,
    SelectComponent,
    SubmitButtonComponent,
    TitleExtraComponent,
    FocusFirstInvalidFieldDirective,
  ],
  templateUrl: './comida-form.component.html',
  standalone: true,
  styleUrl: './comida-form.component.css',
})
export class ComidaFormComponent implements OnInit {
  comida: Comida | null = null;
  error: boolean = false;
  tiposDeComida: TipoComida[] = ['OTRO', 'POSTRE', 'ENTRADA', 'BEBIDA', 'PLATO_PRINCIPAL'];
  tiposDeComidaOptions = this.tiposDeComida.map(tipoComida => ({
    value: tipoComida,
    name: tipoComidaToString(tipoComida)
  }));
  form: FormGroup

  constructor(
    private comidaService: ComidaService,
    private route: ActivatedRoute,
    private router: Router,
    private layoutService: LayoutService,
    private notificationService: NotificationService,
    protected formService: FormService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      nombre: [''],
      precio: ['', [Validators.min(0)]],
      vegetariana: [false],
      tipoComida: ['', [inArrayValidator(this.tiposDeComida)]],
      urlImagen: ['', [urlValidator]]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.comidaService.getComidaById(id).subscribe({
        next: (data) => {
          this.comida = data;
          this.form.get('nombre')?.setValue(this.comida.nombre);
          this.form.get('precio')?.setValue(this.comida.precio);
          this.form.get('vegetariana')?.setValue(this.comida.vegetariana);
          this.form.get('tipoComida')?.setValue(this.comida.tipoComida);
          this.form.get('urlImagen')?.setValue(this.comida.urlImagen);
        },
        error: error => {
          this.error = true;
          console.error('Error al obtener la comida', error);
          this.notificationService.show('Ha ocurrido un error. Por favor, intente nuevamente más tarde');
        }
      });

      this.layoutService.setTitle('Modificar comida');
    } else {
      this.layoutService.setTitle('Crear comida');
    }

    const tipoComidaInicial = this.route.snapshot.queryParams['tipo-comida'] as TipoComida;
    this.form.get('tipoComida')?.setValue(tipoComidaInicial);

    const vegetarianaInicial = this.route.snapshot.queryParams['vegetariana'] as boolean;
    this.form.get('vegetariana')?.setValue(vegetarianaInicial);
  }

  private saveComida(comidaDTO: ComidaDTO): void {
    const getPostOptions = (isModification: boolean) => {
      return {
        complete: () => {
          this.notificationService.show(isModification ? 'Comida modificada correctamente' : 'Comida creada correctamente');
          this.router.navigate(['/comidas']);
        },
        error: (error: any) => {
          const message = isModification ? 'Error al modificar la comida' : 'Error al crear la comida'
          this.notificationService.show(message);
          console.error(message);
          console.error(error);
        }
      }
    }

    if (this.comida?.id) {
      this.comidaService.updateComida(this.comida.id, comidaDTO).subscribe(getPostOptions(true));
    } else {
      this.comidaService.createComida(comidaDTO).subscribe(getPostOptions(false));
    }
  }

  onSubmit(): void {
    if (this.form.valid && this.form.dirty) {
      const comidaDTO: ComidaDTO = this.form.value;
      this.saveComida(comidaDTO);
    } else {
      this.formService.validateAllFields(this.form);
    }
  }

  protected readonly history = history;
}

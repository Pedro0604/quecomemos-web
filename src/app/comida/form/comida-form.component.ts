import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {Comida, ComidaDTO, TipoComida} from '../comida.model';
import {ComidaService} from '../service/comida.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LayoutService} from '../../layout/layout.service';
import {NotificationService} from '../../notification/notification.service';
import {MatError, MatFormField, MatPrefix} from '@angular/material/form-field';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatInput, MatLabel, MatHint} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatOption} from '@angular/material/core';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatSelect} from '@angular/material/select';

type PossibleErrorFunctions = { (control: AbstractControl): string; }

type PossibleError = { name: string, errorFunction: PossibleErrorFunctions };

type ComidaFormData = {
  nombre: string,
  precio: number,
  vegetariana: boolean,
  tipoComida: TipoComida,
  urlImagen: string
}

@Component({
  selector: 'app-comida-form',
  imports: [
    MatError,
    MatCard,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatPrefix,
    MatButton,
    MatOption,
    MatCheckbox,
    MatLabel,
    MatHint,
    MatSelect
  ],
  templateUrl: './comida-form.component.html',
  standalone: true,
  styleUrl: './comida-form.component.css'
})
export class ComidaFormComponent implements OnInit {
    comida: Comida | null = null;

    error: boolean = false;

    loading: boolean = true;

    tiposDeComida: TipoComida[] = ['OTRO', 'POSTRE', 'ENTRADA', 'BEBIDA', 'PLATO_PRINCIPAL'];

    form: FormGroup

    errorMessages: { [key: string]: string } = {};
    hints: { [key: string]: string } = {};
    mostrarErrorTipoComida: boolean = false;

    possibleErrors: PossibleError[] = [
      {name: 'required', errorFunction: () => 'El campo es obligatorio'},
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
      {
        name: 'max',
        errorFunction: (control: AbstractControl) => `El valor máximo es: ${control.errors?.['max'].max}`
      },
    ]

    constructor(
      private comidaService: ComidaService,
      private route: ActivatedRoute,
      private router: Router,
      private layoutService: LayoutService,
      private notificationService: NotificationService
    ) {
      this.form = new FormGroup({
        nombre: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
        precio: new FormControl('', [Validators.required, Validators.min(0), Validators.max(10000)]),
        vegetariana: new FormControl(false),
        tipoComida: new FormControl('', [Validators.required]),
        urlImagen: new FormControl('', [])
      });
    }

    tipoComidaSeleccionadoValidator(): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const tipoComida = control.value;
        return tipoComida ? null : { tipoComidaNoSeleccionado: true };
      };
    }

    ngOnInit() {
      const id = this.route.snapshot.params['id'];
      if (id) {
        this.comidaService.getComidaById(id).subscribe((data) => {
          this.comida = data
          this.form.get('nombre')?.setValue(this.comida.nombre);
          this.form.get('precio')?.setValue(this.comida.precio);
          this.form.get('vegetariana')?.setValue(this.comida.vegetariana);
          this.form.get('tipoComida')?.setValue(this.comida.tipoComida);
          this.form.get('urlImagen')?.setValue(this.comida.urlImagen);
        });

        this.layoutService.setTitle('Modificar comida');
      } else {
        this.layoutService.setTitle('Crear comida');
      }

      this.mostrarErrorTipoComida = this.form.get('tipoComida')?.hasError('tipoComidaNoSeleccionado') || false;

    }

    deberiaMostrarErrorTipoComida(): boolean {
      return this.mostrarErrorTipoComida;
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

    saveComida(comidaData: ComidaFormData): void {
      const dto: ComidaDTO = {
        nombre: comidaData.nombre,
        precio: comidaData.precio,
        vegetariana: comidaData.vegetariana,
        tipoComida: comidaData.tipoComida,
        urlImagen: comidaData.urlImagen
      }

      if (this.comida?.id) {
        this.comidaService.updateComida(this.comida.id, dto).subscribe({
          complete: () => {
            this.notificationService.show('Comida modificada correctamente');
            this.router.navigate(['/comidas']);
          },
          error: error => {
            this.notificationService.show('Error al modificar la comida');
            console.error("Error al modificar la comida");
            console.error(error);
          }
        });
      } else {
        this.comidaService.createComida(dto).subscribe({
          complete: () => {
            this.notificationService.show('Comida creada correctamente');
            this.router.navigate(['/comidas']);
          },
          error: error => {
            this.notificationService.show('Error al crear la comida');
            console.error("Error al crear la comida");
            console.error(error);
          }
        });
      }

    }

    onSubmit(): void {
      if (this.form.valid) {
        const comidaData: ComidaFormData = this.form.value;
        this.saveComida(comidaData);
      } else {
        this.notificationService.show('Error al enviar el formuladrio. Vuelva a intentarlo.');
      }
    }

    protected readonly history = history;
}

import {Injectable} from '@angular/core';
import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from "@angular/forms";

type PossibleErrorFunction = { (control: AbstractControl): string; }
type PossibleError = { name: string, errorFunction: PossibleErrorFunction }

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private possibleErrors: PossibleError[] = [
    {name: 'required', errorFunction: () => 'El campo es obligatorio'},
    {name: 'onlyNumbers', errorFunction: () => `El campo solo debe contener números`},
    {name: 'onlyLetters', errorFunction: () => `El campo solo debe contener letras`},
    {name: 'url', errorFunction: () => 'La URL debe ser de la forma: https://example.com'},
    {name: 'email', errorFunction: () => 'El email no es válido'},
    {
      name: 'minlength',
      errorFunction: (control: AbstractControl) => `La longitud mínima es de ${control.errors?.['minlength'].requiredLength} caracteres. (Actualmente hay ${control.errors?.['minlength'].actualLength})`
    },
    {
      name: 'maxlength',
      errorFunction: (control: AbstractControl) => `La longitud máxima es de ${control.errors?.['maxlength'].requiredLength} caracteres. (Actualmente hay ${control.errors?.['maxlength'].actualLength})`
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
    {name: 'opcionInvalida', errorFunction: () => `La opción ingresada no es válida`},
    {
      name: 'invalidValue',
      errorFunction: (control: AbstractControl) => control.errors?.['invalidValue'].value ? `La opción ${control.errors?.['invalidValue'].value} no está dentro de las opciones válidas` : 'Elija una opción válida'
    },
    {name: 'passwordsDoNotMatch', errorFunction: () => 'Las contraseñas no coinciden'},
    {name: 'pattern', errorFunction: () => `El valor ingresado no es válido`},
    {name: 'ningunaComidaSeleccionada', errorFunction: () => 'Debes seleccionar al menos una comida'},
  ]

  constructor() {
  }

  validateAllFields(group: FormGroup) {
    Object.keys(group.controls).forEach(controlName => {
      const control = group.get(controlName);
      control?.markAsTouched();
      control?.updateValueAndValidity({onlySelf: true});
    });
    group.updateValueAndValidity();
  }

  getTooltipMessage(group: FormGroup, error: boolean = false, loading: boolean = false, message: string | undefined): string {
    if (message) {
      return message;
    }
    if (error) {
      return 'Ha ocurrido un error. Inténtelo nuevamente más tarde'
    }
    if (loading) {
      return 'Cargando...'
    }

    if (group.invalid) {
      const requiredControls = Object.keys(group.controls).filter(controlName => {
        const control = group.get(controlName);
        return control?.hasError('required') && control?.value === '';
      });

      if (requiredControls.length > 0) {
        return 'Faltan campos obligatorios por completar';
      }

      return 'El formulario tiene errores. Resuélvalos para continuar';
    } else if (group.disabled) {
      return 'El formulario aún no está habilitado';
    } else if (!group.dirty) {
      return 'El formulario no ha sido modificado';
    } else {
      return '';
    }
  }

  updateErrorMessage(control: AbstractControl | null): string {
    if (control && control.touched && control.invalid) {
      for (const error of this.possibleErrors) {
        if (control.hasError(error.name)) {
          return error.errorFunction(control);
        }
      }
    }
    return '';
  }
}

const withEmptyCheck = (validatorFn: (value: any) => ValidationErrors | null): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    return validatorFn(control.value);
  };
};

export const inArrayValidator = (array: any[]): ValidatorFn => {
  return withEmptyCheck((value) => (array.includes(value) ? null : {invalidValue: true, value}));
};

export const onlyNumbersValidator: ValidatorFn = withEmptyCheck((value) =>
  /^\d+$/.test(value) ? null : {onlyNumbers: true}
);

export const onlyLettersValidator: ValidatorFn = withEmptyCheck((value) =>
  /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value) ? null : {onlyLetters: true}
);

export const urlValidator: ValidatorFn = withEmptyCheck((value) =>
  /^(https?:\/\/[^\s$.?#].[^\s]*)$/.test(value) ? null : {url: true}
);

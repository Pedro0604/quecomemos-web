import {Injectable} from '@angular/core';
import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

type PossibleErrorFunction = { (control: AbstractControl): string; }
type PossibleError = { name: string, errorFunction: PossibleErrorFunction }

export const inArrayValidator = (array: any[]): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const selectedValue = control.value;
    if (selectedValue) {
      return array.includes(selectedValue) ? null : {invalidValue: true, value: selectedValue};
    }
    return null;
  };
}

export const onlyNumbersValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  return /^\d+$/.test(control.value) ? null : {onlyNumbers: true};
};

export const onlyLettersValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(control.value) ? null : {onlyLetters: true};
};

export const urlValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  return /^(https?:\/\/[^\s$.?#].[^\s]*)$/.test(control.value) ? null : {url: true};
}

@Injectable({
  providedIn: 'root'
})
export class FormErrorService {
  private possibleErrors: PossibleError[] = [
    {name: 'required', errorFunction: () => 'El campo es obligatorio'},
    {name: 'onlyNumbers', errorFunction: () => `El campo solo debe contener números`},
    {name: 'onlyLetters', errorFunction: () => `El campo solo debe contener letras`},
    {name: 'url', errorFunction: () => 'La URL no es válida'},
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
    {name: 'comidaInvalida', errorFunction: () => `La comida ingresada no es válida`},
    {name: 'menuInvalido', errorFunction: () => `El menú ingresado no es válido`},
    {
      name: 'invalidValue',
      errorFunction: (control: AbstractControl) => `La opción ${control.errors?.['invalidValue'].value} no está dentro de las opciones válidas`
    },
    {name: 'passwordsDoNotMatch', errorFunction: () => 'Las contraseñas no coinciden'},
    {name: 'pattern', errorFunction: () => `El valor ingresado no es válido`},
  ]

  constructor() {
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

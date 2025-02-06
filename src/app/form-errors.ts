import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';


type PossibleErrorFunction = { (control: AbstractControl): string; }

type PossibleError = { name: string, errorFunction: PossibleErrorFunction }

export const possibleErrors: PossibleError[] = [
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
  {
    name: 'max',
    errorFunction: (control: AbstractControl) => `El valor máximo es: ${control.errors?.['max'].max}`
  },
  {name: 'comidaInvalida', errorFunction: () => `La comida ingresada no es válida`},
  {name: 'menuInvalido', errorFunction: () => `El menú ingresado no es válido`},
  {name: 'invalidValue', errorFunction: (control: AbstractControl) => `La opción ${control.errors?.['invalidValue'].value} no está dentro de las opciones válidas`},
]

export function inArrayValidator(array: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const selectedValue = control.value;
    if (selectedValue) {
      return array.includes(selectedValue) ? null : {invalidValue: true, value: selectedValue};
    }
    return null;
  };
}

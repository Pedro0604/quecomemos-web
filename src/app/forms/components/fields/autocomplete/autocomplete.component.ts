import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef} from '@angular/core';
import {BaseFormFieldComponent} from '../base-form-field/base-form-field.component';
import {MatError, MatFormField, MatLabel, MatPrefix, MatSuffix} from '@angular/material/form-field';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MatHint, MatInput} from '@angular/material/input';
import {AbstractControl, ReactiveFormsModule, ValidationErrors, ValidatorFn} from '@angular/forms';
import {NgTemplateOutlet} from '@angular/common';
import {FormService} from "../../../service/form.service";
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-autocomplete',
  imports: [
    MatLabel,
    MatAutocomplete,
    MatOption,
    MatError,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatAutocompleteTrigger,
    MatPrefix,
    MatHint,
    NgTemplateOutlet,
    MatIconButton,
    MatIcon,
    MatSuffix
  ],
  templateUrl: './autocomplete.component.html',
  standalone: true
})
export class AutocompleteComponent<T extends {
  id: string | number;
  nombre: string
}> extends BaseFormFieldComponent implements OnInit, OnChanges {
  @Input({required: true}) opciones: T[] = [];
  @Input() displayWithFn: ((value: T) => string) | null = null;
  @Input() optionTemplate!: TemplateRef<{ $implicit: T }>;
  @Output() onChange: EventEmitter<void> = new EventEmitter<void>();

  opcionesFiltradas: T[] = this.opciones;
  validator: ValidatorFn | null = null;

  constructor(formService: FormService) {
    super(formService);
  }

  private getStringValue(toLowerCase = true): string {
    const stringValue = this.control.value ? (typeof this.control.value === 'string' ? this.control.value : this.control.value.nombre) : '';
    return toLowerCase ? stringValue.toLowerCase() : stringValue;
  }

  private filtrarOpciones(): void {
    const stringValue = this.getStringValue(true);

    this.opcionesFiltradas = this.opciones.filter((opcion) =>
      opcion.nombre.toLowerCase().includes(stringValue)
    );

    if (this.validator) {
      this.control.removeValidators(this.validator);
    }
    this.validator = this.opcionSeleccionadaValidator(this.opcionesFiltradas);
    this.control.addValidators(this.validator);
    this.control.updateValueAndValidity({emitEvent: false});
  }

  private opcionSeleccionadaValidator(opcionesFiltradas: T[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const opcionSeleccionada = control.value;
      if (opcionSeleccionada) {
        const esValida = opcionesFiltradas.some((opcion) => opcion.id === opcionSeleccionada.id);
        return esValida ? null : {opcionInvalida: true};
      }
      return null;
    };
  }

  private seleccionarOpcionSiCoincide(): void {
    const stringValue = this.getStringValue(true);
    const opcionSeleccionada = this.opciones.find((opcion) => opcion.nombre.toLowerCase() === stringValue);

    if (opcionSeleccionada) {
      this.control.setValue(opcionSeleccionada, {emitEvent: false});
    }
  }

  private setupFilteringAndValidation(): void {
    const autocompleteSubscription = this.control.valueChanges.subscribe(() => {
      this.filtrarOpciones();
      this.seleccionarOpcionSiCoincide();
    });
    this.subscriptions.push(autocompleteSubscription);
  }

  override ngOnInit() {
    super.ngOnInit();

    this.setupFilteringAndValidation();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['opciones']) {
      if (this.opciones.length === 0) {
        this.hint = `No hay opciones disponibles`;
        this.control.disable();
      } else if (this.control.parent?.enabled) {
        this.hint = '';
        this.control.enable();
      }
      this.filtrarOpciones();
    }
  }
}

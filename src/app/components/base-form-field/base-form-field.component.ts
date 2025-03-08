import {booleanAttribute, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl} from '@angular/forms';
import {Subscription} from 'rxjs';
import {FloatLabelType} from '@angular/material/form-field';
import {FormService} from '../../form-service/form.service';

@Component({
  selector: 'app-base-form-field',
  imports: [],
  templateUrl: '',
  standalone: true,
})
export abstract class BaseFormFieldComponent implements OnInit, OnDestroy {
  @Input({required: true}) label: string = '';
  @Input({required: true}) placeholder: string = '';
  @Input({required: true}) abstractControl!: AbstractControl | null;
  @Input() hint: string = '';
  @Input() textPrefix: string = '';
  @Input({transform: booleanAttribute}) required: boolean = true;
  @Input() floatLabel: FloatLabelType = 'auto';
  @Input() _clearable: boolean | null = null;

  control: FormControl = new FormControl();
  errorMessage = '';
  protected subscriptions: Subscription[] = [];

  protected constructor(protected formService: FormService) {
  }

  protected isClearable() {
    // Se hace esto para que si no se define, por defecto sea clearable, pero se pueda seguir sobreescribiendo en los hijos
    return this._clearable == null ? true : this._clearable;
  }

  get clearable(): boolean {
    return this.isClearable() && this.control.enabled;
  }

  ngOnInit() {
    if (this.abstractControl instanceof FormControl) {
      this.control = this.abstractControl;
    } else {
      throw new Error('El control no es un FormControl válido');
    }
    this.subscribeToFieldChanges();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  protected showErrorMessage() {
    this.errorMessage = this.formService.updateErrorMessage(this.control);
  }

  private subscribeToFieldChanges(): void {
    const eventsSub = this.control.events.subscribe(() => {
      console.log(this.label + " " + this.control.disabled);
      if (this.control.touched || this.control.dirty) {
        this.showErrorMessage();
      }
    })

    this.subscriptions.push(eventsSub);
  }
}

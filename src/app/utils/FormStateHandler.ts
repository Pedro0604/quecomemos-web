import {FormGroup} from '@angular/forms';

export abstract class FormStateHandler {
  private _error = false;
  private _loading = false;
  protected abstract form: FormGroup;

  private toggleFormState(): void {
    if (this._loading || this._error) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  set error(value: boolean) {
    this._error = value;
    this.toggleFormState();
  }

  set loading(value: boolean) {
    this._loading = value;
    this.toggleFormState();
  }

  get error(): boolean {
    return this._error;
  }

  get loading(): boolean {
    return this._loading;
  }
}

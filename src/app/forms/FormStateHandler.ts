import {FormGroup} from '@angular/forms';

export abstract class FormStateHandler {
  protected abstract form: FormGroup;

  private _error = false;

  get error(): boolean {
    return this._error;
  }

  set error(value: boolean) {
    this._error = value;
    this.toggleFormState();
  }

  private _loading = false;

  get loading(): boolean {
    return this._loading;
  }

  set loading(value: boolean) {
    this._loading = value;
    this.toggleFormState();
  }

  private toggleFormState(): void {
    if (this._loading || this._error) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }
}

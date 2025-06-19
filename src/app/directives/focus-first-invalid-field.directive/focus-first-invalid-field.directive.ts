import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  standalone: true,
  selector: 'form[focusFirstInvalidField]'
})
export class FocusFirstInvalidFieldDirective {

  constructor(private el: ElementRef) {
  }

  @HostListener('submit')
  public onSubmit(): void {
    const invalidElements = this.el.nativeElement.querySelectorAll('.ng-invalid');
    if (invalidElements.length > 0) {
      invalidElements[0].querySelector('input, select, mat-select, textarea')?.focus();
    }
  }
}

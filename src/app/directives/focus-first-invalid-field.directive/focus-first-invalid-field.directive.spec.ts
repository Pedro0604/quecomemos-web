import {FocusFirstInvalidFieldDirective} from './focus-first-invalid-field.directive';

describe('FormFocusDirective', () => {
  it('should create an instance', () => {
    // @ts-ignore
    const directive = new FocusFirstInvalidFieldDirective();
    expect(directive).toBeTruthy();
  });
});

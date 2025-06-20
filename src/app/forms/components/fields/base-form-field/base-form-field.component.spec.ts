import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BaseFormFieldComponent} from './base-form-field.component';

describe('BaseFormFieldComponent', () => {
  let component: BaseFormFieldComponent;
  let fixture: ComponentFixture<BaseFormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseFormFieldComponent]
    })
      .compileComponents();

    // @ts-ignore
    fixture = TestBed.createComponent(BaseFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

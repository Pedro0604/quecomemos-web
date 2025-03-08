import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormStateComponent } from './form-state.component';

describe('FormStateComponent', () => {
  let component: FormStateComponent;
  let fixture: ComponentFixture<FormStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormStateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

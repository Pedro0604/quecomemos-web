import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfirmWithPassword } from './dialog-confirm-with-password.component';

describe('DialogConfirmarComponent', () => {
  let component: DialogConfirmWithPassword;
  let fixture: ComponentFixture<DialogConfirmWithPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogConfirmWithPassword]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogConfirmWithPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

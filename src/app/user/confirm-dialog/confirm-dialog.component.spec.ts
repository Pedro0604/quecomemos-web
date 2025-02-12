import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfirmarComponent } from './confirm-dialog.component';

describe('DialogConfirmarComponent', () => {
  let component: DialogConfirmarComponent;
  let fixture: ComponentFixture<DialogConfirmarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogConfirmarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogConfirmarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

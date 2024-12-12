import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEliminarMenuComponent } from './dialog-eliminar-menu.component';

describe('DialogEliminarMenuComponent', () => {
  let component: DialogEliminarMenuComponent;
  let fixture: ComponentFixture<DialogEliminarMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogEliminarMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogEliminarMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

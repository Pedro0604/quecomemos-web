import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEliminarMenuDiarioComponent } from './dialog-eliminar-menu-diario.component';

describe('DialogEliminarMenuDiarioComponent', () => {
  let component: DialogEliminarMenuDiarioComponent;
  let fixture: ComponentFixture<DialogEliminarMenuDiarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogEliminarMenuDiarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogEliminarMenuDiarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

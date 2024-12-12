import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEliminarComidaComponent } from './dialog-eliminar-comida.component';

describe('DialogEliminarComidaComponent', () => {
  let component: DialogEliminarComidaComponent;
  let fixture: ComponentFixture<DialogEliminarComidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogEliminarComidaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogEliminarComidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DialogEliminarComponent} from './dialog-eliminar.component';

describe('DialogEliminarComponent', () => {
  // @ts-ignore
  let component: DialogEliminarComponent;
  // @ts-ignore
  let fixture: ComponentFixture<DialogEliminarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogEliminarComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DialogEliminarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

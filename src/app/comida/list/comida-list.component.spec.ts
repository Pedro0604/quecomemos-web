import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ComidaListComponent} from './comida-list.component';

describe('ComidaListComponent', () => {
  let component: ComidaListComponent;
  let fixture: ComponentFixture<ComidaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComidaListComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ComidaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

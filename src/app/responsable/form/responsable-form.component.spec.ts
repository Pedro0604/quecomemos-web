import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsableFormComponent } from './responsable-form.component';

describe('ResponsableFormComponent', () => {
  let component: ResponsableFormComponent;
  let fixture: ComponentFixture<ResponsableFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponsableFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponsableFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

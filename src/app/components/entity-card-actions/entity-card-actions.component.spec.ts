import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EntityCardActionsComponent} from './entity-card-actions.component';

describe('EntityCardActionsComponent', () => {
  let component: EntityCardActionsComponent;
  let fixture: ComponentFixture<EntityCardActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityCardActionsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EntityCardActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

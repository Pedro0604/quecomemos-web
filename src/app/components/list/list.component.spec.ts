import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ListComponent} from './list.component';

describe('ListComponent', () => {
  let component: ListComponent<any, any>;
  let fixture: ComponentFixture<ListComponent<any, any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

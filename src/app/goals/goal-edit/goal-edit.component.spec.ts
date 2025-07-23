import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalEditComponent } from './goal-edit.component';

describe('GoalEditComponent', () => {
  let component: GoalEditComponent;
  let fixture: ComponentFixture<GoalEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoalEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

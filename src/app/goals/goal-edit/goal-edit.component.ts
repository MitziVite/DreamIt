import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Goal } from '../goal.model';
import { GoalService } from '../goal.service';

@Component({
  selector: 'app-goal-edit',
  templateUrl: './goal-edit.component.html',
  styleUrls: ['./goal-edit.component.css'],
  standalone: false
})
export class GoalEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') goalForm!: NgForm;
  goal: Goal = {
    _id: '',
    title: '',
    description: '',
    dueDate: null,
    completed: false
  };
  editMode = false;
  loading = false;
  error: string | null = null;
  minDate: string;
  private destroy$ = new Subject<void>();

  constructor(
    private goalService: GoalService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Set minimum date to today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit() {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: Params) => {
        if (params['id']) {
          this.editMode = true;
          this.loading = true;
          this.goalService.getGoal(params['id'])
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (goal) => {
                this.goal = goal;
                this.loading = false;
              },
              error: (error) => {
                console.error('Error loading goal:', error);
                this.error = 'Failed to load goal. Please try again.';
                this.loading = false;
              }
            });
        }
      });
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.loading = true;
    const formValue = form.value;
    const updatedGoal: Goal = {
      ...this.goal,
      title: formValue.title,
      description: formValue.description,
      dueDate: formValue.dueDate ? new Date(formValue.dueDate) : null,
      completed: formValue.completed
    };

    const request = this.editMode ?
      this.goalService.updateGoal(this.goal, updatedGoal) :
      this.goalService.addGoal(updatedGoal);

    request
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/goals']);
        },
        error: (error) => {
          console.error('Error saving goal:', error);
          this.error = `Failed to ${this.editMode ? 'update' : 'create'} goal. Please try again.`;
          this.loading = false;
        }
      });
  }

  onCancel() {
    this.router.navigate(['/goals']);
  }

  onNavigateToGoals() {
    this.router.navigate(['/goals']);
  }

  onDelete() {
    if (!confirm('Are you sure you want to delete this goal?')) {
      return;
    }

    this.loading = true;
    this.goalService.deleteGoal(this.goal)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/goals']);
        },
        error: (error) => {
          console.error('Error deleting goal:', error);
          this.error = 'Failed to delete goal. Please try again.';
          this.loading = false;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
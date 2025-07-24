import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Goal } from '../goal.model';
import { GoalService } from '../goal.service';

@Component({
  selector: 'app-goal-detail',
  templateUrl: './goal-detail.component.html',
  styleUrls: ['./goal-detail.component.css'],
  standalone: false
})
export class GoalDetailComponent implements OnInit, OnDestroy {
  @Input() goal!: Goal;
  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Goal>();
  @Output() delete = new EventEmitter<Goal>();
  @Output() toggleComplete = new EventEmitter<Goal>();

  loading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private goalService: GoalService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}



  ngOnInit() {
  console.log('GoalDetailComponent initialized');
  this.activatedRoute.params
    .pipe(takeUntil(this.destroy$))
    .subscribe(params => {
      const id = params['id'];
      console.log('Route param id:', id);
      if (id) {
        this.loadGoal(id);
      }
    });
}

  private loadGoal(id: string) {
    console.log('Loading goal with id:', id);
    this.loading = true;
    this.goalService.getGoal(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (goal: Goal) => {
        console.log('Goal loaded:', goal);
        this.goal = goal;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading goal:', error);
        this.error = 'Failed to load goal';
        this.loading = false;
      }
    })
  }

  onEdit() {
    // this.edit.emit(this.goal);
    this.router.navigate(['/goals', this.goal._id, 'edit']);
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

  onToggleComplete() {
    const goal = this.goal;

    const originalGoal = { ...goal };
    const updatedGoal = { ...goal, completed: !goal.completed };
    
    // Optimistic update
    // console.log("Find goal", updatedGoal)
    // const index = this.goals.findIndex(g => g._id === goal._id);
    // if (index !== -1) {
      // console.log("Goal founded", this.goals[index])
      // this.goals[index] = updatedGoal;
    //}

    // Update selected goal if it's the one being toggled
    // if (this.selectedGoal?._id === goal._id) {
      // this.selectedGoal = updatedGoal;
    //}

    this.goalService.updateGoal(originalGoal, updatedGoal)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Success - UI already updated
        },
        error: (error) => {
          // Revert on error
          // if (index !== -1) {
            // this.goals[index] = originalGoal;
          // }
          // if (this.selectedGoal?._id === goal._id) {
            // this.selectedGoal = originalGoal;
          // }
          console.error('Error updating goal:', error);
          this.error = 'Failed to update goal. Please try again.';
        }
      });
  }

  onClose() {
    this.close.emit();
  }

  getFormattedDate(date: Date | null): string {
    if (!date) return 'No due date set';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getCompletionStatus(): string {
    return this.goal.completed ? 'Completed' : 'In Progress';
  }

  getStatusClass(): string {
    return this.goal.completed ? 'status-completed' : 'status-pending';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
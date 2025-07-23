import { Component, OnInit, OnDestroy } from '@angular/core';
import { Goal } from '../goal.model';
import { GoalService } from '../goal.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface GoalsResponse {
  goals: Goal[];
  message?: string;
}

@Component({
  selector: 'app-goal-list',
  templateUrl: './goal-list.component.html',
  styleUrls: ['./goal-list.component.css'],
  standalone: false
})
export class GoalListComponent implements OnInit, OnDestroy {
  goals: Goal[] = [];
  loading = false;
  error: string | null = null;
  searchTerm = '';
  private destroy$ = new Subject<void>();
  selectedGoal: Goal | null = null;

  constructor(
    private goalService: GoalService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadGoals();
  }

  onGoalClick(goal: Goal): void {
  console.log('Goal clicked:', goal);
  // Navigate to the goal detail route
  this.router.navigate(['/goals', goal._id]);
}
  
  loadGoals() {
  console.log('Loading goals...'); // Debug log
  this.loading = true;
  this.error = null;
  
  this.goalService.getGoals()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        console.log('Goals loaded:', response); // Debug log
        console.log('Goals array:', response.goals); // Debug log
        console.log('Goals length:', response.goals.length); // Debug log
        this.goals = response.goals;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading goals:', error);
        this.error = 'Failed to load goals. Please try again.';
        this.loading = false;
      }
    });
}
onGoalSelect(goal: Goal) {
  console.log('onGoalSelect called with goal:', goal); // Debug log

  // Deselect if clicking the same goal
  if (this.selectedGoal?._id === goal._id) {
    console.log('Deselecting goal - same goal clicked'); // Debug log
    this.selectedGoal = null;
    return;
  }

  console.log('Loading goal details...'); // Debug log
  this.loading = true;
  this.goalService.getGoal(goal._id)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (fullGoal) => {
        console.log('Goal details loaded:', fullGoal); // Debug log
        this.selectedGoal = fullGoal;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading goal details:', error);
        this.error = 'Failed to load goal details';
        this.loading = false;
      }
    });
}

  onCloseDetail() {
    this.selectedGoal = null;
  }

  onEditGoal(goal: Goal) {
    this.router.navigate(['/goals', goal._id, 'edit']);
  }

  search(value: string) {
    this.searchTerm = value;
  }

  retryLoading() {
    this.loadGoals();
  }

  onDeleteGoal(goal: Goal) {
    if (!confirm('Are you sure you want to delete this goal?')) {
      return;
    }

    this.loading = true;
    this.goalService.deleteGoal(goal)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.goals = this.goals.filter(g => g._id !== goal._id);
          if (this.selectedGoal?._id === goal._id) {
            this.selectedGoal = null;
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error deleting goal:', error);
          this.error = 'Failed to delete goal. Please try again.';
          this.loading = false;
        }
      });
  }

  onToggleComplete(goal: Goal) {
    const originalGoal = { ...goal };
    const updatedGoal = { ...goal, completed: !goal.completed };
    
    // Optimistic update
    const index = this.goals.findIndex(g => g._id === goal._id);
    if (index !== -1) {
      this.goals[index] = updatedGoal;
    }

    // Update selected goal if it's the one being toggled
    if (this.selectedGoal?._id === goal._id) {
      this.selectedGoal = updatedGoal;
    }

    this.goalService.updateGoal(originalGoal, updatedGoal)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Success - UI already updated
        },
        error: (error) => {
          // Revert on error
          if (index !== -1) {
            this.goals[index] = originalGoal;
          }
          if (this.selectedGoal?._id === goal._id) {
            this.selectedGoal = originalGoal;
          }
          console.error('Error updating goal:', error);
          this.error = 'Failed to update goal. Please try again.';
        }
      });
  }

  trackByGoalId(index: number, goal: Goal): string {
    return goal._id;
  }

  createNewGoal() {
    this.router.navigate(['/goals', 'new']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
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

  // ngOnInit() {
  //   // Only fetch goal if no input goal is provided (routing case)
  //   if (!this.goal) {
  //     this.loading = true;
  //     this.activatedRoute.params
  //       .pipe(takeUntil(this.destroy$))
  //       .subscribe(params => {
  //         const id = params['id'];
  //         if (!id) {
  //           this.error = 'No goal ID provided';
  //           this.router.navigate(['/goals']);
  //           return;
  //         }
          
  //         this.loadGoal(id);
  //       });
  //   }
  // }

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
    })}

  onEdit() {
    this.edit.emit(this.goal);
  }

  onDelete() {
    if (confirm(`Are you sure you want to delete "${this.goal.title}"?`)) {
      this.delete.emit(this.goal);
    }
  }

  onToggleComplete() {
    this.toggleComplete.emit(this.goal);
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
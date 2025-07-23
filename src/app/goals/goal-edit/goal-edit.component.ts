import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Goal } from '../goal.model';
import { GoalService } from '../goal.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-goal-edit',
  standalone: false,
  templateUrl: './goal-edit.component.html',
  styleUrl: './goal-edit.component.css'
})
export class GoalEditComponent implements OnInit, OnDestroy {
  originalGoal!: Goal;
  @Input() goal: Goal = new Goal('', '', '', null, false);
  editMode = false;
  id = '';
  loading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private goalService: GoalService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe((params: Params) => {
      const id = params['id'];
      if (!id) {
        this.editMode = false;
        return;
      }

      this.loading = true;
      this.goalService.getGoal(id).subscribe({
        next: (goal) => {
          if (!goal) {
            this.error = 'Goal not found';
            this.router.navigate(['/goals']);
            return;
          }

          this.editMode = true;
          this.originalGoal = { ...goal };  // Create a copy
          this.goal = new Goal(
            goal.id,
            goal.title,
            goal.description,
            goal.dueDate,
            goal.completed
          );
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error loading goal';
          console.error('Error fetching goal:', error);
          this.loading = false;
          this.router.navigate(['/goals']);
        }
      });
    });
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    const value = form.value;
    this.loading = true;
    
    if (this.editMode) {
      const updatedGoal = new Goal(
        this.originalGoal.id,
        value.title,
        value.description,
        value.dueDate,
        value.completed
      );

      this.goalService.updateGoal(this.originalGoal, updatedGoal).subscribe({
        next: (goal) => {
          console.log('Goal Updated:', goal);
          this.loading = false;
          this.router.navigateByUrl("/goals");
        },
        error: (error) => {
          this.error = 'Error updating goal';
          console.error('Error updating goal:', error);
          this.loading = false;
        }
      });
    } else {
      const newGoal = new Goal(
        '', 
        value.title,
        value.description,
        value.dueDate,
        value.completed
      );

      this.goalService.addGoal(newGoal).subscribe({
        next: (goal) => {
          console.log('New goal created:', goal);
          this.loading = false;
          this.router.navigateByUrl("/goals");
        },
        error: (error) => {
          this.error = 'Error creating goal';
          console.error('Error creating goal:', error);
          this.loading = false;
        }
      });
    }
  }

  onCancel() {
    this.router.navigateByUrl("/goals");
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
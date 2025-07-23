// import { Component, Input, OnInit } from '@angular/core';
// import { Goal } from '../goal.model';
// import { GoalService } from '../goal.service';
// import { ActivatedRoute, Router } from '@angular/router';

// @Component({
//   selector: 'app-goal-detail',
//   standalone: false,
//   templateUrl: './goal-detail.component.html',
//   styleUrls: ['./goal-detail.component.css']
// })
// export class GoalDetailComponent implements OnInit {
//   @Input() goal!: Goal;

//   constructor(
//     private goalService: GoalService,
//     private router: Router,
//     private activatedRoute: ActivatedRoute
//   ) {}

//   ngOnInit() {
//     this.activatedRoute.params.subscribe(params => {
//       const id = params['id'];
//       const goal = this.goalService.getGoal(id);
//       if (goal) {
//         this.goal = goal;
//       } else {
//         console.error('Goal not found');
//         this.router.navigate(['/goals']);
//       }
//     });
//   }
// }


import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Goal } from '../goal.model';
import { GoalService } from '../goal.service';

@Component({
  selector: 'app-goal-detail',
  standalone: false,
  templateUrl: './goal-detail.component.html',
  styleUrls: ['./goal-detail.component.css']
})
export class GoalDetailComponent implements OnInit, OnDestroy {
  @Input() goal!: Goal;
  loading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private goalService: GoalService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loading = true;
    this.activatedRoute.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const id = params['id'];
      
      this.goalService.getGoal(id).subscribe({
        next: (goal: Goal) => {
          if (goal) {
            this.goal = goal;
          } else {
            this.error = 'Goal not found';
            this.router.navigate(['/goals']);
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching goal:', error);
          this.error = 'Failed to load goal';
          this.loading = false;
          this.router.navigate(['/goals']);
        }
      });
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
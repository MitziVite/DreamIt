// // import { Component } from '@angular/core';

// // @Component({
// //   selector: 'app-goal-list',
// //   imports: [],
// //   templateUrl: './goal-list.component.html',
// //   styleUrl: './goal-list.component.css'
// // })
// // export class GoalListComponent {

// // }


// import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
// import { Goal } from '../goal.model';
// import { GoalService } from '../goal.service';
// import { Subscription } from 'rxjs';

// @Component({
//   selector: 'app-goal-list',
//   standalone: false,
//   templateUrl: './goal-list.component.html',
//   styleUrl: './goal-list.component.css'
// })
// export class GoalListComponent implements OnInit, OnDestroy {
//   // subject: Subscription;
//   subject: Subscription = new Subscription();
//   goals: Goal[] = [];
//   term: string = '';

//   constructor(private goalService: GoalService) {
//     this.goalService.goalSelectedEvent
//    }
//   // ngOnInit() {
//   //   this.subject = this.goalService.getGoals().subscribe(response => {
//   //     this.goals = response.goals;
//   //   });
//     // this.subject.add(
//     //   this.goalService.documentListChangedEvent.subscribe(contactList => {
//     //     this.contacts = contactList;
//     //   })
//     // );
//   // }
//   ngOnInit() {
//     this.subject = this.goalService.getGoals().subscribe({
//       next: (response) => {
//         this.goals = response.goals;
//         console.log('Goals loaded:', this.goals);
//       },
//       error: (error) => {
//         console.error('Error loading goals:', error);
//       }
//     });
// }
//   onSelected(goal: Goal){
//     this.goalService.goalSelectedEvent.emit(goal);

//   }
//   ngOnDestroy(){
//     this.subject?.unsubscribe()
//   }

//   search(value: string){
//     this.term = value;
//   }
// }

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Goal } from '../goal.model';
import { GoalService } from '../goal.service';
import { Subscription } from 'rxjs';

 @Component({
  selector: 'app-goal-list',

  templateUrl: './goal-list.component.html',
 styleUrl: './goal-list.component.css',
  standalone: false
})
export class GoalListComponent implements OnInit, OnDestroy {
  goals: Goal[] = [];
  term: string = '';
  private subscription: Subscription = new Subscription();

  constructor(private goalService: GoalService) {}
ngOnInit() {
    // Log to verify component initialization
    console.log('GoalListComponent initialized');
    
    this.subscription = this.goalService.getGoals().subscribe({
      next: (response: any) => {
        console.log('Response from server:', response);
        this.goals = response.goals;
        console.log('Goals loaded:', this.goals);
      },
      error: (error) => {
        console.error('Error fetching goals:', error);
      }
    });
  }

  onSelected(goal: Goal) {
    this.goalService.goalSelectedEvent.emit(goal);
  }

  search(value: string) {
    this.term = value;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { GoalService } from './goal.service';
import { Goal } from './goal.model';

@Component({
  selector: 'app-goals',
  standalone: false,
  templateUrl: './goals.component.html',
  styleUrl: './goals.component.css'
})
export class GoalsComponent implements OnInit {
  selectedGoal: Goal = new Goal('', '', '', null, false);

  constructor(private goalService: GoalService) {}
  
  ngOnInit() {
    this.goalService.goalSelectedEvent.subscribe(
      (goal: Goal) => {
        this.selectedGoal = goal;
      }
    );
  }
}
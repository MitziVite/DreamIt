import { Component, Input, OnInit } from '@angular/core';
import { Goal } from '../goal.model';

@Component({
  selector: 'app-goal-item',
  standalone: false,
  templateUrl: './goal-item.component.html',
  styleUrl: './goal-item.component.css'
})
export class GoalItemComponent implements OnInit {
  @Input() goal!: Goal;
  
  constructor() {}
  ngOnInit() {}
}
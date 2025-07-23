import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Goal } from '../goal.model';

@Component({
  selector: 'app-goal-item',
  templateUrl: './goal-item.component.html',
  styleUrls: ['./goal-item.component.css'],
  standalone: false
})
export class GoalItemComponent {
  @Input() goal!: Goal;
  @Input() selected: boolean = false; 
  @Output() deleteGoal = new EventEmitter<Goal>();
  @Output() toggleComplete = new EventEmitter<Goal>();
  @Output() select = new EventEmitter<Goal>();

  onSelect() {
    this.select.emit(this.goal);
  }

  onDelete() {
    this.deleteGoal.emit(this.goal);
  }

  onToggleComplete() {
    this.toggleComplete.emit(this.goal);
  }
}
import { Pipe, PipeTransform } from '@angular/core';
import { Goal } from './goal.model';

@Pipe({
  name: 'goalsFilter',
  standalone: false
})
export class GoalsFilterPipe implements PipeTransform {
transform(goals: Goal[], term: string): Goal[] {
   let filteredGoals: Goal[] =[];  
   if (term && term.length > 0) {
      filteredGoals = goals.filter(
         (goal:Goal) => goal.title.toLowerCase().includes(term.toLowerCase())
      );
   }
   if (filteredGoals.length < 1){
      return goals;
   }
   return filteredGoals;
}
}

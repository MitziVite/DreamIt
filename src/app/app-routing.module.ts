
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoalsComponent } from './goals/goals.component';
import { GoalEditComponent } from './goals/goal-edit/goal-edit.component';
import { GoalDetailComponent } from './goals/goal-detail/goal-detail.component';

const routes: Routes = [
    {path: '', redirectTo: '/goals', pathMatch: 'full'},
    { path: 'goals', component: GoalsComponent,
      children: [
        { path: 'new', component: GoalEditComponent },
        { path: ':id', component: GoalDetailComponent },
        { path: ':id/edit', component: GoalEditComponent }
      ]
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
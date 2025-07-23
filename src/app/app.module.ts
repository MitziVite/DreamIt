import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { GoalDetailComponent } from './goals/goal-detail/goal-detail.component';
import { GoalsComponent } from './goals/goals.component';
import { GoalEditComponent } from './goals/goal-edit/goal-edit.component';
import { GoalItemComponent } from './goals/goal-item/goal-item.component';
import { GoalListComponent } from './goals/goal-list/goal-list.component';
import { GoalsFilterPipe } from './goals/goals-filter.pipe';
// import { GoalsModule } from './goals/goals.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    GoalDetailComponent,
    GoalsFilterPipe,
    GoalsComponent,
    GoalEditComponent,
    GoalItemComponent,
    GoalListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    DragDropModule,
    // GoalsModule,
    RouterModule.forRoot([])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
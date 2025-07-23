import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { GoalDetailComponent } from './goals/goal-detail/goal-detail.component';
import { GoalsComponent } from './goals/goals.component';
import { GoalEditComponent } from './goals/goal-edit/goal-edit.component';
import { GoalItemComponent } from './goals/goal-item/goal-item.component';
import { GoalListComponent } from './goals/goal-list/goal-list.component';
import { GoalsFilterPipe } from './goals/goals-filter.pipe';

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
    AppRoutingModule,  // This already includes RouterModule.forRoot()
    CommonModule,
    FormsModule,
    HttpClientModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
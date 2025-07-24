import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Observable, throwError } from 'rxjs';
import { map, catchError, tap, finalize } from 'rxjs/operators';
import { Goal } from './goal.model';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  goalChangedEvent = new EventEmitter<Goal[]>();
  goalSelectedEvent = new EventEmitter<Goal>();
  goalListChangedEvent = new Subject<Goal[]>();
  private goals: Goal[] = [];
  private baseUrl = 'http://localhost:3000/goals';

  constructor(private http: HttpClient) {}

//   getGoals(): Observable<{ message: string, goals: Goal[] }> {
//     return this.http.get<{ message: string, goals: Goal[] }>(this.baseUrl)
//       .pipe(
//         tap(response => {
//           this.goals = response.goals;
//           this.sortAndSend();
//         }),
//         catchError(error => {
//           console.error('Error fetching goals:', error);
//           return throwError(() => error);
//         })
//       );
//   }

getGoals() {
    return this.http.get<{ message: string, goals: Goal[] }>('http://localhost:3000/goals');
  }




// getGoals(): Observable<{ message: string, goals: Goal[] }> {
//     console.group('Goals Service - getGoals()');
//     console.log('📍 Request URL:', this.baseUrl);
    
//     return this.http.get<{ message: string, goals: Goal[] }>(this.baseUrl)
//       .pipe(
//         tap(response => {
//           console.group('📥 Server Response');
//           console.log('Message:', response.message);
//           console.log('Goals Count:', response.goals?.length);
//           console.table(response.goals); // Shows goals in table format
//           console.groupEnd();
          
//           this.goals = response.goals;
//           this.sortAndSend();
//         }),
//         catchError(error => {
//           console.group('❌ Error Details');
//           console.error('Status:', error.status);
//           console.error('Message:', error.message);
//           console.error('Full Error:', error);
//           console.groupEnd();
//           return throwError(() => error);
//         }),
//         finalize(() => {
//           console.groupEnd();
//         })
//       );
// }

  // getGoal(id: string): Observable<Goal> {
  //   return this.http.get<Goal>(`${this.baseUrl}/${id}`).pipe(
  //     catchError(error => {
  //       console.error('Error fetching goal:', error);
  //       return throwError(() => error);
  //     })
  //   );
  // }

  getGoal(id: string): Observable<Goal> {
    return this.http.get<Goal>(`${this.baseUrl}/${id}`).pipe(
      catchError((error: any) => {
        console.error('Error fetching goal:', error);
        return throwError(() => error);
      })
    );
  }


  addGoal(goal: Goal): Observable<Goal> {
    if (!goal) {
      return throwError(() => new Error('Invalid goal data'));
    }

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post<{ message: string, goal: Goal }>(
      this.baseUrl,
      goal,
      { headers }
    ).pipe(
      tap(response => {
        this.goals.push(response.goal);
        this.sortAndSend();
      }),
      map(response => response.goal),
      catchError(error => {
        console.error('Error adding goal:', error);
        return throwError(() => error);
      })
    );
  }

  updateGoal(originalGoal: Goal, newGoal: Goal): Observable<Goal> {
    console.log("Previus", originalGoal);
    console.log("New", newGoal);
    if (!originalGoal || !newGoal) {
      return throwError(() => new Error('Invalid goal data'));
    }

    console.log("Searching in goals", this.goals)
    // const pos = this.goals.findIndex(d => d._id === originalGoal._id);
    // console.log(pos)
    // if (pos < 0) {
    //  return throwError(() => new Error('Goal not found'));
    //}

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.put<Goal>(
      `${this.baseUrl}/${originalGoal._id}`,
      newGoal,
      { headers }
    ).pipe(
      tap(updatedGoal => {
        //this.goals[pos] = updatedGoal;
        this.sortAndSend();
      }),
      catchError(error => {
        console.error('Error updating goal:', error);
        return throwError(() => error);
      })
    );
  }

  // deleteGoal(goal: Goal): Observable<void> {
  //   if (!goal) {
  //     return throwError(() => new Error('Invalid goal data'));
  //   }

  //   const pos = this.goals.findIndex(d => d.id === goal.id);
  //   if (pos < 0) {
  //     return throwError(() => new Error('Goal not found'));
  //   }

  //   return this.http.delete<void>(`${this.baseUrl}/${goal.id}`).pipe(
  //     tap(() => {
  //       this.goals.splice(pos, 1);
  //       this.sortAndSend();
  //     }),
  //     catchError(error => {
  //       console.error('Error deleting goal:', error);
  //       return throwError(() => error);
  //     })
  //   );
  // }
  deleteGoal(goal: Goal): Observable<void> {
  if (!goal || !goal._id) {
    return throwError(() => new Error('Invalid goal'));
  }

  return this.http.delete<void>(`${this.baseUrl}/${goal._id}`).pipe(
    catchError(error => {
      console.error('Error deleting goal:', error);
      return throwError(() => error);
    })
  );
}

  private sortAndSend(): void {
    this.goals.sort((a, b) => {
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
      return 0;
    });
    this.goalListChangedEvent.next([...this.goals]);
  }
}
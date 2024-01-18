import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private homeComponentDataSubject = new BehaviorSubject<any>(null);
  homeComponentData$ = this.homeComponentDataSubject.asObservable();

  private questionsPartAComponentDataSubject = new BehaviorSubject<any>(null);
  questionsPartAComponentData$ = this.questionsPartAComponentDataSubject.asObservable();

  setHomeComponentData(data: any) {
    this.homeComponentDataSubject.next(data);
  }

  setQuestionsPartAComponentData(data: any) {
    this.questionsPartAComponentDataSubject.next(data);
  }
}

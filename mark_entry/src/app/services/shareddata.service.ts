import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private homeComponentDataSubject = new BehaviorSubject<any>(null);
  homeComponentData$ = this.homeComponentDataSubject.asObservable();

  private questionsPartAComponentDataSubject = new BehaviorSubject<any>(null);
  questionsPartAComponentData$ = this.questionsPartAComponentDataSubject.asObservable();

  private selectedAssessmentSubject = new BehaviorSubject<any>(null);
  selectedAssessment$ = this.selectedAssessmentSubject.asObservable();

  setHomeComponentData(data: any) {
    this.homeComponentDataSubject.next(data);
  }
  setQuestionsPartAComponentData(data: any) {
    this.questionsPartAComponentDataSubject.next(data);
  }
  setSelectedAssessment(assessment: any) {
    this.selectedAssessmentSubject.next(assessment);
  }
  getSelectedAssessment(): Observable<any> {
    return this.selectedAssessment$;
  }
  
}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsPartAComponent } from './questions-part-a.component';

describe('QuestionsPartAComponent', () => {
  let component: QuestionsPartAComponent;
  let fixture: ComponentFixture<QuestionsPartAComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionsPartAComponent]
    });
    fixture = TestBed.createComponent(QuestionsPartAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

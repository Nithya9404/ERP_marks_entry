import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsPartBComponent } from './questions-part-b.component';

describe('QuestionsPartBComponent', () => {
  let component: QuestionsPartBComponent;
  let fixture: ComponentFixture<QuestionsPartBComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionsPartBComponent]
    });
    fixture = TestBed.createComponent(QuestionsPartBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

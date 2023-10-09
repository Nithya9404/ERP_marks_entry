import { Component,EventEmitter,Input,Output } from '@angular/core';

@Component({
  selector: 'app-question-input',
  templateUrl: './question-input.component.html',
  styleUrls: ['./question-input.component.css']
})
export class QuestionInputComponent {
  @Input() initialValue: number=0;
  checkValue(value: number) {
    if (value > 2) {
      alert('Mark should be less than 2');
    }
  }
}

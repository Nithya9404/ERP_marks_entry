import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { RegisterService } from 'src/app/services/register.service';
import { SharedDataService } from 'src/app/services/shareddata.service';

@Component({
  selector: 'app-questions-part-a',
  templateUrl: './questions-part-a.component.html',
  styleUrls: ['./questions-part-a.component.css'],
})
export class QuestionsPartAComponent implements OnInit {
  questionAnswers: { register: string; marks: number; q: number[] }[] = [];
  activeCell: { i: number; j: number } | null = null;
  registerNumbers: string[] = [];

  constructor(
    private router: Router,
    private dataService: DataService,
    private registerService: RegisterService,
    private sharedDataService: SharedDataService
  ) {}

  ngOnInit() {
    this.loadRegisterNumbers();
  }

  private loadRegisterNumbers() {
    // Call the RegisterService to get register numbers
    this.registerService.getRegisterNumbers().subscribe(
      (registerNumbers: string[]) => {
        this.registerNumbers = registerNumbers;

        // Initialize questionAnswers based on registerNumbers
        this.questionAnswers = this.registerNumbers.map((register) => ({
          register,
          marks: 0,
          q: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        }));
      },
      (error) => {
        console.error('Error fetching register numbers:', error);
      }
    );
  }

  checkValue(value: number) {
    if (value > 2) {
      alert('Mark should be less than 2');
    }
  }

  setActiveCell(i: number, j: number) {
    this.activeCell = { i, j };
  }

  clearActiveCell() {
    this.activeCell = null;
  }

  redirectToQuestionPartB() {
    const postData = this.questionAnswers.map((item) => {
      return { q: item.q };
    });

    // Set data in the shared service
    this.sharedDataService.setQuestionsPartAComponentData({
      questionAnswers: postData,
    });

    // Optionally, navigate to the next page
    this.router.navigate(['/questions_part_B']);
  }
}

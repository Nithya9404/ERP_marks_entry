import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-questions-part-a',
  templateUrl: './questions-part-a.component.html',
  styleUrls: ['./questions-part-a.component.css']
})
export class QuestionsPartAComponent {
  questionAnswers: { register: string, marks: number, q: number[] }[] = [];
  activeCell: { i: number, j: number } | null = null;
  dataToInsert: any = {};

  constructor(private router: Router, private http: HttpClient,private dataService: DataService) {
    for (let i = 0; i < 10; i++) {
      this.questionAnswers.push({ register: `R${i + 1}`, marks: 0, q: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] });
    }
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
    this.http.post('http://localhost:3000/api/insert', postData).subscribe(
      (response: any) => {
        console.log('Data inserted successfully', response);
        this.router.navigate(['/questions_part_B']);
      },
      (error) => {
        console.error('Error inserting data:', error);
      }
    );
  }
  }


import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RegisterService } from 'src/app/services/register.service';

@Component({
  selector: 'app-questions-part-b',
  templateUrl: './questions-part-b.component.html',
  styleUrls: ['./questions-part-b.component.css']
})
export class QuestionsPartBComponent implements OnInit {
  questionAnswers: { register: string, marks: number, q: number[] }[] = [];

  constructor(private router: Router, private http: HttpClient, private registerService: RegisterService) {}

  ngOnInit() {
    this.registerService.getRegisterNumbers().subscribe(
      (registerNumbers: string[]) => {
        for (let i = 0; i < registerNumbers.length; i++) {
          this.questionAnswers.push({ register: registerNumbers[i], marks: 0, q: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] });
        }
      },
      (error) => {
        console.error('Error fetching register numbers:', error);
      }
    );
  }

  checkValue(value: number) {
    if (value > 16) {
      alert('Mark should be less than 16');
    }
  }

  sendtoDatabase() {
    const postData = this.questionAnswers.map((item) => {
      return { q: item.q };
    });

    this.http.post('http://localhost:4000/api/insertData', postData).subscribe(
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

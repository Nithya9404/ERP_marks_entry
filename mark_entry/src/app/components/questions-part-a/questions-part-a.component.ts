import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-questions-part-a',
  templateUrl: './questions-part-a.component.html',
  styleUrls: ['./questions-part-a.component.css']
})
export class QuestionsPartAComponent {
  questionAnswers: { register: string, marks: number, q: number[] }[] = [];

  constructor(private router: Router, private http: HttpClient) {
    // Initialize the questionAnswers array with empty objects
    for (let i = 0; i < 10; i++) {
      this.questionAnswers.push({ register: `R${i + 1}`, marks: 0, q: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] });
    }
  }

  checkValue(value: number) {
    if (value > 2) {
      alert('Mark should be less than 2');
    }
  }

  redirectToQuestionPartB() {
    // Assuming you have collected the questionAnswers data and want to send it to the server
    const postData = this.questionAnswers.map((item) => {
      return { q: item.q };
    });

    // Make an HTTP POST request to your Express.js server
    this.http.post('http://localhost:3000/api/insertData', postData).subscribe(
      (response: any) => { // Use 'any' type for response since the server response format may vary
        console.log('Data inserted successfully', response);
        
        // Assuming you want to navigate to the next component after a successful response
        this.router.navigate(['/questions_part_B']);
      },
      (error) => {
        console.error('Error inserting data:', error);
      }
    );
  }
}
  
}

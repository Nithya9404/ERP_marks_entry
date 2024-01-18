import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RegisterService } from 'src/app/services/register.service';
import { SharedDataService } from 'src/app/services/shareddata.service';

@Component({
  selector: 'app-questions-part-b',
  templateUrl: './questions-part-b.component.html',
  styleUrls: ['./questions-part-b.component.css']
})
export class QuestionsPartBComponent implements OnInit {
  questionAnswers: { register: string, marks: number, q: number[] }[] = [];
  homeComponentData: any;
  questionsPartAComponentData: any;

  constructor(
    private router: Router,
    private http: HttpClient,
    private registerService: RegisterService,
    private sharedDataService: SharedDataService
  ) {}

  ngOnInit() {
    this.initializeData();
  }

  private initializeData() {
    // Retrieve data from the shared service
    this.sharedDataService.questionsPartAComponentData$.subscribe((data) => {
      this.questionsPartAComponentData = data;
    });

    this.sharedDataService.homeComponentData$.subscribe((data) => {
      this.homeComponentData = data;
    });

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

  sendToApis() {
    const postData = this.questionAnswers.map((item) => {
      return { q: item.q };
    });

    // Call the single function to send data to all three APIs
    this.sendInsertCombinedData(postData);
  }

  sendInsertCombinedData(data: { q: number[] }[]) {
    // Separate data for /api/insert and /api/insertData
    const insertData = {
      homeData: this.homeComponentData,
      questionsPartAData: this.questionsPartAComponentData,
    };
  
    // Prepare data for /api/insert and /api/insertData
    const combinedInsertData = {
      ...insertData,
      partBData: data.map((item: { q: number[] }) => ({ q: item.q })),
    };
  
    // Log the combinedInsertData to check its structure
    console.log('Combined Insert Data:', combinedInsertData);
  
    // API endpoint for /api/insertCombined
    this.http.post('http://localhost:3002/api/insertCombined', combinedInsertData)
      .subscribe(
        (response: any) => {
          console.log('Data inserted successfully for /api/insertCombined', response);
          // Optionally, navigate to another page or perform other actions
        },
        (error: any) => {
          console.error('Error inserting data for /api/insertCombined:', error);
        }
      );
  }
  
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  inputRows: { placeholder: string }[][] = [];
  facultyId: string | null = null;
  batch: string='';
  courseCodes: string[] = [];

  constructor(private router: Router, private dataService: DataService,private authService: AuthService) {}

  ngOnInit(): void {
    const placeholders = [
      'Department',
      'Batch',
      'Semester',
      'Faculty Id',
      'Course Code',
      'Course title',
    ];

    const totalInputs = placeholders.length;
    const inputsPerRow = 3;
    const rowCount = Math.ceil(totalInputs / inputsPerRow);

    for (let i = 0; i < rowCount; i++) {
      const row: { placeholder: string }[] = [];
      for (let j = 0; j < inputsPerRow; j++) {
        const inputIndex = i * inputsPerRow + j;
        if (inputIndex < totalInputs) {
          row.push({ placeholder: placeholders[inputIndex] }); 
        }
      }
      this.inputRows.push(row);
    }
    
    this.facultyId = this.authService.getFacultyId();
    console.log('Id',this.facultyId);

    // Check if facultyId is available before making the request
    if (this.facultyId) {
      this.dataService.getFacultyData(this.facultyId).subscribe((data: any) => {
        this.batch = data.batch;
        this.courseCodes = data.courseCodes;
        
        console.log('Batch:',this.batch);
        console.log('Course codes: ',this.courseCodes);
      });
    }
  }

  redirectToQuestiontype() {
    this.router.navigate(['/question_type']);
  }
}
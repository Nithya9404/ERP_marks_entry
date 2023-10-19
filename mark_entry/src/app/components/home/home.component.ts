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
  batch: string | null = null; 
  courseCodes: string[] = [];
  allBatchesEqual: boolean = false;
  deptcode: string | null = null;
  department:string | null = null;

  constructor(private router: Router, private dataService: DataService, private authService: AuthService) {}

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
    console.log('Id', this.facultyId);

    if (this.facultyId) {
      this.dataService.getFacultyData(this.facultyId).subscribe((data: any) => {
        this.courseCodes = data.courseCodes;
        
        const batches = data.batch;
        this.allBatchesEqual = batches.every((batch: any) => batch === batches[0]);
        
        if (this.allBatchesEqual) {
          this.batch = batches[0] || '';  
        } else {
          this.batch = '';
        }
        console.log('Batch:', this.batch);
        console.log('Course codes: ', this.courseCodes);
        this.deptcode = data.deptcode;
        if (this.deptcode) {
          this.dataService.getDepartment(this.deptcode[0]).subscribe((departmentData: any) => {
            this.department = departmentData.department;
            console.log('Department: ',this.department);
          });
        }
      });
    }
  }
  getUniqueBatches(): string[] {
    // Ensure that batch is not null before proceeding
    if (this.batch) {
      return Array.from(new Set(this.batch.split(',')));
    }
    return [];
  }


  redirectToQuestiontype() {
    this.router.navigate(['/question_type']);
  }
}

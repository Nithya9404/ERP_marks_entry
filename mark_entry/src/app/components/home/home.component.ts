import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';
import { SharedDataService } from 'src/app/services/shareddata.service';

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
  department: string | null = null;
  course: { course_title: string } = { course_title: '' };
  degreeCode: string | null = null;
  selectedCourseCode: string[] = [];
  semester: string[] = ['1', '2', '3', '4', '5', '6', '7', '8'];
  selectedSemester: string | null = null;
  regulation: string | null = null;

  // New properties to store data
  homeData: any;
  selectedAssessment: string | null = null;

  // New property to track whether data is loaded
  isDataLoaded: boolean = false;

  constructor(
    private router: Router,
    private dataService: DataService,
    private authService: AuthService,
    private sharedDataService: SharedDataService
  ) {}

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

    if (this.facultyId) {
      this.dataService.getFacultyData(this.facultyId).subscribe((data: any) => {
        this.courseCodes = data.courseCodes;
        this.degreeCode = data.degreeCode;
        this.regulation = data.regulation;
        this.deptcode = data.dept_code;

        const batches = data.batch;
        this.allBatchesEqual = batches.every((batch: any) => batch === batches[0]);

        if (this.allBatchesEqual) {
          this.batch = batches[0] || '';  
        } else {
          this.batch = '';
        }

        this.deptcode = data.deptcode;
        if (this.deptcode) {
          this.dataService.getDepartment(this.deptcode[0]).subscribe((departmentData: any) => {
            this.department = departmentData.department;
          });
        }

        if (this.courseCodes) {
          this.dataService.getCourse(this.courseCodes).subscribe((courseData: any) => {
            this.course = courseData[0];
          });
        } 

        // Set data in the shared service
        this.homeData = {
          batch: this.batch,
          semester: this.selectedSemester,
          courseCode: this.selectedCourseCode,
          degreeCode: this.degreeCode,
          deptcode: this.deptcode,
          regulation: this.regulation,
          facultyId: this.facultyId,
          selectedAssessment: this.selectedAssessment,
        };

        this.sharedDataService.setHomeComponentData(this.homeData);

        // Subscribe to selectedAssessment$ and update selectedAssessment
        this.sharedDataService.getSelectedAssessment().subscribe((selectedAssessment: any) => {
          this.selectedAssessment = selectedAssessment;
          this.homeData = {
            ...this.homeData,
            selectedAssessment: selectedAssessment,
          };

          // Ensure that other properties are set before updating shared data
          this.sharedDataService.setHomeComponentData(this.homeData);

          // Additional check to mark data as loaded
          this.isDataLoaded = true;
        });
      });
    }
  }

  getUniqueBatches(): string[] {
    if (this.batch) {
      return Array.from(new Set(this.batch.split(',')));
    }
    return [];
  }

  onCourseCodeChange(courseCode: string) {
    this.selectedCourseCode = [courseCode];
    this.dataService.getCourse(this.selectedCourseCode).subscribe((courseData: any[]) => {
      this.course = courseData[0];
  
      // Update shared data
      this.homeData = {
        batch: this.batch,
        semester: this.selectedSemester,
        courseCode: this.selectedCourseCode,
        degreeCode: this.degreeCode,
        deptcode: this.deptcode,
        regulation: this.regulation,
        facultyId: this.facultyId,
        selectedAssessment: this.selectedAssessment,
      };
  
      this.sharedDataService.setHomeComponentData(this.homeData);
    });
  }

  onSemesterChange() {
    // Update shared data
    this.homeData = {
      batch: this.batch,
      semester: this.selectedSemester,
      courseCode: this.selectedCourseCode,
      degreeCode: this.degreeCode,
      deptcode: this.deptcode,
      regulation: this.regulation,
      facultyId: this.facultyId,
      selectedAssessment: this.selectedAssessment,
    };
  
    this.sharedDataService.setHomeComponentData(this.homeData);
  }

  // Example method to check if data is loaded before proceeding
  redirectToQuestiontype() {
    if (this.isDataLoaded) {
      this.router.navigate(['/questions_part_A']);
    } else {
      // Handle the case where data is not loaded yet
      console.warn('Data is not loaded yet. Please wait.');
    }
  }

  // Method to handle assessment selection
  onAssessmentSelected(assessment: any) {
    this.sharedDataService.setSelectedAssessment(assessment);
  }
}

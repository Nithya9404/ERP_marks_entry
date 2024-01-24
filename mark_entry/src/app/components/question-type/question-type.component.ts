import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { SharedDataService } from 'src/app/services/shareddata.service';

@Component({
  selector: 'app-question-type',
  templateUrl: './question-type.component.html',
  styleUrls: ['./question-type.component.css']
})
export class QuestionTypeComponent implements OnInit {
  dropdownData: any[] = [];
  selectedAssessment: any = '';

  constructor(
    private dataService: DataService,
    private sharedDataService: SharedDataService
  ) {}

  ngOnInit() {
    this.dataService.getDropDowndata().subscribe((data: any) => {
      this.dropdownData = data;
      console.log('Dropdown Data:', this.dropdownData);
    });
  }

  onAssessmentSelected() {
    console.log("Selected assessment (before): ", this.selectedAssessment);
    this.sharedDataService.setSelectedAssessment(this.selectedAssessment);
    console.log("Selected assessment (after): ", this.selectedAssessment);
  }
  
}

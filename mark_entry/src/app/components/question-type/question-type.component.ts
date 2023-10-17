import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-question-type',
  templateUrl: './question-type.component.html',
  styleUrls: ['./question-type.component.css']
})
export class QuestionTypeComponent implements OnInit{
  dropdownData: any[]=[];

  constructor(private dataService:DataService){}

  ngOnInit() {
    this.dataService.getDropDowndata().subscribe((data: any)=>{
        this.dropdownData = data;
        console.log('Dropdown Data:',this.dropdownData);
    });
  }

}

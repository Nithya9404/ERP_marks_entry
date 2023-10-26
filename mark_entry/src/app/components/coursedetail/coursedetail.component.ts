import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-coursedetail',
  templateUrl: './coursedetail.component.html',
  styleUrls: ['./coursedetail.component.css']
})
export class CoursedetailComponent {
  courseCodes: string[]=[]; // Change to an array
  courseDetails: any[]=[]; // Define the type based on the expected data structure
  
  constructor (private route: ActivatedRoute,private dataService:DataService) {}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.courseCodes = params['courseCodes'].split(','); // Split course codes into an array
  
      // Fetch course details based on the course codes
      this.dataService.getCourse(this.courseCodes).subscribe((data: any[]) => {
        this.courseDetails = data; // Assuming the data structure returned by your service
      });
    });
  }
}

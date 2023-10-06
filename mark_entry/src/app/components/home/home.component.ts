import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  inputRows: { placeholder: string }[][] = [];
  constructor(private router: Router) {}

  ngOnInit(): void {
    const placeholders = [
      'Department',
      'Batch',
      'Year',
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
  }

  redirectToQuestionPartA(){
    this.router.navigate(['/questions_part_A']);
  }
}

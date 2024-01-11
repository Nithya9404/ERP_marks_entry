import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http:HttpClient) { }

  getDropDowndata(){
    return this.http.get('http://localhost:3002/dropdown-data');
  }

  getFacultyData(facultyId: string) {
    const url = `http://localhost:3002/getCourseCodes/${facultyId}`;
    console.log('URL:', url);
    return this.http.get(url);
  }
  getDepartment(deptcode:string) {
    const url = `http://localhost:3002/department/${deptcode}`;
    console.log('Url: ',url);
    return this.http.get(url);
  }
  getCourse(courseCodes: string[]): Observable<any> {
    if (courseCodes.length === 0) {
      return of([]);
    }
  
    const courseCodesParam = courseCodes.join(','); 
    const url = `http://localhost:3002/course_title/${courseCodesParam}`;
    console.log('Url: ', url);
    return this.http.get(url);
  }
  insertData(dataToInsert: any) {
    const url = 'http://localhost:3002/api/insertData';
    return this.http.post(url, dataToInsert);
  }
}

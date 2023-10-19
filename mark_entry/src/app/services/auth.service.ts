import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = 'http://localhost:3002/authenticate';
  private facultyId: string | null = null;

  constructor(private http: HttpClient) {}

  authenticate(username: string, password: string): Observable<{
    success: boolean;
    faculty_id: string | null;
    message: string;
  }> {
    const credentials = { username, password };
    return this.http.post<{
      success: boolean;
      faculty_id: string;
      message: string;
    }>(this.authUrl, credentials).pipe(
      map((response) => {
        console.log('Authentication Response:', response);
        if (response.success) {
          this.facultyId = response.faculty_id; 
          console.log('Faculty ID set in AuthService:', this.facultyId);
        }
        return response;
      })
    );
  }

  setFacultyId(facultyId: string) {
    this.facultyId = facultyId;
  }

  getFacultyId(): string | null {
    return this.facultyId;
  }
}

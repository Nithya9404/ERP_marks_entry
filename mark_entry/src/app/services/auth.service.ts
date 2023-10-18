import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = 'http://localhost:3002/authenticate';

  constructor(private http:HttpClient) { }
  authenticate(username: string,password:string): Observable<{success:boolean;message: string}>{
     const credentials = {username,password};
     return this.http.post<{success:boolean;message:string}>(this.authUrl,credentials);
  }
}

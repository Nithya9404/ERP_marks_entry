import { Component } from '@angular/core';
import {Router} from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router:Router,private authService:AuthService) {}
  login (){
    this.authService.authenticate(this.username,this.password).subscribe(
       (response) => {
        if (response.success){
          this.router.navigate(['/input']);
        }
        else{
          
          alert('Invalid credentials');
        }
       },
       (error) => {
        console.error('An error occured: ',error)
       }
    );
  }

}

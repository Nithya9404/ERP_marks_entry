import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { QuestionsPartAComponent } from './components/questions-part-a/questions-part-a.component';
import { QuestionsPartBComponent } from './components/questions-part-b/questions-part-b.component';
import { ReactiveFormsModule } from '@angular/forms';
import { QuestionTypeComponent } from './components/question-type/question-type.component';
import { CoursedetailComponent } from './components/coursedetail/coursedetail.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    QuestionsPartAComponent,
    QuestionsPartBComponent,
    QuestionTypeComponent,
    CoursedetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

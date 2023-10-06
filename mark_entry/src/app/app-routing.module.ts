import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { QuestionsPartAComponent } from './components/questions-part-a/questions-part-a.component';
import { QuestionsPartBComponent } from './components/questions-part-b/questions-part-b.component';

const routes: Routes = [
  {path: '',redirectTo: '/login', pathMatch: 'full'},
  {path: 'login',component: LoginComponent},
  {path: 'input', component: HomeComponent},
  {path: 'questions_part_A', component:QuestionsPartAComponent},
  {path: 'questions_part_B', component:QuestionsPartBComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

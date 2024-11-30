import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { P404Component } from './p404/p404.component';
import { SummaryComponent } from './summary/summary.component';
import { ReportsComponent } from './reports/reports.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignupComponent } from './signup/signup.component';
import { AuthGuard } from './auth.guard'; 

const routes: Routes = [
  {
    path : '',
    component : HomepageComponent,
    pathMatch: 'full'
  },
  {
    path : 'dashboard',
    component : DashboardComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path : 'summary',
    component : SummaryComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path : 'reports',
    component : ReportsComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },  
  {
    path : 'signup',
    component : SignupComponent,
    pathMatch: 'full'
  },
  {
    path : '**',
    component : P404Component
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

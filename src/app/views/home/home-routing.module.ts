import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminMasterComponent } from './account-master/admin-master/admin-master.component';
import { OperatorMasterComponent } from './account-master/operator-master/operator-master.component';
import { UserMasterComponent } from './account-master/user-master/user-master.component';
import { ActivityMasterComponent } from './activity-master/activity-master.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home.component';
import { NewsMasterComponent } from './news-master/news-master.component';

const routes: Routes = [
  {
    path:'',
    component: HomeComponent,
    children: [
      {
        path:'dashboard',
        component: DashboardComponent
      },
      {
        path:'account-master/user',
        component: UserMasterComponent
      },
      {
        path:'account-master/operator',
        component: OperatorMasterComponent
      },
      {
        path:'account-master/admin',
        component: AdminMasterComponent
      },
      {
        path:'activity-master',
        component: ActivityMasterComponent
      },
      {
        path:'news-master',
        component: NewsMasterComponent
      },
      {
        path: 'account-master',
        redirectTo: 'account-master/user',
        pathMatch: 'full'
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }

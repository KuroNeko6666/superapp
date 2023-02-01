import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { UserMasterComponent } from './account-master/user-master/user-master.component';
import { AdminMasterComponent } from './account-master/admin-master/admin-master.component';
import { OperatorMasterComponent } from './account-master/operator-master/operator-master.component';
import { NewsMasterComponent } from './news-master/news-master.component';
import { ActivityMasterComponent } from './activity-master/activity-master.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { QuickSettingComponent } from './components/quick-setting/quick-setting.component';
import { NgChartsModule } from 'ng2-charts';
import {MatDialogModule} from '@angular/material/dialog';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HomeComponent,
    UserMasterComponent,
    AdminMasterComponent,
    OperatorMasterComponent,
    NewsMasterComponent,
    ActivityMasterComponent,
    DashboardComponent,
    SidebarComponent,
    QuickSettingComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    NgChartsModule,
    MatDialogModule,
    AngularEditorModule,
    ReactiveFormsModule
  ]
})
export class HomeModule { }

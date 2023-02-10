import { Component, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { lastValueFrom, Subscription } from 'rxjs';
import { ActivityModel } from 'src/app/data/models/activity/activity-model.model';
import { KeycloakModel } from 'src/app/data/models/keycloak/keycloak-model';
import { NewsModel } from 'src/app/data/models/news/news-model.model';
import { UserModel } from 'src/app/data/models/user/user-model.model';
import { ApiService } from 'src/app/services/api/api.service';
import { ThemeService } from 'src/app/services/utils/theme/theme.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  public theme?: any
  public themeEmitter?: Subscription
  public chartColors?: string[]

  public isLoading = true


  // DATA //
  public accounts?: UserModel[]
  public users?: KeycloakModel[]
  public admins? : UserModel[]
  public operators? : UserModel[]
  public news? : NewsModel[]
  public activity? : ActivityModel[]

  // CHART //
  public weeklyUser?: number[] = [0,0,0,0,0,0,0]
  public weeklyAdmin?: number[] = [0,0,0,0,0,0,0]
  public weeklyOperator?: number[] = [0,0,0,0,0,0,0]
  public weeklyNews?: number[] = [0,0,0,0,0,0,0]
  public weeklyActivity?: number[] = [0,0,0,0,0,0,0]
  public latestUser?: KeycloakModel[]
  public userLength?: number

  // DATE //
  date = this.getDate()
  month = this.getMonth()
  year = new Date().getFullYear()

  // util //

  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartOptions: ChartOptions = {responsive: true};

  public weeklyUserData?: ChartConfiguration<'bar'>['data']
  public weeklyNewsData?: ChartConfiguration<'bar'>['data']
  public weeklyActivityData?: ChartConfiguration<'bar'>['data']

  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartOptions: ChartOptions<'pie'> = {responsive: true};
  public pieChartLabels = ['Pengguna', 'Operator', 'Admin'];
  public pieChartDatasets? : any;

  get currentPath(){
    return this.router.url
  }

  constructor(
    private themeService : ThemeService,
    private router : Router,
    private api: ApiService
  ){}


  ngOnInit(): void {
    this.theme = this.themeService.theme
    this.themeEmitter = this.themeService.emitTheme
    .subscribe((_) => {
      this.theme = this.themeService.theme
      this.setLatestUser()
      this.setWeeklyAccount()
      this.setWeeklyNews()
      this.setPieAccount()
    })
    this.getAllData()
    .then((_) => {
      this.setLatestUser()
      this.setWeeklyAccount()
      this.setWeeklyNews()
      this.setPieAccount()
      this.isLoading = false
    })
   }

   ngOnDestroy(): void {
    this.themeEmitter?.unsubscribe()
   }

   getMonth() {
    let month = (new Date().getMonth() + 1).toString()
    if (month.length == 1) {
      month = '0' + month
    }
    return month
  }
  getDate() {
    let data = new Date().getDate().toString()
    if (data.length == 1) {
      data = '0' + data
    }
    return Number(data)
  }


  setWeeklyAccount(){
    let isDark = this.theme.data.mode == 'dark'
    this.weeklyUserData = {
      labels: this.getLabelDataWeek(),
      datasets: [
        {
          data: this.weeklyUser!,
          label: 'Pengguna',
          backgroundColor: isDark ? this.theme.config.color.chart_900 : this.theme.config.color.chart_200,
          borderColor: 'white'
        },
        {
          data: this.weeklyAdmin!,
          label: 'Admin',
          backgroundColor: isDark ? this.theme.config.color.chart_800 : this.theme.config.color.chart_300,
          borderColor: 'white'
        },
        {
          data: this.weeklyOperator!,
          label: 'Operator',
          backgroundColor: isDark ? this.theme.config.color.chart_700 : this.theme.config.color.chart_400,
          borderColor: 'white'
        },
      ],
    };
  }

  setWeeklyNews(){
    let isDark = this.theme.data.mode == 'dark'
    this.weeklyNewsData = {
      labels: this.getLabelDataWeek(),
      datasets: [
        {
          data: this.weeklyNews!,
          label: 'berita',
          backgroundColor: isDark ? this.theme.config.color.chart_900 : this.theme.config.color.chart_200,
          borderColor: 'white'
        },
        {
          data: this.weeklyActivity!,
          label: 'aktivitas',
          backgroundColor: isDark ? this.theme.config.color.chart_900 : this.theme.config.color.chart_200,
          borderColor: 'white'
        },
      ],
    };
  }

  setLatestUser(){
    this.userLength = this.users?.length
    this.latestUser = this.users?.splice(0,10)
  }

  async getAllData(){
    await lastValueFrom(this.api.getAllAccount())
    .then((res) => {
      if(res.message == "Success"){
        this.accounts = res.data as UserModel[]
      }
    })
    await lastValueFrom(this.api.getAllUser())
    .then((res) => {
      if(res.message == "Success"){
        this.users = res.data as KeycloakModel[]
      }
    })
    await lastValueFrom(this.api.getAllOperator())
    .then((res) => {
      if(res.message == "Success"){
        this.operators = res.data as UserModel[]
      }
    })
    await lastValueFrom(this.api.getAllAdmin())
    .then((res) => {
      if(res.message == "Success"){
        this.admins = res.data as UserModel[]
      }
    })

    await lastValueFrom(this.api.getAllNews())
    .then((res) => {
      if(res.message == "Success"){
        this.news = res.data as NewsModel[]
      }
    })

    await lastValueFrom(this.api.getAllActivity())
    .then((res) => {
      if(res.message == "Success"){
        this.activity = res.data as ActivityModel[]
      }
    })

    this.accounts!.forEach((val: UserModel) => {
      let valDate = val.created_at!.split('T')[0]
      let datee = this.getLabelDataWeek()
      datee.forEach((e, i) => {
        if(valDate == e){
          if(val.role == "admin"){
            this.weeklyAdmin![i] += 1
          }
          if(val.role == "operator"){
            this.weeklyOperator![i] += 1
          }
        }
      })
    })


  this.users!.forEach((val: KeycloakModel) => {
      let valDate = val.created_at!.split('T')[0]
      let datee = this.getLabelDataWeek()
      datee.forEach((e, i) => {
        if(valDate == e){
          this.weeklyUser![i] += 1
        }
      })
    })


    this.news!.forEach((val: NewsModel) => {
      let valDate = val.created_at!.split('T')[0]
      let datee = this.getLabelDataWeek()
      datee.forEach((e, i) => {
        if(valDate == e){
          this.weeklyNews![i] += 1
        }
      })
    })

    this.activity!.forEach((val: ActivityModel) => {
      let valDate = val.created_at!.split('T')[0]
      let datee = this.getLabelDataWeek()
      datee.forEach((e, i) => {
        if(valDate == e){
          this.weeklyActivity![i] += 1
        }
      })
    })

  }

 async setPieAccount() {
    let isDark = this.theme.data.mode == 'dark'
    let color = this.theme.config.color
    let length = 0
    await lastValueFrom(this.api.getAllUser())
    .then((res) => {
      if(res.message == "Success"){
       let  data = res.data as KeycloakModel[]
        length = data.length
      }
    })
    console.log(length);

    this.pieChartDatasets = [
      {
        data: [length, this.operators!.length, this.admins!.length],
        backgroundColor: isDark ? [color.chart_900, color.chart_800, color.chart_700] : [color.chart_200, color.chart_300, color.chart_400]
      }
    ]
  }

  getLabelDataWeek() {
    let week = []
    for (let index = 0; index < 7; index++) {
    let datee = new Date(new Date().setDate( new Date().getDate() - index)).toISOString()
    let data = datee.split('T')[0]
      week.push(data)
    }
    return week.reverse()
  }

}

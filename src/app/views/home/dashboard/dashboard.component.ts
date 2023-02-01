import { Component, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { lastValueFrom, Subscription } from 'rxjs';
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
  public users?: UserModel[]
  public admins? : UserModel[]
  public operators? : UserModel[]

  // CHART //
  public weeklyUser?: number[] = [0,0,0,0,0,0,0]

  // DATE //
  date = this.getDate()
  month = this.getMonth()
  year = new Date().getFullYear()

  // util //

  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartData?: ChartConfiguration<'bar'>['data']
  public barChartOptions: ChartOptions = {responsive: true};

  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartOptions: ChartOptions<'pie'> = {responsive: true};
  public pieChartLabels = ['User', 'Admin', 'Operator'];
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
      this.setDataBar()
      this.setDataPie()
    })
    this.getAllData()
    .then((_) => {
      this.setDataBar()
      this.setDataPie()
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


  setDataBar(){
    let isDark = this.theme.data.mode == 'dark'
    this.barChartData = {

      labels: this.getLabelDataWeek().reverse(),
      datasets: [
        {
          data: this.weeklyUser!.reverse(),
          label: 'Series A',
          backgroundColor: isDark ? this.theme.config.color.chart_900 : this.theme.config.color.chart_200,
          borderColor: 'white'
        },
      ],
    };
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
        this.users = res.data as UserModel[]
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

    this.accounts!.forEach((val: UserModel) => {
      let valDate = val.created_at!.split('T')[0].split('-')
      console.log("increase");
      if (valDate[0] == this.year.toString() && valDate[1] == this.month) {
        for (let index = 0; index < 7; index++) {
          if (valDate[2] == (this.date - index).toString()) {
            this.weeklyUser![index] += 1

          } else {
            this.weeklyUser![index] += 0
          }
        }
      }
    })
  }

  setDataPie() {
    let isDark = this.theme.data.mode == 'dark'
    let color = this.theme.config.color
    this.pieChartDatasets = [
      {
        data: [this.users!.length, this.operators!.length, this.admins!.length],
        backgroundColor: isDark ? [color.chart_900, color.chart_800, color.chart_700] : [color.chart_200, color.chart_300, color.chart_400]
      }
    ]
  }

  getLabelDataWeek() {
    let week = []
    for (let index = 0; index < 7; index++) {
      week.push((this.date - index) + '-' + this.month + '-' + this.year)
    }
    return week
  }

}

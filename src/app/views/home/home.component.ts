import { Component, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ColorConfig } from 'src/app/data/config/colors/color-config';
import { ApiService } from 'src/app/services/api/api.service';
import { ThemeService } from 'src/app/services/utils/theme/theme.service';
import { MENU_DATA } from './components/sidebar/sidebar-data';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  public menu?: MENU_DATA
  public currentPath?: string
  public theme?: any
  public themeEmitter?: Subscription
  public sidebar?: boolean = true

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private api: ApiService
  ) { }

  ngOnInit(): void {

    if(!this.api.checkLogin()){
      this.router.navigateByUrl('/login')
    }
    this.setTheme()
    this.themeEmitter = this.themeService.emitTheme.subscribe((_) => {
      this.setTheme()
    })
    this.menu = new MENU_DATA()
    if (this.currentPath == null) {
      this.currentPath = this.router.url
    }
    this.menu.data.map((val)=> {
      if(val.path == this.currentPath || this.currentPath!.includes(val.path)){
        val.collapse = false
      }
    })

  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.themeEmitter?.unsubscribe()
  }

  closeSidebar(){
    this.sidebar = !this.sidebar
  }

  changeTheme(val: any){
    this.themeService.setTheme(val.mode, val.color)
  }

  setTheme(){
    this.theme = this.themeService.theme
  }

  logout(){
    this.api.logout()
  }

}

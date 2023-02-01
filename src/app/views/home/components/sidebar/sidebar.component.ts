import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MENU_DATA } from './sidebar-data';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  public menu?: MENU_DATA
  public currentPath?: string
  @Input() public theme?: any
  @Output() closeSidebar = new EventEmitter()


  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
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

  navigate(path: string): void {
    this.router.navigateByUrl(path).then((res: boolean) => {
      if (res) {
        this.menu = new MENU_DATA()
        this.menu.data.map((val)=> {
          if(val.path == path || path.includes(val.path)){
            val.collapse = false
          }
        })
        this.currentPath = path
      }
    })
  }

  close(){
    this.closeSidebar.emit(true)
  }

  get unSelected(){
    let color = this.theme.config.color
    if(this.theme.data.mode == 'dark'){
      let res = color.hover_bg_900
      return res
    } else {
      let res = color.hover_bg_100
      return res
    }
  }

  get selected(){
    let color = this.theme.config.color
    if(this.theme.data.mode == 'dark'){
      let res = color.bg_800 + ' ' + color.text_200 + ' ' + color.hover_bg_700
      return res
    } else {
      let res = color.bg_200 + ' ' + color.text_800 + ' ' + color.hover_bg_300
      return res
    }
  }

  get unCollapse(){
    let color = this.theme.config.color
    if(this.theme.data.mode == 'dark'){
      let res = color.bg_800 + ' ' + color.text_200
      return res
    } else {
      let res = color.bg_200 + ' ' + color.text_800
      return res
    }
  }

  get subSelected(){
    let color = this.theme.config.color
    if(this.theme.data.mode == 'dark'){
      let res = color.bg_700 + ' ' + color.text_100 + ' ' + color.hover_bg_600
      return res
    } else {
      let res = color.bg_300 + ' ' + color.text_900 + ' ' + color.hover_bg_400
      return res
    }
  }
}

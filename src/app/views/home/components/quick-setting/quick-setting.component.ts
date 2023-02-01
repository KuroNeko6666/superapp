import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-quick-setting',
  templateUrl: './quick-setting.component.html',
  styleUrls: ['./quick-setting.component.css']
})
export class QuickSettingComponent {

  @Output() changeTheme =  new EventEmitter()
  @Input() public theme: any
  public setting: boolean = true

  change(mode: string, color: string){
    this.changeTheme.emit({mode: mode, color: color})
  }

  openSetting(){
    this.setting = !this.setting
  }

}

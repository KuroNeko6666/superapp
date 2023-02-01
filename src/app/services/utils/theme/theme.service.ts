import { EventEmitter, Injectable, Output } from '@angular/core';
import { ColorConfig } from 'src/app/data/config/colors/color-config';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  @Output() emitTheme = new EventEmitter()
  constructor() { }

  config = new ColorConfig()

  get theme() {
    let modeData: string | null = localStorage.getItem('mode')
    let colorData: string | null = localStorage.getItem('color')
    let mode = this.config.mode
    let color = this.config.color
    if (mode != null && color != null) {
      let result = {
        data: {
          mode: modeData,
          color: colorData
        },
        config: {
          mode: modeData == 'dark' ? mode.dark : mode.light,
          color: colorData == 'blue' ? color.blue : colorData == 'teal' ? color.teal : color.orange
        }
      }
      return result
    } else {
      localStorage.setItem('mode', 'light')
      localStorage.setItem('color', 'orange')
      let result = {
        data: {
          mode: 'light',
          color: 'orange'
        },
        config: {
          mode: this.config.mode.dark,
          color: this.config.color.blue
        }
      }
      return result
    }
  }

  setTheme(mode: string, color: string): void {
    localStorage.setItem('mode', mode)
    localStorage.setItem('color', color)
    this.emitTheme.emit()
  }
}

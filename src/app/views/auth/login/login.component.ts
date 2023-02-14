import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginInterface } from 'src/app/data/interfaces/login-interface';
import { LoginModel } from 'src/app/data/models/login/login-model';
import { ResponseModel } from 'src/app/data/models/response/response-model.model';
import { ApiService } from 'src/app/services/api/api.service';
import { ThemeService } from 'src/app/services/utils/theme/theme.service';
import { MENU_DATA } from '../../home/components/sidebar/sidebar-data';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public menu?: MENU_DATA
  public currentPath?: string
  public sidebar?: boolean = true
  public theme?: any
  public themeEmitter?: Subscription

public isVisible? = false



  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private snackbar: MatSnackBar,
    private router: Router,
    private themeService: ThemeService,
  ){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if(this.api.checkLogin()){
      this.router.navigateByUrl('home/dashboard')
    }
    this.theme = this.themeService.theme
    this.themeEmitter = this.themeService.emitTheme
    .subscribe((_) => {
      this.theme = this.themeService.theme
    })

    console.log(this.theme);

  }

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  })

  get email(){
    return this.form.get('email')
  }

  get password(){
    return this.form.get('password')
  }

  submit(){

    if(this.email?.valid && this.password?.valid){
      let data : LoginInterface = {
        email : this.email.value!,
        password: this.password.value!,
      }
      this.api.login(data).subscribe((res: ResponseModel) => {
        if(res.message == "Success"){
          let credential : LoginModel = res.data as LoginModel
          if(credential.token != undefined){
            localStorage.setItem('keyToken', credential.token)
            localStorage.setItem('user', JSON.stringify(credential.user))
            this.router.navigateByUrl('home/dashboard')
          }
        } else {
          console.log(res);
          this.snackbar.open('Email atau Kata Sandi salah', 'oke', {
            duration: 3000,
            panelClass: 'app-notification-error',
          })
        }
      })
    } else {
      this.snackbar.open('Isi terlebih dahulu', 'oke', {
        duration: 3000,
        panelClass: 'app-notification-error',

      })
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }

}

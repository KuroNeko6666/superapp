import { Component, EventEmitter } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { KeycloakInterface } from 'src/app/data/interfaces/keycloak-interface';
import { KeycloakUpdateInterface } from 'src/app/data/interfaces/keycloak-update-interface';
import { RegisterInterface } from 'src/app/data/interfaces/register-interface';
import { UserInterface } from 'src/app/data/interfaces/user-interface';
import { KeycloakModel } from 'src/app/data/models/keycloak/keycloak-model';
import { ApiService } from 'src/app/services/api/api.service';
import { ThemeService } from 'src/app/services/utils/theme/theme.service';
import { DeleteComponent } from 'src/app/views/components/modals/delete/delete.component';

@Component({
  selector: 'app-user-master',
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.css']
})
export class UserMasterComponent {
  public themeSubcription?: Subscription
  public subcription?: Subscription
  public createSubs?: Subscription
  public updateSubs?: Subscription
  public deleteSubs?: Subscription

  // UTILITY //
  public theme?: any
  public isLoading?: boolean = true
  public isLoadingForm?: boolean = false
  public formMode?: boolean = false
  public createMode?: boolean = true

  // DATA //
  public rawData?: KeycloakModel[]
  public paginateData?: any[]
  public data?: KeycloakModel[]
  public role: number = 3
  public currentId?: number
  public page : number = 0
  public chunkSize : number = 10
  public imagePath?: any
  public image?: any

  // FORM //

  public searchForm = new FormControl('')
  public form = this.formBuilder.group({
    'username': ['', Validators.required],
    'firstname': ['', Validators.required],
    'lastname': ['', Validators.required],
    'email': ['', [Validators.required, Validators.email]],
    'password': ['',[ Validators.required, Validators.minLength(8)]],
  })

  get username() {
    return this.form.get('username')
  }
  get firstname() {
    return this.form.get('firstname')
  }
  get lastname() {
    return this.form.get('lastname')
  }
  get email() {
    return this.form.get('email')
  }
  get password() {
   return this.form.get('password')
 }

 get errorFirstName() {
  return (this.firstname?.hasError('required') && this.firstname.touched && this.theme.data.mode == 'dark')
  ? 'border-2 border-red-500 bg-slate-500 placeholder:text-slate-200'
  : this.theme.data.mode == 'dark'
  ? 'bg-slate-500 placeholder:text-slate-200'
  : 'bg-slate-200'
}

 get errorLastName() {
  return (this.lastname?.hasError('required') && this.lastname.touched && this.theme.data.mode == 'dark')
  ? 'border-2 border-red-500 bg-slate-500 placeholder:text-slate-200'
  : this.theme.data.mode == 'dark'
  ? 'bg-slate-500 placeholder:text-slate-200'
  : 'bg-slate-200'
}

  get errorUsername() {
    return (this.username?.hasError('required') && this.username.touched && this.theme.data.mode == 'dark')
    ? 'border-2 border-red-500 bg-slate-500 placeholder:text-slate-200'
    : this.theme.data.mode == 'dark'
    ? 'bg-slate-500 placeholder:text-slate-200'
    : 'bg-slate-200'
  }

  get errorEmail() {
   return( this.email?.invalid && this.email.touched && this.theme.data.mode == 'dark')
   ? 'border-2 border-red-500 bg-slate-500 placeholder:text-slate-200'
   : this.theme.data.mode == 'dark'
   ? 'bg-slate-500 placeholder:text-slate-200'
   : 'bg-slate-200'
 }

 get errorPassword() {
   return (this.password?.invalid && this.password.touched && this.theme.data.mode == 'dark')
   ? 'border-2 border-red-500 bg-slate-500 placeholder:text-slate-200'
   : this.theme.data.mode == 'dark'
   ? 'bg-slate-500 placeholder:text-slate-200'
   : 'bg-slate-200'
 }

 onFileSelect(input: any) {
  this.image = input.files[0]
  const reader = new FileReader();
  reader.onload = (e: any) => {
    this.imagePath = e.target.result;
  };
  reader.readAsDataURL(this.image!);
  this.updateImage()
}


  constructor(
    private themeService: ThemeService,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) { }


  ngOnInit(): void {
    this.theme = this.themeService.theme
    this.searchForm?.valueChanges.subscribe((val) => {
      this.search(val!)
    })
    this.themeSubcription = this.themeService.emitTheme
      .subscribe((_) => {
        this.theme = this.themeService.theme
      })
    this.getData()

  }

  ngOnDestroy(): void {
    this.themeSubcription?.unsubscribe()
    this.subcription?.unsubscribe()
    this.createSubs?.unsubscribe()
    this.updateSubs?.unsubscribe()
    this.deleteSubs?.unsubscribe()
  }

  // CRUD //

  getData() {
    this.isLoading = true
    this.subcription = this.apiService.getAllUser().subscribe({
      next: (res) => {
        if (res.message == 'Success') {
          this.rawData = res.data as KeycloakModel[]
          this.paginateData = this.paginate(this.rawData)
          this.data = this.paginateData[this.page]
        }
      },
      error: (err) => {
        this.isLoading = false
        this.openSnackBar(false)
      },
      complete: () => {
        this.isLoading = false
      }
    })
  }

  create(): void {
    let username = this.username
    let firstname = this.firstname
    let lastname = this.lastname
    let email = this.email
    let password = this.password

    if ( password?.valid && username?.valid && firstname?.valid && lastname?.valid && email?.valid) {
      this.isLoadingForm = true
      let data: KeycloakInterface = this.createInterface(username.value!, firstname.value!, lastname.value!, email.value!, password.value!)
      this.createSubs = this.apiService.createUser(data).subscribe({
        next: (res) => {
          console.log(res);
          if (res.message == 'Success') {
            this.isLoadingForm = false
            this.resetForm()
            this.getData()
            this.openSnackBar(true)

          } else {
            //error here
            this.isLoadingForm = false
            this.openSnackBar(false)

          }
        },
        error: (err) => {
          //
          this.isLoadingForm = false
          this.openSnackBar(false)

        },
      })
    }

  }

  edit(data: KeycloakModel): void {
    console.log(data);

    this.currentId = data.user_id
    this.firstname?.setValue(data.firstname!)
    this.lastname?.setValue(data.lastname!)
    this.username?.setValue(data.username!)
    this.email?.setValue(data.email!)
    this.createMode = false
    this.imagePath = data.avatar?.avatar_url
    this.openForm()
  }

  update(): void {
    let username = this.username
    let firstname = this.firstname
    let lastname = this.lastname
    let email = this.email

    if (username?.valid && firstname?.valid && lastname?.valid && email?.valid) {
      this.isLoadingForm = true
      let data: KeycloakUpdateInterface = this.updateInterface(firstname.value!, lastname.value!)
      this.updateSubs = this.apiService.updateUser(data, this.currentId!).subscribe({
        next: (res) => {
          console.log(res);

          if (res.message == 'Success') {
            this.isLoadingForm = false
            this.resetForm()
            this.getData()
            this.openSnackBar(true)

          } else {
            this.isLoadingForm = false
            this.openSnackBar(false)

          }
        },
        error: (err) => {
          this.isLoadingForm = false
          this.openSnackBar(false)

        },
      })
    }
  }

  updateImage(){
    if(this.image != undefined){
      this.apiService.updateAvatarUser(this.image, this.currentId!).subscribe({
        next: (res) => {
          console.log(res);

          if (res.message == 'Success') {
            this.isLoadingForm = false
            this.openSnackBar(true)

          } else {
            this.isLoadingForm = false
            this.openSnackBar(false)

          }
        },
        error: (err) => {
          this.isLoadingForm = false
          this.openSnackBar(false)

        },
      })
    }
  }

  deleteItem(id: number): void {
    this.dialog.open(DeleteComponent, {data:  this.theme.config.mode.bg}).afterClosed().subscribe((res) =>{
      if(res){
       this.deleteSubs = this.apiService.deleteUser(id)
       .subscribe({
        next: (res) => {
          if (res.message == 'Success') {
            this.resetForm()
            this.getData()
            this.openSnackBar(true)

          } else {
            //error here
            this.openSnackBar(false)
          }
        }
       })
      }
    })
   }

  // UTILS //

  openForm(){
    this.formMode = true
  }

  closeForm(){
    this.formMode = false
    this.resetForm()
  }

  get currentPath() {
    return this.router.url
  }

  createInterface(username: string, firstname: string, lastname: string, email:string, password: string) : KeycloakInterface{
    let res : KeycloakInterface = {
      username: username,
      lastname: lastname,
      firstname: firstname,
      email: email,
      password: password,
    }
    return res
  }

  updateInterface(firstname: string, lastname: string) : KeycloakUpdateInterface{
    let res : KeycloakUpdateInterface = {
      lastname: lastname,
      firstname: firstname,
    }
    return res
  }

  resetForm(){
    this.formMode = false
    this.form.reset()
    this.currentId = 0
    this.createMode = true
  }

  paginate(data: any[]) {
    let chunkSize: number = this.chunkSize
    let queue: number = 0
    let result: any[] = []
    let chunk: any[] = []
    data.forEach((val: any) => {
      queue++
      chunk.push(val)
      if (queue >= chunkSize) {
        result.push(chunk)
        chunk = []
        queue = 0
      }
    });
    if (chunk.length) {
      result.push(chunk)
    }
    return result
  }

  search(text: string) {
    let data = this.rawData?.filter((val) => val.username?.includes(text!) || val.firstname?.includes(text!) || val.lastname?.includes(text!) || val.email?.includes(text!))
    this.page = 0
    this.paginateData = this.paginate(data!)
    this.data = this.paginateData[this.page]
  }

  changePage(increment: boolean) {
    if (increment) {
      this.page++
      this.data = this.paginateData![this.page]
    } else {
      this.page--
      this.data = this.paginateData![this.page]
    }
  }
  openSnackBar(isSuccess : boolean){
    if(isSuccess){
      this.snackbar.open("Aksi berhasil dijalankan", "oke",{
        duration: 5000,
        panelClass: 'app-notification-success',
      })
    } else {
      this.snackbar.open("Aksi Gagal dijalankan", "oke",{
        duration: 5000,
        panelClass: 'app-notification-error',
      })
    }
  }
}

import { Component, EventEmitter } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RegisterInterface } from 'src/app/data/interfaces/register-interface';
import { UserInterface } from 'src/app/data/interfaces/user-interface';
import { UserModel } from 'src/app/data/models/user/user-model.model';
import { ApiService } from 'src/app/services/api/api.service';
import { ThemeService } from 'src/app/services/utils/theme/theme.service';
import { DeleteComponent } from 'src/app/views/components/modals/delete/delete.component';

@Component({
  selector: 'app-admin-master',
  templateUrl: './admin-master.component.html',
  styleUrls: ['./admin-master.component.css']
})
export class AdminMasterComponent {
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
  public rawData?: UserModel[]
  public paginateData?: any[]
  public data?: UserModel[]
  public role: number = 1
  public currentId?: number
  public page : number = 0
  public chunkSize : number = 10

  // FORM //

  public searchForm = new FormControl('')
  public form = this.formBuilder.group({
    'name': ['', Validators.required],
    'email': ['', [Validators.required, Validators.email]],
    'password': ['',[ Validators.required, Validators.minLength(8)]],
  })

  get name() {
    return this.form.get('name')
  }
  get email() {
    return this.form.get('email')
  }
  get password() {
   return this.form.get('password')
 }

  get errorName() {
    return (this.name?.hasError('required') && this.name.touched && this.theme.data.mode == 'dark')
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
    this.subcription = this.apiService.getAllAdmin().subscribe({
      next: (res) => {
        if (res.message == 'Success') {
          this.rawData = res.data as UserModel[]
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
    let name = this.name
    let email = this.email
    let password = this.password

    if ( password?.valid && name?.valid && email?.valid) {
      this.isLoadingForm = true
      let data: RegisterInterface = this.createInterface(name.value!, email.value!, password.value!)
      this.createSubs = this.apiService.createAccount(data).subscribe({
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

  edit(data: UserModel): void {
    this.currentId = data.id
    this.name?.setValue(data.name!)
    this.email?.setValue(data.email!)
    this.createMode = false
    this.openForm()
  }

  update(): void {
    let name = this.name
    let email = this.email

    if (name?.valid && email?.valid) {
      this.isLoadingForm = true
      let data: UserInterface = this.updateInterface(name.value!, email.value!)
      this.updateSubs = this.apiService.updateAccount(data, this.currentId!).subscribe({
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

  deleteItem(id: number): void {
    this.dialog.open(DeleteComponent, {data:  this.theme.config.mode.bg}).afterClosed().subscribe((res) =>{
      if(res){
       this.deleteSubs = this.apiService.deleteAccount(id)
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

  createInterface(name: string, email:string, password: string) : RegisterInterface{
    let res : RegisterInterface = {
      name: name,
      email: email,
      password: password,
      role: this.role
    }
    return res
  }

  updateInterface(name: string, email:string) : UserInterface{
    let res : UserInterface = {
      name: name,
      email: email,
      role: this.role
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
    let data = this.rawData?.filter((val) => val.name?.includes(text!) || val.email?.includes(text!))
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

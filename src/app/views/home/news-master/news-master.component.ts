import { Component, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Observable, Subscription } from 'rxjs';
import { NewsInterface } from 'src/app/data/interfaces/news-interface';
import { NewsModel } from 'src/app/data/models/news/news-model.model';
import { ApiService } from 'src/app/services/api/api.service';
import { ThemeService } from 'src/app/services/utils/theme/theme.service';
import { DeleteComponent } from '../../components/modals/delete/delete.component';
import { ImageComponent } from '../../components/modals/image/image.component';
import { SnackbarComponent } from '../../components/snackbar/snackbar.component';
import { EDITOR_CONFIG } from './editor-config';

@Component({
  selector: 'app-news-master',
  templateUrl: './news-master.component.html',
  styleUrls: ['./news-master.component.css']
})
export class NewsMasterComponent {
  // SUBCRIBE //
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
  public config: AngularEditorConfig = EDITOR_CONFIG

  // DATA //
  public rawData?: NewsModel[]
  public paginateData?: any[]
  public data?: NewsModel[]
  public image?: Blob
  public imagePath?: any
  public currentId?: number
  public page : number = 0
  public chunkSize : number = 10

  // FORM //

  public searchForm = new FormControl('')
  public form = this.formBuilder.group({
    'title': ['', Validators.required],
    'content': ['', Validators.required],
    'source': ['', Validators.required],
  })

  get title() {
    return this.form.get('title')
  }
  get content() {
    return this.form.get('content')
  }

  get source() {
    return this.form.get('source')
  }

  get errorTitle() {
    return (this.title?.hasError('required') && this.title.touched && this.theme.data.mode == 'dark')
    ? 'border-2 border-red-500 bg-slate-500 placeholder:text-slate-200'
    : this.theme.data.mode == 'dark'
    ? 'bg-slate-500 placeholder:text-slate-200'
    : 'bg-slate-200'
  }

  get errorSource() {
    return (this.title?.hasError('required') && this.title.touched && this.theme.data.mode == 'dark')
    ? 'border-2 border-red-500 bg-slate-500 placeholder:text-slate-200'
    : this.theme.data.mode == 'dark'
    ? 'bg-slate-500 placeholder:text-slate-200'
    : 'bg-slate-200'
  }

  get errorContent(){
    return this.content?.hasError('required') && this.content.touched
    ? 'border-2 border-red-500'
    : ''
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
      console.log(val);

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
    this.subcription = this.apiService.getAllNews().subscribe({
      next: (res) => {
        if (res.message == 'Success') {
          this.rawData = res.data as NewsModel[]
          this.paginateData = this.paginate(this.rawData)
          this.data = this.paginateData[this.page]
        }
      },
      error: (err) => {
        this.isLoading = false
      },
      complete: () => {
        this.isLoading = false
      }
    })
  }

  create(): void {
    let title = this.form.get('title')
    let content = this.form.get('content')
    let source = this.form.get('source')
    console.log('oke');

    if (this.image != undefined && title?.valid && content?.valid && source?.valid) {
      this.isLoadingForm = true
      let data: NewsInterface = this.createInterface(title.value!, content.value!, source?.value!, this.image!)
      this.createSubs = this.apiService.createNews(data).subscribe({
        next: (res) => {
          if (res.message == 'Success') {
            this.isLoadingForm = false
            this.resetForm()
            this.getData()
            this.openSnackBar(true)
          } else {
            //error here
            this.openSnackBar(false)
            this.isLoadingForm = false
          }
        },
        error: (err) => {
          this.openSnackBar(false)
          this.isLoadingForm = false
        },
      })
    } else {
      this.snackbar.open("Isi terlebih dahulu", "oke",{
        duration: 5000,
        panelClass: 'app-notification-error',
      })
    }

  }

removeTags(str: string) {
  if ((str===null) || (str===''))
      return false;
  else
      str = str.toString();

  return str.replace( /(<([^>]+)>)/ig, '');
}

  show(data: NewsModel): void {
    let title = this.form.get('title')
    let content = this.form.get('content')
    this.currentId = data.id
    title?.setValue(data.title!)
    content?.setValue(data.content!)
    this.source?.setValue(data.source!)
    this.imagePath = data.thumbnail!
    this.createMode = false
    this.openForm()
  }

  update(): void {
    let title = this.form.get('title')
    let content = this.form.get('content')
    let source = this.source

    if (title?.valid && content?.valid && source?.valid) {
      this.isLoadingForm = true
      let data: NewsInterface = this.createInterface(title.value!, content.value!, this.source?.value!, this.image)
      this.updateSubs = this.apiService.updateNews(data, this.currentId!).subscribe({
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
          this.isLoadingForm = false
          this.openSnackBar(false)

        },
      })
    }
  }

  deleteItem(id: number): void {
    this.dialog.open(DeleteComponent, {data:  this.theme.config.mode.bg}).afterClosed().subscribe((res) =>{
      if(res){
       this.deleteSubs = this.apiService.deleteNews(id)
       .subscribe({
        next: (res) => {
          if (res.message == 'Success') {
            this.resetForm()
            this.getData()
            this.openSnackBar(true)
          } else {
            this.openSnackBar(false)
          }
        },
        error: (_) => {
          this.openSnackBar(false)
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

  onFileSelect(input: any) {
    this.image = input.files[0]
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePath = e.target.result;
    };
    reader.readAsDataURL(this.image!);
  }

  get currentPath() {
    return this.router.url
  }

  openImage(data: string){
    this.dialog.open(ImageComponent, {
      data: {
        url: data,
        theme: this.theme.config.mode.bg
      },
    })
  }

  createInterface(title: string, content:string, source:string, thumbnail?: Blob) : NewsInterface{
    let res : NewsInterface = {
      title: title,
      content: content,
      thumbnail: thumbnail,
      source: source
    }
    return res
  }

  resetForm(){
    this.formMode = false
    this.form.reset()
    this.image = undefined
    this.imagePath = undefined
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
    let data = this.rawData?.filter((val) => val.title?.includes(text!) || val.content?.includes(text!))
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

import { Component, EventEmitter } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ActivityInterface } from 'src/app/data/interfaces/activity-interface';
import { ActivityModel } from 'src/app/data/models/activity/activity-model.model';
import { ImageModel } from 'src/app/data/models/image/image-model.model';
import { ApiService } from 'src/app/services/api/api.service';
import { ThemeService } from 'src/app/services/utils/theme/theme.service';
import { DeleteComponent } from '../../components/modals/delete/delete.component';
import { ImageComponent } from '../../components/modals/image/image.component';

@Component({
  selector: 'app-activity-master',
  templateUrl: './activity-master.component.html',
  styleUrls: ['./activity-master.component.css']
})
export class ActivityMasterComponent {
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

   // DATA //
   public rawData?: ActivityModel[]
   public paginateData?: any[]
   public data?: ActivityModel[]
   public currentId?: number
   public page : number = 0
   public chunkSize : number = 10
   public image?: Blob[] = []
  public imagePath?: any[] = []
  public imageData?: ImageModel[] = []

   // FORM //

   public searchForm = new FormControl('')
   public form = this.formBuilder.group({
     'activity_name': ['', Validators.required],
     'place': ['', Validators.required],
     'time': ['', Validators.required],
   })

   get activity_name() {
     return this.form.get('activity_name')
   }
   get place() {
     return this.form.get('place')
   }
   get time() {
    return this.form.get('time')
  }

   get errorName() {
     return (this.activity_name?.hasError('required') && this.activity_name.touched && this.theme.data.mode == 'dark')
     ? 'border-2 border-red-500 bg-slate-500 placeholder:text-slate-200'
     : this.theme.data.mode == 'dark'
     ? 'bg-slate-500 placeholder:text-slate-200'
     : 'bg-slate-200'
   }

   get errorPlace() {
    return (this.place?.hasError('required') && this.place.touched && this.theme.data.mode == 'dark')
    ? 'border-2 border-red-500 bg-slate-500 placeholder:text-slate-200'
    : this.theme.data.mode == 'dark'
    ? 'bg-slate-500 placeholder:text-slate-200'
    : 'bg-slate-200'
  }

  get errorTime() {
    return (this.time?.hasError('required') && this.time.touched && this.theme.data.mode == 'dark')
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
     this.subcription = this.apiService.getAllActivity().subscribe({
       next: (res) => {
         if (res.message == 'Success') {
           this.rawData = res.data as ActivityModel[]
           console.log(this.rawData);

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
     let name = this.activity_name
     let place = this.place
     let time = this.time

     if ( time?.valid && name?.valid && place?.valid) {
       this.isLoadingForm = true
       let data: ActivityInterface = this.createInterface(name.value!, place.value!, time.value!, this.image)
       this.createSubs = this.apiService.createActivity(data).subscribe({
         next: (res) => {
           if (res.message == 'Success') {
             this.isLoadingForm = false
             this.resetForm()
             this.getData()
             this.openSnackBar(true)
             console.log(res);

           } else {
             //error here
             this.isLoadingForm = false
             this.openSnackBar(false)
             console.log(res);

           }
         },
         error: (err) => {
           //
           this.isLoadingForm = false
           this.openSnackBar(false)
           console.log(err);
         },
       })
     }

   }

   show(data: ActivityModel): void {
     this.currentId = data.id
     this.activity_name?.setValue(data.activity_name!)
     this.place?.setValue(data.place!)
     this.time?.setValue(data.time!)
     data.image.forEach((e:any) => {
      let dt : ImageModel = {
        image_url : e.image_url,
        id: e.id,
        activity_id: e.activity_id
      }
      this.imageData?.push(dt)
       this.imagePath?.push(e.image_url)
     });
     this.createMode = false
     this.openForm()
     console.log(this.imagePath );

   }

   update(): void {

     let name = this.activity_name
     let place = this.place
     let time = this.time

     if (name?.valid && place?.valid && time?.valid) {
       this.isLoadingForm = true
       let data: ActivityInterface = this.createInterface(name.value!, place.value!, time.value!, this.image)
       this.updateSubs = this.apiService.updateActivity(data, this.currentId!).subscribe({
         next: (res) => {
           if (res.message == 'Success') {
             this.isLoadingForm = false
             this.resetForm()
             this.getData()
             this.openSnackBar(true)
           } else {
             this.isLoadingForm = false
             this.openSnackBar(false)
           }
           console.log(res);

         },
         error: (err) => {
           this.isLoadingForm = false
           this.openSnackBar(false)
           console.log(err);
         },
       })
     }
   }

   deleteItem(id: number): void {
     this.dialog.open(DeleteComponent, {data:  this.theme.config.mode.bg}).afterClosed().subscribe((res) =>{
       if(res){
        this.deleteSubs = this.apiService.deleteActivity(id)
        .subscribe({
         next: (res) => {
           if (res.message == 'Success') {
             this.resetForm()
             this.getData()
             this.openSnackBar(true)
           } else {
             //error here
             console.log(res);

             this.openSnackBar(false)
           }
         }
        })
       }
     })
    }

    deleteImage(id: number | null, id_img: number | null, i: number){
      console.log(id, id_img);
      if(this.createMode){
        this.imageData?.splice(i, 1)
      } else {
        if(id != null){
          this.dialog.open(DeleteComponent, {data:  this.theme.config.mode.bg}).afterClosed().subscribe((res) =>{
            if(res){
             this.deleteSubs = this.apiService.deleteImageActivity(id!, id_img!)
             .subscribe({
              next: (res) => {
                if (res.message == 'Success') {
                  this.imageData?.splice(i, 1)
                  // this.resetForm()
                  this.getData()
                  this.openSnackBar(true)
                } else {
                  //error here
                  console.log(res);

                  this.openSnackBar(false)
                }
              }
             })
            }
          })
        } else {
        this.imageData?.splice(i, 1)
        }
      }

    }

   // UTILS //

   onFileSelect(input: any) {
    for (const iterator of input.files) {
      let reader = new FileReader();
      reader.readAsDataURL(iterator!)
      reader.onload = (e: any) => {
        this.imagePath?.push(reader.result);
        let data : ImageModel = {
          image: iterator,
          image_url: reader.result
        }
        this.imageData?.push(data)
      };
    }
    this.image = input.files
    for (let i = 0; i < input.files.length; i++) {
      const val = input.files[i];
      let reader = new FileReader();
      reader.readAsDataURL(val!)
      reader.onload = (e: any) => {
        this.imagePath?.push(reader.result);
      };
    }

  }

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

   createInterface(name: string, place:string, time: string, images: any) : ActivityInterface{
     let res : ActivityInterface = {
       activity_name: name,
       place: place,
       time: time,
       images: images
     }
     return res
   }

   resetForm(){
     this.formMode = false
     this.form.reset()
     this.currentId = 0
     this.createMode = true
     this.image = []
     this.imagePath = []
     this.imageData = []
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
     let data = this.rawData?.filter((val) => val.activity_name?.includes(text!) || val.place?.includes(text!))
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

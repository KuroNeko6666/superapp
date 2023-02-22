import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ActivityInterface } from 'src/app/data/interfaces/activity-interface';
import { KeycloakInterface } from 'src/app/data/interfaces/keycloak-interface';
import { KeycloakUpdateInterface } from 'src/app/data/interfaces/keycloak-update-interface';
import { LoginInterface } from 'src/app/data/interfaces/login-interface';
import { NewsInterface } from 'src/app/data/interfaces/news-interface';
import { RegisterInterface } from 'src/app/data/interfaces/register-interface';
import { UserInterface } from 'src/app/data/interfaces/user-interface';
import { ResponseModel } from 'src/app/data/models/response/response-model.model';
import { API_CONFIG } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url = API_CONFIG

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  get headers() {
    let token : string | null = localStorage.getItem('keyToken')
    return {'Authorization' : 'Bearer ' + token}
  }

  login(data: LoginInterface): Observable<ResponseModel>{
    return this.http.post<ResponseModel>(this.url.login, data)
  }

  register(data: RegisterInterface): Observable<ResponseModel>{
    return this.http.post<ResponseModel>(this.url.register, data)
  }

  checkLogin() : boolean {
    let token: string | null = localStorage.getItem('keyToken')
    if(token != null){
      return true
    }
    return false
  }

  logout(){
    localStorage.clear()
    this.router.navigateByUrl("/login")
  }

  // ===== USER SECTION ===== //

  getAllAccount() : Observable<ResponseModel>{
    return this.http.get<ResponseModel>(this.url.user.all, {headers: this.headers})
  }

  getAllOperator() : Observable<ResponseModel>{
    return this.http.get<ResponseModel>(this.url.user.operator, {headers: this.headers})
  }

  getAllAdmin() : Observable<ResponseModel>{
    return this.http.get<ResponseModel>(this.url.user.admin, {headers: this.headers})
  }

  findAccount(id: number): Observable<ResponseModel>{
    return this.http.get<ResponseModel>((this.url.user.base + id), {headers: this.headers})
  }

  createAccount(data: RegisterInterface): Observable<ResponseModel>{
    return this.http.post<ResponseModel>(this.url.user.create, data, {headers: this.headers})
  }

  updateAccount(data: UserInterface, id: number): Observable<ResponseModel>{
    return this.http.put<ResponseModel>((this.url.user.base + `/u/` + id), data, {headers: this.headers})
  }

  deleteAccount(id: number): Observable<ResponseModel>{
    return this.http.delete<ResponseModel>((this.url.user.base + '/d/' + id), {headers: this.headers})
  }

  // ===== ACTIVITY SECTION ===== //

  getAllActivity() : Observable<ResponseModel>{
    return this.http.get<ResponseModel>(this.url.activity.all, {headers: this.headers})
  }

  findActivity(id: number): Observable<ResponseModel>{
    return this.http.get<ResponseModel>((this.url.activity.base + id), {headers: this.headers})
  }

  createActivity(data: ActivityInterface): Observable<ResponseModel>{
    let formData = new FormData()
    formData.append('activity_name', data.activity_name)
    formData.append('place', data.place)
    formData.append('time', data.time)
    for (const iterator of data.images) {
      console.log(iterator);
      formData.append('images', iterator)
    }
    return this.http.post<ResponseModel>(this.url.activity.create, formData, {headers: this.headers})
  }

  updateActivity(data: ActivityInterface, id: number): Observable<ResponseModel>{
    let formData = new FormData()
    formData.append('activity_name', data.activity_name)
    formData.append('place', data.place)
    formData.append('time', data.time)
    if(data.images.length != 0){
      for (const iterator of data.images) {
        formData.append('images', iterator)
      }
    }
    console.log({
      activity_name: formData.get('activity_name'),
      place: formData.get('place'),
      time: formData.get('time'),
      image: formData.getAll('images'),
    });
    return this.http.put<ResponseModel>(this.url.activity.update + id, formData, {headers: this.headers})
  }

  deleteActivity(id: number): Observable<ResponseModel>{
    return this.http.delete<ResponseModel>((this.url.activity.base + 'd/' + id), {headers: this.headers})
  }

  deleteImageActivity(id: number, id_img: number): Observable<ResponseModel>{
    return this.http.delete<ResponseModel>(this.url.activity.delete_img + `/` + id + `/` + id_img, {headers: this.headers})
  }

  // ===== NEWS SECTION ===== //

  getAllNews() : Observable<ResponseModel>{
    return this.http.get<ResponseModel>(this.url.news.all, {headers: this.headers})
  }

  findNews(id: number): Observable<ResponseModel>{
    return this.http.get<ResponseModel>((this.url.news.base + id), {headers: this.headers})
  }

  createNews(data: NewsInterface): Observable<ResponseModel>{
    let formData = new FormData()
    formData.append('title', data.title)
    formData.append('content', data.content)
    formData.append('thumbnail', data.thumbnail)
    formData.append('source', data.source)
    console.log(data);

    return this.http.post<ResponseModel>(this.url.news.create, formData, {headers: this.headers})
  }

  updateNews(data: NewsInterface, id: number): Observable<ResponseModel>{
    let formData = new FormData()
    formData.append('title', data.title)
    formData.append('content', data.content)
    formData.append('thumbnail', data.thumbnail == undefined ? null : data.thumbnail)
    formData.append('source', data.source)
    return this.http.put<ResponseModel>((this.url.news.base+ `/u/` +id), formData, {headers: this.headers})
  }

  deleteNews(id: number): Observable<ResponseModel>{
    return this.http.delete<ResponseModel>((this.url.news.base + '/d/' + id), {headers: this.headers})
  }

  // === CREATE KEYCLOAK === //

  getAllUser() : Observable<ResponseModel>{
    return this.http.get<ResponseModel>(this.url.keycloak.all, {headers: this.headers})
  }

  findUser(id: number): Observable<ResponseModel>{
    return this.http.get<ResponseModel>((this.url.keycloak.find + id), {headers: this.headers})
  }

  createUser(data: KeycloakInterface): Observable<ResponseModel>{
    return this.http.post<ResponseModel>(this.url.keycloak.create, data, {headers: this.headers})
  }

  updateUser(data: KeycloakUpdateInterface, id: number): Observable<ResponseModel>{
    return this.http.put<ResponseModel>((this.url.keycloak.update + id), data, {headers: this.headers})
  }

  deleteUser(id: number): Observable<ResponseModel>{
    return this.http.delete<ResponseModel>((this.url.keycloak.delete + id), {headers: this.headers})
  }

}

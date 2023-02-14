import { ActivityModel } from "../activity/activity-model.model"
import { KeycloakModel } from "../keycloak/keycloak-model"
import { LoginModel } from "../login/login-model"
import { NewsModel } from "../news/news-model.model"
import { UserModel } from "../user/user-model.model"

export class ResponseModel {
  public code?: number
  public message?: string
  public data?: string | NewsModel | NewsModel[] | ActivityModel | ActivityModel[] | UserModel | UserModel[] | LoginModel | KeycloakModel | KeycloakModel[]

  constructor(values: ResponseModel){
    Object.assign(this, values)
  }
}

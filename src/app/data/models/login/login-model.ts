import { UserModel } from "../user/user-model.model"

export class LoginModel {
  public token?: string
  public user?: UserModel

  constructor(values: LoginModel){
    Object.assign(this, values)
  }
}

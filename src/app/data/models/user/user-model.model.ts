export class UserModel {
  public id?: number
  public name?: string
  public email?: string
  public role?: string
  public created_at?: string

  constructor(values: UserModel){
    Object.assign(this, values)
  }
}

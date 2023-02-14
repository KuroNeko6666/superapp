export class KeycloakModel {
  public user_id?: number
  public username?: string
  public firstname?: string
  public lastname?: string
  public email?: string
  public email_verify?: boolean
  public created_at?: string

  constructor(values: KeycloakModel){
    Object.assign(this, values)
  }
}

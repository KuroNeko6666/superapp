class Avatar {
  avatar_id? : number;
  user_id? : number;
  avatar_url? : string;

  constructor(values: Avatar){
    Object.assign(this, values)
  }
}

export class KeycloakModel {
  public user_id?: number
  public username?: string
  public firstname?: string
  public lastname?: string
  public email?: string
  public email_verify?: boolean
  public created_at?: string
  public avatar?: Avatar

  constructor(values: KeycloakModel){
    Object.assign(this, values)
  }
}

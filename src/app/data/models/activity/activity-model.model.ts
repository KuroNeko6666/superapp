export class ActivityModel {
  public id?: number
  public name?: string
  public place?: string
  public time?: string
  public created_at?: string

  constructor(values: ActivityModel){
    Object.assign(this, values)
  }
}

export class ActivityModel {
  public id?: number
  public activity_name?: string
  public place?: string
  public time?: string
  public image?: any
  public created_at?: string

  constructor(values: ActivityModel){
    Object.assign(this, values)
  }
}

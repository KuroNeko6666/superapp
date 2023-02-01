export class ActivityModel {
  public id?: number
  public name?: string
  public place?: string
  public time?: string

  constructor(values: ActivityModel){
    Object.assign(this, values)
  }
}

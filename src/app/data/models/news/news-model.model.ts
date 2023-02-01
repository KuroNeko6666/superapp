export class NewsModel {
  public id?: number
  public title?: string
  public content?: string
  public thumbnail?: string

  constructor(values: NewsModel){
    Object.assign(this, values)
  }
}

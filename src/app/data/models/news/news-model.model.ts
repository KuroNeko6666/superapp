export class NewsModel {
  public id?: number
  public title?: string
  public content?: string
  public thumbnail?: string
  public source?: string
  public created_at?: string

  constructor(values: NewsModel){
    Object.assign(this, values)
  }
}

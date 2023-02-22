export class ImageModel {
  public id?: number
  public activity_id?: number
  public image_url?: any
  public image?: any
  public created_at?: string

  constructor(values: ImageModel){
    Object.assign(this, values)
  }
}

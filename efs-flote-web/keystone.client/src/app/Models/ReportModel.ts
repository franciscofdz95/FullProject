export interface reportModel {
  id: number;
  name: string;
  procedure: string;
  schema: string;
  active: boolean;
}

export class reportMessageObject {
  constructor(public headers: string[],
    public data: string[][]){
}

  static fromJson(json: any): reportMessageObject{
  return new reportMessageObject(json.headers ?? [], json.data ?? []);
  }
}



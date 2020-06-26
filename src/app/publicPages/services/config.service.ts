import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';


@Injectable()
export class ConfigService {

  public _jsonURL;

  constructor(public http: Http) { }

  public getJSON(): Observable<any> {
    this._jsonURL = 'assets/config/whiteLabel.json';

    return this.http.get(this._jsonURL)
      .map((res: Response) => {
        return res.json();
      })
      .catch((error: any) => {
        try {
          return (Observable.throw(error.json()));
        } catch (jsonError) {
          let minimumViableError = {
            success: false
          };
          return (Observable.throw(minimumViableError));
        }
      });;
  }

}

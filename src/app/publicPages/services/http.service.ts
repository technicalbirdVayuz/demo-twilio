import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { environment } from '../../../environments/environment';

@Injectable()
export class HttpService {

    constructor(public http: Http) { }
    getData(url, payload) {

        const headers = new Headers({ 'content-language': 'en' });
        const options = new RequestOptions({ headers: headers });

        return this.http.get(environment.BE_URL + url + '?bookingId=' + payload.bookingId, options)
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
            });

    }
}

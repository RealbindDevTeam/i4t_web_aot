import { Injectable, NgZone } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MeteorObservable } from 'meteor-rxjs';
import { Http, Headers } from "@angular/http";
import { CcRequestColombia, CusPayInfo } from '../../../../both/models/payment/cc-request-colombia.model';
import { Parameters } from '../../../../both/collections/general/parameter.collection';

@Injectable()
export class PayuPaymenteService {

    private payuReportsApiURI: string;

    private _parameterSub: Subscription;

    private headers = new Headers({
        //'Host': 'sandbox.api.payulatam.com',
        'Content-Type': 'application/json;charset=utf-8',
        'Accept': 'application/json'
        //'Accept-language': 'es',
        //'Content-Length': 'length',
    });
    
    constructor(private http: Http, private _ngZone: NgZone) {

    }

    /**
     * This function sends the autorization and capture JSON to PayU platform
     * @param {CcRequestColombia} requestObject
     * @return {Observable}
     */
    authorizeAndCapture(url: string, requestObject: CcRequestColombia): Observable<any> {
        return this.http
            .post(url, JSON.stringify(requestObject), { headers: this.headers })
            .map(res => res.json())
            .catch(this.handleError);
    }

    /**
     * This functions queries the given transaction report of PayU platform
     * @param {Object} requestObject
     */
    getTransactionResponse(url: string, requestObject: any): Observable<any> {
        return this.http
            .post(url, JSON.stringify(requestObject), { headers: this.headers })
            .map(res => res.json())
            .catch(this.handleError);
    }

    /**
     * This function verify conectivity with Payu platform reports API 
     * @param  {any} obj
     * @return {Observable}
     */
    getReportsPing(obj: any): Observable<any> {
        return this.http
            .post(this.payuReportsApiURI, JSON.stringify(obj), { headers: this.headers })
            .map(res => res.json())
            .catch(this.handleError);
    }

    /**
     * This function verify conectivity with Payu platform payments API 
     * @param  {any} obj
     * @return {Observable}
     */
    getPaymentsPing(obj: any): Observable<any> {
        return this.http
            .post(this.payuReportsApiURI, JSON.stringify(obj), { headers: this.headers })
            .map(res => res.json())
            .catch(this.handleError);
    }

    /**
     * This function gets client public ip
     * @return {Observable<any>}
     */
    getPublicIp(url: string) {
        return this.http.get(url).map(res => res.json()).catch(this.handleError);
    }

    /**
    * This function get CusPayInfo
    */
    getCusPayInfo(url: string): Observable<CusPayInfo> {
        return this.http.get(url).map(res => res.json() as CusPayInfo[]).catch(this.handleError);
    }

    /**
     * This function emits the error generated in http request
     * @return {Observable<any>}
     */
    private handleError(error: any): Observable<any> {
        return Observable.throw(error.message || error);
    }
}
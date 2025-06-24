import {Resolve, ResolveFn} from '@angular/router';
import {Observable} from "rxjs";
import {AdHistoryResponse} from "../../model/ad-history-response.model";
import {ApiService} from "../service/api.service";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AdHistoryResolver implements Resolve<AdHistoryResponse[]> {

  constructor(private apiService: ApiService) {}

  resolve(): Observable<AdHistoryResponse[]> {
    return this.apiService.getAdsHistory();
  }
}

import { Injectable } from '@angular/core';
import {AdGenerationRequest} from "../../model/ad-generation-request.model";
import {AdGenerationResponse} from "../../model/ad-generation-response.model";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AdHistoryResponse} from "../../model/ad-history-response.model";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly baseUrl = 'http://52.14.246.78:8080/api/ad-post';

  constructor(private http: HttpClient) {}

  generateAdImage(request: AdGenerationRequest): Observable<AdGenerationResponse> {
    return this.http.post<AdGenerationResponse>(`${this.baseUrl}/generate`, request);
  }

  getAdsHistory(): Observable<AdHistoryResponse[]> {
    return this.http.get<AdHistoryResponse[]>(`${this.baseUrl}/history`);
  }
}

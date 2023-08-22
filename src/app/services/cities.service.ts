import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { City } from '../entities/City';
import { Observable } from 'rxjs';
import {GlobalValues} from "../GlobalValues";
import { PaginationDto } from '../entities/PaginationDto';

@Injectable({
  providedIn: 'root'
})
export class CitiesService {

  constructor(private http: HttpClient) { }


  getCities(currentPage: number): Observable<City[]> {
    return this.http.get<City[]>(`${GlobalValues.baseUrl}/view/cities?page=${currentPage}`);
  }

  getCitiesPaginationData(): Observable<PaginationDto>{
    return this.http.get<PaginationDto>(`${GlobalValues.baseUrl}/public/cities/pagination`)
  }


}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterResponseDto } from 'src/app/entities/RegisterResponseDto';
import { RegisterRequestDto } from 'src/app/entities/RegisterRequestDto';
import { SendVerifyEmailResponseDto } from 'src/app/entities/SendVerifyEmailResponseDto';
import { SendVerifyEmailRequestDto } from 'src/app/entities/SendVerifyEmailRequestDto';
import { GlobalValues } from 'src/app/GlobalValues';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }



  register(body: RegisterRequestDto): Observable<RegisterResponseDto> {
    return this.http.post<RegisterResponseDto>(`${GlobalValues.baseUrl}/auth/register`, body);
  }
  resendRegisterEmail(body: SendVerifyEmailRequestDto): Observable<SendVerifyEmailResponseDto> {
    return this.http.post<SendVerifyEmailResponseDto>(`${GlobalValues.baseUrl}/auth/send/account/verify/link`, body);
  }

}

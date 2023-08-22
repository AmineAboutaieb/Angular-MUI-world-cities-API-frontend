import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { GlobalValues } from 'src/app/GlobalValues';
import { LoginRequestDto } from 'src/app/entities/LoginRequestDto';
import { LoginResponseDto } from 'src/app/entities/LoginResponseDto';
import { RefreshTokenRequestDto } from 'src/app/entities/RefreshTokenRequestDto';
import { RefreshTokenResponseDto } from 'src/app/entities/RefreshTokenResponseDto';
import { VerifyOTPRequestDto } from 'src/app/entities/VerifyOTPRequestDto';
import { VerifyOTPResponseDto } from 'src/app/entities/VerifyOTPResponseDto';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient, private router: Router) {}

  private ACCESS_TOKEN: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );

  private isLoggedIn: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(
    false
  );

  private loggedInUiLoading: BehaviorSubject<Boolean> =
    new BehaviorSubject<Boolean>(true);

  setAccessToken(accessToken: string) {
    this.ACCESS_TOKEN.next(accessToken);
  }

  setIsLoggedIn(loggedIn: Boolean) {
    this.isLoggedIn.next(loggedIn);
  }

  getAccessToken(): Observable<string> {
    return this.ACCESS_TOKEN;
  }

  getLoggedIn(): Observable<Boolean> {
    return this.isLoggedIn;
  }
  getLoggedInUi(): Observable<Boolean> {
    return this.loggedInUiLoading;
  }

  setLoggedInUi(luiLoading: Boolean) {
    return this.loggedInUiLoading.next(luiLoading);
  }

  getAccessTokenDirectly(): string {
    return this.ACCESS_TOKEN.getValue();
  }

  onLoginSetState(refreshToken: string, accessToken: string): void {
    localStorage.setItem('angular-refresh-token', refreshToken);
    this.setAccessToken(accessToken);
    this.setIsLoggedIn(true);
    this.router.navigateByUrl('/');
  }
  onStartupSetState(): void {
    let storageRefreshToken: string | null = localStorage.getItem(
      'angular-refresh-token'
    );
    if (storageRefreshToken != null && storageRefreshToken) {
      let refreshTokenRequestDto: RefreshTokenRequestDto = {
        refreshToken: storageRefreshToken,
      };
      this.refreshAccessToken(refreshTokenRequestDto).subscribe(
        (response) => {
          let accessToken = response.accessToken;
          this.setAccessToken(accessToken);
          this.setIsLoggedIn(true);
          this.loggedInUiLoading.next(false);
        },
        (error) => {
          this.localLogout();
          this.loggedInUiLoading.next(false);
        }
      );
    } else {
      this.setIsLoggedIn(false);
      this.setAccessToken('');
      localStorage.removeItem('angular-refresh-token');
      this.loggedInUiLoading.next(false);
    }
  }

  localLogout() {
    this.setIsLoggedIn(false);
    this.setAccessToken('');
    localStorage.removeItem('angular-refresh-token');
    this.router.navigateByUrl('/auth/login');
  }

  login(body: LoginRequestDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(
      `${GlobalValues.baseUrl}/auth/login`,
      body
    );
  }

  verifyOTP(body: VerifyOTPRequestDto): Observable<VerifyOTPResponseDto> {
    return this.http.post<VerifyOTPResponseDto>(
      `${GlobalValues.baseUrl}/auth/verify/otp/account`,
      body
    );
  }

  refreshAccessToken(
    body: RefreshTokenRequestDto
  ): Observable<RefreshTokenResponseDto> {
    return this.http.post<RefreshTokenResponseDto>(
      `${GlobalValues.baseUrl}/auth/refreshToken`,
      body
    );
  }
}

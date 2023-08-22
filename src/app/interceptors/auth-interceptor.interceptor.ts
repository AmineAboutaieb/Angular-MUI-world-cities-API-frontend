import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { LoginService } from '../services/auth/login/login.service';
import { RefreshTokenRequestDto } from '../entities/RefreshTokenRequestDto';

@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {

  constructor(private loginService: LoginService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authToken = this.loginService.getAccessTokenDirectly();
    let authReq = request;
    if(request.url.includes("/api/view")){
      authReq = request.clone({
        headers: request.headers.set('Content-Type', 'application/json')
        .set("Authorization", `Bearer ${authToken}`)

    });
    }
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        let statusCode = error.status;
        if (statusCode === 401 && !request.url.includes("/api/auth")) {
          let storageRefreshToken: string | null = localStorage.getItem("angular-refresh-token");
          if (storageRefreshToken != null) {
            let refreshTokenRequestDto: RefreshTokenRequestDto = {
              refreshToken: storageRefreshToken
            };
            return this.loginService.refreshAccessToken(refreshTokenRequestDto).pipe(
              switchMap((response) => {
                let accessToken = response.accessToken;
                this.loginService.setAccessToken(accessToken);

                return next.handle(request.clone({
                  headers: request.headers.set('Content-Type', 'application/json')
                    .set("Authorization", `Bearer ${accessToken}`)
                }));
              }),
              catchError((refreshError) => {
                console.log("REFRESH ERROR : ", refreshError);
                this.loginService.localLogout();
                return throwError(refreshError);
              })
            );
          } else {
            this.loginService.localLogout();
          }
        }

        return throwError(() => error);
      })
    );
  }
}

import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginRequestDto } from 'src/app/entities/LoginRequestDto';
import { LoginService } from 'src/app/services/auth/login/login.service';
import { ToastrService } from 'ngx-toastr';
import { LoginResponseDto } from 'src/app/entities/LoginResponseDto';
import { VerifyOTPRequestDto } from 'src/app/entities/VerifyOTPRequestDto';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(
    private loginService: LoginService,
    private toastr: ToastrService
  ) {}

  private noBlankRegexPattern: RegExp = RegExp(/^(\s+\S+\s*)*(?!\s).*$/);
  formData!: FormGroup;
  otpForm!: FormGroup;
  otpToken: string = '';

  showOtpForm: Boolean = false;

  enteredEmail?: string;

  loginLoading: boolean = false;
  showAfterLoginMessage: boolean = false;
  showLoginButton: boolean = true;

  errorMessage = {
    showMessage: false,
    errorMessage: '',
  };

  ngOnInit(): void {
    this.formData = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.pattern(this.noBlankRegexPattern),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(this.noBlankRegexPattern),
      ]),
    });
    this.otpForm = new FormGroup({
      otp: new FormControl('', [
        Validators.required,
        Validators.maxLength(6),
        Validators.pattern(this.noBlankRegexPattern),
      ]),
    });
  }

  handleSubmit() {
    if (this.formData.valid) {
      this.loginLoading = true;
      const loginRequestDto: LoginRequestDto = {
        username: this.formData.controls['email'].value,
        password: this.formData.controls['password'].value,
      };
      this.loginService.login(loginRequestDto).subscribe(
        (response: LoginResponseDto) => {
          this.loginLoading = false;
          console.log(response);
          this.otpToken = response.otpVerificationToken;
          this.toastr.info(
            'A verification code was sent to your email. Please enter it below.'
          );
          this.enteredEmail = this.formData.controls['email'].value;
          this.showOtpForm = true;
        },
        (error) => {
          this.loginLoading = false;
          if (error.status == 0) {
            this.toastr.error('An unknow error occured');
          } else {
            this.toastr.error(error.error.message);
          }
        }
      );
    } else {
    }
  }

  handleOtpSubmit() {
    if (this.otpForm.valid) {
      this.loginLoading = true;
      const verifyOTPRequestDto: VerifyOTPRequestDto = {
        otp: this.otpForm.controls['otp'].value,
        token: this.otpToken,
      };
      this.loginService.verifyOTP(verifyOTPRequestDto).subscribe(
        (response) => {
          this.loginLoading = false;
          this.toastr.success('Authenticated successfully !');
          let refreshToken = response.refreshToken;
          let accessToken = response.accessToken;
          // SET LOGIN STATE VALUES
          this.loginService.onLoginSetState(refreshToken, accessToken);
        },
        (error) => {
          this.loginLoading = false;
          if (error.status == 0) {
            this.toastr.error('An unknow error occured');
          } else {
            this.toastr.error(error.error.message);
          }
        }
      );
    }
  }
}

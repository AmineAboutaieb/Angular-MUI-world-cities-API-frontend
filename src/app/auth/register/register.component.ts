import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RegisterRequestDto } from 'src/app/entities/RegisterRequestDto';
import { SendVerifyEmailRequestDto } from 'src/app/entities/SendVerifyEmailRequestDto';
import { RegisterService } from 'src/app/services/auth/register/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(
    private registerService: RegisterService,
    private tostr: ToastrService
  ) {}

  private noBlankRegexPattern: RegExp = RegExp(/^(\s+\S+\s*)*(?!\s).*$/);
  formData!: FormGroup;

  captcha?: string;
  enteredEmail?: string;

  registerLoading: boolean = false;
  showAfterRegisterMessage: boolean = false;
  showRegisterButton: boolean = true;

  errorMessage = {
    showMessage: false,
    errorMessage: '',
  };

  ngOnInit(): void {
    this.formData = new FormGroup({
      firstname: new FormControl('', [
        Validators.required,
        Validators.pattern(this.noBlankRegexPattern),
      ]),
      lastname: new FormControl('', [
        Validators.required,
        Validators.pattern(this.noBlankRegexPattern),
      ]),
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
  }

  resolved(captchaResponse: string) {
    this.captcha = captchaResponse;
  }

  handleSubmit() {
    if (this.formData.valid && this.captcha != null) {
      this.enteredEmail = this.formData.controls['email'].value.trim();
      const registerRequestDto: RegisterRequestDto = {
        firstname: this.formData.controls['firstname'].value.trim(),
        lastname: this.formData.controls['lastname'].value.trim(),
        username: this.formData.controls['email'].value.trim(),
        password: this.formData.controls['password'].value.trim(),
        recaptchaToken: this.captcha,
      };
      this.errorMessage.showMessage = false;
      this.registerLoading = true;
      setTimeout(() => {
        this.registerService.register(registerRequestDto).subscribe(
          (response) => {
            this.registerLoading = false;
            this.showAfterRegisterMessage = true;
            this.showRegisterButton = false;
            this.resetCaptcha();
            this.tostr.success(
              'Account created successfully. A confirmation email was sent to your email'
            );
          },
          (error) => this.handleErrors(error)
        );
      }, 2000);
    } else {
      this.tostr.error('Registration data is not valid');
      this.resetCaptcha();
    }
  }

  handleResendRegisterVerify() {
    this.errorMessage.showMessage = false;
    this.showAfterRegisterMessage = false;
    this.registerLoading = true;
    const body: SendVerifyEmailRequestDto = {
      username: this.formData.controls['email'].value.trim(),
    };
    setTimeout(() => {
      this.registerService.resendRegisterEmail(body).subscribe(
        (response) => {
          this.registerLoading = false;
          this.showAfterRegisterMessage = true;
          this.tostr.success('A confirmation email was sent to your email');
        },
        (error) => this.handleErrors(error)
      );
    }, 2000);
  }

  handleErrors(error: HttpErrorResponse) {
    this.registerLoading = false;
    this.showRegisterButton = true;
    this.errorMessage.showMessage = true;
    this.showAfterRegisterMessage = false;
    if (error.status == 500 || error.status == 400) {
      this.tostr.error(error.error.message);
    } else if (error.status == 0) {
      this.tostr.error('An unknown error occured');
    } else {
      this.tostr.error('An error occured');
    }
    this.resetCaptcha();
  }

  resetCaptcha() {
    grecaptcha.reset();
    this.captcha = undefined;
  }
}

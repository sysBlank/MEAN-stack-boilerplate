import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/_services/auth.service';
import { StorageService } from 'src/app/core/_services/storage.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm!:FormGroup;
  returnUrl: any;
  validationErrors: boolean = false;
  emailError: string = '';
  errorMessage = '';
  roles: string[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb:FormBuilder,
    private authService: AuthService,
    private storageService: StorageService,
    private toastr: ToastrService
    ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(50)]],
    })
  }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get fc() {
    return this.forgotPasswordForm.controls;
  }

  ngSubmit(): void {
    if(this.forgotPasswordForm.invalid) {
      if(this.forgotPasswordForm.get('email')?.errors?.required) {
        this.emailError = 'Email is required';
      }
      if(this.forgotPasswordForm.get('email')?.errors?.minlength) {
        this.emailError = 'Email must be at least 6 characters';
      }
      if(this.forgotPasswordForm.get('email')?.errors?.maxlength) {
        this.emailError = 'Email must be less than 50 characters';
      }
      if(this.forgotPasswordForm.get('email')?.errors?.email) {
        this.emailError = 'Email must be a valid email';
      }
      console.log(this.forgotPasswordForm.get('email')?.errors)
      this.validationErrors = true;
      return;
    }
    const email = this.fc.email.value;

    this.authService.forgotPassword(email).subscribe({
      next: data => {
        this.validationErrors = false;
        this.router.navigate(['/auth/login']);
        this.toastr.success('Please check your email to reset your password', 'Success!');
      },
      error: err => {
        if(err.error.validationErrors) {
          this.toastr.error(err.error.validationErrors[0].msg, 'Unexpected error!');
          return;
        }
        this.toastr.error(err.error.message, 'Unexpected error!');
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }

}

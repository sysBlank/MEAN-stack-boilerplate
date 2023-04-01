import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/_services/auth.service';
import { StorageService } from 'src/app/core/_services/storage.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm!:FormGroup;
  returnUrl: any;
  validationErrors: boolean = false;
  emailError: string = '';
  passwordError: string = '';
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
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]],
      password_confirm: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]]
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
    return this.resetPasswordForm.controls;
  }

  ngSubmit(): void {
    // If passwords do not mach return error
    if(this.fc.password.value !== this.fc.password_confirm.value) {
      this.passwordError = 'Passwords do not match';
      this.validationErrors = true;
      return;
    }
    if(this.resetPasswordForm.invalid) {
      if(this.resetPasswordForm.get('password')?.errors?.required) {
        this.passwordError = 'Password is required';
      }
      if(this.resetPasswordForm.get('password')?.errors?.minlength) {
        this.passwordError = 'Password must be at least 8 characters';
      }
      if(this.resetPasswordForm.get('password')?.errors?.maxlength) {
        this.passwordError = 'Password must be less than 32 characters';
      }
      this.validationErrors = true;
      return;
    }
    const token = this.route.snapshot.params.token;
    const password = this.fc.password.value;

    this.authService.resetPassword(token, password).subscribe({
      next: data => {
        this.validationErrors = false;
        this.router.navigate(['/auth/login']);
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

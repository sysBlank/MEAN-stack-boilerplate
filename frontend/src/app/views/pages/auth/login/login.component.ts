import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/_services/auth.service';
import { StorageService } from 'src/app/core/_services/storage.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!:FormGroup;
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
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]]
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
    return this.loginForm.controls;
  }

  ngSubmit(): void {
    if(this.loginForm.invalid) {
      if(this.loginForm.get('email')?.errors?.required) {
        this.emailError = 'Email is required';
      }
      if(this.loginForm.get('email')?.errors?.minlength) {
        this.emailError = 'Email must be at least 6 characters';
      }
      if(this.loginForm.get('email')?.errors?.maxlength) {
        this.emailError = 'Email must be less than 50 characters';
      }
      if(this.loginForm.get('email')?.errors?.pattern) {
        this.emailError = 'Email must be a valid email';
      }
      if(this.loginForm.get('password')?.errors?.required) {
        this.passwordError = 'Password is required';
      }
      if(this.loginForm.get('password')?.errors?.minlength) {
        this.passwordError = 'Password must be at least 8 characters';
      }
      if(this.loginForm.get('password')?.errors?.maxlength) {
        this.passwordError = 'Password must be less than 32 characters';
      }
      this.validationErrors = true;
      return;
    }
    const email = this.fc.email.value;
    const password = this.fc.password.value;

    this.authService.login(email, password).subscribe({
      next: data => {
        this.storageService.setIsLoggedIn(true);
        this.validationErrors = false;
        this.router.navigate([this.returnUrl]);
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

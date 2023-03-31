import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/_services/auth.service';
import { StorageService } from 'src/app/core/_services/storage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm!:FormGroup;
  validationErrors: boolean = false;
  usernameError: string = '';
  emailError: string = '';
  passwordError: string = '';

  constructor(private router: Router,
    private fb:FormBuilder,
    private toastr: ToastrService,
    private storageService: StorageService,
    private authService: AuthService,
    ) {
      this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9]+$')]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]],
      password_confirm: [''],
    })
    }

 get fc() {
    return this.registerForm.controls;
  }

  ngOnInit(): void {
     if (this.storageService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    if(this.registerForm.invalid) {
      if(this.registerForm.get('username')?.errors?.required) {
        this.usernameError = 'Username is required';
      }
      if(this.registerForm.get('username')?.errors?.minlength) {
        this.usernameError = 'Username must be at least 6 characters';
      }
      if(this.registerForm.get('username')?.errors?.maxlength) {
        this.usernameError = 'Username must be less than 50 characters';
      }
      if(this.registerForm.get('username')?.errors?.pattern) {
        this.usernameError = 'Username must contain only letters and numbers';
      }
      if(this.registerForm.get('email')?.errors?.required) {
        this.emailError = 'Email is required';
      }
      if(this.registerForm.get('email')?.errors?.email) {
        this.emailError = 'Email is invalid';
      }
      if(this.registerForm.get('email')?.errors?.minlength) {
        this.emailError = 'Email must be at least 6 characters';
      }
      if(this.registerForm.get('email')?.errors?.maxlength) {
        this.emailError = 'Email must be less than 50 characters';
      }
      if(this.registerForm.get('password')?.errors?.required) {
        this.passwordError = 'Password is required';
      }
      if(this.registerForm.get('password')?.errors?.minlength) {
        this.passwordError = 'Password must be at least 8 characters';
      }
      if(this.registerForm.get('password')?.errors?.maxlength) {
        this.passwordError = 'Password must be less than 32 characters';
      }
      this.validationErrors = true;
      return;
    }
     const email = this.fc.email.value;
     const username = this.fc.username.value;
     const password = this.fc.password.value;
     const password_confirm = this.fc.password_confirm.value;
    if(password !== password_confirm) {
      this.toastr.error('Passwords do not match', 'Unexpected error!');
      return;
    }

    this.authService.register(username, email, password).subscribe({
      next: data => {
        this.validationErrors = false;
        this.router.navigate(['/auth/login']);
        this.toastr.success('Registration successful');
      },
      error: err => {
        console.log(err);
        if(err.error.validationErrors) {
          this.toastr.error(err.error.validationErrors[0].msg, 'Unexpected error!');
          return;
        }
        this.toastr.error(err.error.message, 'Unexpected error!');
      }
    });
  }

}

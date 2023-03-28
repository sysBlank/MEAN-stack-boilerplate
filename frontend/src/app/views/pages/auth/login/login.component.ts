import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/_services/auth.service';
import { StorageService } from 'src/app/core/_services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!:FormGroup;
  returnUrl: any;

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private fb:FormBuilder, private authService: AuthService, private storageService: StorageService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]]
    })
  }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
    }
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get fc() {
    return this.loginForm.controls;
  }

  ngSubmit(): void {
    if(this.loginForm.invalid) {
      console.log('error')
      // Console log form validation errors
      console.log(this.loginForm);
      return;
    }
    const email = this.fc.email.value;
    const password = this.fc.password.value;

    this.authService.login(email, password).subscribe({
      next: data => {
        console.log(data)
        this.storageService.saveUser(data.body.data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.storageService.getUser().roles;
        this.reloadPage();
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
        console.log(err)
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }

}

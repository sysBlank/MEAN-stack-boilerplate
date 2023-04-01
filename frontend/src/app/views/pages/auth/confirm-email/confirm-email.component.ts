import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/_services/auth.service';
import { StorageService } from 'src/app/core/_services/storage.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private toastr: ToastrService
    ) {}

  ngOnInit(): void {
    // check if token has been passed in the url
    if (this.route.snapshot.params.token) {
      const token = this.route.snapshot.params.token;
      this.authService.confirmEmail(token).subscribe({
        next: data => {
          this.toastr.success('Email confirmed successfully');
          this.router.navigate(['/']);
        },
        error: err => {
          this.toastr.error(err.error.message);
          this.router.navigate(['/']);
        }
      })
    }
  }

  reloadPage(): void {
    window.location.reload();
  }

}

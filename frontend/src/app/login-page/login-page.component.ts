import {Component, OnDestroy, OnInit} from '@angular/core';

import {CommonModule} from "@angular/common";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatTextColumn} from "@angular/material/table";
import {MatAnchor, MatButton} from "@angular/material/button";
import {ActivatedRoute, Params, Router, RouterLink} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {Subscription} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {User} from "../interfaces";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    MatLabel,
    MatFormField,
    MatInput,
    MatTextColumn,
    MatButton,
    MatAnchor,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService, private router: Router,  private route: ActivatedRoute, private snackBar: MatSnackBar) {
  }
  form: FormGroup = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    }
  )
  lSub: Subscription = new Subscription();
  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['sessionFailed']) {
        this.router.navigate(['/login'])
        localStorage.clear()
      }
    });
  }
  ngOnDestroy() {
    if(this.lSub) {
      this.lSub.unsubscribe()
    }
  }
  onSubmit() {
    this.lSub = this.authService.login(this.form.value).subscribe({
      next: (value: {token: string}) => {
        this.router.navigate(['/categories'])

        },
      error: err => {
        if(err.status == 409) {
          this.snackBar.open(err.error.message, "Гаразд!")
        }
        this.form.enable();
      }
      }
    )
  }
}

import {Component, OnDestroy} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {Subscription} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    NgIf,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent implements OnDestroy {
  form: FormGroup = new FormGroup({
    username: new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z0-9]*'), Validators.minLength(3), Validators.maxLength(10)]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)])
  });
  rSub = new Subscription()
    constructor(private authService: AuthService, private router: Router, private _snackBar: MatSnackBar) {}
  ngOnDestroy() {
    if(this.rSub) {
      this.rSub.unsubscribe()
    }
  }

  onSubmit() {
    this.rSub = this.authService.register(this.form.value).subscribe({
      next: userData => {
        this.router.navigate(['/login'])
        this._snackBar.open("Реєстрація пройшла успішно", "Гаразд!");
      },
      error: err => {
        if (err.status === 409) {
          this._snackBar.open(err.error.message, "Гаразд!");
        }
        this.form.enable()
      }
    })
  }
}


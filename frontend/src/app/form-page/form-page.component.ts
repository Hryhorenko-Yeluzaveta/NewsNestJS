import { Component } from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {User} from "../interfaces";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormService} from "../services/form.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-form-page',
  standalone: true,
  imports: [
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule
  ],
  templateUrl: './form-page.component.html',
  styleUrl: './form-page.component.css'
})
export class FormPageComponent {

  constructor(private authService: AuthService, private formService: FormService, private router: Router, private _snackBar: MatSnackBar) {}
  form: FormGroup = new FormGroup({
    text: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(1000)])
  });
  onSubmit() {
    this.authService.getCurrentUser().subscribe({
      next: (user : User) => {
        const userId = user.id
        const messageData = {
          ...this.form.value,
          user: userId
        }
        this.formService.createMessage(messageData).subscribe({
        next: () => {
          window.history.back();
          this._snackBar.open("Форма зворотнього зв'зку була успішно відправлена", "Гаразд!")
        },
          error: err => {
          throw new Error(err.message)
          }
        })
      },
      error: () => {
        throw new Error('Користувач не знайдений')
      }
    })
  }
}

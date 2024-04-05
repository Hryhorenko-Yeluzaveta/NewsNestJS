import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {MatButton} from "@angular/material/button";
import {Observable} from "rxjs";
import {Category, User} from "../interfaces";
import {CategoryService} from "../services/category.service";
import {
  MatCardModule
} from "@angular/material/card";
import {AsyncPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {NewsService} from "../services/news.service";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatPaginator, PageEvent} from "@angular/material/paginator";

const STEP = 3
@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [
    MatCardModule,
    MatButton,
    AsyncPipe,
    NgIf,
    MatProgressSpinner,
    RouterLink,
    NgForOf,
    DatePipe,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatPaginator
  ],
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.css'
})
export class CategoriesPageComponent implements OnInit {
  constructor( private router: Router, private categoryService: CategoryService, private _snackBar: MatSnackBar) {
  }

  categories$: Observable<Category[]> = new Observable<Category[]>()
  activeCard: boolean = false
  page: number = 1
  limit: number = STEP
  categories: Category[] = []

  form: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.maxLength(30), Validators.minLength(2), Validators.required])
  })
  loading: boolean = false;

  onSubmit() {
    this.categoryService.createCategory(this.form.value).subscribe({
        next: (category: Category) => {
          this.router.navigate(['/categories', category.id])
          this._snackBar.open('Категорія була успішно збережена!', 'Добре!')
        },
        error: err => {
          this._snackBar.open('Сталася помилка, спробуйте ще раз!', 'Добре!')
        }
      }
    )
  }

  ngOnInit() {
    this.fetchCategories()
  }
  private fetchCategories() {
    const params = {
      page: this.page,
      limit: this.limit
    }
    this.categories$ = this.categoryService.fetchWithPagination(params)
    this.categories$.subscribe({
      next: (categories) => {
        this.categories = categories
        this.loading = false
      }
    })
  }
  getFullImageUrl(filename: string | undefined): string {
    return `http://localhost:3000/news/${filename}`;
  }

  loadNextCategories() {
    this.page += 1
    this.loading = true
    this.fetchCategories()
  }

  loadPreviousCategories() {
    this.page -= 1
    this.loading = true
    this.fetchCategories()
  }
}

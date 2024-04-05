import {Component, OnInit} from '@angular/core';
import {AsyncPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardImage,
  MatCardSubtitle,
  MatCardTitle
} from "@angular/material/card";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {ActivatedRoute, Params, Router, RouterLink} from "@angular/router";
import {NewsService} from "../services/news.service";
import {Observable, switchMap} from "rxjs";
import {Category, News, User} from "../interfaces";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {AuthService} from "../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
const STEP = 15
@Component({
  selector: 'app-category-news-page',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButton,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardImage,
    MatCardTitle,
    MatProgressSpinner,
    NgForOf,
    NgIf,
    RouterLink,
    MatCardSubtitle,
    DatePipe,
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatPaginator
  ],
  templateUrl: './category-news-page.component.html',
  styleUrl: './category-news-page.component.css'
})
export class CategoryNewsPageComponent implements OnInit {

  news$: Observable<News[]> = new Observable<News[]>()
  activeCard: boolean = false
  image: File | null = null
  imagePreview: string | ArrayBuffer | null | undefined;
  loading: boolean = false

  page: number = 1
  limit: number = STEP
  news: News[] = []
  form: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.maxLength(50), Validators.minLength(3)]),
    text: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(1000)])
  })

  constructor(private authService: AuthService, private newsService: NewsService, private router: Router, private _snackBar: MatSnackBar, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.fetchNewsWithPag()
  }

  fetchNewsWithPag() {
    const pagParams = {
      page: this.page,
      limit: this.limit
    }
    this.news$ = this.route.params.pipe(
      switchMap((params: Params) => {
        return this.newsService.fetchForPag(+params['id'], pagParams);
      })
    );
    this.news$.subscribe({
      next:  (news) => {
        this.news = news
        this.loading = false
      },
    })
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    this.image = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  getFullImageUrl(filename: string | undefined): string {
    return `http://localhost:3000/news/${filename}`;
  }

  onSubmit() {
    this.authService.getCurrentUser().subscribe({
      next: (user: User) => {
        const userId = user.id;
        const categoryId = this.route.snapshot.params['id'];
        const formData = new FormData();
        if (this.image) {
          formData.append('imageSrc', this.image);
        }
        formData.append('name', this.form.get('name')?.value);
        formData.append('text', this.form.get('text')?.value);
        if (userId) {
          formData.append('user', userId.toString());
        } else {
          throw new Error('Користувач не знайдений')
        }
        formData.append('category', categoryId.toString());

        this.newsService.saveNews(formData, categoryId).subscribe({
          next: (news: News) => {
            this.router.navigate(['/news', news.id]);
            this._snackBar.open('Новину було успішно збережено', 'Гаразд!');
            this.activeCard = false;
          },
          error: (err: any) => {
            this._snackBar.open(`Помилка при збереженні новини: ${err}`, 'Гаразд!');
          }
        });

      },
      error: err => {
        console.error('Помилка при отриманні поточного користувача:', err);
      }
    });
  }

  userSubscribe() {
    this.authService.getCurrentUser().subscribe({
      next: (user : User) => {
        const categoryId = this.route.snapshot.params['id']
        this.authService.userSubscribeCategory(categoryId, user).subscribe({
          next: () => {
            this._snackBar.open('Ви успішно підписалися на категорію', 'Гаразд!')
          },
          error: err => {
            throw new Error(err)
          }
        })
      },
      error: err => {
        throw new Error('Користувача не знайдено. ' + err)
      }
    })
  }

  loadPreviousCategories() {
    this.page -= 1
    this.loading = true
    this.fetchNewsWithPag()
  }

  loadNextCategories() {
    this.page += 1
    this.loading = true
    this.fetchNewsWithPag()
  }
}

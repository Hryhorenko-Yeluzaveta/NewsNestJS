import {Component, OnInit} from '@angular/core';
import {NewsService} from "../services/news.service";
import {Observable} from "rxjs";
import {News, User} from "../interfaces";
import {Comment} from "../interfaces";
import {ActivatedRoute, Params, Router, RouterLink} from "@angular/router";
import {MatButton} from "@angular/material/button";
import {AsyncPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-news-page',
  standalone: true,
  imports: [
    MatButton,
    RouterLink,
    AsyncPipe,
    NgIf,
    MatProgressSpinner,
    NgForOf,
    DatePipe,
    MatInput,
    MatLabel,
    MatFormField,
    ReactiveFormsModule
  ],
  templateUrl: './news-page.component.html',
  styleUrl: './news-page.component.css'
})
export class NewsPageComponent implements OnInit {
  constructor(private newsService: NewsService, private route: ActivatedRoute, private router: Router, private _snackBar: MatSnackBar, private authService: AuthService) {
  }

  news$: Observable<News> = new Observable<News>();
  comments$: Observable<Comment[]> = new Observable<Comment[]>();
  form: FormGroup = new FormGroup({
    text: new FormControl(null, [Validators.required, Validators.maxLength(100)])
  });

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const newsId = +params['id'];

      const news$ = this.newsService.getOneById(newsId);
      const comments$ = this.newsService.getComments(newsId);

      this.news$ = news$;
      this.comments$ = comments$;
    });
  }

  getFullImageUrl(filename: string | undefined): string {
    return `http://localhost:3000/news/${filename}`;
  }

  onSubmit() {
    this.authService.getCurrentUser().subscribe({
      next: (user: User) => {
        const userId = user.id;
        const newsId = this.route.snapshot.params['id'];
        const commentData = {
          ...this.form.value,
          user: userId,
          news: newsId
        };

        this.newsService.saveComment(commentData, newsId).subscribe({
          next: comment => {
            this.router.navigate([this.router.url]);
            this._snackBar.open('Коментар було успішно відправлено. Оновіть сторінку', 'Гаразд!');
          },
          error: () => {
            this._snackBar.open('Помилка при збереженні коментаря', 'Гаразд!');
          }
        });
      },
      error: err => {
        console.error('Помилка при отриманні поточного користувача:', err);
      }
    });
  }
}

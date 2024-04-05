import {Component, OnInit} from '@angular/core';
import {AsyncPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {Observable, switchMap} from "rxjs";
import {News} from "../interfaces";
import {NewsService} from "../services/news.service";
import {ActivatedRoute, Params, RouterLink} from "@angular/router";

@Component({
  selector: 'app-author-page',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    FormsModule,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatProgressSpinner,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './author-page.component.html',
  styleUrl: './author-page.component.css'
})
export class AuthorPageComponent implements OnInit {
  news$: Observable<News[]> = new Observable<News[]>()

  constructor(private newsService: NewsService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.news$ = this.route.params.pipe(
      switchMap((params: Params) => {
        return this.newsService.getNewsByUserId(+params['id']);
      })
    )
  }
  getFullImageUrl(filename: string | undefined): string {
    return `http://localhost:3000/news/${filename}`;
  }
}

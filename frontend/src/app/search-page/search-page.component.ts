import {Component, OnInit} from '@angular/core';
import {MatButton, MatFabButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";
import {MatChipListbox, MatChipOption} from "@angular/material/chips";
import {AsyncPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {CategoryService} from "../services/category.service";
import {map, Observable, startWith} from "rxjs";
import {Category, News} from "../interfaces";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {RouterLink} from "@angular/router";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {NewsService} from "../services/news.service";
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardImage,
  MatCardTitle
} from "@angular/material/card";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatIcon,
    MatFabButton,
    MatTooltip,
    MatChipListbox,
    MatChipOption,
    NgIf,
    AsyncPipe,
    MatProgressSpinner,
    NgForOf,
    RouterLink,
    MatRadioGroup,
    MatRadioButton,
    DatePipe,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardImage,
    MatCardTitle,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    FormsModule
  ],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css'
})
export class SearchPageComponent implements OnInit {
  categories$: Observable<Category[]> = new Observable<Category[]>()
  newsByCategory$: Observable<News[]> = new Observable<News[]>()
  allNews$: Observable<News[]> = new Observable<News[]>()
  oneNews$: Observable<News> = new Observable<News>()
  oneNew: boolean = false
  toLoad: boolean = false
  openFilter: boolean = false
  errorOccurred: boolean = false;

  foundNews?: News[]
  options: string[] = [];
  form: FormGroup = new FormGroup({
    newsName: new FormControl('')
  });

  filteredOptions: Observable<string[]> = new Observable<string[]>();

  constructor(private categoryService: CategoryService, private newsService: NewsService, private _snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.categories$ = this.categoryService.fetch()
    this.allNews$ = this.newsService.fetch()
    this.allNews$.subscribe({
      next: news => {
        this.options = news.map(newsItem => newsItem.name)
      }
    })

    // @ts-ignore
    this.filteredOptions = this.form.get('newsName').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }
  private _filter(value: any): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
  loadNews(categoryId: number | undefined) {
    this.openFilter = false;
    this.errorOccurred = false;
    this.newsByCategory$ = this.newsService.fetchByCategory(categoryId);
    this.newsByCategory$.subscribe({
      next: news => {
        this.oneNew = false;
        this.foundNews = news;
        this.options = news.map(newsItem => newsItem.name);
        // @ts-ignore
        const currentValue = this.form.get('newsName').value;
        // @ts-ignore
        this.form.get('newsName').patchValue(currentValue);
      }
    });
  }

  getFullImageUrl(filename: string | undefined): string {
    return `http://localhost:3000/news/${filename}`;
  }

  OnSubmit() {
    const newsNameValue = this.form.value.newsName;
    this.toLoad = false
    this.oneNew = true
    this.errorOccurred = false;
    if (newsNameValue) {
      this.oneNews$ =  this.newsService.getOneByName(newsNameValue)
        this.oneNews$.subscribe({
        error: () => {
          this.errorOccurred = true;
        }
      });
    } else {
      this.errorOccurred = true;
      this._snackBar.open("Будь ласка, введіть назву новини", "Гаразд!");
    }
  }
}

import {Routes} from '@angular/router';
import {LoginPageComponent} from "./login-page/login-page.component";
import {CategoriesPageComponent} from "./categories-page/categories-page.component";
import {SiteLayoutComponent} from "../layouts/site-layout/site-layout.component";
import {AuthGuard} from "./shared/auth.guard";
import {CategoryNewsPageComponent} from "./category-news-page/category-news-page.component";
import {RegisterPageComponent} from "./register-page/register-page.component";
import {NewsPageComponent} from "./news-page/news-page.component";
import {AuthorPageComponent} from "./author-page/author-page.component";
import {FormPageComponent} from "./form-page/form-page.component";
import {MessagesPageComponent} from "./messages-page/messages-page.component";
import {SearchPageComponent} from "./search-page/search-page.component";

export const routes: Routes = [
      {path: '', redirectTo: '/login', pathMatch: 'full'},
      {path: 'login', component: LoginPageComponent},
      {path: 'register', component: RegisterPageComponent},
  {
    path: '', component: SiteLayoutComponent, canActivate: [AuthGuard], children: [
      {path: 'categories', component: CategoriesPageComponent},
      {path: 'categories/:id', component: CategoryNewsPageComponent},
      {path: 'news/:id', component: NewsPageComponent},
      {path: 'author/:id', component: AuthorPageComponent},
      {path: 'form', component: FormPageComponent},
      {path: 'messages', component: MessagesPageComponent},
      {path: 'search', component: SearchPageComponent}
      ]
  }
];

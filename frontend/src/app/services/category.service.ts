import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Category} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class CategoryService{
  constructor(private http: HttpClient) {
  }
  fetchWithPagination(params: any = {}): Observable<Category[]> {
    return this.http.get<Category[]>('http://localhost:3000/category/', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>('http://localhost:3000/category', category)
  }

  fetch() : Observable<Category[]> {
    return this.http.get<Category[]>('http://localhost:3000/category/all')
  }
}

import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Comment, News} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  constructor(private http: HttpClient) {
  }
  fetchForPag(categoryId: number | undefined, params: any): Observable<News[]> {
    return this.http.get<News[]>(`http://localhost:3000/news/category/${categoryId}`, {
     params: new HttpParams({
       fromObject: params
     })
    })
  }
  fetch() : Observable<News[]> {
    return this.http.get<News[]>('http://localhost:3000/news')
  }
  fetchByCategory(categoryId: number | undefined) : Observable<News[]> {
    return this.http.get<News[]>(`http://localhost:3000/news/all/${categoryId}`)
  }
  getComments(newsId: number) : Observable<Comment[]> {
    return this.http.get<Comment[]>(`http://localhost:3000/comment/${newsId}`)
  }
  getOneById(newsId: number) : Observable<News> {
    return this.http.get<News>(`http://localhost:3000/news/${newsId}`)
  }
  getOneByName(newsName: string) : Observable<News> {
    return this.http.get<News>(`http://localhost:3000/news/name/${newsName}`)
  }
  saveComment(comment: Comment, newsId: number) : Observable<Comment> {
    return this.http.post<Comment>(`http://localhost:3000/comment/${newsId}`, comment)
  }
  getNewsByUserId(authorId: number) : Observable<News[]>{
    return this.http.get<News[]>(`http://localhost:3000/news/author/${authorId}`)
  }


  saveNews(newNews: FormData, categoryId: number)  : Observable<News>{
    return this.http.post<News>(`http://localhost:3000/news/${categoryId}`, newNews)
  }
}

import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {User} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token = ''
  constructor(private http: HttpClient) {
  }
  login(user: User): Observable<{ token: string }> {
    return this.http.post<{token: string}>('http://localhost:3000/auth/login', user)
      .pipe(
        tap(
          ({token}) => {
            localStorage.setItem('auth-token', token)
            this.setToken(token)
          }
        )
      )
  }
  register(user: User): Observable<User> {
    return this.http.post<User>('http://localhost:3000/user/register', user)
  }
  getToken(): string | null {
    return localStorage.getItem('auth-token');
  }
  setToken(token: string) {
    this.token = token
  }
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
  logOut(): void {
    localStorage.removeItem('auth-token');
  }
  getCurrentUser(): Observable<User> {
    return this.http.get<User>('http://localhost:3000/user/');
  }

  userSubscribeCategory(categoryId: number, user: User)  {
    return this.http.post(`http://localhost:3000/user/subscribe/${categoryId}`, user)
  }
}

import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Message} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class FormService {
  constructor(private http: HttpClient) {
  }

  createMessage(messageData: Message): Observable<Message> {
    return this.http.post<Message>('http://localhost:3000/messages', messageData)
  }

  fetch(): Observable<Message[]> {
    return this.http.get<Message[]>('http://localhost:3000/messages')
  }
}

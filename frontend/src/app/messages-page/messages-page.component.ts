import {Component, OnInit} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {FormService} from "../services/form.service";
import {Observable} from "rxjs";
import {Message} from "../interfaces";
import {AsyncPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-messages-page',
  standalone: true,
  imports: [
    MatCard,
    MatCardTitle,
    MatCardHeader,
    MatCardContent,
    MatButton,
    NgIf,
    AsyncPipe,
    MatProgressSpinner,
    NgForOf,
    DatePipe
  ],
  templateUrl: './messages-page.component.html',
  styleUrl: './messages-page.component.css'
})
export class MessagesPageComponent implements OnInit{
  constructor(private formService: FormService) {}
  message$: Observable<Message[]> = new Observable<Message[]>()

  ngOnInit() {
    this.message$ = this.formService.fetch()
  }

}

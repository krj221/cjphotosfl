import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reload-page',
  templateUrl: './reload-page.component.html',
  styleUrls: ['./reload-page.component.css']
})
export class ReloadPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  reloadPage(): void {
    window.location.reload();
  }

}

import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentYear: number; // Declare a property to hold the current year

  constructor() {
    this.currentYear = new Date().getFullYear(); // Initialize it in the constructor
  }

}

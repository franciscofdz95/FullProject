import { Component, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
    ngOnInit(): void {
      
  }

  async executeTab(): Promise<void> {
    console.log('value param: ');
  }
  
}

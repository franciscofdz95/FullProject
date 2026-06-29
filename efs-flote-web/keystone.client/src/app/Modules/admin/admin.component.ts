import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { EmailConfigComponent } from './email-configuration/email-config.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, EmailConfigComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  activeTab: string = 'logged'; // Default active tab
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  setActiveTab(tabName: string): void {
    this.activeTab = tabName;
  }
}

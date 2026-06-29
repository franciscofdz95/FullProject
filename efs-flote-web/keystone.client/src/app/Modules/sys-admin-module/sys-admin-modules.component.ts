import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { EmailConfigComponent } from '../admin/email-configuration/email-config.component';

@Component({
  standalone: true,
  selector: 'app-sys-admin-modules',
  imports: [
    CommonModule,
    EmailConfigComponent
  ],
  templateUrl: './sys-admin-modules.component.html',
  styleUrl: './sys-admin-modules.component.css'
})
export class SysAdminModulesComponent implements OnInit {
  activeTab: string = 'uploaded-contracts'; // Default active tab
  constructor(private http: HttpClient) { }
  ngOnInit(): void {
  }

  setActiveTab(tabName: string): void {
    this.activeTab = tabName;
  }
}

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EmailConfigComponent } from '../admin/email-configuration/email-config.component';
import { AputFilesComponent } from '../aput-files/aput-files.component';

@Component({
  standalone: true,
  selector: 'app-sys-admin-modules',
  imports: [
    CommonModule,
    MatDialogModule,
    EmailConfigComponent,
    AputFilesComponent
  ],
  templateUrl: './sys-admin-modules.component.html',
  styleUrl: './sys-admin-modules.component.css'
})
export class SysAdminModulesComponent implements OnInit {
  activeTab: string = 'uploaded-contracts'; // Default active tab
  constructor(private http: HttpClient, private dialog: MatDialog) { }
  ngOnInit(): void {
  }

  setActiveTab(tabName: string): void {
    this.activeTab = tabName;
  }

  openAputFiles(): void {
    this.dialog.open(AputFilesComponent, {
      width: '80vw',
      height: '85vh',
      maxWidth: '90vw',
      panelClass: 'aput-files-dialog-panel',
      autoFocus: false
    });
  }
}

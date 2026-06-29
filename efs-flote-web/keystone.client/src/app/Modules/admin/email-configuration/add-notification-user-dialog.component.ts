import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../Service/admin.service';

@Component({
  selector: 'app-add-notification-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  template: `
  <div class="container mt-3">
    <h4>Add Notification User</h4>

    <div *ngIf="isLoading" class="text-center text-muted my-3">
      <i class="fa fa-spinner fa-spin fa-2x"></i>
      <br />Loading users...
    </div>

    <div *ngIf="!isLoading">
      <div class="form-group mb-3">
        <label>User</label>
        <select class="form-select" [(ngModel)]="userId">
          <option *ngFor="let user of users" [value]="user.id">{{ user.value }}</option>
        </select>
      </div>

      <div class="form-group mb-3">
        <label>Recipient Type</label>
        <select class="form-select" [(ngModel)]="recipientType">
          <option [value]="1">To</option>
          <option [value]="2">CC</option>
          <option [value]="3">BCC</option>
        </select>
      </div>

      <div class="text-end">
        <button class="btn btn-secondary me-2" (click)="dialogRef.close()">Cancel</button>
        <button class="btn btn-success" (click)="save()">Add</button>
      </div>
    </div>
    </div>
  `
})
export class AddNotificationUserDialogComponent implements OnInit {
  users: any[] = [];
  userId!: number;
  recipientType: number = 1;
  isLoading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private adminService: AdminService,
    public dialogRef: MatDialogRef<AddNotificationUserDialogComponent>
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
  }

  save(): void {
    if (!this.userId) {
      alert('Please select a user.');
      return;
    }

    const payload = {
      notificationConfigurationId: null,
      emailConfigurationId: this.data.configId,
      userId: this.userId,
      recipientTypeId: this.recipientType
    };

    this.adminService.addNotificationEmailConfig(payload).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => console.error('Error adding user', err)
    });
  }
}

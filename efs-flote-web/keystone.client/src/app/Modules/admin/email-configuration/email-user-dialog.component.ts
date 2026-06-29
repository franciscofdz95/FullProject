import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdminService } from '../Service/admin.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AddNotificationUserDialogComponent } from './add-notification-user-dialog.component';

@Component({
  selector: 'app-email-user-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './email-user-dialog.component.html',
  styleUrls: ['./email-user-dialog.component.css']
})
export class EmailUserDialogComponent implements OnInit {
  users: any[] = [];
  isLoading = true;
  private hasChanges = false;

  constructor(
    private dialogRef: MatDialogRef<EmailUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private adminService: AdminService,    
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    if (this.data) {
      //this.loadUsers();
    }
  }

  loadUsers(): void {
    this.isLoading = true;
    /*this.adminService.getNotificationEmailConfig(this.data.email_Configuration_ID).subscribe({
      next: (res: any) => {
        this.users = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading users', err);
        this.isLoading = false;
      }
    });*/
  }

  removeUser(user: any): void {
    /*if (confirm(`Remove ${user.user_Email} from this configuration?`)) {
      this.adminService.deleteNotificationEmailConfig(user.email_Notification_ID).subscribe({
        next: () => {
          this.hasChanges = true;
          this.loadUsers();
        },
        error: (err) => console.error('Error deleting user', err)
      });
    }*/
  }

  openAddUser(): void {
    const dialogRef = this.dialog.open(AddNotificationUserDialogComponent, {
      width: '40vw',
      height: '40vh',
      data: { configId: this.data.email_Configuration_ID }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.hasChanges = true;
        this.loadUsers();
      }
    });
  }

  ngOnDestroy(): void {
    this.closeModal();
  }

  closeModal(): void {
    this.dialogRef.close(this.hasChanges);
  }
}

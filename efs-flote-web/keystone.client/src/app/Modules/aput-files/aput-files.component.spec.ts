import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AputFilesComponent } from './aput-files.component';

describe('AputFilesComponent', () => {
  let component: AputFilesComponent;
  let fixture: ComponentFixture<AputFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AputFilesComponent, HttpClientTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => { } } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AputFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

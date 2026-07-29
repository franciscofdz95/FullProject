import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ValuePayLocationsAdminComponent } from './value-pay-locations-admin.component';

describe('ValuePayLocationsAdminComponent', () => {
  let component: ValuePayLocationsAdminComponent;
  let fixture: ComponentFixture<ValuePayLocationsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValuePayLocationsAdminComponent, HttpClientTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => { } } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValuePayLocationsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog when Home is clicked', () => {
    const dialogRef = TestBed.inject(MatDialogRef);
    spyOn(dialogRef, 'close');
    component.goHome();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should reject update when required fields are missing', () => {
    const notificationService = (component as any).notificationService;
    spyOn(notificationService, 'error');
    const service = (component as any).valuePayLocationsAdminService;
    spyOn(service, 'updateLocation');

    component.updateRow({ req_location: 'LOC1', invoice_type_code: '', value_pay_location: 'VAL1' });

    expect(notificationService.error).toHaveBeenCalled();
    expect(service.updateLocation).not.toHaveBeenCalled();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorStatementSummaryComponent } from './vendor-statement-summary.component';

describe('VendorStatementSummaryComponent', () => {
  let component: VendorStatementSummaryComponent;
  let fixture: ComponentFixture<VendorStatementSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VendorStatementSummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VendorStatementSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

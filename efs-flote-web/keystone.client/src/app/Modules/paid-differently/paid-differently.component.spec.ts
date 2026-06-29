import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidDifferentlyComponent } from './paid-differently.component';

describe('PaidDifferentlyComponent', () => {
  let component: PaidDifferentlyComponent;
  let fixture: ComponentFixture<PaidDifferentlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaidDifferentlyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaidDifferentlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

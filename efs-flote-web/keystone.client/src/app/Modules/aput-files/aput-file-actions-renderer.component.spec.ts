import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AputFileActionsRendererComponent } from './aput-file-actions-renderer.component';

describe('AputFileActionsRendererComponent', () => {
  let component: AputFileActionsRendererComponent;
  let fixture: ComponentFixture<AputFileActionsRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AputFileActionsRendererComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AputFileActionsRendererComponent);
    component = fixture.componentInstance;
    component.agInit({ data: { fileName: 'test.csv' }, onDownload: () => { } });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

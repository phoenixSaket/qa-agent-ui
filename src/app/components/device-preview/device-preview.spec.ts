import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DevicePreviewComponent } from './device-preview';
import { SocketService } from '../../services/socket';

describe('DevicePreviewComponent', () => {
  let component: DevicePreviewComponent;
  let fixture: ComponentFixture<DevicePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevicePreviewComponent],
      providers: [
        {
          provide: SocketService,
          useValue: {
            uiDump: () => '',
            screenshot: () => '',
            highlightTarget: () => null
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DevicePreviewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

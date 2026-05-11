import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogStreamComponent } from './log-stream';
import { SocketService } from '../../services/socket';

describe('LogStreamComponent', () => {
  let component: LogStreamComponent;
  let fixture: ComponentFixture<LogStreamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogStreamComponent],
      providers: [
        {
          provide: SocketService,
          useValue: {
            logs: () => []
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LogStreamComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

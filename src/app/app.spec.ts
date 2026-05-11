import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app';
import { SocketService } from './services/socket';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        {
          provide: SocketService,
          useValue: {
            frontendState: () => ({ running: true }),
            backendState: () => ({ running: true }),
            agentMessages: () => [],
            agentThinking: () => null,
            logs: () => [],
            knowledgeData: () => '',
            uiDump: () => '',
            screenshot: () => '',
            highlightTarget: () => null
          }
        }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Agent Orchestrator');
  });
});

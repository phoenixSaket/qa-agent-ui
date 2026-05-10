import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KnowledgeCenterComponent } from './knowledge-center';
import { SocketService } from '../../services/socket';

describe('KnowledgeCenterComponent', () => {
  let component: KnowledgeCenterComponent;
  let fixture: ComponentFixture<KnowledgeCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KnowledgeCenterComponent],
      providers: [
        {
          provide: SocketService,
          useValue: {
            knowledgeData: () => ''
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(KnowledgeCenterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

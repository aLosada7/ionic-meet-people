import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MatchDetailPage } from './match-detail.page';

describe('MatchDetailPage', () => {
  let component: MatchDetailPage;
  let fixture: ComponentFixture<MatchDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MatchDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

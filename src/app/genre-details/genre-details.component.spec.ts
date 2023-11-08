import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenreDetailsComponent } from './genre-details.component';

describe('GenreDetailsComponent', () => {
  let component: GenreDetailsComponent;
  let fixture: ComponentFixture<GenreDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenreDetailsComponent]
    });
    fixture = TestBed.createComponent(GenreDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Component } from '@angular/core';

import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';

import { AppComponent } from './app.component';

@Component({ template: '' })
class DummyComponent1 {}

@Component({ template: '' })
class DummyComponent2 {}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatToolbarModule,
        MatButtonModule,
        RouterTestingModule.withRoutes([
          { path: '', component: DummyComponent1 },
          { path: 'favorites', component: DummyComponent2 },
        ])
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should contain navigation buttons', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const btns = compiled.querySelectorAll('button');

    expect(btns.length).toBe(2);
    expect(btns[0].textContent).toBe('Photos');
    expect(btns[1].textContent).toBe('Favorites');
    expect(btns[0].getAttribute('routerLink')).toBe('');
    expect(btns[1].getAttribute('routerLink')).toBe('favorites');
  });

  it('can navigate and show the active link', fakeAsync(() => {
    const location: Location = TestBed.inject(Location);
    const router: Router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(AppComponent);
;
    tick();
    fixture.detectChanges()

    const compiled = fixture.nativeElement as HTMLElement;
    const favBtn = compiled.querySelectorAll('button')[1];

    // navigate with button
    favBtn.click();

    tick();
    fixture.detectChanges();

    let activeLinks = compiled.querySelectorAll('.active-btn');

    expect(activeLinks.length).toEqual(1);
    expect(favBtn.classList.contains('active-btn')).toBeTruthy();
    expect(location.path()).toBe('/favorites');

    // navigate back through router

    router.navigate(['']);

    tick();
    fixture.detectChanges();

    activeLinks = compiled.querySelectorAll('.active-btn');

    expect(activeLinks.length).toEqual(1);
    expect(favBtn.classList.contains('active-btn')).toBeFalsy();
    expect(location.path()).toBe('/');
  }));
});

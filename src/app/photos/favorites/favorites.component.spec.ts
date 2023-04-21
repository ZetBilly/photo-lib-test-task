import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';

import {MatGridListModule} from '@angular/material/grid-list';

import { StorageService } from 'src/app/services/storage.service';

import { FavoritesComponent } from './favorites.component';
import { PhotoComponent } from '../photo/photo.component';
import { PhotosApiService } from '../services/photos-api.service';
import { Component } from '@angular/core';

@Component({ template: '' })
class DummyComponent {}

const storageSrvMock = {
  getFavorites:() => ["5", "8", "13"],
};
const photosSrvMock = { getSpecificPhotoUrlById: (id: string) => `test-url-${id}` };

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatGridListModule,
        RouterTestingModule.withRoutes([
          { path: 'favorites', component: FavoritesComponent },
          { path: 'photos/:id', component: DummyComponent }
        ])
      ],
      declarations: [
        FavoritesComponent,
        PhotoComponent
      ],
      providers:[
        { provide: StorageService, useValue: storageSrvMock },
        { provide: PhotosApiService, useValue: photosSrvMock },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate url based on photo id', () => {
    const spyCmp = spyOn(component, 'getUrl').and.callThrough();
    const spySrv = spyOn(photosSrvMock, 'getSpecificPhotoUrlById').and.callThrough();

    const genUrl = component.getUrl('13');

    expect(spyCmp).toHaveBeenCalledWith('13');
    expect(spySrv).toHaveBeenCalledWith('13');
    expect(genUrl).toBe('test-url-13');
  });

  it('should render favorite photos', () => {
    const spyCmp = spyOn(component, 'getUrl').and.callThrough();
    const spySrv = spyOn(photosSrvMock, 'getSpecificPhotoUrlById').and.callThrough();

    component.ngOnInit();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const images = compiled.querySelectorAll('img');

    expect(images.length).toBe(3);
    expect(spyCmp).toHaveBeenCalledTimes(3);
    expect(spySrv).toHaveBeenCalledTimes(3);
    expect(images[0].src).toContain('test-url-5');
    expect(images[1].src).toContain('test-url-8');
    expect(images[2].src).toContain('test-url-13');
  });

  it('should navigate to detail page', fakeAsync(() => {
    const location: Location = TestBed.inject(Location);
    const compiled = fixture.nativeElement as HTMLElement;

    component.ngOnInit();
    fixture.detectChanges();

    const images = compiled.querySelectorAll('img');

    images[0]?.click();

    tick();
    fixture.detectChanges();

    expect(location.path()).toBe('/photos/5');
  }));
});

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';

import { StorageService } from 'src/app/services/storage.service';

import { DetailViewComponent } from './detail-view.component';

import { PhotoComponent } from '../photo/photo.component';
import { PhotosApiService } from '../services/photos-api.service';

const storageSrvMock = {
  isFavorite:() => true,
  addToFavorites: () => {},
  removeFromFavorites: () => {}
};
const photosSrvMock = { getSpecificPhotoUrlById: () => 'test-url' };
const activeRouteMock = { snapshot: { params: { id: 1 } } };

describe('DetailViewComponent', () => {
  let component: DetailViewComponent;
  let fixture: ComponentFixture<DetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
      ],
      declarations: [
        DetailViewComponent,
        PhotoComponent
      ],
      providers:[
        { provide: StorageService, useValue: storageSrvMock },
        { provide: PhotosApiService, useValue: photosSrvMock },
        { provide: ActivatedRoute, useValue: activeRouteMock },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render img with generated url', fakeAsync(() => {
    const spyUrl = spyOn(photosSrvMock, 'getSpecificPhotoUrlById').and.callThrough();

    component.ngOnInit();

    tick();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const img = compiled.querySelector('img');

    expect(spyUrl).toHaveBeenCalled();
    expect(component.imageUrl).toEqual('test-url');
    expect(img).toBeTruthy();
    expect(img?.src).toContain('test-url');
  }));

  it('should allow photo to be removed from favorites', () => {
    const spyRemCmp = spyOn(component, 'removeFromFavorites').and.callThrough();
    const spyRemSrv = spyOn(storageSrvMock, 'removeFromFavorites');

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const btn = compiled.querySelector('button');

    expect(component.isFavorite).toBeTrue();
    expect(btn).toBeTruthy();
    expect(btn?.textContent).toContain('Remove from favorites');
    btn?.click();

    expect(spyRemCmp).toHaveBeenCalled();
    expect(spyRemSrv).toHaveBeenCalled();
    expect(component.isFavorite).toBeFalse();
  });

  it('should allow photo to be re-added to favorites', () => {
    component.isFavorite = false;
    const spyRemCmp = spyOn(component, 'addToFavorites').and.callThrough();
    const spyRemSrv = spyOn(storageSrvMock, 'addToFavorites');

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const btn = compiled.querySelector('button');

    expect(btn).toBeTruthy();
    expect(btn?.textContent).toContain('Add to favorites');
    btn?.click();

    expect(spyRemCmp).toHaveBeenCalled();
    expect(spyRemSrv).toHaveBeenCalled();
    expect(component.isFavorite).toBeTrue();
  });
});

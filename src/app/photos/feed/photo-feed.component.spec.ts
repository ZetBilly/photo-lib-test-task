import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { BehaviorSubject, delay } from 'rxjs';

import { StorageService } from 'src/app/services/storage.service';

import { PhotoFeedComponent } from './photo-feed.component';
import { PhotoComponent } from '../photo/photo.component';
import { PhotosApiService } from '../services/photos-api.service';

const storageSrvMock = {
  addToFavorites: (id: string) => {},
};
const photosSrvMock = {
  generatePhotosList: () => new BehaviorSubject([
    { id: '1', url: 'test-url-1' },
    { id: '2', url: 'test-url-2' },
    { id: '3', url: 'test-url-3' },
  ]).pipe(delay(200))
};

describe('PhotoFeedComponent', () => {
  let component: PhotoFeedComponent;
  let fixture: ComponentFixture<PhotoFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatGridListModule,
        MatProgressSpinnerModule
      ],
      declarations: [
        PhotoFeedComponent,
        PhotoComponent
      ],
      providers:[
        { provide: StorageService, useValue: storageSrvMock },
        { provide: PhotosApiService, useValue: photosSrvMock },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load photos on init', () => {
    const cmpSpy = spyOn(component, 'loadPhotos').and.callThrough();
    const srvSpy = spyOn(photosSrvMock, 'generatePhotosList').and.callThrough();

    component.ngOnInit();
    fixture.detectChanges();

    expect(cmpSpy).toHaveBeenCalled();
    expect(srvSpy).toHaveBeenCalled();
  });

  it('should render photos on init', fakeAsync(() => {
    component.ngOnInit();
    tick(250);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const images = compiled.querySelectorAll('img');

    expect(images.length).toBe(3);
  }));

  it('should add photo to favorites', fakeAsync(() => {
    const cmpSpy = spyOn(component, 'favorite').and.callThrough();
    const srvSpy = spyOn(storageSrvMock, 'addToFavorites');

    component.ngOnInit();
    tick(250);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const tiles = compiled.querySelectorAll('mat-grid-tile');
    tiles[1].dispatchEvent(new Event('click'));

    fixture.detectChanges();

    expect(cmpSpy).toHaveBeenCalledWith('2');
    expect(srvSpy).toHaveBeenCalledWith('2');
  }));

  it('should trigger spinner on loading', fakeAsync(() => {
    const cmpSpy = spyOn(component, 'loadPhotos').and.callThrough();

    component.ngOnInit();

    tick(100);
    fixture.detectChanges();

    expect(cmpSpy).toHaveBeenCalled();
    expect(component.loading$.value).toBeTrue();

    tick(450);
    fixture.detectChanges();
    expect(component.loading$.value).toBeFalse();
  }));

  it('should load more photos on scrolling', fakeAsync(() => {
    const compiled = fixture.nativeElement as HTMLElement;
    const handlerSpy = spyOn<any>(component, 'handleScroll').and.callThrough();
    const cmpSpy = spyOn(component, 'loadPhotos').and.callThrough();
    const ev = new Event('scroll');

    Object.defineProperty(ev, "target", { value: document });

    component.ngOnInit();

    tick(250);
    fixture.detectChanges();

    const images = compiled.querySelectorAll('img');

    expect(cmpSpy).toHaveBeenCalledTimes(1);
    expect(images.length).toBe(3);

    photosSrvMock.generatePhotosList = () => new BehaviorSubject([
      { id: '4', url: 'test-url-4' },
      { id: '5', url: 'test-url-5' },
      { id: '6', url: 'test-url-6' },
    ]).pipe(delay(200));

    // simulate scroll handler call
    (component as any).handleScroll(ev);

    expect(handlerSpy).toHaveBeenCalled();

    fixture.detectChanges();
    tick(550);

    expect(cmpSpy).toHaveBeenCalledTimes(2);
    expect(component.photos.length).toBe(6);
  }));
});

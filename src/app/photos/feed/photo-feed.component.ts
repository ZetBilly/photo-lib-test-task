import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged, fromEvent } from 'rxjs';

import { PhotosApiService } from '../services/photos-api.service';
import { IRandomPhoto } from '../models/photo.model';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-photo-feed',
  templateUrl: './photo-feed.component.html',
  styleUrls: ['./photo-feed.component.scss']
})
export class PhotoFeedComponent implements OnInit {

  constructor(private photosApiService: PhotosApiService, private storageService: StorageService) { }

  public loading$ = new BehaviorSubject<boolean>(true);
  public photos: IRandomPhoto[] = [];

  public ngOnInit() {
    this.loadPhotos();

    fromEvent(window, 'scroll', { capture: true }).pipe(
      debounceTime(100),
      distinctUntilChanged(),
    ).subscribe(e => this.handleScroll(e));
  }

  public loadPhotos() {
    this.loading$.next(true);
    this.photosApiService.generatePhotosList(9).subscribe(photos => {
      this.photos.push(...photos);
      this.loading$.next(false);
    });
  }

  public favorite(id: string) {
    this.storageService.addToFavorites(id);
    console.debug('added to favorites', id);
  }

  private handleScroll(ev: Event) {
    const doc = ev.target as Document;
    const {
      scrollTop,
      scrollHeight,
      clientHeight
    } = doc.documentElement;

    const pageEnd = scrollTop + clientHeight >= scrollHeight - 5;
    console.log('pageEnd', pageEnd);

    if (pageEnd) {
      this.loadPhotos();
    }
  }
}

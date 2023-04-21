import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, debounceTime, distinctUntilChanged, fromEvent, takeUntil } from 'rxjs';

import { PhotosApiService } from '../services/photos-api.service';
import { IRandomPhoto } from '../models/photo.model';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-photo-feed',
  templateUrl: './photo-feed.component.html',
  styleUrls: ['./photo-feed.component.scss']
})
export class PhotoFeedComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private photosApiService: PhotosApiService, private storageService: StorageService) { }

  public loading$ = new BehaviorSubject<boolean>(true);
  public photos: IRandomPhoto[] = [];

  public ngOnInit() {
    this.loadPhotos();

    fromEvent(window, 'scroll', { capture: true }).pipe(
      takeUntil(this.destroy$),
      debounceTime(100),
      distinctUntilChanged(),
    ).subscribe(e => this.handleScroll(e));
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.loading$.complete();
  }

  public loadPhotos() {
    this.loading$.next(true);
    this.photosApiService.generatePhotosList(9, 400, 400).subscribe(photos => {
      this.photos = [...this.photos, ...photos];
      this.loading$.next(false);
    });
  }

  public favorite(id: string) {
    this.storageService.addToFavorites(id);
  }

  private handleScroll(ev: Event) {
    const doc = ev.target as Document;
    const {
      scrollTop,
      scrollHeight,
      clientHeight
    } = doc.documentElement;

    const pageEnd = scrollTop + clientHeight >= scrollHeight - 5;

    if (pageEnd) {
      this.loadPhotos();
    }
  }
}

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { StorageService } from 'src/app/services/storage.service';

import { PhotosApiService } from '../services/photos-api.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavoritesComponent implements OnInit {

  constructor(private storageService: StorageService, private photosApiService: PhotosApiService) { }

  public favorites: string[] = [];

  public ngOnInit() {
    this.favorites = this.storageService.getFavorites();
  }

  public getUrl(id: string): string {
    return this.photosApiService.getSpecificPhotoUrlById(id);
  }
}

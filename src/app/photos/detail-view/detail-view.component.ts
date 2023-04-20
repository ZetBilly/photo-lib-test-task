import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { StorageService } from 'src/app/services/storage.service';

import { PhotosApiService } from '../services/photos-api.service';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss']
})
export class DetailViewComponent implements OnInit {
  constructor(
    private storageService: StorageService,
    private photosApiService: PhotosApiService,
    private activatedRoute: ActivatedRoute
  ) { }

  public isFavorite = false;
  public imageUrl = '';
  public width = 800;
  public height = 600;

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    this.isFavorite = this.storageService.isFavorite(id);
    this.imageUrl = this.photosApiService.getSpecificPhotoUrlById(id, this.width, this.height);
  }

  public addToFavorites() {
    const id = this.activatedRoute.snapshot.params['id'];
    this.storageService.addToFavorites(id);
    this.isFavorite = true;
  }

  public removeFromFavorites() {
    const id = this.activatedRoute.snapshot.params['id'];
    this.storageService.removeFromFavorites(id);
    this.isFavorite = false;
  }
}

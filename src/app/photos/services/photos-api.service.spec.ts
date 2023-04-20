/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PhotosApiService } from './photos-api.service';

describe('Service: PhotosApi', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PhotosApiService]
    });
  });

  it('should ...', inject([PhotosApiService], (service: PhotosApiService) => {
    expect(service).toBeTruthy();
  }));
});

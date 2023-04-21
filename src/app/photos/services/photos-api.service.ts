import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay, from, map, mergeMap, toArray } from 'rxjs';

import { IRandomPhoto } from '../models/photo.model';
import { randomIntFromRange } from '../utils/rnd';

@Injectable({
  providedIn: 'root',
})
export class PhotosApiService {
  constructor(private http: HttpClient) {}

  /**
   * Due to how API works and that we can't get random photos as prepared list with ids
   * we will generate request for random images and then we will extract image id from response
   * to create a proper model with id and url.
   * */
  public generatePhotosList(size: number, width: number = 300, height: number = 200): Observable<IRandomPhoto[]> {
    const times = new Array(size).fill(0);

    // Concurrency set to 2 request runs simultaneously
    return from(times).pipe(
      mergeMap(() => this.getRandomImageIdAndUrl(width, height), 2),
      toArray(),
      this.randomDelay()
    ) as Observable<IRandomPhoto[]>;
  }

  public getSpecificPhotoUrlById(id: string, width: number = 300, height: number = 200): string {
    return `https://picsum.photos/id/${id}/${width}/${height}`;
  }

  private getRandomImageIdAndUrl(width: number = 300, height: number = 200): Observable<IRandomPhoto> {
    return this.http.get(`https://picsum.photos/${width}/${height}`, {observe: 'response', responseType: 'arraybuffer'}).pipe(
      map(resp => resp.headers.get('picsum-id') as string),
      map((id: string) => ({ id, url: `https://picsum.photos/id/${id}/${width}/${height}` }))
    )
  }

  private randomDelay(min: number = 200, max: number = 300) {
    const rndVal = randomIntFromRange(min, max);
    return delay(rndVal);
  }
}

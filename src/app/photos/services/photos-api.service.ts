import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay, from, map, mergeMap, toArray } from 'rxjs';

import { IPhoto, IRandomPhoto } from '../models/photo.model';

@Injectable({
  providedIn: 'root',
})
export class PhotosApiService {
  constructor(private http: HttpClient) {}

  public getPhotosList(page: number = 1, limit: number = 20): Observable<IPhoto[]>  {
    return this.http.get<IPhoto[]>(
      `https://picsum.photos/v2/list?page=${page}&limit=${limit}`
    );
  }

  public getPhotoDetails(id: number): Observable<IPhoto> {
    return this.http.get<IPhoto>(`https://picsum.photos/id/${id}/info`);

  }

  /**
   * Due to how API works and that we can't get random photos as prepared list with ids
   * we will generate request for random images and then we will extract image id from response
   * to create a proper response.
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
    const rndVal = Math.random() * (max - min) + min;
    return delay(rndVal);
  }
}

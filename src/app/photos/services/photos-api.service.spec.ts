import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PhotosApiService } from './photos-api.service';

import { randomIntFromRange } from '../utils/rnd';

describe('Service: PhotosApi', () => {
  let service: PhotosApiService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers:[
        PhotosApiService
      ]
    }).compileComponents();

    service = TestBed.inject(PhotosApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate urls for photos', () => {
    const ex1 = service.getSpecificPhotoUrlById('111');
    const ex2 = service.getSpecificPhotoUrlById('122', 500);
    const ex3 = service.getSpecificPhotoUrlById('133', 400, 800);

    expect(ex1).toEqual('https://picsum.photos/id/111/300/200');
    expect(ex2).toEqual('https://picsum.photos/id/122/500/200');
    expect(ex3).toEqual('https://picsum.photos/id/133/400/800');

    const ex4 = service.getSpecificPhotoUrlById('');
    expect(ex4).toEqual('https://picsum.photos/id//300/200');
  });

  it('should generate data for random photos fetching', () => {
    // Private method call spy
    const reqSpy = spyOn<any>(service, 'getRandomImageIdAndUrl').and.callThrough();
    const randomId = randomIntFromRange(1, 1000).toString();
    const result = service.generatePhotosList(1, 500, 500);

    result.subscribe(result => {
      expect(reqSpy).toHaveBeenCalledTimes(1);
      expect(result.length).toBe(1);
      expect(result[0]).toEqual({
        id: randomId,
        url: `https://picsum.photos/id/${randomId}/500/500`
      });
    });

    const req = httpMock.expectOne('https://picsum.photos/500/500');
    expect(req.request.method).toBe("GET");
    req.flush(new ArrayBuffer(0), { headers: { 'picsum-id': randomId }});
  });
});

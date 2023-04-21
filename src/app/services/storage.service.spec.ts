import { TestBed, inject } from '@angular/core/testing';
import { StorageService } from './storage.service';

const localStorageMock = (function () {
  let store: {[key: string]: string} = {};

  return {
    getItem(key: string) {
      return store[key];
    },

    setItem(key: string, value: string) {
      store[key] = value;
    },

    clear() {
      store = {};
    },

    removeItem(key: string) {
      delete store[key];
    },

    getAll() {
      return store;
    },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock })


describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageService,]
    });

    service = TestBed.inject(StorageService);
    window.localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add to favorites', inject([StorageService], (service: StorageService) => {
    const spySet = spyOn(window.localStorage,  'setItem').and.callThrough();
    service.addToFavorites('5');

    const result = window.localStorage.getItem('favorites');

    expect(spySet).toHaveBeenCalled();
    expect(result).toBeTruthy();
    expect(result).toContain('5');
  }))

  it('should check if is favorite', inject([StorageService], (service: StorageService) => {
    window.localStorage.setItem('favorites', '["19", "7", "12"]');

    const spyGet = spyOn(window.localStorage,  'getItem').and.callThrough();
    const isFavRes = service.isFavorite('7');

    const result = window.localStorage.getItem('favorites');

    expect(spyGet).toHaveBeenCalled();
    expect(isFavRes).toEqual(true);
    expect(result).toContain('19');
    expect(result).toContain('7');
    expect(result).toContain('12');
  }))

  it('should remove from favorites', inject([StorageService], (service: StorageService) => {
    service.addToFavorites('5');
    service.addToFavorites('3');

    const spySet = spyOn(window.localStorage,  'setItem').and.callThrough()
    const spyGet = spyOn(window.localStorage,  'getItem').and.callThrough();

    const isFavRes1 = service.isFavorite('3');
    const state1 = service.getFavorites();
    expect(isFavRes1).toEqual(true);
    expect(state1).toEqual(['5', '3']);

    service.removeFromFavorites("3");

    expect(spyGet).toHaveBeenCalled();
    expect(spySet).toHaveBeenCalled();

    const isFavRes2 = service.isFavorite('3');
    const state2 = service.getFavorites();

    expect(isFavRes2).toEqual(false);
    expect(state2).toEqual(["5"]);
  }))
});

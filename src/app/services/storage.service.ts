import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private STORAGE_KEY = 'favorites';

  public getFavorites(): string[] {
    return this.readStorage();
  }

  public addToFavorites(id: string): void {
    const favs = this.readStorage();

    favs.push(id);
    this.writeStorage(favs);
  }

  public removeFromFavorites(id: string): void {
    const favs = this.readStorage();
    const index = favs.indexOf(id);

    favs.splice(index, 1);
    this.writeStorage(favs);
  }

  public isFavorite(id: string): boolean {
    const favs = this.readStorage();
    return favs.indexOf(id) > -1;
  }

  private readStorage(): string[] {
    const content =  window.localStorage.getItem(this.STORAGE_KEY);
    return content ? JSON.parse(content) : [];
  }

  private writeStorage(favs: string[]): void {
    const data = JSON.stringify(favs);
    window.localStorage.setItem(this.STORAGE_KEY, data);
  }
}

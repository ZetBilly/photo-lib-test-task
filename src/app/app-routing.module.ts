import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PhotoFeedComponent } from './photos/feed/photo-feed.component';
import { FavoritesComponent } from './photos/favorites/favorites.component';
import { DetailViewComponent } from './photos/detail-view/detail-view.component';

const routes: Routes = [
  { path: 'favorites', component: FavoritesComponent },
  { path: 'photos/:id', component: DetailViewComponent },
  { path: '', component: PhotoFeedComponent },
  { path: '**', redirectTo:  '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

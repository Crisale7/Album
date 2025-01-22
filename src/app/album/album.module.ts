import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlbumPage } from './album.page'; // Importa el componente standalone

const routes: Routes = [
  {
    path: '',
    component: AlbumPage // Usa el componente standalone directamente
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlbumPageRoutingModule {}

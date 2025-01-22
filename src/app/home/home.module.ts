import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page'; // Importa el componente standalone

const routes: Routes = [
  {
    path: '',
    component: HomePage // Usa el componente standalone directamente
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes) // Importa las rutas
  ]
})
export class HomePageModule {}

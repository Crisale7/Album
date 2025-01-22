// home.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { interval } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule] // Incluye RouterModule
})
export class HomePage implements OnInit {
  images = Array.from({length: 30}, (_, i) => `assets/images/photo${i + 1}.jpg`);

  currentImageIndex = 0;
  startDate = new Date(2022, 8, 22); // 22 de Septiembre de 2022 (mes es 0-based)

  currentDate = new Date();
  timeDifference: any = {};
  loveQuote = "El tiempo es el testigo silencioso de nuestro amor, cada segundo que pasa es un recuerdo más en nuestro camino juntos. En este viaje eterno, cada paso a tu lado hace que mi corazón lata más fuerte.";

  constructor() {}

  ngOnInit() {
    // Carrusel automático
    setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    }, 5000); // Aumentado a 5 segundos para mejor visualización

    // Actualizar contador
    this.updateDateDifference(); // Actualización inicial
    interval(1000).subscribe(() => {
      this.updateDateDifference();
    });
  }

  updateDateDifference() {
    this.currentDate = new Date();
  
    let years = this.currentDate.getFullYear() - this.startDate.getFullYear();
    let months = this.currentDate.getMonth() - this.startDate.getMonth();
    let days = this.currentDate.getDate() - this.startDate.getDate();
  
    // Ajustar los días y meses si el día actual es menor que el día de inicio
    if (days < 0) {
      months--;
      // Obtener el último día del mes anterior
      const lastMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 0);
      days += lastMonth.getDate();
    }
  
    // Ajustar los años y meses si los meses son negativos
    if (months < 0) {
      years--;
      months += 12;
    }
  
    // Actualizar el objeto timeDifference
    this.timeDifference = {
      years: years.toString().padStart(2, '0'),
      months: months.toString().padStart(2, '0'),
      days: days.toString().padStart(2, '0'),
      hours: this.currentDate.getHours().toString().padStart(2, '0'),
      minutes: this.currentDate.getMinutes().toString().padStart(2, '0'),
    };
  }
  
}
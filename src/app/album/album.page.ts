// album.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { getDatabase, ref as dbRef, push, onValue } from 'firebase/database';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAm5nuUg3LFHyIUv5md1cV2i9lAvphUrmU",
  authDomain: "amor-fed25.firebaseapp.com",
  projectId: "amor-fed25",
  storageBucket: "amor-fed25.firebasestorage.app",
  messagingSenderId: "527134910921",
  appId: "1:527134910921:web:b8791e4ccd9a7ca8fca018",
  measurementId: "G-HK52LBXTTL"
};

interface Photo {
  url: string;
  date: string;
  description: string;
}

@Component({
  selector: 'app-album',
  templateUrl: 'album.page.html',
  styleUrls: ['album.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class AlbumPage implements OnInit {
  photos: Photo[] = [];
  private app = initializeApp(firebaseConfig);
  private storage = getStorage(this.app);
  private database = getDatabase(this.app);
  private analytics = getAnalytics(this.app);

  constructor() {}

  ngOnInit() {
    // Cargar fotos iniciales
    Array.from({length: 30}, (_, i) => {
      this.photos.push({
        url: `assets/images/photo${i + 1}.jpg`,
        date: '',
        description: ''
      });
    });

    // Escuchar cambios en la base de datos
    const photosRef = dbRef(this.database, 'photos');
    onValue(photosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convertir el objeto de Firebase a un array
        const firebasePhotos = Object.values(data) as Photo[];
        // Combinar fotos locales con las de Firebase
        this.photos = [...this.photos, ...firebasePhotos];
      }
    });
  }

  async addNewPhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos
      });

      if (image.base64String) {
        // Convertir Base64 a Blob
        const blob = this.base64ToBlob(image.base64String, 'image/jpeg');
        
        // Generar nombre único para la imagen
        const fileName = `photo_${new Date().getTime()}.jpg`;
        
        // Subir imagen a Firebase Storage
        const storageRef = ref(this.storage, `photos/${fileName}`);
        await uploadBytes(storageRef, blob);
        
        // Obtener URL de descarga
        const downloadURL = await getDownloadURL(storageRef);
        
        // Crear nuevo objeto de foto
        const newPhoto: Photo = {
          url: downloadURL,
          date: new Date().toLocaleDateString(),
          description: 'Nueva memoria'
        };

        // Guardar referencia en Realtime Database
        const photosRef = dbRef(this.database, 'photos');
        push(photosRef, newPhoto);
      }
    } catch (error) {
      console.error('Error al añadir foto:', error);
    }
  }

  private base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }
}
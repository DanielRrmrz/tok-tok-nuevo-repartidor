import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from "firebase/app";
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { Platform } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';


@Injectable()
export class UbicacionProvider {
  db = firebase.firestore();
  repartidor: AngularFirestoreDocument<any>;
  servicio: AngularFirestoreDocument<any>;
  watch: Subscription;
  watch1: Subscription;
  idRepartidor: any;
  repa: any;
  servicioID: any;
  comprado: any;

  constructor(
    private geolocation: Geolocation,
    public platform: Platform,              
    private nativeStorage: NativeStorage,
    private afDB: AngularFirestore
  ) {}

  partidaGeo(servicio) {
    this.servicio = this.afDB.doc(`/servicios/${servicio}`);
    this.geolocation
      .getCurrentPosition()
      .then(resp => {
        let lat = resp.coords.latitude;
        let lng = resp.coords.longitude;
        const locationData = new firebase.firestore.GeoPoint(lat, lng);

        console.log("Esta es la hubicacion de partida: ", locationData);

        this.servicio.update({
          partidaGeo: locationData
        });
      })
      .catch(error => {
        console.log("Error getting location", error);
      });
  }

  inicializarRepartidor() {
      this.repa = localStorage.getItem("idRepartidor");   
    if (this.repa != "null") {
      this.idRepartidor = this.repa;
      this.repartidor = this.afDB.doc(`/users/${this.idRepartidor}`);
    }

    console.log('Id Repa: ', this.repa);
    
  }

  iniciarGeolocalizacion() {
    this.geolocation
      .getCurrentPosition()
      .then(resp => {
        const lat = resp.coords.latitude;
        const lng = resp.coords.longitude;
        const locationData = new firebase.firestore.GeoPoint(lat, lng);
        this.repartidor.update({
          geolocalizacion: locationData
        });
        // console.log("Coordenadas del dispositivo: ",resp.coords);
        // console.log("Esta es la latitud: ",lat);
        // console.log("Esta es la longitud: ",lng);

        this.watch = this.geolocation.watchPosition().subscribe(data => {
          // data can be a set of coordinates, or an error (if an error occurred).
          // data.coords.latitude
          // data.coords.longitude
          const lat1 = data.coords.latitude;
          const lng1 = data.coords.longitude;
          const locationData1 = new firebase.firestore.GeoPoint(lat1, lng1);
          this.repartidor.update({
            geolocalizacion: locationData1
          });
          console.log("watch: ", data.coords);
        });
      })
      .catch(error => {
        console.log("Error getting location", error);
      });
  }

  detenerUbicacion() {
    try {
      this.watch.unsubscribe();
    } catch (e) {
      console.log(JSON.stringify(e));
    }
  }

  detenerUbicacion1() {
    try {
      this.watch1.unsubscribe();
    } catch (e) {
      console.log(JSON.stringify(e));
    }
  }

  insertarPoints(locationData) {
    const _locationData = new firebase.firestore.GeoPoint(
      locationData.latitude,
      locationData.longitude
    );
    this.repartidor.update({
      geolocalizacion: _locationData
    });
    let myDate: any = new Date().toISOString();
    const fecha = moment(myDate).format("x");
      this.servicioID = localStorage.getItem("servIniciado");
      this.comprado = localStorage.getItem("comprado");   
    if (this.comprado != null) {
      return new Promise((resolve, reject) => {
        this.db
          .collection("rutas")
          .add({
            partidaGeo: _locationData,
            idServicio: this.servicioID,
            fecha: fecha,
            estatus: 1
          })
          .then(function(docRef) {
            console.log("Document successfully written!", docRef.id);
            resolve({ success: true });
          })
          .catch(function(error) {
            console.error("Error adding document: ", JSON.stringify(error));
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        this.db
          .collection("rutas")
          .add({
            partidaGeo: _locationData,
            idServicio: this.servicioID,
            fecha: fecha,
            estatus: 0
          })
          .then(function(docRef) {
            console.log("Document successfully written!", docRef.id);
            resolve({ success: true });
          })
          .catch(function(error) {
            console.error("Error adding document: ", JSON.stringify(error));
          });
      });
    }
  }

  servicioIniciado() {
    return new Promise((resolve, reject) => {
      this.geolocation
        .getCurrentPosition()
        .then(resp => {
          const lat = resp.coords.latitude;
          const lng = resp.coords.longitude;
          const locationData = new firebase.firestore.GeoPoint(lat, lng);
            this.servicioID = localStorage.getItem("servIniciado");        
          let myDate: any = new Date().toISOString();
          const fecha = moment(myDate).format("x");
          this.db
            .collection("rutas")
            .add({
              partidaGeo: locationData,
              idServicio: this.servicioID,
              fecha: fecha,
              estatus: 1,
              servicio: "Iniciado"
            })
            .then(function(docRef) {
              console.log("Document successfully written!", docRef.id);
              resolve({ success: true });
            })
            .catch(function(error) {
              console.error("Error adding document: ", JSON.stringify(error));
            });
        })
        .catch(error => {
          console.log("Error getting location", error);
        });
    });
  }

  servicioTerminado() {
    return new Promise((resolve, reject) => {
      this.geolocation
        .getCurrentPosition()
        .then(resp => {
          const lat = resp.coords.latitude;
          const lng = resp.coords.longitude;
          const locationData = new firebase.firestore.GeoPoint(lat, lng);
            this.servicioID = localStorage.getItem("servIniciado");        
          let myDate: any = new Date().toISOString();
          const fecha = moment(myDate).format("x");
          this.db
            .collection("rutas")
            .add({
              partidaGeo: locationData,
              idServicio: this.servicioID,
              fecha: fecha,
              estatus: 1,
              servicio: "Terminado"
            })
            .then(function(docRef) {
              console.log("Document successfully written!", docRef.id);
              resolve({ success: true });
            })
            .catch(function(error) {
              console.error("Error adding document: ", JSON.stringify(error));
            });
        })
        .catch(error => {
          console.log("Error getting location", error);
        });
    });
  }
}

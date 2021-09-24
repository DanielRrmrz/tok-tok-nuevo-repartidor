/**
 * @author    Ionic Bucket <ionicbucket@gmail.com>
 * @copyright Copyright (c) 2017
 * @license   Fulcrumy
 * 
 * This file represents a component of Delivery Tracking page
 * File path - '../../../../src/pages/delivery-tracking/delivery-tracking'
 */

import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { UbicacionProvider } from '../../providers/ubicacion/ubicacion';
// import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-delivery-tracking',
  templateUrl: 'delivery-tracking.html',
})
export class DeliveryTrackingPage {
  renderOptions: any;
  repartidor: any = {};
  zoom: number = 18;
  lat: any;
  lng: any;
  latIni: number = 21.1220595;
  lngIni: number = -101.7360524;
  dir: any;

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  markerOptions = {
    origin: {
        icon: 'assets/imgs/bringmeLogo.png',
    },
    destination: {
        icon: 'assets/imgs/bringmeCasa.png',     
    },
 };

  MapStyle = [
    {
      elementType: "geometry",
      stylers: [
        {
          hue: "#ff4400"
        },
        {
          saturation: -100
        },
        {
          lightness: -4
        },
        {
          gamma: 0.72
        }
      ]
    },
    {
      featureType: "road",
      elementType: "labels.icon"
    },
    {
      featureType: "landscape.man_made",
      elementType: "geometry",
      stylers: [
        {
          hue: "#0077ff"
        },
        {
          gamma: 3.1
        }
      ]
    },
    {
      featureType: "water",
      stylers: [
        {
          hue: "#000000"
        },
        {
          gamma: 0.44
        },
        {
          saturation: -33
        }
      ]
    },
    {
      featureType: "poi.park",
      stylers: [
        {
          hue: "#44ff00"
        },
        {
          saturation: -23
        }
      ]
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [
        {
          hue: "#007fff"
        },
        {
          gamma: 0.77
        },
        {
          saturation: 65
        },
        {
          lightness: 99
        }
      ]
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [
        {
          gamma: 0.11
        },
        {
          weight: 5.6
        },
        {
          saturation: 99
        },
        {
          hue: "#0091ff"
        },
        {
          lightness: -86
        }
      ]
    },
    {
      featureType: "transit.line",
      elementType: "geometry",
      stylers: [
        {
          lightness: -48
        },
        {
          hue: "#ff5e00"
        },
        {
          gamma: 1.2
        },
        {
          saturation: -23
        }
      ]
    },
    {
      featureType: "transit",
      elementType: "labels.text.stroke",
      stylers: [
        {
          saturation: -64
        },
        {
          hue: "#ff9100"
        },
        {
          lightness: 16
        },
        {
          gamma: 0.47
        },
        {
          weight: 2.7
        }
      ]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          color: "#222222"
        }
      ]
    }
  ];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public geolocation: Geolocation,
    public platform: Platform,    
    public ubicacionProv: UbicacionProvider,
    // private afAuth: AngularFireAuth,
    ) {

      this.ubicacionProv.inicializarRepartidor();
      this.ubicacionProv.iniciarGeolocalizacion();  

      // this.user = this.afAuth.auth.currentUser.photoURL;
      // console.log("Este es el usuario: ",this.user);

      this.lat = this.navParams.get("lat");
      this.lng = this.navParams.get("lng");
      // console.log("Esta es la latitud: ",this.latIni, "Esta es la longitud: ",this.lngIni);
      
  }

  ionViewDidLoad() {
    this.obtenerMapa();
  }
  
  obtenerMapa() {
    this.ubicacionProv.repartidor.valueChanges().subscribe(data=>{
      this.repartidor = data;

      let latRepa = this.repartidor.geolocalizacion._lat;
      let lngRepa = this.repartidor.geolocalizacion._long;
    this.renderOptions = {
      suppressMarkers: true,
    };
    this.dir = {
        origin: { lat: latRepa, lng: lngRepa},
        destination: { lat: this.lat, lng: this.lng }
    }
  });
  }

  goBack(){
    this.navCtrl.pop();
  }
  setPanel(){
    return document.querySelector("#myPanel")
  }
}


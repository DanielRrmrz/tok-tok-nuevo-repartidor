import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  Platform
} from "ionic-angular";
// import { Observable } from "rxjs/Observable";

declare var google: any; 
// declare var MarkerClusterer: any;


@IonicPage()
@Component({
  selector: "page-map",
  templateUrl: "map.html"
})
export class MapPage {
  @ViewChild("map") mapElement: ElementRef;
  @ViewChild("searchbar", { read: ElementRef }) searchbar: ElementRef;
  addressElement: HTMLInputElement = null;

  map: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public zone: NgZone,
    public platform: Platform
  ) {
    this.platform.ready().then(() => this.loadMaps());
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad MapPage");
  }

  goBack() {
    this.navCtrl.pop();
  }

  loadMaps() {
    if (!!google) {
      this.initializeMap();
      // this.initAutocomplete();
    } else {
      this.errorAlert(
        "Error",
        "Something went wrong with the Internet Connection. Please check your Internet."
      );
    }
  }

  errorAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: "OK",
          handler: data => {
            this.loadMaps();
          }
        }
      ]
    });
    alert.present();
  }

  // initAutocomplete(): void {
  //   // reference : https://github.com/driftyco/ionic/issues/7223
  //   this.addressElement = this.searchbar.nativeElement.querySelector(
  //     ".searchbar-input"
  //   );
  //   this.createAutocomplete(this.addressElement).subscribe(location => {
  //     console.log("Searchdata", location);

  //     let options = {
  //       center: location,
  //       zoom: 18
  //     };
  //     this.map.setOptions(options);
  //     this.addMarker(location, "Mein gesuchter Standort");
  //   });
  // }

  initializeMap() {
    this.zone.run(() => {
      // var mapEle = this.mapElement.nativeElement;
      this.map = new google.maps.Map( document.getElementById('map'),{
        center: { lat: 21.15327, lng: -101.60057 },
        zoom: 8,
        // streetViewControl: false
      });
    });

    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer({
        draggable: true,
        map: this.map,
        // panel: document.getElementById('right-panel')
    });

    // directionsDisplay.addListener('directions_changed', function() {
    //     computeTotalDistance(directionsDisplay.getDirections());
    // });

    this.displayRoute('21.0713895, -101.550867', '21.094593, -101.6200013', directionsService,
        directionsDisplay);
  }

  displayRoute(origin, destination, service, display) {
    service.route({
        origin: origin,
        destination: destination,
        // waypoints: [{
        //     location: 'Adelaide, SA'
        // }, {
        //     location: 'Broken Hill, NSW'
        // }],
        travelMode: 'DRIVING',
        avoidTolls: true
    }, (response, status) =>{
        if (status == 'OK') {
            display.setDirections(response);
        } else {
            alert('Could not display directions due to: ' + status);
        }
    });
}

  // createAutocomplete(addressEl: HTMLInputElement): Observable<any> {
  //   const autocomplete = new google.maps.places.Autocomplete(addressEl);
  //   autocomplete.bindTo("bounds", this.map);
  //   return new Observable((sub: any) => {
  //     google.maps.event.addListener(autocomplete, "place_changed", () => {
  //       const place = autocomplete.getPlace();
  //       if (!place.geometry) {
  //         sub.error({
  //           message: "Autocomplete returned place with no geometry"
  //         });
  //       } else {
  //         console.log("Search Lat", place.geometry.location.lat());
  //         console.log("Search Lng", place.geometry.location.lng());
  //         localStorage.setItem("latPedido", place.geometry.location.lat());
  //         localStorage.setItem("lngPedido", place.geometry.location.lng());
  //         // if (localStorage.getItem("latPedido") != null) {
  //         //   this.buttonDisabled = false;
  //         // }
  //         console.log(place);
           
  //         sub.next(place.geometry.location);
  //         //sub.complete();
  //       }
  //     });
  //   });
  // }

  // addMarker(position, content) {
  //   let marker = new google.maps.Marker({
  //     map: this.map,
  //     animation: google.maps.Animation.DROP,
  //     position: position
  //   });
  // }
}

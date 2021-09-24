import { Component, NgZone, ViewChild, ElementRef } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ActionSheetController,
  AlertController,
  App,
  LoadingController,
  Platform,
  ToastController,
  ModalController
} from "ionic-angular";
import { Geolocation } from "@ionic-native/geolocation";

import { Observable } from "rxjs/Observable";
import { Storage } from "@ionic/storage";

import { ModalProductPage } from "../modal-product/modal-product";
import { SummaryPage } from "../summary/summary";

declare var google: any;
declare var MarkerClusterer: any;

@IonicPage()
@Component({
  selector: "page-place",
  templateUrl: "place.html"
})
export class PlacePage {
  @ViewChild("map") mapElement: ElementRef;
  @ViewChild("searchbar", { read: ElementRef }) searchbar: ElementRef;
  addressElement: HTMLInputElement = null;

  listSearch: string = "";

  map: any;
  marker: any;
  loading: any;
  search: boolean = false;
  error: any;
  switch: string;

  regionals: any = [];
  currentregional: any;

  lat: any = "";
  lng: any = "";

  pedido: any = {};
  productos: any[] = [];
  items: any[] = [];
  buttonDisabled:any;
  disable:any;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public app: App,
    public zone: NgZone,
    public platform: Platform,
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public geolocation: Geolocation,
    public storage: Storage,
    public modalCtrl: ModalController
  ) {
    this.platform.ready().then(() => this.loadMaps());

    if (localStorage.getItem("latPedido") == null) {
      this.buttonDisabled = true;
    }

    if (localStorage.getItem("prod") == null) {
      this.disable = true;
    }

    this.switch = this.navParams.get('page');

    this.refreh();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad PlacePage");
  }

  viewPlace(id) {
    console.log("Clicked Marker", id);
  }

  refreh(){
    console.log('hola recarge');
    this.renderPedido();
  }

  loadMaps() {
    if (!!google) {
      this.initializeMap();
      this.initAutocomplete();
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

  mapsSearchBar(ev: any) {
    // set input to the value of the searchbar
    //this.search = ev.target.value;
    console.log(ev);
    const autocomplete = new google.maps.places.Autocomplete(ev);
    autocomplete.bindTo("bounds", this.map);
    return new Observable((sub: any) => {
      google.maps.event.addListener(autocomplete, "place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          sub.error({
            message: "Autocomplete returned place with no geometry"
          });
        } else {
          sub.next(place.geometry.location);
          sub.complete();
        }
      });
    });
  }

  initAutocomplete(): void {
    // reference : https://github.com/driftyco/ionic/issues/7223
    this.addressElement = this.searchbar.nativeElement.querySelector(
      ".searchbar-input"
    );
    this.createAutocomplete(this.addressElement).subscribe(location => {
      console.log("Searchdata", location);

      let options = {
        center: location,
        zoom: 18
      };
      this.map.setOptions(options);
      this.addMarker(location, "Mein gesuchter Standort");
    });
  }

  createAutocomplete(addressEl: HTMLInputElement): Observable<any> {
    const autocomplete = new google.maps.places.Autocomplete(addressEl);
    autocomplete.bindTo("bounds", this.map);
    return new Observable((sub: any) => {
      google.maps.event.addListener(autocomplete, "place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          sub.error({
            message: "Autocomplete returned place with no geometry"
          });
        } else {
          console.log("Search Lat", place.geometry.location.lat());
          console.log("Search Lng", place.geometry.location.lng());
          localStorage.setItem("latPedido", place.geometry.location.lat());
          localStorage.setItem("lngPedido", place.geometry.location.lng());
          if (localStorage.getItem("latPedido") != null) {
            this.buttonDisabled = false;
          }
          sub.next(place.geometry.location);
          //sub.complete();
        }
      });
    });
  }

  initializeMap() {
    this.zone.run(() => {
      var mapEle = this.mapElement.nativeElement;
      this.map = new google.maps.Map(mapEle, {
        maxZoom: 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [],
        disableDoubleClickZoom: false,
        disableDefaultUI: true,
        zoomControl: true,
        scaleControl: true
      });

      // let lat = parseFloat(localStorage.getItem("lat"));
      // let lng = parseFloat(localStorage.getItem("lng"));

      let lat = parseFloat("21.1456268");
      let lng = parseFloat("-101.68976219999999"); 

      let markerData = new google.maps.LatLng(lat, lng);

      let marker = new google.maps.Marker({
        map: this.map,
        position: markerData
      });

      marker.addListener(() => {
        this.map.panTo(marker.getPosition());
      });

      new MarkerClusterer(this.map, marker, {
        styles: [
          {
            height: 53,
            url: "assets/img/cluster/MapMarkerJS.png",
            width: 53,
            textColor: "#fff"
          },
          {
            height: 56,
            url: "assets/img/cluster/MapMarkerJS.png",
            width: 56,
            textColor: "#fff"
          },
          {
            height: 66,
            url: "assets/img/cluster/MapMarkerJS.png",
            width: 66,
            textColor: "#fff"
          },
          {
            height: 78,
            url: "assets/img/cluster/MapMarkerJS.png",
            width: 78,
            textColor: "#fff"
          },
          {
            height: 90,
            url: "assets/img/cluster/MapMarkerJS.png",
            width: 90,
            textColor: "#fff"
          }
        ]
      });

      google.maps.event.addListenerOnce(this.map, "idle", () => {
        google.maps.event.trigger(this.map, "resize");
        mapEle.classList.add("show-map");
        this.bounceMap(marker);
      });

      google.maps.event.addListener(this.map, "bounds_changed", () => {
        this.zone.run(() => {
          this.resizeMap();
        });
      });
    });
  }

  //Center zoom
  //http://stackoverflow.com/questions/19304574/center-set-zoom-of-map-to-cover-all-visible-markers
  bounceMap(marker) {
    let bounds = new google.maps.LatLngBounds();
    bounds.extend(marker.getPosition());
    this.map.fitBounds(bounds);
  }

  resizeMap() {
    setTimeout(() => {
      google.maps.event.trigger(this.map, "resize");
    }, 200);
  }

  showToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  choosePosition() {
    this.storage.get("lastLocation").then(result => {
      if (result) {
        let actionSheet = this.actionSheetCtrl.create({
          title: "Last Location: " + result.location,
          buttons: [
            {
              text: "Reload",
              handler: () => {
                this.getCurrentPosition();
              }
            },
            {
              text: "Delete",
              handler: () => {
                this.storage.set("lastLocation", null);
                this.showToast("Location deleted!");
                this.initializeMap();
              }
            },
            {
              text: "Cancel",
              role: "cancel",
              handler: () => {}
            }
          ]
        });
        actionSheet.present();
      } else {
        this.getCurrentPosition();
      }
    });
  }

  // go show currrent location
  getCurrentPosition() {
    this.loading = this.loadingCtrl.create({
      content: "Searching Location ..."
    });
    this.loading.present();

    let locationOptions = { timeout: 10000, enableHighAccuracy: true };

    this.geolocation.getCurrentPosition(locationOptions).then(
      position => {
        this.loading.dismiss().then(() => {
          this.showToast("Location found!");

          console.log(position.coords.latitude, position.coords.longitude);
          let myPos = new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          let options = {
            center: myPos,
            zoom: 18
          };
          this.map.setOptions(options);
          this.addMarker(myPos, "Mi Ubicación!");

          let alert = this.alertCtrl.create({
            title: "Location",
            message: "Do you want to save the Location?",
            buttons: [
              {
                text: "Cancel"
              },
              {
                text: "Save",
                handler: data => {
                  let lastLocation = {
                    lat: position.coords.latitude,
                    long: position.coords.longitude
                  };
                  console.log(lastLocation);
                  this.storage.set("lastLocation", lastLocation).then(() => {
                    this.showToast("Location saved");
                  });
                }
              }
            ]
          });
          alert.present();
        });
      },
      error => {
        this.loading.dismiss().then(() => {
          this.showToast("Location not found. Please enable your GPS!");

          console.log(error);
        });
      }
    );
  }

  toggleSearch() {
    if (this.search) {
      this.search = false;
    } else {
      this.search = true;
    }
  }

  addMarker(position, content) {
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: position
    });

    this.addInfoWindow(marker, content);
    return marker;
  }

  addInfoWindow(marker, content) {
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, "click", () => {
      infoWindow.open(this.map, marker);
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  savePedido() {
    this.lat = parseFloat(localStorage.getItem("latPedido"));
    this.lng = parseFloat(localStorage.getItem("lngPedido"));

    let data = {
      latPedido: this.lat,
      lngPedido: this.lng
    };

    let producto = {
      cantidad: '',
      nota: ''
    };

    localStorage.setItem("pedido", JSON.stringify(data));

    let productos = JSON.parse(localStorage.getItem('producto'));

    if (productos != null) {

      this.items = JSON.parse(localStorage.getItem('producto'));

    }
    

    this.items.push(producto);
    localStorage.setItem('producto', JSON.stringify(this.items));

    this.renderPedido();
  }

  renderPedido() {
    this.pedido = JSON.parse(localStorage.getItem("pedido"));
    this.productos = JSON.parse(localStorage.getItem("producto"));
    console.log(this.productos);
  }

  productModal() {
    const modal = this.modalCtrl.create(ModalProductPage);
    modal.present();
  }

  borrar_producto(slidingItem, idx) {
    // console.log(idx);
    this.productos.splice(idx, 1);
    // console.log(this.productos);
    localStorage.setItem('producto', JSON.stringify(this.productos));
    
    slidingItem.close();
  }

  productEditModal(idx) {
    const modal = this.modalCtrl.create( ModalProductPage, { producto: idx } );
    modal.present();
  }

  metodo_summary() {
    const modal = this.modalCtrl.create(SummaryPage);
    modal.present();
  }

}

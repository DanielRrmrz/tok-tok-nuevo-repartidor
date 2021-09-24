import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { PedidosProvider } from '../../providers/pedidos/pedidos';

@IonicPage()
@Component({
  selector: 'page-historial',
  templateUrl: 'historial.html',
})
export class HistorialPage {
  servicios: any;

  constructor(public navCtrl: NavController,
              private pedidosProv: PedidosProvider, 
              public modalCtrl: ModalController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    const uid = localStorage.getItem("idRepartidor");
    this.loadServicios(uid);
  }

  loadServicios(uid) {
    this.pedidosProv.getHistorial(uid).subscribe(service => {
      this.servicios = service;
      console.log("Estos son los servicios: ", this.servicios);
    });
  }

  // verMas(serviceID) {
  //   const modal = this.modalCtrl.create("PaymentPage", {
  //     serviceID: serviceID,
  //     records: true
  //   });
  //   modal.present();
  // }

}

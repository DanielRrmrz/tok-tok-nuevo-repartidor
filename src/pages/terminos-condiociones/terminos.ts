import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { ReportePage } from '../reporte/reporte';
import { ServicioPage } from '../servicio/servicio';


@IonicPage()
@Component({
  selector: 'page-terminos',
  templateUrl: 'terminos.html',
})
export class TerminosPage {

  constructor(public navCtrl: NavController,
              //private modalCtrl: ModalController,
              public navParams: NavParams,
              public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TerminosPage');
  }

  // porDia(){
  //   let modal = this.modalCtrl.create(ServicioPage);
  //   modal.present();
  // }

  // porFechas(){
  //   let modal = this.modalCtrl.create(ReportePage);
  //   modal.present();
  //}
  cerrar() { //TIBE
    this.viewCtrl.dismiss();
  }
}

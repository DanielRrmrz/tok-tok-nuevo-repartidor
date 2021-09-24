import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { GananciasdiaPage } from "../gananciasdia/gananciasdia";
import { ReportePage } from '../reporte/reporte';


@IonicPage()
@Component({
  selector: 'page-ganancias',
  templateUrl: 'ganancias.html',
})
export class GananciasPage {

  constructor(public navCtrl: NavController,
              private modalCtrl: ModalController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GananciasPage');
  }

  porDia(){
    let modal = this.modalCtrl.create(GananciasdiaPage);
    modal.present();
  }

  porFechas(){
    let modal = this.modalCtrl.create(ReportePage);
    modal.present();
  }

}

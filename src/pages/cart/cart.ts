/**
 * @author    Ionic Bucket <ionicbucket@gmail.com>
 * @copyright Copyright (c) 2017
 * @license   Fulcrumy
 * 
 * This file represents a component of Cart page
 * File path - '../../../../src/pages/cart/cart'
 */


import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ModalController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  productos: any[] = [];
  total: any = 0;
  total1: any = 0;
  totalProduc: any = 0;
  resultado: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private menu: MenuController,
    public modalCtrl: ModalController) {
    this.menu.enable(true);
  }

  ionViewDidLoad(){
    this.getData();
  }

  gotoDeliveryConfirmPage() {
    this.navCtrl.setRoot('DeliveryConfirmationPage');
  }
  goBack() {
    this.navCtrl.pop();
  }

  getData(){
    this.productos = JSON.parse(localStorage.getItem("carrito"));
    if(this.productos != null){
      for(let item of this.productos){
        this.totalProduc = item.precio*item.cantidad;
        console.log("EStos son los totales: ",this.totalProduc);
        
        this.total1 =this.totalProduc+this.total1;
        this.total = this.total1.toFixed(2);
      }
      this.resultado=1;
    } else{
      this.resultado=0;
    } 
    // console.log("Este es el total: ",this.total);    
    
  }
  
  borrar_producto(slidingItem, idx) {
    // console.log(idx);
    this.productos.splice(idx, 1);
    // console.log(this.productos);
    localStorage.setItem('carrito', JSON.stringify(this.productos));
    
    slidingItem.close();
    this.navCtrl.setPages([{ page: 'CartPage'}]);
  }
  productEditModal(idx, producto) {
    const modal = this.modalCtrl.create( "ModificarCarritoPage", { idx: idx, producto:producto} );
    modal.present();
  }
}

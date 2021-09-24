/**
 * @author    Ionic Bucket <ionicbucket@gmail.com>
 * @copyright Copyright (c) 2017
 * @license   Fulcrumy
 * 
 * This file represents a component of Contact Us page
 * File path - '../../../../src/pages/contact/contact'
 */


import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';


@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {
  rootPage: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private platform: Platform,
              private nativeStorage: NativeStorage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactPage');
  }

  Salir(){
      localStorage.removeItem("isLogin");
      localStorage.removeItem("idSucursal");
      localStorage.removeItem("idRepartidor");
      this.navCtrl.setRoot("LoginPage");    
  }

}

/**
 * @author    Ionic Bucket <ionicbucket@gmail.com>
 * @copyright Copyright (c) 2017
 * @license   Fulcrumy
 * 
 * This file represents a component of First Landing page
 * File path - '../../../../src/pages/first-landing/first-landing'
 */

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-first-landing',
  templateUrl: 'first-landing.html',
})
export class FirstLandingPage {
  developer = {};
  developers = [];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private menu: MenuController) {
    this.menu.enable(false); // Disable sidemenu
  }

  gotoSecondLandingPage() {
    this.navCtrl.setRoot('SecondLandingPage');
  }
}

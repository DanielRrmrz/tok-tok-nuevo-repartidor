/**
 * @author    Ionic Bucket <ionicbucket@gmail.com>
 * @copyright Copyright (c) 2017
 * @license   Fulcrumy
 * 
 * This file represents a component of Delivery Confirmation page
 * File path - '../../../../src/pages/delivery-confirmation/delivery-confirmation'
 */


import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-delivery-confirmation',
  templateUrl: 'delivery-confirmation.html',
})
export class DeliveryConfirmationPage {

  public DeliveryInfoForm: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private menu: MenuController) {
    this.menu.enable(true); // Enable sidemenu
  }

  /**
   * Do any initialization
   */
  ngOnInit() {
    this.formValidation();
  }

  /***
   * --------------------------------------------------------------
   * Form Validation
   * --------------------------------------------------------------
   * @method   formValidation
   */
  formValidation() {
    this.DeliveryInfoForm = this.formBuilder.group(
      {
        name: ['', Validators.compose([Validators.required])],
        mobile: ['', Validators.compose([Validators.required])],
        locationAddress1: ['', Validators.compose([Validators.required])],
        locationAddress2: ['', Validators.compose([Validators.required])],
        datetime: ['', Validators.compose([Validators.required])],
      }
    );
  }

  /**
   * --------------------------------------------------------------
   * Go To Menu Category Page
   * --------------------------------------------------------------
   */
  gotoPaymentPage() {
    this.navCtrl.setRoot('PaymentPage');
  }
}

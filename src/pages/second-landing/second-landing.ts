/**
 * @author    Ionic Bucket <ionicbucket@gmail.com>
 * @copyright Copyright (c) 2017
 * @license   Fulcrumy
 * 
 * This file represents a component of Second Landing page
 * File path - '../../../../src/pages/second-landing/second-landing'
 */


import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: "page-second-landing",
  templateUrl: "second-landing.html"
})
export class SecondLandingPage {
  languages: any;
  language: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private menu: MenuController,
    private http: HttpClient,
    public platform: Platform,
    public translateService: TranslateService
  ) {
    this.menu.enable(false); // Disable sidemenu
  }

  /** Do any initialization */
  ngOnInit() {
    this.getAllLanguages();
  }

  /**
   * -------------------------------------------------------------------
   * Get All Languages
   * -------------------------------------------------------------------
   * @method getAllLanguages
   */
  getAllLanguages() {
    this.http.get("assets/i18n/en.json").subscribe(
      (languages: any) => {
        this.languages = languages.LANGUAGES;
      },
      error => {
        console.error("Error: " + error);
      }
    );
  }

  /**
   * -------------------------------------------------------------------
   * Choose Language
   * -------------------------------------------------------------------
   * @method chooseLanguage
   * @param language      Selected Language
   *
   * When language code 'ar' then the platform direction will be 'rtl' otherwise platform direction 'ltr'
   */
  chooseLanguage(language) {
    if (language === "ar") {
      this.platform.setDir("rtl", true);
      this.translateService.setDefaultLang(language);
    } else {
      this.platform.setDir("ltr", true);
      this.translateService.setDefaultLang(language);
    }
  }

  /**
   * -------------------------------------------------------------------
   * Go To User Information Page
   * -------------------------------------------------------------------
   * @method gotoUserInfoPage     This function goto user information page and collect user Info's from user.
   */
  gotoUserInfoPage() {
    this.navCtrl.setRoot("LoginPage");
  }
}

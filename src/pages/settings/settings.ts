/**
 * @author    Ionic Bucket <ionicbucket@gmail.com>
 * @copyright Copyright (c) 2017
 * @license   Fulcrumy
 * 
 * This file represents a component of Settings page
 * File path - '../../../../src/pages/settings/settings'
 */


import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: "page-settings",
  templateUrl: "settings.html"
})
export class SettingsPage {
  languages: any;
  language: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: HttpClient,
    public platform: Platform,
    public translateService: TranslateService
  ) {}

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
}

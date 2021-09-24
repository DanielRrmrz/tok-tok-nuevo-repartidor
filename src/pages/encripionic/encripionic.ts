import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Platform } from 'ionic-angular/index';
declare var cordova: any;

@IonicPage()
@Component({
  selector: "page-encripionic",
  templateUrl: "encripionic.html"
})
export class EncripionicPage {
  secureKey: String = '12345678910123456789012345678901'; // Any string, the length should be 32
  secureIV: String = '1234567891123456'; // Any string, the length should be 16
  constructor(
    private platform: Platform,
  ) {
    // To generate random secure key
    this.generateSecureKey('some string');  // Optional
      
    // To generate random secure IV
    this.generateSecureIV('some string');   // Optional
    
    let data = "test";
    this.encrypt(this.secureKey, this.secureIV, data); 
    let encryptedData = "AE#3223==";
    this.decrypt(this.secureKey, this.secureIV, encryptedData);  
  }

  ionViewDidLoad() {
    
  }

  encrypt(secureKey, secureIV, data) {
    this.platform.ready().then(() => {
      cordova.plugins.AES256.encrypt(secureKey, secureIV, data,
        (encrypedData) => {
          console.log('Encrypted Data----', encrypedData);
        }, (error) => {
          console.log('Error----', error);
        });
    });
  }

  decrypt(secureKey, secureIV, encryptedData) {
    this.platform.ready().then(() => {
      cordova.plugins.AES256.decrypt(secureKey, secureIV, encryptedData,
        (decryptedData) => {
          console.log('Decrypted Data----', decryptedData);
        }, (error) => {
          console.log('Error----', error);
        });
    });
  }
  
  generateSecureKey(password) {
    this.platform.ready().then(() => {
      cordova.plugins.AES256.generateSecureKey(password,
        (secureKey) => {
          this.secureKey = secureKey;
          console.log('Secure Key----', secureKey);          
        }, (error) => {
          console.log('Error----', error);
        });
    });
  }
  
  generateSecureIV(password) {
    this.platform.ready().then(() => {
      cordova.plugins.AES256.generateSecureIV(password,
        (secureIV) => {
          this.secureIV = secureIV;
          console.log('Secure IV----', secureIV);          
        }, (error) => {
          console.log('Error----', error);
        });
    });
  }
}

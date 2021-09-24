import { Injectable } from "@angular/core";
import { OneSignal } from "@ionic-native/onesignal";
import { Platform } from 'ionic-angular';
import { AuthProvider } from '../auth/auth';
import { NativeStorage } from '@ionic-native/native-storage';

@Injectable()
export class PushnotiProvider {
  uidUser: any;
  playerID: any;
  constructor(private oneSignal: OneSignal,
              public platform: Platform,              
              private nativeStorage: NativeStorage,
              public _providerUser: AuthProvider) {
    console.log("Hello PushnotiProvider Provider");
  }

  init_notifications() {

    if(this.platform.is('cordova')){

      this.oneSignal.startInit(
        "3fcb50bf-10a1-46ba-a57f-b0964e58a522",
        "134453154716"
      );
  
      this.oneSignal.inFocusDisplaying(
        this.oneSignal.OSInFocusDisplayOption.Notification
      );
  
      this.oneSignal.handleNotificationReceived().subscribe(() => {
        // do something when notification is received
        console.log("Notificacion Recibida");
      });
  
      this.oneSignal.handleNotificationOpened().subscribe(() => {
        // do something when a notification is opened
        console.log("Notificacion Abierta");
      });
      
      this.oneSignal.getIds().then(data => {
        // alert('Data :' + JSON.stringify(data));
          const uidUser = localStorage.getItem("idRepartidor");
          const playerID = data.userId;
          this._providerUser.idOneSignal(uidUser, playerID);
          localStorage.setItem("playerID", playerID);            
      });
  
      this.oneSignal.endInit();

    }else{
      console.log("One signal no funciona en chrome");
    }
  }
}

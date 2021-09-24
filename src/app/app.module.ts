import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { IonicStorageModule } from "@ionic/storage";
import { HttpModule } from "@angular/http";
import { Stripe } from "@ionic-native/stripe";
import { BackgroundGeolocation } from "@ionic-native/background-geolocation";
import { NativeStorage } from '@ionic-native/native-storage';
import { Network } from '@ionic-native/network';



//Pages
// import { ServicioPage } from '../pages/servicio/servicio';

//Redes Sociales
import { Camera } from '@ionic-native/camera';

// By default TranslateLoader will look for translation json files in i18n/
// So change this lool in the src/assets directory.
export function TranslateLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

//firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireDatabaseModule, AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import * as firebase from "firebase/app";
import { AuthProvider } from '../providers/auth/auth';
import { PedidosProvider } from '../providers/pedidos/pedidos';
import { SubirticketProvider } from '../providers/subirticket/subirticket';
import { UbicacionProvider } from '../providers/ubicacion/ubicacion';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction'
import { OneSignal } from '@ionic-native/onesignal';
import { PushnotiProvider } from '../providers/pushnoti/pushnoti';
import { LocalNotifications } from "@ionic-native/local-notifications";
import { EmojiProvider } from '../providers/emoji/emoji';
import { ChatserviceProvider } from '../providers/chatservice/chatservice';
import { CallNumber } from '@ionic-native/call-number';
import { HistoryProvider } from '../providers/history/history';

//Conexión
export const firebaseConfig = {
  apiKey: "AIzaSyCBWTmCjb-1_zDsl-yjBwl3EqCnVA_SEto",
    authDomain: "toctoc-54179.firebaseapp.com",
    databaseURL: "https://toctoc-54179.firebaseio.com",
    projectId: "toctoc-54179",
    storageBucket: "toctoc-54179.appspot.com",
    messagingSenderId: "134453154716",
    appId: "1:134453154716:web:26965999c2d8fd821eee59",
    measurementId: "G-SN55VRL2WJ"
};

firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [MyApp],
  imports: [
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule.enablePersistence(),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    // AngularFirestoreModule,
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      menuType: "overlay",
      preloadModules: true,
      platforms: {
        ios: {
          backButtonText: ""
        }
      }
    }),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: TranslateLoaderFactory,
        deps: [HttpClient]
      }
    }),
    IonicStorageModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyDhkHiz_LkMhVCfTsGJajw5Ag4u9d6ah2I"
    }),
    AgmDirectionModule,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Geolocation,
    AngularFireDatabase,
    AuthProvider,
    PedidosProvider,
    Camera,
    SubirticketProvider,
    UbicacionProvider,
    PushnotiProvider,
    OneSignal,
    Stripe,
    LocalNotifications,
    EmojiProvider,
    ChatserviceProvider,
    CallNumber,
    BackgroundGeolocation,
    NativeStorage,
    Network,
    HistoryProvider 
  ]
})
export class AppModule {}

import { Component, ViewChild } from "@angular/core";
import { Nav, Platform, AlertController } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { TranslateService } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { NativeStorage } from '@ionic-native/native-storage';


// import * as firebase from "firebase/app";
import { UbicacionProvider } from '../providers/ubicacion/ubicacion';
import { PedidosProvider } from '../providers/pedidos/pedidos';

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  isLogin:any;
  servicio: any;

  pages: Array<{ NAME: string; COMPONENT: any; ICON: string }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public translateService: TranslateService,
    public http: HttpClient,
    public alertCtrl: AlertController,
    public ubicacionProv: UbicacionProvider, 
    public pedidosProv: PedidosProvider,
    private nativeStorage: NativeStorage
  ) {
    this.initializeApp();

    // Default Language
    translateService.setDefaultLang("es");
  }

  initializeApp() {
    this.platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.splashScreen.hide();
      this.getSidebarList();
      // Subsequent queries will use persistence, if it was enabled successfully
      if (localStorage.getItem("isLogin") == "true") {
        let servIniciado = localStorage.getItem("servIniciado");
        // let pago = localStorage.getItem("pago");
        if (servIniciado != null) {
          this.pedidosProv.getServicio(servIniciado).then((servicio) => {
            this.servicio = servicio;
            if (this.servicio.estatus != "Pago") {
                          
          let tipo = localStorage.getItem("tipoS");
          const confirm = this.alertCtrl.create({
            title: "Alerta",
            message: "Usted tiene un servicio en ejecución",
            buttons: [
              {
                text: "Continuar",
                handler: () => {
                  // this.rootPage = "CartPage";
                  this.nav.setPages([
                    {
                      page: "ServicioPage",
                      params: {
                        tipo: tipo,
                        servicioID: servIniciado,
                        reingreso: 1
                      }
                    }
                  ]);
                  // console.log('Clic en Mantenerse');
                }
              }
            ]
          });
          confirm.present();
        }else{
          let tipo = localStorage.getItem("tipoS");
          const confirm = this.alertCtrl.create({
            title: "Alerta",
            message: "Usted tiene un servicio en ejecución",
            buttons: [
              {
                text: "Continuar",
                handler: () => {
                  // this.rootPage = "CartPage";
                  this.nav.setPages([
                    {
                      page: "CobrarPage",
                      params: {
                        tipo: tipo,
                        servicioID: servIniciado,
                        reingreso: 1
                      }
                    }
                  ]);
                  // console.log('Clic en Mantenerse');
                }
              }
            ]
          });
          confirm.present();
        }
        });
        } else {
          this.rootPage = "HomePage";
          console.log("Debe ir a la pagina home");
        }
      } else {
        this.rootPage = "LoginPage";
      }

      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString("#E36485");
      this.ubicacionProv.inicializarRepartidor();
      this.ubicacionProv.iniciarGeolocalizacion();      
    });
  }

  /**
   * --------------------------------------------------------------
   * Get Sidebar List
   * --------------------------------------------------------------
   */
  getSidebarList() {
    this.http.get("assets/i18n/en.json").subscribe(
      (data: any) => {
        this.pages = data.SIDEBAR_List;
      },
      error => {
        console.error(error);
      }
    );
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page);
  }
}

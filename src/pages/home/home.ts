import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  MenuController,
  ModalController,
  AlertController
} from "ionic-angular";

import { Observable } from "rxjs/Observable";
import { PedidosProvider } from "../../providers/pedidos/pedidos";
// import { AngularFireAuth } from "angularfire2/auth";
import { PushnotiProvider } from "../../providers/pushnoti/pushnoti";
import { LocalNotifications } from "@ionic-native/local-notifications";
import { Platform, LoadingController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { Http, URLSearchParams} from '@angular/http';
import { Network } from '@ionic-native/network';

import 'rxjs/add/operator/map';

import "firebase/firestore";
import * as firebase from "firebase/app";



@IonicPage()
@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  // servicios: Observable<any[]>;
  clientes: Observable<any[]>;
  convenios: Observable<any[]>;
  serviciosPLQ: any[];
  serviciosR: any[];
  serviPLQ: number;
  serviR: number;
  uid: any;
  idSucursal: any;
  repartidor: any = {};
  service: any = {};
  playerIDRepartidor: any;
  servicioID: any = '1';
  loading: any = '';

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public menu: MenuController,
    public modalCtrl: ModalController,
    public pedidosProv: PedidosProvider,
    // private afAuth: AngularFireAuth,
    public localNoti: LocalNotifications,
    public platform: Platform,
    public alertCtrl: AlertController,
    public _pushProv: PushnotiProvider, 
    private network: Network,   
    private nativeStorage: NativeStorage,
    public http: Http
    
  ) {
      this.menu.enable(true); // Enable sidemenu
      // this.uid = this.afAuth.auth.currentUser.uid;
      this.uid = localStorage.getItem("idRepartidor");
      this.playerIDRepartidor = localStorage.getItem("playerID");
      console.log("Esta es el id del Repartidor: ", this.uid);
      this._pushProv.init_notifications();
    // localStorage.setItem("idRepartidor",this.uid);
    // this.verificarConexion();
    // this.verConexion();

    
  }

  ionViewDidLoad() {
    // console.log("ionViewDidLoad HomePage");
    this.consultaRepartidor();
    // this.numRandom();
    // this.loadClientes();
    // this.loadConvenios();
    //Iniciar Geolocalizacion
  }

  verConexion(){
    var connectedRef = firebase.database().ref(".info/connected");
    connectedRef.on("value", function(snap) {
      console.log("Este es el resultado: ", snap.val());
      if (snap.val() != true) {
        this.loading = this.loadingCtrl.create({
          spinner: "bubbles",
          content: "Se perdio la conexión..."
        });
    
        this.loading.present();     

      } else {
        // alert("not connected");
        this.loading.dismiss();        


        // this.loadingCtrl.create({
        //   spinner: "bubbles",
        //   content: "Se perdio la conexión..."
        // });
    
        // this.loadingCtrl.present();    
      }
    });
  }

  verificarConexion(){
     this.network.onDisconnect().subscribe(() => {
    console.log('network was disconnected :-(');
    let loading = this.loadingCtrl.create({
      spinner: "bubbles",
      content: "Se perdio la conexión..."
    });

    loading.present();     

    this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      loading.dismiss();        
    });          
  });
}

  consultaRepartidor() {
    this.pedidosProv.getRepartidor(this.uid).then(res => {
      this.repartidor = res;
      this.loadServiciosPLQ(this.repartidor.uidSucursal);
      this.loadServiciosR(this.repartidor.uidSucursal);
      console.log("Id Sucursal: ", this.repartidor.uidSucursal);
      
    });
  }

  // loadServicios() {
  //   this.pedidosProv.getAllServicios("servicios").then(p => {
  //     this.servicios = p;
  //     console.log("Servicios: ", this.servicios);

  //   });
  // }

  loadServiciosPLQ(idSucursal) {
    this.pedidosProv.getServiciosPLQ(idSucursal).subscribe(serviciosPLQ => {
      this.serviciosPLQ = serviciosPLQ;
      // this.data = JSON.stringify(this.servicios);
      // console.log("Servicios PLQ: ", this.serviciosPLQ);
      this.serviPLQ = this.serviciosPLQ.length;

      // console.log("JAJAJAPLQ: ", this.serviciosPLQ.length);

        let Servicio = localStorage.getItem("servIniciado");
        if (Servicio == null) {
          this.serviciosPLQ.forEach(data => {
            console.log(data.tipo);
            if (data.estatus == "Notificando" && data.tipo == 1) {
              // this.notiNewPedido();
            }
          });
        }           
    });
  }

  loadServiciosR(idSucursal) {
    this.pedidosProv.getServiciosR(idSucursal).subscribe(serviciosR => {
      this.serviciosR = serviciosR;
      // console.log("SERvicios RES: ", this.serviciosR);
      this.serviR = this.serviciosR.length;
      // console.log("JAJAJARES: ", this.serviciosR.length);
        let Servicio = localStorage.getItem("servIniciado");
        if (Servicio == null) {
          this.serviciosR.forEach(data => {
            console.log(data.tipo);
            if (data.estatus == "BuscandoBme" && data.tipo == 2) {
              // this.notiNewPedido();
            }
          });
        }   
    });
  }

  // loadClientes() {
  //   this.pedidosProv.getAllClientes("users").then(c => {
  //     this.clientes = c;
  //   });
  // }

  // loadConvenios() {
  //   this.pedidosProv.getAllConvenios("users").then(con => {
  //     this.convenios = con;
  //   });
  // }

  //   this.terminados.forEach(obj => {
  //     var contador=1;
  //      obj.forEach(childObj=> {
  //        console.log("Hola"+contador);
  //        contador=contador+1;
  //        console.log(childObj);
  //        console.log(childObj.orden.status);

  //     })
  //  });

  // getDetalles() {

  //   this.pedidosProv.getCliente(this.producto).then(e => {
  //     this.detalles = e;
  //     // console.log('Detalles del producto: ',this.detalles);
  //   });

  // }

  aceptarServicio(servicioID, tipo, playerIDRepartidor) {
    // alert("this.playerIDRepartidor en home.ts" + playerIDRepartidor);
    let loading = this.loadingCtrl.create({
      spinner: "bubbles",
      content: "Cargando servicio..."
    });
     loading.present();
    this.pedidosProv.getServicio(servicioID).then(e => {
      this.service = e;
      console.log("Servicio: ", this.service);
      console.log("Este es el id: ", servicioID);
      

      if (tipo != 2) {
        if (
          this.service.estatus != "Aceptado" &&
          this.service.uidRepartidor == undefined
        ) {
          console.log("JAJAJ: ", this.service.uidRepartidor);
            localStorage.setItem("servIniciado", servicioID);
            localStorage.setItem("tipoS", tipo);         
          status = "Aceptado";
          this.pedidosProv.aceptarServicio(
            servicioID,
            status,
            this.uid,
            playerIDRepartidor
          ).then((res: any) => {
           if (res.success == true) {
             localStorage.removeItem("totComision");
             localStorage.removeItem("totalProd");
             localStorage.removeItem("totalFinal");
             localStorage.removeItem("comisionServicio");
             localStorage.removeItem("corteRep");
             localStorage.removeItem("totalProd1");
             localStorage.removeItem("corteBme"); 
             localStorage.removeItem("recargos");
             localStorage.removeItem("totalLugares");
             localStorage.removeItem("porcentaje"); 

             setTimeout(() => {
               loading.dismiss();
             }, 5000);

             this.navCtrl.setRoot(
              "ServicioPage",
              {
                servicioID: servicioID     
              },
              {
                
                animation: "md-transition",
                animate: true,
                direction: "down"
              }
            );

            //  const modal = this.modalCtrl.create("ServicioPage", {
            //    servicioID: servicioID
            //  });
            //  modal.present();
           }
          });
        } else {
          this.errorAceptado();
          setTimeout(() => {
            loading.dismiss();
          }, 5000);
        }
      } else {
        if (
          this.service.estatus != "AceptaBme" &&
          this.service.uidRepartidor == undefined
        ) {
            localStorage.setItem("servIniciado", servicioID);
            localStorage.setItem("tipoS", tipo);
          
          status = "AceptaBme";
          this.pedidosProv.aceptarServicio(
            servicioID,
            status,
            this.uid,
            playerIDRepartidor
          ).then((res: any) => {
            if (res.success == true) {
              localStorage.removeItem("totComision");
              localStorage.removeItem("totalProd");
              localStorage.removeItem("totalFinal");
              localStorage.removeItem("comisionServicio");
              localStorage.removeItem("corteRep");
              localStorage.removeItem("totalProd1");
              localStorage.removeItem("corteBme");
              localStorage.removeItem("porcentaje"); 
             localStorage.removeItem("recargos");
             localStorage.removeItem("totalLugares");

              setTimeout(() => {
                loading.dismiss();
              }, 5000);
              // const modal = this.modalCtrl.create("ServicioPage", {
              //   servicioID: servicioID
              // });
              // modal.present();
              this.navCtrl.setRoot(
                "ServicioPage",
                {
                  servicioID: servicioID     
                },
                {
                  
                  animation: "md-transition",
                  animate: true,
                  direction: "down"
                }
              );
            }
          });
        } else {
          this.errorAceptado();
          setTimeout(() => {
            loading.dismiss();
          }, 5000);
        }
      }
    });
  }
  errorAceptado() {
    const confirm = this.alertCtrl.create({
      title: "Alerta",
      message: "El servicio ya fue tomado por otro repartidor.",
      buttons: [
        {
          text: "Aceptar",
          handler: () => {
          }
        }
      ]
    });
    confirm.present();
  }

  // openRestaurante() {
  //   const modal = this.modalCtrl.create("FoodCategoriesPage");
  //   modal.present();
  // }

  // openDetalle(idCliente, servicio, tipo, playerID) {
  //   const modal = this.modalCtrl.create("DetalleservicioPage", {
  //     cliente: idCliente,
  //     servicio: servicio,
  //     tipo: tipo,
  //     playerID: playerID
  //   });
  //   modal.present();
  // }

  // openDetalle1() {
  //   const modal = this.modalCtrl.create("EncriptarPage");
  //   modal.present();
  // }

  notiNewPedido() {
    // Schedule delayed notification
    if (this.platform.is("android")) {
      this.localNoti.schedule({
        id: 1,
        title: "Nuevo pedido",
        sound: null
      });
      this.setSound();
    } else {
      this.localNoti.schedule({
        id: 1,
        title: "Nuevo pedido",
        sound: this.setSound()
      });
    }
  }

  setSound() {
    if (this.platform.is("android")) {
      let audio = new Audio();
      audio.src = "/assets/sounds/noti.mp3";
      audio.load();
      audio.play();
    } else {
      return "file://assets/sounds/noti.caf";
    }
  }

  limpiarNotificacion() {
    this.localNoti.clearAll();
  }

  numRandom(){
      let a = '100000';
      const num = Math.round(Math.random() * (999999 - 100000) + parseInt(a));
      alert(num);
  }

  masDetalles(idServicio, idCliente, tipo, playerID){
    console.log("Id del Servicio: ", idServicio);
    this.navCtrl.setRoot(
      "MasdetallesPage",
      {
          idServicio: idServicio,
          idCliente: idCliente,
          tipo: tipo,
          playerID: playerID        
      },
      {
        
        animation: "md-transition",
        animate: true,
        direction: "down"
      }
    );
    
  }

  /*
  pagar(){
    
    let data = new URLSearchParams();

    
      data.append("totalProd",  "totalProd");
      data.append("totalProd1",  "totalProd1");
      data.append("comisionServicio",  "comisionServicio");
      data.append("totalFinal",  "totalFinal");
      data.append("totComision",  "totComision");
      data.append("corteBme",  "corteBme");
      data.append("corteRep",  "corteRep");
      data.append("totalLugares",  "totalLugares");
      data.append("recargos",  "recargos");
      data.append("porcentaje",  "porcentaje");
      data.append("metodo_pago", "metodo_pago");
      data.append("idSucursal", "idSucursal");
      data.append("accion", 'charge');
    
    const url = `https://proyectosinternos.com/bm/bm/index.php/post_cobrar/realizar_cobro/${ this.servicioID }`;
    this.http
      .post(
        url,
        data,
      )
      .subscribe(res => {
        
        const msj = res.json().mensaje; 
        console.log('Cobrar Respuesta:', msj);


    });
  }

  cargo(){
    
    const url = `https://proyectosinternos.com/bm/bm/index.php/cobrar/${ this.servicioID }`;
    this.http
      .get( url )
      .subscribe(res => {
        const cargo = res.json().cargo;
        console.log('Cobrar Respuesta:', cargo.id_cobrar);

    });
    
  }
  */
  
}

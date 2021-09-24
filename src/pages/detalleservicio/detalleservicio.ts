import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController
} from "ionic-angular";

import { PedidosProvider } from "../../providers/pedidos/pedidos";
import { Observable } from "rxjs/Observable";
// import { ServicioPage } from '../servicio/servicio';
import { Platform } from "ionic-angular";
import { NativeStorage } from "@ionic-native/native-storage";

@IonicPage()
@Component({
  selector: "page-detalleservicio",
  templateUrl: "detalleservicio.html"
})
export class DetalleservicioPage {
  uid: any;
  servicio: any;
  tipo: any;
  idCliente: any;
  pedidos: Observable<any[]>;
  productos: Observable<any[]>;
  clientes: Observable<any[]>;
  service: any = {};
  totalSer: any;
  servCompletados: any;
  servCancelados: any;
  playerIDRepartidor: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public pedidosProv: PedidosProvider,
    private platform: Platform,
    private nativeStorage: NativeStorage
  ) {
    this.servicio = this.navParams.get("servicio");
    this.playerIDRepartidor = navParams.get("playerID");

    console.log("Este es el servicio: ", this.servicio);

    this.idCliente = this.navParams.get("cliente");
    console.log("ID del cliente: ", this.idCliente);

    this.tipo = this.navParams.get("tipo");
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad DetalleservicioPage');
    // this.getPedidos();
    // this.loadClientes();
    this.getServicio();
    this.getTotalServ();
    this.getServiciosCompletados();
    this.getServiciosCancelados();
  }

  // getPedidos() {
  //   this.pedidosProv.getPedidos1(this.servicio).then(e => {
  //     this.pedidos = e;
  //     console.log('Estos son los detalles: ',this.pedidos);
  //   });
  // }

  getTotalServ() {
    this.pedidosProv.getTotalServ(this.idCliente).then(total => {
      let totalServ0 = total;
      if (totalServ0 != null) {
        this.totalSer = totalServ0.length - 1;
      } else {
        this.totalSer = 0;
      }
      // this.servCompletados= totalServ.length;
      console.log("Total de servicios: ", this.totalSer);
    });
  }

  getServiciosCompletados() {
    this.pedidosProv.getServCompletados(this.idCliente).then(total => {
      let totalServ = total;
      if (totalServ != null) {
        this.servCompletados = totalServ.length;
      } else {
        this.servCompletados = 0;
      }
      // this.servCompletados= totalServ.length;
      // console.log("Este es el total de servicios Completados 1: ",this.servCompletados);
    });
  }

  getServiciosCancelados() {
    this.pedidosProv.getServCancelados(this.idCliente).then(total => {
      let totalServ1 = total;
      if (totalServ1 != null) {
        this.servCancelados = totalServ1.length;
      } else {
        this.servCancelados = 0;
      }
      // console.log("Servicios Calcelados: ",totalServ1);
      // // this.servCancelados= totalServ1.length;
      // console.log("Este es el total de servicios Cancelados : ",this.servCancelados);
    });
  }

  // getProductos(uid){
  //   this.pedidosProv.getProductos(uid).then(p =>{
  //     this.productos = p;
  //     console.log("Estos son los productos: ",this.productos);

  //   });
  // }

  // loadClientes() {
  //   this.pedidosProv.getAllClientes("users").then(c => {
  //     this.clientes = c;
  //     console.log("Estos son los clientes: ", this.clientes);
  //   });
  // }

  getServicio() {
    this.pedidosProv.getServicio(this.servicio).then(e => {
      this.service = e;
      console.log("Servicio: ", this.service);
    });
  }

  aceptarServicio() {
    this.uid = localStorage.getItem("idRepartidor");
    localStorage.setItem("servIniciado", this.servicio);
    localStorage.setItem("tipoS", this.tipo);
    var status = "";
    if (this.tipo != 2) {
      status = "Aceptado";
    } else {
      status = "AceptaBme";
    }
    this.pedidosProv.aceptarServicio(
      this.servicio,
      status,
      this.uid,
      this.playerIDRepartidor
    );
    const modal = this.modalCtrl.create("ServicioPage", {
      servicioID: this.servicio
    });
    modal.present();
  }

  goBack() {
    this.navCtrl.pop();
  }
}

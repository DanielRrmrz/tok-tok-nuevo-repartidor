import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { PedidosProvider } from '../../providers/pedidos/pedidos';
import { Observable } from "rxjs/Observable";

@IonicPage()
@Component({
  selector: 'page-masdetalles',
  templateUrl: 'masdetalles.html',
})
export class MasdetallesPage {
  idServicio: any;
  servicio: any = { };
  playerIDRepartidor: any;
  idCliente: any;
  tipo: any;
  totalSer: any;
  servCompletados: any;
  servCancelados: any;
  pedidos: any[];
  productos: Observable<any[]>;
  uid: any;

  constructor(public navCtrl: NavController,
              private pedidosProv: PedidosProvider, 
              public modalCtrl: ModalController,
              public navParams: NavParams) {
    this.idServicio = navParams.get('idServicio');
    // console.log("Key del servicio: ",this.idServicio);

    // this.servicio = this.navParams.get("servicio");
    this.playerIDRepartidor = navParams.get("playerID");
    // console.log("Player Id Repartidor: ", this.playerIDRepartidor);
    

    this.idCliente = this.navParams.get("idCliente");
    // console.log("ID del cliente: ", this.idCliente);

    this.tipo = this.navParams.get("tipo");
    // console.log("Tipo: ", this.tipo);
    
                    
  }

  ionViewDidLoad() {
    this.consultaServicio();
    this.getTotalServ();
    this.getServiciosCompletados();
    this.getServiciosCancelados();
    this.getPedidos();
    this.getProductos();
  }

  consultaServicio(){
    this.pedidosProv.getServicio(this.idServicio).then(serv=>{
      this.servicio = serv;
      console.log("Servicio: ", this.servicio);
      
    });
  }
  getPedidos() {
    this.pedidosProv
      .getPedidos(this.idServicio)
      .subscribe(pedidos => {
        this.pedidos = pedidos;
        // console.log("Estos son los pedidos: ", this.pedidos);
      });
  }
  getProductos() {
    this.pedidosProv.getAllProducts(this.idServicio).then(p => {
      this.productos = p;
      // console.log("Estos son los productos: ", this.productos);
    });
  }


  getTotalServ() {
    this.pedidosProv.getTotalServ(this.idCliente).then(total => {
      let totalServ0 = total;
      if (totalServ0 != null) {
        this.totalSer = totalServ0.length - 1;
      } else {
        this.totalSer = 0;
      }
      // this.servCompletados= totalServ.length;
      // console.log("Total de servicios: ", this.totalSer);
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

  aceptarServicio() {
    this.uid = localStorage.getItem("idRepartidor");
    localStorage.setItem("servIniciado", this.idServicio);
    localStorage.setItem("tipoS", this.tipo);
    var status = "";
    if (this.tipo != 2) {
      status = "Aceptado";
    } else {
      status = "AceptaBme";
    }
    this.pedidosProv.aceptarServicio(
      this.idServicio,
      status,
      this.uid,
      this.playerIDRepartidor
    );
    // const modal = this.modalCtrl.create("ServicioPage", {
    //   servicioID: this.idServicio
    // });
    // modal.present();

    this.navCtrl.setRoot(
      "ServicioPage",
      {
        servicioID: this.idServicio     
      },
      {
        
        animation: "md-transition",
        animate: true,
        direction: "down"
      }
    );
  }


  goBack() {
    this.navCtrl.setRoot(
      "HomePage",
      {
        // uidCategoria: this.uidCategoria,
        // restaurante: this.restauranteId
      },
      {
        
        animation: "md-transition",
        animate: true,
        direction: "down"
      }
    );
  }

}

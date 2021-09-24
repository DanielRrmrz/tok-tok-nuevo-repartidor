import { Component, ViewChild, ElementRef } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ToastController,
  ModalController,
  LoadingController
} from "ionic-angular";
import { PedidosProvider } from "../../providers/pedidos/pedidos";
import * as moment from "moment";
import * as CryptoJS from "crypto-js";
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { Stripe } from "@ionic-native/stripe";
import { Platform } from "ionic-angular";
import { NativeStorage } from "@ionic-native/native-storage";
import { Network } from '@ionic-native/network';
import { CallNumber } from "@ionic-native/call-number";


@IonicPage()
@Component({
  selector: "page-cobrar",
  templateUrl: "cobrar.html"
})
export class CobrarPage {
  @ViewChild("map") mapElement: ElementRef;

  servicioID: any;
  pedidos: any[];
  servicio: any = {};
  _inicio: any;
  _termino: any;
  minutos: any;
  totalProd: any;
  totalProd1: any;
  comisionServicio: any;
  totComision: any;
  totalF: any;
  totalFinal: any = 0;
  corteBme;
  corteRep;
  card: any = {};
  idSucursal: any;
  costosFijos: any = {};
  tarifas: any = {};
  arranque: any;
  tarifa: any;
  tarifaTime: any;
  tarifaKM: any;
  puntos: any;
  origen: any;
  destino: any;
  totalKm: any;
  metodo_pago: any;
  totalLugares: any;
  recargos: any;
  porcentaje: any;
  usuario: any = {};

  public destination: any;
  public origin: any;
  public driving: any = "DRIVING";
  public map: any;

  testRadioOpen: boolean;
  metodoPago: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public pedidosProv: PedidosProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadinCtl: LoadingController,
    private callNumber: CallNumber,
    public stripe: Stripe,
    public modalCtrl: ModalController,
    public http: Http,
    private platform: Platform,
    private network: Network,
    private nativeStorage: NativeStorage
  ) {
    this.servicioID = localStorage.getItem("servIniciado");
    console.log("This is the service: ", this.servicioID);
    this.idSucursal = localStorage.getItem("idSucursal");
    // console.log("This is the Sucursal: ", this.idSucursal);
    this.pedidosProv.getOneServicio(this.servicioID).subscribe(servicio => {
      console.log("Datos: ",servicio.metodo_pago, " ", servicio.cambio);
      this.consultaUsuario(servicio.uidCliente);
      
      if (servicio.metodo_pago == "Efectivo" && servicio.cambio == "cambio") {
        this.actualizarDatos();
      }
    });

    this.verificarConexion();
  }

  ionViewDidLoad() {
    this.consultaServicio();
    // this.getPedidos_();

    const metodo_pago = localStorage.getItem("metodo_pago");
    if (metodo_pago == "Efectivo") {
      setTimeout(() => {
        const url = `https://proyectosinternos.com/toctoc/toctoc/index.php/cobrar/${this.servicioID}`;
        this.http.get(url).subscribe(res => {
          const cargo = res.json().cargo;
          console.log("Cobrar Respuesta:", cargo);

          this.totalProd = cargo.totalProd;
          this.totalProd1 = cargo.totalProd1;
          this.comisionServicio = cargo.comisionServicio;
          this.totalFinal = cargo.totalFinal;
          this.totComision = cargo.totComision;
          this.corteBme = cargo.corteBme;
          this.corteRep = cargo.corteRep;
          this.totalLugares = cargo.totalLugares;
          this.recargos = cargo.recargos;
          this.porcentaje = cargo.porcentaje;
        });
      }, 5000);
    } else {
      setTimeout(() => {
        const url = `https://proyectosinternos.com/toctoc/toctoc/index.php/cobrar/${this.servicioID}`;
        this.http.get(url).subscribe(res => {
          const cargo = res.json().cargo;
          console.log("Cobrar Respuesta:", cargo);

          this.totalProd = cargo.totalProd;
          this.comisionServicio = cargo.comisionServicio;
          this.totalFinal = cargo.totalFinal;
          this.totComision = cargo.totComision;
          this.totalLugares = cargo.totalLugares;
          this.recargos = cargo.recargos;
          this.porcentaje = cargo.porcentaje;
        });
      }, 5000);
    }
  }

  consultaUsuario(idUsuario) {
    this.pedidosProv.getOneUsuario(idUsuario).subscribe((usuario) => {
      this.usuario = usuario;
      console.log("Este es el usuario Cliente: ", this.usuario);
    });
  }

  verificarConexion(){
    this.network.onDisconnect().subscribe(() => {
    console.log('network was disconnected :-(');
    let loading = this.loadinCtl.create({
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

actualizarDatos(){
  const url = `https://proyectosinternos.com/toctoc/toctoc/index.php/cobrar/${this.servicioID}`;
  this.http.get(url).subscribe(res => {
    const cargo = res.json().cargo;
    console.log("Cobrar Respuesta:", cargo);

    this.totalProd = cargo.totalProd;
    this.totalProd1 = cargo.totalProd1;
    this.comisionServicio = cargo.comisionServicio;
    this.totalFinal = cargo.totalFinal;
    this.totComision = cargo.totComision;
    this.corteBme = cargo.corteBme;
    this.corteRep = cargo.corteRep;
    this.totalLugares = cargo.totalLugares;
    this.recargos = cargo.recargos;
    this.porcentaje = cargo.porcentaje;
  });

  let totalNuevo = this.totalFinal - this.totComision;
  let totComi = 0;
  this.update_cobro(totalNuevo, totComi);  
}

  update_cobro(totalNuevo, totComi) {
    const metodoPago = localStorage.getItem("metodoPago");
    if (metodoPago != "cambio") {
      let data = new URLSearchParams();

      data.append("totalProd", this.totalProd);
      data.append("totalProd1", this.totalProd1);
      data.append("comisionServicio", this.comisionServicio);
      data.append("totalFinal", totalNuevo);
      data.append("totComision", totComi);
      data.append("corteBme", this.corteBme);
      data.append("corteRep", this.corteRep);
      data.append("totalLugares", this.totalLugares);
      data.append("recargos", this.recargos);
      data.append("porcentaje", this.porcentaje);
      data.append("idSucursal", this.idSucursal);
      data.append("servicioID", this.servicioID);

      const url = `https://proyectosinternos.com/toctoc/toctoc/index.php/post_cobrar/update_cobro/${this.servicioID}`;
      this.http
        .post(url, data)
        .map(res => res.json())
        .subscribe(resp => {
          // const msj = JSON.parse(res);
          console.log("Este es el mensaje: ", resp);

          // const msj = res.json().mensaje;
          if (resp.mensaje == "success") {
            this.reload_data_cobro();
            localStorage.setItem("metodoPago", "cambio");
            console.log("Se insertó Correctamente: ");
            let loading = this.loadinCtl.create({
              spinner: "bubbles",
              content: "Cargando..."
            });
            loading.present();

            setTimeout(() => {
              loading.dismiss();
            }, 5000);
          } else {
            console.log("Error: ", resp);
          }
        });
    }
  }

  reload_data_cobro() {
    setTimeout(() => {
      const url = `https://proyectosinternos.com/toctoc/toctoc/index.php/cobrar/${this.servicioID}`;
      this.http.get(url).subscribe(res => {
        const cargo = res.json().cargo;
        console.log("Cobrar Respuesta:", cargo);

        this.totalProd = cargo.totalProd;
        this.totalProd1 = cargo.totalProd1;
        this.comisionServicio = cargo.comisionServicio;
        this.totalFinal = cargo.totalFinal;
        this.totComision = cargo.totComision;
        this.corteBme = cargo.corteBme;
        this.corteRep = cargo.corteRep;
        this.totalLugares = cargo.totalLugares;
        this.recargos = cargo.recargos;
        this.porcentaje = cargo.porcentaje;
      });
    }, 5000);
  }

  consultaServicio() {
    this.pedidosProv.getOneServicio(this.servicioID).subscribe(servicio => {
      this.servicio = servicio;
      // const type = this.servicio.tipo;
      // const km = this.servicio.km;
      // this.getPedidos(type, km);

      var estatus = this.servicio.estatus;
      var convenio = this.servicio.abierto;
      if (estatus == "Pagado") {
        // console.log("Este es el resultado del convenio: ",convenio);
        if (convenio != null) {
          let estatus = "Terminado";
          this.pedidosProv.actualizarStatus(this.servicioID, estatus);
        }
        this.mostrarAlert();

        localStorage.removeItem("servIniciado");
        localStorage.removeItem("tipoS");
        localStorage.removeItem("yendo");
        localStorage.removeItem("comprando");
        localStorage.removeItem("comprado");
        localStorage.removeItem("llevandolo");
        localStorage.removeItem("enpuerta");
        localStorage.removeItem("enviando");
        localStorage.removeItem("pago");
        localStorage.removeItem("totComision");
        localStorage.removeItem("totalProd");
        localStorage.removeItem("totalFinal");
        localStorage.removeItem("comisionServicio");
        localStorage.removeItem("corteRep");
        localStorage.removeItem("totalProd1");
        localStorage.removeItem("corteBme");
        localStorage.removeItem("metodo_pago");
        localStorage.removeItem("totalLugares");
        localStorage.removeItem("recargos");
        // if(this.)
      }
      if (this.servicio.termino == "Cliente") {
        if (this.servicio.status == "error_funds") {
          this.alertFunds();
        }
        if (this.servicio.status == "error_honor") {
          this.alertHonor();
        }
        if (this.servicio.status == "error_declined") {
          this.alertDecline();
        }
      }
    });
  }

  mostrarAlert() {
    const confirm = this.alertCtrl.create({
      title: "Servicio Completado",
      message: "El pago se ha realizado correctamente",
      buttons: [
        {
          text: "Aceptar",
          handler: () => {}
        }
      ]
    });
    confirm.present();
  }

  alertFunds() {
    const confirm = this.alertCtrl.create({
      title: "Fondos insuficientes",
      message: "Por favor intente con otra tarjeta o cambie forma de pago",
      buttons: [
        {
          text: "Aceptar",
          handler: () => {}
        }
      ]
    });
    confirm.present();
  }

  alertHonor() {
    const confirm = this.alertCtrl.create({
      title: "Tarjeta rechazada",
      message: "Por favor intente con otra tarjeta o cambie forma de pago",
      buttons: [
        {
          text: "Aceptar",
          handler: () => {}
        }
      ]
    });
    confirm.present();
  }

  alertDecline() {
    const confirm = this.alertCtrl.create({
      title: "Tarjeta declinada",
      message:
        "Ocurrió un problema con su tarjeta de débito o crédito, por favor intente de nuevo o cambie su forma de pago",
      buttons: [
        {
          text: "Aceptar",
          handler: () => {}
        }
      ]
    });
    confirm.present();
  }

  // getPedidos(type, totalKM) {
  //   console.log("Parametros recibidos: ", type, " ", totalKM);

  //   this.pedidosProv
  //     .getPedidos("pedidos", this.servicioID)
  //     .subscribe(pedidos => {
  //       this.pedidos = pedidos;
  //       console.log("Estos son los pedidos: ", this.pedidos);
  //       this.totalProd = this.pedidos.reduce((acc, obj) => acc + obj.total, 0);
  //       console.log("Total Productos: ", this.totalProd);
  //       if (type == 1) {
  //         console.log("Precios pide lo que quieras:");
  //         //////************* Consultar Gastos Fijos del Banderazo por Sucursal *************//////
  //         this.pedidosProv.getCFPLQ(this.idSucursal).then(cf => {
  //           this.costosFijos = cf;
  //           // console.log("Precio de banderazo: ",this.costosFijos);
  //           this.costosFijos.forEach(data => {
  //             // console.log("This is the data: ",data.arranque);
  //             this.arranque = data.arranque;
  //             console.log("Banderazo de arranque: ", this.arranque);
  //           });
  //           // console.log("This is the arranque: ",this.arranque);
  //           console.log("tipo de servicio: ", type);
  //           //////************* Consultar Tarifas por sucursal dependiendo del tipo de Servicio *************//////
  //           this.pedidosProv.getTarifasPLQ(this.idSucursal).then(tarifas => {
  //             this.tarifas = tarifas;

  //             // console.log("This is the tarifa: ",this.tarifas);

  //             this.tarifas.forEach(data1 => {
  //               // console.log("This is the data: ",data1);
  //               this.tarifaKM = data1.distancia;
  //               this.tarifaTime = data1.tiempo;
  //             });
  //             console.log("Tarifa distance: ", this.tarifaKM);
  //             console.log("Tarifa time: ", this.tarifaTime);

  //             this.calcularTotal(
  //               this.totalProd,
  //               this.arranque,
  //               this.tarifaKM,
  //               this.tarifaTime,
  //               totalKM
  //             );
  //           });
  //         });
  //       } else if (type == 2) {
  //         this.pedidosProv.getCFMenu(this.idSucursal).then(cf => {
  //           this.costosFijos = cf;
  //           // console.log("Precio de banderazo: ",this.costosFijos);

  //           this.costosFijos.forEach(data => {
  //             // console.log("This is the data: ",data.arranque);
  //             this.arranque = data.arranque;
  //             console.log("Banderazo de arranque: ", this.arranque);
  //           });
  //           // console.log("This is the arranque: ",this.arranque);
  //           console.log("tipo de servicio: ", type);
  //           //////************* Consultar Tarifas por sucursal dependiendo del tipo de Servicio *************//////
  //           this.pedidosProv.getTarifasMenu(this.idSucursal).then(tarifas => {
  //             this.tarifas = tarifas;

  //             // console.log("This is the tarifa: ",this.tarifas);

  //             this.tarifas.forEach(data1 => {
  //               // console.log("This is the data: ",data1);
  //               this.tarifaKM = data1.distancia;
  //               this.tarifaTime = data1.tiempo;
  //             });
  //             console.log("Tarifa distance: ", this.tarifaKM);
  //             console.log("Tarifa time: ", this.tarifaTime);

  //             this.calcularTotal(
  //               this.totalProd,
  //               this.arranque,
  //               this.tarifaKM,
  //               this.tarifaTime,
  //               totalKM
  //             );
  //           });
  //         });
  //       }
  //     });
  // }

  // calcularTotal(totalProd, arranque, TarifaKM, TarifaTime, TotalKM) {
  //   let banderazo = arranque;
  //   let tarifaKM = TarifaKM;
  //   let tarifaTime = TarifaTime;
  //   let totalKM = TotalKM.toFixed(2);
  //   console.log("KM: ", totalKM);

  //   // console.log("this is the tarifa and banderazo: ",banderazo, " ",Tarifa);

  //   this.pedidosProv.getOneServicio(this.servicioID).subscribe(servicio => {
  //     this.servicio = servicio;
  //     console.log(this.servicio);
  //     this._inicio = this.servicio.fecha_inicio;
  //     this._termino = this.servicio.fecha_termino;
  //     // console.log("Fecha _inicio:", this._inicio);
  //     // console.log("Fecha _termino:", this._termino);

  //     const time = moment.duration(Number(this._inicio)).asMinutes();
  //     const time2 = moment.duration(Number(this._termino)).asMinutes();
  //     const res = time2 - time;
  //     this.minutos = res.toFixed();
  //     console.log("Tiempo del servicio: ", this.minutos);

  //     this.pedidosProv.insertarTiempo(this.servicioID, Number(this.minutos));

  //     let tipoPago = this.servicio.metodo_pago;
  //     // console.log("Tipo Pago: ",tipoPago);

  //     if (tipoPago == "Tarjeta") {
  //       //Comision del Servicio por tiempo transcurrido
  //       this.comisionServicio =
  //         Number(tarifaKM) * Number(totalKM) +
  //         Number(this.minutos) * Number(tarifaTime) +
  //         Number(banderazo);
  //       // Number(banderazo) + Number(this.minutos) * Number(Tarifa);
  //       console.log("Comision por el servicio: ", this.comisionServicio);

  //       this.totalF = totalProd + this.comisionServicio;
  //       let comisi = (this.totalF * 3.6) / 100 + 3;
  //       let iva = (comisi * 16) / 100;
  //       let totComisi = comisi + iva;
  //       this.totComision = Number(totComisi.toFixed(2));
  //       console.log("total Comision por tarjeta: ", this.totComision);

  //       let totFinal = this.totalF + totComisi;
  //       this.totalFinal = Number(totFinal.toFixed(2));
  //       this.totalProd1 = totalProd;

  //       // let corteBme = ((this.comisionServicio*30)/100);
  //       // let corteRep = ((this.comisionServicio*70)/100);

  //       // this.pedidosProv.insertarTotales(this.servicioID, this.totComision, corteBme, corteRep, totalProd,this.comisionServicio ,this.totalFinal);
  //       // console.log("Total de los Productos: ",totalProd);
  //       // console.log("Total Comision: ",this.totComision);
  //       // console.log("Total F: ",this.totalF);
  //       // console.log("Banderazo: ", banderazo);
  //       // console.log("Comision por tiempo trancurrido del servicio: ", Number(this.minutos));
  //     } else {
  //       //Comision del Servicio por tiempo transcurrido
  //       this.comisionServicio =
  //         Number(tarifaKM) * Number(totalKM) +
  //         Number(this.minutos) * Number(tarifaTime) +
  //         Number(banderazo);
  //       console.log("Comision por el servicio: ", this.comisionServicio);
  //       this.totalF = totalProd + this.comisionServicio;
  //       //  let totComisi = (((this.totalF*3.6)/100)+3);
  //       this.totComision = 0.0;
  //       let totFinal = this.totalF + this.totComision;
  //       this.totalFinal = Number(totFinal.toFixed(2));

  //       this.corteBme = (this.comisionServicio * 30) / 100;
  //       this.corteRep = (this.comisionServicio * 70) / 100;
  //       // console.log("Total de los Productos: ",totalProd);
  //       // console.log("Total Comision: ",this.totComision);
  //       // console.log("Total F: ",this.totalF);
  //       // console.log("Banderazo: ", banderazo);
  //       // console.log("Comision por tiempo trancurrido del servicio: ", Number(this.minutos));
  //       this.totalProd1 = totalProd;
  //     }
  //   });
  // }

  finalizar() {
    const url = `https://proyectosinternos.com/toctoc/toctoc/index.php/cobrar/${this.servicioID}`;
    this.http.get(url).subscribe(res => {
      const cargo = res.json().cargo;
      console.log("Cobrar Respuesta:", cargo);

      this.totalProd = cargo.totalProd;
      this.totalProd1 = cargo.totalProd1;
      this.comisionServicio = cargo.comisionServicio;
      this.totalFinal = cargo.totalFinal;
      this.totComision = cargo.totComision;
      this.corteBme = cargo.corteBme;
      this.corteRep = cargo.corteRep;
      this.totalLugares = cargo.totalLugares;
      this.recargos = cargo.recargos;
      this.porcentaje = cargo.porcentaje;
    });
    this.alertConfirmar();
  }

  alertConfirmar() {
    const confirm = this.alertCtrl.create({
      title: "Finalizar Servicio",
      message:
        "No olvide cobrar la cantidad de $" +
        this.totalFinal +
        " al cliente. <br>¿Está seguro que desea finalizar el servicio?",
      buttons: [
        {
          text: "Aceptar",
          handler: () => {
            let status = "Pagado";
            this.pedidosProv
              .insertarTotales(
                this.servicioID,
                this.totComision,
                this.corteBme,
                this.corteRep,
                this.totalProd1,
                this.comisionServicio,
                this.totalFinal,
                status,
                this.porcentaje
              )
              .then((res: any) => {
                if (res.success == true) {
                  localStorage.removeItem("servIniciado");
                  localStorage.removeItem("tipoS");
                  localStorage.removeItem("yendo");
                  localStorage.removeItem("enviando");
                  localStorage.removeItem("enpuerta");
                  localStorage.removeItem("comprando");
                  localStorage.removeItem("comprado");
                  localStorage.removeItem("llevandolo");
                  localStorage.removeItem("pago");
                  localStorage.removeItem("totComision");
                  localStorage.removeItem("totalProd");
                  localStorage.removeItem("totalFinal");
                  localStorage.removeItem("comisionServicio");
                  localStorage.removeItem("corteRep");
                  localStorage.removeItem("totalProd1");
                  localStorage.removeItem("corteBme");
                  localStorage.removeItem("metodo_pago");
                  localStorage.removeItem("totalLugares");
                  localStorage.removeItem("recargos");
                  localStorage.removeItem("porcentaje");
                }
              });

            this.navCtrl.setRoot("HomePage");
          }
        },
        {
          text: "Cancelar",
          handler: () => {
            console.log("clic cancelar");
          }
        }
      ]
    });
    confirm.present();
  }

  mostrarToast(mensaje: string) {
    this.toastCtrl
      .create({
        message: mensaje,
        duration: 4000
      })
      .present();
  }

  // payment(token) {
  //   let headers = new Headers({
  //   "Content-Type": "application/json"
  //   });
  //   let options = new RequestOptions({ headers: headers });

  //   let data = JSON.stringify({
  //   cardToken: token,
  //   amount: 500
  //   });

  //   return new Promise((resolve, reject) => {
  //   this.http
  //   .post("https://bringme-a412b.firebaseapp.com/timestamp", data, options)
  //   .toPromise()
  //   .then(response => {
  //   console.log("API Response : ", response.json());
  //   resolve(response.json());
  //   })
  //   .catch(error => {
  //   console.error("API Error : ", error.status);
  //   console.error("API Error : ", JSON.stringify(error));
  //   reject(error.json());
  //   });
  //   });
  //   }

  finalizarServicio(cardID) {
    let usuario = "Repa";
    this.pedidosProv.actualizaStatusTermino(this.servicioID, usuario);

    let loading = this.loadinCtl.create({
      spinner: "bubbles",
      content: "Procesando pago."
    });

    loading.present();

    let granTotal = this.totalFinal;
    console.log("Este es el total: ", granTotal);

    let amount = (Number(granTotal) * 100).toFixed(0);
    console.log("Este es el monto: ", amount);

    console.log("Esta es la tarjeta: ", cardID);

    this.pedidosProv.getTarjeta(cardID).then(tarjeta => {
      this.card = tarjeta;

      if (cardID == this.card.cardID) {
        //Tarjeta
        var Tarjetabytes = CryptoJS.AES.decrypt(this.card.number, "number");
        var tarjetaData = JSON.parse(Tarjetabytes.toString(CryptoJS.enc.Utf8));
        var cardNumber = JSON.stringify(tarjetaData);

        //Codigo
        var Codigobytes = CryptoJS.AES.decrypt(this.card.cvc, "cvc");
        var codigoData = JSON.parse(Codigobytes.toString(CryptoJS.enc.Utf8));
        var cardCvc = JSON.stringify(codigoData);

        //Mes
        var Mesbytes = CryptoJS.AES.decrypt(this.card.expMonth, "expMonth");
        var mesData = JSON.parse(Mesbytes.toString(CryptoJS.enc.Utf8));
        var cardexpMonth = JSON.stringify(mesData);

        //Año
        var Aniobytes = CryptoJS.AES.decrypt(this.card.expYear, "expYear");
        var AnioData = JSON.parse(Aniobytes.toString(CryptoJS.enc.Utf8));
        var cardexpYear = JSON.stringify(AnioData);

        const cardData = {
          number: cardNumber,
          expMonth: Number(cardexpMonth),
          expYear: Number(cardexpYear),
          cvc: cardCvc
        };

        this.stripe.setPublishableKey("pk_live_7ZTQQUZjCuYfjy6mgy35Achh");
        // this.stripe.setPublishableKey(
        //   "pk_test_TWx1xbw2HExTUYjy2Hz44koG00nFNYC3J4"
        // );
        this.stripe
          .createCardToken(cardData)
          .then(token => {
            let headers = new Headers({
              "Content-Type": "application/json"
            });
            let options = new RequestOptions({ headers: headers });

            let data = JSON.stringify({
              cardToken: token.id,
              amount: amount,
              clave: cardCvc,
              accion: "stripe"
            });

            this.http
              .post(
                "https://proyectosinternos.com/toctoc/stripe_config.php",
                data,
                options
              )
              .subscribe((res: any) => {
                var err = JSON.parse(res._body);
                // alert('Pago R:' + JSON.parse(res._body));

                // console.log("Pago Res: ", err.error.code);
                // console.log("PAGO Completo: ", err);
                // console.log("PAGO Dentro: ", err.error);

                const stripe = JSON.parse(res._body);
                if (stripe.status == "succeeded") {
                  let title = "¡ Pago con exito !";
                  let message = "El pago se procesó correctamente";
                  setTimeout(() => {
                    this.presentConfirmTarjeta(title, message, cardID);
                  }, 2000);

                  setTimeout(() => {
                    loading.dismiss();
                  }, 3000);
                } else {
                  const StripeDeclineCode = err.error.decline_code;

                  if (StripeDeclineCode == "insufficient_funds") {
                    let status = "error_funds";
                    this.pedidosProv.actualizaStatus(this.servicioID, status);

                    let title = "Fondos insuficientes";
                    let message =
                      "La tarjeta no tiene fondos sificientes para realizar la transacción, intente con otra tarjeta o cambie forma de pago a efectivo.";
                    setTimeout(() => {
                      this.presentDeclineCode(title, message, status);
                    }, 2000);

                    setTimeout(() => {
                      loading.dismiss();
                    }, 3000);

                    let usuario = "";
                    this.pedidosProv.actualizaStatusTermino(
                      this.servicioID,
                      usuario
                    );
                  }

                  if (err.error.code == "incorrect_number") {
                    let status = "incorrect_number";
                    this.pedidosProv.actualizaStatus(this.servicioID, status);

                    let title = "Número incorrecto";
                    let message =
                      "El número de la tarjeta es incorrecto, intente con otra tarjeta o cambie forma de pago a efectivo.";
                    setTimeout(() => {
                      this.presentDeclineCode(title, message, status);
                    }, 2000);

                    setTimeout(() => {
                      loading.dismiss();
                    }, 3000);
                    let usuario = "";
                    this.pedidosProv.actualizaStatusTermino(
                      this.servicioID,
                      usuario
                    );
                  }
                  if (StripeDeclineCode == "do_not_honor") {
                    let status = "do_not_honor";
                    this.pedidosProv.actualizaStatus(this.servicioID, status);

                    let title = "Transacción rechazada";
                    let message =
                      "Transacción rechazada por el banco emisor, póngase en contacto con el banco para más información";
                    setTimeout(() => {
                      this.presentDeclineCode(title, message, status);
                    }, 2000);

                    setTimeout(() => {
                      loading.dismiss();
                    }, 3000);
                    let usuario = "";
                    this.pedidosProv.actualizaStatusTermino(
                      this.servicioID,
                      usuario
                    );
                  }

                  if (
                    StripeDeclineCode == "transaction_not_allowed" ||
                    StripeDeclineCode == "generic_decline" ||
                    err.error.code == "card_declined"
                  ) {
                    let status = "card_declined";
                    this.pedidosProv.actualizaStatus(this.servicioID, status);

                    let title = "Tarjeta declinada";
                    let message =
                      "Transacción declinada por el banco emisor, póngase en contacto con el banco para más información";
                    setTimeout(() => {
                      this.presentDeclineCode(title, message, status);
                    }, 2000);

                    setTimeout(() => {
                      loading.dismiss();
                    }, 3000);
                    let usuario = "";
                    this.pedidosProv.actualizaStatusTermino(
                      this.servicioID,
                      usuario
                    );
                  }
                }
              });
          })
          .catch(error => {
            // alert(error);
            // let loading = this.loadinCtl.create({
            //   spinner: "bubbles",
            //   content: "Procesando pago."
            // });
            // loading.present();

            let status = "error_declined";
            this.pedidosProv.actualizaStatus(this.servicioID, status);

            let title = "Tarjeta declinada";
            let message =
              "Ocurrió un problema con su tarjeta de débito o crédito, por favor indique al cliente que intente de nuevo o cambie su forma de pago.";
            setTimeout(() => {
              this.presentDeclineCode(title, message, status);
            }, 2000);

            setTimeout(() => {
              loading.dismiss();
            }, 3000);

            let usuario = "";
            this.pedidosProv.actualizaStatusTermino(this.servicioID, usuario);
          });
      }
    });
  }

  presentConfirmTarjeta(title, message, cardID) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: "Aceptar",
          handler: () => {
            this.corteBme = (this.comisionServicio * 30) / 100;
            this.corteRep = (this.comisionServicio * 70) / 100;
            let status = "Pagado";

            this.pedidosProv.insertarTotales(
              this.servicioID,
              this.totComision,
              this.corteBme,
              this.corteRep,
              this.totalProd,
              this.comisionServicio,
              this.totalFinal,
              status,
              this.porcentaje
            );

            this.pedidosProv.updateChekedFalse(cardID);
            localStorage.removeItem("servIniciado");
            localStorage.removeItem("tipoS");
            localStorage.removeItem("yendo");
            localStorage.removeItem("enviando");
            localStorage.removeItem("enpuerta");
            localStorage.removeItem("comprando");
            localStorage.removeItem("comprado");
            localStorage.removeItem("llevandolo");
            localStorage.removeItem("pago");
            localStorage.removeItem("totComision");
            localStorage.removeItem("totalProd");
            localStorage.removeItem("totalFinal");
            localStorage.removeItem("comisionServicio");
            localStorage.removeItem("corteRep");
            localStorage.removeItem("totalProd1");
            localStorage.removeItem("corteBme");
            localStorage.removeItem("metodo_pago");
            localStorage.removeItem("totalLugares");
            localStorage.removeItem("recargos");
            localStorage.removeItem("porcentaje");
          }
        }
      ]
    });
    alert.present();
    this.navCtrl.setRoot("HomePage");
  }

  presentDeclineCode(title, message, status) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        },
        {
          text: "Aceptar",
          handler: () => {
            console.log("Clic en Aceptar");
          }
        }
      ]
    });
    alert.present();
    if (status == "error_funds") {
      if (this.platform.is("cordova")) {
        let noti = {
          app_id: "0ccc71f1-c7da-49b7-a6a3-9464897ed283",
          include_player_ids: [this.servicio.playerIDUser],
          data: { estatus: "Mostrar" },
          contents: {
            en: message
          },
          headings: { en: title }
        };

        window["plugins"].OneSignal.postNotification(
          noti,
          function(successResponse) {
            console.log("Notification Post Success:", successResponse);
          },
          function(failedResponse: any) {
            console.log("Notification Post Failed: ", failedResponse);
          }
        );
      } else {
        console.log("Solo funciona en dispositivos");
      }
    } else if (status == "error_honor") {
      if (this.platform.is("cordova")) {
        let noti = {
          app_id: "0ccc71f1-c7da-49b7-a6a3-9464897ed283",
          include_player_ids: [this.servicio.playerIDUser],
          data: { estatus: "Mostrar" },
          contents: {
            en: message
          },
          headings: { en: title }
        };

        window["plugins"].OneSignal.postNotification(
          noti,
          function(successResponse) {
            console.log("Notification Post Success:", successResponse);
          },
          function(failedResponse: any) {
            console.log("Notification Post Failed: ", failedResponse);
          }
        );
      } else {
        console.log("Solo funciona en dispositivos");
      }
    } else if (status == "error_declined") {
      if (this.platform.is("cordova")) {
        let noti = {
          app_id: "0ccc71f1-c7da-49b7-a6a3-9464897ed283",
          include_player_ids: [this.servicio.playerIDUser],
          data: { estatus: "Mostrar" },
          contents: {
            en: message
          },
          headings: { en: title }
        };

        window["plugins"].OneSignal.postNotification(
          noti,
          function(successResponse) {
            console.log("Notification Post Success:", successResponse);
          },
          function(failedResponse: any) {
            console.log("Notification Post Failed: ", failedResponse);
          }
        );
      } else {
        console.log("Solo funciona en dispositivos");
      }
    }
  }

  cambiarMetodo(metodo) {
    let alert = this.alertCtrl.create();
    alert.setTitle("Cambiar Método de Pago");
    if (metodo == "Efectivo") {
      alert.addInput({
        type: "radio",
        label: "Efectivo",
        value: "Efectivo",      
        checked: true
      });
  
      alert.addInput({
        type: "radio",
        label: "Tarjeta",
        value: "Tarjeta"
      });
    }else{
      alert.addInput({
        type: "radio",
        label: "Efectivo",
        value: "Efectivo"
      });
  
      alert.addInput({
        type: "radio",
        label: "Tarjeta",
        value: "Tarjeta",
        checked: true
      });
    }    

    alert.addButton("Cancelar");
    alert.addButton({
      text: "Aceptar",
      handler: data => {
        this.testRadioOpen = false;
        this.metodoPago = data;
        // console.log("Este es el resultado: ",this.cancelarMotivo);
        this.pedidosProv.actualizarMetodoPago(
          this.servicioID,
          this.metodoPago
        );
      }
    });
    alert.present();
  }

  call(number) {
    // alert("Telefono: " + number);
    this.callNumber
      .callNumber(number, true)
      .then((res) => console.log("Launched dialer!", res))
      .catch((err) => console.log("Error launching dialer", err));

    console.log("Si llega: ", number);
  }

  enviarMensage(nombre, apellido, playerIDUser) {
    let usuario = nombre + " " + apellido;
    // console.log("Este es el usuario: ", usuario);
    this.navCtrl.push("Chat", {
      usuario: usuario,
      playerIDUser: playerIDUser,
    });
  }

}

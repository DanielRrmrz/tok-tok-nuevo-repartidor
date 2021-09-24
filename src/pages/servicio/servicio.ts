import { Component, ViewChild, ElementRef } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ModalController,
  LoadingController,
} from "ionic-angular";
import { PedidosProvider } from "../../providers/pedidos/pedidos";
import { Observable } from "rxjs/Observable";
import { TicketPage } from "../ticket/ticket";
import { UbicacionProvider } from "../../providers/ubicacion/ubicacion";
import * as moment from "moment";
import { CallNumber } from "@ionic-native/call-number";
import { Platform, ToastController } from "ionic-angular";
import { NativeStorage } from "@ionic-native/native-storage";
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse,
  BackgroundGeolocationEvents,
} from "@ionic-native/background-geolocation";
// import { AngularFireAuth } from 'angularfire2/auth';
import { Http, URLSearchParams } from "@angular/http";
import { Network } from "@ionic-native/network";

declare var google: any;

@IonicPage()
@Component({
  selector: "page-servicio",
  templateUrl: "servicio.html",
})
export class ServicioPage {
  @ViewChild("map") mapElement: ElementRef;
  servicioID: any;
  tipo: any;
  servicio: any = {};
  usuario: any = {};
  lat: any;
  lng: any;
  clientes: Observable<any[]>;
  pedidos: any[];
  prodConv: any[];
  productos: Observable<any[]>;
  comprandoStatus: boolean;
  compradoStatus: boolean;
  enviandoStatus: boolean;
  yendoStatus: boolean;
  enpuertaStatus: boolean;
  pagadoStatus: boolean;
  testRadioOpen: boolean;
  cancelarMotivo: any;
  username: any;
  gps_update_link: string = "your_http_request_link";
  logs: string[] = [];
  uid: any;

  puntos: any;
  products: any;
  origen: any;
  destino: any;
  totalKm: any = 0;

  idSucursal: any;
  _inicio: any;
  _termino: any;
  minutos: any;
  costosFijos: any;
  arranque: any;
  tarifas: any;
  tarifaKM: any = 0;
  tarifaTime: any;
  comisionServicio: any;
  totalProd: any;
  totalF: any;
  totComision: any;
  totalFinal: any;
  corteBme: any;
  totalProd1: any;
  corteRep: any;
  totalLugares: any;
  recargos: any;
  getPorcentaje: any;
  montoRecargos: any;
  porceCortes: any;
  porcentaje: any;
  comisionPorcentaje: any;
  service: any;
  idRestaurante: any;
  regular: any;

  public destination: any;
  public origin: any;
  public driving: any = "DRIVING";
  public map: any;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public pedidosProv: PedidosProvider,
    public alertCtrl: AlertController,
    private modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public platform: Platform,
    public ubicacionProv: UbicacionProvider,
    private callNumber: CallNumber,
    // private afAuth: AngularFireAuth,
    private network: Network,
    private nativeStorage: NativeStorage,
    public backgroundGeolocation: BackgroundGeolocation,
    public http: Http
  ) {
    this.uid = localStorage.getItem("idRepartidor");
    this.idSucursal = localStorage.getItem("idSucursal");
    let tipoServ = navParams.get("tipo");
    console.log("Este es el tipo de servicio: ", tipoServ);
    if (tipoServ != null) {
      localStorage.setItem("tipoS", tipoServ);
    }

    let ServicioTipo = localStorage.getItem("tipoS");
    if (ServicioTipo != null) {
      this.tipo = ServicioTipo;
    }

    this.verificarConexion();
  }

  ionViewDidLoad() {
    //Iniciar Geolocalizacion
    this.ubicacionProv.inicializarRepartidor();
    // this.ubicacionProv.iniciarGeolocalizacion();
    this.startBackgroundGeolocation();
    this.servicioID = this.navParams.get("servicioID");
    console.log("Este es el servicio: ", this.servicioID);
    if (this.servicioID != null) {
      this.consultaServicio();
      this.partidaGeo(this.servicioID);
    }
    // let reingreso = this.navParams.get("reingreso");
    // if (reingreso == null) {
    //   this.iniciarServicio();
    // }
    // this.loadClientes();
    this.getPedidos();
    this.getRepartidor();
  }

  verificarConexion() {
    this.network.onDisconnect().subscribe(() => {
      console.log("network was disconnected :-(");
      let loading = this.loadingCtrl.create({
        spinner: "bubbles",
        content: "Se perdio la conexión...",
      });

      loading.present();

      this.network.onConnect().subscribe(() => {
        console.log("network connected!");
        loading.dismiss();
      });
    });
  }

  partidaGeo(servicioID) {
    this.ubicacionProv.partidaGeo(servicioID);
  }

  consultaServicio() {
    this.pedidosProv.getOneServicio(this.servicioID).subscribe((servicio) => {
      this.servicio = servicio;

      if (this.servicio.tipo == 1) {
        this.idRestaurante = "";
        if (
          this.servicio.uidRepartidor != this.uid &&
          this.servicio.estatus == "Aceptado" &&
          this.servicio.vez == undefined
        ) {
          this.pedidosProv.actualizaVez(this.servicioID);
          this.navCtrl.setRoot("HomePage");
          localStorage.removeItem("servIniciado");
          localStorage.removeItem("tipoS");
          this.errorAceptado();
        }
        this.validarServicio1(this.servicio.estatus);
        this.getProductos();
      }
      if (this.servicio.tipo == 2) {
        this.idRestaurante = this.servicio.uidRestaurante;

        if (
          this.servicio.uidRepartidor != this.uid &&
          this.servicio.estatus == "AceptaBme" &&
          this.servicio.vez == undefined
        ) {
          this.pedidosProv.actualizaVez(this.servicioID);
          this.navCtrl.setRoot("HomePage");
          localStorage.removeItem("servIniciado");
          localStorage.removeItem("tipoS");
          this.errorAceptado();
        }
        this.validarServicio2(this.servicio.estatus);
        this.getProducts();
      }
      console.log("Este es el servicio: ", this.servicio);
      this.lat = this.servicio.entregaGeo._lat;
      this.lng = this.servicio.entregaGeo._long;
      this.consultaUsuario(this.servicio.uidCliente);
    });
  }

  validarServicio1(estatus) {
    if (estatus == "Aceptado") {
      this.yendoStatus = false;
      this.comprandoStatus = false;
      this.compradoStatus = false;
      this.enpuertaStatus = false;
    } else if (estatus == "Yendo") {
      this.yendoStatus = true;
      this.comprandoStatus = false;
      this.compradoStatus = false;
      this.enpuertaStatus = false;
    } else if (estatus == "Comprando") {
      this.yendoStatus = true;
      this.comprandoStatus = true;
      this.compradoStatus = false;
      this.enpuertaStatus = false;
    } else if (estatus == "Comprado") {
      this.yendoStatus = true;
      this.comprandoStatus = true;
      this.compradoStatus = true;
      this.enpuertaStatus = false;
    } else if (estatus == "EnPuerta") {
      this.yendoStatus = true;
      this.comprandoStatus = true;
      this.compradoStatus = true;
      this.enpuertaStatus = true;
    }

    console.log("Este es el estatus recivido : ", estatus);
  }

  validarServicio2(estatus) {
    if (estatus == "AceptaBme") {
      this.yendoStatus = false;
      this.enviandoStatus = false;
      this.enpuertaStatus = false;
    } else if (estatus == "Yendo") {
      this.yendoStatus = true;
      this.enviandoStatus = false;
      this.enpuertaStatus = false;
    } else if (estatus == "Enviando") {
      this.yendoStatus = true;
      this.enviandoStatus = true;
      this.enpuertaStatus = false;
    } else if (estatus == "EnPuerta") {
      this.yendoStatus = true;
      this.enviandoStatus = true;
      this.enpuertaStatus = true;
    }

    console.log("Este es el estatus recivido : ", estatus);
  }

  // verificarStatus() {
  //   let yendo = localStorage.getItem("yendo");
  //   if (yendo != null) {
  //     this.yendoStatus = true;
  //   } else {
  //     this.yendoStatus = false;
  //   }

  //   let comprando = localStorage.getItem("comprando");
  //   if (comprando != null) {
  //     this.comprandoStatus = true;
  //   } else {
  //     this.comprandoStatus = false;
  //   }

  //   let comprado = localStorage.getItem("comprado");
  //   if (comprado != null) {
  //     this.compradoStatus = true;
  //   } else {
  //     this.compradoStatus = false;
  //   }

  //   let enviandolo = localStorage.getItem("enviando");
  //   if (enviandolo != null) {
  //     this.enviandoStatus = true;
  //   } else {
  //     this.enviandoStatus = false;
  //   }

  //   let enpuerta = localStorage.getItem("enpuerta");
  //   if (enpuerta != null) {
  //     this.enpuertaStatus = true;
  //   } else {
  //     this.enpuertaStatus = false;
  //   }
  // }

  Validar() {
    console.log("Usuario logueado: ", this.uid);
    this.pedidosProv.getServicio(this.servicioID).then((servicio) => {
      this.servicio = servicio;
      if (this.servicio.uidRepartidor != this.uid) {
        this.navCtrl.setRoot("HomePage");
        localStorage.removeItem("servIniciado");
        localStorage.removeItem("tipoS");
        this.errorAceptado();
      }
    });
  }

  errorAceptado() {
    const confirm = this.alertCtrl.create({
      title: "Alerta",
      message: "El servicio ya fue tomado por otro Bringme.",
      buttons: [
        {
          text: "Aceptar",
          handler: () => {},
        },
      ],
    });
    confirm.present();
  }

  consultaUsuario(idUsuario) {
    this.pedidosProv.getOneUsuario(idUsuario).subscribe((usuario) => {
      this.usuario = usuario;
      console.log("Este es el usuario Cliente: ", this.usuario);
    });
  }

  getRepartidor() {
    console.log("Si esta llegando a consultar el repartidor");
    
    this.pedidosProv.getServicio(this.servicioID).then((servicio) => {
      this.service = servicio;
      console.log("Este es el servicio consultado: ", this.service);
      
      const uidRepartidor = this.service.uidRepartidor;
      this.pedidosProv.getOneRepartidor(uidRepartidor).subscribe((repa) => {
        const repaInfo = repa;
        this.username = repaInfo.username;
        console.log("Este es el username: ", this.username);
      });
    });
  }

  // loadClientes() {
  //   this.pedidosProv.getAllClientes("users").then(c => {
  //     this.clientes = c;
  //     console.log("Estos son los clientes: ", this.clientes);
  //   });
  // }

  // iniciarServicio() {
  //   const confirm = this.alertCtrl.create({
  //     title: "Alerta",
  //     message: "Recuerda una vez iniciado el servicio no se podrá cancelar.",
  //     buttons: [
  //       {
  //         text: "Aceptar",
  //         handler: () => {}
  //       }
  //     ]
  //   });
  //   confirm.present();
  // }

  getPedidos() {
    this.pedidosProv.getPedidos(this.servicioID).subscribe((pedidos) => {
      this.pedidos = pedidos;
      console.log("Estos son los pedidos jaja: ", pedidos);
    });
  }

  getProductos() {
    this.pedidosProv.getAllProducts(this.servicioID).then((p) => {
      this.productos = p;
      console.log("Estos son los productos: ", this.productos);
    });
  }

  getProducts() {
    this.pedidosProv.getAllProducts1(this.servicioID).subscribe((prod) => {
      this.products = prod;
    });
  }

  mostrarModal(pedidoID, numTickets, ves) {
    let modal = this.modalCtrl.create(TicketPage, {
      pedidoID: pedidoID,
      servicioID: this.servicioID,
      numTickets: numTickets,
      ves: ves,
    });
    modal.present();
  }
  comprando() {
    let myDate: any = new Date().toISOString();
    let fecha = moment(myDate).format("x");
    // localStorage.setItem("comprando", "true");
    let status = "Comprando";
    this.pedidosProv.actualizarStatusFechaInicio(
      this.servicioID,
      status,
      fecha
    );
  }
  comprado() {
    let status = "Comprado";
    // localStorage.setItem("comprado", "true");
    this.pedidosProv.actualizarStatus(this.servicioID, status);
  }
  enPuerta() {
    let status = "EnPuerta";
    // localStorage.setItem("enpuerta", "true");
    this.pedidosProv.actualizarStatus(this.servicioID, status);
    this.ubicacionProv.detenerUbicacion();
    this.ubicacionProv.detenerUbicacion1();
  }
  yendo() {
    let myDate: any = new Date().toISOString();
    let fecha = moment(myDate).format("x");
    let status = "Yendo";
    // localStorage.setItem("yendo", "true");

    this.pedidosProv.actualizarStatusFechaInicio(
      this.servicioID,
      status,
      fecha
    );
  }
  enviando() {
    let status = "Enviando";
    // localStorage.setItem("enviando", "true");
    this.pedidosProv.actualizarStatus(this.servicioID, status);
  }

  abrirMapa(lat, lng) {
    const modal = this.modalCtrl.create("DeliveryTrackingPage", {
      lat: lat,
      lng: lng,
    });
    modal.present();
  }

  realizarCobro(metodo_pago) {
    this.mostrarLoading();
    this.puntosOrigenDestino();

    localStorage.setItem("metodo_pago", metodo_pago);
    let myDate: any = new Date().toISOString();
    let fecha = moment(myDate).format("x");
    this.pedidosProv.actualizarFechaTermino(
      this.servicioID,
      fecha
    );

  }

  realizarCobroRes(metodo_pago) {
    this.mostrarLoading();
    this.puntosOrigenDestino();

    localStorage.setItem("pago", "true");
    localStorage.setItem("metodo_pago", metodo_pago);
    let myDate: any = new Date().toISOString();
    let fecha = moment(myDate).format("x");
    this.pedidosProv.actualizarFechaTermino(
      this.servicioID,
      fecha
    );
  }

  irPage() {
    const modal = this.modalCtrl.create("CobrarPage", {
      servicioID: this.servicioID,
    });
    modal.present();
  }

  puntosOrigenDestino() {
    this.mostrarLoading();
    const idServicio = this.servicioID;
    this.pedidosProv.getAllServiciosP(idServicio).subscribe((serviciosP) => {
      // console.log("ServiciosP", serviciosP);
      this.puntos = serviciosP;

      this.puntos.forEach((element) => {
        if (element.servicio == "Iniciado") {
          this.origen = new google.maps.LatLng(
            element.partidaGeo._lat,
            element.partidaGeo._long
          );
        }
        if (element.servicio == "Terminado") {
          this.destino = new google.maps.LatLng(
            element.partidaGeo._lat,
            element.partidaGeo._long
          );
        }
      });
      // console.log("PuntosOD: ", this.origen, this.destino);
      this.loadKm(this.origen, this.destino);
    });
  }

  // tslint:disable-next-line:use-life-cycle-interface
  loadKm(origen, destino) {
    this.mostrarLoading();
    // console.log('Params: ', origen, destino);
    // alert("Datos del origen y destino para calcular KM")
    setTimeout(() => {
      const idServicio = this.servicioID;
      this.pedidosProv.getServicio(idServicio).then((servicio) => {
        this.pedidosProv
          .getAllServiciosP(idServicio)
          .subscribe((serviciosP) => {
            this.servicio = servicio;
            // console.log("servicio Cordenadas", this.servicio);

            // Coordendas donde se va entregar el pedido.
            // const _lat = this.servicio.entregaGeo._lat;
            // const _lng = this.servicio.entregaGeo._long;
            // console.log(this.destination);
            // Coordendas donde se inicia el servicio
            // const lat = this.servicio.partidaGeo._lat;
            // const lng = this.servicio.partidaGeo._long;
            // console.log(this.origin);
            const mapProperties = {
              center: new google.maps.LatLng(35.2271, -80.8431),
              zoom: 15,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
            };
            let mapEle = this.mapElement.nativeElement;
            this.map = new google.maps.Map(mapEle, mapProperties);
            const directionsService = new google.maps.DirectionsService();
            const directionsDisplay = new google.maps.DirectionsRenderer({
              draggable: true,
              map: this.map,
            });

            directionsDisplay.addListener("directions_changed", () => {
              let total = 0;
              const myroute = directionsDisplay.getDirections().routes[0];
              for (let i = 0; i < myroute.legs.length; i++) {
                total += myroute.legs[i].distance.value;
              }
              total = total / 1000;
              this.pedidosProv.updateKm(this.servicioID, total);
              this.getPedidos_(this.tipo, total);
            });

            const waypts = [];
            const checkboxArray = serviciosP;
            for (let i = 0; i < checkboxArray.length; i++) {
              waypts.push({
                location: new google.maps.LatLng(
                  checkboxArray[i].partidaGeo._lat,
                  checkboxArray[i].partidaGeo._long
                ),
              });
            }
            // console.log("Pruva", waypts);

            directionsService.route(
              {
                origin: origen,
                destination: destino,
                // waypoints: waypts,
                travelMode: this.driving,
                avoidTolls: true,
              },
              function (response, status) {
                if (status === "OK") {
                  directionsDisplay.setDirections(response);
                } else {
                  // alert("Could not display directions due to: " + status);
                }
              }
            );
          });
      });
    }, 1000);
  }

  cancelarServicio(playerID, username) {
    let alert = this.alertCtrl.create();
    alert.setTitle("Cancelar Servicio");

    alert.addInput({
      type: "radio",
      label: "Fuera de área",
      value: "Fuera de área",
    });

    alert.addInput({
      type: "radio",
      label: "Falla mecánica",
      value: "Falla mecánica",
    });

    alert.addInput({
      type: "radio",
      label: "Establecimiento cerrado",
      value: "Establecimiento cerrado",
    });

    alert.addInput({
      type: "radio",
      label: "No hay respuesta del cliente",
      value: "No hay respuesta del cliente",
    });

    alert.addInput({
      type: "radio",
      label: "Accidente",
      value: "Accidente",
    });

    alert.addButton("Cancelar");
    alert.addButton({
      text: "Aceptar",
      handler: (data) => {
        this.testRadioOpen = false;
        this.cancelarMotivo = data;
        // console.log("Este es el resultado: ",this.cancelarMotivo);

        let status = "Cancelado";
        this.pedidosProv.cancelarServicio(
          this.servicioID,
          status,
          this.cancelarMotivo
        );
        this.mensajeCancelado(playerID, username, this.cancelarMotivo);
        localStorage.removeItem("servIniciado");
        localStorage.removeItem("tipoS");
        localStorage.removeItem("yendo");
        localStorage.removeItem("comprando");
        localStorage.removeItem("comprado");
        localStorage.removeItem("llevandolo");
        localStorage.removeItem("enpuerta");
        localStorage.removeItem("enviando");

        this.navCtrl.setRoot("HomePage");
      },
    });
    alert.present();
  }

  mensajeYendo(playerIDUser, username) {
    if (this.platform.is("cordova")) {
      let noti = {
        app_id: "0ccc71f1-c7da-49b7-a6a3-9464897ed283",
        include_player_ids: [playerIDUser],
        data: { estatus: "Mostrar" },
        contents: {
          en: username + " se dirige por tu pedido.",
        },
      };

      window["plugins"].OneSignal.postNotification(
        noti,
        function (successResponse) {
          console.log("Notification Post Success:", successResponse);
        },
        function (failedResponse: any) {
          console.log("Notification Post Failed: ", failedResponse);
        }
      );
    } else {
      console.log("Solo funciona en dispositivos");
    }
  }

  mensajeComprando(playerIDUser, username) {
    if (this.platform.is("cordova")) {
      let noti = {
        app_id: "0ccc71f1-c7da-49b7-a6a3-9464897ed283",
        include_player_ids: [playerIDUser],
        data: { estatus: "Mostrar" },
        contents: {
          en: username + " esta comprando tu pedido.",
        },
      };

      window["plugins"].OneSignal.postNotification(
        noti,
        function (successResponse) {
          console.log("Notification Post Success:", successResponse);
        },
        function (failedResponse: any) {
          console.log("Notification Post Failed: ", failedResponse);
        }
      );
    } else {
      console.log("Solo funciona en dispositivos");
    }
  }

  mensajeComprado(playerIDUser, username) {
    if (this.platform.is("cordova")) {
      let noti = {
        app_id: "0ccc71f1-c7da-49b7-a6a3-9464897ed283",
        include_player_ids: [playerIDUser],
        data: { estatus: "Mostrar" },
        contents: {
          en: username + " esta en camino con tu pedido.",
        },
      };

      window["plugins"].OneSignal.postNotification(
        noti,
        function (successResponse) {
          console.log("Notification Post Success:", successResponse);
        },
        function (failedResponse: any) {
          console.log("Notification Post Failed: ", failedResponse);
        }
      );
    } else {
      console.log("Solo funciona en dispositivos");
    }
  }

  mensajeEnPuerta(playerIDUser, username) {
    if (this.platform.is("cordova")) {
      let noti = {
        app_id: "0ccc71f1-c7da-49b7-a6a3-9464897ed283",
        include_player_ids: [playerIDUser],
        data: { estatus: "Mostrar" },
        contents: {
          en: username + "  a llegado a tu domicilio.",
        },
      };

      window["plugins"].OneSignal.postNotification(
        noti,
        function (successResponse) {
          console.log("Notification Post Success:", successResponse);
        },
        function (failedResponse: any) {
          console.log("Notification Post Failed: ", failedResponse);
        }
      );
    } else {
      console.log("Solo funciona en dispositivos");
    }
  }

  mensajeCancelado(playerIDUser, username, motivo) {
    console.log(
      "Id Player: ",
      playerIDUser,
      "UserName: ",
      username,
      "Motivo: ",
      motivo
    );

    if (this.platform.is("cordova")) {
      let noti = {
        app_id: "0ccc71f1-c7da-49b7-a6a3-9464897ed283",
        include_player_ids: [playerIDUser],
        data: { estatus: "Mostrar" },
        contents: {
          en: username + " cancelo tu servicio. / " + motivo,
        },
        headings: { en: "Servicio cancelado" },
      };

      window["plugins"].OneSignal.postNotification(
        noti,
        function (successResponse) {
          console.log("Notification Post Success:", successResponse);
        },
        function (failedResponse: any) {
          console.log("Notification Post Failed: ", failedResponse);
        }
      );
    } else {
      console.log("Solo funciona en dispositivos");
    }
  }

  enviarMensage(nombre, apellido, playerIDUser) {
    let usuario = nombre + " " + apellido;
    // console.log("Este es el usuario: ", usuario);
    this.navCtrl.push("Chat", {
      usuario: usuario,
      playerIDUser: playerIDUser,
    });
  }

  call(number) {
    // alert("Telefono: " + number);
    this.callNumber
      .callNumber(number, true)
      .then((res) => console.log("Launched dialer!", res))
      .catch((err) => console.log("Error launching dialer", err));

    console.log("Si llega: ", number);
  }

  startBackgroundGeolocation() {
    this.backgroundGeolocation.isLocationEnabled().then((rta) => {
      if (rta) {
        this.start();
        // alert("Encendido");
      } else {
        this.backgroundGeolocation.showLocationSettings();
      }
    });
  }

  start() {
    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 200,
      debug: false,
      stopOnTerminate: false,
      startOnBoot: true,
      // Android only section
      locationProvider: 1, // https://github.com/mauron85/cordova-plugin-background-geolocation/blob/master/PROVIDERS.md
      startForeground: true,
      interval: 18000,
      fastestInterval: 18000,
      activitiesInterval: 10000,
      notificationTitle: "Background tracking",
      notificationText: "enabled",
      notificationIconColor: "#FEDD1E",
      notificationIconLarge: "mappointer_large",
      notificationIconSmall: "mappointer_small",
    };

    console.log("start");

    this.backgroundGeolocation.configure(config).then(() => {
      this.backgroundGeolocation
        .on(BackgroundGeolocationEvents.location)
        .subscribe((location: BackgroundGeolocationResponse) => {
          // alert(location);
          // this.logs.push(`${location.latitude},${location.longitude}`);
          // alert(this.logs.push(`${location.latitude},${location.longitude}`));
          this.ubicacionProv.insertarPoints(location);
        });
    });

    // start recording location
    this.backgroundGeolocation.start();
  }

  stopBackgroundGeolocation() {
    this.backgroundGeolocation.stop();
  }

  servicioIniciado() {
    let loading = this.loadingCtrl.create({
      spinner: "bubbles",
      content: "Cargando...",
    });

    loading.present();
    this.ubicacionProv.servicioIniciado().then((res: any) => {
      if (res.success == true) {
        setTimeout(() => {
          loading.dismiss();
        }, 5000);
      }
    });
  }

  servicioTerminado() {
    this.ubicacionProv.servicioTerminado().then((res: any) => {
      let loading = this.loadingCtrl.create({
        spinner: "bubbles",
        content: "Cargando...",
      });
      if (res.success == true) {
        setTimeout(() => {
          loading.dismiss();
        }, 5000);
      }
    });
  }

  getPedidos_(type, totalKM) {
    // alert("Total de KM: "+ totalKM);

    let loading = this.loadingCtrl.create({
      spinner: "bubbles",
      content: "Calculando Total...",
    });
    loading.present();

    setTimeout(() => {
      console.log("Parametros recibidos: ", type, " ", totalKM);

      if (type == 1) {
        this.pedidosProv.getPedidos(this.servicioID).subscribe((pedidos) => {
          this.pedidos = pedidos;
          console.log("Estos son los pedidos: ", this.pedidos);
          let numLugares = this.pedidos.length;
          this.totalLugares = numLugares - 1;
          localStorage.setItem("totalLugares", this.totalLugares);
          alert("Num Lugares: "+ this.totalLugares);

          this.pedidosProv.getRecargos(this.idSucursal).then((porc) => {
            this.montoRecargos = porc;
            console.log("Este es el resultado del porcentaje: ", porc);
            this.montoRecargos.forEach((element) => {
              var recargo = element.monto;
              this.recargos = this.totalLugares * recargo;
            });

            localStorage.setItem("recargos", this.recargos);
            // alert("Recargos: "+ this.recargos);

            this.totalProd = this.pedidos.reduce((acc, obj) => acc + obj.total, 0);
            localStorage.setItem("totalProd", this.totalProd);
            // alert("ESte es el total de los Productos: " + this.totalProd);
            // console.log("Total Productos: ", this.totalProd);

            console.log("Precios pide lo que quieras:");
            //////************* Consultar Gastos Fijos del Banderazo por Sucursal *************//////
            this.pedidosProv.getCFPLQ(this.idSucursal).then((cf) => {
              this.costosFijos = cf;
              // console.log("Precio de banderazo: ",this.costosFijos);

              this.costosFijos.forEach((data) => {
                // console.log("This is the data: ",data.arranque);
                this.arranque = data.arranque;
                console.log("Banderazo de arranque: ", this.arranque);
                // alert("Banderazo de arranque: "+ this.arranque);
              });
              // console.log("This is the arranque: ",this.arranque);
              console.log("tipo de servicio: ", type);
              //////************* Consultar Tarifas por sucursal dependiendo del tipo de Servicio *************//////
              this.pedidosProv
                .getTarifasPLQ(this.idSucursal)
                .then((tarifas) => {
                  this.tarifas = tarifas;

                  // console.log("This is the tarifa: ",this.tarifas);

                  this.tarifas.forEach((data1) => {
                    // console.log("This is the data: ",data1);
                    this.tarifaKM = data1.distancia;
                    this.tarifaTime = data1.tiempo;
                  });
                  console.log("Tarifa distance: ", this.tarifaKM);
                  console.log("Tarifa time: ", this.tarifaTime);

                  // alert("Tarifa distance: "+ this.tarifaKM);
                  // alert("Tarifa time: "+ this.tarifaTime);

                  this.calcularTotal(
                    this.totalProd,
                    this.arranque,
                    this.tarifaKM,
                    this.tarifaTime,
                    totalKM,
                    this.recargos,
                    0
                  );
                  // alert("Envia los Datos a calcular Total");
                });
            });
          });
        });
      } else if (type == 2) {
        this.pedidosProv.getProd(this.servicioID).subscribe((pedidos) => {
          this.prodConv = pedidos;
          console.log("Estos son los productos para sacar el total: ", this.prodConv);
          
          this.totalProd = this.prodConv.reduce((acc, obj) => acc + obj.total, 0);
          // console.log("Este es el total de los productos: ", this.totalProd);
          this.recargos = 0;
          this.totalLugares = 0;
          
        
        this.pedidosProv.getCFMenu(this.idSucursal).then((cf) => {
          this.costosFijos = cf;
          // console.log("Precio de banderazo: ",this.costosFijos);

          this.pedidosProv.getPorMenu(this.idSucursal).then((porc) => {
            this.getPorcentaje = porc;
            // console.log("Este es el porcentaje: ", this.);

            this.getPorcentaje.forEach((element) => {
              var porcent = element.comision;
              this.porcentaje = Number(porcent);
              console.log("Porcentaje cobrado: ", this.porcentaje);
              // alert("Porcentaje cobrado: "+this.porcentaje);
            });

            this.costosFijos.forEach((data) => {
              // console.log("This is the data: ",data.arranque);
              this.arranque = data.arranque;
              console.log("Banderazo de arranque: ", this.arranque);
              // alert("Banderazo de arranque: " + this.arranque);
            });
            // console.log("This is the arranque: ",this.arranque);
            console.log("tipo de servicio: ", type);
            //////************* Consultar Tarifas por sucursal dependiendo del tipo de Servicio *************//////
            this.pedidosProv.getTarifasMenu(this.idSucursal).then((tarifas) => {
              this.tarifas = tarifas;

              // console.log("This is the tarifa: ",this.tarifas);

              this.tarifas.forEach((data1) => {
                // console.log("This is the data: ",data1);
                this.tarifaKM = data1.distancia;
                this.tarifaTime = data1.tiempo;
              });
              console.log("Tarifa distance: ", this.tarifaKM);
              console.log("Tarifa time: ", this.tarifaTime);

              // alert("Tarifa distance: "+ this.tarifaKM);
              // alert("Tarifa time: "+ this.tarifaTime);

              this.calcularTotal(
                this.totalProd,
                this.arranque,
                this.tarifaKM,
                this.tarifaTime,
                totalKM,
                this.recargos,
                this.porcentaje
              );
              // alert("Envia los Datos a calcular Total");
            });
          });
        });
      });
      }
      loading.dismiss();
    }, 9000);
  }

  calcularTotal(
    totalProd,
    arranque,
    TarifaKM,
    TarifaTime,
    TotalKM,
    recargos,
    porcentaje
  ) {
    // alert("Si llega a funcion calcular total");

    let banderazo = arranque;
    let tarifaKM = TarifaKM;
    let tarifaTime = TarifaTime;
    let totalKM = TotalKM.toFixed(2);
    console.log("KM: ", totalKM);
    this.comisionPorcentaje = (totalProd * porcentaje) / 100;
    localStorage.setItem("porcentaje", this.comisionPorcentaje);
    // console.log("this is the tarifa and banderazo: ",banderazo, " ",Tarifa);

    this.pedidosProv.getServicio(this.servicioID).then((servicio) => {
      this.servicio = servicio;
      console.log(this.servicio);
      this._inicio = this.servicio.fecha_inicio;
      this._termino = this.servicio.fecha_termino;
      const clave = this.servicio.clave;
      // console.log("Fecha _inicio:", this._inicio);
      // console.log("Fecha _termino:", this._termino);
      const date = moment().format("YYYY-MM-DD");
      const fecha = moment(date).format("x");
      const idRepa = this.uid;
      const idRes = this.idRestaurante;
      console.log("Fecha: ", fecha);
      console.log("id Reparti: ", idRepa);
      console.log("id Restaurante: ", idRes);

      const time = moment.duration(Number(this._inicio)).asMinutes();
      const time2 = moment.duration(Number(this._termino)).asMinutes();
      const res = time2 - time;
      this.minutos = res.toFixed();
      console.log("Tiempo del servicio: ", this.minutos);

      this.pedidosProv.insertarTiempo(this.servicioID, Number(this.minutos));

      let tipoPago = this.servicio.metodo_pago;
      const regular = this.servicio.abierto;
      if (regular == null) {
        this.regular = "true";
      }else{
        this.regular = "false";
      } 
      // console.log("Tipo Pago: ",tipoPago);

      if (tipoPago == "Tarjeta") {
        //Comision del Servicio por tiempo transcurrido
        this.comisionServicio =
          Number(tarifaKM) * Number(totalKM) +
          Number(this.minutos) * Number(tarifaTime) +
          Number(banderazo) + Number(recargos);
        // Number(banderazo) + Number(this.minutos) * Number(Tarifa);
        localStorage.setItem("comisionServicio", this.comisionServicio);
        console.log("Comision por el servicio: ", this.comisionServicio);

        this.totalF = totalProd + this.comisionServicio;
        let comisi = (this.totalF * 3.6) / 100 + 3;
        let iva = (comisi * 16) / 100;
        let totComisi = comisi + iva;
        this.totComision = Number(totComisi.toFixed(2));
        localStorage.setItem("totComision", this.totComision);
        console.log("total Comision por tarjeta: ", this.totComision);

        let totFinal = this.totalF + totComisi;
        this.totalFinal = Number(totFinal.toFixed(2));
        localStorage.setItem("totalFinal", this.totalFinal);
        this.totalProd1 = totalProd;
        localStorage.setItem("totalProd1", this.totalProd1);
        this.pedidosProv.getPorcentajesCortes(this.idSucursal).then((porc) => {
          this.porceCortes = porc;
          this.porceCortes.forEach((element) => {
            var bringme = element.bringme;
            var corteBme = (this.comisionServicio * bringme) / 100;
            this.corteBme = corteBme.toFixed(2);

            var repa = element.repa;
            var corteRep = (this.comisionServicio * repa) / 100;
            this.corteRep = corteRep.toFixed(2);
          });
        
        localStorage.setItem("corteBme", this.corteBme);
        localStorage.setItem("corteRep", this.corteRep);

        // this.pedidosProv.insertarTotales(this.servicioID, this.totComision, corteBme, corteRep, totalProd,this.comisionServicio ,this.totalFinal);
        // console.log("Total de los Productos: ",totalProd);
        // console.log("Total Comision: ",this.totComision);
        // console.log("Total F: ",this.totalF);
        // console.log("Banderazo: ", banderazo);
        // console.log("Comision por tiempo trancurrido del servicio: ", Number(this.minutos));

        let data = new URLSearchParams();
        
        data.append("clave", clave);
        data.append("totalProd", totalProd);
        data.append("totalProd1", this.totalProd1);
        data.append("comisionServicio", this.comisionServicio);
        data.append("totalFinal", this.totalFinal);
        data.append("totComision", this.totComision);
        data.append("corteBme", this.corteBme);
        data.append("corteRep", this.corteRep);
        data.append("totalLugares", this.totalLugares);
        data.append("recargos", this.recargos);
        data.append("porcentaje", this.comisionPorcentaje);
        data.append("metodo_pago", tipoPago);
        data.append("idSucursal", this.idSucursal);
        data.append("servicioID", this.servicioID);
        data.append("fecha", fecha);
        data.append("fecha_inicio", this._inicio);
        data.append("fecha_termino", this._termino);
        data.append("idRepartidor", this.uid);
        data.append("tipo", this.tipo);
        data.append("idRestaurante", this.idRestaurante);
        data.append("regular", this.regular);

        const url = `https://proyectosinternos.com/toctoc/toctoc/index.php/post_cobrar/realizar_cobro3/${this.servicioID}`;
        this.http
          .post(url, data)
          .map((res) => res.json())
          .subscribe((resp) => {
            // const msj = JSON.parse(res);
            console.log("Este es el mensaje: ", resp);

            // const msj = res.json().mensaje;
            if (resp.mensaje == "success") {
              console.log("Se insertó Correctamente: ");
              // alert("Se insertó correctamente y pasa a generar Ticket");            
              let status = "Pago";
              this.pedidosProv.actualizarStatusTermino(
                this.servicioID,
                status
              );

              this.navCtrl.setRoot(
                "CobrarPage",
                {
                  servicioID: this.servicioID,
                },
                {
                  animation: "md-transition",
                  animate: true,
                  direction: "down",
                }
              );
            } else {
              console.log("Error: ", resp);
              // alert("Ocurrio un error en la inserción");
            }
          });
          });
      } else {
        //Comision del Servicio por tiempo transcurrido
        this.comisionServicio =
          Number(tarifaKM) * Number(totalKM) +
          Number(this.minutos) * Number(tarifaTime) +
          Number(banderazo) + Number(recargos);
        localStorage.setItem("comisionServicio", this.comisionServicio);
        console.log("Comision por el servicio: ", this.comisionServicio);
        this.totalF = totalProd + this.comisionServicio;
        //  let totComisi = (((this.totalF*3.6)/100)+3);
        this.totComision = 0.0;
        localStorage.setItem("totComision", this.totComision);
        let totFinal = this.totalF + this.totComision;
        this.totalFinal = Number(totFinal.toFixed(2));
        localStorage.setItem("totalFinal", this.totalFinal);
        this.pedidosProv.getPorcentajesCortes(this.idSucursal).then((porc) => {
          this.porceCortes = porc;
          this.porceCortes.forEach((element) => {
            var bringme = element.bringme;
            var corteBme = (this.comisionServicio * bringme) / 100;
            this.corteBme = corteBme.toFixed(2);

            var repa = element.repa;
            var corteRep = (this.comisionServicio * repa) / 100;
            this.corteRep = corteRep.toFixed(2);
          });
                        
        localStorage.setItem("corteBme", this.corteBme);
        localStorage.setItem("corteRep", this.corteRep);
        // console.log("Total de los Productos: ",totalProd);
        // console.log("Total Comision: ",this.totComision);
        // console.log("Total F: ",this.totalF);
        // console.log("Banderazo: ", banderazo);
        // console.log("Comision por tiempo trancurrido del servicio: ", Number(this.minutos));
        this.totalProd1 = totalProd;
        localStorage.setItem("totalProd1", this.totalProd1);

        let data = new URLSearchParams();
     
        data.append("clave", clave);
        data.append("totalProd", totalProd);
        data.append("totalProd1", this.totalProd1);
        data.append("comisionServicio", this.comisionServicio);
        data.append("totalFinal", this.totalFinal);
        data.append("totComision", this.totComision);
        data.append("corteBme", this.corteBme);
        data.append("corteRep", this.corteRep);
        data.append("totalLugares", this.totalLugares);
        data.append("recargos", this.recargos);
        data.append("porcentaje", this.comisionPorcentaje);
        data.append("metodo_pago", tipoPago);
        data.append("idSucursal", this.idSucursal);
        data.append("servicioID", this.servicioID);
        data.append("fecha", fecha);
        data.append("fecha_inicio", this._inicio);
        data.append("fecha_termino", this._termino);
        data.append("idRepartidor", this.uid);
        data.append("tipo", this.tipo);
        data.append("idRestaurante", this.idRestaurante);
        data.append("regular", this.regular);


        const url = `https://proyectosinternos.com/toctoc/toctoc/index.php/post_cobrar/realizar_cobro3/${this.servicioID}`;
        this.http
          .post(url, data)
          .map((res) => res.json())
          .subscribe((resp) => {
            // const msj = res.json().mensaje;
            // const msj = JSON.parse(res);
            console.log("Este es el mensaje: ", resp);

            if (resp.mensaje == "success") {
              console.log("Se insertó Correctamente: ");
              // alert("Se insertó correctamente y pasa a generar Ticket");              
              let status = "Pago";
              this.pedidosProv.actualizarStatusTermino(
                this.servicioID,
                status                
              );

              this.navCtrl.setRoot(
                "CobrarPage",
                {
                  servicioID: this.servicioID,
                },
                {
                  animation: "md-transition",
                  animate: true,
                  direction: "down",
                }
              );
            } else {
              console.log("Error: ", resp);
              // alert("Ocurrio un error en la inserción");
            }
          });
        });
      }
    });
    // this.irPage();
  }

  mensajeRest(mensaje) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      position: "bottom",
    });

    toast.onDidDismiss(() => {
      console.log("Dismissed toast");
    });

    toast.present();
  }

  mostrarLoading() {
    let loading = this.loadingCtrl.create({
      spinner: "bubbles",
      content: "Calculando Total...",
    });

    loading.present();
        setTimeout(() => {
          loading.dismiss();
        }, 1000);
  }

  Comprado(idProducto, estatus) {
    // console.log("Este es el key: ", idProducto, "estatus recivido: ", estatus);
    this.pedidosProv.marcarProducto(idProducto, estatus);
  }
}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { SubirticketProvider } from '../../providers/subirticket/subirticket';


@IonicPage()
@Component({
  selector: 'page-ticket',
  templateUrl: 'ticket.html',
})
export class TicketPage {
  pedidoID: any;
  servicioID: any;
  ves: any;
  numTickets: any;
  imagenPreview : string ="";
  imagen64: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private viewCtrl : ViewController,
              private camera: Camera,
              public stProv: SubirticketProvider,
              public alertCtrl: AlertController) {
                this.pedidoID = navParams.get("pedidoID");
                console.log("Este es el ID del pedido: ", this.pedidoID);

                this.numTickets = navParams.get("numTickets");
                this.servicioID = navParams.get("servicioID");
                this.ves = navParams.get("ves");
                console.log("Estos son los datos: ",this.numTickets + " Tambien :",this.pedidoID + " VEs: ",this.ves);
                
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad TicketPage');
  }
  cerrarModal(){
    this.viewCtrl.dismiss();
  }

  mostrarCamara(){

    const options: CameraOptions = {
      quality: 40,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 350,
      targetHeight: 650
    }

    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     this.imagenPreview = 'data:image/jpeg;base64,' + imageData;
     this.imagen64 = imageData;
    }, (err) => {
     // Handle error
     console.log("Error en Camara", JSON.stringify(err));
    });

  }
  
  subirTicket(){

    const prompt = this.alertCtrl.create({
      title: 'Monto',
      message: "Ingresa el Total del Ticket",
      inputs: [
        {
          name: 'total',
          placeholder: 'Monto del ticket',
          type: 'number'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Guardar',
          handler: data => {
            let archivo = {
              photo: this.imagen64,
              pedidoID: this.pedidoID,
              total: data.total
            }
            if(this.ves=='PV'){
              this.stProv.cargarTicket(archivo);
              this.stProv.actualizaTickets(this.servicioID, this.numTickets)
            }else if(this.ves=='SV'){
              this.stProv.cargarTicket(archivo);
            }
            
            this.cerrarModal();
          }
        }
      ]
    });
    prompt.present();  
  }

}

import { Injectable } from '@angular/core';

import { ToastController, LoadingController, AlertController  } from 'ionic-angular';
import { AngularFirestore} from '@angular/fire/firestore';
import { AngularFireDatabase } from "angularfire2/database";
import * as firebase from "firebase";

@Injectable()
export class SubirticketProvider {
  db = firebase.firestore();
  // uid : string;

  constructor(public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              public afDB: AngularFireDatabase,
              public afs: AngularFirestore
    ) {
    // console.log('Hello SubirticketProvider Provider');
  }

  cargarTicket(archivo: ArchivoSubir){
    let promesa = new Promise( (resolve, reject)=>{
      this.mostrarLoading('Cargando...');

      let storeRef = firebase.storage().ref();
      let nombreArchivo: string = new Date().valueOf().toString();

      let uploadTask: firebase.storage.UploadTask =
          storeRef.child(`tickets/${nombreArchivo}`)
            .putString(archivo.photo, 'base64', { contentType: 'image/jpeg' });

      uploadTask.on( firebase.storage.TaskEvent.STATE_CHANGED,
        ()=>{ }, //Saber el % de Mbs se han subido
        ( error ) =>{
          //Manejo de error
          console.log("Error en la carga");
          this.presentAlert("Ocurrió un error al cargar el ticket intente nuevamente");

          // console.log(JSON.stringify(error));
          // this.mostrarToast(JSON.stringify(error));
          reject();
        },
        ()=>{
          // TODO bien
          console.log("Archivo subido");
          // this.mostrarToast('Imagen Cargada Correctamente');

          //let url = uploadTask.snapshot.ref.getDownloadURL();

          //Inician mis pruebas

          uploadTask.snapshot.ref.getDownloadURL().then(urlImage => {
            let pedidoID = archivo.pedidoID;
            let total = archivo.total;
           this.subirTicket(urlImage, pedidoID, total);
            //this.mostrarToast('URL:' + urlImage);
           }).catch((error) => {
                    console.log(error);
           });

          //  this.presentAlert("Se cargó correctamente el ticket");
            resolve();
        }


       )
    });
    return promesa;
  }

  // private crear_post(url: string, key:any){


  //   //console.log(JSON.stringify(post));
  //   this.db.collection("pedidos").doc(key).update({imagen:url}).then(function(){
  //     console.log("Document written witch ID:", key);
      
      
  //   }).catch(function(error){
  //     console.error("Error adding document: ",JSON.stringify(error));      
     
  //   });      
 
  
  //   };

  subirTicket(ticket, pedidoID, total) {
       
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("pedidos")
        .doc(pedidoID)
        .update({
          ticket: ticket,
          estatus: "true",
          total: Number(total)
        })
        .then(() => {
          resolve(true);
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  actualizaTickets(servicioID, numTickets) {
       let contador = numTickets + 1;
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("servicios")
        .doc(servicioID)
        .update({
          numTikets: contador
        })
        .then(() => {
          resolve(true);
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  mostrarToast(mensaje:string){

    this.toastCtrl.create({
        message: mensaje,
        duration: 4000
      }).present();


  }

  mostrarLoading(mensaje: string){     
       let loading = this.loadingCtrl.create({
        spinner: "bubbles",
        content: mensaje
      });
      loading.present();
    
      setTimeout(() => { 
        loading.dismiss();
      }, 4000); 
  }

  presentAlert(mensaje: string) {
    let alert = this.alertCtrl.create({
      subTitle: mensaje,
      buttons: ['Aceptar']
    });
    alert.present();
  }



}

interface ArchivoSubir{
  photo: string;
  pedidoID:string;
  total:number;
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { map } from 'rxjs/operators/map';
import { Observable } from "rxjs/Observable";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Platform } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';



export class ChatMessage {
  messageId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  toUserId: string;
  time: number | string;
  message: string;
}

export class UserInfo {
  id: string;
  name?: string;
  avatar?: string;
}

@Injectable()
export class ChatserviceProvider {
  db = firebase.firestore();
  repartidor: any;
  idRepartidor: any;
  idServicio: any;
  servicio: any;
  MessageCollection: AngularFirestoreCollection;
  messages: Observable<any[]>;

  constructor(public http: HttpClient,
              private events: Events,
              private platform: Platform,
              private nativeStorage: NativeStorage,
              public afs: AngularFirestore) {
  }

  mockNewMsg(msg) {
    const mockMsg: ChatMessage = {
      messageId: Date.now().toString(),
      userId: '210000198410281948',
      userName: 'Hancock',
      userAvatar: './assets/to-user.jpg',
      toUserId: '140000198202211138',
      time: Date.now(),
      message: msg.message,
    };

    setTimeout(() => {
      this.events.publish('chat:received', mockMsg, Date.now())
    }, Math.random() * 1800)
  }


  getUserInfo(): Promise<UserInfo> {
    const userInfo: UserInfo = {
      id: '140000198202211138',
      name: 'Luff',
      avatar: './assets/imgs/repa.png'
    };
    return new Promise(resolve => resolve(userInfo));
  }

  /*********************************************************************************************/
  /**************************** Inicician las consultas para el chat****************************
  *********************************************************************************************/
 getRepartidor(){
    this.idRepartidor = localStorage.getItem("idRepartidor");
      
  return new Promise((resolve, reject) => {
    this.db
      .collection("users")
      .doc(this.idRepartidor)
      .get()
      .then(doc => {
        if (!doc.exists) {
          console.log("No such document!");
          resolve(null);
        } else {
          console.log("Document data:", doc.data());
          resolve(doc.data());
        }
      })
      .catch(err => {
        console.log("Error getting document", err);
        reject(err);
      });
  });  
}

enviarMensaje(datos) {
    this.idRepartidor = localStorage.getItem("idRepartidor");
    this.idServicio = localStorage.getItem("servIniciado");
  return new Promise((resolve) => {
    
    this.db
      .collection("chat")
      .add({
        messageId: datos.messageId,
        userId: this.idRepartidor,
        userName: datos.userName,
        userAvatar: datos.userAvatar,
        time: datos.time,
        message: datos.message,
        service: this.idServicio

      })
      .then(function(docRef) {
        console.log("Document successfully written!", docRef.id);
        resolve({ success: true });
      })
      .catch(function(error) {
        console.error("Error adding document: ", JSON.stringify(error));
      });
  });
  // console.log("EStos son los datos: ",datos);  
}

getMsgList(){
    this.servicio = localStorage.getItem("servIniciado");
  this.MessageCollection = this.afs.collection('chat', ref=> ref.where("service","==",this.servicio).orderBy("time").orderBy("messageId"));
  this.messages = this.MessageCollection.valueChanges();
  return this.messages=this.MessageCollection.snapshotChanges().pipe(map(changes=>{
    return changes.map(action=>{
      const data = action.payload.doc.data();
      data.id = action.payload.doc.id;
      return data;
    });
  }));
  
}  

}

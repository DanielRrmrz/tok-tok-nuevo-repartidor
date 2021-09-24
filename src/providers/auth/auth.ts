import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { PedidosProvider } from '../../providers/pedidos/pedidos';
import { Platform } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import * as firebase from "firebase/app";
import "firebase/firestore";

@Injectable()
export class AuthProvider {
  db = firebase.firestore();
  repartidor: any = {};

  constructor(
    public angFireAuth: AngularFireAuth,
    public pedidosProv: PedidosProvider,
    private platform: Platform,
    private nativeStorage: NativeStorage
  ) {
    // console.log('Hello AuthProvider Provider');
  }

  login(username, password) {
    var promise = new Promise((resolve, reject) => {
      this.angFireAuth.auth
        .signInWithEmailAndPassword(username, password)
        .then(res => {
          let uid = res.user.uid;
          this.getRepartidor(uid);
            localStorage.setItem("idRepartidor", uid);
            // console.log("Este es el resultado del Login: ",res)
            resolve(true);
            localStorage.setItem("isLogin", "true");    
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  logout() {
      localStorage.removeItem("isLogin"); 
  }

  getRepartidor(idRepartidor) {
    this.pedidosProv.getRepartidor(idRepartidor).then(repartidor => {
      this.repartidor = repartidor;
      // let sucursal = this.repartidor.uidSucursal;
        localStorage.setItem("idSucursal", this.repartidor.uidSucursal);      
    });
  }

  idOneSignal(idx, playerID) {
    return new Promise((resolve, reject) => {
      this.db
        .collection("users")
        .doc(idx)
        .update({
          playerID: playerID
        })
        .then(function() {
          console.log("Document written with ID: ", idx);
          resolve({ success: true });
        })
        .catch(function(error) {
          console.error("Error adding document: ", JSON.stringify(error));
        });
    });
  }
}

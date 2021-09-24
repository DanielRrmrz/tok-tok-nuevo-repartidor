import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from "firebase/app";

@Injectable()
export class HistoryProvider {
  db = firebase.firestore();

  constructor(
    public afs: AngularFirestore
  ) {
    // console.log('Hello HistoryProvider Provider');
  }
  getBalance(idRepartidor, fecha1, fecha2): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection("servicios")
        .where("uidRepartidor", "==", idRepartidor)
        .where("fecha", ">=", fecha1)
        .where("fecha", "<=", fecha2)
        .orderBy("fecha", "desc")
        .get()
        .then(querySnapshot => {
          let arr = [];
          querySnapshot.forEach(function(doc) {
            var obj = JSON.parse(JSON.stringify(doc.data()));
            obj.key = doc.id;
            // console.log(obj);
            if (obj.estatus == "Pagado" || obj.estatus == "Terminado") {              
              arr.push(obj);
            }
          });
          if (arr.length > 0) {
            // console.log("Document data:", arr);
            resolve(arr);
          } else {
            // console.log("No such document!");
            resolve(null);
          }
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

}

import { Injectable } from '@angular/core';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
// import { Action } from 'rxjs/internal/scheduler/Action';
import { Platform } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';


@Injectable()
export class PedidosProvider {
  db = firebase.firestore();
  serviciosPLQCollection: AngularFirestoreCollection;
  serviciosPLQ: Observable<any[]>;
  // Points
  serviciosP: AngularFirestoreCollection<any[]>;
  _serviciosP: Observable<any>;
  serviciosRCollection: AngularFirestoreCollection;
  serviciosR: Observable<any[]>;
  pedidosCollection: AngularFirestoreCollection;
  pedidos: AngularFirestoreCollection<any[]>;
  _pedidos: Observable<any>;
  products: AngularFirestoreCollection<any[]>;
  _products: Observable<any>;
  pedidoDoc: AngularFirestoreDocument;
  pedido: Observable<any>;
  repa: AngularFirestoreDocument;
  _repa: Observable<any>;
  sucursal: any;
  servicios: AngularFirestoreCollection<any[]>;
  _servicios: Observable<any>;

  constructor(
    public afireauth: AngularFireAuth,
    public afiredatabase: AngularFireDatabase,
    public platform: Platform,              
    private nativeStorage: NativeStorage,
    public afs: AngularFirestore
  ) {
      this.sucursal = localStorage.getItem("idSucursal");  
    console.log("Esta es la sucursal jajaja: ", this.sucursal);

    this.serviciosPLQCollection = afs.collection("servicios", ref =>
      ref
        .where("estatus", "==", "Notificando")
        .where("uidSucursal", "==", this.sucursal)
    );
    this.serviciosPLQ = this.serviciosPLQCollection.valueChanges();

    this.serviciosRCollection = afs.collection("servicios", ref =>
      ref
        .where("estatus", "==", "BuscandoBme")
        .where("uidSucursal", "==", this.sucursal)
    );
    this.serviciosR = this.serviciosRCollection.valueChanges();

    // let servicioID = localStorage.getItem("servIniciado");
    // if(servicioID != null){
    //   this.pedidosCollection = afs.collection('pedidos', ref=> ref.where("servicioID","==",servicioID));
    //   this.pedidos = this.pedidosCollection.valueChanges();
    // }
  }

  getServiciosPLQ(idx) {
    this.serviciosPLQCollection = this.afs.collection("servicios", ref =>
      ref
        .where("estatus", "==", "Notificando")
        .where("tipo", "==", 1)
        .where("uidSucursal", "==", idx)
    );
    this.serviciosPLQ = this.serviciosPLQCollection.valueChanges();
    return (this.serviciosPLQ = this.serviciosPLQCollection
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(action => {
            const data = action.payload.doc.data();
            data.id = action.payload.doc.id;
            return data;
          });
        })
      ));
  }

  getServiciosR(idx) {
    this.serviciosRCollection = this.afs.collection("servicios", ref =>
      ref.where("estatus", "==", "BuscandoBme").where("uidSucursal", "==", idx)
    );
    this.serviciosR = this.serviciosRCollection.valueChanges();
    return (this.serviciosR = this.serviciosRCollection.snapshotChanges().pipe(
      map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data();
          data.id = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  // getPedidos2(){
  //   return this.pedidos=this.pedidosCollection.snapshotChanges().pipe(map(changes=>{
  //     return changes.map(action=>{
  //       const data = action.payload.doc.data();
  //       data.id = action.payload.doc.id;
  //       return data;
  //     });
  //   }));

  // }

  getPedidos(pedidoID) {
    this.pedidos = this.afs.collection<any>("pedidos", ref =>
      ref.where("servicioID", "==", pedidoID)
    );
    this._pedidos = this.pedidos.valueChanges();

    return (this._pedidos = this.pedidos.snapshotChanges().pipe(
      map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  getProd(servicioID) {
    this.pedidos = this.afs.collection<any>("productos", ref =>
      ref.where("servicioID", "==", servicioID).where("estatus","==",true)
    );
    this._pedidos = this.pedidos.valueChanges();

    return (this._pedidos = this.pedidos.snapshotChanges().pipe(
      map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }


  getAllServicios(collection: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection(collection)
        .where("estatus", "==", "Notificando")
        .get()
        .then(querySnapshot => {
          let arr = [];
          querySnapshot.forEach(function(doc) {
            var obj = JSON.parse(JSON.stringify(doc.data()));
            obj.$key = doc.id;
            console.log(obj);
            arr.push(obj);
          });

          if (arr.length > 0) {
            console.log("Document data:", arr);
            resolve(arr);
          } else {
            console.log("No such document!");
            resolve(null);
          }
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  // getAllClientes(collection: string): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.db
  //       .collection(collection)
  //       .where("tipo", "==", 4)
  //       .get()
  //       .then(querySnapshot => {
  //         let arr = [];
  //         querySnapshot.forEach(function(doc) {
  //           var obj = JSON.parse(JSON.stringify(doc.data()));
  //           obj.$key = doc.id;
  //           arr.push(obj);
  //         });

  //         if (arr.length > 0) {
  //           console.log("Document data:", arr);
  //           resolve(arr);
  //         } else {
  //           console.log("No such document!");
  //           resolve(null);
  //         }
  //       })
  //       .catch((error: any) => {
  //         reject(error);
  //       });
  //   });
  // }

  // getAllConvenios(collection: string): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.db
  //       .collection(collection)
  //       .where("tipo", "==", 3)
  //       .get()
  //       .then(querySnapshot => {
  //         let arr = [];
  //         querySnapshot.forEach(function(doc) {
  //           var obj = JSON.parse(JSON.stringify(doc.data()));
  //           obj.$key = doc.id;
  //           arr.push(obj);
  //         });

  //         if (arr.length > 0) {
  //           // console.log("Document data:", arr);
  //           resolve(arr);
  //         } else {
  //           console.log("No such document!");
  //           resolve(null);
  //         }
  //       })
  //       .catch((error: any) => {
  //         reject(error);
  //       });
  //   });
  // }

  getPedidos1(uid): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection("pedidos")
        .where("servicioID", "==", uid)
        .get()
        .then(querySnapshot => {
          let arr = [];
          querySnapshot.forEach(function(doc) {
            var obj = JSON.parse(JSON.stringify(doc.data()));
            obj.key = doc.id;
            console.log(obj);
            arr.push(obj);
          });

          if (arr.length > 0) {
            console.log("Document data:", arr);
            resolve(arr);
          } else {
            console.log("No such document!");
            resolve(null);
          }
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  getServCompletados(idCliente): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection("servicios")
        .where("uidCliente", "==", idCliente)
        .where("estatus", "==", "Terminado")
        .get()
        .then(querySnapshot => {
          let arr = [];
          querySnapshot.forEach(function(doc) {
            var obj = JSON.parse(JSON.stringify(doc.data()));
            obj.key = doc.id;
            // console.log(obj);
            arr.push(obj);
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

  getServCancelados(idCliente): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection("servicios")
        .where("uidCliente", "==", idCliente)
        .where("estatus", "==", "Cancelado")
        .get()
        .then(querySnapshot => {
          let arr = [];
          querySnapshot.forEach(function(doc) {
            var obj = JSON.parse(JSON.stringify(doc.data()));
            obj.key = doc.id;
            // console.log(obj);
            arr.push(obj);
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

  getTotalServ(idCliente): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection("servicios")
        .where("uidCliente", "==", idCliente)
        .get()
        .then(querySnapshot => {
          let arr = [];
          querySnapshot.forEach(function(doc) {
            var obj = JSON.parse(JSON.stringify(doc.data()));
            obj.key = doc.id;
            // console.log(obj);
            arr.push(obj);
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

  getProductos(uid): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection("productos")
        .where("pedidoID", "==", uid)
        .get()
        .then(querySnapshot => {
          let arr = [];
          querySnapshot.forEach(function(doc) {
            var obj = JSON.parse(JSON.stringify(doc.data()));
            obj.key = doc.id;
            console.log(obj);
            arr.push(obj);
          });

          if (arr.length > 0) {
            console.log("Document data:", arr);
            resolve(arr);
          } else {
            console.log("No such document!");
            resolve(null);
          }
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  getAllProducts(uid): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection("productos")
        .where("servicioID", "==", uid)
        .get()
        .then(querySnapshot => {
          let arr = [];
          querySnapshot.forEach(function(doc) {
            var obj = JSON.parse(JSON.stringify(doc.data()));
            obj.key = doc.id;
            console.log(obj);
            arr.push(obj);
          });

          if (arr.length > 0) {
            console.log("Document data:", arr);
            resolve(arr);
          } else {
            console.log("No such document!");
            resolve(null);
          }
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  getAllProducts1(uid) {
    this.products = this.afs.collection<any>("productos", ref =>
      ref.where("servicioID", "==", uid)
    );
    this._products = this.products.valueChanges();

    return (this._products = this.products.snapshotChanges().pipe(
      map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  getServicio(id) {
    return new Promise((resolve, reject) => {
      this.db
        .collection("servicios")
        .doc(id)
        .get()
        .then(doc => {
          if (!doc.exists) {
            console.log("No such document!");
            resolve(null);
          } else {
            // console.log("Document data:", doc.data());
            resolve(doc.data());
          }
        })
        .catch(err => {
          console.log("Error getting document", err);
          reject(err);
        });
    });
  }

  ////////////////////////////////////////////////////////////////////////////////////
  //////////      Consultas para el proceso de ejecución del                  ////////
  /////////                         Servicio                                  ////////
  /////////                                                                   ////////
  /////////                                                                   ////////
  ////////////////////////////////////////////////////////////////////////////////////

  getRepartidor(idRepartidor) {
    return new Promise((resolve, reject) => {
      this.db
        .collection("users")
        .doc(idRepartidor)
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

  getCFPLQ(idSucursal): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection("costos_fijos")
        .where("uidSucursal", "==", idSucursal)
        .get()
        .then(querySnapshot => {
          let arr = [];
          querySnapshot.forEach(function(doc) {
            var obj = JSON.parse(JSON.stringify(doc.data()));
            obj.key = doc.id;
            console.log(obj);
            arr.push(obj);
          });

          if (arr.length > 0) {
            console.log("Document data:", arr);
            resolve(arr);
          } else {
            console.log("No such document!");
            resolve(null);
          }
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }
  getCFMenu(idSucursal): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection("costos_fijo_menu")
        .where("uidSucursal", "==", idSucursal)
        .get()
        .then(querySnapshot => {
          let arr = [];
          querySnapshot.forEach(function(doc) {
            var obj = JSON.parse(JSON.stringify(doc.data()));
            obj.key = doc.id;
            console.log(obj);
            arr.push(obj);
          });

          if (arr.length > 0) {
            console.log("Document data:", arr);
            resolve(arr);
          } else {
            console.log("No such document!");
            resolve(null);
          }
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  getPorMenu(idSucursal): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection("porcentaje_menu")
        .where("uidSucursal", "==", idSucursal)
        .get()
        .then(querySnapshot => {
          let arr = [];
          querySnapshot.forEach(function(doc) {
            var obj = JSON.parse(JSON.stringify(doc.data()));
            obj.key = doc.id;
            console.log(obj);
            arr.push(obj);
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

  getRecargos(idSucursal): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection("monto_recargos")
        .where("uidSucursal", "==", idSucursal)
        .get()
        .then(querySnapshot => {
          let arr = [];
          querySnapshot.forEach(function(doc) {
            var obj = JSON.parse(JSON.stringify(doc.data()));
            obj.key = doc.id;
            console.log(obj);
            arr.push(obj);
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

  getPorcentajesCortes(idSucursal): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection("tarifas_cortes")
        .where("uidSucursal", "==", idSucursal)
        .get()
        .then(querySnapshot => {
          let arr = [];
          querySnapshot.forEach(function(doc) {
            var obj = JSON.parse(JSON.stringify(doc.data()));
            obj.key = doc.id;
            console.log(obj);
            arr.push(obj);
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

  getTarifasPLQ(idSucursal): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection("tarifas")
        .where("uidSucursal", "==", idSucursal)
        .get()
        .then(querySnapshot => {
          let arr = [];
          querySnapshot.forEach(function(doc) {
            var obj = JSON.parse(JSON.stringify(doc.data()));
            obj.key = doc.id;
            console.log(obj);
            arr.push(obj);
          });

          if (arr.length > 0) {
            console.log("Document data:", arr);
            resolve(arr);
          } else {
            console.log("No such document!");
            resolve(null);
          }
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  getTarifasMenu(idSucursal): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection("tarifas_menu")
        .where("uidSucursal", "==", idSucursal)
        .get()
        .then(querySnapshot => {
          let arr = [];
          querySnapshot.forEach(function(doc) {
            var obj = JSON.parse(JSON.stringify(doc.data()));
            obj.key = doc.id;
            console.log(obj);
            arr.push(obj);
          });

          if (arr.length > 0) {
            console.log("Document data:", arr);
            resolve(arr);
          } else {
            console.log("No such document!");
            resolve(null);
          }
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  aceptarServicio(servicioID, status, uid, playerIDRepartidor) {
    // alert("playerIDRepartidor en el provider: " + playerIDRepartidor);
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("servicios")
        .doc(servicioID)
        .update({
          estatus: status,
          uidRepartidor: uid,
          playerIDRepartidor: playerIDRepartidor
        })
        .then(() => {
          resolve({success: true});
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }
  actualizaVez(servicioID) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("servicios")
        .doc(servicioID)
        .update({
          vez: 1
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

  actualizarStatus(servicioID, status) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("servicios")
        .doc(servicioID)
        .update({
          estatus: status
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

  marcarProducto(productoID, status) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("productos")
        .doc(productoID)
        .update({
          estatus: status
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

  actualizarStatusFechaInicio(servicioID, status, fecha) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("servicios")
        .doc(servicioID)
        .update({
          estatus: status,
          fecha_inicio: fecha
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

  insertarTarjeta(tarjeta, codigo, mes, anio) {
    return new Promise((resolve, reject) => {
      this.db
        .collection("tarjetas")
        .add({
          cardType: tarjeta,
          cvc: codigo,
          expMonth: mes,
          expYear: anio,
          uidCliente: "Jd7Kn9rOLgNzxGOA8SujiDwk3c33"
        })
        .then(function(docRef) {
          console.log("Document successfully written!", docRef.id);
          resolve({ success: true });
        })
        .catch(function(error) {
          console.error("Error adding document: ", JSON.stringify(error));
        });
    });
  }

  getTarjeta(idTarjeta) {
    return new Promise((resolve, reject) => {
      this.db
        .collection("card")
        .doc(idTarjeta)
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

  actualizaStatus(servicioID, status) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("servicios")
        .doc(servicioID)
        .update({
          status: status
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

  actualizaStatusTermino(servicioID, usuario) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("servicios")
        .doc(servicioID)
        .update({
          termino: usuario
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

  actualizarFechaTermino(servicioID, fecha) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("servicios")
        .doc(servicioID)
        .update({
          fecha_termino: fecha
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


  actualizarStatusTermino(servicioID, status) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("servicios")
        .doc(servicioID)
        .update({
          estatus: status
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

  cancelarServicio(servicioID, status, motivo) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("servicios")
        .doc(servicioID)
        .update({
          estatus: status,
          motivo: motivo
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


  getOneServicio(idServicio: string) {
    this.pedidoDoc = this.afs.doc(`servicios/${idServicio}`);
    // this.pedidoDoc = this.afs.collection<Servicios>('servicios').doc(`/${idPedido}`).collection<Pedidos>('pedidos');
    return (this.pedido = this.pedidoDoc.snapshotChanges().pipe(
      map(action => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data();
          data.uid = action.payload.id;
          return data;
        }
      })
    ));
  }

  getOneUsuario(idUsuario: string) {
    this.pedidoDoc = this.afs.doc(`users/${idUsuario}`);
    // this.pedidoDoc = this.afs.collection<Servicios>('servicios').doc(`/${idPedido}`).collection<Pedidos>('pedidos');
    return (this.pedido = this.pedidoDoc.snapshotChanges().pipe(
      map(action => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data();
          data.uid = action.payload.id;
          return data;
        }
      })
    ));
  }

  getOneRepartidor(uidRepartidor) {
    this.repa = this.afs.doc(`users/${uidRepartidor}`);
    // this.pedidoDoc = this.afs.collection<Servicios>('servicios').doc(`/${idPedido}`).collection<Pedidos>('pedidos');
    return (this._repa = this.repa.snapshotChanges().pipe(
      map(action => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data();
          data.uid = action.payload.id;
          return data;
        }
      })
    ));
  }
 
  insertarTiempo(servicioID, tiempo) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("servicios")
        .doc(servicioID)
        .update({
          tiempoServicio: tiempo
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

  insertarTotales(
    servicioID,
    comision,
    corteBme,
    corteRep,
    totalProductos,
    totalF,
    totalFinal,
    estatus,
    porcentaje
  ) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("servicios")
        .doc(servicioID)
        .update({
          comision: comision,
          corteBme: corteBme,
          corteRep: corteRep,
          totalProductos: totalProductos,
          totalServicio: totalF,
          totalNeto: totalFinal,
          estatus: estatus,
          porcentaje: porcentaje
        })
        .then(() => {
          resolve({success: true});
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  updateChekedFalse(cardID) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("card")
        .doc(cardID)
        .update({
          checked: false
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

  getAllServiciosP(idx) {
    this.serviciosP = this.afs.collection<any>("rutas", ref =>
      ref
        .where("idServicio", "==", idx)
        .where("estatus", "==", 1)
        .orderBy("fecha", "asc")
    );
    this._serviciosP = this.serviciosP.valueChanges();
    return (this._serviciosP = this.serviciosP.snapshotChanges().pipe(
      map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  updateKm(idx, km){
      var promise = new Promise((resolve, reject) => {
        this.db
          .collection("servicios")
          .doc(idx)
          .update({
            km: km
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

  getHistorial(idx) {
    this.servicios = this.afs.collection<any>("servicios", ref =>
      ref.where("uidRepartidor", "==", idx).where("estatus","==","Terminado").orderBy("fecha", "desc")
    );
    this._servicios = this.servicios.valueChanges();

    return (this._servicios = this.servicios.snapshotChanges().pipe(
      map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  actualizarMetodoPago(servicioID, metodo) {
    var promise = new Promise((resolve, reject) => {
      this.db
        .collection("servicios")
        .doc(servicioID)
        .update({
          metodo_pago: metodo,
          cambio: "cambio"
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


}

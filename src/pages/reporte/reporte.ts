import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as moment from "moment";
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";



@IonicPage()
@Component({
  selector: 'page-reporte',
  templateUrl: 'reporte.html',
})
export class ReportePage {
  myDate: any;
  uid: any;
  myDate1: any;
  servicios: any;
  totalServicios: number;
  totalProductos: any;
  totalEfectivo: any;
  totalTarjeta: any;
  totalBringme: any;
  totalRepa: any;
  totalFinal: any;
  show: boolean = false;
  show1: boolean = false;
  fechaIni: any;
  fechaTer: any;
  res:  boolean = false;

  constructor(public navCtrl: NavController,
              public http: Http,
              public navParams: NavParams) {

                this.uid = localStorage.getItem("idRepartidor");

  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ReportePage');
  }

  Reporte(){
    this.show = true;
    let fecha1 = moment(this.myDate).format("x");
    this.fechaIni = fecha1;
    console.log("FEcha 1: ", this.fechaIni);
    let fecha2 = this.myDate1  
    

    
    let hora = moment();
    let hora1 = moment(hora).format(" HH:mm:ss");
    // console.log("ESta es la hora: ", hora1);

    let fechaConca = fecha2+hora1;
    // console.log("Esta es la fecha con hora completa: ", fechaConca);

    let fechaFin = moment(fechaConca).format("x");
    this.fechaTer = fechaFin;
    console.log("Esta es la fecha con hora completa en timeStamp: ", this.fechaTer);

    const url = `https://proyectosinternos.com/toctoc/toctoc/index.php/reporte/${this.fechaIni}/${this.fechaTer}/${this.uid}`;
    this.http.get(url).subscribe(res => {
      this.servicios = res.json().consulta;
      console.log("Reporte Respuesta:", this.servicios);
      
        if (this.servicios.length != 0) {
          this.res= true;
          console.log("Este es el RES: ", this.res);
          
          var totalEfec = 0;
          var totalTar = 0;
          for( let ser of this.servicios){
            if (ser.metodo_pago=="Efectivo") {
              // console.log("total de los: ", ser.metodo_pago);
              totalEfec += parseFloat(ser.totalProd);       
            }
            if (ser.metodo_pago=="Tarjeta") {
              totalTar += parseFloat(ser.totalProd);       
              
            }                               
          }

          this.totalTarjeta = totalTar;
          console.log("Total de los Tarjetas: ", this.totalTarjeta);

          this.totalEfectivo = totalEfec;
          console.log("Total de los Efectivos: ", this.totalEfectivo);

          
                   
        this.totalServicios= this.servicios.reduce((acc, obj) => acc + parseFloat(obj.totalFinal), 0);  
        console.log("Total de los servicios: ", this.totalServicios);
        
        // let valor = this.servicios.length;
        
        this.totalBringme = this.servicios.reduce((acc1, obj1) => acc1 + parseFloat(obj1.corteBme), 0);  
        console.log("Total de los bringme: ", this.totalBringme);

        this.totalRepa = this.servicios.reduce((acc, obj) => acc + parseFloat(obj.corteRep), 0); 
        console.log("Total de los repartidor: ", this.totalRepa);

        this.totalFinal = ((parseFloat(this.totalRepa)) + (parseFloat(this.totalEfectivo))) 
        console.log("Final ganancias: ", this.totalFinal);
        

        // this.totalProductos = this.servicios.reduce((acc, obj) => acc + parseFloat(obj.totalProductos), 0);  
        // console.log("Total de los productos: ", this.totalProductos);

        
        } else{
          this.res= false;
          console.log("Este es el RES: ", this.res);
        }              
      // console.log("Este es el total de servicios: ", this.servicios);      
    });
  }

  verMas(){
    if (this.show1 == false) {
      this.show1 = true;
    }else{
      this.show1 = false;
    }
  }

  goBack(){
    this.navCtrl.pop();
  }


}

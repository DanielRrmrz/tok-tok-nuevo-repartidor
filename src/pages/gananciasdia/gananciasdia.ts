import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as moment from "moment";
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";


@IonicPage()
@Component({
  selector: 'page-gananciasdia',
  templateUrl: 'gananciasdia.html',
})
export class GananciasdiaPage {
  uid: any;
  servicios: any;
  totalRepa: any;
  totalFinal: any;
  res:  boolean = false;

  constructor(public navCtrl: NavController, 
              public http: Http,
              public navParams: NavParams) {
                this.uid = localStorage.getItem("idRepartidor");
  }

  ionViewDidLoad() {
    this.Reporte();
  }

  Reporte(){

    const date = moment().format("YYYY-MM-DD");
    const fecha = moment(date).format("x");
    console.log("Esta es la fech`a del día de hoy: ", fecha);
    

      const url = `https://proyectosinternos.com/toctoc/toctoc/index.php/reporte/${fecha}/${fecha}/${this.uid}`;
      this.http.get(url).subscribe(res => {
      this.servicios = res.json().consulta;
      console.log("Reporte Respuesta:", this.servicios);
      
        if (this.servicios.length != 0) {
          this.res= true;
          console.log("Este es el RES: ", this.res);
        
        this.totalRepa = this.servicios.reduce((acc, obj) => acc + parseFloat(obj.corteRep), 0); 
        console.log("Total de los repartidor: ", this.totalRepa);

        // this.totalProductos = this.servicios.reduce((acc, obj) => acc + parseFloat(obj.totalProductos), 0);  
        // console.log("Total de los productos: ", this.totalProductos);

        
        } else{
          this.res= false;
          console.log("Este es el RES: ", this.res);
        }              
      // console.log("Este es el total de servicios: ", this.servicios);      
    });
  }

  goBack(){
    this.navCtrl.pop();
  }

}

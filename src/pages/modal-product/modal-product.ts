import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { FormBuilder, Validators, FormGroup } from "@angular/forms";

@IonicPage()
@Component({
  selector: 'page-modal-product',
  templateUrl: 'modal-product.html',
})
export class ModalProductPage {
  
  currentNumber = 0;
  myForm: FormGroup;

  nota:any = '';
  items:any[] = [];
  idx:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder,) {
  
  
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalProductPage');
  }

  /**
   * Do any initialization
   */
  ngOnInit() {

    this.formValidation();
    this.nota = '';

    this.idx = this.navParams.get('producto');
    
    if (this.idx != undefined) {

      this.cargarProducto(this.idx); 

    }

  }

  /***
   * --------------------------------------------------------------
   * Form Validation
   * --------------------------------------------------------------
   * @method   formValidation
   */
  formValidation() {
    this.myForm = this.formBuilder.group({
      nota: ["", Validators.compose([Validators.required])]
    });
  }


  goBack() {
    this.navCtrl.pop();
  }

  increment() {
    this.currentNumber++;
  }

  decrement() {
    if (this.currentNumber > 0) { this.currentNumber--; } 
  }

  agregar_producto(cantidad, nota){
    console.log(cantidad, nota);

    let producto = {
      cantidad: cantidad,
      nota: nota
    };

    let verdadero = 'true';
    
    this.items = JSON.parse(localStorage.getItem('producto'));
    this.items.push(producto);
    localStorage.setItem('producto', JSON.stringify(this.items));

    localStorage.setItem('prod', verdadero);

    
    this.navCtrl.setPages([{page: 'PlacePage', params: {page: "list"} }]);
  }

  cargarProducto(idx) {

    this.items = JSON.parse(localStorage.getItem('producto'));
    console.log('index', idx);
    console.log('productos', this.items[idx].cantidad);

    this.currentNumber = this.items[idx].cantidad;
    this.nota = this.items[idx].nota;

  }

  modificar_producto(cantidad, nota, idx){

    this.items = JSON.parse(localStorage.getItem('producto'));

    this.items[idx] = {
      cantidad: cantidad,
      nota: nota
    };

    localStorage.setItem('producto', JSON.stringify(this.items));

    this.navCtrl.setPages([{ page: 'PlacePage', params: { page: "list" } }]);

  }

}

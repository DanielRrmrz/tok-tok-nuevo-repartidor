import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  MenuController,
  ToastController,
  LoadingController,
  AlertController
} from "ionic-angular";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
// import * as firebase from "firebase/app";
import "firebase/firestore";
import { Observable } from "rxjs/Observable";
import { AngularFirestore } from "@angular/fire/firestore";


import { FormBuilder, Validators, FormGroup } from "@angular/forms";

// import { RegisterUserProvider } from "../../providers/register-user/register-user";
// import { UbicacionProvider } from "../../providers/ubicacion/ubicacion";

@IonicPage()
@Component({
  selector: "page-user-information",
  templateUrl: "user-information.html"
})
export class UserInformationPage {
  // db = firebase.firestore();
  myForm: FormGroup;
  UserInfoForm: any = {};
  uid: any;
  us: any;
  sucursales: Observable<any[]>;
  user: any = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public menu: MenuController,
    public toastCtrl: ToastController,
    public loadinCtl: LoadingController,
    public alertCtrl: AlertController,
    // public userProvider: RegisterUserProvider,
    public afireauth: AngularFireAuth,
    public afiredatabase: AngularFireDatabase,
    public db: AngularFirestore
    // public _ubicacionProv: UbicacionProvider
  ) {
    this.menu.enable(false); // Enable sidemenu
    this.uid = localStorage.getItem("uid");
    console.log(this.uid);

    // this._ubicacionProv.iniciarGeolocalizacion();
  }

  /**
   * Do any initialization
   */
  ngOnInit() {
    this.formValidation();
    this.loadUser();
    this.loadSucursales();
  }

  loadUser() {
    // this.userProvider.getUser(this.uid).then(user => {
    //   this.us = user;
    //   this.UserInfoForm = this.us.perfil;
    //   console.log(this.UserInfoForm);
    // });
  }

  loadSucursales() {
    // this.userProvider.getAllDocuments("sucursales").then(e => {
    //   this.sucursales = e;
    // });
  }

  /***
   * --------------------------------------------------------------
   * Form Validation
   * --------------------------------------------------------------
   * @method   formValidation
   */
  formValidation() {
    this.myForm = this.formBuilder.group({
      username: ["", Validators.compose([Validators.required])],
      lastname: ["", Validators.compose([Validators.required])],
      phone: ["", Validators.compose([Validators.required])],
      email: ["", Validators.compose([Validators.required, Validators.email])],
      location: ["", Validators.compose([Validators.required])]
    });
  }

  /**
   * --------------------------------------------------------------
   * Go To Menu Category Page
   * --------------------------------------------------------------
   */
  gotoMenuCategoryPage() {
    this.navCtrl.setRoot("FoodCategoriesPage");
  }

  // registrarUsuario() {
  //   let perfil = {
  //     username: this.UserInfoForm.username,
  //     lastname: this.UserInfoForm.lastname,
  //     phone: this.UserInfoForm.phone,
  //     email: this.UserInfoForm.email,
  //     location: this.UserInfoForm.location
  //   };

  //   let loading = this.loadinCtl.create({
  //     spinner: "bubbles",
  //     content: "Actulizando su información"
  //   });

  //   this.userProvider
  //     .register(perfil, this.uid)
  //     .then((res: any) => {
  //       localStorage.setItem("isLogin", "true");
  //       this.navCtrl.setRoot("HomePage");
  //     })
  //     .catch(err => {
  //       this.alertCtrl
  //         .create({
  //           title: "Error al registrarce",
  //           subTitle: "Intenete de nuevo",
  //           buttons: ["Aceptar"]
  //         })
  //         .present();
  //     });
  //   loading.present();
  //   setTimeout(() => {
  //     loading.dismiss();
  //   }, 2000);
  // }
}

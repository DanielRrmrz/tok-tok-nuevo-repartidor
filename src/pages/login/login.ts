import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  MenuController,
  LoadingController
} from "ionic-angular";
// import { Platform } from "ionic-angular";


//Firebase
// import { AngularFireAuth } from "angularfire2/auth";
// import * as firebase from "firebase/app";

//Provider
// import { RegisterUserProvider } from "../../providers/register-user/register-user";
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private menu: MenuController,
    public loadinCtl: LoadingController,
    public authProvider: AuthProvider,
  ) {
    this.menu.enable(false); // Enable sidemenu
  }

  ionViewDidLoad() {
    // console.log("ionViewDidLoad LoginPage");
  }

  mostrarInput(){
    let alert = this.alertCtrl.create({
      title: 'Iniciar sesión',
      inputs: [
        {
          name: 'email',
          placeholder: 'Correo'
        },
        {
          name: 'password',
          placeholder: 'Contraseña',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ingresar',
          handler: data => {

            this.verifacarUsuario(data.email, data.password);

          }
        }
      ]
    });
    alert.present();
  }

  verifacarUsuario(username, password){

    let loading = this.loadinCtl.create({
      content: 'Verificando'
    });

    this.authProvider.login(username, password).then((res: any) => {

      // localStorage.setItem("isLogin", "true");
      this.navCtrl.setRoot("HomePage");
      // localStorage.setItem("uid", res.uid);

    }).catch((err) => {

      this.alertCtrl.create({
        title: 'Usuario incorrecto',
        subTitle: 'Intenta de nuevo, revisa tu correo y contraseña',
        buttons: ['Aceptar']
      }).present();

    });

    loading.present();

    setTimeout(() =>{
      loading.dismiss();
    }, 2000);

}
}

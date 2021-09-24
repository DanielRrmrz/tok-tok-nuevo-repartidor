import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CartPage } from './cart';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CartPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(CartPage),
  ],
})
export class CartPageModule { }

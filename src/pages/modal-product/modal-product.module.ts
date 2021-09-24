import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalProductPage } from './modal-product';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ModalProductPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(ModalProductPage),
  ],
})
export class ModalProductPageModule {}

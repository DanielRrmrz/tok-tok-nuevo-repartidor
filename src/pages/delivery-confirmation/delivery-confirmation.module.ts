import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeliveryConfirmationPage } from './delivery-confirmation';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    DeliveryConfirmationPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(DeliveryConfirmationPage),
  ],
})
export class DeliveryConfirmationPageModule { }

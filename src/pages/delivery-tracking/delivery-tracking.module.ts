import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeliveryTrackingPage } from './delivery-tracking';
import { TranslateModule } from '@ngx-translate/core';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';

@NgModule({
  declarations: [
    DeliveryTrackingPage,
  ],
  imports: [
    TranslateModule, IonicPageModule.forChild(DeliveryTrackingPage),
    AgmCoreModule,
    AgmDirectionModule
  ],
})
export class DeliveryTrackingPageModule { }

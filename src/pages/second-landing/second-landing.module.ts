import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SecondLandingPage } from './second-landing';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SecondLandingPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(SecondLandingPage),
  ],
})
export class SecondLandingPageModule { }

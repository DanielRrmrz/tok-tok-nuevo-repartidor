import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FirstLandingPage } from './first-landing';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    FirstLandingPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(FirstLandingPage),
  ],
})
export class FirstLandingPageModule { }

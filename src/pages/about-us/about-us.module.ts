import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AboutUsPage } from './about-us';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AboutUsPage,
  ],
  imports: [
    TranslateModule, IonicPageModule.forChild(AboutUsPage),
  ],
})
export class AboutUsPageModule { }

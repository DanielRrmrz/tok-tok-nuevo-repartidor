import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactPage } from './contact';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ContactPage,
  ],
  imports: [
    TranslateModule, IonicPageModule.forChild(ContactPage),
  ],
})
export class ContactPageModule { }

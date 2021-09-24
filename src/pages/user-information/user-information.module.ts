import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserInformationPage } from './user-information';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    UserInformationPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(UserInformationPage),
  ],
})
export class UserInformationPageModule { }

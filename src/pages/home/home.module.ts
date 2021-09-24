import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
// import { RelativeTime } from "../../pipes/relative-time";
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [HomePage],
  imports: [IonicPageModule.forChild(HomePage), PipesModule]
})
export class HomePageModule {}

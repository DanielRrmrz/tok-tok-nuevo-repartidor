import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GananciasPage } from './ganancias';
// import { RelativeTime } from "../../pipes/relative-time";
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [GananciasPage],
  imports: [IonicPageModule.forChild(GananciasPage), PipesModule]
})
export class GananciasPageModule {}

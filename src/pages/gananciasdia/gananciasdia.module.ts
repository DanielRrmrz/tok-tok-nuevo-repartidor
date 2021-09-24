import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GananciasdiaPage } from './gananciasdia';
// import { RelativeTime } from "../../pipes/relative-time";
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [GananciasdiaPage],
  imports: [IonicPageModule.forChild(GananciasdiaPage), PipesModule]
})
export class GananciasdiaPageModule {}

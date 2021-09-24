import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerminosPage } from './terminos';
// import { RelativeTime } from "../../pipes/relative-time";
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [TerminosPage],
  imports: [IonicPageModule.forChild(TerminosPage), PipesModule]
})
export class GananciasPageModule {}

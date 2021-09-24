import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Chat } from './chat';
import { ChatserviceProvider } from '../../providers/chatservice/chatservice'
import { EmojiPickerComponentModule } from "../../components/emoji-picker/emoji-picker.module";
import { EmojiProvider } from "../../providers/emoji/emoji";
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    Chat
  ],
  imports: [
    EmojiPickerComponentModule,
    IonicPageModule.forChild(Chat),
    PipesModule
  ],
  exports: [
    Chat
  ],
  providers: [
    ChatserviceProvider,
    EmojiProvider
  ]
})
export class ChatModule {
}

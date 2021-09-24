import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavParams, NavController, Platform } from 'ionic-angular';
import { Events, Content } from 'ionic-angular';
import { ChatserviceProvider, ChatMessage, UserInfo } from "../../providers/chatservice/chatservice";
import { NativeStorage } from '@ionic-native/native-storage';

@IonicPage()
@Component({
  selector: "page-chat",
  templateUrl: "chat.html"
})
export class Chat {
  @ViewChild(Content) content: Content;
  @ViewChild("chat_input") messageInput: ElementRef;
  // msgList: ChatMessage[] = [];
  msgList: any;
  user: UserInfo;
  repartidor: any;
  toUser: UserInfo;
  editorMsg = "";
  showEmojiPicker = false;
  userID: any;
  playerIDUser: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private chatService: ChatserviceProvider,
    private events: Events,
    public platform: Platform,
    private nativeStorage: NativeStorage
  ) {
    
      this.userID = localStorage.getItem("idRepartidor");   
      
      this.playerIDUser = navParams.get("playerIDUser");

    // Get the navParams toUserId parameter
    this.toUser = {
      id: navParams.get("toUserId"),
      name: navParams.get("usuario")
    };

    // Get mock user information
    this.chatService.getUserInfo().then(res => {
      this.user = res;
    });

    // Get mock user information
    this.chatService.getRepartidor().then(res => {
      this.repartidor = res;
    });
  }

  ionViewWillLeave() {
    // unsubscribe
    this.events.unsubscribe("chat:received");
  }

  ionViewDidEnter() {
    //get message list
    this.getMsg();

    // Subscribe to received  new message events
    this.events.subscribe("chat:received", msg => {
      this.pushNewMsg(msg);
    });
  }

  onFocus() {
    this.showEmojiPicker = false;
    this.content.resize();
    this.scrollToBottom();
  }

  switchEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
    if (!this.showEmojiPicker) {
      this.focus();
    } else {
      this.setTextareaScroll();
    }
    this.content.resize();
    this.scrollToBottom();
  }

  /**
   * @name getMsg
   * @returns {Promise<ChatMessage[]>}
   */
  getMsg() {
    // Get mock message list
    return this.chatService.getMsgList().subscribe(res => {
      this.msgList = res;
      this.scrollToBottom();
      console.log("Esta es la lista de los mensajes: ", this.msgList);
    });
  }

  /**
   * @name sendMsg
   */
  sendMsg(repa) {
    if (!this.editorMsg.trim()) return;
    // Mock message
    // const id = Date.now().toString();
    let newMsg: ChatMessage = {
      messageId: Date.now().toString(),
      userId: this.user.id,
      userName: this.repartidor.username,
      userAvatar: this.user.avatar,
      toUserId: this.toUser.id,
      time: Date.now(),
      message: this.editorMsg
    };

    this.chatService.enviarMensaje(newMsg);
    this.mensajeChat(this.playerIDUser, repa, this.editorMsg);

    this.pushNewMsg(newMsg);
    this.editorMsg = "";

    if (!this.showEmojiPicker) {
      this.focus();
    }
  }

  mensajeChat(playerIDUser, username, msg) {
    if (this.platform.is("cordova")) {
      let noti = {
        app_id: "0ccc71f1-c7da-49b7-a6a3-9464897ed283",
        include_player_ids: [playerIDUser],
        data: { estatus: "" },
        contents: {
          en: msg
        },
        headings: { en: username }
      };

      window["plugins"].OneSignal.postNotification(
        noti,
        function(successResponse) {
          console.log("Notification Post Success:", successResponse);
        },
        function(failedResponse: any) {
          console.log("Notification Post Failed: ", failedResponse);
        }
      );
    } else {
      console.log("Solo funciona en dispositivos");
    }
  }

  /**
   * @name pushNewMsg
   * @param msg
   */
  pushNewMsg(msg: ChatMessage) {
    const userId = this.user.id,
      toUserId = this.toUser.id;
    // Verify user relationships
    if (msg.userId === userId && msg.toUserId === toUserId) {
      this.msgList.push(msg);
    } else if (msg.toUserId === userId && msg.userId === toUserId) {
      this.msgList.push(msg);
    }
    this.scrollToBottom();
  }

  getMsgIndexById(id: string) {
    return this.msgList.findIndex(e => e.messageId === id);
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400);
  }

  private focus() {
    if (this.messageInput && this.messageInput.nativeElement) {
      this.messageInput.nativeElement.focus();
    }
  }

  private setTextareaScroll() {
    const textarea = this.messageInput.nativeElement;
    textarea.scrollTop = textarea.scrollHeight;
  }

  goBack() {
    this.navCtrl.pop();
  }
}

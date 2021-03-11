import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TwilioService } from '../../services/twilio.service';
import { BaCustomPreLoader } from '../../services/baCustomPreloader.service';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-live-chat',
  templateUrl: './live-chat.component.html',
  styleUrls: ['./live-chat.component.scss']
})
export class LiveChatComponent implements OnInit, OnDestroy {


  @ViewChild('localVideo') localVideo: ElementRef;
  @ViewChild('remoteVideo') remoteVideo: ElementRef;

  public globalConfig = {
    logo: ''
  };

  room_name;
  access_tokan;
  app_id;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpService,
    public twilioService: TwilioService,
    private baCustomPreLoader: BaCustomPreLoader,
    public configService: ConfigService) {
    if (navigator.getUserMedia)
      navigator.getUserMedia({ audio: true, video: true }, function (stream) {
      }, function (error) {
        console.log(error.name + ": " + error.message);
        alert('Seems like we don\'t have access to your camera and microphone or device is not supported.');
      });
    else if (navigator.vendor.match(/[Aa]+pple/g) && navigator.vendor.match(/[Aa]+pple/g).length > 0)
      navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        .then(function () { })
        .catch(function (error) {
          console.log(error.name + ": " + error.message);
          alert('Seems like we don\'t have access to your camera and microphone or device is not supported.');
        });


    this.baCustomPreLoader.show();
    this.route.params.subscribe(params => {
      this.app_id = params['id'];

      const body = {
        bookingId: this.app_id
      };
      this.access_tokan = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTS2EyZDMzM2UzNjAwZmY4ZDg4ODcwZjAyNWZkZTRkMTI5LTE2MTU0OTAzMTUiLCJncmFudHMiOnsiaWRlbnRpdHkiOiJkb2N0b3JzcGxhemEucGJAZ21haWwuY29tIiwidmlkZW8iOnsicm9vbSI6ImNvb2xyb29tIn19LCJpYXQiOjE2MTU0OTAzMTUsImV4cCI6MTYxNTQ5MzkxNSwiaXNzIjoiU0thMmQzMzNlMzYwMGZmOGQ4ODg3MGYwMjVmZGU0ZDEyOSIsInN1YiI6IkFDNmZlZjcwMTQ2MzJiMTQ5NjMwNmI1N2ZkYTA1YjM2NTgifQ.WAC979TEWKZqrnhDAwVmlva-t6QKHFKWfoXYJBdwGMM";
      this.connect();
      // this.httpService.getData('/twilio/getToken', body).subscribe(res => {
      //   // if (res.statusCode === 200) {
      //     // this.room_name = res.data.roomName;
          
      //   // } else {
      //     // this.router.navigate(['thanks']);
      //   // }
      // }, (error) => {
      //   alert('Please try again after sometime.');
      // });
    });

    window.addEventListener('unload', () => {
      this.disconnect();
    })

    this.configService.getJSON().subscribe(data => {
      this.globalConfig = data;
    });
  }
  ngOnInit() {
    this.twilioService.localVideo = this.localVideo;
    this.twilioService.remoteVideo = this.remoteVideo;
  }

  disconnect() {
    if (this.twilioService.roomObj && this.twilioService.roomObj !== null) {
      this.twilioService.roomObj.disconnect();
      this.twilioService.roomObj = null;
    } else this.router.navigate(['thanks']);
  }

  async connect() {
    let accessToken = this.access_tokan;
    var that = this;
    var data = await this.twilioService.getToken("a")
    .subscribe(function(res){
      console.log("Inside subscribe");
      var data = JSON.parse(res._body);
      console.log(data.token);
      that.twilioService.connectToRoom(data.token, {
        name: "coolroom",
        audio: true,
        video: { height: 720, frameRate: 24, width: 1280 },
        bandwidthProfile: {
          video: {
            mode: 'collaboration',
            // maxTracks: 10,
            // dominantSpeakerPriority: 'standard',
            renderDimensions: {
              high: { height: 1080, width: 1980 },
              standard: { height: 720, width: 1280 },
              low: { height: 176, width: 144 }
            }
          }
        },
      })
});
    
  }

  mute() {
    this.twilioService.mute();
  }

  unmute() {
    this.twilioService.unmute();
  }
  ngOnDestroy() {
    this.disconnect();
  }
}

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
      this.httpService.getData('/twilio/getToken', body).subscribe(res => {
        if (res.statusCode === 200) {
          this.room_name = res.data.roomName;
          this.access_tokan = res.data.accessToken;
          this.connect();
        } else {
          this.router.navigate(['thanks']);
        }
      }, (error) => {
        alert('Please try again after sometime.');
      });
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

  connect() {
    let accessToken = this.access_tokan;
    this.twilioService.connectToRoom(accessToken, {
      name: this.room_name,
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

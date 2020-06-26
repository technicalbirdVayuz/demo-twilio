import { Injectable, EventEmitter, ElementRef, Renderer2, RendererFactory2 } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs';
import { connect, createLocalTracks, createLocalVideoTrack } from 'twilio-video';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { BaCustomPreLoader } from './baCustomPreloader.service';


@Injectable()
export class TwilioService {

  remoteVideo: ElementRef;
  localVideo: ElementRef;
  previewing: boolean;
  msgSubject = new BehaviorSubject("");
  roomObj: any;

  roomParticipants;

  private renderer: Renderer2;
  constructor(
    private http: Http,
    private router: Router,
    private rendererFactory: RendererFactory2,
    private baCustomPreLoader: BaCustomPreLoader) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  getToken(username): Observable<any> {
    return this.http.post('/abc', { uid: 'ashish' });
  }


  microphone = true;

  mute() {
    this.roomObj.localParticipant.audioTracks.forEach(function (
      audioTrack
    ) {
      audioTrack.track.disable();
    });

    // var tracks = Array.from(participant.tracks.values());
    // this.roomParticipants.forEach(participant => {
    //   // participant.tracks.forEach(part => {
    //   // participant.on('subscribed', track => {
    //   participant.audioTracks.forEach(function (audioTrack) {
    //     // audioTrack.disable();
    //     audioTrack.track.disable();
    //   });
    //   // });
    //   // });
    // })


    // this.roomParticipants.audioTracks.forEach(function (audioTrack) {
    //   audioTrack.disable();
    // });
    this.microphone = false;
  }


  unmute() {
    this.roomObj.localParticipant.audioTracks.forEach(function (
      audioTrack
    ) {
      audioTrack.track.enable();
    });
    this.microphone = true;
  }


  connectToRoom(accessToken: string, options): void {
    connect(accessToken, options).then(room => {
      this.roomObj = room;

      if (!this.previewing && options['video']) {
        this.startLocalVideo();
        this.previewing = true;
      }

      this.roomParticipants = room.participants;
      room.participants.forEach(participant => {
        // this.msgSubject.next("Already in Room: '" + participant.identity + "'");
        this.attachParticipantTracks(participant);
      });

      room.on('participantDisconnected', (participant) => {
        // this.msgSubject.next("Participant '" + participant.identity + "' left the room");

        this.detachParticipantTracks(participant);
      });

      room.on('participantConnected', (participant) => {
        this.roomParticipants = room.participants;
        this.attachParticipantTracks(participant);
        // participant.tracks.forEach(track => {
        //   this.remoteVideo.nativeElement.appendChild(track.attach());
        // });

        participant.on('trackPublished', track => {

          const element = track.attach();
          this.renderer.data.id = track.sid;
          // this.renderer.setStyle(element, 'width', '65%');
          this.renderer.setStyle(element, 'height', '100%');
          this.renderer.setStyle(element, 'max-width', '100%');
          // this.renderer.setStyle(element, 'margin-left', '2.5%');
          this.renderer.appendChild(this.remoteVideo.nativeElement, element);


          // this.remoteVideo.nativeElement.appendChild(track.attach());

          this.attachVideoClass();
          // document.getElementById('remote-media-div').appendChild(track.attach());
          this.baCustomPreLoader.hide();
        });
      });

      // When a Participant adds a Track, attach it to the DOM.
      room.on('trackPublished', (track, participant) => {
        this.attachTracks([track]);
      });

      // When a Participant removes a Track, detach it from the DOM.
      room.on('trackRemoved', (track, participant) => {
        this.detachTracks([track]);
      });

      room.once('disconnected', room => {
        // this.msgSubject.next('You left the Room:' + room.name);
        room.localParticipant.tracks.forEach(track => {
          track.track.stop();
          const attachedElements = track.track.detach();

          attachedElements.forEach(element => element.remove());
          room.localParticipant.videoTracks.forEach(video => {
            const trackConst = [video][0].track;
            trackConst.stop();  // <- error

            trackConst.detach().forEach(element => element.remove());

            room.localParticipant.unpublishTrack(trackConst);
          });



          let element = this.remoteVideo.nativeElement;
          while (element.firstChild) {
            element.removeChild(element.firstChild);
          }
          let localElement = this.localVideo.nativeElement;
          while (localElement.firstChild) {
            localElement.removeChild(localElement.firstChild);
          }
          this.router.navigate(['thanks']);
          // setTimeout(() => {
          //   window.location.reload();
          // }, 1000)
        });

      });
    }, (error) => {
      // alert(error.message);
      alert('Please try again after sometime.');
    });
  }

  attachParticipantTracks(participant): void {
    // var tracks = Array.from(participant.tracks.values());
    participant.tracks.forEach(part => {
      this.trackPublished(part);
    });
  }

  trackPublished(publication) {
    if (publication.isSubscribed)
      this.attachTracks(publication.track);

    if (!publication.isSubscribed)
      publication.on('subscribed', track => {
        this.attachTracks(track);
      });
    // publication.on('unsubscribed', detachTrack);
  }

  attachTracks(tracks) {
    // tracks.forEach(track => {
    // if (tracks.dimensions && tracks.dimensions.width && tracks.dimensions.height) {

    const element = tracks.attach();
    this.renderer.data.id = tracks.sid;
    // this.renderer.setStyle(element, 'width', '65%');
    this.renderer.setStyle(element, 'height', '100%');
    this.renderer.setStyle(element, 'max-width', '100%');
    // this.renderer.setStyle(element, 'margin-left', '2.5%');
    this.renderer.appendChild(this.remoteVideo.nativeElement, element);
    // this.remoteVideo.nativeElement.appendChild(tracks.attach());
    this.attachVideoClass();
    this.baCustomPreLoader.hide();
    // }
    // });
  }

  startLocalVideo(): void {
    this.roomObj.localParticipant.videoTracks.forEach(publication => {
      const element = publication.track.attach();
      this.renderer.data.id = publication.track.sid;
      this.renderer.setStyle(element, 'width', '25%');
      // this.renderer.setStyle(element, 'margin-left', '2.5%');
      this.renderer.appendChild(this.localVideo.nativeElement, element);


      // const localMediaContainer = document.getElementById('local-media');
      // localMediaContainer.appendChild(publication.track.attach());
    })

    // createLocalVideoTrack({
    //   video: { width: 1280, height: 720 },
    // }).then(track => {
    //   if (this.localVideo) {

    //     const element = track.attach();
    //     this.renderer.data.id = track.sid;
    //     this.renderer.setStyle(element, 'width', '25%');
    //     // this.renderer.setStyle(element, 'margin-left', '2.5%');
    //     this.renderer.appendChild(this.localVideo.nativeElement, element);


    //     // this.localVideo.nativeElement.appendChild(track.attach());
    //     this.attachVideoClass();

    //   }
    // });
  }

  // localPreview(): void {
  //   createLocalVideoTrack().then(track => {
  //     this.localVideo.nativeElement.appendChild(track.attach());
  //     this.attachVideoClass();
  //   });
  // }

  detachParticipantTracks(participant) {
    // var tracks = Array.from(participant.tracks.values());
    this.detachTracks(participant);
  }

  detachTracks(tracks): void {
    tracks.tracks.forEach(track => {
      // track.on('subscribed', singleTrack => {
      //   singleTrack.track.detach();
      //   // this.remoteVideo.nativeElement.remove();

      let element = this.remoteVideo.nativeElement;
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
      // });
    });
  }

  attachVideoClass() {
    let remote = document.getElementById('remote');
    // for (let index = 0; index < remote.getElementsByTagName("video").length; index++) {
    //   if (remote && remote.getElementsByTagName("video")[index])
    //     remote.getElementsByTagName("video")[index].className += " w-75";
    // }
  }
}

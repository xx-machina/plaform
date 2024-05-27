import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, PLATFORM_ID, Pipe, ViewChild, inject, input, signal, viewChild } from '@angular/core';
import { CommonModule, NgIf, NgSwitch, isPlatformBrowser } from '@angular/common';
import { YouTubePlayer } from '@angular/youtube-player';
import { filter, interval } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

@Directive({ standalone: true })
export class VideoSectionOrganismStore {
  readonly src = input<string | MediaStream>();
  readonly autoplay = input(true);
}

@Pipe({standalone: true, name: 'videoId'})
export class VideoIdPipe {
  transform(src: string) {
    return new URL(src).searchParams.get('v') ?? '';
  }
}

@Pipe({standalone: true, name: 'videoType'})
export class VideoTypePipe {
  transform(src: string | MediaStream) {
    if (src instanceof MediaStream) return 'stream';
    if (src.includes('youtube')) return 'youtube';
    return 'video';
  }
}
@Directive({ standalone: true, selector: '[stream]' })
export class StreamDirective {
  protected el = inject(ElementRef);

  @Input()
  set stream(stream: MediaStream) {
    this.el.nativeElement.srcObject = stream;
  }
}

@Component({
  selector: 'organisms-video-section',
  standalone: true,
  imports: [
    CommonModule,
    VideoIdPipe,
    VideoTypePipe,
    YouTubePlayer,
    StreamDirective,
    NgSwitch,
    NgIf,
  ],
  template: `
  @if (store.src() && isPlatformBrowser) {
    @switch (store.src() | videoType) {
      @case ('youtube') {@defer {
        @if (store.src() | videoId) {
          <youtube-player [videoId]="store.src() | videoId" />
        }
      } }
      @case ('stream') { @defer {
        <video #video controls width="100%" [stream]="store.src()" [autoplay]="store.autoplay()"></video>
      } }
      @case ('video') { @defer {
        <video #video controls width="100%" playsinline [src]="store.src()" [autoplay]="store.autoplay()"></video>
      } }
    }
  }
  `,
  styleUrls: ['./video-section.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: VideoSectionOrganismStore,
      inputs: ['src', 'autoplay'],
    },
  ]
})
export class VideoSectionOrganism {
  protected readonly store = inject(VideoSectionOrganismStore);
  protected readonly width = signal(0);
  protected readonly el = inject(ElementRef);
  protected readonly platformId = inject(PLATFORM_ID);
  protected readonly isPlatformBrowser = isPlatformBrowser(this.platformId);

  readonly youtubePlayer = viewChild(YouTubePlayer);
  readonly youtubePlayer$ = toObservable(this.youtubePlayer);
  readonly video = viewChild<ElementRef<HTMLVideoElement>>('video');

  videoHeight: number | undefined;
  videoWidth: number | undefined;

  readonly interval$ = interval(100);

  ngAfterViewInit(): void {
    if (this.isPlatformBrowser) {
      this.youtubePlayer$.pipe(
        filter((player) => !!player),
      ).subscribe((player) => {
        player.width = '100%' as never as number;
      });
    }
  }
}

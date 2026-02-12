'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Music, ChevronDown, Sparkles, ExternalLink, Star, Volume2, Play } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  category: string;
  lessonName: string;
  lyrics: string;
  buttonLink?: string;
}

const extractTikTokId = (raw: string): string | null => {
  if (!raw) return null;
  const m1 = raw.match(/\/video\/(\d{10,25})/);
  if (m1?.[1]) return m1[1];
  const m2 = raw.match(/\/embed\/v2\/(\d{10,25})/);
  if (m2?.[1]) return m2[1];
  const m3 = raw.match(/\/player\/v1\/(\d{10,25})/);
  if (m3?.[1]) return m3[1];
  const m4 = raw.match(/(\d{10,25})/);
  return m4?.[1] ?? null;
};

const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;
  const short = url.match(/youtu\.be\/(.+?)(\?|$)/);
  if (short?.[1]) return short[1];
  const vParam = url.match(/[?&]v=([^&]+)/);
  if (vParam?.[1]) return vParam[1];
  const embed = url.match(/\/embed\/(.+?)(\?|$)/);
  if (embed?.[1]) return embed[1];
  return null;
};

type TikTokMessage<T = unknown> = {
  'x-tiktok-player'?: boolean;
  type?: string;
  value?: T;
};

const TT_ORIGIN = 'https://www.tiktok.com';

const VideoPlayerSection = ({ videoUrl, category, lessonName, lyrics, buttonLink }: VideoPlayerProps) => {
  const [isScriptOpen, setIsScriptOpen] = useState(true);

  // TikTok states
  const [ttReady, setTtReady] = useState(false);
  const [ttPlaying, setTtPlaying] = useState(false);
  const [ttMuted, setTtMuted] = useState(true);

  // Overlays
  const [showTapToPlayOverlay, setShowTapToPlayOverlay] = useState(false);
  const [showSoundButton, setShowSoundButton] = useState(true); // <-- nút bật tiếng (chỉ hiện 1 lần)

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const playingRef = useRef(false);

  const isTikTok = useMemo(() => {
    return !!videoUrl && (videoUrl.includes('tiktok.com') || videoUrl.includes('vt.tiktok.com'));
  }, [videoUrl]);

  const isYouTube = useMemo(() => {
    return !!videoUrl && (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'));
  }, [videoUrl]);

  const embedSrc = useMemo(() => {
    if (!videoUrl) return '';

    if (isYouTube) {
      const id = extractYouTubeId(videoUrl);
      if (!id) return '';
      return `https://www.youtube.com/embed/${id}?autoplay=0`;
    }

    if (isTikTok) {
      const id = extractTikTokId(videoUrl);
      if (!id) return '';
      return `https://www.tiktok.com/player/v1/${id}?controls=1&autoplay=1&description=0&music_info=0`;
    }

    return videoUrl;
  }, [videoUrl, isTikTok, isYouTube]);

  const postToTikTok = (msg: TikTokMessage) => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    win.postMessage({ ...msg, 'x-tiktok-player': true }, TT_ORIGIN);
  };

  const enableSound = () => {
    if (!ttReady) return;

    // ✅ Yêu cầu của bạn: bấm là biến mất NGAY
    setShowSoundButton(false);

    postToTikTok({ type: 'unMute', value: undefined });
    postToTikTok({ type: 'play', value: undefined });
    setTtMuted(false);
  };

  const handleTapPlay = () => {
    postToTikTok({ type: 'play', value: undefined });
    setShowTapToPlayOverlay(false);
  };

  useEffect(() => {
    // reset when url changes
    setTtReady(false);
    setTtPlaying(false);
    setTtMuted(true);
    setShowTapToPlayOverlay(false);
    setShowSoundButton(true); // reset nút bật tiếng khi đổi video
    playingRef.current = false;

    if (!isTikTok) return;

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== TT_ORIGIN) return;

      let data: TikTokMessage | null = null;

      if (typeof event.data === 'string') {
        try {
          data = JSON.parse(event.data);
        } catch {
          data = null;
        }
      } else if (typeof event.data === 'object' && event.data) {
        data = event.data as TikTokMessage;
      }

      if (!data || data['x-tiktok-player'] !== true) return;

      if (data.type === 'onPlayerReady') {
        setTtReady(true);

        // autoplay ổn định: mute -> play
        postToTikTok({ type: 'mute', value: undefined });
        postToTikTok({ type: 'play', value: undefined });
        setTtMuted(true);

        // Nếu autoplay bị chặn, hiện overlay "Chạm để phát"
        window.setTimeout(() => {
          if (!playingRef.current) setShowTapToPlayOverlay(true);
        }, 1200);
      }

      if (data.type === 'onStateChange') {
        const state = Number(data.value); // -1 init, 0 ended, 1 playing, 2 paused, 3 buffering
        if (state === 1) {
          playingRef.current = true;
          setTtPlaying(true);
          setShowTapToPlayOverlay(false);
        } else if (state === 2 || state === 0) {
          playingRef.current = false;
          setTtPlaying(false);
        }
      }

      if (data.type === 'onMute') {
        const muted = Boolean(data.value);
        setTtMuted(muted);
        // Nếu vì lý do nào đó player đã unmute, cũng ẩn nút luôn
        if (!muted) setShowSoundButton(false);
      }
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTikTok, videoUrl]);

  return (
    <section className="pt-20 pb-12 md:pt-24 md:pb-16 relative z-10 w-full bg-gradient-to-b from-[#D93838] to-[#B91C1C] overflow-hidden rounded-b-[40px] md:rounded-b-[60px] shadow-2xl">
      <div className="absolute inset-0 bg-[url('/images/ME-2.jpg')] opacity-10 pointer-events-none bg-cover bg-center"></div>

      <div className="absolute top-10 left-10 text-white/10 animate-pulse delay-700">
        <Star size={40} fill="currentColor" />
      </div>
      <div className="absolute top-20 right-10 text-yellow-400/20 animate-bounce">
        <Star size={24} fill="currentColor" />
      </div>

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="text-center mb-6 md:mb-10 text-white">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-yellow-200 text-[10px] md:text-xs font-bold uppercase mb-4 shadow-sm">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
            <span className="tracking-wider">{category}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold leading-tight drop-shadow-md">{lessonName}</h1>
        </div>

        {/* Video frame */}
        <div
          className={`
            relative shadow-2xl mb-8 bg-black rounded-2xl md:rounded-3xl mx-auto overflow-hidden
            border-[6px] border-white/20
            ${isTikTok ? 'w-full max-w-[320px] md:max-w-[340px] aspect-[9/16]' : 'w-full aspect-video'}
          `}
        >
          {embedSrc ? (
            <>
              <iframe
                ref={iframeRef}
                src={embedSrc}
                className="w-full h-full"
                scrolling="no"
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
                sandbox={isTikTok ? undefined : 'allow-scripts allow-same-origin allow-popups allow-presentation'}
                title="Video Player"
                style={{ border: 'none' }}
              />

              {/* Autoplay bị chặn */}
              {isTikTok && showTapToPlayOverlay && (
                <button
                  type="button"
                  onClick={handleTapPlay}
                  className="absolute inset-0 z-20 flex items-center justify-center bg-black/35 backdrop-blur-[1px]"
                >
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#D93838] font-extrabold shadow-xl">
                    <Play className="w-4 h-4" /> Chạm để phát
                  </span>
                </button>
              )}

              {/* ✅ CHỈ 1 NÚT BẬT TIẾNG - NẰM GIỮA - BẤM XONG BIẾN MẤT */}
              {isTikTok && ttReady && ttPlaying && ttMuted && !showTapToPlayOverlay && showSoundButton && (
                <button
                  type="button"
                  onClick={enableSound}
                  className="absolute inset-0 z-20 flex items-center justify-center bg-black/35 backdrop-blur-[1px]"
                  title="Bật tiếng"
                >
                  <span className="inline-flex items-center gap-3 px-7 py-3 rounded-full bg-white text-[#D93838] text-sm md:text-base font-extrabold shadow-2xl border border-white/60">
                    <Volume2 className="w-5 h-5" />
                    BẬT TIẾNG
                  </span>
                </button>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-6 text-center text-white/90">
              <p className="text-sm md:text-base font-semibold">Không thể nhúng video từ link này.</p>
              <p className="text-xs md:text-sm text-white/70">
                Hãy dán link TikTok dạng <span className="font-mono">.../video/123...</span> (không phải link rút gọn).
              </p>
              {videoUrl ? (
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#D93838] font-bold"
                >
                  Mở trên TikTok <ExternalLink className="w-4 h-4" />
                </a>
              ) : null}
            </div>
          )}
        </div>

        {/* CTA button */}
        {buttonLink && (
          <div className="flex justify-center mb-8">
            <a
              href={buttonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="
                group relative inline-flex items-center justify-center gap-3 
                px-8 py-3 md:px-10 md:py-4 text-sm md:text-base font-bold text-[#D93838] transition-all duration-300 
                bg-white border-b-4 border-slate-200 rounded-full 
                shadow-xl hover:-translate-y-1 hover:shadow-2xl hover:bg-yellow-50
              "
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 md:w-6 md:h-6 text-[#ff0050] group-hover:animate-pulse"
              >
                <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.6 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
              </svg>
              <span>HÃY FOLLOW KÊNH MOMTEK’S SONG</span>
              <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        )}

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center my-6">
          <p className="text-white text-[10px] md:text-sm text-center leading-relaxed italic">
            Momtek&apos;s Song là kênh Tiktok chuyên các nội dung học tiếng Anh qua bài hát. Vui, đơn giản, hiệu quả.
            <br />
            Kênh được Thầy Hoàng Tăng Đức và cô Mai Linh thẩm định nội dung.
          </p>
        </div>

        {/* Lyrics */}
        <div className="bg-white/95 backdrop-blur rounded-2xl md:rounded-b-3xl shadow-xl overflow-hidden transition-all duration-300 border border-white/20">
          <button
            onClick={() => setIsScriptOpen(!isScriptOpen)}
            className="w-full px-5 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition border-b border-slate-100"
          >
            <span className="text-sm md:text-base font-extrabold text-[#D93838] flex items-center gap-3 uppercase tracking-wide">
              <div className="p-1.5 bg-red-50 rounded-lg">
                <Music className="w-5 h-5 text-[#D93838]" />
              </div>
              <span>Lời bài hát / Nội dung</span>
            </span>
            <div
              className={`p-1 rounded-full bg-slate-100 transition-transform duration-300 ${
                isScriptOpen ? 'rotate-180 bg-red-100 text-[#D93838]' : ''
              }`}
            >
              <ChevronDown className="w-5 h-5" />
            </div>
          </button>

          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              isScriptOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="p-6 bg-slate-50/50 text-sm md:text-base text-slate-700 leading-relaxed overflow-y-auto max-h-80 whitespace-pre-line font-medium custom-scrollbar">
              {lyrics || 'Đang cập nhật lời bài hát...'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoPlayerSection;

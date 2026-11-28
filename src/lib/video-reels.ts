/**
 * Vertical films shown as a full-width row on a service page. Videos are
 * hosted on YouTube (Shorts) and only load when a visitor plays one; the
 * card itself is a local poster, so nothing is requested from YouTube first.
 *
 * To add a film: put a 9:16 poster (about 720×1280) in /public/images/reels/
 * and set youtubeId to the ID from the Shorts link
 * (youtube.com/shorts/<ID>). Entries with youtubeId: null stay hidden, and
 * with none set the row doesn't render at all.
 */

export interface VideoReel {
  title: string;
  /** Small line under the title, e.g. the client or the format. */
  subtitle: string;
  poster: string;
  youtubeId: string | null;
  /** A horizontal (16:9) video: the card stays vertical, the player opens wide. */
  landscape?: boolean;
}

export const videoReels: Record<string, VideoReel[]> = {
  "photo-video-production": [
    { title: "The Drain Team", subtitle: "Neex Creative", poster: "/images/reels/the-drain-team.jpg", youtubeId: "nb4GjfFt_PU" },
    { title: "FT Transfer", subtitle: "Neex Creative", poster: "/images/reels/ft-transfer.jpg", youtubeId: "O_t18jfoAZA" },
    { title: "Marilia & Christopher", subtitle: "Wedding film", poster: "/images/reels/marilia-christopher.jpg", youtubeId: "P0I8GXjcOdU", landscape: true },
    { title: "Mini Bailarina", subtitle: "Neex Creative", poster: "/images/reels/mini-bailarina.jpg", youtubeId: "idkB31i1x2c" },
    { title: "Bumblebee", subtitle: "Charity car presentation", poster: "/images/reels/bumblebee.jpg", youtubeId: "fD_dJXK_GHQ" },
    { title: "Prepay Power", subtitle: "Promo video", poster: "/images/reels/prepay-power.jpg", youtubeId: "6PI09c0MWUo", landscape: true },
    { title: "ITBA", subtitle: "Live event 2022", poster: "/images/reels/itba.jpg", youtubeId: "kvtbAeaff_A", landscape: true },
    { title: "Conexim", subtitle: "Live event", poster: "/images/reels/conexim.jpg", youtubeId: "VYs_O37GAwE", landscape: true },
    { title: "Diageo", subtitle: "Christmas party", poster: "/images/reels/diageo-christmas.jpg", youtubeId: "5rvO1f0cWlo", landscape: true },
  ],
};

export type PlayableReel = VideoReel & { youtubeId: string };

/** The films on a page that can actually play. */
export function playableReels(slug: string): PlayableReel[] {
  return (videoReels[slug] ?? []).filter((reel): reel is PlayableReel => !!reel.youtubeId);
}

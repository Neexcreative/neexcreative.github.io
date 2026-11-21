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
}

export const videoReels: Record<string, VideoReel[]> = {
  "photo-video-production": [
    { title: "The King", subtitle: "Stage visual", poster: "/images/projects/project-05.png", youtubeId: null },
    { title: "Gym+Coffee", subtitle: "Event stand", poster: "/images/case-studies/gym-coffee-bespoke-stand/03-counter.webp", youtubeId: null },
    { title: "Revival", subtitle: "Youth conference", poster: "/images/case-studies/revival-youth-conference/01-poster.webp", youtubeId: null },
    { title: "Behind the lens", subtitle: "Neex Creative", poster: "/images/blog/cover-six-second-rule-2.jpg", youtubeId: null },
    { title: "Venues 3D", subtitle: "Motion design", poster: "/images/projects/project-08.png", youtubeId: null },
    { title: "Plaza", subtitle: "Car wash brand film", poster: "/images/projects/project-06.png", youtubeId: null },
  ],
};

export type PlayableReel = VideoReel & { youtubeId: string };

/** The films on a page that can actually play. */
export function playableReels(slug: string): PlayableReel[] {
  return (videoReels[slug] ?? []).filter((reel): reel is PlayableReel => !!reel.youtubeId);
}

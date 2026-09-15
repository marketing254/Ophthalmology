export const metadata = {
  title: 'Webinar Replays, On-Demand Library',
  description:
    'Watch full-length ophthalmology business webinar replays on demand, free: sessions on practice growth, marketing, operations and technology from leading practices.',
  alternates: { canonical: '/webinars/replays/' },
  openGraph: {
    url: '/webinars/replays/',
    title: 'Webinar Replays',
    description: 'The on-demand library of past OB Academy sessions.',
    images: [{ url: '/og/replays.png', width: 1200, height: 630, alt: 'Webinar Replays' }],
  },
};

export default function Layout({ children }) {
  return children;
}

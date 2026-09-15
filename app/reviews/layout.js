export const metadata = {
  title: 'Reviews and Testimonials',
  description:
    'What ophthalmologists, administrators and practice teams say about the Ophthalmology Business Academy podcast, live panels and resources.',
  alternates: { canonical: '/reviews/' },
  openGraph: {
    url: '/reviews/',
    title: 'Reviews',
    description: 'What ophthalmologists and practice teams say about OB Academy.',
    images: [{ url: '/og/reviews.png', width: 1200, height: 630, alt: 'Reviews' }],
  },
};

export default function Layout({ children }) {
  return children;
}

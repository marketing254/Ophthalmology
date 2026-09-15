export const metadata = {
  title: 'Live Ophthalmology Business Webinars',
  description:
    'Free live webinars and expert panels for ophthalmology practice owners and administrators: patient acquisition, dry eye revenue, AI diagnostics and more. Reserve a seat.',
  alternates: { canonical: '/webinars/' },
  openGraph: {
    url: '/webinars/',
    title: 'Live Ophthalmology Business Webinars',
    description: 'Free live webinars and expert panels for eye-care practice leaders. Reserve a seat.',
    images: [{ url: '/og/webinars.png', width: 1200, height: 630, alt: 'Live Ophthalmology Business Webinars' }],
  },
};

export default function Layout({ children }) {
  return children;
}

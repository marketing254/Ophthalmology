export const metadata = {
  title: 'Free Practice Growth Resources',
  description:
    'Free playbooks, guides and checklists for growing an ophthalmology practice: patient journey audits, premium IOL scripts, marketing ROI checklists and more.',
  alternates: { canonical: '/resources/' },
  openGraph: {
    url: '/resources/',
    title: 'Playbooks and Resources',
    description: 'Free playbooks, guides, and checklists for growing an ophthalmology practice.',
    images: [{ url: '/og/resources.png', width: 1200, height: 630, alt: 'Playbooks and Resources' }],
  },
};

export default function Layout({ children }) {
  return children;
}

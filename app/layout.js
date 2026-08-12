import { Outfit, DM_Sans } from 'next/font/google';
import './globals.css';
import './dynamic.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import CardTilt from '@/components/CardTilt';

// Fresh type system: Outfit for headings, DM Sans for body/UI.
const display = Outfit({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const body = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  title: {
    default: 'Ophthalmology Business Academy',
    template: '%s | Ophthalmology Business Academy',
  },
  description:
    'Live expert panels, a 75-episode podcast, and practical playbooks on the business of ophthalmology. Free membership for practice owners, surgeons, administrators, and COEs.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <ScrollReveal />
        <CardTilt />
      </body>
    </html>
  );
}

import Link from 'next/link';
import BrandIcon from './BrandIcon';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function Footer() {
  return (
    <footer className="site">
      <div className="wrap">
        <div className="f-grid">
          <div className="f-brand">
            <Link className="logo" href="/">
              <img src={`${BASE}/logo.svg`} alt="Ophthalmology Business Academy" width="185" height="52" />
            </Link>
            <p>
              The business education platform for ophthalmology practice owners, surgeons,
              administrators, and COEs across the US and Canada.
            </p>
            <div className="f-social">
              <a href="https://www.facebook.com/Opthos/" aria-label="Facebook"><BrandIcon type="facebook" size={16} /></a>
              <a href="https://www.instagram.com/ophthalmology_business_podcast/" aria-label="Instagram"><BrandIcon type="instagram" size={16} /></a>
              <a href="https://www.linkedin.com/company/ophthalmology-business-academy/" aria-label="LinkedIn"><BrandIcon type="linkedin" size={16} /></a>
            </div>
          </div>

          <div className="f-col">
            <h4>Learn</h4>
            <Link href="/podcast">Podcast episodes</Link>
            <Link href="/webinars">Upcoming webinars</Link>
            <Link href="/webinars/replays">Webinar replays</Link>
            <Link href="/resources">Resources</Link>
          </div>

          <div className="f-col">
            <h4>Academy</h4>
            <Link href="/about">About OB Academy</Link>
            <Link href="/reviews">Reviews</Link>
            <Link href="/marketing">Marketing strategy meeting</Link>
          </div>

          <div className="f-col">
            <h4>Contact</h4>
            <a href="mailto:team@obacademy.org">team@obacademy.org</a>
            <Link href="/contact">Contact form</Link>
            <Link href="/marketing">Book a free meeting</Link>
          </div>
        </div>

        <div className="f-bottom">
          <span>© 2026 Ophthalmology Business Academy. All rights reserved.</span>
          <span>
            <Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

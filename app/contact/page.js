import Link from 'next/link';
import ContactForm from './ContactForm';
import SceneImage from '@/components/SceneImage';
import './contact.css';

export const metadata = {
  title: 'Contact',
  description:
    'Get in touch with the Ophthalmology Business Academy team, questions about the podcast, live panels, membership, or applying to be a guest.',
};

export default function ContactPage() {
  return (
    <>
      {/* Split header */}
      <section className="page-hero">
        <div className="wrap">
          <div className="crumbs">
            <Link href="/">Home</Link> &nbsp;/&nbsp; Contact
          </div>
          <span className="eyebrow">Contact</span>
          <h1>Let&apos;s talk.</h1>
          <p>
            Questions about the podcast, a live panel, membership, or partnering with the academy?
            Send a note, a real person on our team reads every message.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="contact">
        <div className="wrap">
          <div className="contact-grid">
            {/* Form */}
            <ContactForm />

            {/* Info */}
            <div>
              <div className="img-frame contact-img">
                <SceneImage
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=70"
                  alt="Team responding to messages in a bright office"
                />
              </div>
              <div className="info-card">
                <h3>Reach us directly</h3>
                <div className="info-item">
                  <div className="ic">
                    <svg viewBox="0 0 24 24">
                      <path d="M4 4h16v16H4z" fill="none" />
                      <path d="M22 6 12 13 2 6" />
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                    </svg>
                  </div>
                  <div>
                    <div className="lbl">Email</div>
                    <div className="val">
                      <a href="mailto:team@obacademy.org">team@obacademy.org</a>
                    </div>
                  </div>
                </div>
                <div className="info-item">
                  <div className="ic">
                    <svg viewBox="0 0 24 24">
                      <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <div className="lbl">Mailing address</div>
                    <div className="val">
                      303 Pinetree Way
                      <br />
                      Mississauga, Ontario
                      <br />
                      L5G 2R4, Canada
                    </div>
                  </div>
                </div>
                <div className="info-item">
                  <div className="ic">
                    <svg viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <div>
                    <div className="lbl">Typical reply time</div>
                    <div className="val">Within 1 business day</div>
                  </div>
                </div>
                <div className="info-socials">
                  <a href="https://www.facebook.com/Opthos/" aria-label="Facebook">
                    <svg viewBox="0 0 24 24">
                      <path d="M13.5 9H16l.5-3h-3V4.5c0-.9.3-1.5 1.6-1.5H16.6V.2C16.3.2 15.3 0 14.1 0 11.6 0 10 1.5 10 4.2V6H7v3h3v9h3.5V9z" />
                    </svg>
                  </a>
                  <a href="https://www.linkedin.com/company/ophthalmology-business-academy/" aria-label="LinkedIn">
                    <svg viewBox="0 0 24 24">
                      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.2 8.4h4.6V23H.2V8.4zm7.4 0h4.4v2h.1c.6-1.1 2.1-2.3 4.3-2.3 4.6 0 5.5 3 5.5 7V23h-4.6v-6.9c0-1.7 0-3.8-2.3-3.8s-2.7 1.8-2.7 3.7V23H7.6V8.4z" />
                    </svg>
                  </a>
                  <a href="https://www.instagram.com/ophthalmology_business_podcast/" aria-label="Instagram">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2M12 0C8.7 0 8.3 0 7 .1 5.7.2 4.8.4 4 .7c-.8.3-1.5.8-2.2 1.4C1.1 2.8.7 3.5.4 4.3c-.3.8-.5 1.7-.6 3C-.3 8.6 0 9 0 12.3s0 3.7.1 5c.1 1.3.3 2.2.6 3 .3.8.8 1.5 1.4 2.2.7.7 1.4 1.1 2.2 1.4.8.3 1.7.5 3 .6 1.3.1 1.7.1 5 .1s3.7 0 5-.1c1.3-.1 2.2-.3 3-.6.8-.3 1.5-.8 2.2-1.4.7-.7 1.1-1.4 1.4-2.2.3-.8.5-1.7.6-3 .1-1.3.1-1.7.1-5s0-3.7-.1-5c-.1-1.3-.3-2.2-.6-3-.3-.8-.8-1.5-1.4-2.2C21.2 1.5 20.5 1 19.7.7c-.8-.3-1.7-.5-3-.6C15.4 0 15 0 11.7 0h.3zm0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.8-10.4a1.4 1.4 0 1 1-2.9 0 1.4 1.4 0 0 1 2.9 0z" />
                    </svg>
                  </a>
                  <a href="mailto:team@obacademy.org" aria-label="Email">
                    <svg viewBox="0 0 24 24">
                      <path d="M2 4h20a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zm10 8.7L3.6 6v12h16.8V6L12 12.7zM4.5 6l7.5 6 7.5-6h-15z" />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="guest">
                <h3>Want to be on the show?</h3>
                <p>
                  We&apos;re always looking for surgeons, administrators, and operators with a story
                  worth sharing. Tell us about you.
                </p>
                <a
                  className="btn"
                  href="https://docs.google.com/forms/d/e/1FAIpQLSf8qy7abOQndUrj8S0XtECi96GfxLFCO9JVfu4Vhky9_F8JIw/viewform"
                >
                  Apply to be a guest
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick help strip */}
      <section className="hours">
        <div className="wrap">
          <div className="hours-grid">
            <div className="hours-card">
              <div className="ic">
                <svg viewBox="0 0 24 24">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                </svg>
              </div>
              <h3>Podcast questions</h3>
              <p>
                Episode topics, guest suggestions, or where to listen? Use the form and choose{' '}
                <b>The podcast</b>.
              </p>
            </div>
            <div className="hours-card">
              <div className="ic">
                <svg viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </div>
              <h3>Panels &amp; events</h3>
              <p>
                Can&apos;t access a registration link or replay? We&apos;ll get you sorted before the
                next live session.
              </p>
            </div>
            <div className="hours-card">
              <div className="ic">
                <svg viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h3>Membership &amp; account</h3>
              <p>
                Trouble logging in or updating your details? Email <b>team@obacademy.org</b> and
                we&apos;ll help fast.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

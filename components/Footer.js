import Link from 'next/link';
import BrandIcon from './BrandIcon';
import NewsletterForm from './NewsletterForm';
import { SparkleIcon, ChatGPTIcon, ClaudeIcon, GeminiIcon, GrokIcon } from './AiIcons';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.obacademy.org';

// "Get an AI summary" prompt (from the UI draft): sent prefilled to each chat.
const AI_PROMPT = `I'm exploring the **Ophthalmology Business Academy (OBA)** and want to understand how it could actually help me as an ophthalmologist, ophthalmology practice owner, administrator, or practice leader.

Visit and review:

**${SITE_URL}/**

Then explain OBA to me in practical, straightforward terms.

I don't just want a summary of the website. Help me understand **what OBA can actually do for me and my practice.**

Please explain:

1. **What is Ophthalmology Business Academy?**
2. **What can I get from OBA?** (podcast episodes, live expert panels, webinars, practice-growth resources, newsletter)
3. **What kinds of practice problems can OBA help me think through?** (growth, profitability, marketing, patient experience, staffing, operations, technology and AI, leadership, ownership)
4. **What would participating actually look like?**
5. **Why OBA instead of generic business content?**
6. **Where should I start?** Recommend the most relevant OBA content or next step for me.

If possible, briefly ask me what my biggest challenge is right now, then tailor your recommendations around my answer.

### Important

Use **${SITE_URL}/** as your primary source (see also ${SITE_URL}/llms.txt). Prioritize information that is clearly about the Ophthalmology Business Academy. Do not invent programs, pricing, memberships, guarantees, events, services, or benefits that you cannot verify.

At the end, give me:

**My OBA Starting Point**

* The biggest way OBA could potentially help me
* The first resource or action I should explore
* A direct OBA link where possible`;

const AI_PROVIDERS = [
  { name: 'ChatGPT', chatUrl: 'https://chatgpt.com/', Icon: ChatGPTIcon },
  { name: 'Claude', chatUrl: 'https://claude.ai/new', Icon: ClaudeIcon },
  { name: 'Gemini', chatUrl: 'https://gemini.google.com/app', Icon: GeminiIcon },
  { name: 'Grok', chatUrl: 'https://grok.com/', Icon: GrokIcon },
];

export default function Footer() {
  return (
    <footer className="site">
      {/* Newsletter band, the site's sign-up surface */}
      <div className="f-news" id="newsletter">
        <div className="wrap">
          <div>
            <h2>Insight for ophthalmology practice leaders</h2>
            <p>New conversations, practical resources, and event invitations, straight to your inbox.</p>
          </div>
          <NewsletterForm />
        </div>
      </div>

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
            <h4>Resources</h4>
            <Link href="/resources">Free Resources</Link>
            <Link href="/webinars">Events</Link>
            <Link href="/feed.xml">Podcast RSS</Link>
          </div>

          <div className="f-col">
            <h4>Podcast</h4>
            <Link href="/podcast">All Episodes</Link>
            <Link href="/about#team">Hosts</Link>
          </div>

          <div className="f-col">
            <h4>Academy</h4>
            <Link href="/about">About</Link>
            <Link href="/guest-speaker">Become a Speaker</Link>
            <Link href="/marketing">Marketing Analysis</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </div>

      {/* AI summary band */}
      <div className="f-ai" id="ai-summary">
        <div className="wrap">
          <p className="f-ai-label">
            <SparkleIcon width="16" height="16" />
            Get an AI summary of Ophthalmology Business Academy
          </p>
          <ul>
            {AI_PROVIDERS.map(({ name, chatUrl, Icon }) => (
              <li key={name}>
                <a
                  href={`${chatUrl}?q=${encodeURIComponent(AI_PROMPT)}`}
                  aria-label={`Get an AI summary with ${name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon width="20" height="20" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="wrap">
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

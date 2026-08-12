// ===========================================================================
//  OB Academy, normalisers: map raw Sheet rows into clean view-model objects.
//  Column names below match the LIVE workbook exactly (verified via gviz).
// ===========================================================================
import {
  pick, slugify, formatDate, formatDuration, driveImg, parseSpeakers, parseContact,
  parseDescription, vimeoEmbed, vimeoId, classifyAudio, iframeSrc,
} from './sheets';

// Tab "podcats": episode,date_published,title,guest_name,guest_photo_url,
//   category,description,contact_info,poster_image,audio_source,transcript_url,episode_url
export function normalizePodcast(row, i = 0) {
  const episode = pick(row, ['episode']);
  const title = pick(row, ['title']) || `Episode ${episode || i + 1}`;
  const episodeUrl = pick(row, ['episode_url']);
  const episodeEmbed = iframeSrc(episodeUrl);
  const audioSource = pick(row, ['audio_source']);
  return {
    episode,
    epNum: parseInt(episode, 10) || 0,
    title,
    slug: slugify(title),
    guestName: pick(row, ['guest_name']),
    guestPhoto: driveImg(pick(row, ['guest_photo_url']), 'w800'),
    poster: driveImg(pick(row, ['poster_image']), 'w1200'),
    category: pick(row, ['category']),
    dateLabel: formatDate(pick(row, ['date_published'])),
    description: pick(row, ['description']),
    audioSource,
    episodeEmbed,                 // iframe src extracted from episode_url, if any
    episodeUrl: episodeEmbed ? '' : (/^https?:/.test(episodeUrl) ? episodeUrl : ''),
    audioKind: episodeEmbed ? 'embed' : classifyAudio(audioSource),
    transcriptUrl: pick(row, ['transcript_url']),
    contact: parseContact(pick(row, ['contact_info'])),
    speakers: [],
    isPanel: false,
    speakerPhotos: [],
  };
}

// Tab "webinar-replays": date,duration,category,title,subtitle,vimeo_url,
//   image_url,summary,description,transcript
export function normalizeWebinar(row, i = 0) {
  const title = pick(row, ['title']) || `Webinar Replay ${i + 1}`;
  const vimeoLink = pick(row, ['vimeo_url']);
  const summary = pick(row, ['summary', 'description']);
  const parsed = parseDescription(summary);
  return {
    id: slugify(title),
    slug: slugify(title),
    title,
    subtitle: pick(row, ['subtitle']),
    dateRaw: pick(row, ['date']),
    dateLabel: formatDate(pick(row, ['date'])),
    duration: formatDuration(pick(row, ['duration'])),
    category: pick(row, ['category']),
    thumbnail: driveImg(pick(row, ['image_url']), 'w800'),
    summary,
    notes: parsed.keyPoints,
    noteGroups: parsed.keyPointGroups || [],
    vimeoLink,
    embedUrl: vimeoEmbed(vimeoLink),
    vimeoId: vimeoId(vimeoLink),
    transcriptUrl: pick(row, ['transcript']),
    speakers: '',
    speakersList: [],
  };
}

// Tab "webinars" (upcoming live sessions / events):
//   date_iso,day,month_year,time,title,description,register_url,Panelists,image_urls
export function normalizeEvent(row, i = 0) {
  const titleRaw = pick(row, ['title', 'name']) || 'Upcoming Session';
  const [title, ...subParts] = titleRaw.split('\n').map((s) => s.trim()).filter(Boolean);
  return {
    id: slugify(title || `event-${i}`),
    title: title || titleRaw,
    subtitle: subParts.join(' '),
    dateRaw: pick(row, ['date_iso', 'date']),
    day: pick(row, ['day']),
    monthYear: pick(row, ['month_year', 'month']),
    time: pick(row, ['time']),
    description: pick(row, ['description', 'agenda']),
    panelists: (pick(row, ['Panelists', 'panelists', 'speakers']) || '')
      .split(/[\n|]/).map((s) => s.trim()).filter(Boolean),
    registerUrl: pick(row, ['register_url', 'register', 'url']),
    category: pick(row, ['category', 'type']),
  };
}

// Tab "reviews": reviewer_name,firm_name,date,rating,review_text,platform,photo_url
export function normalizeReview(row) {
  return {
    name: pick(row, ['reviewer_name', 'name']),
    firm: pick(row, ['firm_name', 'practice_name', 'firm', 'practice', 'role']),
    rating: parseInt(pick(row, ['rating', 'stars']), 10) || 5,
    text: pick(row, ['review_text', 'review', 'text', 'quote']),
    platform: pick(row, ['platform', 'source']),
    photo: driveImg(pick(row, ['photo_url', 'photo']), 'w200'),
    dateLabel: formatDate(pick(row, ['date'])),
  };
}

// Tab "resources": categories,title,description,author,tags,pdf_url
export function normalizeResource(row, i = 0) {
  const title = pick(row, ['title', 'name']) || `Resource ${i + 1}`;
  const cat = pick(row, ['categories', 'category', 'topic']) || 'Guide';
  return {
    id: slugify(title),
    title,
    category: cat,
    type: cat,                    // the sheet's "categories" doubles as the format label
    description: pick(row, ['description', 'summary', 'excerpt']),
    author: pick(row, ['author', 'by']).replace(/\s+/g, ' ').trim(),
    readTime: pick(row, ['read_time', 'duration', 'length']),
    tags: (pick(row, ['tags', 'tag']) || '').split(/[\n,|]/).map((t) => t.trim()).filter(Boolean),
    url: pick(row, ['pdf_url', 'url', 'download_url', 'link', 'drive_url', 'file_url']),
    image: driveImg(pick(row, ['image', 'image_url', 'thumbnail', 'cover']), 'w800'),
    gated: /^(yes|true|1|gated)$/i.test(pick(row, ['gated', 'gate', 'locked'])),
    dateLabel: formatDate(pick(row, ['date', 'date_published'])),
  };
}

// Tab "experts": name,role,bio,photo_url,tags,type   (hosts / speakers)
export function normalizeExpert(row, i = 0) {
  const name = pick(row, ['name']) || `Expert ${i + 1}`;
  return {
    id: slugify(name),
    name,
    role: pick(row, ['role', 'title', 'position']),
    org: pick(row, ['organization', 'firm', 'company']),
    bio: pick(row, ['bio', 'description', 'about']),
    photo: driveImg(pick(row, ['photo_url', 'photo', 'image', 'image_url']), 'w600'),
    tags: (pick(row, ['tags', 'tag']) || '').split(/[\n,|]/).map((t) => t.trim()).filter(Boolean),
    type: pick(row, ['type']),
    category: pick(row, ['type', 'category']),
    links: parseContact(pick(row, ['links', 'contact', 'contact_info', 'social'])),
  };
}

// Tab "featured partners": name,bio,contact,image_url
export function normalizePartner(row, i = 0) {
  const name = pick(row, ['name', 'partner_name']) || `Partner ${i + 1}`;
  return {
    id: slugify(name),
    name,
    role: pick(row, ['role', 'title']),
    org: pick(row, ['organization', 'firm', 'company']),
    bio: pick(row, ['bio', 'description', 'about']),
    photo: driveImg(pick(row, ['image_url', 'photo_url', 'photo', 'image', 'logo']), 'w600'),
    website: pick(row, ['website', 'url']),
    links: parseContact(pick(row, ['contact', 'links', 'contact_info', 'social'])),
    category: pick(row, ['category', 'type', 'specialty', 'tag']),
    featured: true,
  };
}

// Tab "case-studies": clinic,challenge,solution,result,metric,metric_label
export function normalizeCaseStudy(row, i = 0) {
  const clinic = pick(row, ['clinic', 'practice', 'name']) || `Case study ${i + 1}`;
  return {
    id: slugify(clinic),
    clinic,
    challenge: pick(row, ['challenge', 'problem']),
    solution: pick(row, ['solution', 'approach']),
    result: pick(row, ['result', 'outcome']),
    metric: pick(row, ['metric', 'number']),
    metricLabel: pick(row, ['metric_label', 'label']),
  };
}

// Tab "faqs": question,answer,category
export function normalizeFaq(row) {
  return {
    question: pick(row, ['question', 'q']),
    answer: pick(row, ['answer', 'a']),
    category: pick(row, ['category', 'topic']),
  };
}

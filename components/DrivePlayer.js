'use client';

import { useState } from 'react';
import { driveId } from '@/app/lib/sheets';

/**
 * Plays a Google-Drive-hosted audio file as a clean native <audio> element
 * (no black preview box, no pop-out arrow). If the direct stream is blocked
 * (large files Drive can't virus-scan), it falls back to the Drive preview.
 */
export default function DrivePlayer({ src, title }) {
  const [failed, setFailed] = useState(false);
  const id = driveId(src);
  if (!id) return null;

  if (failed) {
    return (
      <div className="audio-embed">
        <iframe src={`https://drive.google.com/file/d/${id}/preview`} title={title} allow="autoplay" loading="lazy" />
      </div>
    );
  }

  return (
    <audio
      className="audio-native"
      controls
      preload="metadata"
      src={`https://drive.google.com/uc?export=download&id=${id}`}
      onError={() => setFailed(true)}
    >
      Your browser does not support audio playback.
    </audio>
  );
}

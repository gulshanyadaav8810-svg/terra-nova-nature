'use client';

import { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';

export default function ShareBar({ title, url }) {
  const [copied, setCopied] = useState(false);

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  function handleCopy() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <div className="reader-share-box">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <Share2 size={20} className="text-emerald-600" />
        <span className="share-box-title">Share this Wildlife Expedition Journal:</span>
      </div>

      <div className="share-buttons-row">
        {/* WhatsApp */}
        <a
          href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-action-btn btn-whatsapp"
          id="shareWhatsappBtn"
        >
          <span>WhatsApp</span>
        </a>

        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-action-btn btn-facebook"
          id="shareFacebookBtn"
        >
          <span>Facebook</span>
        </a>

        {/* Twitter / X */}
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-action-btn btn-twitter"
          id="shareTwitterBtn"
        >
          <span>X / Twitter</span>
        </a>

        {/* Copy Link */}
        <button
          type="button"
          onClick={handleCopy}
          className="share-action-btn btn-copy"
          id="shareCopyBtn"
        >
          {copied ? <Check size={16} color="#059669" /> : <Copy size={16} />}
          <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
        </button>
      </div>
    </div>
  );
}

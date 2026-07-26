'use client';

import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '250785952761';
const MESSAGE = encodeURIComponent(
  'Hello MINARA CAST,\n\nI would like to get assistance regarding your Islamic platform.\nPlease help me.\n\nThank you.'
);

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/30 transition hover:scale-110 animate-float"
    >
      <MessageCircle size={26} fill="white" />
    </a>
  );
}

'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { motion } from 'framer-motion';

export default function WhatsAppButton() {
  const { settings } = useApp();

  // Clean phone number for WhatsApp wa.me link
  const configuredNumber = settings?.whatsapp_number || settings?.phone || '9779851122334';
  const rawPhone = configuredNumber.replace(/[^0-9]/g, '');
  const whatsappNumber = rawPhone.startsWith('977') ? rawPhone : `977${rawPhone}`;
  const message = encodeURIComponent(
    'Hello Narahari Adhikari, I would like to inquire about your accounting and tax consultation services.'
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <aside
      aria-label="Direct Support"
      className="fixed bottom-6 right-6 z-50 flex items-center group pointer-events-auto"
    >
      {/* Tooltip on hover */}
      <span className="hidden sm:inline-block mr-3 px-3 py-1.5 rounded-full bg-[#023A51] text-white text-[12px] font-semibold shadow-lg opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none whitespace-nowrap">
        Chat with us on WhatsApp
      </span>

      {/* Pulsing button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_8px_25px_rgba(37,211,102,0.4)] hover:shadow-[0_12px_30px_rgba(37,211,102,0.55)] transition-shadow duration-200"
      >
        {/* Soft ripple pulse behind button */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 pointer-events-none" />

        {/* WhatsApp Official SVG Logo */}
        <svg
          className="w-7 h-7 fill-white relative z-10"
          viewBox="0 0 24 24"
        >
          <path d="M12.031 2C6.496 2 2 6.495 2 12.031c0 1.905.534 3.684 1.46 5.212L2 22.063l4.965-1.428a10.007 10.007 0 0 0 5.066 1.398c5.535 0 10.031-4.496 10.031-10.002C22.062 6.495 17.566 2 12.031 2Zm0 18.283c-1.597 0-3.093-.442-4.38-1.213l-.314-.186-3.253.936.953-3.17-.205-.326a8.238 8.238 0 0 1-1.265-4.293c0-4.575 3.722-8.297 8.297-8.297 4.575 0 8.297 3.722 8.297 8.297 0 4.575-3.722 8.252-8.33 8.252Zm4.55-6.208c-.249-.125-1.473-.726-1.701-.809-.228-.083-.394-.125-.56.125-.166.249-.643.809-.788.975-.145.166-.29.187-.539.062-.249-.125-1.052-.388-2.004-1.237-.741-.661-1.242-1.477-1.387-1.726-.145-.249-.016-.384.108-.507.112-.111.249-.29.373-.435.124-.145.166-.249.249-.415.083-.166.041-.311-.021-.435-.062-.124-.56-1.349-.768-1.847-.202-.484-.407-.418-.56-.426h-.477c-.166 0-.435.062-.663.311-.228.249-.871.851-.871 2.075 0 1.224.892 2.407 1.016 2.573.124.166 1.755 2.68 4.252 3.757.594.256 1.058.409 1.42.524.597.19 1.14.163 1.569.099.479-.072 1.473-.602 1.68-1.183.208-.581.208-1.079.145-1.183-.062-.104-.228-.166-.477-.291Z" />
        </svg>
      </motion.a>
    </aside>
  );
}

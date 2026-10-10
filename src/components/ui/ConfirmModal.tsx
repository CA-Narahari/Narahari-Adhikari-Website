'use client';

import React, { useEffect, useRef } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmText?: string;
  cancelLabel?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isDanger?: boolean;
  isBusy?: boolean;
  busyLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel,
  confirmText,
  cancelLabel,
  cancelText,
  isDestructive,
  isDanger,
  isBusy = false,
  busyLabel = 'Saving…',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const resolvedConfirmLabel = confirmText || confirmLabel || 'Delete';
  const resolvedCancelLabel = cancelText || cancelLabel || 'Cancel';
  const resolvedIsDestructive = isDanger !== undefined ? isDanger : (isDestructive !== undefined ? isDestructive : true);
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    cancelRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isBusy) onCancel();
      if (event.key !== 'Tab') return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled)');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, isBusy, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-description"
      ref={dialogRef}
      onMouseDown={(event) => { if (event.target === event.currentTarget && !isBusy) onCancel(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close cross top right */}
        <button
          type="button"
          disabled={isBusy}
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                resolvedIsDestructive ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
              }`}
            >
              {resolvedIsDestructive ? <Trash2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>

            <div className="space-y-1.5 pr-4">
              <h3 id="confirm-modal-title" className="text-base font-bold text-slate-900 leading-snug">{title}</h3>
              <p id="confirm-modal-description" className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">{message}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              ref={cancelRef}
              disabled={isBusy}
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              {resolvedCancelLabel}
            </button>
            <button
              type="button"
              disabled={isBusy}
              onClick={() => {
                onConfirm();
              }}
              className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 ${
                resolvedIsDestructive
                  ? 'bg-rose-600 hover:bg-rose-700 active:scale-95'
                  : 'bg-[#023A51] hover:bg-[#2CBC63] active:scale-95'
              }`}
            >
              {resolvedIsDestructive && <Trash2 className="w-3.5 h-3.5" />}
              <span>{isBusy ? busyLabel : resolvedConfirmLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

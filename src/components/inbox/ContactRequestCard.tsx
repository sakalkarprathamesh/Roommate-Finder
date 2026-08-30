'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Check,
  X,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  Building,
  User,
  MessageSquare,
  Home,
  RotateCcw,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import ChatModal from '@/components/chat/ChatModal';

interface ContactRequestCardProps {
  id: string;
  type: 'received' | 'sent' | 'connected';
  listingId: string;
  listingTitle: string;
  listingLocation: string;
  listingRent: number;
  listingStatus?: string;
  listingOwnerId?: string;
  status: string;
  message?: string | null;
  createdAt?: string;
  connectedAt?: string;
  role?: string;
  currentUserId?: string;
  occupancyStatus?: string | null;
  occupancyInitiatorId?: string | null;
  occupiedConfirmedAt?: string | null;
  occupiedUndoUntil?: string | null;
  sender?: {
    id: string;
    profile: {
      name: string;
      profilePhotoUrl?: string | null;
      school: string;
      department: string;
      year: string;
      division?: string | null;
      bio?: string | null;
      emailVerified: boolean;
      email?: string;
      phone?: string;
    };
  };
  receiver?: {
    id: string;
    profile: {
      name: string;
      profilePhotoUrl?: string | null;
      school: string;
      department: string;
      year: string;
      division?: string | null;
      emailVerified: boolean;
      email?: string;
      phone?: string;
    };
  };
  contact?: {
    id: string;
    profile: {
      name: string;
      profilePhotoUrl?: string | null;
      school: string;
      department: string;
      year: string;
      division?: string | null;
      emailVerified: boolean;
      email?: string;
      phone?: string;
    };
  };
  onActionComplete?: () => void;
}

export default function ContactRequestCard({
  id,
  type,
  listingId,
  listingTitle,
  listingLocation,
  listingRent,
  listingStatus,
  listingOwnerId,
  status,
  message,
  currentUserId,
  occupancyStatus,
  occupancyInitiatorId,
  occupiedConfirmedAt,
  occupiedUndoUntil,
  sender,
  receiver,
  contact,
  onActionComplete,
}: ContactRequestCardProps) {
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [occupyLoading, setOccupyLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [undoSecondsLeft, setUndoSecondsLeft] = useState<number | null>(null);

  const student = type === 'received' ? sender?.profile : type === 'sent' ? receiver?.profile : contact?.profile;
  const partnerName = student?.name || 'Roommate';

  // Live timer for 5-minute undo window
  useEffect(() => {
    if (!occupiedUndoUntil) {
      setUndoSecondsLeft(null);
      return;
    }

    const calculateRemaining = () => {
      const remainingMs = new Date(occupiedUndoUntil).getTime() - Date.now();
      const seconds = Math.max(0, Math.floor(remainingMs / 1000));
      setUndoSecondsLeft(seconds);
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);
    return () => clearInterval(interval);
  }, [occupiedUndoUntil]);

  const handleUpdate = async (newStatus: 'ACCEPTED' | 'REJECTED' | 'CANCELLED') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/contact-requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok && onActionComplete) {
        onActionComplete();
      }
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const handleOccupyAction = async (
    action: 'request_occupy' | 'confirm_occupy' | 'decline_occupy' | 'undo_occupy' | 'reopen'
  ) => {
    setOccupyLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/listings/${listingId}/occupy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, connectionId: id }),
      });

      const data = await res.json();
      if (res.ok) {
        if (onActionComplete) onActionComplete();
      } else {
        setErrorMsg(data.error || 'Failed to complete occupancy action');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setOccupyLoading(false);
    }
  };

  const isOccupancyInitiator = currentUserId && occupancyInitiatorId === currentUserId;
  const isOccupied = listingStatus === 'OCCUPIED' || occupancyStatus === 'CONFIRMED';
  const isPendingConfirmation = occupancyStatus === 'PENDING_CONFIRMATION';
  const canUndo = isOccupied && undoSecondsLeft !== null && undoSecondsLeft > 0;
  const isOwner = currentUserId && listingOwnerId === currentUserId;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
      {/* Top Header: Listing Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 font-medium">Listing Context:</span>{' '}
          <Link href={`/listings/${listingId}`} className="font-bold text-slate-900 hover:text-brand-700 transition-colors">
            {listingTitle}
          </Link>
          {isOccupied && (
            <span className="px-2 py-0.5 bg-slate-900 text-white font-bold text-[10px] rounded-md tracking-wider uppercase">
              Occupied
            </span>
          )}
        </div>
        <div className="text-slate-500 font-semibold">
          ₹{listingRent.toLocaleString('en-IN')}/mo • {listingLocation}
        </div>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-2.5 rounded-xl flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Profile & Content */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="flex items-start gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm overflow-hidden flex-shrink-0">
            {student?.profilePhotoUrl ? (
              <img src={student.profilePhotoUrl} alt={student.name} className="w-full h-full object-cover" />
            ) : (
              student?.name?.charAt(0) || 'U'
            )}
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-900 text-sm sm:text-base truncate">{student?.name}</span>
              <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold rounded-md flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" />
                Email Verified
              </span>
            </div>

            <p className="text-xs text-slate-600">
              {student?.department} • {student?.year} {student?.division ? `(${student.division})` : ''}
            </p>
            <p className="text-[11px] text-slate-400">{student?.school}</p>

            {message && (
              <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2 italic">
                &ldquo;{message}&rdquo;
              </p>
            )}
          </div>
        </div>

        {/* Status / Authorized Contact Info / Actions */}
        <div className="flex flex-col sm:items-end gap-2.5 w-full sm:w-auto pt-2 sm:pt-0">
          {type === 'received' && status === 'PENDING' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleUpdate('REJECTED')}
                disabled={loading}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 flex items-center gap-1 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Decline
              </button>
              <button
                onClick={() => handleUpdate('ACCEPTED')}
                disabled={loading}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs flex items-center gap-1 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                Accept & Share Contact
              </button>
            </div>
          )}

          {type === 'sent' && (
            <span
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                status === 'ACCEPTED'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : status === 'REJECTED'
                  ? 'bg-red-50 text-red-800 border border-red-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              {status === 'ACCEPTED' ? 'Approved' : status === 'REJECTED' ? 'Request Declined' : 'Pending Owner Review'}
            </span>
          )}

          {type === 'connected' && (
            <div className="space-y-2.5 w-full sm:w-80">
              {/* Authorized Contact Phone & Email Box */}
              {student?.phone && (
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 space-y-2 text-xs">
                  <div className="font-bold text-emerald-900 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Authorized Private Contact
                  </div>
                  <div className="space-y-1">
                    <a
                      href={`tel:${student.phone}`}
                      className="flex items-center gap-2 font-bold text-slate-900 hover:text-brand-700 bg-white p-1.5 rounded-lg border border-emerald-100"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{student.phone}</span>
                    </a>
                    {student.email && (
                      <a
                        href={`mailto:${student.email}`}
                        className="flex items-center gap-2 font-bold text-slate-900 hover:text-brand-700 bg-white p-1.5 rounded-lg border border-emerald-100 truncate"
                      >
                        <Mail className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                        <span className="truncate">{student.email}</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons: Chat & Mark as Occupied */}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setIsChatOpen(true)}
                  className="w-full py-2.5 px-3.5 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat with {student?.name?.split(' ')[0] || 'Roommate'}</span>
                </button>

                {/* Feature 1: Mark as Occupied Mutual Flow */}
                {!isOccupied && !isPendingConfirmation && (
                  <button
                    type="button"
                    onClick={() => handleOccupyAction('request_occupy')}
                    disabled={occupyLoading}
                    className="w-full py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {occupyLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-500" />
                    ) : (
                      <Home className="w-3.5 h-3.5 text-slate-600" />
                    )}
                    <span>Mark this space as occupied</span>
                  </button>
                )}

                {/* Pending State A: Initiator Waiting */}
                {isPendingConfirmation && isOccupancyInitiator && (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs space-y-1 text-center">
                    <div className="font-bold flex items-center justify-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                      Waiting for {partnerName} to confirm
                    </div>
                    <p className="text-[11px] text-amber-700">
                      Listing stays active until both parties confirm.
                    </p>
                  </div>
                )}

                {/* Pending State B: Recipient Prompt to Confirm */}
                {isPendingConfirmation && !isOccupancyInitiator && (
                  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900 text-xs space-y-2">
                    <p className="font-bold">Has this space actually been taken?</p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOccupyAction('confirm_occupy')}
                        disabled={occupyLoading}
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOccupyAction('decline_occupy')}
                        disabled={occupyLoading}
                        className="flex-1 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold rounded-lg transition-colors"
                      >
                        Not yet
                      </button>
                    </div>
                  </div>
                )}

                {/* Confirmed State: Occupied Badge & 5-minute Undo */}
                {isOccupied && (
                  <div className="space-y-1.5">
                    <div className="p-2.5 bg-slate-900 text-white rounded-xl text-xs flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Space Occupied
                      </div>
                      {occupiedConfirmedAt && (
                        <span className="text-[10px] text-slate-400">
                          {new Date(occupiedConfirmedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {/* 5-minute Undo Window */}
                    {canUndo && (
                      <button
                        type="button"
                        onClick={() => handleOccupyAction('undo_occupy')}
                        disabled={occupyLoading}
                        className="w-full py-1.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                        <span>
                          Undo Occupancy ({Math.floor(undoSecondsLeft / 60)}:
                          {(undoSecondsLeft % 60).toString().padStart(2, '0')} left)
                        </span>
                      </button>
                    )}

                    {/* Reopen Listing Button (Owner only, after 5m or anytime) */}
                    {!canUndo && isOwner && (
                      <button
                        type="button"
                        onClick={() => handleOccupyAction('reopen')}
                        disabled={occupyLoading}
                        className="w-full py-1.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-blue-700" />
                        <span>Reopen this listing</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scoped Chat Modal */}
      {isChatOpen && (
        <ChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          connectionId={id}
          partnerName={partnerName}
          listingTitle={listingTitle}
        />
      )}
    </div>
  );
}

// Screen list + captions for the Split Pay concept. Server-safe (no React).

export const screenOrder = [
  "c0-today",
  "s1-seats",
  "s2-split",
  "s3-status",
  "s4-confirmed",
  "f1-invite",
  "f2-upi",
  "f3-ticket",
  "e1-expiring",
  "e2-expired",
  "e3-failed",
  "e4-dropout",
  "e5-pending",
  "e6-offer",
  "e7-late-link",
  "e8-show-soon",
  "e9-edit-group",
] as const;

export type ScreenId = (typeof screenOrder)[number];
export type Flow = "Today" | "Organiser" | "Friend" | "Edge case";

export const screenMeta: Record<ScreenId, { title: string; flow: Flow; note: string }> = {
  "c0-today": { title: "Today: one person pays for all", flow: "Today", note: "The organiser fronts ₹2,100 and chases five friends afterwards." },
  "s1-seats": { title: "Seat selection + split entry", flow: "Organiser", note: "Split is offered where the group decision happens — at seat selection." },
  "s2-split": { title: "Assign seats & invite", flow: "Organiser", note: "The organiser pays only their seat; the hold rule is explained up front." },
  "s3-status": { title: "Live group status", flow: "Organiser", note: "One glance: who paid, who's paying, who needs a nudge, time left." },
  "s4-confirmed": { title: "Everyone paid", flow: "Organiser", note: "Nothing left to collect — each friend has their own ticket." },
  "f1-invite": { title: "Invite link (no app needed)", flow: "Friend", note: "Opens in the browser: who invited you, your seat, your share, time left." },
  "f2-upi": { title: "Pay with UPI", flow: "Friend", note: "One tap into the friend's own UPI app; auto-refund promise builds trust." },
  "f3-ticket": { title: "Friend's ticket", flow: "Friend", note: "Confirmation plus group progress, and a soft nudge to install the app." },
  "e1-expiring": { title: "Hold running out", flow: "Edge case", note: "The organiser decides, with a recommended default — never a silent failure." },
  "e2-expired": { title: "Hold expired", flow: "Edge case", note: "Book whoever paid; released seats stay joinable if still free." },
  "e3-failed": { title: "Payment failed", flow: "Edge case", note: "Clear money status, seat still held, and the organiser sees it too." },
  "e4-dropout": { title: "Friend drops out after paying", flow: "Edge case", note: "The seat returns to the organiser with three fair options." },
  "e5-pending": { title: "Payment pending", flow: "Edge case", note: "Money left the account but UPI hasn't confirmed — the seat stays held and nobody pays twice." },
  "e6-offer": { title: "Group offer applied", flow: "Edge case", note: "A coupon on the group booking: the organiser chooses to share the saving or keep it." },
  "e7-late-link": { title: "Link opened after the hold", flow: "Edge case", note: "The friend learns what happened, that nobody was charged, and can still grab the seat if it's free." },
  "e8-show-soon": { title: "Show starting soon", flow: "Edge case", note: "Close to showtime the hold shrinks, so unpaid seats get back on sale in time." },
  "e9-edit-group": { title: "Add or remove a friend", flow: "Edge case", note: "Plans change after invites go out — swap people in and out without restarting the booking." },
};

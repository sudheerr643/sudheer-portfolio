// Sample data for the Split Pay concept. Movie, cinema and people are fictional.

export const show = {
  movie: "Monsoon Heist",
  cert: "UA13+",
  lang: "Hindi · 2D",
  runtime: "2h 24m",
  cinema: "Orion Cinemas: Gachibowli",
  city: "Hyderabad",
  date: "Sat, 22 Nov",
  time: "07:30 PM",
  audi: "Audi 3",
  tier: "PRIME",
  seatPrice: 320,
  fee: 30, // convenience fee per seat
};

export const perHead = show.seatPrice + show.fee; // 350

export type Status = "paid" | "paying" | "opened" | "sent" | "failed" | "dropped" | "released";

export type Member = {
  id: string;
  name: string;
  seat: string;
  color: string; // avatar colour
  you?: boolean;
};

export const group: Member[] = [
  { id: "you", name: "Arjun", seat: "G6", color: "#F84464", you: true },
  { id: "priya", name: "Priya", seat: "G7", color: "#7C5CFF" },
  { id: "rahul", name: "Rahul", seat: "G8", color: "#14A38B" },
  { id: "meera", name: "Meera", seat: "G9", color: "#F59E0B" },
  { id: "kabir", name: "Kabir", seat: "G10", color: "#2F80ED" },
  { id: "zoya", name: "Zoya", seat: "G11", color: "#E0457B" },
];

export const total = perHead * group.length; // 2100

export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/* Seat map: rows A–J, 16 seats with an aisle after seat 8. */
export const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"];
export const seatsPerRow = 16;
// seats already sold to other people
export const sold = new Set([
  "A3", "A4", "A9", "A10", "B1", "B2", "B12", "C5", "C6", "C7", "C13", "C14",
  "D2", "D3", "D10", "D11", "D12", "E7", "E8", "F1", "F2", "F3", "F14", "F15", "F16",
  "G2", "G3", "G14", "H5", "H6", "H9", "H10", "H11", "J1", "J15", "J16", "K7", "K8",
]);
export const groupSeats = new Set(group.map((m) => m.seat));

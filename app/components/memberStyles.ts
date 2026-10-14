import type { MemberKey } from "./session";

export type MemberStyle = {
  name: string;
  initial: string;
  solid: string;
  cell: string;
  softer: string;
  chip: string;
  number: string;
  dot: string;
  text: string;
  swatch: string;
  card: string;
};

export const MEMBER_META: Record<MemberKey, MemberStyle> = {
  dicky: {
    name: "Dicky",
    initial: "D",
    solid: "bg-peri-400",
    cell: "border-peri-200 bg-peri-50",
    softer: "bg-peri-50",
    chip: "bg-peri-100 text-ink",
    number: "bg-peri-200 text-ink",
    dot: "bg-peri-400",
    text: "text-peri-500",
    swatch: "bg-peri-300",
    card: "border-peri-200 bg-peri-100",
  },
  aura: {
    name: "Aura",
    initial: "A",
    solid: "bg-blush-400",
    cell: "border-blush-200 bg-blush-50",
    softer: "bg-blush-50",
    chip: "bg-blush-100 text-ink",
    number: "bg-blush-200 text-ink",
    dot: "bg-blush-400",
    text: "text-blush-500",
    swatch: "bg-blush-300",
    card: "border-blush-200 bg-blush-100",
  },
  nadia: {
    name: "Nadia",
    initial: "N",
    solid: "bg-apricot-400",
    cell: "border-apricot-200 bg-apricot-50",
    softer: "bg-apricot-50",
    chip: "bg-apricot-100 text-ink",
    number: "bg-apricot-200 text-ink",
    dot: "bg-apricot-400",
    text: "text-apricot-500",
    swatch: "bg-apricot-300",
    card: "border-apricot-200 bg-apricot-100",
  },
};

export const MEMBER_KEYS: MemberKey[] = ["dicky", "aura", "nadia"];

export const MEMBER_GRADIENT: Record<MemberKey, string> = {
  dicky: "from-peri-200 to-peri-400",
  aura: "from-blush-200 to-blush-400",
  nadia: "from-apricot-200 to-apricot-400",
};

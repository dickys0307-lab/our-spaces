'use client';

import Image from "next/image";
import type { MemberKey } from "./session";

export const AVATAR_MAP: Record<MemberKey, string> = {
  dicky: "/avatar/dicky.png",
  aura: "/avatar/aura.png",
  nadia: "/avatar/nadia.png",
};

interface AvatarImageProps {
  member: MemberKey;
  size?: number;
  className?: string;
  alt?: string;
}

export function AvatarImage({
  member,
  size = 96,
  className = "",
  alt,
}: AvatarImageProps) {
  const avatarAlt = alt ?? `${member}'s avatar`;
  return (
    <div
      className={`relative overflow-hidden rounded-full ring-2 ring-white ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={AVATAR_MAP[member]}
        alt={avatarAlt}
        fill
        className="object-cover object-center"
        sizes={`${size}px`}
        priority
      />
    </div>
  );
}

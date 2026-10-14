import type { MemberKey } from "./session";

export const facePalette = ["#cfcfcf", "#d8d8d8", "#c6c6c6"];

type Palette = {
  bg: string;
  hair: string;
  hairShine: string;
  shirt: string;
  shirtShadow: string;
  skin: string;
  skinShadow: string;
  blush: string;
  line: string;
};

const MEMBER_PALETTES: Record<MemberKey, Palette> = {
  dicky: {
    bg: "#e1e7fb",
    hair: "#313a5c",
    hairShine: "#586593",
    shirt: "#8b9ee4",
    shirtShadow: "#7089db",
    skin: "#f5cdb2",
    skinShadow: "#e5b190",
    blush: "#e79aa6",
    line: "#262c45",
  },
  aura: {
    bg: "#fbdfe9",
    hair: "#5f2942",
    hairShine: "#8f4866",
    shirt: "#e57aa5",
    shirtShadow: "#d45c8b",
    skin: "#f5cdb2",
    skinShadow: "#e5b190",
    blush: "#e57aa5",
    line: "#3f1d2e",
  },
  nadia: {
    bg: "#fbe6cf",
    hair: "#4f3520",
    hairShine: "#7d5738",
    shirt: "#ec9450",
    shirtShadow: "#dd7f36",
    skin: "#f5cdb2",
    skinShadow: "#e5b190",
    blush: "#e79a63",
    line: "#3a2716",
  },
};

const GRAY: Palette = {
  bg: facePalette[0],
  hair: "#3d3d3d",
  hairShine: "#6a6a6a",
  shirt: "#b9bec9",
  shirtShadow: "#a8adb9",
  skin: "#f4f4f4",
  skinShadow: "#dcdcdc",
  blush: "#cbb6bd",
  line: "#2f2f2f",
};

const FACE_PATH =
  "M21 31 C21 20 25.5 16.5 32 16.5 C38.5 16.5 43 20 43 31 C43 41 37.5 47.5 32 47.5 C26.5 47.5 21 41 21 31 Z";

function Faces({
  hair,
  hairShine,
  line,
  skinShadow,
  blush,
}: Palette) {
  return (
    <>
      {/* brows */}
      <path
        d="M24 29 Q27 27 30 29"
        fill="none"
        stroke={line}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M34 29 Q37 27 40 29"
        fill="none"
        stroke={line}
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      {/* eyes */}
      <ellipse cx="26.5" cy="33.3" rx="2.5" ry="3.2" fill={line} />
      <ellipse cx="37.5" cy="33.3" rx="2.5" ry="3.2" fill={line} />
      <circle cx="25.6" cy="32" r="0.85" fill="#ffffff" />
      <circle cx="36.6" cy="32" r="0.85" fill="#ffffff" />

      {/* nose */}
      <path
        d="M31.6 37.4 q0.9 1.1 1.8 0"
        fill="none"
        stroke={skinShadow}
        strokeWidth="1.1"
        strokeLinecap="round"
      />

      {/* blush */}
      <ellipse cx="23.3" cy="38.6" rx="2.5" ry="1.5" fill={blush} opacity="0.6" />
      <ellipse cx="40.7" cy="38.6" rx="2.5" ry="1.5" fill={blush} opacity="0.6" />

      {/* smile */}
      <path
        d="M28.4 42 q3.6 2.6 7.2 0"
        fill="none"
        stroke={line}
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* hair shine */}
      <path
        d="M24 18.5 Q30 15 37 17.5"
        fill="none"
        stroke={hairShine}
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.7"
      />
    </>
  );
}

export function CartoonFace({
  variant,
  member,
  className = "",
}: {
  variant: 0 | 1 | 2;
  member?: MemberKey;
  className?: string;
}) {
  const palette = member ? MEMBER_PALETTES[member] : GRAY;
  const { hair, hairShine, shirt, shirtShadow, skin, skinShadow, blush, line } =
    palette;
  const bg = member ? palette.bg : facePalette[variant];

  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      {/* background */}
      <rect width="64" height="64" fill={bg} />
      <circle cx="19" cy="15" r="20" fill="#ffffff" opacity="0.26" />

      {/* shoulders */}
      <path d="M7 64 Q12 50 32 50 Q52 50 57 64 Z" fill={shirt} />
      <path
        d="M27 51 Q32 56 37 51 L37 54 Q32 59 27 54 Z"
        fill={shirtShadow}
        opacity="0.7"
      />

      {/* neck */}
      <path d="M28 44 L28 50 Q32 52 36 50 L36 44 Z" fill={skinShadow} />

      {/* back hair */}
      {variant === 0 && (
        <path
          d="M16 32 C13 16 23 10 32 10 C41 10 51 16 48 32 L49 51 Q45 53 43.5 44 L42 30 C41 22 37 19 32 19 C27 19 23 22 22 30 L20.5 44 Q19 53 15 51 Z"
          fill={hair}
        />
      )}
      {variant === 1 && (
        <>
          <path d="M17 26 C10 25 7 33 10 41 C12 46 16 46 17 41 C13 39 13 32 19 31 Z" fill={hair} />
          <path d="M47 26 C54 25 57 33 54 41 C52 46 48 46 47 41 C51 39 51 32 45 31 Z" fill={hair} />
          <path
            d="M18 34 C16 16 24 12 32 12 C40 12 48 16 46 34 L46 40 Q44 35 43 30 C41 23 37 20 32 20 C27 20 23 23 21 30 Q20 35 18 40 Z"
            fill={hair}
          />
        </>
      )}
      {variant === 2 && (
        <path
          d="M17 34 C16 16 24 12 32 12 C40 12 48 16 47 34 L47 45 Q44 46 43 40 L42 30 C41 22 37 19 32 19 C27 19 23 22 22 30 L21 40 Q20 46 17 45 Z"
          fill={hair}
        />
      )}

      {/* ears */}
      <circle cx="20.5" cy="33" r="2.8" fill={skin} />
      <circle cx="43.5" cy="33" r="2.8" fill={skin} />

      {/* face */}
      <path d={FACE_PATH} fill={skin} />

      {/* front hair / bangs */}
      {variant === 0 && (
        <path
          d="M19 31 C18.5 18 24 14 32 14 C40 14 45.5 18 45 31 C43 25 40 27.5 37.5 24 C35 27 33.5 22.5 32 25.5 C30.5 22.5 29 27 26.5 24 C24 27.5 21 25 19 31 Z"
          fill={hair}
        />
      )}
      {variant === 1 && (
        <>
          <path
            d="M20 31 C19 18 25 14 32 14 C39 14 45 18 44 31 C42 25 39 26 37 23 C34.5 26 33 21 31 24 C29 21 27.5 26 25 23 C23 26 22 25 20 31 Z"
            fill={hair}
          />
          <circle cx="17.5" cy="25.5" r="2.4" fill={shirt} />
          <circle cx="46.5" cy="25.5" r="2.4" fill={shirt} />
        </>
      )}
      {variant === 2 && (
        <path
          d="M20.5 31 C20 17 25.5 14 32 14 C38.5 14 44 17 43.5 31 L43.5 27 Q32 31.5 20.5 27 Z"
          fill={hair}
        />
      )}

      <Faces
        bg={bg}
        hair={hair}
        hairShine={hairShine}
        shirt={shirt}
        shirtShadow={shirtShadow}
        skin={skin}
        skinShadow={skinShadow}
        blush={blush}
        line={line}
      />
    </svg>
  );
}

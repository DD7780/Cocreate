/** Decorative brand mark; nearby wordmarks and link labels provide its accessible name. */
export function BrandMark({ size = 32 }: { size?: number }) {
  return (
    <img
      className="brand-logo"
      src="/brand/woven-c.svg"
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
    />
  );
}

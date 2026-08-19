// Static export turns off Next's image optimizer (next.config images.unoptimized), so <Image> ships
// the original JPEG at one size. These screenshots are the largest paint on the pages that carry
// them, so the AVIF/WebP derivatives and width set are generated at build time by scripts/images.mjs
// and selected here by the browser instead.
const WIDTHS = [640, 960];

export function Shot({
  base,
  alt,
  width,
  height,
  priority = false,
  className,
  sizes = "(max-width: 900px) 100vw, 900px"
}: {
  base: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  const set = (ext: string) => WIDTHS.map((w) => `/${base}-${w}.${ext} ${w}w`).join(", ");
  return (
    <>
      {priority ? (
        <link
          rel="preload"
          as="image"
          type="image/avif"
          imageSrcSet={set("avif")}
          imageSizes={sizes}
          fetchPriority="high"
        />
      ) : null}
      <picture>
        <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
        <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
        <img
          src={`/${base}-960.jpg`}
          srcSet={set("jpg")}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className={className}
        />
      </picture>
    </>
  );
}

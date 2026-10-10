const items = [
  "Roast day is Tuesday",
  "Cardamom knots from 07:30",
  "Plant milks, no charge",
  "Dogs always welcome",
  "Records on Fridays after four",
  "Bags of beans by the door",
];

/** A slow, frosted ticker of house notes that runs under the hero. */
export function Ticker() {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((t) => (
        <li key={t} className="flex items-center gap-6 pr-6 text-[0.9375rem] text-ink-soft">
          <span>{t}</span>
          <span aria-hidden className="font-display text-burgundy">✻</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="wrap relative z-[2] mt-12 md:mt-16">
      <div className="glass overflow-hidden rounded-full py-3">
        <div className="marquee flex w-max">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </div>
  );
}

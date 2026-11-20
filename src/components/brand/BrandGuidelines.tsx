import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import tulaLogo from '../../assets/Tula Carbon Dot Grid Logo.png';
import {
  logoMinimums, paletteGroups, productColors, radii, spacing, statusColors,
  themeColors, tokenLayers, typeScale,
} from './guidelineData';
import type { Swatch } from './guidelineData';

const sections = [
  { id: 'brand-logo', label: 'Logo' },
  { id: 'brand-colors', label: 'Colors' },
  { id: 'brand-typography', label: 'Typography' },
  { id: 'brand-foundations', label: 'Foundations' },
  { id: 'brand-tokens', label: 'Tokens' },
];
const panel = 'rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)]';
const headline = 'text-2xl font-semibold tracking-tight';
const muted = 'text-sm text-[var(--text-secondary)]';
const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]';

function hexToRgb(hex: string) {
  return [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16));
}

function luminance(hex: string) {
  const [red, green, blue] = hexToRgb(hex).map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

const contrastPairs = [
  { label: 'Ink on Paper', foreground: '#15131A', background: '#F7F5F2' },
  { label: 'Violet 700 on White', foreground: '#5625B8', background: '#FFFFFF' },
  { label: 'Violet 500 on White', foreground: '#7A3FF2', background: '#FFFFFF' },
  { label: 'Orange 700 on White', foreground: '#A83F00', background: '#FFFFFF' },
  { label: 'Success on White', foreground: '#147A5A', background: '#FFFFFF' },
  { label: 'Error on White', foreground: '#C63C46', background: '#FFFFFF' },
  { label: 'Information on White', foreground: '#2D63D2', background: '#FFFFFF' },
];

function SwatchGrid({ swatches, print }: { swatches: Swatch[]; print?: boolean }) {
  return (
    <ul className="grid grid-cols-2 gap-3 min-[560px]:grid-cols-3 xl:grid-cols-6">
      {swatches.map((swatch) => (
        <li key={swatch.name} className={`${panel} min-w-0 overflow-hidden`}>
          <SwatchCard swatch={swatch} print={print} />
        </li>
      ))}
    </ul>
  );
}

function SwatchCard({ swatch: { name, hex, detail }, print }: { swatch: Swatch; print?: boolean }) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'unavailable'>('idle');

  async function copyHex() {
    try {
      await navigator.clipboard.writeText(hex);
      setCopyState('copied');
    } catch {
      setCopyState('unavailable');
    }
  }

  return (
    <>
      <div className={print ? 'h-24 sm:h-28' : 'h-14'} style={{ backgroundColor: hex }} aria-hidden="true" />
      <div className="space-y-1.5 p-3">
        <h4 className="wrap-anywhere text-[13px] leading-4 font-semibold">{name}</h4>
        <button
          type="button"
          aria-label={`Copy ${hex} for ${name}`}
          onClick={copyHex}
          onBlur={() => setCopyState('idle')}
          className={`${focus} inline-flex min-h-8 max-w-full items-center gap-2 rounded-md border border-[var(--border-subtle)] px-2 text-xs hover:bg-[var(--bg-subtle)]`}
        >
          <code className="font-mono">{hex}</code>
          {copyState === 'copied' ? <Check className="size-3.5 shrink-0 text-[var(--status-success)]" aria-hidden="true" /> : <Copy className="size-3.5 shrink-0 text-[var(--text-secondary)]" aria-hidden="true" />}
        </button>
        <span aria-live="polite" className={copyState === 'unavailable' ? 'block text-xs text-[var(--text-secondary)]' : 'sr-only'}>
          {copyState === 'copied' ? `${hex} copied` : copyState === 'unavailable' ? 'Clipboard unavailable. Copy the code manually.' : ''}
        </span>
        {print && <p className="font-mono text-[10px] leading-4 text-[var(--text-secondary)]">RGB {hexToRgb(hex).join(', ')}</p>}
        {detail && <p className="wrap-anywhere text-[11px] leading-4 text-[var(--text-secondary)]">{detail}</p>}
      </div>
    </>
  );
}

export function BrandGuidelines() {
  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-10 pb-8 text-[var(--text-primary)]">
      <header className="overflow-hidden rounded-xl border border-[var(--border-default)]">
        <div aria-hidden="true" className="grid h-2 grid-cols-6">
          {paletteGroups[0].swatches.map(({ name, hex }) => <div key={name} style={{ backgroundColor: hex }} />)}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-6 bg-[var(--bg-canvas)] px-5 py-7 sm:px-8 sm:py-9">
          <div className="min-w-0">
            <h1 className="text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">Brand &amp; design system</h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">Tula Carbon’s visual identity, color palettes, and product foundations.</p>
          </div>
          <div className="rounded-lg border border-[#EEEAF5] bg-white px-5 py-3">
            <img src={tulaLogo} alt="Tula Carbon six-dot logo and wordmark" className="h-auto w-36 sm:w-44" />
          </div>
        </div>
        <nav aria-label="Brand guidelines sections" className="flex flex-wrap gap-x-5 gap-y-1 border-t border-[var(--border-subtle)] px-5 py-2 sm:px-8">
          {sections.map(({ id, label }) => (
            <button key={id} type="button" onClick={() => document.getElementById(id)?.focus()} className={`${focus} rounded-sm py-2 text-sm font-medium text-[var(--action-primary)] hover:underline`}>{label}</button>
          ))}
        </nav>
      </header>

      <section id="brand-logo" tabIndex={-1} className={`${focus} scroll-mt-5 space-y-4`}>
        <h2 className={headline}>Logo usage</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className={`${panel} space-y-3 p-4 sm:p-5`}>
            <h3 className="font-semibold">Master artwork and clearspace</h3>
            <p className={muted}>Use the supplied vector master for production. Leave at least 1D of clearspace on every side of the full lockup, where D is the diameter of one approved dot.</p>
            <p className={muted}>Preserve the six-dot arrangement, approved colors, and original wordmark. Keep the wordmark as artwork and reserve status colors for UI.</p>
            <p className={muted}>Approved variants are full color on light, inverse on dark, monochrome Ink, and monochrome white.</p>
            <p className={muted}>Check the actual SVG at 16 × 16 px. If the dots merge, use a larger rendering or the platform mask.</p>
          </div>
          <dl className={`${panel} divide-y divide-[var(--border-subtle)] px-4 sm:px-5`}>
            {logoMinimums.map(([use, minimum]) => (
              <div key={use} className="grid grid-cols-2 gap-3 py-2.5 text-sm"><dt className="font-medium">{use}</dt><dd className="text-[var(--text-secondary)]">{minimum}</dd></div>
            ))}
          </dl>
        </div>
      </section>

      <section id="brand-colors" tabIndex={-1} className={`${focus} scroll-mt-5 space-y-6`}>
        <div className="space-y-2">
          <h2 className={headline}>Color system</h2>
          <p className={muted}>Ember and Royal Violet carry the brand. Green is reserved for success and verification in the product. Select any HEX code to copy it.</p>
          <details className="text-sm">
            <summary className={`${focus} w-fit cursor-pointer rounded-sm font-medium text-[var(--action-primary)]`}>Palette directions considered</summary>
            <dl className="mt-3 space-y-2">
              <div><dt className="font-medium">Ember + Royal Violet</dt><dd className={muted}>The recommended direction retains the orange and violet identity and separates brand expression from product status colors.</dd></div>
              <div><dt className="font-medium">Burnt Copper + Deep Indigo</dt><dd className={muted}>An institutional direction with a more subdued feel.</dd></div>
              <div><dt className="font-medium">Coral + Aubergine</dt><dd className={muted}>An editorial direction with a softer look for long-form content.</dd></div>
            </dl>
          </details>
        </div>
        {paletteGroups.map(({ name, description, swatches }) => (
          <div key={name} className="space-y-3">
            <div><h3 className="text-lg font-semibold">{name}</h3><p className={muted}>{description}</p></div>
            <SwatchGrid swatches={swatches} print />
          </div>
        ))}
        <div className="space-y-3">
          <div><h3 className="text-lg font-semibold">Product primitives</h3><p className={muted}>Application colors for surfaces, text, borders, and interaction. The approved master artwork takes precedence for logo colors.</p></div>
          <SwatchGrid swatches={productColors} />
        </div>
        <div className="space-y-3">
          <div><h3 className="text-lg font-semibold">Semantic colors</h3><p className={muted}>Use a label or icon with each state so the meaning is clear without color.</p></div>
          <SwatchGrid swatches={statusColors} />
        </div>
        {themeColors.map(({ name, swatches }) => (
          <div key={name} className="space-y-3">
            <h3 className="text-lg font-semibold">{name}</h3>
            <SwatchGrid swatches={swatches} />
          </div>
        ))}
        <div className={`${panel} grid gap-5 p-4 sm:p-5 lg:grid-cols-2`}>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Accessible contrast</h3>
            <p className={muted}>Use a minimum of 4.5:1 for normal text and 3:1 for essential control boundaries and graphics. Pair expressive orange and light brand colors with dark text.</p>
            <p className={muted}>In dark mode, use the essential boundary token or a higher-contrast color when a border is needed to identify a control.</p>
          </div>
          <dl className="divide-y divide-[var(--border-subtle)]">
            {contrastPairs.map(({ label, foreground, background }) => {
              const values = [luminance(foreground), luminance(background)];
              const ratio = (Math.max(...values) + 0.05) / (Math.min(...values) + 0.05);
              return (
                <div key={label} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <dt>{label}</dt>
                  <dd className="shrink-0 font-mono text-xs text-[var(--text-secondary)]">{ratio.toFixed(2)}:1 · {ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'Below AA'}</dd>
                </div>
              );
            })}
          </dl>
        </div>
      </section>

      <section id="brand-typography" tabIndex={-1} className={`${focus} scroll-mt-5 space-y-4`}>
        <h2 className={headline}>Typography</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { name: 'IBM Plex Sans', family: 'font-sans', sample: 'Carbon inventory', use: 'Product UI, tables, and navigation.' },
            { name: 'IBM Plex Serif', family: 'font-serif', sample: 'Climate disclosures', use: 'Reports and long-form editorial.' },
            { name: 'IBM Plex Mono', family: 'font-mono', sample: 'ACT-2026-0812', use: 'Record IDs, factor codes, and formulas.' },
          ].map(({ name, family, sample, use }) => (
            <article className={`${panel} space-y-3 p-4`} key={name}>
              <h3 className="text-sm font-semibold">{name}</h3><p className={`${family} wrap-anywhere text-xl`}>{sample}</p><p className={muted}>{use}</p>
            </article>
          ))}
        </div>
        <p className={muted}>Use sentence case in the UI and tabular numerals for KPIs and numeric columns. Use script-specific Noto Sans families as international fallbacks.</p>
        <dl className={`${panel} divide-y divide-[var(--border-subtle)] px-4 sm:px-5`}>
          {typeScale.map(({ role, size, leading, weight, weights }) => (
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3" key={role}>
              <dt className="wrap-anywhere" style={{ fontSize: size, lineHeight: `${leading}px`, fontWeight: weight }}>{role}</dt>
              <dd className="font-mono text-xs text-[var(--text-secondary)]">{size} / {leading} px · {weights ?? weight}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="brand-foundations" tabIndex={-1} className={`${focus} scroll-mt-5 space-y-4`}>
        <h2 className={headline}>Foundations</h2>
        <div className={`${panel} space-y-4 p-4 sm:p-5`}>
          <div><h3 className="text-lg font-semibold">Spacing</h3><p className={muted}>Use a 4 px base grid.</p></div>
          <ul className="flex flex-wrap gap-4">
            {spacing.map((size) => <li key={size} className="flex min-w-8 flex-col items-start gap-2"><span aria-hidden="true" className="h-2 rounded-sm bg-[var(--action-primary)]" style={{ width: size }} /><span className="font-mono text-xs">{size} px</span></li>)}
          </ul>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className={`${panel} space-y-3 p-4 sm:p-5`}>
            <h3 className="text-lg font-semibold">Corner radii</h3>
            <ul className="grid grid-cols-2 gap-3">
              {radii.map(({ size, role }) => <li key={size} className="flex items-center gap-2 text-sm"><span className="grid size-9 shrink-0 place-items-center border border-[var(--border-default)] bg-[var(--bg-subtle)] font-mono text-xs" style={{ borderRadius: size }}>{size}</span><span>{role}</span></li>)}
            </ul>
          </div>
          <div className={`${panel} space-y-3 p-4 sm:p-5`}>
            <h3 className="text-lg font-semibold">Elevation</h3>
            <p className={muted}>Use borders and surface contrast for most hierarchy.</p>
            <ul className="space-y-2 font-mono text-xs text-[var(--text-secondary)]">
              <li>Level 1 · 0 1px 2px rgba(21,19,26,.06)</li>
              <li>Level 2 · 0 4px 12px rgba(21,19,26,.08)</li>
              <li>Modal · 0 16px 40px rgba(21,19,26,.16)</li>
            </ul>
          </div>
          <div className={`${panel} space-y-3 p-4 sm:p-5`}>
            <h3 className="text-lg font-semibold">Motion and icons</h3>
            <p className={muted}>Use 120–180 ms for controls and 200–240 ms for panels. Respect reduced-motion preferences.</p>
            <p className={muted}>Use 20 px icons by default with 1.75–2 px strokes. Favor operational symbols such as meters, facilities, documents, tools, and locks.</p>
          </div>
          <div className={`${panel} space-y-3 p-4 sm:p-5`}>
            <h3 className="text-lg font-semibold">Responsive layout</h3>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
              {[
                ['≥1440 px', 'Expanded enterprise'], ['1200–1439 px', 'Desktop'], ['1024–1199 px', 'Compact desktop'],
                ['768–1023 px', 'Tablet'], ['<768 px', 'Task-focused mobile'],
              ].map(([width, label]) => <div key={width} className="contents"><dt className="font-mono">{width}</dt><dd className="text-[var(--text-secondary)]">{label}</dd></div>)}
            </dl>
            <p className={muted}>On mobile, prioritize approvals, evidence upload, facility entry, and issue resolution.</p>
          </div>
        </div>
      </section>

      <section id="brand-tokens" tabIndex={-1} className={`${focus} scroll-mt-5 space-y-4`}>
        <div><h2 className={headline}>Token architecture</h2><p className={`mt-1 ${muted}`}>Use the same three layers in Figma Variables and code.</p></div>
        <div className="grid gap-3 md:grid-cols-3">
          {tokenLayers.map(({ name, detail, samples }) => (
            <article key={name} className={`${panel} min-w-0 space-y-2 p-4`}>
              <h3 className="font-semibold">{name}</h3><p className={muted}>{detail}</p>
              <ul className="space-y-1">{samples.map((sample) => <li className="wrap-anywhere font-mono text-xs text-[var(--action-primary)]" key={sample}>{sample}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

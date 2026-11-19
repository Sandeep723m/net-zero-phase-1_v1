# Tula Carbon brand and product design system

**Version:** 1.0 · **Status:** Product foundation rollout · **Owner:** Assign brand, product design, climate methodology and regulatory interpretation owners.

## Brand foundation

- **Brand idea:** Evidence into action.
- **Positioning:** Tula Carbon is the carbon operations platform for organisations that need emissions data they can trace, defend and act on.
- **Promise:** Every number has a source. Every decision has a path forward.
- **Category:** Carbon operations with accounting-grade traceability.
- **Narrative:** Source → Evidence → Calculation → Review → Disclosure → Reduction.
- **Attributes:** Traceable, defensible, operational and actionable.
- **Primary audiences:** CFO/finance leadership, sustainability leads, auditors/assurance providers, facility operators, carbon analysts and executives/boards. Surface confidence and financial implications for finance; gaps/hotspots/actions for sustainability; reproducible lineage for assurance; precise units and deadlines for operators; uncertainty and methods for analysts; progress, risk and target credibility for executives.
- **Voice:** Precise, calm, accountable and action-oriented. Use sentence case in product UI. State scope, period, method and evidence. Avoid unqualified environmental promises and unsupported certifications.
- **Web message:** “Carbon data you can defend. Decisions you can act on.” Supporting line: “Collect, calculate, assure and reduce enterprise emissions from one traceable system.”

## Logo governance

The supplied strategy defines the approved identity as exactly six solid circles in a 3-column × 2-row arrangement (orange family above, violet family below) paired with the stacked Tula Carbon wordmark. Use the approved vector master only. Do not redraw, simplify, stretch, reorder, recolour dots as status data, substitute seven dots, or use molecular/chart imagery. Define `D` as the approved dot diameter; clearspace is `1D` around the complete lockup. Digital minimums: symbol 24px high, full lockup 112px wide; print: symbol 8mm high, full lockup 28mm wide; favicon at least 32×32px; app symbol 55–62% of icon width. At 16px, test the actual SVG optically; never simplify it to fit.

Approved variants: full colour, inverse, monochrome dark and monochrome white. Logo dot colours remain identity artwork, never data semantics. Keep the original vectors as source of truth. **Migration note:** the runtime header, sidebar and login screen use `src/assets/Tula Carbon Dot Grid Logo.png` as requested. The older `src/assets/Tula Carbon.png` and `Tula_Carbon_red.png` remain untouched. Obtain the approved vector plus inverse/monochrome exports for print and dark-surface use.

## Colour system

The implementation is in `src/index.css`. Keep the three token levels distinct: primitive values (`--color-*`), semantic roles (`--bg-*`, `--text-*`, `--status-*`, `--action-*`) and component states. Components should consume semantic tokens; do not add one-off UI colours.

### Primitives

| Token | Value | Intended use |
|---|---|---|
| Orange 300 / 500 / 700 | `#FFB27A` / `#F46A1F` / `#A83F00` | Brand expression; 300 and 500 decorative; 700 accessible text/icons |
| Violet 300 / 500 / 700 | `#A77AF4` / `#7A3FF2` / `#5625B8` | Brand expression; 700 primary UI action |
| Neutral 950 / 800 / 600 | `#15131A` / `#2B2533` / `#667085` | Text and dark surfaces |
| Neutral 200 / 100 / 050 / 000 | `#D8D2DF` / `#EEEAF5` / `#F7F5F2` / `#FFFFFF` | Borders, subtle surfaces, warm canvas and surface |

### Semantic colours and rules

| Meaning | Foreground | Background | Rule |
|---|---|---|---|
| Success / approved / verified | `#147A5A` | `#E9F5EF` | Pair colour with icon and label |
| Warning / pending attention | `#9A4F00` | `#FFF2E6` | Never communicate colour alone |
| Error / blocked | `#C63C46` | `#FCEDEF` | Pair with error icon and message |
| Information / submitted | `#2D63D2` | `#EDF3FF` | Pair with text label |
| Neutral / draft | `#667085` | `#F0EDF3` | Use neutral pill |

Scope chart convention: Scope 1 violet, Scope 2 orange, Scope 3 blue. Always display the scope name. Keep semantic assurance colours separate from scope colours. Orange 500 and light logo tones are decorative or use dark foregrounds; never set white body text on them. The app must not use green as a broad brand wash; reserve it for verified/success semantics.

Contrast targets: WCAG 2.2 AA, at least 4.5:1 for normal text and 3:1 for essential non-text controls and graph marks. Reference pairs from the strategy: Ink/Paper 16.9:1, Violet 700/white 8.9:1, Violet 500/white 5.5:1, Orange 700/white 6.2:1, success/white 5.3:1, danger/white 5.1:1, info/white 5.5:1. Recheck any changed pair in rendered UI.

### Themes

Light: canvas `#F7F5F2`, surface `#FFFFFF`, subtle `#EEEAF5`, primary text `#15131A`, secondary text `#667085`, default border `#D8D2DF`, primary action `#5625B8`.

Dark: canvas `#111016`, surface `#1B1822`, elevated `#251F2C`, primary text `#F6F3FA`, secondary `#C8C1D0`, required boundary `#71657F` or stronger, primary action `#A78BFA`, orange accent `#FF8A3D`. Select with `data-theme="dark"`; theme tokens are defined, though a user-facing theme switch is not yet wired.

## Typography

- Product/UI: IBM Plex Sans; reports and long-form: IBM Plex Sans with restrained IBM Plex Serif; IDs, factor codes and formulas: IBM Plex Mono.
- Fallbacks: Noto Sans and Noto Sans Mono, then system families. Keep the approved wordmark as artwork; never typeset it in the UI font.
- Scale (size/line height, px): Display XL 52/58 500; Display 40/46 500; H1 32/38 600; H2 24/30 600; H3 20/26 600; body large 16/24 400; body 14/20 400; UI/table 13/18 400–500; label 12/16 500; caption 11/16 400.
- Use tabular numerals for KPIs, financial/emissions columns and comparison values. Use IBM Plex Mono for identifiers such as `ACT-2026-0812`, factor IDs and formulas.

## Product foundations

- **Spacing:** 4px base; scale 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.
- **Radii:** 6px controls, 8px inputs/cards, 12px major cards, 16px marketing surfaces. Avoid consumer-fintech pill geometry except for status chips.
- **Elevation:** rare; prefer borders and surface contrast. Level 1 `0 1px 2px rgba(21,19,26,.06)`, level 2 `0 4px 12px rgba(21,19,26,.08)`, modal `0 16px 40px rgba(21,19,26,.16)`.
- **Motion:** controls 120–180ms, panels 200–240ms; honour `prefers-reduced-motion`.
- **Icons:** 20px default, 1.75–2px stroke. Use operational objects (meter, facility, evidence, calculator, factor, lock, route, target, supplier, review); avoid generic leaf imagery.
- **Responsive:** ≥1440 expanded enterprise; 1200–1439 desktop; 1024–1199 compact desktop/tablet landscape; 768–1023 tablet; <768 task-focused mobile. Mobile prioritises approvals, evidence upload, facility entry, anomaly resolution and executive status rather than a squeezed ledger.

## Product architecture and navigation

Long-term product layers:

1. **Carbon Ledger:** activity records, organisational boundaries, source documents, units and ownership.
2. **Calculation Engine:** factors, methods, GWPs, conversions, scope logic and versioning.
3. **Assurance Graph:** evidence lineage, approvals, comments, exceptions and audit trail.
4. **Disclosure Hub:** ISSB, ESRS, BRSR, GHG Protocol, custom reports and export mappings.
5. **Decarbonisation Studio:** targets, scenarios, marginal abatement, initiatives, budgets and forecasts.
6. **Data & Integration Platform:** ERP, utility, travel, procurement, supplier, API, CSV and assisted mapping.

Organise workflows under Home (executive overview / My work); Inventory (ingestion, ledger, calculations, factors, boundaries); Assurance (evidence, review, exceptions, audit trail, period close); Decarbonise (targets, scenarios, initiatives, forecast, internal carbon price); Disclose (reports, framework mappings, disclosure workspace, exports); Administration (entities/facilities, users/roles, integrations, methodologies, settings). Role-specific navigation can limit destinations, but keep the same workflow vocabulary.

Canonical path: **Collect → Map → Calculate → Validate → Review → Lock → Disclose**. Every reported record should offer lineage from source file and source row through quantity, conversion, factor and version, method, GWP version, CO₂e, reviewer/status and disclosure references.

## Dashboard and data patterns

The inventory overview should establish entity, reporting period, facility count and methodology profile, then one clear close-readiness measure. Follow with total emissions, inventory completeness, data quality and open assurance issues. Surface attention required (blockers, review items, missing evidence), then Scope 1/2/3 trend, year-on-year change, top sources and intensity, followed by close readiness for boundary, activity data, evidence, calculations, review and management sign-off. Never imply certification from a profile or methodology label.

Tables: sticky header and first column where useful; density presets; visible units; right-aligned numbers; persistent sort/filter state; row evidence marker; lineage drawer; bulk review; saved views; export; keyboard navigation; error summary; visible focus. Charts need a table equivalent or downloadable data where appropriate; give essential lines, markers and bars adequate contrast. Use colour plus labels and, for many series, shape/pattern.

Component inventory: buttons and icon buttons; inputs/selects/comboboxes; date/reporting period selector; segmented control; checkbox/radio/switch; file and bulk upload; mapping stepper; banners/alerts/inline validation; status chips; tabs/accordions; cards/metric tiles; data tables/charts; side panels/modals; command/search; breadcrumbs/pagination; empty/skeleton/permission states; audit timeline; evidence viewer; comment thread; formula viewer; factor picker; scope/category selector; organisation tree; scenario comparison; report builder. Define default, hover, active, focus-visible, selected, disabled, loading, error and read-only states where applicable. Keep status labels/icons alongside colour.

## Regulatory and environmental claims

Build for standards and reporting workflows. Never claim Tula Carbon itself is ISO certified, GHG Protocol certified or CSRD compliant absent a precise, independently supportable basis. Standards and methodologies require version metadata. Keep boundaries, exclusions, factors, methods and assumptions explicit and versioned. Make framework profiles configuration-driven and reporting-year-specific; do not hard-code a static CSRD checklist. Keep corporate inventory and product carbon footprint models distinct. Support India BRSR as its own profile. Minimise personal data in evidence workflows, separate user identity from emissions records where practical, and provide retention and tenant-access controls.

Preferred statements include “Calculated using GHG Protocol-aligned methodology version X”, an evidenced share of records with sources attached, or a scoped, period-specific change with its boundary stated. Avoid “100% green”, unqualified “carbon neutral”, “net zero platform”, unsupported certification and “zero-emission” claims where offsets or avoided emissions are doing the work. Use the claim chain **claim → scope → method → period → evidence → qualifier**. Each public environmental claim needs an owner, evidence, period, methodology and review/expiry date.

## Art direction and applications

Present a modern enterprise data company working on climate, not a generic eco brand. Secondary graphics may use six-column modular grids, paired warm/cool fields, data-derived dot matrices, restrained diffusion, evidence paths and contextual industrial photography with negative space. Avoid seedling hands, glowing earths, context-free turbines, leaf-on-circuit imagery and neon-green eco-tech. Show real plants, warehouses, energy systems, logistics, materials, operators, meters, finance teams and supply chains.

Stationery: warm stock, Ink wordmark and full-colour mark, restrained violet rule/orange edge. Signage: Ink or violet with full-colour dots and white wordmark; no oversized gradients. Deck: Paper and Ink, one strong brand field per slide, orange emphasis and violet structure. App: neutral-first, violet primary actions, orange accent. Reports/exports: archival white, restrained violet section markers, dates and methodology metadata; exports prioritise lineage and timestamps over decoration. App icon uses the exact symbol, centred, on Ink/violet/warm white.

## Governance and rollout

Every new UI colour uses tokens. Every new component receives keyboard, focus, contrast and responsive review. Every reporting framework integration carries version metadata. Each release includes a changelog and migration notes. Assign explicit owners for brand, design system, climate methodology and regulatory interpretation.

1. **Foundation:** positioning, messaging, logo rules, colour, type, grid, imagery, accessibility.
2. **Product system:** variables, components, patterns, table/chart system and themes.
3. **Core workflows:** dashboard, ingestion, calculation, review, audit, reporting and decarbonisation.
4. **Rollout/governance:** website, deck, reports, templates, documentation, QA and ownership.

Success measures: six-dot unaided recognition and off-brand asset reduction; ingestion completion, blocker resolution and review-cycle time, evidence completeness, period-close time, audit-query turnaround, support-free completion and accessibility defects; trial-to-demo conversion, enterprise wins, facility/entity expansion, active users, retention and reduced manual reporting effort.

## Implementation status

- Implemented: global light/dark token foundations, IBM Plex stack, warm light canvas, semantic status palette, reduced-motion rules, six-dot PNG in the runtime, rounded desktop app frame with a light-neutral sidebar, compact outline-icon navigation grouped into Main, Workspace and Support, account role switching, and removal of the global top bar.
- Dashboard: reference-led inventory view with search and facility controls, workflow status cards, scope/status filters, and a compact sortable activity table.
- Still needed: a user-facing dark theme switch, a fuller close-readiness model backed by boundary/calculation/review/sign-off data, and theme-aware chart styling in remaining screens.
- Asset governance: the runtime uses `src/assets/Tula Carbon Dot Grid Logo.png`; preserve the original vector master when available and prepare inverse/monochrome exports for dark surfaces and print.

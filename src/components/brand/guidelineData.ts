export interface Swatch {
  name: string;
  hex: string;
  detail?: string;
}

export const paletteGroups: { name: string; description: string; swatches: Swatch[] }[] = [
  {
    name: 'Core',
    description: 'Primary colors for brand communications and expression.',
    swatches: [
      { name: 'Peach Orange', hex: '#FFB27A', detail: 'PMS 1565 C' },
      { name: 'Orange', hex: '#FF8A00', detail: 'PMS 151 C' },
      { name: 'Deep Orange', hex: '#FF5A00', detail: 'PMS 1655 C' },
      { name: 'Lavender', hex: '#D6B4FF', detail: 'PMS 2667 C' },
      { name: 'Violet', hex: '#9C58FF', detail: 'PMS 2655 C' },
      { name: 'Deep Violet', hex: '#6A00FF', detail: 'PMS 2665 C' },
    ],
  },
  {
    name: 'Secondary',
    description: 'Supporting hues for highlights, depth, and variety.',
    swatches: [
      { name: 'Warm Sand', hex: '#FFF4E6', detail: 'PMS 9224 C' },
      { name: 'Sunshine', hex: '#FFE39A', detail: 'PMS 1205 C' },
      { name: 'Coral', hex: '#FFB3B3', detail: 'PMS 1767 C' },
      { name: 'Lilac', hex: '#EBD9FF', detail: 'PMS 2635 C' },
      { name: 'Cool Gray', hex: '#9CA3AF', detail: 'PMS Cool Gray 6 C' },
      { name: 'Slate Purple', hex: '#7253B3', detail: 'PMS 266 C' },
    ],
  },
  {
    name: 'Tints',
    description: 'Light colors for backgrounds and subtle emphasis.',
    swatches: [
      { name: 'Peach Tint', hex: '#FFF0E5', detail: 'PMS 9241 C' },
      { name: 'Orange Tint', hex: '#FFE7CC', detail: 'PMS 7506 C' },
      { name: 'Apricot Tint', hex: '#FFF2D9', detail: 'PMS 9184 C' },
      { name: 'Lavender Tint', hex: '#F6EDFF', detail: 'PMS 2635 C' },
      { name: 'Violet Tint', hex: '#F0E6FF', detail: 'PMS 2705 C' },
      { name: 'Ultra Tint', hex: '#FAF7FF', detail: 'PMS 663 C' },
    ],
  },
  {
    name: 'Shades',
    description: 'Deeper colors for contrast and hierarchy.',
    swatches: [
      { name: 'Orange Shade', hex: '#8A3E00', detail: 'PMS 1545 C' },
      { name: 'Deep Orange Shade', hex: '#B34700', detail: 'PMS 1675 C' },
      { name: 'Aubergine Shade', hex: '#4C0075', detail: 'PMS 2617 C' },
      { name: 'Royal Violet Shade', hex: '#5E00B3', detail: 'PMS 2665 C' },
      { name: 'Indigo Shade', hex: '#290070', detail: 'PMS 2766 C' },
      { name: 'Ink Violet Shade', hex: '#1A0F33', detail: 'PMS 2768 C' },
    ],
  },
];

export const productColors: Swatch[] = [
  { name: 'brand.orange.300', hex: '#FFB27A', detail: 'Backgrounds and illustration' },
  { name: 'brand.orange.500', hex: '#F46A1F', detail: 'Expressive orange' },
  { name: 'brand.orange.700', hex: '#A83F00', detail: 'Orange text and icons' },
  { name: 'brand.violet.300', hex: '#A77AF4', detail: 'Illustration and decorative accents' },
  { name: 'brand.violet.500', hex: '#7A3FF2', detail: 'Expressive violet' },
  { name: 'brand.violet.700', hex: '#5625B8', detail: 'Primary interaction and focus' },
  { name: 'neutral.950', hex: '#15131A', detail: 'Ink and primary text' },
  { name: 'neutral.800', hex: '#2B2533', detail: 'Secondary dark surfaces' },
  { name: 'neutral.600', hex: '#667085', detail: 'Muted text' },
  { name: 'neutral.200', hex: '#D8D2DF', detail: 'Borders' },
  { name: 'neutral.100', hex: '#EEEAF5', detail: 'Subtle surfaces' },
  { name: 'neutral.050', hex: '#F7F5F2', detail: 'Warm canvas' },
  { name: 'neutral.000', hex: '#FFFFFF', detail: 'Surface' },
];

export const statusColors: Swatch[] = [
  { name: 'Success / approved', hex: '#147A5A', detail: 'Pair with an icon and label' },
  { name: 'Warning / pending attention', hex: '#9A4F00', detail: 'Add a text cue' },
  { name: 'Error / blocked', hex: '#C63C46', detail: 'Pair with an error icon and message' },
  { name: 'Information / submitted', hex: '#2D63D2', detail: 'Pair with a label' },
  { name: 'Neutral / draft', hex: '#667085', detail: 'Use a neutral pill' },
];

export const themeColors: { name: string; swatches: Swatch[] }[] = [
  { name: 'Light theme', swatches: [
    { name: 'Canvas', hex: '#F7F5F2' },
    { name: 'Surface', hex: '#FFFFFF' },
    { name: 'Subtle surface', hex: '#EEEAF5' },
    { name: 'Primary text', hex: '#15131A' },
    { name: 'Secondary text', hex: '#667085' },
    { name: 'Default border', hex: '#D8D2DF' },
    { name: 'Primary action', hex: '#5625B8' },
  ] },
  { name: 'Dark theme', swatches: [
    { name: 'Canvas', hex: '#111016' },
    { name: 'Surface', hex: '#1B1822' },
    { name: 'Elevated surface', hex: '#251F2C' },
    { name: 'Primary text', hex: '#F6F3FA' },
    { name: 'Secondary text', hex: '#C8C1D0' },
    { name: 'Essential boundary', hex: '#71657F' },
    { name: 'Primary action', hex: '#A78BFA' },
    { name: 'Orange accent', hex: '#FF8A3D' },
  ] },
];

export const typeScale = [
  { role: 'Display XL', size: 52, leading: 58, weight: 500 },
  { role: 'Display', size: 40, leading: 46, weight: 500 },
  { role: 'H1', size: 32, leading: 38, weight: 600 },
  { role: 'H2', size: 24, leading: 30, weight: 600 },
  { role: 'H3', size: 20, leading: 26, weight: 600 },
  { role: 'Body L', size: 16, leading: 24, weight: 400 },
  { role: 'Body', size: 14, leading: 20, weight: 400 },
  { role: 'UI / table', size: 13, leading: 18, weight: 400, weights: '400–500' },
  { role: 'Label', size: 12, leading: 16, weight: 500 },
  { role: 'Caption', size: 11, leading: 16, weight: 400 },
];

export const spacing = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64];
export const radii = [
  { size: 6, role: 'Controls' }, { size: 8, role: 'Inputs and compact cards' },
  { size: 12, role: 'Major cards' }, { size: 16, role: 'Marketing surfaces' },
];

export const logoMinimums = [
  ['Six-dot symbol, digital', '24 px high'],
  ['Full lockup, digital', '112 px wide'],
  ['Symbol, print', '8 mm high'],
  ['Full lockup, print', '28 mm wide'],
  ['Favicon master', '32 × 32 px or larger'],
  ['App icon artwork', 'Symbol centered at 55–62% of icon width'],
];

export const tokenLayers = [
  { name: 'Primitive', detail: 'Raw values shared across themes and components.', samples: ['color.brand.violet.700', 'color.neutral.050', 'space.4', 'radius.8'] },
  { name: 'Semantic', detail: 'Role-based values assigned per theme.', samples: ['bg.canvas', 'text.primary', 'border.default', 'action.primary.bg', 'status.error.fg'] },
  { name: 'Component', detail: 'Tokens for specific components and interaction states.', samples: ['button.primary.bg.default', 'button.primary.bg.hover', 'table.row.bg.selected', 'input.border.error'] },
];

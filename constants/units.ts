export interface UnitOption {
  label: string;
  value: string;
}

export interface UnitGroup {
  heading: string;
  options: UnitOption[];
}

export const UNIT_GROUPS: UnitGroup[] = [
  {
    heading: 'Weight',
    options: [
      { label: 'Kilogram (kg)', value: 'kg' },
      { label: 'Gram (g)', value: 'g' },
      { label: 'Pound (lb)', value: 'lb' },
      { label: 'Ounce (oz)', value: 'oz' },
    ],
  },
  {
    heading: 'Volume',
    options: [
      { label: 'Litre (L)', value: 'litre' },
      { label: 'Millilitre (ml)', value: 'ml' },
      { label: 'Gallon', value: 'gallon' },
      { label: 'Quart', value: 'quart' },
      { label: 'Pint', value: 'pint' },
      { label: 'Fluid Ounce (fl oz)', value: 'fl-oz' },
    ],
  },
  {
    heading: 'Packaging',
    options: [
      { label: 'Unit', value: 'unit' },
      { label: 'Each', value: 'each' },
      { label: 'Piece', value: 'piece' },
      { label: 'Bottle', value: 'bottle' },
      { label: 'Box', value: 'box' },
      { label: 'Bundle', value: 'bundle' },
      { label: 'Case', value: 'case' },
      { label: 'Dozen', value: 'dozen' },
      { label: 'Keg', value: 'keg' },
      { label: 'Loaf', value: 'loaf' },
      { label: 'Rack', value: 'rack' },
      { label: '4-Pack', value: '4-pack' },
      { label: '6-Pack', value: '6-pack' },
    ],
  },
];

/** Flat list for backward-compat (Select component, mock data, etc.) */
export const UNIT_OPTIONS: UnitOption[] = UNIT_GROUPS.flatMap(g => g.options);

/** Quick lookup for display: value → label */
export const UNIT_LABEL_MAP: Record<string, string> = Object.fromEntries(
  UNIT_OPTIONS.map(o => [o.value, o.label]),
);
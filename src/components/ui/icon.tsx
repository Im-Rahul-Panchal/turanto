import { Lucide, type LucideIconName } from '@react-native-vector-icons/lucide';

import { colors } from '@/theme';

type IconProps = {
  name: LucideIconName;
  size?: number;
  color?: string;
};

/**
 * Single wrapper around the Lucide icon set.
 *
 * Icons are referenced by a typed name, so a typo is a compile error rather than
 * a blank square at runtime. Routing every glyph through here also means one
 * place to swap the icon family later.
 */
export function Icon({ name, size = 20, color = colors.text }: IconProps) {
  return <Lucide name={name} size={size} color={color} />;
}

export type { LucideIconName };

import { Image, type ImageSourcePropType, type StyleProp, type ImageStyle } from 'react-native';
import { useState } from 'react';

import { getImage, type ImageKey } from '@/lib/images';
import { colors, radius } from '@/theme';

type ProductImageProps = {
  imageKey: ImageKey;
  /** Required for accessibility — pass the product name. */
  accessibilityLabel: string;
  width?: number;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ImageStyle>;
};

/**
 * Image for catalogue content.
 *
 * All imagery resolves through the central asset registry, so replacing a
 * placeholder later is a one-line change in `src/assets/images.ts`. The tinted
 * background means a slow or failed image still reads as a product tile rather
 * than a broken box.
 */
export function ProductImage({
  imageKey,
  accessibilityLabel,
  width,
  height,
  borderRadius = radius.md,
  style,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const source: ImageSourcePropType = getImage(imageKey);

  return (
    <Image
      source={source}
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      resizeMode="cover"
      onError={() => setFailed(true)}
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: failed ? colors.surfaceMuted : colors.surfaceSunken,
        },
        style,
      ]}
    />
  );
}

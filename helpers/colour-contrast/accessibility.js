import { contrastColors, contrastRGB } from './contrast.js';

export const contrastNormalText = 4.5;
export const contrastLargeTxt = 3;
export const contrastNonText = 3;

// takes 2 color strings
export function isAccessible(color1, color2, myContrastMin) {
	return contrastColors(color1, color2) >= (myContrastMin || contrastNormalText);
}

// takes 2 RGBColor objects
export function isAccessibleRGB(rgb1, rgb2, myContrastMin) {
	return contrastRGB(rgb1, rgb2) >= (myContrastMin || contrastNormalText);
}

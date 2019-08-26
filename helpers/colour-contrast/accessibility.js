import { contrastColors } from './contrast.js';

const contrastMin = 4.5;

export const contrastNormalText = contrastMin;
export const contrastLargeTxt = 3;
export const contrastNonText = 3;

// takes 2 color strings
export function isAccessible(color1, color2, myContrastMin) {
	return contrastColors(color1, color2) >= (myContrastMin || contrastMin);
}

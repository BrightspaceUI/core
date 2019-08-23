import { contrastColors, contrastRGB } from './contrast.js';

const contrastMin = 4.5;

// takes 2 color strings
function isAccessible(color1, color2, myContrastMin) {
	return contrastColors(color1, color2) >= (myContrastMin || contrastMin);
}

// takes 2 RGBColor objects
function isAccessibleRGB(rgb1, rgb2, myContrastMin) {
	return contrastRGB(rgb1, rgb2) >= (myContrastMin || contrastMin);
}

export {
	isAccessible,
	isAccessibleRGB,
	contrastMin
};

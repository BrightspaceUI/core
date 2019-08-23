import luminance from './luminance.js';
import RGBColor from './rgb.js';

// takes 2 RGBColor objects
function contrastRGB(rgb1, rgb2) {
	let contrast = (luminance(rgb1) + 0.05) / (luminance(rgb2) + 0.05);
	if (contrast < 1) {
		contrast = 1 / contrast;
	}
	return contrast;
}

// takes 2 color strings
function contrastColors(color1, color2) {
	const rgb1 = new RGBColor(color1),
		rgb2 = new RGBColor(color2);
	return contrastRGB(rgb1, rgb2);
}

export {
	contrastRGB,
	contrastColors
};

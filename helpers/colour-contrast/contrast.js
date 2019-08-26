import luminance from './luminance.js';
import RGBColor from './rgb.js';

// takes 2 color strings
export function contrastColors(color1, color2) {
	const rgb1 = new RGBColor(color1),
		rgb2 = new RGBColor(color2);
	let contrast = (luminance(rgb1) + 0.05) / (luminance(rgb2) + 0.05);
	if (contrast < 1) {
		contrast = 1 / contrast;
	}
	return contrast;
}

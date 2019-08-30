function RGBColor(hex) {
	const regex = /^#([a-f0-9]{6})$/i;
	const valid = regex.test(hex);
	if (!valid) {
		return null;
	}
	return {
		r: parseInt(hex.substring(1, 3), 16),
		g: parseInt(hex.substring(3, 5), 16),
		b: parseInt(hex.substring(5), 16)
	};
}

// takes 1 RGBColor object
function luminance({ r, g, b }) {
	const a = [r, g, b].map(v => {
		v /= 255;
		return v <= 0.03928 ?
			v / 12.92 :
			Math.pow((v + 0.055) / 1.055, 2.4);
	});
	return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrastColors(color1, color2) {
	const rgb1 = new RGBColor(color1),
		rgb2 = new RGBColor(color2);
	if (!rgb1 || rgb1.r === undefined) {
		throw new Error(`Invalid HEX colour: ${color1}`);
	} else if (!rgb2 || rgb2.r === undefined) {
		throw new Error(`Invalid HEX colour: ${color2}`);
	}
	let contrast = (luminance(rgb1) + 0.05) / (luminance(rgb2) + 0.05);
	if (contrast < 1) {
		contrast = 1 / contrast;
	}
	return contrast;
}

const contrastMin = 4.5;

export const contrastNormalText = contrastMin;
export const contrastLargeTxt = 3;
export const contrastNonText = 3;

// takes 2 HEX color strings
export function isColorAccessible(color1, color2, myContrastMin) {
	return contrastColors(color1, color2) >= (myContrastMin || contrastMin);
}

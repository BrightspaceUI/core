export function formatHex(rgb) {
	let r = rgb.r.toString(16);
	let g = rgb.g.toString(16);
	let b = rgb.b.toString(16);

	if (r.length === 1) r = "0" + r;
	if (g.length === 1) g = "0" + g;
	if (b.length === 1) b = "0" + b;

	return `#${r}${g}${b}`;
}

export function formatHsl(hsl) {
	return `hsl(${hsl.h}, ${hsl.s.toFixed(1)}%, ${hsl.l.toFixed(1)}%)`;
}

export function formatRgb(rgb) {
	return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

export function convertHSLToRGB(hsl) {

	let h = hsl.h;
	let s = hsl.s / 100;
	let l = hsl.l / 100;

	// strip label and convert to degrees (if necessary)
	//if (h.indexOf("deg") > -1)
	//	h = h.substr(0,h.length - 3);
	//else if (h.indexOf("rad") > -1)
	//	h = Math.round(h.substr(0,h.length - 3) / (2 * Math.PI) * 360);
	//else if (h.indexOf("turn") > -1)
	//	h = Math.round(h.substr(0,h.length - 4) * 360);
	// keep hue fraction of 360 if ending up over
	if (h >= 360)
		h %= 360;

	let c = (1 - Math.abs(2 * l - 1)) * s,
		x = c * (1 - Math.abs((h / 60) % 2 - 1)),
		m = l - c/2,
		r = 0,
		g = 0,
		b = 0;

	if (0 <= h && h < 60) {
		r = c; g = x; b = 0;
	} else if (60 <= h && h < 120) {
		r = x; g = c; b = 0;
	} else if (120 <= h && h < 180) {
		r = 0; g = c; b = x;
	} else if (180 <= h && h < 240) {
		r = 0; g = x; b = c;
	} else if (240 <= h && h < 300) {
		r = x; g = 0; b = c;
	} else if (300 <= h && h < 360) {
		r = c; g = 0; b = x;
	}

	r = Math.round((r + m) * 255);
	g = Math.round((g + m) * 255);
	b = Math.round((b + m) * 255);

	return { r: r, g: g, b: b };
}

export function convertRGBToHSL(rgb) {
	if (!rgb) throw new Error('RGB value required');
	if (rgb.r === undefined) rgb = parseRGB(rgb);
	if (rgb.r === undefined) throw new Error(`Invalid RGB colour: ${rgb}`);

	// make r, g, and b fractions of 1
	const r = rgb.r / 255;
	const g = rgb.g / 255;
	const b = rgb.b / 255;

	// find greatest and smallest channel values
	const cmin = Math.min(r, g, b);
	const cmax = Math.max(r, g, b);
	const delta = cmax - cmin;
	let h = 0, s = 0, l = 0;

	// calculate hue
	// no difference
	if (delta === 0) h = 0;
	// red is max
	else if (cmax === r) h = ((g - b) / delta) % 6;
	// green is max
	else if (cmax === g) h = (b - r) / delta + 2;
	// blue is max
	else h = (r - g) / delta + 4;

	h = Math.round(h * 60);

	// make negative hues positive behind 360°
	if (h < 0) h += 360;

	// calculate lightness
	l = (cmax + cmin) / 2;

	// calculate saturation
	s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

	// multiply l and s by 100
	s = +(s * 100).toFixed(1);
	l = +(l * 100).toFixed(1);

	return { h: h, s: s, l: l };
}

export function convertRGBAToHSLA(rgba) {
	if (!rgba) throw new Error('RGBA value required');
	if (rgba.r === undefined) rgba = parseRGBA(rgba);
	if (rgba.r === undefined) throw new Error(`Invalid RGBA colour: ${rgba}`);

	const hsla = convertRGBToHSL(rgba);
	hsla.a = rgba.a;
	return hsla;
}

export function getApproxAlternateColor(rgb, rgbRef, rgbNewRef) {
	const contrast = getColorContrast(rgb, rgbRef);
	//console.log('approx contrast', contrast);
	const newRefLuminance = getLuminance(rgbNewRef);
	//console.log('approx alt ref luminance', newRefLuminance);
	const newLuminance = getAlternateLuminance(contrast, newRefLuminance);
	//console.log('approx alt luminance', newLuminance);
	const newLightness = getLightnessFromLuminance(newLuminance);

	const hsl = convertRGBToHSL(rgb);
	hsl.l = newLightness;
	return hsl;
}

export function getAlternateColor(rgb, rgbRef, altRgbRef) {

	const contrast = getColorContrast(rgb, rgbRef);
	const hsl = convertRGBToHSL(rgb);
	const hslRef = convertRGBToHSL(rgbRef);

	const altHsl = getApproxAlternateColor(rgb, rgbRef, altRgbRef);
	let altContrast = getColorContrast(convertHSLToRGB(altHsl), altRgbRef);
	let diffContrast = altContrast - contrast;
	if (Math.abs(diffContrast) < 0.01) return altHsl;
	if ((diffContrast < 0 && altHsl.l === 100) || (diffContrast < 0) && altHsl.l === 0) return altHsl;

	//console.log('approx', diffContrast);

	const altHslLighter = { h: altHsl.h, s: altHsl.s, l: altHsl.l + 0.2 };
	const diffContrastLighter = getColorContrast(convertHSLToRGB(altHslLighter), altRgbRef) - contrast;
	//console.log('lighter', diffContrastLighter);

	const altHslDarker = { h: altHsl.h, s: altHsl.s, l: altHsl.l - 0.2 };
	const diffContrastDarker = getColorContrast(convertHSLToRGB(altHslDarker), altRgbRef) - contrast;
	//console.log('darker', diffContrastDarker);

	let increment;
	if (diffContrast > 0) {
		// if the approx is positive and the light is even more positive then we need to darken
		if (diffContrastLighter >= diffContrast) increment = -1;
		else increment = 1;
	} else {
		// if the approx is negative and the light is better then we need to lighten
		if (diffContrastLighter >= diffContrast && diffContrastLighter > diffContrastDarker) increment = 1;
		else increment = -1;
	}

	//if (increment === 1) console.log('lighten, starting at: ', altHsl.l);
	//else console.log('darken, starting at: ', altHsl.l);

	let iteration = 0;
	let prevDiffContrast = null;
	while(Math.abs(diffContrast) >= 0.01) {
		iteration += 1;
		prevDiffContrast = diffContrast;

		altHsl.l += increment;
		altContrast = getColorContrast(convertHSLToRGB(altHsl), altRgbRef);
		diffContrast = altContrast - contrast;

		//console.log('alternate contrast', iteration, altContrast, diffContrast.toFixed(3), altHsl.l.toFixed(3));
		if (Math.sign(diffContrast) !== Math.sign(prevDiffContrast)) {
			if (altContrast < contrast) {
				altHsl.l -= increment;
			}
			break;
		}

		if (iteration === 100) break;
	}

	return altHsl;
}

export function getColorContrast(rgb1, rgb2) {
	if (!rgb1 || rgb1.r === undefined) {
		throw new Error(`Invalid colour: ${color1}`);
	} else if (!rgb2 || rgb2.r === undefined) {
		throw new Error(`Invalid colour: ${color2}`);
	}
	let contrast = (getLuminance(rgb1) + 0.05) / (getLuminance(rgb2) + 0.05);
	if (contrast < 1) {
		contrast = 1 / contrast;
	}
	return contrast;
}

//C = (L(light) + 0.05) / (L(dark) + 0.05)

export function getAlternateLuminance(contrast, luminance) {
	let tempLuminance;
	if (luminance >= 0.5) {
		tempLuminance = ((luminance + 0.05) / contrast) - 0.05;
	} else {
		tempLuminance = (contrast * (luminance + 0.05)) - 0.05;
	}
	if (tempLuminance > 1) return 1;
	if (tempLuminance < 0) return 0;
	return tempLuminance;
}

export function getLightnessFromLuminance(luminance) {
	// approx... return Math.pow(luminance, 0.43) * 100;
	// more accurate...
	if (luminance <= 0.008856) {
		return luminance * 903.3;
	} else {
		return Math.pow(luminance, (1/3)) * 116 - 16;
	}
}

export function getLuminance(rgb) {
	const a = [rgb.r, rgb.g, rgb.b].map(v => {
		v /= 255;
		return v <= 0.03928 ?
			v / 12.92 :
			Math.pow((v + 0.055) / 1.055, 2.4);
	});
	//console.log('luminance is: ', a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722);
	return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function parseRGB(rgb) {
	const regex = /^rgb\((((((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]),\s?)){2}|((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5])\s)){2})((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]))|((((([1-9]?\d(\.\d+)?)|100|(\.\d+))%,\s?){2}|((([1-9]?\d(\.\d+)?)|100|(\.\d+))%\s){2})(([1-9]?\d(\.\d+)?)|100|(\.\d+))%))\)$/i;
	const valid = regex.test(rgb);
	if (!valid) {
		return null;
	}
	const sep = rgb.indexOf(",") > -1 ? "," : " ";
	rgb = rgb.substr(4).split(")")[0].split(sep);

	// convert % to 0–255
	for (let R in rgb) {
		let r = rgb[R];
		if (r.indexOf("%") > -1) r = Math.round(r.substr(0, r.length - 1) / 100 * 255);
		rgb[R] = Number(r);
	}
	return { r: rgb[0], g: rgb[1], b: rgb[2] };
}

export function parseRGBA(rgba) {
	const regex = /^rgba\((((((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]),\s?)){3})|(((([1-9]?\d(\.\d+)?)|100|(\.\d+))%,\s?){3}))|(((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5])\s){3})|(((([1-9]?\d(\.\d+)?)|100|(\.\d+))%\s){3}))\/\s)((0?\.\d+)|[01]|(([1-9]?\d(\.\d+)?)|100|(\.\d+))%)\)$/i;
	const valid = regex.test(rgba);
	if (!valid) {
		return null;
	}
	const sep = rgba.indexOf(",") > -1 ? "," : " ";
	rgba = rgba.substr(5).split(")")[0].split(sep);

	// strip the slash if using space-separated syntax
	if (rgba.indexOf("/") > -1) rgba.splice(3,1);

	for (let R in rgba) {
		let r = rgba[R];
		if (r.indexOf("%") > -1) {
			let p = r.substr(0, r.length - 1) / 100;
			if (R < 3) r = Math.round(p * 255);
		}
		rgba[R] = Number(r);
	}
	return { r: rgba[0], g: rgba[1], b: rgba[2], a: rgba[3] };
}

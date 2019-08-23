/**
 * A class to parse color values
 * @author Stoyan Stefanov <sstoo@gmail.com>
 * @link   http://www.phpied.com/rgb-color-parser-in-javascript/
 * @license MIT license
 */
function RGBColor(color_string) {
	this.ok = false;

	// strip any leading #
	if (color_string.charAt(0) === '#') { // remove # if any
		color_string = color_string.substr(1, 6);
	}

	color_string = color_string.replace(/ /g, '');
	color_string = color_string.toLowerCase();

	// array of color definition objects
	const color_defs = [{
		re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
		example: ['rgb(123, 234, 45)', 'rgb(255,234,245)'],
		process: bits => [
			parseInt(bits[1]),
			parseInt(bits[2]),
			parseInt(bits[3])
		]
	}, {
		re: /^(\w{2})(\w{2})(\w{2})$/,
		example: ['#00ff00', '336699'],
		process: bits => [
			parseInt(bits[1], 16),
			parseInt(bits[2], 16),
			parseInt(bits[3], 16)
		]
	}, {
		re: /^(\w{1})(\w{1})(\w{1})$/,
		example: ['#fb0', 'f0f'],
		process: bits => [
			parseInt(bits[1] + bits[1], 16),
			parseInt(bits[2] + bits[2], 16),
			parseInt(bits[3] + bits[3], 16)
		]
	}];

	// search through the definitions to find a match
	for (let i = 0; i < color_defs.length; i++) {
		const re = color_defs[i].re;
		const processor = color_defs[i].process;
		const  bits = re.exec(color_string);
		if (bits) {
			const channels = processor(bits);
			this.r = channels[0];
			this.g = channels[1];
			this.b = channels[2];
			this.ok = true;
		}

	}

	// validate/cleanup values
	this.r = (this.r < 0 || isNaN(this.r)) ? 0 : ((this.r > 255) ? 255 : this.r);
	this.g = (this.g < 0 || isNaN(this.g)) ? 0 : ((this.g > 255) ? 255 : this.g);
	this.b = (this.b < 0 || isNaN(this.b)) ? 0 : ((this.b > 255) ? 255 : this.b);

	// some getters
	this.toRGB = () => `rgb(${this.r}, ${this.g}, ${this.b})`;
	this.toHex = () => {
		let r = this.r.toString(16);
		let g = this.g.toString(16);
		let b = this.b.toString(16);
		if (r.length === 1) r = `0${r}`;
		if (g.length === 1) g = `0${g}`;
		if (b.length === 1) b = `0${b}`;
		return `#${r}${g}${b}`;
	};

	// help
	this.getHelpXML = () => {

		const examples = new Array();
		// add regexps
		for (let i = 0; i < color_defs.length; i++) {
			const example = color_defs[i].example;
			for (let j = 0; j < example.length; j++) {
				examples[examples.length] = example[j];
			}
		}

		const xml = document.createElement('ul');
		xml.setAttribute('id', 'rgbcolor-examples');
		for (let i = 0; i < examples.length; i++) {
			try {
				const list_item = document.createElement('li');
				const list_color = new RGBColor(examples[i]);
				const example_div = document.createElement('div');
				example_div.style.cssText =
					`margin: 3px; border: 1px solid black; background: ${list_color.toHex()}; color: ${list_color.toHex()}`;
				example_div.appendChild(document.createTextNode('test'));
				const list_item_value = document.createTextNode(
					` ${examples[i]} -> ${list_color.toRGB()} -> ${list_color.toHex()}`
				);
				list_item.appendChild(example_div);
				list_item.appendChild(list_item_value);
				xml.appendChild(list_item);

			} catch (e) { console.error(e); }
		}
		return xml;

	};

}

export default RGBColor;

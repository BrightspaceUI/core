import { fonts, importUrl } from '../components/typography/typography.js';

if (!document.head.querySelector('.d2l-typography-font-face-preload')) {
	for (const type of Object.keys(fonts)) {

		const preload = document.createElement('link');
		preload.rel = 'preload';
		preload.className = 'd2l-typography-font-face-preload';
		preload.href = `${new URL(`${fonts[type]}.woff2`, importUrl)}`;
		preload.as = 'font';
		preload.crossOrigin = 'anonymous';
		document.head.appendChild(preload);
	}
}


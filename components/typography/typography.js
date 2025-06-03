import {
	_generateBlockquoteStyles,
	_generateBodyCompactStyles,
	_generateBodySmallStyles,
	_generateBodyStandardStyles,
	_generateHeading1Styles,
	_generateHeading2Styles,
	_generateHeading3Styles,
	_generateHeading4Styles,
	_generateLabelStyles,
	baseTypographyStyles
} from './styles.js';

if (!document.head.querySelector('#d2l-typography-font-face')) {
	const style = document.createElement('style');
	style.id = 'd2l-typography-font-face';
	style.textContent = `
		${baseTypographyStyles}
		${_generateBodyStandardStyles('.d2l-typography .d2l-body-standard', false)}
		${_generateBodyCompactStyles('.d2l-typography .d2l-body-compact', false)}
		${_generateBodySmallStyles('.d2l-typography .d2l-body-small', false)}
		${_generateLabelStyles('.d2l-typography .d2l-label-text', false)}
		${_generateHeading1Styles('.d2l-typography .d2l-heading-1')}
		${_generateHeading2Styles('.d2l-typography .d2l-heading-2')}
		${_generateHeading3Styles('.d2l-typography .d2l-heading-3')}
		${_generateHeading4Styles('.d2l-typography .d2l-heading-4')}
		${_generateBlockquoteStyles('.d2l-typography .d2l-blockquote')}
	`;
	document.head.appendChild(style);
}

import './demo-snippet.js';
import './code-view.js';
import '../colors/colors.js';
import '../typography/typography.js';

document.body.classList.add('d2l-typography');

export const showPage = async() => {
	if (document.fonts) {
		await document.fonts.ready;
	}
	document.body.removeAttribute('unresolved');
};

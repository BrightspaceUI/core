let mediaQuery;

const themes = Object.freeze({
	dark: 'dark',
	light: 'light',
	os: 'os'
});

export function setPreferredTheme(theme) {
	if (!themes[theme]) return;
	document.documentElement.dataset.preferredTheme = theme;
	resolveTheme();
}

function setTheme(theme) {
	document.documentElement.dataset.theme = theme;
}

function handleMediaQueryChange(e) {
	setTheme(e.matches ? themes.dark : themes.light);
}

function resolveTheme() {
	const preferredTheme = document.documentElement.dataset.preferredTheme ?? themes.light;
	if (preferredTheme === themes.os) {
		if (!mediaQuery) {
			mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
			mediaQuery.addEventListener?.('change', handleMediaQueryChange);
		}
		setTheme(mediaQuery.matches ? themes.dark : themes.light);
	} else {
		if (mediaQuery) {
			mediaQuery.removeEventListener?.('change', handleMediaQueryChange);
			mediaQuery = null;
		}
		setTheme(preferredTheme);
	}
}

resolveTheme();
resolveTheme();
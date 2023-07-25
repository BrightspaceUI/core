const pattern = type => `+(components|controllers|directives|helpers|mixins|templates)/**/*.${type}.js`;

export default {
	pattern,
	groups: [{
		name: 'aXe',
		files: pattern('axe'),
		browsers: ['chrome']
	}]
};

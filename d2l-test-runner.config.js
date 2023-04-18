const pattern = type => `+(components|controllers|directives|helpers|mixins|templates)/**/*.${type}.js`;

export default {
	pattern,
	vdiff: true,
	groups: [{
		name: 'aXe',
		files: pattern('axe'),
		browsers: ['chrome']
	}]
};

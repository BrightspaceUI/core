import { generateConfig } from './tools/web-test-runner-config.js';

export default generateConfig({
	pattern: type => `+(components|controllers|directives|helpers|mixins|templates)/**/*.${type}.js`
});

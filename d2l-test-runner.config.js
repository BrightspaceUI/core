import { env } from 'node:process';

export default {
	pattern: type => `**/test/*.${type}.js`,
	testReporting: !!env['CI']
};

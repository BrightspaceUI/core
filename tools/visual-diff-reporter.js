export function visualDiffReporter({ reportResults = true, reportProgress = false } = {}) {
	return {
		/**
		 * Called once when the test runner starts.
		 */
		start({ config, sessions, testFiles, browserNames, startTime }) {
			//console.log('runner start');
		},

		/**
		 * Called once when the test runner stops. This can be used to write a test
		 * report to disk for regular test runs.
		 */
		stop({ sessions, testCoverage, focusedTestFile }) {
			//console.log('runner stop');
		},

		/**
		 * Called when a test run starts. Each file change in watch mode
		 * triggers a test run.
		 *
		 * @param testRun the test run
		 */
		onTestRunStarted({ testRun }) {
			//console.log('testRun start');
		},

		/**
		 * Called when a test run is finished. Each file change in watch mode
		 * triggers a test run. This can be used to report the end of a test run,
		 * or to write a test report to disk in watch mode for each test run.
		 *
		 * @param testRun the test run
		 */
		onTestRunFinished({ testRun, sessions, testCoverage, focusedTestFile }) {
			//console.log('testRun finished');
		},

		/**
		 * Called when results for a test file can be reported. This is called
		 * when all browsers for a test file are finished, or when switching between
		 * menus in watch mode.
		 *
		 * If your test results are calculated async, you should return a promise from
		 * this function and use the logger to log test results. The test runner will
		 * guard against race conditions when re-running tests in watch mode while reporting.
		 *
		 * @param logger the logger to use for logging tests
		 * @param testFile the test file to report for
		 * @param sessionsForTestFile the sessions for this test file. each browser is a
		 * different session
		 */
		async reportTestFileResults({ logger, sessionsForTestFile, testFile }) {
			if (!reportResults) {
				return;
			}

			//logger.log(`Results for ${testFile}`);
			//logger.group();
			//logger.groupEnd();

		}
	};
}

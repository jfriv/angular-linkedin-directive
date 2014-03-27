// Karma configuration
// Generated on Thu Sep 26 2013 16:43:03 GMT-0400 (EDT)

module.exports = function (config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '',


        // frameworks to use
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'bower_components/jquery/dist/jquery.min.js',
            'lib/BrowserUtil.js',
            'bower_components/angular/angular.min.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'src/app.js',
            'src/**/*.js',
            'src/**/*-ptl.html',
            'test/*-spec.js'
        ],

        // due to a documented issue (https://github.com/karma-runner/karma/issues/558)
        // with socket.io on node 10.8/10.9, the default websocket polling does not work
        // with phantom at the moment. removing this from the the list fixes the issue
        //
        // default is ['websocket', 'flashsocket', 'xhr-polling', 'jsonp-polling']
        transports: ['flashsocket', 'xhr-polling', 'jsonp-polling'],

        // list of files to exclude
        exclude: [],

        preprocessors: {
            'src/**/*.js': 'coverage',
            'src/**/*-ptl.html': 'ng-html2js'
        },

        ngHtml2JsPreprocessor: {
            stripPrefix: 'src/',
            moduleName: 'templates'
        },

        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['progress', 'coverage', 'junit'],

        coverageReporter: {
            type: 'html',
            dir: 'target/coverage/'
        },

        junitReporter: {
            outputFile: 'target/coverage/cobertura.unit.xml'
        },

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS'],


        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};

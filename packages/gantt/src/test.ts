// This file is required by karma.conf.js and loads recursively all the .spec and framework files
import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

console.log('Default timezone：' + Intl.DateTimeFormat().resolvedOptions().timeZone);

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), {
    teardown: { destroyAfterEach: false }
});

import { Injectable } from '@angular/core';
import { ExampleLoader, ExampleLoadResult } from '@docgeni/template';
import { EXAMPLE_COMPONENTS } from './component-examples';

@Injectable()
export class LibExampleLoader extends ExampleLoader {

    enableIvy = false;

    'ngx-gantt/flat'() {
       return import('./components/ngx-gantt/flat/index');
    }

    load(exampleKey: string): Promise<ExampleLoadResult> {
        const example = EXAMPLE_COMPONENTS[exampleKey];
        return new Promise(resolve => {
            this[example.module.importSpecifier]().then(result => {
                resolve({
                    moduleType: result.EXAMPLES_MODULE,
                    componentType: result.EXAMPLE_COMPONENTS[exampleKey],
                    example
                });
            });
        });
    }
}

export const LIB_EXAMPLE_LOADER_PROVIDER = {
    provide: ExampleLoader,
    useClass: LibExampleLoader
};

'use strict';

module.exports = {
    entry: ['./index.js'],
    output: {
        path: 'dist',
        filename: 'hero.js',
    // export itself to a global var
        libraryTarget: 'umd',
    // name of the global var: "Foo"
        library: 'Hero'
    }
};

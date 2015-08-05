Chip3
=====

Chip3 is an interactive emulator of a simple computer for educational purposes.

  1. [Quick start](#quick-start)
  2. [Usage guide](#usage-guide)
  3. [Building and testing](#building-and-testing)
  4. [API reference](#api-reference)
  5. [Compatibility](#compatibility)
  6. [Roadmap](#roadmap)
  7. [Changelog](#changelog)
  8. [License](#license)


Quick start
-----------
...


Usage guide
-----------
...


API reference
-------------
[See the docs](docs/index.html)


Building and testing
--------------------
To test or work on the project, clone it and install dependencies:

    git clone https://github.com/zenoamaro/chip3.git
    npm install

You can run the automated test suite:

    $ npm test

And build an ES5 and a distributable version of the source:

    $ make build

A quick worflow for development, which reloads on every file change:

    $ make devel

More tasks are available on the [Makefile](Makefile):

    prepublish .... tests, rebuilds lib, dist and docs.
    build ......... builds and optimizes distributables.
    devel ......... rebuilds on file change.
    clean ......... removes the built artifacts.
    docs .......... compiles the docs from the sources.
    lint .......... lints the source.
    test .......... runs the unit tests.
    test-watch .... reruns the unit tests on file change.


Roadmap
-------
...


License
-------
The MIT License (MIT)

Copyright (c) 2015, zenoamaro <zenoamaro@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
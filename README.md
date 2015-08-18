Chip3
=====

Chip3 is an interactive simulator of a simple computer.

It simulates a Von Neumann 8-bit CPU with a 3-bit instruction set, a 5-bit memory addressing scheme, and one register.

Included is a workbench with inspectors to examine the state of the whole system down to clock cycle level, and supports time-travel to previous states aiding learning and debugging. The architecture is simple, declarative, and is separated between engine and inspector. The code itself is as simple as possible, and is laid out in a purely functional fashion.

[Try the live demo](https://zenoamaro.github.io/chip3).

  1. [Quick start](#quick-start)
  2. [Running programs](#running-programs)
  3. [Programmer's handbook](#programmers-handbook)
  4. [API reference](#api-reference)
  5. [Building and testing](#building-and-testing)
  6. [Compatibility](#compatibility)
  7. [Roadmap](#roadmap)
  8. [Changelog](#changelog)
  9. [License](#license)


Quick start
-----------
[Try the live demo](https://zenoamaro.github.io/chip3) to give the system a spin. Altough there is no way to input a custom program in the _Workbench_ at the moment, the machine comes preloaded with a sample "bouncy bits" program that can be fully stepped through and will output to console.

### What can I do with it?

The Workbench will initialize a pristine system with a program already loaded into memory and ready to run.

You can step through and fully inspect the system at every clock cycle, even mid-phase, and rewind execution to better understand the effects of the code on CPU and memory.

The Workbench is not yet feature-complete, but you can code and run your own programs as detailed under [Running programs](#running-programs). 

For a more detailed explanation of how the system is composed, how the CPU works and what opcodes are available, see the [Programmer's handbook](#programmers-handbook).


Running programs
----------------
To run your own programs, the easiest way is to clone the repository, build a runnable version, and edit the resulting `dist/index.html` replacing the provided program with your own.

    git clone https://github.com/zenoamaro/chip3.git && cd chip3
    npm install
    make build
    open dist/index.html

Another way is to install the package locally, and instance the workbench manually:

    npm install zenoamaro/chip3

~~~js
import {Workbench} from 'chip3';

Workbench.App.bootstrap(document.body, {
  program: [
    /*
    Bouncy bits
    -----------
    This program bounces a single bit inside the accumulator to the
    left and to the right, changing direction whenever it hits the
    bounds of the register.
    */

    /* 00000 */ 0b00110001, // init:    LD <current>
    /* 00001 */ 0b11100000, // output:  OUT
    /* 00010 */ 0b10010010, // bounds:  AND <first_last>
    /* 00011 */ 0b11000111, //          JZ [move]
    /* 00100 */ 0b00110000, // reverse: LD <direction>
    /* 00101 */ 0b00000010, //          NOT
    /* 00110 */ 0b01010000, //          ST <direction>
    /* 00111 */ 0b00110000, // move:    LD <direction>
    /* 01000 */ 0b11001100, //          JZ [right]
    /* 01001 */ 0b00110001, // left:    LD <current>
    /* 01010 */ 0b00001000, //          ROL
    /* 01011 */ 0b10101110, //          JMP [store]
    /* 01100 */ 0b00110001, // right:   LD <current>
    /* 01101 */ 0b00010000, //          ROR
    /* 01110 */ 0b01010001, // store:   ST <current>
    /* 01111 */ 0b10100001, //          JMP output
    /* 10000 */ 0b11111111, // data:    DATA <direction> 255
    /* 10001 */ 0b10000000, //          DATA <current> 128
    /* 10010 */ 0b10000001, //          DATA <first_last> 129
  ]
});
~~~


Programmer's handbook
-----------
Chip3 simulates a simple yet complete computer with the following features:

- a Von Neumann architecture, where code and data share the same address space and memory; code *is* data, so code is allowed to modify itself or be interchangeably interpreted as data.

- a 3-bit instruction set, giving a grand total of eight available instructions.

- a 5-bit addressing scheme allowing access to thirty-two 8-bit words of glorious memory.

- a single general-purpose 8-bit register named *accumulator*.

- internal registers to store current instruction, addressing, program counter, and to interface to the bus.

The CPU has a strict, non-pipelined instruction cycle consisting of:

  1. **the FETCH phase (always two clock cycles)**
     During this phase, memory is asked for the contents of the location at _program counter_ on the bus. The results are read and decoded on the next cycle.

  2. **the EXECUTION phase (up to two clock cycles)**
     The instruction is executed according to the contents of the registers, and will require one or two cycles depending on whether there is a memory read involved. Writing to memory requires only one cycle.

The following table describes the current instruction set:

| Opcode | Mnemonic | Operands | T | Function                            |
|--------|----------|----------|---|-------------------------------------|
| 000    | OPR      | operator | 1 | Operate on accumulator              |
| 001    | LD       | address  | 2 | Load memory into accumulator        |
| 010    | ST       | address  | 1 | Store accumulator into memory       |
| 011    | ADD      | address  | 2 | Add memory location to accumulator  |
| 100    | AND      | address  | 2 | Bitwise AND memory with accumulator |
| 101    | JMP      | address  | 1 | Inconditional jump                  |
| 110    | JZ       | address  | 1 | Jump if accumulator is zero         |
| 111    | OUT      |          | 1 | Output value of accumulator         |

The `operator` type of operand is a set of flags specifying operations to be run on the accumulator. Every operation whose flag is set will run, strictly in the order presented below. Zero flags set are practically equivalent to a `NOP` instruction, and are in fact disassembled as such.

| Operator | Mnemonic | Function                     |
|----------|----------|------------------------------|
| 00001    | CLR      | Clear accumulator            |
| 00010    | NOT      | One's complement accumulator |
| 00100    | INC      | Increment accumulator        |
| 01000    | ROL      | Rotate accumulator left      |
| 10000    | ROR      | Rotate accumulator right     |


API reference
-------------
[See the source-generated documentation](docs/index.html).


Building and testing
--------------------
To test or work on the project, clone it and install dependencies:

    git clone https://github.com/zenoamaro/chip3.git
    npm install

You can run the automated test suite like so (altough there are no tests yet):

    npm test

And build an ES5 and a distributable version of the source:

    make build

A quick worflow for development, which reloads on every file change:

    make devel

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
- [ ] A better bus implementation to move data around
- [ ] The ability to modify ram and cpu state in-place
- [ ] A better disassembler
- [ ] A working assembler
- [ ] Multiple CPU families or systems
- [ ] Proper I/O and devices


License
-------
The MIT License (MIT)

Copyright (c) 2015, zenoamaro <zenoamaro@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
# Build a Modern Computer from First Principles: From Nabd to Tetris

This project mainly involves documenting the process of learning the fundamental elements of computer systems and the code implemented after class.

All the lectures, project materials and tools can be accessed via the [official course website](https://www.nand2tetris.org/)。You can also watch it on [Coursera](https://www.coursera.org/learn/build-a-computer).

If you complete all the projects in this book, you will achieve the following:
- Build a fully functional computer (running on a simulator)
- Implement a programming language and its corresponding standard library
- Develop a simple compiler

Here is an example for when you want the final output to come out of MyChip, and also reuse some of the output:
```hdl
MyChip(a=a, b=b, out=out, out[0..7]=smallerInternalBus, out[0]=internalNode);
```
Here is an example for when you want to wire a constant value(0 or 1) into a pin:
```hdl
MyChip(..., a=false, ...);
MyChip(..., a=true, ...);
```

Working with registers and memeory:
- D: data register
- A: address/ data register
- M: the currently selected memory register, M = RAM[A]

Typical operations:

```hdl
// D = 10
@10
D = A

// D++
D = D + 1

// D = RAM[17]
@17
D = M

// RAM[17] = 0
@17
M = 0

// RAM[17] = 10
@10
D = A
@17
M = D

// RAM[5] = RAM[3]
@3
D = M
@5
M = D

// RAM[2] = RAM[0] + RAM[1]
@0
D = M
@1
D = D + M
@2
M = D

@6
0;JMP
```

Best Practice:
- Design the program using the pseudo code
- Write the program in assembly language
- Test the program (on paper) using a variable-value trace table


How to load the local multi.asm file in the Web IDE?
1. Go to the Assembler tab.

2. Click on "load file" in the source block, and load Mult.asm.

3. Now paste the contents of your local copy of Mult.asm into that browser copy of Mult.asm. Whatever you paste there will remain, similar to previous projects.

4. Click on "Translate all in the source block"

5. After it's translated, click on 'the CPU emulator" in the Binary Code block
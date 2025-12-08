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
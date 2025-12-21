// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/4/Fill.asm

// Runs an infinite loop that listens to the keyboard input. 
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel. When no key is pressed, 
// the screen should be cleared.

//// Replace this comment with your code.

(PRESS)
    @KBD
    D=M
    @255
    M=A
    @31
    M=A

    @WHITE
    D;JEQ

    @BLACK
    0;JMP


(BLACK)
    @SCREEN
    D=A
    @addr
    M=D // addr = screen base address
    @i
    M=0 // i = 0
    (BLACKROWLOOP)
        @i
        D=M
        @255
        D=D-M
        @BLACKEND
        D;JGT  // i > 255 goto black end

        @j
        M=0 // j = 0
        (BLACKCOLUMNLOOP)
            @j
            D=M
            @31
            D=D-M
            @BLACKCOLUMNEND
            D;JGT // j > 31 goto column end

            @addr
            D=M
            @j
            D=D+M
            A=D
            M=-1

            @j
            M=M+1 // j = j + 1   
            @BLACKCOLUMNLOOP
            0;JMP
        (BLACKCOLUMNEND)
            @NEXTROW
            0;JMP

    (NEXTROW)
        @i
        M=M+1 // i = i + 1
        @32
        D=A
        @addr
        M=D+M // addr = addr + 32
        @BLACKROWLOOP
        0;JMP

(BLACKEND)
    @PRESS
    0;JMP

(WHITE)
    @SCREEN
    D=A
    @addr
    M=D // addr = screen base address
    @i
    M=0 // i = 0
    (WHITEROWLOOP)
        @i
        D=M
        @255
        D=D-M
        @WHITEEND
        D;JGT  // i > 255 goto white end

        @j
        M=0 // j = 0
        (WHITECOLUMNLOOP)
            @j
            D=M
            @31
            D=D-M
            @WHITECOLUMNEND
            D;JGT // j > 31 goto column end

            @addr
            D=M
            @j
            D=D+M
            A=D
            M=0

            @j
            M=M+1 // j = j + 1   
            @WHITECOLUMNLOOP
            0;JMP
        (WHITECOLUMNEND)
            @WHITENEXTROW
            0;JMP

    (WHITENEXTROW)
        @i
        M=M+1 // i = i + 1
        @32
        D=A
        @addr
        M=D+M // addr = addr + 32
        @WHITEROWLOOP
        0;JMP

(WHITEEND)
    @PRESS
    0;JMP
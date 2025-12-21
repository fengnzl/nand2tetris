@SCREEN
D=A
@addr
M=D // addr = screen base address
@255
M=A
@31
M=A

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
    @BLACKEND
    0;JMP
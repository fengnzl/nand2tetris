@SCREEN
D=A
@addr
M=D // addr = SCREEN base address
@31
M=A // RAM[31] = 31

@j
M=0 // j = 0
(BLACKCOLUMNLOOP)
    @j
    D=M
    @31
    D=D-M
    @BLACKCOLUMNEND
    D;JGT // j > 31 goto end

    @addr
    D=M
    @j
    D=D+M       // D = SCREEN + j
    A=D        
    M=-1       

    @j
    M=M+1       // j++
    @BLACKCOLUMNLOOP
    0;JMP
(BLACKCOLUMNEND)
    @BLACKCOLUMNEND
    0;JMP
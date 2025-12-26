const fs = require("fs").promises;

class SymbolTable {
    constructor() {
        this.table = {
            R0: 0,
            R1: 1,
            R2: 2,
            R3: 3,
            R4: 4,
            R5: 5,
            R6: 6,
            R7: 7,
            R8: 8,
            R9: 9,
            R10: 10,
            R11: 11,
            R12: 12,
            R13: 13,
            R14: 14,
            R15: 15,
            SP: 0,
            LCL: 1,
            ARG: 2,
            THIS: 3,
            THAT: 4,
            SCREEN: 16384,
            KBD: 24576,
        };
        this.lCommandSet = new Set()
    }
    addLCommand(command) {
        this.lCommandSet.add(command)
    }
    isLCommand(symbol) {
        return this.lCommandSet.has(symbol)
    }
    addEntry(symbol, address) {
        this.table[symbol] = address;
    }
    contains(symbol) {
        return this.table[symbol] != undefined;
    }
    getAddress(symbol) {
        return this.table[symbol];
    }
}

class Parser {
    constructor() {
        this.info = "";
    }
    commandType(info) {
        this.info = info;
        if (info.startsWith("@")) {
            return "A_COMMAND";
        } else if (info.startsWith("(")) {
            return "L_COMMAND";
        } else {
            return "C_COMMAND";
        }
    }
    symbol(type) {
        if (type === "A_COMMAND") {
            return this.info.slice(1);
        } else if (type === "L_COMMAND") {
            return this.info.slice(1, -1);
        }
    }
    parseCCommand(info) {
        const [noJump, jump] = info.split(";");
        if (noJump.includes('=')) {
            const [dest, comp] = noJump.split("=");
            return [dest, comp, jump];
        } else {
            return [null, noJump, jump]
        }

    }
}
class Code {
    static DestObj = {
        M: "001",
        D: "010",
        MD: "011",
        A: "100",
        AM: "101",
        AD: "110",
        AMD: "111",
    };
    static JumpObj = {
        JGT: "001",
        JEQ: "010",
        JGE: "011",
        JLT: "100",
        JNE: "101",
        JLE: "110",
        JMP: "111",
    };
    static AZeroComp = {
        0: "101010",
        1: "111111",
        "-1": "111010",
        D: "001100",
        A: "110000",
        "!D": "001101",
        "!A": "110001",
        "-D": "001111",
        "-A": "110011",
        "D+1": "011111",
        "A+1": "110111",
        "D-1": "001110",
        "A-1": "110010",
        "D+A": "000010",
        "D-A": "010011",
        "A-D": "000111",
        "D&A": "000000",
        "D|A": "010101",
    };
    static AOneComp = {
        M: "110000",
        "!M": "110001",
        "-M": "110011",
        "M+1": "110111",
        "M-1": "110010",
        "D+M": "000010",
        "D-M": "010011",
        "M-D": "000111",
        "D&M": "000000",
        "D|M": "010101",
    };
    dest(dest) {
        return Code.DestObj[dest] || "000";
    }
    comp(comp) {
        const zeroInfo = Code.AZeroComp[comp];
        if (zeroInfo) {
            return `0${zeroInfo}`;
        } else {
            return `1${Code.AOneComp[comp]}`;
        }
    }
    jump(jump) {
        return Code.JumpObj[jump] || "000";
    }
    transformCode(info) {
        const [dest, comp, jump] = info || [];
        return `111${this.comp(comp)}${this.dest(dest)}${this.jump(jump)}`;
    }
}

function transform2Binary(lines, output) {
    const symbolInstance = new SymbolTable();
    const parserInstance = new Parser();
    const codeInstance = new Code();
    // first loop get all label command, in case @lable appeared before (lable) and 
    // is regarded as a-command
    lines.forEach(line => {
        const type = parserInstance.commandType(line);
        if (type === 'L_COMMAND') {
            symbolInstance.addLCommand(parserInstance.symbol(type))
        }
    })
    let aAddress = 16;
    let lCommandCount = 0
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const type = parserInstance.commandType(line);
        if (type === "C_COMMAND") continue;
        const symbol = parserInstance.symbol(type);
        if (type === "A_COMMAND") {
            // not label command or build-in address
            if (symbolInstance.contains(symbol) || symbolInstance.isLCommand(symbol)) continue
            // number need to add it self
            if (/^\d+$/.test(symbol)) {
                symbolInstance.addEntry(symbol, Number(symbol));
            } else {
                symbolInstance.addEntry(symbol, aAddress);
                aAddress++;
            }
        } else {
            symbolInstance.addEntry(symbol, i - lCommandCount)
            lCommandCount++;
        }
    }
    const transformList = lines.map((line) => {
        const type = parserInstance.commandType(line);
        if (type === 'L_COMMAND') return
        if (type === "C_COMMAND") {
            const parseCCommand = parserInstance.parseCCommand(line);
            return codeInstance.transformCode(parseCCommand);
        }
        const symbol = parserInstance.symbol(type);
        const address = symbolInstance.getAddress(symbol);
        const binary = address.toString(2);
        return binary.padStart(16, "0");
    }).filter(code => code != undefined);
    fs.writeFile(`./${output}`, transformList.join("\n"), {
        encoding: "utf8",
        flag: "w",
    });
    // console.log(symbolInstance.getAllAddress())
}

function init() {
    const args = process.argv.slice(2);
    const argObj = {};
    args.forEach((arg) => {
        const [key, value] = arg.split("=");
        const pureKey = key.replace(/^--|^-/, "");
        argObj[pureKey] = value;
    });
    if (!argObj.output) {
        argObj.output = argObj.input.replace(/\.asm$/, ".hack");
    }
    fs.readFile(`./${argObj.input}`, "utf-8").then((res) => {
        const lines = res
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => !!line && !line.startsWith("//"));
        transform2Binary(lines, argObj.output);
    });
}

init();

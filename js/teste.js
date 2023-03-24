import { Lexer } from "./compiler/Lexer.js";
import { Parser } from "./compiler/Parser.js";
import { SymbolTable } from "./compiler/SymbolTable.js";

const symbolTable = new SymbolTable()
const scanner = new Lexer(
`E = q0,q1,q2,q3,q4,q5,q6,q7
A = 0,1,2
S0 = q0
F = q7
NF = q0,q1,q2,q3,q4,q5,q6
AF = 0,1,2,X,Y,>,b
D = >
B = b

# Comentário 1
q10
q0
	q4 0&0 R
	q1 1&X R
	q0 >&> R

# Comentário 2
q1
	q2 0&0 R
	q1 1&1 R

# Comentário 3
q2
	q3 2&Y L
	q2 Y&Y R

# Comentário 4
q3
	q3 0&0 L
	q3 1&1 L
	q0 X&X R
	q3 Y&Y L

# Comentário 5
q4
	q5 1&1 R
	q4 Y&Y R

# Comentário 6
q5
	q6 0&0 R

# Comentário 7
q6
	q7 b&b P

`, symbolTable)

scanner.tokenize()

console.log(symbolTable)
console.log(scanner.getErros())
console.log('------------------------------')

const parser = new Parser(scanner, symbolTable)
parser.parser()
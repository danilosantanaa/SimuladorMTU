import { Lexer } from "./compiler/Lexer.js";
import { Parser } from "./compiler/Parser.js";
import { SymbolTable } from "./compiler/SymbolTable.js";

const symbolTable = new SymbolTable()


















let btn_abrir = document.querySelector(".btn.abrir")
let file_content = ""

btn_abrir.addEventListener("click", async () => {
	const inputFile = document.createElement("input")
	inputFile.setAttribute("type", "file")
	inputFile.setAttribute("accept", ".mtu")

	document.body.appendChild(inputFile)
	inputFile.click()

	file_content = ""
	inputFile.addEventListener("change", async () => {
		const reader = new FileReader()

		const file = inputFile.files[0]

		reader.readAsText(file)
		
		await new Promise((resolve, reject) => {
			reader.onload = e => {
				file_content += e.target.result
				resolve()
			}

			reader.onerror = () => reject
		})

		const scanner = new Lexer(file_content, symbolTable)
		scanner.tokenize()

		const parser = new Parser(scanner, symbolTable)
		parser.parser()
	})

	document.body.removeChild(inputFile)

	
}, true)

import { Environment } from "./runtime/environment.js"
import { ValidadorNonTuplas } from "./validadorNontuplas.js"

const validadorNuntuplas = new ValidadorNonTuplas()
const environment = new Environment(validadorNuntuplas)
environment.run()
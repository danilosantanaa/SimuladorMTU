import * as configuracoes from "../configuracoes.js"
import { AnalisadorSintatico } from "../analisadores/analisadorSintatico.js"
import { abrirFecharConsole, setConsoleLogs} from "../console.js"
import { Nontupla } from "../validadorNontuplas.js"

export class Runtime {
    constructor(obj_nontuplas) {
        const escopo = this
        this.el_fita = document.querySelector(".fitas")
        this.el_entrada = document.querySelectorAll(".fitas > div")
        
        /**@type {Nontupla} */
        this.obj_nontuplas = obj_nontuplas

        this.el_ponteiro = document.querySelector("#cabecote")

        this.analisadorSintatico = new AnalisadorSintatico(obj_nontuplas)
        this.is_executar = !this.analisadorSintatico.isErrosOuAvisos()

        // Parte que será mostrada no console
        this.el_cli = document.querySelector(".cmd-line-display")
        
        // Variavel de controle
        this.el_btn_parar = document.querySelector(".btn.parar")
        this.is_parar = false
        this.el_btn_parar.addEventListener("click", () => {
            escopo.is_parar = true
        }, true)
        
        
       this.el_range_input = document.querySelector("#velocidade")
       this.setVelocidade()
    }

    setVelocidade() {
        this.calcularVelocidade()
        this.time = 500 * Number(this.el_range_input.value) / 
        this.el_range_input.addEventListener("change", (e) => {
            this.calcularVelocidade()
        })
    }

    calcularVelocidade() {
        const valorAtual = Number(this.el_range_input.value)
        this.time = Math.floor(1 / valorAtual * 500)
    } 


    mostrarBarraRolagem() {
        if(this.el_fita.classList.contains("rolagem")) {
            this.el_fita.classList.remove("rolagem")
            this.el_ponteiro.classList.add("rolagem")
        } else {
            this.el_fita.classList.add("rolagem")
            this.el_ponteiro.classList.remove("rolagem")
        }
    }

    getComandos() {

        return JSON.stringify({
            S: this.obj_nontuplas.conjunto_estado,
            AF: this.obj_nontuplas.alfaberto,
            S0: this.obj_nontuplas.estado_inicial,
            F: this.obj_nontuplas.estado_final,
            R: this.obj_nontuplas.estado_nao_final,
            AFF: this.obj_nontuplas.alfaberto_fita,
            b: this.obj_nontuplas.branco_fita,
            d: this.obj_nontuplas.delimitador,
            delta: this.analisadorSintatico.comandos
        }, null, 2)
    }

    async executarComandos() {
        this.mostrarValidCadeia(true)
        this.setErrosConsoles()
        
        if(this.is_executar) {
            this.lerComandos()
        }
    }

    statusBtnExecutar(executando = false) {
        const btn_executar = document.querySelector(".executar")
        const btn_resertar = document.querySelector(".resertar")
        const btn_parar = document.querySelector(".parar")

        if(!executando) {
            btn_executar.removeAttribute("disabled")
            btn_resertar.removeAttribute("disabled")
            btn_parar.setAttribute("disabled", "")
           
        } else {
            btn_executar.setAttribute("disabled", "")
            btn_resertar.setAttribute("disabled", "")
            btn_parar.removeAttribute("disabled")
        }
    }
    
    async lerComandos() {

        // Contadores
        let contador = 0
        let totRodada = 0
        
        // DOM
        this.mostrarBarraRolagem()
        this.setPosCabecote()
        this.statusBtnExecutar(true)

        // Coloca o estado inicial declarado na nontupla
        let estado = this.obj_nontuplas.estado_inicial.join('').trim()
        
        // Executa os comandos
        while(contador >= 0 && totRodada <= 3000 && !this.is_parar) {
            let entrada = this.el_entrada[contador].innerText.trim()

            entrada = entrada.replace(configuracoes.SIMBOLOS_ESPECIAIS.DELIMITADOR.SIMBOLO_NIVEL_DISPLAY, configuracoes.SIMBOLOS_ESPECIAIS.DELIMITADOR.SIMBOLO_NIVEL_LABEL)
            entrada = entrada.replace(configuracoes.SIMBOLOS_ESPECIAIS.BRANCO_DE_FITA.SIMBOLO_NIVEL_DISPLAY, configuracoes.SIMBOLOS_ESPECIAIS.BRANCO_DE_FITA.SIMBOLO_NIVEL_LABEL)

            const cmds = this.analisadorSintatico.comandos.filter(cmd => cmd.alfaberto_fita_header == entrada && cmd.estado_apontador == estado)[0]

            if(cmds != undefined) {
                estado = cmds.estado
                document.querySelector("#estado-display").innerText = estado

                if(configuracoes.COMANDOS_MOVIMENTADOR.LEFT == cmds.movimentador) {
                    this.setEntrada(contador, cmds.alfaberto_fita_subs)
                    await this.moverEsquerda(this.el_entrada[contador], contador)
                    contador--
                }

                if(configuracoes.COMANDOS_MOVIMENTADOR.RIGHT == cmds.movimentador) {
                    this.setEntrada(contador, cmds.alfaberto_fita_subs)
                    await this.moverDireita(this.el_entrada[contador], contador)
                    contador++
                } 
                
                if(configuracoes.COMANDOS_MOVIMENTADOR.STOP == cmds.movimentador) {
                    await this.dormir(this.time)
                    this.setEntrada(contador, cmds.alfaberto_fita_subs)
                    await this.dormir(this.time)
                }


                if(configuracoes.COMANDOS_MOVIMENTADOR.STOP == cmds.movimentador) break
            }

            totRodada++
        }

        this.mostrarBarraRolagem();
        this.setPosCabecote()
        this.setValidarCadeia(this.is_parar)
        this.statusBtnExecutar(false)
    }

    mostrarValidCadeia(esconder =  false) {
        const span = document.querySelector("#cadeia-info")

        if(span.style.display.trim() == 'flex' || esconder) {
            span.style.display = 'none'
        } else {
            span.style.display = 'flex'
        }
    }

    setValidarCadeia(is_parar = false) {
        const saida = document.querySelector("#estado-display")
        const span = document.querySelector("#cadeia-info")

       this.mostrarValidCadeia()
        if(saida.innerText.trim() == this.obj_nontuplas.estado_final.join('').trim()) {
            span.innerHTML = '<i class="fa-solid fa-circle-check"></i>&nbsp;Aceita!'
            span.classList.add("aceita")
            span.classList.remove("rejeicao")
        } else {
            span.innerHTML = `<i class="fa-solid fa-circle-xmark"></i>&nbsp;${is_parar ? "Interrompido" : "Rejeição"}`
            span.classList.add("rejeicao")
            span.classList.remove("aceita")
        }

    }

    setEntrada(pos, caracter) {

        if(caracter == configuracoes.SIMBOLOS_ESPECIAIS.BRANCO_DE_FITA.SIMBOLO_NIVEL_LABEL) {
            this.el_entrada[pos].innerText = configuracoes.SIMBOLOS_ESPECIAIS.BRANCO_DE_FITA.SIMBOLO_NIVEL_DISPLAY
        } else if (caracter == configuracoes.SIMBOLOS_ESPECIAIS.DELIMITADOR.SIMBOLO_NIVEL_LABEL) {
            this.el_entrada[pos].innerText = configuracoes.SIMBOLOS_ESPECIAIS.DELIMITADOR.SIMBOLO_NIVEL_DISPLAY
        } else {
            this.el_entrada[pos].innerText = caracter
        }
    }

    setPosCabecote() {
        // Resertando configurações de estilo colocaod pelo script
        this.el_ponteiro.style.left = '10px'
        this.el_fita.scrollLeft = 0
        //document.querySelector("#estado-display").innerHTML = '-';
    }

    setErrosConsoles() {
        abrirFecharConsole(!this.is_executar)
        setConsoleLogs(this.analisadorSintatico.analisadorLexico.errorList, this.analisadorSintatico.errosSintaticos, this.analisadorSintatico.avisosSintaticos)
    }

    // Move o cabecote para o lado direto da fita
    async moverDireita(el_cedula, pos) {
        pos++;
        await this.dormir(this.time)
        
        const coords_cedula = el_cedula.getBoundingClientRect()
        const coords_fita = this.el_fita.getBoundingClientRect()

        this.calcularVelocidade()
        const quadro_por_segundos = Math.floor(10 * this.time / 500)
        if(pos * coords_cedula.width - coords_cedula.width / 2 >= coords_fita.width / 2 && this.el_fita.scrollWidth - coords_fita.width != this.el_fita.scrollLeft) {
            let inicio = this.el_fita.scrollLeft
            for(let i = inicio; i <= inicio + coords_cedula.width; i++) {
                await this.dormir(quadro_por_segundos)
                this.el_fita.scrollLeft = i
            }
            await this.dormir(quadro_por_segundos)
        } else {

            const position = coords_cedula.left + coords_cedula.width / 2;
            for(let i = this.el_ponteiro.offsetLeft; i < position; i++) {
                await this.dormir(quadro_por_segundos)
                this.el_ponteiro.style.left = `${i}px`
            }
        }


    }

    // Move o cabeçote para lado esquerdo da fita
    async moverEsquerda(el_cedula, pos) {
        pos--
        await this.dormir(this.time)
        
        const coords_cedula = el_cedula.getBoundingClientRect()
        const coords_fita = this.el_fita.getBoundingClientRect()

        this.calcularVelocidade()
        const quadro_por_segundos = Math.floor(10 * this.time / 500)
        if(pos * coords_cedula.width < coords_fita.width / 2 - coords_cedula.width / 2) {
            let final =  this.el_ponteiro.offsetLeft
            let inicio = final - coords_cedula.width

            for(let i = final; i >= inicio; i--) {
                await this.dormir(quadro_por_segundos)
                this.el_ponteiro.style.left = `${i}px`
            }
        } else {
            let final = this.el_fita.scrollLeft
            let inicio = final - coords_cedula.width
            for(let i = final ; i >= inicio ; i--) {
                await this.dormir(quadro_por_segundos)
                this.el_fita.scrollLeft = i
            }
            await this.dormir(quadro_por_segundos)
        }
    }

    async dormir(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    anyCodigo() {
        return this.analisadorSintatico.comandos.some(() => true)
    }
}
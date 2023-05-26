class RunTime {
    constructor() {
        this.display = document.querySelector("#estado-display")

        this.fita = document.querySelector('.fitas')

        /**@type {Element} */
        this.pointer = document.querySelector("#cabecote")

        this.cells = []
        this.position = 0;

        this.is_stop = false

        this.time_update = 5

        this.time_begin = null
        this.time_finashed = null
    }

    init() {
        this.fita.classList.add("execute")
        this.pointer.classList.add('cabecote')
        this.updateCeils()

        this.time_begin = new Date()
    }

    updateCeils() {
        this.cells = document.querySelectorAll(".fitas div.cedula")
    }

    write(strings) {
        this.display.innerHTML = `${strings?.trim()}`
    }

    put(character) {
        this.cells[this.position].innerHTML = character.replace('>', '►').replace('b', 'Б')
    }

    read() {
        if(this.isEmpty()) return undefined

        const el = this.cells[this.position]
        const text = el?.innerText.replace('►', '>').replace('Б', 'b') ?? ""

        return text
    }

    async right() {
        const destination = this.cells[this.position+1]

        if(destination == undefined) throw 'Overflow'

        await this.setDestination(destination)
        this.position++

        this.cells[this.position].style.background = '#732002'
        this.cells[this.position-1].style.background = '#D99D55'

        await this.sleep(this.time_update * 10)
    }

    async left() {
        const destination = this.cells[this.position-1]

        if(destination == undefined) throw 'Underflow'

        await this.setDestination(destination, true)
        this.position--

        this.cells[this.position].style.background = '#732002'
        this.cells[this.position+1].style.background = '#D99D55'

        await this.sleep(this.time_update * 10)
    }

    async stop(forced = false) {
        this.fita.classList.remove("execute")
        this.pointer.classList.remove('cabecote')

        if(this.cells.length > 0) {

            this.cells[this.position].style.background = '#D99D55'
            this.cells = []
            this.position = 0
        }

        await this.sleep(this.time_update * 10)

        if(!forced) {
            console.log('[Finished...]')
        }

        this.time_finashed = new Date()
    }

    accept() {
        console.log('[Accept...]')
    }

    reject() {
        console.log('[Reject...]')
    }

    stopeRuntime() {
        this.stop(true)
        console.log('[Runtime interrompido...]')
    }

    isHalfRibbon(el_destination) {
        const half_ribbon = this.fita.offsetWidth / 2 + el_destination.offsetWidth

        return el_destination.offsetLeft < half_ribbon
    }

    async setDestination(el_destination, is_left = false) {
        
        if(is_left) {
            if(this.isHalfRibbon(el_destination)) {
                this.fita.scrollLeft = 0
                await this.animationToLeft(el_destination.offsetLeft, this.pointer.offsetLeft)
            } else {
                await this.animationToLeft(this.fita.scrollLeft - el_destination.offsetWidth, this.fita.scrollLeft, true)
            }
        }

        else {
            if(this.isHalfRibbon(el_destination)) {
                this.fita.scrollLeft = 0
                await this.animationToRight(this.pointer.offsetLeft, el_destination.offsetLeft)
            } else {
                await this.animationToRight(this.fita.scrollLeft, this.fita.scrollLeft + el_destination.offsetWidth, true)
            }
        }
    }

    async animationToRight(pos_begin, pos_end, scroll = false) {
        for(let pos = pos_begin; pos <= pos_end; pos++) {
            await this.sleep(this.time_update)

            if(!scroll) {
                this.pointer.style.left = `${pos}px`
            } else {
                this.fita.scrollLeft = pos
            }
        }
    }

    async animationToLeft(pos_begin, pos_end, scroll = false) {
        for(let pos = pos_end; pos >= pos_begin; pos--) {
            await this.sleep(this.time_update)
            
            if(!scroll) {
                this.pointer.style.left = `${pos}px`
            } else {
                this.fita.scrollLeft = pos
            }
        }
    }

    async sleep(time) {
        return new Promise(resolve => setTimeout(() => { 
            console.log('wait...')
            resolve()
        }, time))
    }

    isEmpty() {
        return this.cells.length == 0
    }
}

function run(command) {
    console.log(command)
    eval(command)
}

globalThis.runtime = new RunTime();

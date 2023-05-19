class RunTime {
    constructor() {
        this.display = document.querySelector("#estado-display")

        this.fita = document.querySelector('.fitas')

        /**@type {Element} */
        this.pointer = document.querySelector("#cabecote")

        this.cells = []
        this.position = 0;
    }

    init() {
        this.fita.classList.add("execute")
        this.pointer.classList.add('cabecote')
        this.loadCells()
    }

    loadCells() {
        this.cells = document.querySelectorAll(".fitas div.cedula")
    }

    write(strings) {
        this.display.innerHTML = `${strings.trim()}`
    }

    read() {
        if(this.isEmpty()) return undefined

        const el = this.cells[this.position]
        return el?.innerText ?? undefined
    }

    right() {
        const destination = this.cells[this.position+1]

        if(destination == undefined) throw 'Overflow'

        this.setDestination(destination)
        this.position++
    }

    left() {
        const destination = this.cells[this.position-1]

        if(destination == undefined) throw 'Underflow'

        this.setDestination(destination, true)
        this.position--

    }

    isHalfRibbon(el_destination) {
        const half_ribbon = this.fita.offsetWidth / 2 + el_destination.offsetWidth

        return el_destination.offsetLeft < half_ribbon
    }

    setDestination(el_destination, is_left = false) {
        
        if(is_left) {
            if(this.isHalfRibbon(el_destination)) {
                this.fita.scrollLeft = 0
                this.animationToLeft(el_destination.offsetLeft, this.pointer.offsetLeft).then()
            } else {
                this.animationToLeft(this.fita.scrollLeft - el_destination.offsetWidth, this.fita.scrollLeft, true).then()
            }
        }

        else {
            if(this.isHalfRibbon(el_destination)) {
                this.fita.scrollLeft = 0
                this.animationToRight(this.pointer.offsetLeft, el_destination.offsetLeft).then()
            } else {
                this.animationToRight(this.fita.scrollLeft, this.fita.scrollLeft + el_destination.offsetWidth, true).then()
            }
        }
    }

    async animationToRight(pos_begin, pos_end, scroll = false) {
        for(let pos = pos_begin; pos <= pos_end; pos++) {
            await this.sleep()

            if(!scroll) {
                this.pointer.style.left = `${pos}px`
            } else {
                this.fita.scrollLeft = pos
            }
        }
    }

    async animationToLeft(pos_begin, pos_end, scroll = false) {
        for(let pos = pos_end; pos >= pos_begin; pos--) {
            await this.sleep()
            
            if(!scroll) {
                this.pointer.style.left = `${pos}px`
            } else {
                this.fita.scrollLeft = pos
            }
        }
    }

    async sleep() {
        return new Promise(resolve => setTimeout(() => { 
            console.log('wait...')
            resolve()
        }, 0.001))
    }

    isEmpty() {
        return this.cells.length == 0
    }
}

const run = new RunTime()
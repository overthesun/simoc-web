import Stats from 'three/examples/jsm/libs/stats.module'

class StatsBox {
    constructor(containerId, addTick) {
        this.stats = Stats()

        const container = document.getElementById(containerId)
        this.stats.dom.style.position = 'absolute'
        container.appendChild(this.stats.dom)

        this.tick = this.tick.bind(this)
        addTick({name: 'stats', tick: this.tick})
    }

    tick() {
        this.stats.update()
    }
}

export default StatsBox

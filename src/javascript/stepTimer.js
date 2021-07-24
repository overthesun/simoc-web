// See related stack overflow answer for details
// Site: https://stackoverflow.com/questions/24724852/pause-and-resume-setinterval/24725066 //
export function StepTimer(callback, delay) {
    let timerID
    let start
    let remaining = delay
    let newdelay = delay
    let stopped = null

    this.pause = () => {
        window.clearTimeout(timerID)
        remaining -= Date.now() - start
    }

    this.resume = () => {
        if (stopped) {
            return  // don't resume stopped timer
        }
        start = Date.now()
        window.clearTimeout(timerID)
        timerID = setTimeout(() => {
            callback()
            remaining = newdelay
            this.resume()
        }, remaining)
    }

    this.changeInterval = interval => {
        newdelay = interval
    }

    this.stop = () => {
        window.clearTimeout(timerID)
        timerID = null
        stopped = true
    }
}

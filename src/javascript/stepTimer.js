//See related stack overflow answer for details
// Site: https://stackoverflow.com/questions/24724852/pause-and-resume-setinterval/24725066 //
export function StepTimer(callback,delay){
    let timerID, start, remaining = delay, stopped = null

    this.pause = function(){
        window.clearTimeout(timerID)
        remaining -= Date.now() - start
    }

    this.resume = function(){
        if (stopped) {
            return  // don't resume stopped timer
        }
        start = Date.now()
        window.clearTimeout(timerID)
        timerID = setTimeout( () =>{
            callback()
            remaining = delay
            this.resume()
        },remaining)
    }

    this.changeInterval = function(interval){
        delay = interval
    }

    this.stop = function(){
        window.clearTimeout(timerID)
        timerID = null
        stopped = true
    }
}


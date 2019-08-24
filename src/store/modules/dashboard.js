// Contains the shared state for all things related to the dashboard.

// Parameters for the get_step route

// Step data: broken down into objects based on filter type. These can be accessed via the below getters.
// The idea is to use object deconstruction to set the variables for the individual parts within the calling method.
// agentCount | totalAgentMass | totalProduction | totalConsumption | storageRatio


// currentStepBuffer/maxStepBuffer: indicate the current step in the buffer being visualized, and the highest step in the buffer.
// A number of watcher functions within components reference currentStepBuffer for updating various data points such as panels and charts.

// Timer ID: this is used to pause, resume, speed controls or kill the setTimeout object within.
// SEE stepTimer.js within js folder for further details.

// Termination flag: Universally accessible point to check if the simulation has terminated.

// ACTIONS
// ParseStep function is an async call to parse all data from a particular get_step response object. It's setup as async so that
// it can continue to process get_step objects out of order as the step_number is used as the key within the resulting filter objects.
// So order doesn't matter as long as the step_number is correct. This should also prevent any issues if a step is duplicated within two
// different step objects

// To be added: Need to add a variable to store the current step interval. This is currently only done locally within the Controls component.

export default{
    state:{
        // parameters for the get_steps route
        parameters: {},
        agentCount:{1:{"human_agent":0}},
        totalAgentMass:{},
        totalProduction:{},
        totalConsumption:{},
        storageRatio:{},
        maxStepBuffer: 0,      // the number of steps in the buffer
        currentStepBuffer: 0,  // the step the simulation is displaying
        stepInterval: 1000,    // the time between the steps, in milliseconds
        stopped: false,        // true if we forced termination, also set terminated
        terminated: false,     // true if we stopped or retrieved all steps from the server
        timerID:undefined,
        getStepsTimerID:undefined,
        isTimerRunning:false,
        menuActive:false
    },
    getters:{
        getMenuActive:(state) => state.menuActive,
        getStepParams:(state) => state.parameters,
        getMaxStepBuffer:(state) => state.maxStepBuffer,
        getCurrentStepBuffer:(state) => state.currentStepBuffer,
        getStepInterval:(state) => state.stepInterval,

        getStepNumber: state => state.stepNumber,
        getAgentType: state => stepNumber => state.agentCount[stepNumber],
        getTotalAgentMass: state => stepNumber => state.totalAgentMass[stepNumber],
        getTotalProduction: state => stepNumber => state.totalProduction[stepNumber],
        getTotalConsumption: state => stepNumber => state.totalConsumption[stepNumber],
        getStorageRatio: state => stepNumber => state.storageRatio[stepNumber],
        getAirStorageRatio: state => stepNumber => state.storageRatio[stepNumber]['air_storage_1'],

        getStopped: state => state.stopped,
        getTerminated: state => state.terminated,

        getUpdateTimer: state => state.updateTimer,
        getTimerID: state => state.timerID,
        getGetStepsTimerID: state => state.getStepsTimerID,
        getIsTimerRunning: state =>state.isTimerRunning,
    },
    mutations:{
        SETPARAMETERS:function(state,value){
            state.parameters = value
        },
        // show the dashboard menu when true, hide it otherwise
        SETMENUACTIVE:function(state,value){
            state.menuActive = value
        },

        // Starts the step timer. This object is actually created within the
        // DashboardView component on mounted. The timer is not started until the conditions
        // are met for a reasonable buffer amount.
        STARTTIMER:function(state,value){
            //if((state.maxStepBuffer >= 100 || state.terminated ) && !state.isTimerRunning){
                console.log("Step Timer running")
                state.timerID.resume()
                state.isTimerRunning = true
            //}
        },
        PAUSETIMER:function(state,value){
            console.log("Step Timer paused")
            state.timerID.pause()
            state.isTimerRunning = false
        },
        STOPTIMER:function(state,value){
            if (state.timerID != null) {
                console.log("Step Timer stopped")
                state.timerID.stop()
            }
            state.isTimerRunning = false
        },
        SETTIMERID:function(state,value){
            state.timerID = value
        },
        SETGETSTEPSTIMERID:function(state,value){
            state.getStepsTimerID = value
        },

        SETSTOPPED:function(state,value){
            // this var should be set only when we interrupt the
            // simulation before receiving all the steps
            state.stopped = value
            // if the sim has been stopped, it's also terminated
            // but it could terminate cleanly without being stopped
            state.terminated = value
        },

        SETTERMINATED:function(state,value){
            state.terminated = value
        },
        //Is the step_timer already been created and running initiall?
        SETISTIMERRUNNING:function(state,value){
            state.isTimerRunning = value
        },
        SETGAMEID:function(state,value){
            state.parameters.game_id = value
        },
        SETMINSTEPNUMBER:function(state,value){
            state.parameters.min_step_num = value
        },
        //This is used for the starting step of get_step batches. Updated after every get_step call
        UPDATEMINSTEPNUMBER:function(state,value){
            let {step_num: step} = value
            state.parameters.min_step_num = Math.max(step+1, state.parameters.min_step_num)
        },
        //This is used for the number of steps to grab from get_step_to, after 100 steps have been buffered, . Updated after every get_step call
        SETNSTEPS:function(state,value){
            let {step_num:step} = value
            state.parameters.n_steps = state.maxStepBuffer > 100 ? 100 : 10
        },
        // unconditionally set the maxStepBuffer
        SETBUFFERMAX:function(state,value){
            state.maxStepBuffer = value
        },
        // conditionally update maxStepBuffer
        UPDATEBUFFERMAX:function(state,value){
            let {step_num:step} = value
            state.maxStepBuffer = Math.max(step, state.maxStepBuffer)
        },
        // unconditionally set the currentStepBuffer
        SETBUFFERCURRENT:function(state,value){
            state.currentStepBuffer = value
        },
        // update the currentStepBuffer, making sure it's <= maxStepBuffer
        UPDATEBUFFERCURRENT:function(state,value){
            state.currentStepBuffer = Math.min(value, state.maxStepBuffer)
        },
        SETSTEPINTERVAL:function(state,value){
            state.stepInterval = value
        },
        // increase the stepInterval, make the steps advance slower
        INCSTEPINTERVAL:function(state,value){
            // highest interval is 2s (1 step every 2 seconds)
            state.stepInterval = Math.min(2000, state.stepInterval+value)
            state.timerID.changeInterval(state.stepInterval)
        },
        // decrease the stepInterval, make the steps advance faster
        DECSTEPINTERVAL:function(state,value){
            // slowest interval is 250ms (4 steps per second)
            state.stepInterval = Math.max(250, state.stepInterval-value)
            state.timerID.changeInterval(state.stepInterval)
        },
        SETAGENTTYPE:function(state,value){
            let {step_num: step} = value
            let {total_agent_count} = value
            state.agentCount[step] = total_agent_count
        },
        SETTOTALAGENTMASS:function(state,value){
            let{step_num:step,total_agent_mass} = value
            state.totalAgentMass[step] = total_agent_mass
        },
        SETTOTALCONSUMPTION:function(state,value){
            let{step_num:step} = value
            let{total_consumption} = value

            state.totalConsumption[step] = total_consumption
        },
        SETTOTALPRODUCTION:function(state,value){
            let {step_num:step} = value
            let {total_production} = value

            state.totalProduction[step] = total_production
        },
        SETSTORAGERATIOS:function(state,value){
            let {step_num:step} = value
            let {storage_ratios} = value

            state.storageRatio[step] = storage_ratios
        },

        //Populates the parameters object with the selected plants from the
        //configuration wizard. This should actually called and updated similar to how the
        //wizard store updates its plants list on the fly.
        SETPLANTSPECIESPARAM:function(state,value){
            let {plantSpecies} = value

            plantSpecies.forEach((item) =>{
                state.parameters.total_agent_mass.push(item.type)
                state.totalAgentMass[item.type] = {"value":0,"units":undefined}
            })
        },
        INITGAME: function(state, value) {
            // set a new game_id and reset all other values
            console.log('game_id is', value)
            state.parameters = {
                // the game is set before reaching the dashboard and
                // resetting, so preserve its value
                "game_id": value,
                "min_step_num": 0,
                "n_steps": 10,
                "total_agent_count":["human_agent"],
                "total_agent_mass":[],
                "total_production":["atmo_co2","atmo_o2","h2o_potb","enrg_kwh"],
                "total_consumption":["atmo_o2","h2o_potb","enrg_kwh"],
                "storage_ratios":{"air_storage_1":["atmo_co2","atmo_o2","atmo_ch4","atmo_n2","atmo_h2","atmo_h2o"]},
                "parse_filters":[],
                "single_agent":1,
            }
            state.totalAgentMass = {}
            state.totalProduction = {}
            state.totalConsumption = {}
            state.storageRatio = {}
        },
    },
    actions:{
        parseStep({commit,dispatch},stepData){
            console.log(stepData)
            stepData.forEach((item) => {
                commit('SETTOTALCONSUMPTION',item)
                commit('SETTOTALPRODUCTION',item)
                commit('SETAGENTTYPE',item)
                commit('SETTOTALAGENTMASS',item)
                commit('SETSTORAGERATIOS',item)
                commit('UPDATEBUFFERMAX',item)
                commit('SETNSTEPS',item)
                commit('UPDATEMINSTEPNUMBER',item)
                //commit('SETTERMINATED',item)
            })
        },
    }
}

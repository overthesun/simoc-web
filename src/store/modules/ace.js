//Contains the shared state for ACE agent editor.

function get_template_agent_desc() {
    // return the basic structure agent_desc,
    // used to validate user-uploaded agent_desc files
    return {
        simulation_variables: {
            currencies_of_exchange: {},
            global_variables: {},
        },
        inhabitants: {},
        eclss: {},
        plants: {},
        isru: {},
        structures: {},
        fabrication: {},
        power_generation: {},
        mobility: {},
        communication: {},
        storage: {}
    }
}

function get_template_agent() {
    // return an empty agent
    return {
        data: {
            input: [],
            output: [],
            characteristics: [],
        },
        description: ""
    }
}

export default{
    state:{
        // Stores an unmodified copy of current agent_desc object for reset
        resetAgentDesc: {},
        // Stores the working (edited) agent_desc object
        activeAgentDesc: {},
        // Stores a list of currencies, used to validate agent input/output
        activeCurrencies: [],
        // Stores a list of sections in activeAgentDesc
        activeSection: null,
        // Stores the currently selected agent
        activeAgent: null,
        // Stores validation status of the current editor
        editorValid: true,
    },
    getters:{
        getResetAgentDesc: state => state.resetAgentDesc,
        getActiveAgentDesc: state => state.activeAgentDesc,
        getCurrencies: state => state.activeCurrencies,
        getActiveSection: state => state.activeSection,
        getActiveAgent: state => state.activeAgent,
        getEditorValid: state => state.editorValid,

        // Returns a list of sections to populate section navigation
        getSections: function(state) {
            var sections = []
            if (!state.activeAgentDesc) {
                console.log("Cannot return sections: missing agent_desc file")
            } else {
                sections = Object.keys(state.activeAgentDesc)
            }
            return sections
        },

        // Returns a list of agents to populate agent navigation
        getAgents: function(state) {
            var agents = []
            if (!state.activeAgentDesc) {
                console.log("Cannot return agents: missing agent_desc file")
            } else if (!state.activeSection) {
                console.log("Cannot return agent data: no section selected")
            } else {
                agents = Object.keys(state.activeAgentDesc[state.activeSection])
            }
            return agents
        },

        // Returns the agent object to populate agent editor 
        getActiveAgentData: function(state) {
            var agentData = {}
            if (!state.activeAgentDesc) {
                console.log("Cannot return agent data: missing agent_desc file")
            } else if (!state.activeSection) {
                console.log("Cannot return agent data: no section selected")
            } else if (!state.activeAgent) {
                console.log("Cannot return agent data: no agent selected")
            } else {
                agentData = state.activeAgentDesc[state.activeSection][state.activeAgent]
            }
            return agentData
        }
    },
    mutations:{
        // Used by actions/SETAGENTDESC and actions/RESETAGENTDESC
        set_reset_agent_desc: function(state, value) {
            state.resetAgentDesc = value
        },
        set_active_agent_desc: function(state, value) {
            state.activeAgentDesc = value
        },
        SETCURRENCIES: function(state, value) {
            state.activeCurrencies = value
        },
        SETACTIVESECTION: function(state, value) {
            state.activeSection = value
        },
        SETACTIVEAGENT: function(state, value) {
            state.activeAgent = value
        },
        SETEDITORVALID: function(state, value) {
            state.editorValid = value
        },
        UPDATEAGENT: function(state, value) {
            const {section, agent, data} = value
            state.activeAgentDesc[section][agent] = data
        },
        ADDAGENT: function(state, value) {
            var newAgent = get_template_agent()
            const {section, agent} = value
            state.activeAgentDesc[section][agent] = newAgent
            state.activeAgent = agent
        },
        REMOVEAGENT: function(state, value) {
            const {section, agent} = value
            delete state.activeAgentDesc[section][agent]
            state.activeAgent = null
        }
    },
    actions: {
        // Method adapated from store/modules/wizard.js. 
        //
        // Note copied from original:
        // 
        // "TODO: not sure if this is the best way to handle this.
        // Mutations can't call each others so a SETPRESET mutation
        // can't call a SETCONFIGURATION mutation.  I could have
        // created a SETCONFIGURATION mutation and a SETPRESET action
        // but I wanted to keep them together, so I created 2 actions
        // and a mutation instead."

        SETAGENTDESC: function(context, value) {
            // Used to load new agent_desc.json file
            // 'value' is an agent_desc.json parsed into a JS object

            // Validate against template_agent_desc
            // (adapted from store/modules/wizard.js)
            value = JSON.parse(JSON.stringify(value))
            let newAgentDesc = get_template_agent_desc()
            let valid_keys = []
            let invalid_keys = []
            Object.keys(value).forEach((key, i) => {
                if (newAgentDesc.hasOwnProperty(key)) {
                    newAgentDesc[key] = value[key]
                    valid_keys.push(key)
                }
                else {
                    invalid_keys.push(key)
                }
            })
            if (valid_keys.length == 0) {
                throw 'invalid agent_desc file.'
            }
            if (invalid_keys.length > 0) {
                console.log('* Ignoring invalid keys in the uploaded file:',
                            invalid_keys.join(', '))
            }
            
            // Update state and set starting values
            context.commit('set_reset_agent_desc', newAgentDesc)
            context.commit('set_active_agent_desc', newAgentDesc)

            var newCurrencies = Object.keys(newAgentDesc.simulation_variables.currencies_of_exchange)
            context.commit('SETCURRENCIES', newCurrencies)

            var newSections = Object.keys(newAgentDesc)
            context.commit('SETACTIVESECTION', newSections[0])
            context.commit('SETACTIVEAGENT', null)
        },
    }
}

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
        getActiveSection: state => state.activeSection,
        getActiveAgent: state => state.activeAgent,
        getEditorValid: state => state.editorValid,

        // Returns the list of currencies; used for input/output validation
        getCurrencies: function(state) {
            if (!state.activeAgentDesc) {
                return []
            } else if (!Object.keys(state.activeAgentDesc.simulation_variables).includes('currencies_of_exchange')) {
                console.log("Missing currencies of exchange field in agent_desc")
                return []
            } else {
                return Object.keys(state.activeAgentDesc.simulation_variables.currencies_of_exchange)
            }
        },

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
        SETAGENTDESC: function(state, value) {
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
            state.resetAgentDesc = newAgentDesc
            state.activeAgentDesc = newAgentDesc
            state.activeSection = Object.keys(newAgentDesc)[0]
            state.activeAgent = null
        },
        SETACTIVESECTION: function(state, value) {
            state.activeSection = value
            state.activeAgent = null
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
    }
}

//Contains the shared state for ACE agent editor.

import Vue from 'vue'

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
        // The default setup; retrieved by AceView and set on pageload
        defaultAgentDesc: {},
        // Stores the working (edited) agent_desc object
        activeAgentDesc: {},
        // Stores a list of sections in activeAgentDesc
        activeSection: null,
        // Stores a list of agents in activeSection
        activeAgents: [],
        // Stores the currently selected agent
        activeAgent: null,
        // Stores validation status of the current editor
        editorValid: true,
    },
    getters:{
        getDefaultAgentDesc: state => state.defaultAgentDesc,
        getActiveAgentDesc: state => state.activeAgentDesc,
        getActiveSection: state => state.activeSection,
        getActiveAgents: state => state.activeAgents,
        getActiveAgent: state => state.activeAgent,
        getEditorValid: state => state.editorValid,

        // Returns the list of currencies; used for input/output validation
        getCurrencies: function(state) {
            if (!state.activeAgentDesc) {
                return []
            } else if (!Object.keys(state.activeAgentDesc.simulation_variables).includes('currencies_of_exchange')) {
                console.log("Missing 'currencies_of_exchange' field in agent_desc")
                return []
            } else {
                return Object.keys(state.activeAgentDesc.simulation_variables.currencies_of_exchange)
            }
        },

        // Returns a list of sections to populate section navigation
        getSections: function(state) {
            let sections = []
            if (!state.activeAgentDesc) {
                console.log("Cannot return sections: missing agent_desc file")
            } else {
                sections = Object.keys(state.activeAgentDesc)
            }
            return sections
        },

        // Returns the agent object to populate agent editor 
        getActiveAgentData: function(state) {
            let agentData = {}
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
            let {agent_desc, isDefault} = value
            let inputAgentDesc = JSON.parse(JSON.stringify(agent_desc))
            let newAgentDesc = get_template_agent_desc()
            let valid_keys = []
            let invalid_keys = []
            Object.keys(agent_desc).forEach((key, i) => {
                if (newAgentDesc.hasOwnProperty(key)) {
                    newAgentDesc[key] = inputAgentDesc[key]
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
            state.activeAgentDesc = newAgentDesc
            state.activeSection = Object.keys(newAgentDesc)[0]
            state.activeAgents = Object.keys(state.activeAgentDesc[state.activeSection])
            state.activeAgent = null

            // If defualt, set default agent_desc
            if (isDefault) {
                state.defaultAgentDesc = JSON.parse(JSON.stringify(newAgentDesc))
            }
        },
        SETACTIVESECTION: function(state, value) {
            state.activeSection = value
            state.activeAgents = Object.keys(state.activeAgentDesc[value])
            state.activeAgent = null
        },
        SETACTIVEAGENT: function(state, value) {
            state.activeAgent = value
        },
        SETEDITORVALID: function(state, value) {
            state.editorValid = value
        },
        UPDATEAGENT: function(state, value) {
            let {section, agent, data} = value
            state.activeAgentDesc[section][agent] = data
        },
        UPDATEAGENTNAME: function(state, value) {
            let {section, oldName, newName} = value
            let sectionAgents = Object.keys(state.activeAgentDesc[section])
            if (!sectionAgents.includes(oldName)) {
                console.log("Agent not found.")
                return false
            } else if (sectionAgents.includes(newName)) {
                console.log("Agent name already in use.")
                return false
            } else {
                let data = JSON.parse(JSON.stringify(state.activeAgentDesc[section][oldName]))
                delete state.activeAgentDesc[section][oldName]
                state.activeAgentDesc[section][newName] = data
                state.activeAgents = Object.keys(state.activeAgentDesc[section])
                state.activeAgent = newName
            }
        },
        ADDAGENT: function(state, value) {
            // Create placeholder name
            let newAgentNumber = 0
            Object.keys(state.activeAgentDesc[value]).forEach(name => {
                var words = name.split("_")
                if(words[0] === "new" && words[1] === "agent") {
                    let currentAgentNumber = parseInt(words[2])
                    newAgentNumber = Math.max(newAgentNumber, currentAgentNumber)
                }
            })
            // Add new agent with placeholder name & empty template
            let section = value
            let agent = ["new", "agent", newAgentNumber + 1].join("_")
            let data = get_template_agent()
            state.activeAgentDesc[section][agent] = data
            state.activeAgents = Object.keys(state.activeAgentDesc[section])
            state.activeAgent = agent
            return true
        },
        REMOVEAGENT: function(state, value) {
            let {section, agent} = value
            console.log(section, agent)
            if (!Object.keys(state.activeAgentDesc[section]).includes(agent)) {
                console.log(`Cannot remove ${agent}: agent not found.`)
                return false
            } else {
                Vue.delete(state.activeAgentDesc[section], agent)
                state.activeAgents = Object.keys(state.activeAgentDesc[section])
                state.activeAgent = null
                return true
            }
        }
    }
}

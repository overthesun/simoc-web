import {defineStore} from 'pinia'
import axios from 'axios'

export const useAceStore = defineStore('AceStore', {
    state: () => ({
        defaultAgentDesc: {},
        userAgentDesc: {},
    }),
    actions: {
        loadDefaultAgentDesc() {
            axios.get('/get_agent_desc').then(response => {
                this.defaultAgentDesc = response.data
            })
        },
        getAgentClasses() {
            // Return combined keys of defaultAgentDesc and userAgentDesc
            const defaultClasses = Object.keys(this.defaultAgentDesc)
            const userClasses = Object.keys(this.userAgentDesc)
            return defaultClasses.concat(userClasses)
        },
        getAgentsInClass(agentClass) {
            // Return combined keys of defaultAgentDesc and userAgentDesc
            let agents = []
            if (this.defaultAgentDesc[agentClass]) {
                agents = agents.concat(this.defaultAgentDesc[agentClass])
            }
            if (this.userAgentDesc[agentClass]) {
                agents = agents.concat(this.userAgentDesc[agentClass])
            }
            return agents
        },
        getAgentData(agentName) {
            if (this.defaultAgentDesc[agentName]) {
                return this.defaultAgentDesc[agentName]
            } else if (this.userAgentDesc[agentName]) {
                return this.userAgentDesc[agentName]
            } else {
                return null
            }
        },
    },
})

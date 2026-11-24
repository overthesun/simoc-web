<!-- This component establishes the user interface for configuring the quantity of custom agents that
have been defined in local storage that should be present in the actual simulation -->

<script>

import {useWizardStore} from '../../store/modules/WizardStore'

export default {
    setup() {
        const wizard = useWizardStore()
        const {
            setActiveRefEntry,
        } = wizard
        return {
            setActiveRefEntry,
        }
    },
    data() {
        return {
            customAgents: [], // List of all the possible custom agents
            addedCustomAgents: [], // Objects holding name and quantity for each agent
            // selectedName: 'Agent', // For first custom agent field
            // selectedNames: [], // For addedCustomAgents fields
            // customAgentAdd: false,
        }
    },
    computed: {
        /* Related to formatting like plant species
        newAgentAddMode() {
            if (this.addedCustomAgents.length<1 || this.customAgentAdd) {
                this.selectedName='Agent'
                return true
            } else {
                return false
            }
        }
        */
    },
    watch: {/*
        selectedName() { // Related to formatting custom agents the way plant species are
            if (this.selectedName!='Agent'){
                this.addedCustomAgents.push({name: this.selectedName, quantity: 1}) // Add drop selected agent
                this.selectedName='Agent'
                this.customAgentAdd=false // Make the 'Agent' template disappear when drop selected
            } else {
                console.log(this.selectedName)
            }
        },
        addedCustomAgents() {
            this.selectedNames = []
            for (let agent in Object.keys(this.addedCustomAgents)) {
                this.selectedNames.push(this.addedCustomAgents[agent].name)
            }
        }, */
    },
    async created() {
        try {
            // Get currencies from local storage.
            // this.getLocalStorageCurrencies()
            this.getLocalStorageAgents()
        } catch (error) {
            console.log(error)
        }
    },
    methods: {
        getLocalStorageAgents() {
            let localStorageAgents = localStorage.getItem('customAgents')
            localStorageAgents = JSON.parse(localStorageAgents)
            const localAgentNames = Object.keys(localStorageAgents)
            if (typeof (localStorageAgents)==='object' && (localStorageAgents!==null)) {
                console.log('Custom agents found in local storage:')
                for (let index=0; index<localAgentNames.length; ++index) {
                    // It only adds an agent if it is NOT a plant. Custom plants appear in Plant Species already
                    if (localStorageAgents[localAgentNames[index]].agent_class==='plants') {
                        console.log('PLANT: ', localAgentNames[index])
                    } else {
                        console.log('NOT PLANT: ', localAgentNames[index])
                        this.customAgents.push(localAgentNames[index])
                        const agentObject = {name: localAgentNames[index], quantity: 0}
                        console.log(agentObject)
                        this.addedCustomAgents.push(agentObject)
                    }
                }
            } else {
                console.log(' * No agents loaded from local storage *')
            }
        }, /*
        addCustomAgent(name) { // Related to formatting custom agents the way plant species are
            this.customAgentAdd = true // This makes the blank 'Agent' Field appear when you hit +
            console.log(name, this.newAgentAddMode)
        },
        removeCustomAgent(name) {
            console.log('REMOVE AGENT:', name)
        },
        updateCustomAgent(number) {
            console.log('UPDATE TRIED', number)
        },*/
    },
}
</script>
<template>
    <div v-if="customAgents.length>0">
        <label class="input-wrapper">
            <div class="input-title" @click="setActiveRefEntry('CustomAgents')"> <!-- Description @ Reference.vue -->
                Custom Agents <fa-icon :icon="['fa-solid','circle-info']" />
            </div>
            <div class="input-description">Custom user defined agents other than plants.</div>
            <!-- This commented code is to make the agent look like the plant config instead
                 but it has issues that would need to be resolved and may be unnecessary.
            <div v-for="(item,index) in addedCustomAgents" :key="index" class="input-plant-wrapper">
                <select  v-model="selectedNames[index]" class="input-field-select">
                    <option value="" selected hidden>selectedNames[index]</option>
                    <option v-for="(name,k) in customAgents" :key="k" :value="name">{{customAgents[k]}}</option>
                </select>
                <label><input class="input-field-number" type="number" pattern="^\d+$"
                              placeholder="Quantity" @input="updateCustomAgent(index)"> units</label>
                <fa-layers class="fa-2x plant-row-icon icon-add" @click="addCustomAgent(selectedNames[index])">
                    <fa-icon :icon="['fa-solid','circle-plus']" />
                </fa-layers>
                <fa-layers class="fa-2x plant-row-icon icon-trash" @click="removeCustomAgent(selectedNames[index])">
                    <fa-icon :icon="['fa-solid','trash']" mask="circle" transform="shrink-7" />
                </fa-layers>
            </div>
            <div v-if="newAgentAddMode">
                <div class="input-plant-wrapper">
                    <select v-model="selectedName" class="input-field-select">
                        <option value="Agent" selected hidden disabled>Agent</option>
                        <option v-for="(name,k) in customAgents" :key="k" :value="name">{{customAgents[k]}}</option>
                    </select>
                    <label><input class="input-field-number" type="number" pattern="^\d+$"
                                  placeholder="Quantity" @input="updateCustomAgent(index)"> units</label>
                    <fa-layers class="fa-2x plant-row-icon icon-add" @click="addCustomAgent(selectedName)">
                        <fa-icon :icon="['fa-solid','circle-plus']" />
                    </fa-layers>
                    <fa-layers class="fa-2x plant-row-icon icon-trash" @click="removeCustomAgent(selectedName)">
                        <fa-icon :icon="['fa-solid','trash']" mask="circle" transform="shrink-7" />
                    </fa-layers>
                </div>
            </div>
             -->
            <div v-for="agent in addedCustomAgents" :key="agent.name">
                <b>{{agent.name}}</b>, Quantity:
                <input v-model="agent.quantity" type="number" style="width: 50px;">
            </div>
        </label>
    </div>
</template>
<style lang="scss" scoped>
    @import '../../sass/components/configuration-input';

    .input-plant-wrapper{
        display:flex;
        justify-content:flex-start;
        align-items:center;
    }

    .input-field-select{
        margin-right:24px;
    }

    .plant-row-icon{
        &:first-of-type{
            margin-left:auto;
        }

        margin-right:24px;
    }

.crop-mgmt-description{
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 2em;
}
</style>

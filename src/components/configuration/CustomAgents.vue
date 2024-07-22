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
            customAgents: [],
        }
    },
    async created() {
        // Get currencies from simoc-abm
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
                    }
                }
            } else {
                console.log(' * No agents loaded from local storage *')
            }
        },
        addCustomAgent() {
            console.log('ADD AGENT TRIED')
        },
        removeCustomAgent() {
            console.log('REMOVE AGENT TRIED')
        },
        updateCustomAgent(number) {
            console.log('UPDATE TRIED', number)
        },
    },
}
</script>
<template>
    <div v-if="customAgents.length>0">
        <label class="input-wrapper">
            <div class="input-title" @click="setActiveRefEntry('CustomAgents')"> <!-- Description @ Reference.vue -->
                Custom Agents <fa-icon :icon="['fa-solid','circle-info']" />
            </div>
            <div class="input-description">Custom user defined agents other than plants</div>
            <div v-for="(item,index) in customAgents" :key="index" class="input-plant-wrapper">
                <select class="input-field-select">
                    <option value="" selected hidden disabled>Agent</option>
                    <option v-for="(name,k) in customAgents" :key="k" :value="name">{{customAgents[k]}}</option>
                </select>
                <label><input class="input-field-number" type="number" pattern="^\d+$"
                              placeholder="Quantity" @input="updateCustomAgent(index)"> units</label>
                <fa-layers class="fa-2x plant-row-icon icon-add" @click="addCustomAgent()">
                    <fa-icon :icon="['fa-solid','circle-plus']" />
                </fa-layers>
                <fa-layers class="fa-2x plant-row-icon icon-trash" @click="removeCustomAgent(index)">
                    <!-- Deletes the object at the specicied key within the wizard store. -->
                    <fa-icon :icon="['fa-solid','trash']" mask="circle" transform="shrink-7" />
                </fa-layers>
            </div>
            <div v-for="agent in customAgents" :key="agent">
                <b>{{agent}}</b> Quantity:
                <input type="number" value="0">
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

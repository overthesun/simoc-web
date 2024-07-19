<!-- This component establishes the user interface for configuring the quantity of custom agents that
have been defined in local storage that should be present in the actual simulation -->

<script>
    export default {
        data() {
            return {
                customAgents: []
            }
        },
        async created() {
            // Get currencies from simoc-abm
            try {
                // Get currencies from local storage.
                //this.getLocalStorageCurrencies()
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
                this.customAgents = Object.keys(localStorageAgents)
                if (typeof (localStorageAgents)==='object' && (localStorageAgents!==null)) {
                    console.log('Custom agents found in local storage:')
                    for (let index=0; index<localAgentNames.length; ++index) {
                        // Modify this code such that it only adds an agent if it is NOT a plant
                        console.log(localAgentNames[index])
                    }
                } else {
                    console.log(' * No agents loaded from local storage *')
                }
            },
        },
    }
</script>
<template>
    <div>
        <h1 style="color:rgb(0,240,0)">Custom Agents <span style="color:lightgrey">@</span>
        </h1>
        <p>Custom Defined Agents other than plants.</p>
        <p style="color:red">THIS SECTION SHOULD ONLY APPEAR IF ANY AGENTS ARE IN LIST</p>
        <p style="color:red">REPLACE WITH SELECT LIKE PLANT SPECIES COMPONENT</p>
        <div v-for="agent in this.customAgents">
            <b>{{agent}}</b> Quantity:
            <input type="number" value ="1"/>
        </div>
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

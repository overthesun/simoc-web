/* This vue file creates a user interface allowing the creation of custom agents. It loads
existing agents from the back end and makes it possible to duplicate or edit these agents. The
custom agents are then stored in local storage in the browser, where they will be sent to the back
when the user hits the 'Launch Simulation' button. */
<script>
import axios from 'axios'

export default {
    props: {
    },
    data() {
        return {
            currentMode: 'agent',
            agentDesc: '',
            currencyDesc: '',
            currencyList: [],
            selectedCurrency: 'o2',
            selectedCurrencyCategory: 'atmosphere',
            currencyCategorySelected: 'atmosphere',
            newCurrencyName: '',
            categorySelected: 'plants',
            selectedAgentName: 'rice',
            selectedCapacity: '',
            customClassName: '',
            capacityTypes: {},
            inTypes: {},
            outTypes: {},
            thresholdTypes: {},
            kindTypes: {},
            newCapacityType: '',
            newCapacityValue: '',
            newInType: '',
            newInValue: '',
            newOutType: '',
            newOutValue: '',
            newThresholdCurrency: 'o2',
            newThresholdPath: '',
            newThresholdLimit: '',
            newThresholdValue: '',
            newThresholdConnections: '',
            propertyNames: {},
            newPropertyName: '',
            newPropVal: '',
            newPropUnit: '',
            newWeightedIn: '',
            newWeightedOut: '',
            newConnectionIn: '',
            newConnectionOut: '',
            newRequires: '',
            newCriterionName: '',
            newCriterionValue: '',
            newCriterionLimit: '',
            newGrowthKind: '',
            newGrowthPattern: '',
            newDepriveValue: '',
            newDepriveUnit: '',
            changedPropVal: '',
            newAgentName: '',
            customAgents: {},
            customCurrencies: {},
            exportedListVisible: false,
            localAgentNames: [],
            localCurrencyNames: [],
        }
    },
    computed: {
        selectedAgent() {
            return this.agentDesc[this.selectedAgentName]
        },
        agentOutFlow() {
            return this.selectedAgent.flows.out
        },
        currencyTypes() {
            const listOfTypes = []
            /* Determine list of type */
            const keys = Object.keys(this.currencyDesc)
            for (let index=0; index<keys.length; ++index) {
                const currencyType = keys[index]
                if (!listOfTypes.includes(currencyType)) listOfTypes.push(currencyType)
            }
            return listOfTypes
        },
        agentClasses() {
            const listOfClasses = []
            /* Determine list of agent_class */
            const agentNames = Object.keys(this.agentDesc)
            for (let index=0; index<agentNames.length; ++index) {
                const className = this.agentDesc[agentNames[index]].agent_class
                if (!listOfClasses.includes(className)) listOfClasses.push(className)
            }
            return listOfClasses
        },
        agentsInClass() {
            const listOfAgents = []
            const agents = Object.keys(this.agentDesc)
            for (let index=0; index<agents.length; ++index) {
                const agent = agents[index]
                const agentClass = this.agentDesc[agent].agent_class
                if (agentClass===this.categorySelected) { listOfAgents.push(agent) }
            }
            return listOfAgents
        },
    },
    watch: {
        selectedAgentName() {
        },
        currencyDesc() {
            this.generateCurrencyList()
        },
    },
    async created() {
        // Get agents from simoc-abm
        try {
            this.agentDesc = await this.getAgentDesc()
            // Get agents from local Storage
            this.getLocalStorageAgents()
        } catch (error) {
            console.log(error)
        }
        // Get currencies from simoc-abm
        try {
            this.currencyDesc = await this.getCurrencyDesc()
            this.generateCurrencyList()
            // Get currencies from local storage.
            this.getLocalStorageCurrencies()
        } catch (error) {
            console.log(error)
        }
    },
    methods: {
        getLocalStorageAgents() {
            let localStorageAgents = localStorage.getItem('customAgents')
            localStorageAgents = JSON.parse(localStorageAgents)
            this.localAgentNames = Object.keys(localStorageAgents)
            if (typeof (localStorageAgents)==='object' && (localStorageAgents!==null)) {
                console.log('Agents found in local storage:')
                for (let index=0; index<this.localAgentNames.length; ++index) {
                    const localAgentName = this.localAgentNames[index]
                    this.agentDesc[localAgentName] = localStorageAgents[localAgentName]
                }
            } else {
                console.log(' * No agents loaded from local storage *')
            }
        },
        getLocalStorageCurrencies() {
            let localStorageCurrencies = localStorage.getItem('customCurrencies')
            localStorageCurrencies = JSON.parse(localStorageCurrencies)
            if (typeof (localStorageCurrencies)==='object' && (localStorageCurrencies!==null)) {
                /* Uncomment to print to the console the list of local storage currencies: */
                // for(let category in localStorageCurrencies)
                // console.log("Currencies found in local storage:")
                // for (let currency in category) {
                //    console.log(currency)
                //    this.currencyDesc[category][currency] = localStorageCurrencies[currency]
                // }
                if (
                    typeof (this.currencyDesc.custom)==='object'
                    && (localStorageCurrencies!=null)
                ) {
                    // Object exists
                } else {
                    this.currencyDesc.custom = {}
                }
                this.localCurrencyNames = Object.keys(localStorageCurrencies)
                console.log(' * Currencies loaded from local storage:')
                for (let nameIndex=0; nameIndex<this.localCurrencyNames.length; nameIndex+=1) {
                    const currencyName = this.localCurrencyNames[nameIndex]
                    console.log(currencyName)
                    this.currencyDesc.custom[currencyName] = localStorageCurrencies[currencyName]
                }
            } else {
                console.log(' * No currencies loaded from local storage *')
            }
        },
        async getCurrencyDesc() {
            try {
                // Retrieve agent desc  from the backend
                console.log(`* Loading Currency Desc from backend *`)
                const response = await axios.get('/get_currency_desc')
                const currencyDesc = response.data.currency_desc // get the actual data out of the response object
                console.log(currencyDesc)
                return currencyDesc
            } catch (error) {
                console.log('* Loading agent desc failed! *')
                console.error(error)
                return null
            }
        },
        generateCurrencyList() {
            const currancies = []
            this.currencyList = []
            const currencyCats = Object.keys(this.currencyDesc)
            for (let currencyCatIndex = 0;
                currencyCatIndex<currencyCats.length; currencyCatIndex+=1) {
                const currentCurrencyCatName = currencyCats[currencyCatIndex]
                const curranciesNamesOfType = Object.keys(this.currencyDesc[currentCurrencyCatName])
                for (let currencyIndex = 0;
                    currencyIndex<curranciesNamesOfType.length; currencyIndex+=1) {
                    const currencyName = curranciesNamesOfType[currencyIndex]
                    // The actual currency is at this.currencyDesc[currentCurrencyCatName][currencyName]
                    currancies.push(currencyName)
                }
            }
            for (let i=0; i<currancies.length; ++i) {
                this.currencyList.push(currancies[i])
            }
        },
        async getAgentDesc() {
            try {
                // Retrieve agent desc  from the backend
                console.log(`* Loading Agent Desc from backend *`)
                const response = await axios.get('/get_agent_desc')
                const agentDesc = response.data.agent_desc
                return agentDesc  // get the actual data out of the response object
            } catch (error) {
                console.log('* Loading agent desc failed! *')
                console.error(error)
                return null
            }
        },
        submitAgent() {
            this.agentDesc[this.categorySelected][this.selectedAgentName] = {data: 0}
        },
        selectItem(item) {
            this.selectedAgentName = item
        },
        selectCurrency(currency) {
            this.selectedCurrency = currency
            this.selectedCurrencyCategory = this.currencyCategorySelected
        },
        setCustomClass() {
            this.selectedAgent.agent_class=this.customClassName
            this.categorySelected = this.customClassName
        },
        removeCapacity(key) {
            delete this.selectedAgent.capacity[key]
            // Remove the capacities object if there are no capacities in it.
            if ((Object.keys(this.selectedAgent.capacity).length) === 0) {
                delete this.selectedAgent.capacity
            }
        },
        removeInFlow(currency) {
            delete this.selectedAgent.flows.in[currency]
        },
        removeOutFlow(currency) {
            delete this.agentOutFlow[currency]
        },
        removeThreshold(currency) {
            delete this.selectedAgent.thresholds[currency]
            // Remove thresholds object if there are no currencies listed
            if (Object.keys(this.selectedAgent.thresholds).length === 0) {
                delete this.selectedAgent.thresholds
            }
        },
        removeProperty(property) {
            delete this.selectedAgent.properties[property]
        },
        removeGrowth(currency, kind) {
            // Delete the specific kind of growth
            delete this.agentOutFlow[currency].growth[kind]
            // Remove the growth object if there are no growths in it.
            const flowGrowth = this.agentOutFlow[currency].growth
            if (Object.keys(flowGrowth).length === 0) {
                delete this.agentOutFlow[currency].growth
            }
        },
        removeCriterion(currency, kind) {
            // Delete the specific kind of criterion
            delete this.agentOutFlow[currency].criteria[kind]
            // Remove the criteria object if there are no growths in it.
            const thisCriteria = this.agentOutFlow[currency].criteria
            if (Object.keys(thisCriteria).length === 0) {
                delete this.agentOutFlow[currency].criteria
            }
        },
        removeFlowArrayItem(direction, type, currency, name) {
            const agent = this.selectedAgent
            const index = (
                agent.flows[direction][currency][type].indexOf(name)
            )
            // Delete the connection by its array index number
            if (index !== -1) {
                const currencyArray = agent.flows[direction][currency][type]
                currencyArray.splice(index, 1)
            }
            // Remove the flow array array if it is empty
            const flowarray = agent.flows[direction][currency][type]
            if ((flowarray).length === 0) {
                delete agent.flows[direction][currency][type]
            }
        },
        removeDeprive(currency) {
            delete this.selectedAgent.flows.in[currency].deprive
        },
        changePropertyValue(property, newPVal) {
            let newPropVal = newPVal
            /* See if it is a number, if it is, store it as one, otherwise as a string */
            if (!Number.isNaN(Number(newPropVal))) {
            /* This is to ensure the data sent to the back is not a string in the JSON */
            /* When it is supposed to be a number e.g. { a: 1 } vs { a: '1' } */
            /* Works with !isNaN(newPropVal), but doesn't pass lint*/
            /* Check this again to verify with this workaround for lint */
                newPropVal = +newPropVal
            }
            // Convert true/false string to boolean
            if (newPropVal==='true') { newPropVal = true }
            if (newPropVal==='false') { newPropVal = false }
            this.selectedAgent.properties[property].value=newPropVal
        },
        renameAgent(newName) {
            // Make Sure Agent Doesn't Already Exist
            const agentNames = Object.keys(this.agentDesc)
            for (let nameIndex=0; nameIndex<agentNames.length; nameIndex+=1) {
                const name = agentNames[nameIndex]
                if (name === newName) {
                    const alertString = `${newName} already exists, try another name!`
                    console.log(alertString) // This really needs to be a notification like an alert
                    // alert(alertString) // Alert does not pass lint
                    return
                }
            }
            // Rename Object
            const thisAgent = this.selectedAgent
            this.agentDesc[newName] = thisAgent
            delete this.selectedAgent
            this.selectedAgentName = newName
            // Make sure that if it is a plant, the corresponding currency is renamed also
            if (this.categorySelected==='plants') {
                // This really needs to be a notification like an alert, but alert does not pass lint
                console.log('PLANT. MAKE SURE PLANT FLOW CURRENCIES ARE UPDATED/CREATED,')
                console.log('(i.e. rice has rice as outflow, ')
                console.log('and has rice as a biomass connection)!')
            }
            // Export the plant currency
        },
        renameCurrency(newName) {
            // Make Sure Currency Doesn't Already Exist
            const currencyNames = Object.keys(this.currencyDesc[this.currencyCategorySelected])
            for (let nameIndex=0; nameIndex<currencyNames.length; nameIndex+=1) {
                const name = currencyNames[nameIndex]
                if (name === newName) {
                    const alertString = `${newName} already exists, try another name!`
                    // This really needs to be a notification like an alert, but alert does not pass lint
                    console.log(alertString)
                    return
                }
            }
            // Rename Object
            const thisCurrency = (
                this.currencyDesc[this.currencyCategorySelected][this.selectedCurrency])
            this.currencyDesc[this.currencyCategorySelected][newName] = thisCurrency
            delete this.currencyDesc[this.currencyCategorySelected][this.selectedCurrency]
            this.selectedCurrency = newName
            this.generateCurrencyList()
        },
        changeCapacityType(key, value, newName) {
            if (!(newName==='' || newName===undefined)) { // Make sure it is not the empty string
                this.selectedAgent.capacity[newName]=value
                delete this.selectedAgent.capacity[key]
            } else {
                console.log('Cannot change to type without label')
            }
        },
        changeInType(key, value, newName) {
            if (!(newName==='' || newName===undefined)) { // Make sure it is not the empty string
                this.selectedAgent.flows.in[newName]=value // Set item at new location
                delete this.selectedAgent.flows.in[key] // Remove item from old location
            } else {
                console.log('Cannot change to type without label')
            }
        },
        changeOutType(key, value, newName) {
            if (!(newName==='' || newName===undefined)) { // Make sure it is not the empty string
                this.agentOutFlow[newName]=value
                delete this.agentOutFlow[key]
            } else {
                console.log('Cannot change to type without label')
            }
        },
        changeThresholdType(key, value, newName) {
            if (!(newName==='' || newName===undefined)) { // Make sure it is not the empty string
                this.selectedAgent.thresholds[newName]=value
                delete this.selectedAgent.thresholds[key]
            } else {
                console.log('Cannot change to type without label')
            }
        },
        changePropertyName(key, value, newName) {
            if (!(newName==='' || newName===undefined)) { // Make sure it is not the empty string
                this.selectedAgent.properties[newName]=value
                delete this.selectedAgent.properties[key]
            } else {
                console.log('Cannot change to type without label')
            }
        },
        changeGrowthType(kind, value, newName, key) {
            if (!(newName==='' || newName===undefined)) { // Make sure it is not the empty string
                this.agentOutFlow[key].growth[newName]=value
                delete this.agentOutFlow[key].growth[kind]
            } else {
                console.log('Cannot change to type without label')
            }
        },
        changeCriterionType(kind, value, newName, key) {
            // const flow = true
            // const dirrection = 'out'
            // const parameter = 'criteria'
            // this.changeType(kind, value, newName, key, parameter, flow, dirrection)
            if (!(newName==='' || newName===undefined)) { // Make sure it is not the empty string
                this.agentOutFlow[key].criteria[newName]=value
                delete this.agentOutFlow[key].criteria[kind]
            } else {
                console.log('Cannot change to type without label')
            }
        },
        changeType(kind, value, newName, key, parameter, flow, dirrection) {
            if (!(newName==='' || newName===undefined)) { // Make sure it is not the empty string
                if (!flow) {
                    this.selectedAgent[parameter][newName]=value
                    delete this.selectedAgent[parameter][key]
                } else {
                    this.selectedAgent.flows[dirrection][parameter][newName]=value
                    delete this.selectedAgent.flows[dirrection][parameter][kind]
                }
            } else {
                console.log('Cannot change to type without label')
            }
        },
        addNewCapacity(key, value) {
            // Add the capacity object if it doesn't exist
            if (!(typeof (this.selectedAgent.capacity)==='object')) {
                this.selectedAgent.capacity = {}
            }
            this.selectedAgent.capacity[key]=value
        },
        addNewFlow(direction, currency) {
            this.selectedAgent.flows[direction][currency]={}
            this.selectedAgent.flows[direction][currency].flow_rate = {}
        },
        addNewThreshold(currency, path, limit, value, connections) {
            // Add the threshold object if it doesn't exist
            if (!(typeof (this.selectedAgent.thresholds)==='object')) {
                this.selectedAgent.thresholds = {}
            }
            this.selectedAgent.thresholds[currency]={}
            this.selectedAgent.thresholds[currency].path=path
            this.selectedAgent.thresholds[currency].limit=limit
            this.selectedAgent.thresholds[currency].value=value
            this.selectedAgent.thresholds[currency].connections=connections
        },
        addNewProperty(newPropertyName, newPVal, newPropUnit) {
            let newPropVal = newPVal
            if (!Number.isNaN(Number(newPropVal))) { /* If it is a number, make sure it is a number and not a string */
                newPropVal = +newPropVal
            }
            if (newPropVal==='true') { newPropVal = true }
            if (newPropVal==='false') { newPropVal = false }
            if (newPropUnit !== '') {
                this.selectedAgent.properties[newPropertyName] = (
                    {value: newPropVal, unit: newPropUnit}
                )
            } else { // Make sure not to add unit if it is not specified
                this.selectedAgent.properties[newPropertyName] = (
                    {value: newPropVal}
                )
            }
        },
        addFlowArrayItem(direction, type, currency, name) {
            const agent = this.selectedAgent
            // Add the array if it doesn't exist
            if (!(typeof (agent.flows[direction][currency][type])==='object')) {
                agent.flows[direction][currency][type] = []
            }
            // Add the item to the array
            (agent.flows[direction][currency][type]).push(name)
        },
        addNewCriterion(currency, name, value, limit) {
            const agent = this.selectedAgent
            // Add Criteria if it doesn't exist
            if (!(typeof (agent.flows.out[currency].criteria)==='object')) {
                agent.flows.out[currency].criteria = {}
            }
            if (!(typeof (agent.flows.out[currency].criteria[name])==='object')) {
                agent.flows.out[currency].criteria[name] = {}
            }
            // Add the criterion
            agent.flows.out[currency].criteria[name].value=value
            agent.flows.out[currency].criteria[name].limit=limit
        },
        addNutrition() {
            const currency = this.currencyDesc[this.selectedCurrencyCategory][this.selectedCurrency]
            currency.nutrition = {}
            currency.nutrition.kcal = 0
            currency.nutrition.water = 0
            currency.nutrition.protein = 0
            currency.nutrition.carbohydrate = 0
            currency.nutrition.fat = 0
        },
        deleteNutrition() {
            delete this.currencyDesc[this.selectedCurrencyCategory][this.selectedCurrency].nutrition
        },
        addGrowth(currency, kind, pattern) {
            const agent = this.selectedAgent
            if (!(typeof (agent.flows.out[currency].growth)==='object')) {
                agent.flows.out[currency].growth = {}
            }
            agent.flows.out[currency].growth[kind] = {}
            agent.flows.out[currency].growth[kind].type=pattern
        },
        addDeprive(currency, value, unit) {
            this.selectedAgent.flows.in[currency].deprive = {}
            this.selectedAgent.flows.in[currency].deprive.value=value
            this.selectedAgent.flows.in[currency].deprive.unit=unit
        },
        createNewAgent() {
            const agentNumber = Object.keys(this.agentDesc).length + 1
            const newAgentName=`agent_${agentNumber}`
            this.agentDesc[newAgentName] = {}
            this.agentDesc[newAgentName].amount = 1
            this.agentDesc[newAgentName].flows = {}
            this.agentDesc[newAgentName].flows.in = {}
            this.agentDesc[newAgentName].flows.out = {}
            this.agentDesc[newAgentName].properties = {}
            this.agentDesc[newAgentName].agent_class=this.categorySelected
            // Switch to the new agent
            this.selectedAgentName=newAgentName
        },
        createNewCurrency() {
            // Generate a unique currency name
            // Count currencies
            this.selectedCurrencyCategory = this.currencyCategorySelected
            const currencyList = Object.keys(this.currencyDesc[this.selectedCurrencyCategory])
            const count = currencyList.length + 1
            const currencyNumber = count + 1
            const currency_number_string = `_currency_${currencyNumber}`
            const newCurrencyName=`${this.selectedCurrencyCategory}${currency_number_string}`
            // Create the empty object
            this.currencyDesc[this.selectedCurrencyCategory][newCurrencyName] = {}
            // Set empty parameters
            this.currencyDesc[this.selectedCurrencyCategory][newCurrencyName].label=''
            // Switch to newly generated currency
            this.generateCurrencyList()
            this.selectedCurrency=newCurrencyName
        },
        duplicateAgent() {
            const agentNumber = Object.keys(this.agentDesc).length + 1
            const newAgentName=`${this.selectedAgentName}_${agentNumber}`
            // Deep Copy the original object
            const copiedObject = JSON.parse(JSON.stringify(this.selectedAgent))
            this.agentDesc[newAgentName]=copiedObject
            // Switch to the copied agent
            this.selectedAgentName=newAgentName
            // Make sure to duplicate correspoding plant currency
            if (this.categorySelected==='plants') {
                // This really needs to be a notification like an alert, but alert does not pass lint
                console.log('PLANT. MAKE SURE PLANT FLOW CURRENCIES ARE UPDATED')
                console.log('AND NEW PLANT CURRENCIES ARE MADE TO MATCH (i.e. rice has rice)')
                console.log('as outflow, and has rice as a biomass connection)!')
            }
        },
        duplicateCurrency() {
            // ERROR: Duplicating currency more than once does not update #, currencDesc.length not chging
            const currencyNumber = Object.keys(this.currencyDesc).length + 1
            const newCurrencyName=`${this.selectedCurrency}_${currencyNumber}`
            // Deep Copy the original object
            const currencyCatSelected = this.currencyDesc[this.currencyCategorySelected]
            const originalObject = currencyCatSelected[this.selectedCurrency]
            const copiedObject = JSON.parse(JSON.stringify(originalObject))
            this.currencyDesc[this.currencyCategorySelected][newCurrencyName]=copiedObject
            // Switch to the copied agent
            this.selectedCurrency=newCurrencyName
            this.generateCurrencyList()
        },
        exportJSON() {
            // Package this agent singly
            const agentName = this.selectedAgentName
            this.customAgents[agentName] = this.selectedAgent
            let currentCustomAgents=localStorage.getItem('customAgents')
            currentCustomAgents=JSON.parse(currentCustomAgents)
            // If there isn't a custom agent object, create it.
            if (!(typeof (currentCustomAgents)==='object' && (currentCustomAgents!==null))) {
                currentCustomAgents = {}
            }
            // Add this agent to the custom agents object.
            currentCustomAgents[agentName] = this.customAgents[agentName]
            // Save to the local browser storage
            localStorage.setItem('customAgents', JSON.stringify(currentCustomAgents))
            // If plant, export currency for it, too
            if (this.categorySelected==='plants') {
                // This really needs to be a notification like an alert, but alert does not pass lint
                console.log('PLANT EXPORTED. MAKE SURE FLOW CURRENCIES ARE UPDATED, AND NEW PLANT')
                console.log('CURRENCIES EXPORTED TOO!')
            }
        },
        exportJSONCurrency() {
            const currencyName = this.selectedCurrency
            let currentCustomCurrencies = localStorage.getItem('customCurrencies')
            currentCustomCurrencies = JSON.parse(currentCustomCurrencies)
            // Check if the custom currency object exists
            if (typeof (currentCustomCurrencies)==='object' && (currentCustomCurrencies!==null)) {
                console.log('* Custom currencies object already exist! Appending *')
            } else { // Create the currency object
                console.log('* No custom currencies object found, creating from scratch *')
                currentCustomCurrencies = {}
            }
            // Create the currency category
            /*
            // In simoc abm, it expects custom currencies to have a "category" property instead of
            // being filed by category within the currency object. So instead of putting it in the
            // category, we can just file them under "custom" category and use the parameter
            // This commented code would be useful to create a custom category hierarchy within
            // the object if we wanted to change back:
            if(typeof (currentCustomCurrencies[this.currencyCategorySelected])=='object' &&
                (currentCustomCurrencies!=null)) {
            } else {
                currentCustomCurrencies[this.currencyCategorySelected] = {}
            }
            */
            let exportCategory = this.currencyCategorySelected
            this.customCurrencies[currencyName] = this.currencyDesc[exportCategory][currencyName]
            // Assign category for export
            if (exportCategory==='custom') {
                exportCategory = this.currencyDesc.custom[currencyName].category
            } else {
                this.customCurrencies[currencyName].category = exportCategory
            }
            currentCustomCurrencies[currencyName]=this.customCurrencies[currencyName]
            localStorage.setItem('customCurrencies', JSON.stringify(currentCustomCurrencies))
        },
        deleteExportAgent(agent) {
            let currentCustomAgents=localStorage.getItem('customAgents')
            currentCustomAgents=JSON.parse(currentCustomAgents)
            // If there isn't a custom agent object, create it.
            if (!(typeof (currentCustomAgents)==='object' && (currentCustomAgents!==null))) {
                currentCustomAgents = {}
            }
            // Remove this agent from custom agents object.
            delete currentCustomAgents[agent]
            // Save to the local browser storage
            localStorage.setItem('customAgents', JSON.stringify(currentCustomAgents))
            // Remove from custom agent names
            this.localAgentNames = this.localAgentNames.filter(item => item !== agent)
        },
        deleteExportCurrency(currency) {
            let currentCustomCurrencies=localStorage.getItem('customCurrencies')
            currentCustomCurrencies=JSON.parse(currentCustomCurrencies)
            // If there isn't a custom agent object, create it.
            if (!(typeof (currentCustomCurrencies)==='object'&&(currentCustomCurrencies!==null))) {
                currentCustomCurrencies = {}
            }
            // Remove this agent from custom agents object.
            delete currentCustomCurrencies[currency]
            // Save to the local browser storage
            localStorage.setItem('customCurrencies', JSON.stringify(currentCustomCurrencies))
            // Remove from custom agent names
            this.localCurrencyNames = this.localCurrencyNames.filter(item => item !== currency)
        },
        returnToMenu() { // Function to return to main menu
            this.$router.push('menu')
        },
        switchMode(mode) { // Function to swap between agent mode, currency mode, export data mode
            this.currentMode=mode
        },
        getCriteriaValueModel(currency, kind) { // Function to limit line length in Vue
            return this.agentOutFlow[currency].criteria[kind].value
        },
    },
}
</script>
<template>
    <div class="navMenu">
        <button @click="returnToMenu()">Return to Menu</button>
        <button v-if="currentMode!='exports'" @click="switchMode('exports')">Manage Exports</button>
        <button v-if="currentMode!='agent'" @click="switchMode('agent')">Agent Editor</button>
        <button v-if="currentMode!='currency'" @click="switchMode('currency')">Currency Editor</button>
    </div>
    <h2 v-if="currentMode==='exports'">Export manager for custom agents and currencies</h2>
    <div v-if="currentMode==='exports'" class="gridBoxEven">
        <div class="scrollie agentBox">
            <h3>Custom Exported Agents</h3>
            <p>Click to delete</p>
            <ul>
                <li v-for="agent in localAgentNames"
                    :key="agent">
                    <button @click="deleteExportAgent(agent)">{{agent}}</button>
                </li>
            </ul>
        </div>
        <div class="scrollie agentBox">
            <h3>Custom Exported Currencies</h3>
            <p>Click to delete</p>
            <ul>
                <li v-for="currency in localCurrencyNames"
                    :key="currency">
                    <button @click="deleteExportCurrency(currency)">{{currency}}</button>
                </li>
            </ul>
        </div>
    </div>
    <div v-if="typeof(currencyDesc[currencyCategorySelected])==='object' && currentMode==='currency'">
        <h2>Currency Editor</h2>
        <label> Currency Category
            <select id="currencyCategorySelector" v-model="currencyCategorySelected">
                <option v-for="category in currencyTypes" :key="category" :value="category"> {{category}} </option>
            </select>
        </label>
        <button @click="createNewCurrency()">Create New Blank Currency</button>
        <br>
        <br>
        <div class="gridBox">
            <div class="scrollie agentBox">
                <div id="buttonList">
                    <ul>
                        <li v-for="currency in Object.keys(currencyDesc[currencyCategorySelected])"
                            :key="currency">
                            <button @click="selectCurrency(currency)">{{currency}}</button>
                        </li>
                    </ul>
                </div> <!-- Button List -->
            </div> <!-- scrollie -->
            <div class="agentData">
                Currency: {{selectedCurrency}}
                <input v-model="newCurrencyName" type="text" name="newCurrencyName">
                <button @click="renameCurrency(newCurrencyName)">Rename Currency</button>
                <button @click="duplicateCurrency()">Duplicate Currency</button>
                <button @click="exportJSONCurrency()">Export Currency</button>
                <br>
                Label :
                <input v-model="currencyDesc[selectedCurrencyCategory][selectedCurrency].label" name="currencyLabel"
                       type="text">
                <br>
                Description:
                <input v-model="currencyDesc[selectedCurrencyCategory][selectedCurrency].description"
                       name="currencyDescription" type="text">
                <br>
                Source:
                <input v-model="currencyDesc[selectedCurrencyCategory][selectedCurrency].source"
                       name="currencySource" type="text">
                <br>
                Unit:
                <input v-model="currencyDesc[selectedCurrencyCategory][selectedCurrency].unit"
                       name="currencyUnit" type="text">
                <br>
                Short:
                <input v-model="currencyDesc[selectedCurrencyCategory][selectedCurrency].short"
                       name="currencyShort" type="text">
                <br>
                <span v-if="typeof(currencyDesc[selectedCurrencyCategory][selectedCurrency].nutrition)==='object'">
                    Nutrition-
                    <button @click="deleteNutrition()">Delete Nutrition</button>
                    {{currencyDesc[selectedCurrencyCategory][selectedCurrency].nutrition}}
                    <br> &nbsp; &nbsp; &nbsp; &nbsp; kcal:
                    <input v-model="currencyDesc[selectedCurrencyCategory][selectedCurrency].nutrition.kcal"
                           name="nutkcal" type="number">
                    <br> &nbsp; &nbsp; &nbsp; &nbsp; water:
                    <input v-model="currencyDesc[selectedCurrencyCategory][selectedCurrency].nutrition.water"
                           name="nutwater" type="number">
                    <br> &nbsp; &nbsp; &nbsp; &nbsp; protein:
                    <input v-model="currencyDesc[selectedCurrencyCategory][selectedCurrency].nutrition.protein"
                           name="nutprotein" type="number">
                    <br> &nbsp; &nbsp; &nbsp; &nbsp; carbohydrates:
                    <input v-model="currencyDesc[selectedCurrencyCategory][selectedCurrency].nutrition.carbohydrate"
                           name="nutcarb" type="number">
                    <br> &nbsp; &nbsp; &nbsp; &nbsp; fat:
                    <input v-model="currencyDesc[selectedCurrencyCategory][selectedCurrency].nutrition.fat"
                           name="nutfat" type="number">
                </span>
                <button v-else @click="addNutrition()">Add Nutrition </button>
                <br>
                <hr>
                {{currencyDesc[selectedCurrencyCategory][selectedCurrency]}}
            </div> <!-- CurrencyBox -->
        </div> <!-- gridBox -->
    </div> <!-- vif currency object exists -->
    <div v-if="currentMode==='agent'">
        <h2> Agent Editor </h2>
        <p>
            Supports custom plant agents. Make sure to add the corresponding 'out' flow currencies
            and biomass connection.
        </p>
        <p>
            For other agent types, the agent editor is experimental or not fully implemented.
        </p>
        <label for="categorySelector">Choose Agent Class:  </label>
        <select id="categorySelector" v-model="categorySelected">
            <option v-for="category in agentClasses" :key="category" :value="category">
                {{category}}
            </option>
        </select>
        <button @click="createNewAgent()">Create New Blank Agent</button>
        <br><br>
        <div id="gridbox" class="gridBox">
            <div id="agentSelector" class="scrollie agentBox">
                <h2> Agents ({{categorySelected}}): </h2>
                <ul>
                    <li v-for="item in agentsInClass" :key="item">
                        <button @click="selectItem(item)">{{item}}</button>
                    </li>
                </ul>
            </div> <!-- Agent Selector -->
            <div v-if="typeof(agentDesc)==='object'" id="agentPresenter" class="agentData scrollie">
                <h2> {{selectedAgentName}}  <input v-model="newAgentName" name="newAgentName" type="text">
                    <button @click="renameAgent(newAgentName)">Rename Agent</button>
                    <button @click="duplicateAgent()">Duplicate Agent</button>
                    <button @click="exportJSON()">Export Agent</button>
                </h2>
                <ul>
                    <li>Agent Class:
                        <select id="categoryChanger" v-model="selectedAgent.agent_class">
                            <option v-for="category in agentClasses" :key="category" :value="category">
                                {{category}}
                            </option>
                        </select>
                        <label>
                            Change to custom class:
                            <input v-model="customClassName" name="customClass" type="text">
                        </label>
                        <button @click="setCustomClass">Set Custom Class</button>
                    </li>
                    <li>Description: <br>
                        <textarea v-model="selectedAgent.description"
                                  name="descriptionField" rows="4" cols="100" />
                    </li>
                </ul>
                <details>
                    <summary>Capacity</summary>
                    <ul>
                        <li v-for="(value, key) in selectedAgent.capacity" :key="key">
                            {{key}}
                            (Change to:
                            <input v-model="capacityTypes[key]" name="capType" type="text">
                            <button @click="changeCapacityType(key, value, capacityTypes[key])">Change</button>)
                            :::::
                            Quantity:
                            <input v-model="selectedAgent.capacity[key]" name="capVal" type="number">
                            <button @click="removeCapacity(key)">Remove Capacity</button>
                        </li>
                        <li class="newItem">
                            New Capacity:
                            <input v-model="newCapacityType" name="newCapType" type="text">
                            :::::
                            Quantity:
                            <input v-model="newCapacityValue" name="newCapVal" type="number">
                            <button @click="addNewCapacity(newCapacityType, newCapacityValue)">Add Capacity</button>
                        </li>
                    </ul>
                </details> <!-- END OF CAPACITY -->
                <details>
                    <summary>Flows</summary>
                    <details>
                        <summary>In Currencies</summary>
                        <ul> <!-- In currency ul -->
                            <li v-for="(value, currency) in selectedAgent.flows.in" :key="currency">
                                <details>
                                    <summary>{{currency}}
                                        <button @click="removeInFlow(currency)">Remove In Flow Currency</button>
                                    </summary>
                                    <label>Change currency to:
                                        <select v-model="inTypes[currency]" name="changeInFlowCurrency">
                                            <option v-for="item in currencyList" :key="item" :value="item">
                                                {{item}}
                                            </option>
                                        </select>
                                    </label>
                                    <button @click="changeInType(currency, value, inTypes[currency])">Change</button>
                                    <ul>
                                        <li> Value:
                                            <input v-model="selectedAgent.flows.in[currency].value"
                                                   name="flowValueFieldIn" type="number">
                                        </li>
                                        <li> flow_rate:
                                            <ul>
                                                <li>Unit:
                                                    <input v-model="selectedAgent.flows.in[currency].flow_rate.unit"
                                                           name="flowInUnit" type="text">
                                                </li>
                                                <li>Time:
                                                    <input v-model="selectedAgent.flows.in[currency].flow_rate.time"
                                                           name="flowInTime" type="text">
                                                </li>
                                            </ul>
                                        </li>
                                        <li> connections :
                                            <span
                                                v-if="typeof(selectedAgent.flows.in[currency].connections)
                                                    ==='object'">
                                                (Click to remove)
                                                <button
                                                    v-for="(connection) in
                                                        selectedAgent.flows.in[currency].connections"
                                                    :key="connection"
                                                    @click="removeFlowArrayItem(
                                                        'in', 'connections',
                                                        currency, connection)">
                                                    {{connection}}
                                                </button>
                                                <br>
                                            </span>
                                            <input v-model="newConnectionIn" name="connectionNewName" type="text">
                                            <button @click="addFlowArrayItem(
                                                'in', 'connections', currency, newConnectionIn)">
                                                Add new Connection
                                            </button>
                                        </li>
                                        <li> weighted:
                                            <span v-if="typeof(selectedAgent.flows.in[currency].weighted)
                                                ==='object'">
                                                (Click to remove)
                                                <button
                                                    v-for="(weighted)
                                                        in selectedAgent.flows.in[currency].weighted"
                                                    :key="weighted"
                                                    @click="removeFlowArrayItem('in', 'weighted', currency, weighted)">
                                                    {{weighted}}
                                                </button>
                                                <br>
                                            </span>
                                            <input v-model="newWeightedIn" name="newWeighted" type="text">
                                            <button @click="addFlowArrayItem(
                                                'in', 'weighted', currency, newWeightedIn)">
                                                Add new Weighted
                                            </button>
                                        </li>
                                        <li> deprive:
                                            <ul v-if="typeof(selectedAgent.flows.in[currency].deprive)==='object'">
                                                <button @click="removeDeprive(currency)">
                                                    Disable Deprive [Currently Enabled]
                                                </button>
                                                <li>Value:
                                                    <input v-model="selectedAgent.flows.in[currency].deprive.value"
                                                           name="depriveValue" type="number">
                                                </li>
                                                <li>Unit:
                                                    <input v-model="selectedAgent.flows.in[currency].deprive.unit"
                                                           name="depriveUnit" type="text">
                                                </li>
                                            </ul>
                                            <ul v-else class="newItem">
                                                <button @click="addDeprive(currency, newDepriveValue, newDepriveUnit)">
                                                    Enable Deprive [Currently Disabled]
                                                </button>
                                                <li>Value:
                                                    <input v-model="newDepriveValue"
                                                           name="newDepriveName" type="number">
                                                </li>
                                                <li>Unit:
                                                    <input v-model="newDepriveUnit" name="newDepriveUnit" type="text">
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </details>
                            </li>
                            <li class="newItem"> <!-- NEW FLOW -->
                                <label>New In Flow:
                                    <select v-model="newInType" name="newInFlowCurrencySelector">
                                        <option v-for="item in currencyList"
                                                :key="item" :value="item">
                                            {{item}}
                                        </option>
                                    </select>
                                </label>
                                <button @click="addNewFlow('in', newInType)">Add In Flow Currency</button>
                            </li>
                        </ul> <!-- In currency ul -->
                    </details> <!-- END in currency -->
                    <details>
                        <summary>Out Currencies</summary>
                        <ul> <!-- Out Currency ul -->
                            <li v-for="(value, currency) in agentOutFlow" :key="currency">
                                <details>
                                    <summary>
                                        {{currency}}
                                        <button @click="removeOutFlow(currency)">
                                            Remove Out Flow Currency
                                        </button>
                                    </summary>
                                    Change currency to:
                                    <label>
                                        <select v-model="outTypes[currency]" name="changeOutCurrencySelector">
                                            <option v-for="item in currencyList" :key="item" :value="item">
                                                {{item}}
                                            </option>
                                        </select>
                                    </label>
                                    <button @click="changeOutType(currency, value, outTypes[currency])">Change</button>
                                    <ul> <!-- Out currency -->
                                        <li> Value:
                                            <input v-model="agentOutFlow[currency].value"
                                                   name="flowValueOut" type="number">
                                        </li>
                                        <li> flow_rate:
                                            <ul>
                                                <li>Unit:
                                                    <input v-model="agentOutFlow[currency].flow_rate.unit"
                                                           name="flowUnitOut" type="text">
                                                </li>
                                                <li>Time:
                                                    <input v-model="agentOutFlow[currency].flow_rate.time"
                                                           name="flowTimeOut" type="text">
                                                </li>
                                            </ul>
                                        </li>
                                        <li> connections:
                                            <span v-if="typeof(agentOutFlow[currency].connections)
                                                ==='object'">
                                                (Click to remove)
                                                <button
                                                    v-for="(connection)
                                                        in agentOutFlow[currency].connections"
                                                    :key="connection"
                                                    @click="removeFlowArrayItem(
                                                        'out', 'connections', currency, connection)">
                                                    {{connection}}
                                                </button>
                                                <br>
                                            </span>
                                            <input v-model="newConnectionOut" name="addNewConnectName" type="text">
                                            <button @click="addFlowArrayItem(
                                                'out', 'connections', currency, newConnectionOut)">
                                                Add new Connection
                                            </button>
                                        </li>
                                        <li> weighted:
                                            <span v-if="typeof(agentOutFlow[currency].weighted)
                                                ==='object'">
                                                (Click to remove)
                                                <button v-for="(weighted) in
                                                            agentOutFlow[currency].weighted"
                                                        :key="weighted"
                                                        @click="removeFlowArrayItem(
                                                            'out', 'weighted', currency, weighted)">
                                                    {{weighted}}
                                                </button>
                                                <br>
                                            </span>
                                            <input v-model="newWeightedOut" name="addNewWeightedNameOut" type="text">
                                            <button @click="addFlowArrayItem(
                                                'out', 'weighted', currency, newWeightedOut)">
                                                Add new Weighted
                                            </button>
                                        </li>
                                        <li> requires :
                                            <span v-if="typeof(agentOutFlow[currency].requires)
                                                ==='object'">
                                                (Click to remove)
                                                <button v-for="(requires)
                                                            in agentOutFlow[currency].requires"
                                                        :key="requires"
                                                        @click="removeFlowArrayItem('out',
                                                                                    'requires',
                                                                                    currency, requires)">
                                                    {{requires}}
                                                </button>
                                                <br>
                                            </span>
                                            <label> (Currency)
                                                <select v-model="newRequires" name="requiresCurrencySelector">
                                                    <option v-for="item in currencyList" :key="item"
                                                            :value="item"> {{item}}
                                                    </option>
                                                </select>
                                            </label>
                                            <button @click="addFlowArrayItem('out', 'requires', currency, newRequires)">
                                                Add new Requires
                                            </button>
                                        </li>
                                        <li> growth:
                                            <ul v-if="typeof(agentOutFlow[currency].growth)==='object'">
                                                <li v-for="(pattern, kind)
                                                        in agentOutFlow[currency].growth"
                                                    :key="kind">
                                                    {{kind}}
                                                    (Change to:
                                                    <input v-model="kindTypes[kind]" name="kindTypeName" type="text">
                                                    <button @click="changeGrowthType(
                                                        kind, pattern, kindTypes[kind], currency)">
                                                        Change
                                                    </button>)
                                                    <button @click="removeGrowth(currency, kind)">Remove Growth</button>
                                                    :::::
                                                    <ul>
                                                        <li> Type:
                                                            <input
                                                                v-model="agentOutFlow[currency].growth[kind].type"
                                                                name="growthTypeField" type="text">
                                                        </li>
                                                    </ul>
                                                </li>
                                            </ul>
                                            <label>
                                                New Growth Kind:
                                                <input v-model="newGrowthKind" name="newGrowthKind" type="text">
                                            </label>
                                            <ul>
                                                <li> Type:
                                                    <input v-model="newGrowthPattern" name="newGrowthPatternTypeField"
                                                           type="text">
                                                </li>
                                            </ul>
                                            <button @click="addGrowth(currency, newGrowthKind, newGrowthPattern)">
                                                Add Growth
                                            </button>
                                        </li>
                                        <li> criteria:
                                            <ul v-if="typeof(agentOutFlow[currency].criteria)==='object'">
                                                <li v-for="(pattern, kind)
                                                    in agentOutFlow[currency].criteria" :key="kind">
                                                    {{kind}}
                                                    (
                                                    <label>Change to:
                                                        <input v-model="kindTypes[kind]" name="kindTypeCriteria"
                                                               type="text">
                                                    </label>
                                                    <button @click="changeCriterionType(
                                                        kind, pattern, kindTypes[kind], currency)">
                                                        Change
                                                    </button>)
                                                    <button @click="removeCriterion(currency, kind)">
                                                        Remove Criterion
                                                    </button>
                                                    :::::
                                                    <ul>
                                                        <li> Limit:
                                                            <select
                                                                v-model="agentOutFlow[currency].criteria[kind].limit"
                                                                name="criteriaLimitField">
                                                                <option value="&lt;"> &lt; </option>
                                                                <option value="&equals;"> = </option>
                                                                <option value="&gt;"> &gt; </option>
                                                            </select>
                                                        </li>
                                                        <li> Value:
                                                            <select
                                                                v-model="agentOutFlow[currency].criteria[kind].value"
                                                                name="criteriaValueField">
                                                                <option :value="true">True</option>
                                                                <option :value="false">False</option>
                                                            </select>
                                                        </li>
                                                    </ul>
                                                </li>
                                            </ul>
                                            <ul>
                                                <li>
                                                    <input v-model="newCriterionName" name="newCriterionNameField"
                                                           type="text">
                                                    <button @click="addNewCriterion(currency, newCriterionName,
                                                                                    newCriterionValue,
                                                                                    newCriterionLimit)">
                                                        Add new Criterion
                                                    </button>
                                                    <ul>
                                                        <li> Limit:
                                                            <select v-model="newCriterionLimit"
                                                                    name="criterionLimitFieldNew">
                                                                <option value="&lt;"> &lt; </option>
                                                                <option value="&equals;"> = </option>
                                                                <option value="&gt;"> &gt; </option>
                                                            </select>
                                                        </li>
                                                        <li> Value:
                                                            <select v-model="newCriterionValue"
                                                                    name="criterionValueFieldNew">
                                                                <option :value="true">True</option>
                                                                <option :value="false">False</option>
                                                            </select>
                                                        </li>
                                                    </ul>
                                                </li> <!-- Criterion Item -->
                                            </ul>
                                        </li> <!-- Criteria -->
                                    </ul> <!-- Out currency -->
                                </details>
                            </li>
                            <li class="newItem"> <!-- NEW FLOW -->
                                <label>
                                    New Out Flow:
                                    <select v-model="newOutType" name="outFlowCurrencySelector">
                                        <option v-for="item in currencyList" :key="item" :value="item">
                                            {{item}}
                                        </option>
                                    </select>
                                </label>
                                <button @click="addNewFlow('out',newOutType)">Add Out Flow Currency</button>
                            </li>
                        </ul> <!-- Out Currency ul -->
                    </details><!-- End Out Currency -->
                </details><details><summary>Thresholds</summary>
                    <h4> Currencies </h4>
                    <ul>
                        <li v-for="(value, currency) in selectedAgent.thresholds" :key="currency">
                            {{currency}}
                            (
                            <label>Change to:
                                <select v-model="thresholdTypes[currency]" name="changeThresholdCurrency">
                                    <option v-for="item in currencyList" :key="item" :value="item">
                                        {{item}}
                                    </option>
                                </select>
                            </label>
                            <button @click="changeThresholdType(currency, value, thresholdTypes[currency])">Change</button>)
                            <button @click="removeThreshold(currency)">Remove Currency</button>
                            <ul>
                                <li> Path:
                                    <input v-model="selectedAgent.thresholds[currency].path"
                                           name="thesholdPathField" type="text">
                                </li>
                                <li> Limit:
                                    <select v-model="selectedAgent.thresholds[currency].limit"
                                            name="thresholdLimitField">
                                        <option value="&lt;"> &lt; </option>
                                        <option value="&equals;"> = </option>
                                        <option value="&gt;"> &gt; </option>
                                    </select>
                                </li>
                                <li> Value:
                                    <input v-model="selectedAgent.thresholds[currency].value"
                                           name="thesholdValueField" type="number">
                                </li>
                                <li> Connnections:
                                    <input v-model="selectedAgent.thresholds[currency].connections"
                                           name="connectionsThresholdsField" type="text">
                                </li>
                            </ul>
                        </li>
                        <li class="newItem"> <!-- NEW FLOW -->
                            <label>New Currency:
                                <select v-model="newThresholdCurrency" name="newThresholdCurrency" selected="o2">
                                    <option v-for="item in currencyList" :key="item" :value="item">
                                        {{item}}
                                    </option>
                                </select>
                            </label>
                            <ul>
                                <li> Path:  <input v-model="newThresholdPath" name="newThresholdPathField" type="text">
                                </li>
                                <li> Limit:
                                    <select v-model="newThresholdLimit" name="thresholdLimitFieldNew">
                                        <option value="&lt;"> &lt; </option>
                                        <option value="&equals;"> = </option>
                                        <option value="&gt;"> &gt; </option>
                                    </select>
                                </li>
                                <li> Value: <input v-model="newThresholdValue" type="number" name="newThresholdsValueField">
                                </li>
                                <li> Connnections:
                                    <input v-model="newThresholdConnections" type="text"
                                           name="newThresholdConnectionsField">
                                </li>
                            </ul>
                            <button @click="addNewThreshold(newThresholdCurrency, newThresholdPath,
                                                            newThresholdLimit, newThresholdValue,
                                                            newThresholdConnections)">
                                Add Threshold Currency
                            </button>
                        </li> <!-- NEW FLOW -->
                    </ul>
                </details><!-- END OF THRESHOLDS -->
                <details><summary>Properties</summary>
                    <ul>
                        <li v-for="(attributes, property) in selectedAgent.properties" :key="property">
                            {{property}} (Change to:
                            <input v-model="propertyNames[property]" name="propertyName" type="text">
                            <button @click="changePropertyName(property, attributes, propertyNames[property])">
                                Change
                            </button>)
                            <button @click="removeProperty(property)">Remove</button>
                            <ul> <!-- Property Attributes -->
                                <li>
                                    value: {{attributes.value}}
                                    <input v-model="changedPropVal" name="propVal" type="text">
                                    <button @click="changePropertyValue(property, changedPropVal)">Change Value</button>
                                </li>
                                <li>unit:
                                    <input v-model="selectedAgent.properties[property].unit"
                                           name="propUnit" type="text" col="15">
                                </li>
                            </ul>
                        </li>
                        <li class="newItem">
                            New Property:
                            <input v-model="newPropertyName" name="newPropertyName" type="text">
                            <ul> <!-- Property Attributes -->
                                <li>value: <input v-model="newPropVal" name="propValField" type="text"> </li>
                                <li>unit: <input v-model="newPropUnit" name="propUnitField" type="text"> </li>
                                <button @click="addNewProperty(newPropertyName, newPropVal, newPropUnit)">
                                    Add New Property
                                </button>
                            </ul>
                        </li>
                    </ul>
                </details>
                <h2> Agent JSON Content View </h2>
                <hr>
                <ul>
                    <li v-for="(value, key) in selectedAgent" :key="key">
                        <b>{{key}}</b> :
                        <i v-if="typeof(value)!='object'">{{value}}</i>
                        <ul v-else>
                            <li v-for="(subvalue, subkey) in selectedAgent[key]" :key="subkey">
                                <b>{{subkey}}</b> :
                                <i v-if="typeof(subvalue)!='object'">{{subvalue}}</i>
                                <ul v-else>
                                    <li v-for="(subsubvalue, subsubkey) in selectedAgent[key][subkey]" :key="subsubkey">
                                        <b>{{subsubkey}}</b> :
                                        <i v-if="typeof(subsubvalue)!='object'">{{subsubvalue}}</i>
                                        <ul v-else>
                                            <li v-for="(subsubsubvalue, subsubsubkey)
                                                in selectedAgent[key][subkey][subsubkey]" :key="subsubsubkey">
                                                <b>{{subsubsubkey}}</b> :  {{subsubsubvalue}}
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div> <!-- gridBox -->
    </div> <!-- agentMode div -->
</template>
<style scoped>

summary {
    font-weight: bold;
}
details {
    background-color: rgba(150,150,150,0.2);
    border: 2px dotted grey;
    padding: 10px;
}
details ul {
    list-style-type: none;
}
.navMenu {
    display: flex;
    justify-content: center;
}
.gridBox {
            display: grid;
            grid-template-columns: 1fr 5fr;
            grid-gap: 10px;
}
.gridBoxEven {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-gap: 10px;
}
.scrollie {
    overflow-y: scroll !important;
    /* FireFox */
    scrollbar-width: auto;
    scrollbar-color: grey black;
    height: 400px;
    width: 100%;
}
.agentBox {
    padding: 3px;
    border: solid grey 2px;
}
.agentData {
    padding: 5px;
    border: solid grey 5px;
    color: white;
    background-color: rgba(250,100,100,0.1);
}
.newItem {
    background-color: rgba(250,100,100,0.3);
    border: 2px dotted white;
}
</style>

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
        }
    },
    computed: {
        currencyTypes() {
            const listOfTypes = []
            /* Determine list of type */
            for (const key in this.currencyDesc) {
                const currencyType = key
                if (!listOfTypes.includes(currencyType)) listOfTypes.push(currencyType)
            }
            return listOfTypes
        },
        agentClasses() {
            const listOfClasses = []
            /* Determine list of agent_class */
            for (const key in this.agentDesc) {
                const className = this.agentDesc[key].agent_class
                if (!listOfClasses.includes(className)) listOfClasses.push(className)
            }
            return listOfClasses
        },
        agentsInClass() {
            const listOfAgents = []
            for (const item in this.agentDesc) {
                const itemsClass = this.agentDesc[item].agent_class
                if (itemsClass==this.categorySelected) { listOfAgents.push(item) }
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
        // this.setAgentClass()
        this.removeSurplusAgentData()

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
            if (typeof (localStorageAgents)=='object' && (localStorageAgents!=null)) {
                console.log('Agents found in local storage:')
                for (const agent in (localStorageAgents)) {
                    console.log(agent)
                    this.agentDesc[agent] = localStorageAgents[agent]
                }
            } else {
                console.log(' * No agents loaded from local storage *')
            }
        },
        getLocalStorageCurrencies() {
            let localStorageCurrencies = localStorage.getItem('customCurrencies')
            localStorageCurrencies = JSON.parse(localStorageCurrencies)
            if (typeof (localStorageCurrencies)=='object' && (localStorageCurrencies!=null)) {
                // for(let category in localStorageCurrencies)
                // console.log("Currencies found in local storage:")
                // for (let currency in category) {
                //  console.log(currency)
                //  this.currencyDesc[category][currency] = localStorageCurrencies[currency]
                // }
                if (typeof (this.currencyDesc.custom)=='object' && (localStorageCurrencies!=null)) {
                    // Object exists
                } else {
                    this.currencyDesc.custom = {}
                }
                for (const currency in localStorageCurrencies) {
                    console.log(currency)
                    this.currencyDesc.custom[currency] = localStorageCurrencies[currency]
                }
            } else {
                console.log(' * No agents loaded from local storage *')
            }
        },
        async getCurrencyDesc() {
            try {
                // Retrieve agent desc  from the backend
                console.log(`* Loading Currency Desc from backend *`)
                const response = await axios.get('/get_currency_desc')
                const currencyDesc = response.data.currency_desc
                console.log(currencyDesc)
                return currencyDesc  // get the actual data out of the response object
            } catch (error) {
                console.log('* Loading agent desc failed! *')
                console.error(error)
                return null
            }
        },
        generateCurrencyList() {
            const currancies = []
            this.currencyList = []
            for (const type in (this.currencyDesc)) {
                for (const subkey in (this.currencyDesc[type])) {
                    currancies.push(subkey)
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
        setAgentClass() {
            this.agentDesc[this.selectedAgentName].agent_class= 'plants'
        },
        removeSurplusAgentData() {
            /* Probably we should actually duplicate the agentDesc to create one just for the display of data that is trimmed down,
               Since copied/modified agents will want to still contain necessary fields that don't need to be shown */
            for (const key in this.agentDesc) {
                /* amount = 1 is for all, so it doesn't need to be there*/
                // delete this.agentDesc[key].amount
            }
        },
        submitAgent() {
            this.agentDesc[this.categorySelected][this.selectedAgentName] = {'data': 0}
        },
        selectItem(item) {
            this.selectedAgentName = item
        },
        selectCurrency(currency) {
            this.selectedCurrency = currency
            this.selectedCurrencyCategory = this.currencyCategorySelected
        },
        setCustomClass() {
            this.agentDesc[this.selectedAgentName].agent_class=this.customClassName
            this.categorySelected = this.customClassName
        },
        removeCapacity(key) {
            delete this.agentDesc[this.selectedAgentName].capacity[key]
            // Remove the capacities object if there are no capacities in it.
            if ((Object.keys(this.agentDesc[this.selectedAgentName].capacity).length) == 0) {
                delete this.agentDesc[this.selectedAgentName].capacity
            }
        },
        removeInFlow(currency) {
            delete this.agentDesc[this.selectedAgentName].flows.in[currency]
        },
        removeOutFlow(currency) {
            delete this.agentDesc[this.selectedAgentName].flows.out[currency]
        },
        removeThreshold(currency) {
            delete this.agentDesc[this.selectedAgentName].thresholds[currency]
            // Remove thresholds object if there are no currencies listed
            if (Object.keys(this.agentDesc[this.selectedAgentName].thresholds).length == 0) {
                delete this.agentDesc[this.selectedAgentName].thresholds
            }
        },
        removeProperty(property) {
            delete this.agentDesc[this.selectedAgentName].properties[property]
        },
        removeGrowth(currency, kind) {
            // Delete the specific kind of growth
            delete this.agentDesc[this.selectedAgentName].flows.out[currency].growth[kind]
            // Remove the growth object if there are no growths in it.
            if (Object.keys(this.agentDesc[this.selectedAgentName].flows.out[currency].growth).length == 0) {
                delete this.agentDesc[this.selectedAgentName].flows.out[currency].growth
            }
        },
        removeCriterion(currency, kind) {
            // Delete the specific kind of criterion
            delete this.agentDesc[this.selectedAgentName].flows.out[currency].criteria[kind]
            // Remove the criteria object if there are no growths in it.
            if (Object.keys(this.agentDesc[this.selectedAgentName].flows.out[currency].criteria).length == 0) {
                delete this.agentDesc[this.selectedAgentName].flows.out[currency].criteria
            }
        },
        removeFlowArrayItem(direction, type, currency, name) {
            const index = this.agentDesc[this.selectedAgentName].flows[direction][currency][type].indexOf(name)
            // Delete the connection by its array index number
            if (index !== -1) {
                this.agentDesc[this.selectedAgentName].flows[direction][currency][type].splice(index, 1)
            }
            // Remove the flow array array if it is empty
            if ((this.agentDesc[this.selectedAgentName].flows[direction][currency][type]).length == 0) {
                delete this.agentDesc[this.selectedAgentName].flows[direction][currency][type]
            }
        },
        removeDeprive(currency) {
            delete this.agentDesc[this.selectedAgentName].flows.in[currency].deprive
        },
        changePropertyValue(property, newPropVal) {
            if (!isNaN(newPropVal)) { /* If it is a number, make sure it is a number and not a string */
                newPropVal = +newPropVal
            }
            if (newPropVal=='true') { newPropVal = true }
            if (newPropVal=='false') { newPropVal = false }
            this.agentDesc[this.selectedAgentName].properties[property].value=newPropVal
        },
        renameAgent(newName) {
            // Make Sure Agent Doesn't Already Exist
            for (name in this.agentDesc) {
                if (name == newName) {
                    const alertString = `${newName} already exists, try another name!`
                    alert(alertString)
                    return
                }
            }
            // Rename Object
            const thisAgent = this.agentDesc[this.selectedAgentName]
            this.agentDesc[newName] = thisAgent
            delete this.agentDesc[this.selectedAgentName]
            this.selectedAgentName = newName
            // Make sure that if it is a plant, the corresponding currency is renamed also
            if (this.categorySelected=='plants') {
                alert('PLANT. MAKE SURE PLANT FLOW CURRENCIES ARE UPDATED/CREATED, (i.e. rice has rice as outflow, and has rice as a biomass connection)!')
            }
            // Export the plant currency
        },
        renameCurrency(newName) {
            // Make Sure Currency Doesn't Already Exist
            for (const currency in this.currencyDesc[this.currencyCategorySelected]) {
                if (currency == newName) {
                    const alertString = `${newName} already exists, try another name!`
                    alert(alertString)
                    return
                }
            }
            // Rename Object
            const thisCurrency = this.currencyDesc[this.currencyCategorySelected][this.selectedCurrency]
            this.currencyDesc[this.currencyCategorySelected][newName] = thisCurrency
            delete this.currencyDesc[this.currencyCategorySelected][this.selectedCurrency]
            this.selectedCurrency = newName
            this.generateCurrencyList()
        },
        changeType(key, value, newName) {
            this.agentDesc[this.selectedAgentName].capacity[newName]=value
            delete this.agentDesc[this.selectedAgentName].capacity[key]
        },
        changeInType(key, value, newName) {
            this.agentDesc[this.selectedAgentName].flows.in[newName]=value
            delete this.agentDesc[this.selectedAgentName].flows.in[key]
        },
        changeOutType(key, value, newName) {
            this.agentDesc[this.selectedAgentName].flows.out[newName]=value
            delete this.agentDesc[this.selectedAgentName].flows.out[key]
        },
        changeThresholdType(key, value, newName) {
            this.agentDesc[this.selectedAgentName].thresholds[newName]=value
            delete this.agentDesc[this.selectedAgentName].thresholds[key]
        },
        changePropertyName(key, value, newName) {
            this.agentDesc[this.selectedAgentName].properties[newName]=value
            delete this.agentDesc[this.selectedAgentName].properties[key]
        },
        changeGrowthType(kind, value, newName, key) {
            this.agentDesc[this.selectedAgentName].flows.out[key].growth[newName]=value
            delete this.agentDesc[this.selectedAgentName].flows.out[key].growth[kind]
        },
        changeCriterionType(kind, value, newName, key) {
            this.agentDesc[this.selectedAgentName].flows.out[key].criteria[newName]=value
            delete this.agentDesc[this.selectedAgentName].flows.out[key].criteria[kind]
        },
        addNewCapacity(key, value) {
            // Add the capacity object if it doesn't exist
            if (!(typeof (this.agentDesc[this.selectedAgentName].capacity)=='object')) {
                this.agentDesc[this.selectedAgentName].capacity = {}
            }
            this.agentDesc[this.selectedAgentName].capacity[key]=value
        },
        addNewFlow(direction, currency) {
            this.agentDesc[this.selectedAgentName].flows[direction][currency]={}
            this.agentDesc[this.selectedAgentName].flows[direction][currency].flow_rate = {}
        },
        addNewThreshold(currency, path, limit, value, connections) {
            // Add the threshold object if it doesn't exist
            if (!(typeof (this.agentDesc[this.selectedAgentName].thresholds)=='object')) {
                this.agentDesc[this.selectedAgentName].thresholds = {}
            }
            this.agentDesc[this.selectedAgentName].thresholds[currency]={}
            this.agentDesc[this.selectedAgentName].thresholds[currency].path=path
            this.agentDesc[this.selectedAgentName].thresholds[currency].limit=limit
            this.agentDesc[this.selectedAgentName].thresholds[currency].value=value
            this.agentDesc[this.selectedAgentName].thresholds[currency].connections=connections
        },
        addNewProperty(newPropertyName, newPropVal, newPropUnit) {
            if (!isNaN(newPropVal)) { /* If it is a number, make sure it is a number and not a string */
                newPropVal = +newPropVal
            }
            if (newPropVal=='true') { newPropVal = true }
            if (newPropVal=='false') { newPropVal = false }
            if (newPropUnit != '') {
                this.agentDesc[this.selectedAgentName].properties[newPropertyName] = {'value': newPropVal, 'unit': newPropUnit}
            } else { // Make sure not to add unit if it is not specified
                this.agentDesc[this.selectedAgentName].properties[newPropertyName] = {'value': newPropVal}
            }
        },
        addFlowArrayItem(direction, type, currency, name) {
            // Add the array if it doesn't exist
            if (!(typeof (this.agentDesc[this.selectedAgentName].flows[direction][currency][type])=='object')) {
                this.agentDesc[this.selectedAgentName].flows[direction][currency][type] = []
            }
            // Add the item to the array
            (this.agentDesc[this.selectedAgentName].flows[direction][currency][type]).push(name)
        },
        addNewCriterion(currency, name, value, limit) {
            // Add Criteria if it doesn't exist
            if (!(typeof (this.agentDesc[this.selectedAgentName].flows.out[currency].criteria)=='object')) {
                this.agentDesc[this.selectedAgentName].flows.out[currency].criteria = {}
            }
            if (!(typeof (this.agentDesc[this.selectedAgentName].flows.out[currency].criteria[name])=='object')) {
                this.agentDesc[this.selectedAgentName].flows.out[currency].criteria[name] = {}
            }
            // Add the criterion
            this.agentDesc[this.selectedAgentName].flows.out[currency].criteria[name].value=value
            this.agentDesc[this.selectedAgentName].flows.out[currency].criteria[name].limit=limit
        },
        addNutrition() {
            this.currencyDesc[this.selectedCurrencyCategory][this.selectedCurrency].nutrition = {}
            this.currencyDesc[this.selectedCurrencyCategory][this.selectedCurrency].nutrition.kcal = 0
            this.currencyDesc[this.selectedCurrencyCategory][this.selectedCurrency].nutrition.water = 0
            this.currencyDesc[this.selectedCurrencyCategory][this.selectedCurrency].nutrition.protein = 0
            this.currencyDesc[this.selectedCurrencyCategory][this.selectedCurrency].nutrition.carbohydrate = 0
            this.currencyDesc[this.selectedCurrencyCategory][this.selectedCurrency].nutrition.fat = 0
        },
        deleteNutrition() {
            delete this.currencyDesc[this.selectedCurrencyCategory][this.selectedCurrency].nutrition
        },
        addGrowth(currency, kind, pattern) {
            if (!(typeof (this.agentDesc[this.selectedAgentName].flows.out[currency].growth)=='object')) {
                this.agentDesc[this.selectedAgentName].flows.out[currency].growth = {}
            }
            this.agentDesc[this.selectedAgentName].flows.out[currency].growth[kind] = {}
            this.agentDesc[this.selectedAgentName].flows.out[currency].growth[kind].type=pattern
        },
        addDeprive(currency, value, unit) {
            this.agentDesc[this.selectedAgentName].flows.in[currency].deprive = {}
            this.agentDesc[this.selectedAgentName].flows.in[currency].deprive.value=value
            this.agentDesc[this.selectedAgentName].flows.in[currency].deprive.unit=unit
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
            let count = 0
            this.selectedCurrencyCategory = this.currencyCategorySelected
            for (const item in this.currencyDesc[this.selectedCurrencyCategory]) {
                count+=1
            }
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
            const copiedObject = JSON.parse(JSON.stringify(this.agentDesc[this.selectedAgentName]))
            this.agentDesc[newAgentName]=copiedObject
            // Switch to the copied agent
            this.selectedAgentName=newAgentName
            // Make sure to duplicate correspoding plant currency
            if (this.categorySelected=='plants') {
                alert('PLANT. MAKE SURE PLANT FLOW CURRENCIES ARE UPDATED, AND NEW PLANT CURRENCIES ARE MADE TO MATCH (i.e. rice has rice as outflow, and has rice as a biomass connection)!')
            }
        },
        duplicateCurrency() {
            const currencyNumber = Object.keys(this.currencyDesc).length + 1
            const newCurrencyName=`${this.selectedCurrency}_${currencyNumber}`
            // Deep Copy the original object
            const copiedObject = JSON.parse(JSON.stringify(this.currencyDesc[this.currencyCategorySelected][this.selectedCurrency]))
            this.currencyDesc[this.currencyCategorySelected][newCurrencyName]=copiedObject
            // Switch to the copied agent
            this.selectedCurrency=newCurrencyName
            this.generateCurrencyList()
        },
        exportJSON() {
            // Package this agent singly
            const agentName = this.selectedAgentName
            this.customAgents[agentName] = this.agentDesc[this.selectedAgentName]
            let currentCustomAgents=localStorage.getItem('customAgents')
            currentCustomAgents=JSON.parse(currentCustomAgents)
            if (typeof (currentCustomAgents)=='object' && (currentCustomAgents!=null)) {
                currentCustomAgents[agentName] = this.customAgents[agentName]
            } else {
                currentCustomAgents = {}
                currentCustomAgents[agentName] = this.customAgents[agentName]
            }
            localStorage.setItem('customAgents', JSON.stringify(currentCustomAgents))
            // If plant, export currency for it, too
            if (this.categorySelected=='plants') {
                alert('PLANT EXPORTED. MAKE SURE FLOW CURRENCIES ARE UPDATED, AND NEW PLANT CURRENCIES EXPORTED TOO!')
            }
        },
        exportJSONCurrency() {
            const currencyName = this.selectedCurrency
            let currentCustomCurrencies = localStorage.getItem('customCurrencies')
            currentCustomCurrencies = JSON.parse(currentCustomCurrencies)
            // Check if the custom currency object exists
            if (typeof (currentCustomCurrencies)=='object' && (currentCustomCurrencies!=null)) {
            } else { // Create the currency object
                currentCustomCurrencies = {}
            }
            // Create the currency category
            /*
            // In simoc abm, it expects custom currencies to have a "category" param instead of being filed by category
            // So instead of creating custom currency category, just file them under "custom"
            if(typeof (currentCustomCurrencies[this.currencyCategorySelected])=='object' && (currentCustomCurrencies!=null)) {
            } else {
                currentCustomCurrencies[this.currencyCategorySelected] = {}
            }
            */
            let category = this.currencyCategorySelected
            this.customCurrencies[currencyName] = this.currencyDesc[category][currencyName]
            // Assign category for export
            if (category=='custom') {
                category = this.currencyDesc.custom[currencyName].category
            } else {
                this.customCurrencies[currencyName].category = category // this.currencyCategorySelected
            }
            currentCustomCurrencies[currencyName]=this.customCurrencies[currencyName]
            localStorage.setItem('customCurrencies', JSON.stringify(currentCustomCurrencies))
        },
        returnToMenu() { // Function to return to main menu
            this.$router.push('menu')
        },
        switchMode() { // Function to swap between agent mode and currency mode
            if (this.currentMode=='agent') {
                this.currentMode='currency'
            } else {
                this.currentMode='agent'
            }
        },
    },
}
</script>
<template>
    <div class="navMenu">
        <button @click="returnToMenu()">Return to Menu</button><button v-if="currentMode!='agent'" @click="switchMode()">Agent Editor</button><button v-else @click="switchMode()">Currency Editor</button>
    </div>
    <div v-if="typeof(currencyDesc[currencyCategorySelected])=='object' && currentMode=='currency'">
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
                        <li v-for="currency in Object.keys(currencyDesc[currencyCategorySelected])">
                            <button @click="selectCurrency(currency)">{{currency}}</button>
                        </li>
                    </ul>
                </div> <!-- Button List -->
            </div> <!-- scrollie -->
            <div class="agentData">
                Currency: {{selectedCurrency}}
                <input v-model="newCurrencyName" type="text" name="newCurrencyName"> <button @click="renameCurrency(newCurrencyName)">Rename Currency</button> <button @click="duplicateCurrency()">Duplicate Currency</button> <button @click="exportJSONCurrency()">Export Currency</button>
                <br>
                Label : <input v-model="currencyDesc[selectedCurrencyCategory][selectedCurrency].label" name="currencyLabel" type="text">
                <br>
                Description: <input v-model="currencyDesc[selectedCurrencyCategory][selectedCurrency].description" name="currencyDescription" type="text">
                <br>
                Source: <input v-model="currencyDesc[selectedCurrencyCategory][selectedCurrency].source" name="currencySource" type="text">
                <br>
                Unit: <input v-model="currencyDesc[selectedCurrencyCategory][selectedCurrency].unit" name="currencyUnit" type="text">
                <br>
                Short: <input v-model="currencyDesc[selectedCurrencyCategory][selectedCurrency].short" name="currencyShort" type="text">
                <br>
                <span v-if="typeof(currencyDesc[selectedCurrencyCategory][selectedCurrency].nutrition)=='object'">
                    Nutrition- <button @click="deleteNutrition()">Delete Nutrition</button> {{currencyDesc[selectedCurrencyCategory][selectedCurrency].nutrition}}
                    <br> &nbsp; &nbsp; &nbsp; &nbsp; kcal: <input v-model="currencyDesc[selectedCurrencyCategory][selectedCurrency].nutrition.kcal" name="nutkcal" type="number">
                    <br> &nbsp; &nbsp; &nbsp; &nbsp; water: <input v-model="currencyDesc[selectedCurrencyCategory][selectedCurrency].nutrition.water" name="nutwater" type="number">
                    <br> &nbsp; &nbsp; &nbsp; &nbsp; protein: <input v-model="currencyDesc[selectedCurrencyCategory][selectedCurrency].nutrition.protein" name="nutprotein" type="number">
                    <br> &nbsp; &nbsp; &nbsp; &nbsp; carbohydrates: <input v-model="currencyDesc[selectedCurrencyCategory][selectedCurrency].nutrition.carbohydrate" name="nutcarb" type="number">
                    <br> &nbsp; &nbsp; &nbsp; &nbsp; fat: <input v-model="currencyDesc[selectedCurrencyCategory][selectedCurrency].nutrition.fat" name="nutfat" type="number">
                </span>
                <button v-else @click="addNutrition()">Add Nutrition </button>
                <br>
                <hr>
                {{currencyDesc[selectedCurrencyCategory][selectedCurrency]}}
            </div> <!-- CurrencyBox -->
        </div> <!-- gridBox -->
    </div> <!-- vif currency object exists -->
    <div v-if="currentMode=='agent'">
        <h2> Agent Editor.  Known Issues: Consistency. Shared Change Memory. Select needs Title Attributes, ul has invalid elements  </h2>
        <label for="categorySelector">Choose Agent Class:  </label>
        <select id="categorySelector" v-model="categorySelected">
            <option v-for="category in agentClasses" :key="category" :value="category"> {{category}} </option>
        </select>
        <button @click="createNewAgent()">Create New Blank Agent</button>
        <br><br>
        <div id="gridbox" class="gridBox">
            <div id="agentSelector" class="scrollie agentBox">
                <h2> Agents ({{categorySelected}}): </h2>
                <ul>
                    <li v-for="item in agentsInClass"> <button @click="selectItem(item)">{{item}}</button> </li>
                </ul>
            </div> <!-- Agent Selector -->
            <div v-if="typeof(agentDesc)=='object'" id="agentPresenter" class="agentData scrollie">
                <h2> {{selectedAgentName}}  <input v-model="newAgentName" name="newAgentName" type="text">  <button @click="renameAgent(newAgentName)">Rename Agent</button> <button @click="duplicateAgent()">Duplicate Agent</button> <button @click="exportJSON()">Export Agent</button></h2>
                <ul>
                    <li>Agent Class:
                        <select id="categoryChanger" v-model="agentDesc[selectedAgentName].agent_class">
                            <option v-for="category in agentClasses" :key="category" :value="category"> {{category}} </option>
                        </select>
                        <label>
                            Change to custom class:
                            <input v-model="customClassName" name="customClass" type="text">
                        </label>
                        <button @click="setCustomClass">Set Custom Class</button>
                    </li>
                    <li>Description: <br>  <textarea v-model="agentDesc[selectedAgentName].description" name="descriptionField" rows="4" cols="100" />
                    </li>
                </ul>
                <h3>Capacity</h3>
                <ul>
                    <li v-for="(value, key) in agentDesc[selectedAgentName].capacity">
                        {{key}}
                        (Change to:
                        <input v-model="capacityTypes[key]" name="capType" type="text"> <button @click="changeType(key, value, capacityTypes[key])">Change</button>)
                        :::::
                        Quantity:
                        <input v-model="agentDesc[selectedAgentName].capacity[key]" name="capVal" type="number"> <button @click="removeCapacity(key)">Remove Capacity</button>
                    </li>
                    <li>
                        New Capacity:
                        <input v-model="newCapacityType" name="newCapType" type="text">
                        :::::
                        Quantity:
                        <input v-model="newCapacityValue" name="newCapVal" type="number"> <button @click="addNewCapacity(newCapacityType, newCapacityValue)">Add Capacity</button>
                    </li>
                </ul>
                <h3>Flows</h3>
                <h4>In Currencies</h4>
                <ul> <!-- In currency ul -->
                    <li v-for="(value, currency) in agentDesc[selectedAgentName].flows.in">{{currency}}
                        <label>(Change to:
                            <select v-model="inTypes[currency]" name="changeInFlowCurrency">
                                <option v-for="item in currencyList" :value="item"> {{item}} </option>
                            </select>
                        </label>
                        <button @click="changeInType(currency, value, inTypes[currency])">Change</button>)
                        <button @click="removeInFlow(currency)">Remove</button>
                        <ul>
                            <li> Value: <input v-model="agentDesc[selectedAgentName].flows.in[currency].value" name="flowValueFieldIn" type="number">
                            </li>
                            <li> flow_rate:
                                <ul>
                                    <li>Unit: <input v-model="agentDesc[selectedAgentName].flows.in[currency].flow_rate.unit" name="flowInUnit" type="text"></li>
                                    <li>Time: <input v-model="agentDesc[selectedAgentName].flows.in[currency].flow_rate.time" name="flowInTime" type="text"></li>
                                </ul>
                            </li>
                            <li> connections :
                                <span v-if="typeof(agentDesc[selectedAgentName].flows.in[currency].connections)=='object'">
                                    (Click to remove)
                                    <button v-for="(connection, index) in agentDesc[selectedAgentName].flows.in[currency].connections" @click="removeFlowArrayItem('in', 'connections', currency, connection)">{{connection}}</button>
                                    <br>
                                </span>
                                <input v-model="newConnectionIn" name="connectionNewName" type="text"> <button @click="addFlowArrayItem('in', 'connections', currency, newConnectionIn)">Add new Connection</button>
                            </li>
                            <li> weighted:
                                <span v-if="typeof(agentDesc[selectedAgentName].flows.in[currency].weighted)=='object'">
                                    (Click to remove)
                                    <button v-for="(weighted, index) in agentDesc[selectedAgentName].flows.in[currency].weighted" @click="removeFlowArrayItem('in', 'weighted', currency, weighted)">{{weighted}}</button>
                                    <br>
                                </span>
                                <input v-model="newWeightedIn" name="newWeighted" type="text"> <button @click="addFlowArrayItem('in', 'weighted', currency, newWeightedIn)">Add new Weighted</button>
                            </li>
                            <li> deprive:
                                <ul v-if="typeof(agentDesc[selectedAgentName].flows.in[currency].deprive)=='object'">
                                    <button @click="removeDeprive(currency)">Remove Deprive</button>
                                    <li>Value:  <input v-model="agentDesc[selectedAgentName].flows.in[currency].deprive.value" name="depriveValue" type="number"></li>
                                    <li>Unit: <input v-model="agentDesc[selectedAgentName].flows.in[currency].deprive.unit" name="depriveUnit" type="text"></li>
                                </ul>
                                <ul v-else>
                                    <button @click="addDeprive(currency, newDepriveValue, newDepriveUnit)">Add Deprive</button>
                                    <li>Value:  <input v-model="newDepriveValue" name="newDepriveName" type="number"></li>
                                    <li>Unit: <input v-model="newDepriveUnit" name="newDepriveUnit" type="text"></li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <li> <!-- NEW FLOW -->
                        <label>New In Flow:
                            <select v-model="newInType" name="newInFlowCurrencySelector">
                                <option v-for="item in currencyList" :value="item"> {{item}} </option>
                            </select>
                        </label>
                        <button @click="addNewFlow('in', newInType)">Add In Flow Currency</button>
                    </li>
                </ul> <!-- In currency ul -->
                <h4>Out Currencies</h4>
                <ul> <!-- Out Currency ul -->
                    <li v-for="(value, currency) in agentDesc[selectedAgentName].flows.out"> {{currency}}
                        (Change to:
                        <label>
                            <select v-model="outTypes[currency]" name="changeOutCurrencySelector">
                                <option v-for="item in currencyList" :value="item"> {{item}} </option>
                            </select>
                        </label>
                        <button @click="changeOutType(currency, value, outTypes[currency])">Change</button>)
                        <button @click="removeOutFlow(currency)">Remove</button>
                        <ul> <!-- Out currency -->
                            <li> Value: <input v-model="agentDesc[selectedAgentName].flows.out[currency].value" name="flowValueOut" type="number">
                            </li>
                            <li> flow_rate:
                                <ul>
                                    <li>Unit: <input v-model="agentDesc[selectedAgentName].flows.out[currency].flow_rate.unit" name="flowUnitOut" type="text"></li>
                                    <li>Time: <input v-model="agentDesc[selectedAgentName].flows.out[currency].flow_rate.time" name="flowTimeOut" type="text"></li>
                                </ul>
                            </li>
                            <li> connections:
                                <span v-if="typeof(agentDesc[selectedAgentName].flows.out[currency].connections)=='object'">
                                    (Click to remove)
                                    <button v-for="(connection, index) in agentDesc[selectedAgentName].flows.out[currency].connections" @click="removeFlowArrayItem('out', 'connections', currency, connection)">{{connection}}</button>
                                    <br>
                                </span>
                                <input v-model="newConnectionOut" name="addNewConnectName" type="text"> <button @click="addFlowArrayItem('out', 'connections', currency, newConnectionOut)">Add new Connection</button>
                            </li>
                            <li> weighted:
                                <span v-if="typeof(agentDesc[selectedAgentName].flows.out[currency].weighted)=='object'">
                                    (Click to remove)
                                    <button v-for="(weighted, index) in agentDesc[selectedAgentName].flows.out[currency].weighted" @click="removeFlowArrayItem('out', 'weighted', currency, weighted)">{{weighted}}</button>
                                    <br>
                                </span>
                                <input v-model="newWeightedOut" name="addNewWeightedNameOut" type="text"> <button @click="addFlowArrayItem('out', 'weighted', currency, newWeightedOut)">Add new Weighted</button>
                            </li>
                            <li> requires :
                                <span v-if="typeof(agentDesc[selectedAgentName].flows.out[currency].requires)=='object'">
                                    (Click to remove)
                                    <button v-for="(requires, index) in agentDesc[selectedAgentName].flows.out[currency].requires" @click="removeFlowArrayItem('out', 'requires', currency, requires)">{{requires}}</button>
                                    <br>
                                </span>
                                <label> (Currency)
                                    <select v-model="newRequires" name="requiresCurrencySelector">
                                        <option v-for="item in currencyList" :value="item"> {{item}} </option>
                                    </select>
                                </label>
                                <button @click="addFlowArrayItem('out', 'requires', currency, newRequires)">Add new Requires</button>
                            </li>
                            <li> growth:
                                <ul v-if="typeof(agentDesc[selectedAgentName].flows.out[currency].growth)=='object'">
                                    <li v-for="(pattern, kind) in agentDesc[selectedAgentName].flows.out[currency].growth">
                                        {{kind}}
                                        (Change to:
                                        <input v-model="kindTypes[kind]" name="kindTypeName" type="text"> <button @click="changeGrowthType(kind, pattern, kindTypes[kind], currency)">Change</button>)
                                        <button @click="removeGrowth(currency, kind)">Remove Growth</button>
                                        :::::
                                        <ul>
                                            <li> Type: <input v-model="agentDesc[selectedAgentName].flows.out[currency].growth[kind].type" name="growthTypeField" type="text">
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                                <label>
                                    New Growth Kind:
                                    <input v-model="newGrowthKind" name="newGrowthKind" type="text">
                                </label>
                                <ul>
                                    <li> Type: <input v-model="newGrowthPattern" name="newGrowthPatternTypeField" type="text">
                                    </li>
                                </ul>
                                <button @click="addGrowth(currency, newGrowthKind, newGrowthPattern)">Add Growth</button>
                            </li>
                            <li> criteria:
                                <ul v-if="typeof(agentDesc[selectedAgentName].flows.out[currency].criteria)=='object'">
                                    <li v-for="(pattern, kind) in agentDesc[selectedAgentName].flows.out[currency].criteria">
                                        {{kind}}
                                        (
                                        <label>Change to:
                                            <input v-model="kindTypes[kind]" name="kindTypeCriteria" type="text">
                                        </label>
                                        <button @click="changeCriterionType(kind, pattern, kindTypes[kind], currency)">Change</button>)
                                        <button @click="removeCriterion(currency, kind)">Remove Criterion</button>
                                        :::::
                                        <ul>
                                            <li> Limit:
                                                <select v-model="agentDesc[selectedAgentName].flows.out[currency].criteria[kind].limit" name="criteriaLimitField">
                                                    <option value="&lt;"> &lt; </option>
                                                    <option value="&equals;"> =   </option>
                                                    <option value="&gt;"> &gt; </option>
                                                </select>
                                            </li>
                                            <li> Value:
                                                <select v-model="agentDesc[selectedAgentName].flows.out[currency].criteria[kind].value" name="criteriaValueField">
                                                    <option :value="true">True</option>
                                                    <option :value="false">False</option>
                                                </select>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                                <ul>
                                    <li>
                                        <input v-model="newCriterionName" name="newCriterionNameField" type="text">
                                        <button @click="addNewCriterion(currency, newCriterionName, newCriterionValue, newCriterionLimit)">Add new Criterion</button>
                                        <ul>
                                            <li> Limit:
                                                <select v-model="newCriterionLimit" name="criterionLimitFieldNew">
                                                    <option value="&lt;"> &lt; </option>
                                                    <option value="&equals;"> =   </option>
                                                    <option value="&gt;"> &gt; </option>
                                                </select>
                                            </li>
                                            <li> Value:
                                                <select v-model="newCriterionValue" name="criterionValueFieldNew">
                                                    <option :value="true">True</option>
                                                    <option :value="false">False</option>
                                                </select>
                                            </li>
                                        </ul>
                                    </li> <!-- Criterion Item -->
                                </ul>
                            </li> <!-- Criteria -->
                        </ul> <!-- Out currency -->
                    </li>
                    <li> <!-- NEW FLOW -->
                        <label>
                            New Out Flow: (Change to:
                            <select v-model="newOutType" name="outFlowCurrencySelector">
                                <option v-for="item in currencyList" :value="item"> {{item}} </option>
                            </select>
                        </label>
                        <button @click="addNewFlow('out',newOutType)">Add Out Flow Currency</button>
                    </li>
                </ul> <!-- Out Currency ul -->
                <h3>Thresholds</h3>
                <h4> Currencies </h4>
                <ul>
                    <li v-for="(value, currency) in agentDesc[selectedAgentName].thresholds">
                        {{currency}}
                        (
                        <label>Change to:
                            <select v-model="thresholdTypes[currency]" name="changeThresholdCurrency">
                                <option v-for="item in currencyList" :value="item"> {{item}} </option>
                            </select>
                        </label>
                        <button @click="changeThresholdType(currency, value, thresholdTypes[currency])">Change</button>)
                        <button @click="removeThreshold(currency)">Remove Currency</button>
                        <ul>
                            <li> Path:  <input v-model="agentDesc[selectedAgentName].thresholds[currency].path" name="thesholdPathField" type="text">
                            </li>
                            <li> Limit:
                                <select v-model="agentDesc[selectedAgentName].thresholds[currency].limit" name="thresholdLimitField">
                                    <option value="&lt;"> &lt; </option>
                                    <option value="&equals;"> =   </option>
                                    <option value="&gt;"> &gt; </option>
                                </select>
                            </li>
                            <li> Value: <input v-model="agentDesc[selectedAgentName].thresholds[currency].value" name="thesholdValueField" type="number">
                            </li>
                            <li> Connnections: <input v-model="agentDesc[selectedAgentName].thresholds[currency].connections" name="connectionsThresholdsField" type="text">
                            </li>
                        </ul>
                    </li>
                    <li> <!-- NEW FLOW -->
                        <label>New Currency:
                            <select v-model="newThresholdCurrency" name="newThresholdCurrency" selected="o2">
                                <option v-for="item in currencyList" :value="item"> {{item}} </option>
                            </select>
                        </label>
                        <ul>
                            <li> Path:  <input v-model="newThresholdPath" name="newThresholdPathField" type="text">
                            </li>
                            <li> Limit:
                                <select v-model="newThresholdLimit" name="thresholdLimitFieldNew">
                                    <option value="&lt;"> &lt; </option>
                                    <option value="&equals;"> =   </option>
                                    <option value="&gt;"> &gt; </option>
                                </select>
                            </li>
                            <li> Value: <input v-model="newThresholdValue" type="number" name="newThresholdsValueField">
                            </li>
                            <li> Connnections: <input v-model="newThresholdConnections" type="text" name="newThresholdConnectionsField">
                            </li>
                        </ul>
                        <button @click="addNewThreshold(newThresholdCurrency, newThresholdPath, newThresholdLimit, newThresholdValue, newThresholdConnections)">Add Threshold Currency</button>
                    </li> <!-- NEW FLOW -->
                </ul>
                <h3>Properties</h3>
                <ul>
                    <li v-for="(attributes, property) in agentDesc[selectedAgentName].properties">
                        {{property}} (Change to:
                        <input v-model="propertyNames[property]" name="propertyName" type="text">
                        <button @click="changePropertyName(property, attributes, propertyNames[property])">Change</button>)
                        <button @click="removeProperty(property)">Remove</button>
                        <ul> <!-- Property Attributes -->
                            <li>
                                value: {{attributes.value}}
                                <input v-model="changedPropVal" name="propVal" type="text">
                                <button @click="changePropertyValue(property, changedPropVal)">Change Value</button>
                            </li>
                            <li>unit: <input v-model="agentDesc[selectedAgentName].properties[property].unit" name="propUnit" type="text" col="15"> </li>
                        </ul>
                    </li>
                    <li>
                        New Property:
                        <input v-model="newPropertyName" name="newPropertyName" type="text">
                        <ul> <!-- Property Attributes -->
                            <li>value: <input v-model="newPropVal" name="propValField" type="text"> </li>
                            <li>unit: <input v-model="newPropUnit" name="propUnitField" type="text"> </li>
                            <button @click="addNewProperty(newPropertyName, newPropVal, newPropUnit)"> Add New Property </button>
                        </ul>
                    </li>
                </ul>
                <h2> Agent Details </h2>
                <hr>
                <ul>
                    <li v-for="(value, key) in agentDesc[selectedAgentName]"> <b>{{key}}</b> :
                        <i v-if="typeof(value)!='object'">{{value}}</i>
                        <ul v-else>
                            <li v-for="(subvalue, subkey) in agentDesc[selectedAgentName][key]">
                                <b>{{subkey}}</b> :
                                <i v-if="typeof(subvalue)!='object'">{{subvalue}}</i>
                                <ul v-else>
                                    <li v-for="(subsubvalue, subsubkey) in agentDesc[selectedAgentName][key][subkey]">
                                        <b>{{subsubkey}}</b> :
                                        <i v-if="typeof(subsubvalue)!='object'">{{subsubvalue}}</i>
                                        <ul v-else>
                                            <li v-for="(subsubsubvalue, subsubsubkey) in agentDesc[selectedAgentName][key][subkey][subsubkey]">
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
.navMenu{
    display: flex;
    justify-content: center;
}
.gridBox{
            display: grid;
            grid-template-columns: 1fr 5fr; /* Three columns each 100px wide */
            grid-gap: 10px; /* Gap between grid items */
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
    border: solid red 5px;
    color: black;
    background-color: grey;
}
</style>

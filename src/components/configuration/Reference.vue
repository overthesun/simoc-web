<!-- This component is simply for displaying which entry should be displayed on the reference side of the wizard.

Future version should retrieve entries directly from the database, and simply use a v-html for the internal structure of the entry text. A
v-for could be used to loop through each, populating the title, entry, and adding on the table of contents link to the bottom. This would
automate the process and prevent the need for individual sections for every entry. Table of contents could be opulated the same way
using v-for to populate all links with the title and the approriate value for the link.
-->

<template>
    <div class="encyclopedia-wrapper">
        <ReferenceItem v-if="activeRefEntry === 'Welcome'" :setActiveRefEntry="setActiveRefEntry" heading="Welcome To SIMOC">
            <p>Welcome to SIMOC, a scalable, interactive model of an off-world community. Here you will enjoy the challenges and rewards of designing a habitat for <a class="reference-link" href="#" @click="setActiveRefEntry('Inhabitants')">humans</a> and <a class="reference-link" href="#" @click="setActiveRefEntry('PlantSpecies')">plants</a> using data from four decades of NASA research that defines the simulated interactions.</p>
            <p>Great effort has been made to develop a realistic model. Your goal is to learn which combination of mechanical life support systems (<a class="reference-link" href="#" @click="setActiveRefEntry('ECLSS')">ECLSS</a>) and biological components (<a class="reference-link" href="#" @click="setActiveRefEntry('Greenhouse')">greenhouse</a>) will provide clean air, water, and food for a long-term mission.</p>
            <p><i>Sound easy?</i> Let’s see how your design works on Mars...</p>
            <i>You can click on the <fa-icon :icon="['fa-solid','circle-info']" />
                icons on the left to navigate to the corresponding entries.</i>
        </ReferenceItem>

        <ReferenceItem v-if="(activeRefEntry === 'Presets') && (simLocation === 'mars')" :setActiveRefEntry="setActiveRefEntry" heading="Presets">
            <p>The Presets are a means to explore simple configurations of the SIMOC simulation, to learn how the agents interact and affect each other over time. With Preset 1 you venture to Mars with one human, one <a class="reference-link" href="#" @click="setActiveRefEntry('ECLSS')">ECLSS</a>, and plenty of food rations for a 10 days mission. You’ll make it. But this is not a static system. Note how CO₂, O₂, food, and power change with time. As with all scientific studies, we encourage you to change one variable at a time. Next, modify this baseline by adding another human, or increase the stay without increasing the food rations. <i>What happens?</i></p>
            <p>The additional Presets introduce slightly more complex systems. They may or may not succeed. <i>What will you change to enable the humans to survive the full duration? What do you notice about the interplay between the number of humans, ECLSS, food rations, and bioregeneration?</i></p>
            <p>Learn more about the Presets at the <a class="reference-link" href="https://simoc.space">SIMOC website</a>.</p>
            <p>As you iterate through your experiment, you can save your current configuration to the Custom Preset.</p>
        </ReferenceItem>

        <ReferenceItem v-if="(activeRefEntry === 'Presets') && (simLocation === 'b2')" :setActiveRefEntry="setActiveRefEntry" heading="Presets">
            <p>The Presets represent three key phases of the Biosphere 2 experiements:</p>
            <table class="mission-table">
                <tr>
                    <td style="min-width: 8em;"><h3>Mission 1a</h3></td>
                    <td>The first historical mission, up until day 475 when supplemental O<sub>2</sub> was added. Keep an eye on oxygen producers (plants) and consumers (humans and soil). How do their rates change over the course of the simulation, and why?</td>
                </tr>
                <tr>
                    <td style="min-width: 8em;"><h3>Mission 1b</h3></td>
                    <td>The first historical mission, from the point at which O<sub>2</sub> was added to the end. Includes starting O<sub>2</sub> reserves and a modified greenhouse layout. How does the updated layout impact food production and O<sub>2</sub>/CO<sub>2</sub> exchange?</td>
                </tr>
                <tr>
                    <td style="min-width: 8em;"><h3>Mission 2</h3></td>
                    <td>The second historical mission, with ideal sunlight and improved crop management practices. How do these factors affect plant productivity?</td>
                </tr>
            </table>
            <p>You can select a preset and launch a simulation as-is to see historical data, or select a preset and customize it, and explore how the simulation responds. Try changing the amounts and types of plants, and adjust your CO<sub>2</sub> and O<sub>2</sub> reserves and limits. Can you finish the simulation with healthier, happier biospherians?</p>
        </ReferenceItem>

        <ReferenceItem v-if="activeRefEntry === 'StartDate'" :setActiveRefEntry="setActiveRefEntry" heading="Start Date">
            <p>The historical Biosphere 2 missions took place between 1991 and 1995. SIMOC uses historical sunlight data from this period. The B2-Sun agent produces more light in the summer months, and annual output is lower during 1991-1992 due to an El Nino event.</p>
        </ReferenceItem>

        <ReferenceItem v-if="activeRefEntry === 'Duration'" :setActiveRefEntry="setActiveRefEntry" heading="Mission Duration">
            <p>The duration of your mission may be set in hours, days, or years. Each unit of simulated time (a "time step") is equivalent to one hour Earth time. Therefore a duration of 240 time steps is a simulation of 10 Earth days. While the rotational period for each celestial body is unique from that of Earth, SIMOC is set to Earth time due to the fact that the human body is biologically set to Earth time, and the growth cycle of the available <a class="reference-link" href="#" @click="setActiveRefEntry('PlantSpecies')">plants</a>, as defined by data provided by NASA, is also measured in Earth time.</p>
            <p>When establishing the duration of your mission, consider the goals and intended outcome. For example, if you are staying for just two weeks, you will not have time to raise and harvest plants. Therefore, all atmosphere, water, and waste recycling must come from the physico-chemical Environmental Control and Life Support System (<a class="reference-link" href="#" @click="setActiveRefEntry('ECLSS')">ECLSS</a>), as on the International Space Station. Your <a class="reference-link" href="#" @click="setActiveRefEntry('Food')">food</a> will be brought with you from Earth as dehydrated rations.</p>
            <p>If you are staying a few months or longer, you may consider maintaining a <a class="reference-link" href="#" @click="setActiveRefEntry('Greenhouse')">greenhouse</a> to reduce the quantity of food you must bring from Earth, and experiment in long term sustainability. Upon arrival you will still need ECLSS and rations, but over time the plants will work in conjunction with the ECLSS for a hybrid, physico-chemical / bioregenerative system. This is where SIMOC becomes interesting, for the delicate balance required to support human life for long duration missions may require a few simulations to discover.</p>
        </ReferenceItem>

        <ReferenceItem v-if="activeRefEntry === 'Inhabitants'" :setActiveRefEntry="setActiveRefEntry" heading="Inhabitants">
            <p>While you can use SIMOC to simulate a plant-only configuration, if you design a mission that includes humans, then Environmental Control and Life Support System (<a class="reference-link" href="#" @click="setActiveRefEntry('ECLSS')">ECLSS</a>), <a class="reference-link" href="#" @click="setActiveRefEntry('Food')">food</a>, and a <a class="reference-link" href="#" @click="setActiveRefEntry('CrewQuarters')">crew quarters</a> are required. It is assumed the food and life support required to bring the humans from Earth to Mars are already accounted for, your SIMOC mission starting the day you land and occupy the habitat. Be certain to provide ample food for the astronauts to consume until the <a class="reference-link" href="#" @click="setActiveRefEntry('Greenhouse')">greenhouse</a> produces the first edible <a class="reference-link" href="#" @click="setActiveRefEntry('PlantSpecies')">plants</a>. You must include at least one ECLSS to maintain breathable air and potable water, as well as manage human waste products. The ELCSS will likely continue to be used when the plants are harvested or plant growth is not maintained due to environmental constraints.</p>
            <p><i>ASTRONAUTS are not required for a plant-only simulation.</i></p>
        </ReferenceItem>

        <ReferenceItem v-if="activeRefEntry === 'Biomes'" :setActiveRefEntry="setActiveRefEntry" heading="Biomes">
            <p>Information on the 4 Biosphere 2 Biomes.</p>
        </ReferenceItem>

        <ReferenceItem v-if="activeRefEntry === 'Food'" :setActiveRefEntry="setActiveRefEntry" heading="Food Supply">
            <p>It is imperative that your astronauts have ample food supply while the <a class="reference-link" href="#" @click="setActiveRefEntry('PlantSpecies')">plants</a> are growing in the <a class="reference-link" href="#" @click="setActiveRefEntry('Greenhouse')">greenhouse</a>. The plants are unable to produce edible fruit and vegetables until they are ready to harvest. Their capacity for carbon dioxide sequestration and oxygen production start at a very minimal level, increasing to their full capacity as a sigmoid (“S”) function.</p>
            <p>When the plants are harvested, each has a unique ratio of edible -vs- inedible biomass. Some plants are almost entirely edible (cabbage) while others offer very little for the human to digest (wheat). Yet, wheat offers the most nutrients and as you will find, is an excellent CO2 reduction agent. At harvest, edible biomass is stored as food while inedible biomass is returned to the plants as nutrients.</p>
            <p>The following table can be used as a reference for the amount of food required (in kg):</p>
            <table id="food-table">
                <tr><td colspan="2" rowspan="2" /><th colspan="7">Mission Duration (Earth days)</th></tr>
                <tr><th>1</th><th>7</th><th>30</th><th>90</th><th>180</th><th>365</th></tr>
                <tr><th rowspan="5">Inhabitants</th><th>1</th><td>1.5</td><td>10.5</td><td>45</td><td>135</td><td>270</td><td>547.5</td></tr>
                <tr><th>2</th><td>3</td><td>21</td><td>90</td><td>270</td><td>540</td><td>1095</td></tr>
                <tr><th>5</th><td>7.5</td><td>52.5</td><td>225</td><td>675</td><td>1350</td><td>2737.5</td></tr>
                <tr><th>10</th><td>15</td><td>105</td><td>450</td><td>1350</td><td>2700</td><td>5475</td></tr>
            </table>
            <p><i>FOOD is not required if no astronauts are selected.</i></p>
        </ReferenceItem>

        <ReferenceItem v-if="activeRefEntry === 'CrewQuarters'" :setActiveRefEntry="setActiveRefEntry" heading="Crew Quarters">
            <p>In selecting your crew quarters, it is prudent to consider a balance between the volume required to support the number of astronauts you have chosen, for their physical comfort and the benefits of a larger space. In the real world, we would be concerned with the amount of communal and personal space the inhabitants enjoy. As SIMOC does not currently simulate psycho-social interactions, you may consider the volume of a larger space as an atmosphere storage buffer. In times of reduced breathable atmosphere (power outage), a larger habitat can provide breathable air for a longer period of time. However, a larger habitat is also more massive, consuming more fuel and payload in transit from Earth to the destination (currently recorded but not tracked).</p>
            <p>What’s more, future versions of SIMOC will enable the scaling of your habitat to accommodate a growing community. As such, a larger, initial structure will allow the addition of crew without having to transport additional structures.</p>
            <p><i>CREW QUARTERS are not required if no astronauts are selected.</i></p>
        </ReferenceItem>

        <ReferenceItem v-if="activeRefEntry === 'ECLSS'" :setActiveRefEntry="setActiveRefEntry" heading="Environmental Control">
            <p>An Environmental Control and Life Support System (ECLSS) is a tightly integrated, mechanical and chemical system whose function is to maintain clean air, water, and relative humidity while sustaining a comfortable temperature for <a class="reference-link" href="#" @click="setActiveRefEntry('Inhabitants')">human</a> occupants of a closed environment, as used on submarines, the International Space Station, and near future off-world habitats.</p>
            <p>ECLSS modules are composed of several interconnected components, each of which is modeled in SIMOC as follows: Solid Waste Aerobic Bioreactor, MultiFiltration Purifier post-treatment, Urine recycling processor VCD, Oxygen Generation SFWE, Carbon Dioxide Removal SAWD, Particulate Removal TCCS, and Gas Control.</p>
            <p v-if="simLocation === 'mars'">One ECLSS is able to support 3 human inhabitants. Select how many ECLSS modules you will bring on your mission. Learn more about each of these agents at the <a class="reference-link" target="_blank" href="https://simoc.space">SIMOC website</a>.</p>
            <p v-if="simLocation === 'b2'">The ECLSS system manages the levels of oxygen (O<sub>2</sub>) and carbon dioxide (CO<sub>2</sub>) within Biosphere 2. The <a class="reference-link" href="#" @click="setActiveRefEntry('CO2Management')">CO<sub>2</sub> Management</a> system can scrub, store and re-supply carbon dioxide, while the <a class="reference-link" href="#" @click="setActiveRefEntry('O2Management')">O<sub>2</sub> Management</a> system releases oxygen reserves.</p>
            <p>For long-term missions, it will not be enough to rely on mechanical life support. Rather, a greenhouse can provide plants for CO2 sequestration, oxygen generation, waste processing, and food production. Consider a hybrid solution.</p>
            <p><i>An ECLSS module is not required if no astronauts are selected.</i></p>
        </ReferenceItem>

        <ReferenceItem v-if="activeRefEntry === 'CO2Management'" :setActiveRefEntry="setActiveRefEntry" heading="CO₂ Management">
            <p>Carbon dioxide (CO<sub>2</sub>) is critical for plant growth, but can be harmful to humans above a certain level.</p>
            <p>The average concentration of CO<sub>2</sub> in earth's atmosphere was roughly 415 parts per million (ppm) in 2022 (up from 300 ppm in 1900). During the Biosphere 2 experiments, CO<sub>2</sub> was maintained at roughly 2,500 ppm. Humans can survive in up to 10,000 ppm, but experience negative health effects above 5,000 ppm and feel drowsy above 2,500 ppm.</p>
            <p>Plants use CO<sub>2</sub> to generate new biomass via photosynthesis. Most plants grow 30-40% bigger when CO<sub>2</sub> is increased to 1,000 ppm, and there's some evidence this effect continues at even higher levels.</p>
            <p>In SIMOC, your atmosphere starts at 415 ppm. The Upper Limit determines when the scrubbers are activated and CO<sub>2</sub> is removed from the atmosphere. When it's removed, it's added to the CO<sub>2</sub> storage, along with your starting reserves. The Lower Limit determines when CO<sub>2</sub> is released from storage into the atmosphere. Try reducing the Upper Limit to earth-normal (415 ppm) and see plant productivity is affected.</p>
        </ReferenceItem>

        <ReferenceItem v-if="activeRefEntry === 'O2Management'" :setActiveRefEntry="setActiveRefEntry" heading="O₂ Management">
            <p>Oxygen (O<sub>2</sub>) is required for both human and soil respiration, and is a byproduct of plant photosynthesis.</p>
            <p>The average concentration of O<sub>2</sub> in earth's atmosphere was 21% in 2022. Humans can survive as low as 8%, but start experiencing headaches and fatigue below 15%. During the first Biosphere 2 mission, O<sub>2</sub> fell steadily to a low of 14% before supplemental oxygen reserves were pumped in.</p>
            <p>In SIMOC, your atmosphere starts at 21%. You may include starting reserves, which will be added when the internal concentration falls below the Lower Limit.</p>
        </ReferenceItem>

        <ReferenceItem v-if="activeRefEntry === 'Greenhouse'" :setActiveRefEntry="setActiveRefEntry" heading="Greenhouse">
            <p>As with the <a class="reference-link" href="#" @click="setActiveRefEntry('CrewQuarters')">crew quarters</a>, the size of the greenhouse is your choice. If you intend for your astronauts to consume only the <a class="reference-link" href="#" @click="setActiveRefEntry('Food')">food</a> they have brought with them and rely fully on <a class="reference-link" href="#" @click="setActiveRefEntry('ECLSS')">mechanical life support</a>, a greenhouse is not required. If you desire for your astronauts to consume some fresh fruits, vegetables, and grains, and for the <a class="reference-link" href="#" @click="setActiveRefEntry('PlantSpecies')">plants</a> to offset atmosphere and water recycling, a greenhouse is an integral component to a long-duration mission.</p>
            <p>In this SIMOC release, the Crew Quarters and Greenhouse share their atmospheres. This means the Greenhouse is not able to maintain an elevated CO₂ level while keeping the Crew Quarters at nominal. Future versions of SIMOC will provided independent volumes for optimal human and plant atmospheres.</p>
            <p><i>A GREENHOUSE is not required, even if astronauts are selected.</i></p>
        </ReferenceItem>

        <ReferenceItem v-if="activeRefEntry === 'PlantSpecies'" :setActiveRefEntry="setActiveRefEntry" heading="Plant Species">
            <p>If your elect to provide your astronauts with something more interesting than <a class="reference-link" href="#" @click="setActiveRefEntry('Food')">food rations</a> for a long <a class="reference-link" href="#" @click="setActiveRefEntry('Duration')">duration</a> mission, a <a class="reference-link" href="#" @click="setActiveRefEntry('Greenhouse')">greenhouse</a> and plants are a welcomed respite from the monotony of meals in squeeze bottles and aluminum foil containers. Not only do fruits and vegetables provide nutrients and calories, they also help maintain a breathable atmosphere and clean water, off-setting, maybe even replacing the function of the <a class="reference-link" href="#" @click="setActiveRefEntry('ECLSS')">ECLSS</a> modules. When selecting your plants you will also select the percentage of the total volume of the <a class="reference-link" href="#" @click="setActiveRefEntry('Greenhouse')">greenhouse</a> allocated to each plant species.</p>
            <p>Keep in mind that you will be starting your plants from seeds, not seedlings or mature transplants. So make certain you have provided your astronauts with ample food rations for the time it takes to raise the plants from seed to harvest.</p>
            <p>Note that each plant is associated with a particular power requirement, that is, the amount of synthetic light required to grow the plants. This is based on NASA data for each included plant species. As such, when you select a higher volume of plants that require more lighting, the <a class="reference-link" href="#" @click="setActiveRefEntry('PowerGeneration')">power generation</a> and <a class="reference-link" href="#" @click="setActiveRefEntry('PowerStorage')">storage</a> requirement will increase accordingly.</p>
            <p>Refer to the <a class="reference-link" target="_blank" href="https://simoc.space">SIMOC website</a> to learn more about the plant species made available to you.</p>
            <p>PLANTS are not required, even if astronauts are selected.</p>
        </ReferenceItem>

        <ReferenceItem v-if="activeRefEntry === 'ImprovedCropManagement'" :setActiveRefEntry="setActiveRefEntry" heading="Improved Crop Management">
            <p>For the second historical Biosphere 2 mission, Tilak Mahato, a controlled-agriculture researcher with an indigenous farming background, implemented several new procedures which improved plant productivity significantly. These included:</p>
            <ul>
                <li>Removing pests immediately. Because pest populations grow so quickly, catching and remediating an infestation early has an outsized impact.</li>
                <li>Taking care not spread pests, fungi or diseases via contaminated tools.</li>
                <li>Washing diseased leaves with soap & water.</li>
                <li>Protect seedling growing areas from roaches and other pests</li>
                <li>Pollinating plants by hand. During Mission 1, the entire corn crop had failed to produce food because there was no wind to spread pollen from the (male) tassels to the (female) silk. Other plants' pollen had been washed away by overhead irrigation.</li>
            </ul>
        </ReferenceItem>

        <ReferenceItem v-if="activeRefEntry === 'PowerGeneration'" :setActiveRefEntry="setActiveRefEntry" heading="Power Generation">
            <p>Select the number of solar photovoltaic (PV) panels required to sustain the electrical power needs of your <a class="reference-link" href="#" @click="setActiveRefEntry('CrewQuarters')">habitat</a>. This includes electric heat, lighting for the human occupied space, and grow lights for the <a class="reference-link" href="#" @click="setActiveRefEntry('PlantSpecies')">plants</a> in the <a class="reference-link" href="#" @click="setActiveRefEntry('Greenhouse')">greenhouse</a>, <a class="reference-link" href="#" @click="setActiveRefEntry('ECLSS')">ECLSS</a> operation, radio communication from the habitat to the orbiter, and personal computers.</p>
            <p>On Mars, the total solar gain is roughly 1/3 that on Earth (at its maximum potential). Therefore, a 300 watt solar panel on Earth would generate only 100 watts on Mars. This means you will need 3x more panels to produce the same amount of electric power.</p>
            <p>The solar PV panels are 2 m². The surface of the Earth receives on average 1120 W/m² energy from the Sun. On Mars, the surface receives on average 590 W/m². This is then reduced by 30% solar panel efficiency for 177 W/m² x 2 m² = 354 W/m².</p>
            <p>Keep in mind that not only do you need ample power for all electric devices by day, but also to charge the batteries to operate many of the same devices by night. This will result in a substantial quantity of solar PV panels in your total array.</p>
            <p><i>POWER is required for all simulated missions.</i></p>
        </ReferenceItem>

        <ReferenceItem v-if="activeRefEntry === 'PowerStorage'" :setActiveRefEntry="setActiveRefEntry" heading="Power Storage">
            <p>While <a class="reference-link" href="#" @click="setActiveRefEntry('PowerGeneration')">solar PV panels</a> generate power by day, it is the batteries that provide power at night. Therefore, the total battery capacity should be large enough to power the <a class="reference-link" href="#" @click="setActiveRefEntry('Greenhouse')">greenhouse</a> grow lights, which extends beyond day light hours, with ample power for the <a class="reference-link" href="#" @click="setActiveRefEntry('CrewQuarters')">habitat</a> through an entire Martian night.</p>
            <p>In review of the <a class="reference-link" href="#" @click="activeReference = 'Graphs'">energy graph</a> in the Configuration Wizard, the <em>red</em> consumption bar represents the total power required by the habitat for a full Martian day/night cycle. Therefore, by correlating the <em>blue</em> production to <em>red</em> consumption, you will provide ample solar power generation to recharge the battery array to get through the night.</p>
            <p>The battery holds a maximum of 10,000 kilowatt-hours (kWh).</p>
        </ReferenceItem>

        <div v-if="activeRefEntry === 'Table'">
            <div class="reference-item-title">Table of Contents</div>
            <ul v-if="simLocation === 'mars'">
                <li v-for="item in marsTOC" :key="`ref-${item.ref}`">
                    <a class="reference-link" href="#" @click="setActiveRefEntry(item.ref)">{{item.label}}</a>
                </li>
            </ul>
            <ul v-else-if="simLocation === 'b2'">
                <li v-for="item in b2TOC" :key="`ref-${item.ref}`">
                    <a class="reference-link" href="#" @click="setActiveRefEntry(item.ref)">{{item.label}}</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import {storeToRefs} from 'pinia'
import {useWizardStore} from '../../store/modules/WizardStore'
import {useDashboardStore} from '../../store/modules/DashboardStore'
import {ReferenceItem} from './'

export default {
    data() {
        return {
            marsTOC: [
                {ref: 'Welcome', label: 'Welcome to SIMOC'},
                {ref: 'Presets', label: 'Presets'},
                {ref: 'Duration', label: 'Mission Duration'},
                {ref: 'CrewQuarters', label: 'Crew Quarters'},
                {ref: 'Inhabitants', label: 'Inhabitants'},
                {ref: 'Food', label: 'Food Supply'},
                {ref: 'ECLSS', label: 'Environmental Control'},
                {ref: 'Greenhouse', label: 'Greenhouse'},
                {ref: 'PlantSpecies', label: 'Plant Species'},
                {ref: 'PowerGeneration', label: 'Power Generation'},
                {ref: 'PowerStorage', label: 'Power Storage'},
            ],
            b2TOC: [
                {ref: 'Welcome', label: 'Welcome to SIMOC'},
                {ref: 'Presets', label: 'Presets'},
                {ref: 'StartDate', label: 'Start Date'},
                {ref: 'Duration', label: 'Mission Duration'},
                {ref: 'Inhabitants', label: 'Inhabitants'},
                {ref: 'Biomes', label: 'Biomes'},
                {ref: 'Food', label: 'Food Supply'},
                {ref: 'CO2Management', label: 'CO₂ Management'},
                {ref: 'O2Management', label: 'O₂ Management'},
                {ref: 'PlantSpecies', label: 'Plant Species'},
                {ref: 'ImprovedCropManagement', label: 'Improved Crop Management'},
            ]
        }
    },
    components: {
        ReferenceItem,
    },
    setup() {
        const wizard = useWizardStore()
        const {activeRefEntry, activeReference} = storeToRefs(wizard)
        const dashboard = useDashboardStore()
        const {simLocation} = storeToRefs(dashboard)
        const {setActiveRefEntry} = wizard
        return {activeRefEntry, setActiveRefEntry, activeReference, simLocation}
    },
}
</script>

<style lang="scss">
    .encyclopedia-wrapper{
        width:100%;
        height:100%;
        overflow-y:auto;
    }

    .reference-item{
        font-family: "Open Sans", sans-serif;
        font-size: 14px;
        margin-right: 16px;
    }

    .reference-item-entry {
        &:not(:last-of-type){
            margin-bottom: 16px;
        }
    }

    .reference-item-title{
        font-size:24px;
        width: auto;
        font-weight:400;
    }
    .reference-item-title svg {
        color: lightgreen;
        cursor: pointer;
    }

    .mission-table {
        width: 100%;
        border-collapse: collapse;
        text-align: left;
    }

    table.mission-table td {
        border: 1px solid #eeeeee;
        padding: 5px;
    }

    #food-table {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid #eeeeee;
    }
    #food-table th[rowspan="5"] {
        width: 1.5em;
        writing-mode: sideways-lr;
    }
    #food-table th, #food-table td {
        border: 1px solid #eeeeee;
    }
    #food-table td {
        text-align: right;
    }
</style>

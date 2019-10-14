<!-- This component is simply for displaying which entry should be displayed on the reference side of the wizard.

Future version should retrieve entries directly from the database, and simply use a v-html for the internal structure of the entry text. A
v-for could be used to loop through each, populating the title, entry, and adding on the table of contents link to the bottom. This would
automate the process and prevent the need for individual sections for every entry. Table of contents could be opulated the same way
using v-for to populate all links with the title and the approriate value for the link.
-->

<template>
    <div class='encyclopedia-wrapper'>
        <div class='reference-item' v-if="getActiveRefEntry === 'Welcome'">
            <div class='reference-item-title'>Welcome To SIMOC</div>
            <div class='reference-item-entry'>
                <p>Welcome to SIMOC, a scalable, interactive model of an off-world community. Here you will enjoy the challenges and rewards of designing a habitat for <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('Inhabitants')">humans</a> and <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('PlantSpecies')">plants</a> using data from four decades of NASA research that defines the simulated interactions.</p>
                <p>Great effort has been made to develop a realistic model. Your goal is to learn which combination of mechanical life support systems (<a class='reference-link' href="#" @click="SETACTIVEREFENTRY('ECLSS')">ECLSS</a>) and biological components (<a class='reference-link' href="#" @click="SETACTIVEREFENTRY('Greenhouse')">greenhouse</a>) will provide clean air, water, and food for a long-term mission.</p>
                <p><i>Sound easy?</i> Let’s see how your design works on Mars...</p>
            </div>
            <div class='reference-item-entry'><a class='reference-link' href="#" @click="SETACTIVEREFENTRY('Table')">Table Of Contents</a></div>
            <div class='reference-item-entry'>
                By clicking on a fields title, you can navigate directly to
                that specific entry.
            </div>
        </div>

        <div class='reference-item' v-if="getActiveRefEntry === 'Presets'">
            <div class='reference-item-title'>Presets</div>
            <div class='reference-item-entry'>
                <p>The Presets are a means to explore simple configurations of the SIMOC simulation, to learn how the agents interact and affect each other over time. With Preset 1 you venture to Mars with one human, one <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('ECLSS')">ECLSS</a>, and 30 days of food. You’ll make it. But this is not a static system. Note how CO2, O2, and humidity change with time. As with all scientific studies, change one variable at a time. Next, modify this baseline by adding another human, or increasing the stay without increasing the food rations. <i>What happens?</i></p>
                <p>The additional Presets introduce slightly more complex systems. They may or may not succeed. <i>What will you change to enable the humans to survive the full duration? What do you notice about the interplay between the number of humans, ECLSS, food rations, and bioregeneration?</i></p>
                <p>As you iterate through your experiment, you can save your current configuration to the Custom Preset.</p>
                <p><i>Presets are only available in the Expert configuration.</i></p>
            </div>
            <div class='reference-item-entry'><a class='reference-link' href="#" @click="SETACTIVEREFENTRY('Table')">Table Of Contents</a></div>
        </div>

        <div class='reference-item' v-if="getActiveRefEntry === 'Location'">
            <div class='reference-item-title'>Location</div>
            <div class='reference-item-entry'>
                <p>This beta version of SIMOC offers one location, Mars.  It is assumed the <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('CrewQuarters')">habitat</a> has been built to your specifications and deployed in advance of your arrival.  It is located close to the equator for relatively equal periods of day and night through the Martian year.</p>
                <p>Future versions will enable you to select specific locations on Mars, and Earth’s Moon, asteroids, and the moons of Jupiter and Saturn. Each of these locations will present unique challenges for your crew’s survival.</p>
                <p>For now, Mars presents its own challenges. Good luck!</p>
            </div>
            <div class='reference-item-entry'><a class='reference-link' href="#" @click="SETACTIVEREFENTRY('Table')">Table Of Contents</a></div>
        </div>

        <div class='reference-item' v-if="getActiveRefEntry === 'Duration'">
            <div class='reference-item-title'>Mission Duration</div>
            <div class='reference-item-entry'>
                <p>The duration of your mission may be set in hours, days, or years. Each unit of simulated time (a "time step") is equivalent to one hour Earth time. Therefore a duration of 90 time steps is a simulation of 90 Earth hours. While the rotational period of each celestial body is unique from that of Earth, SIMOC is set to Earth time due to the fact that the human body is biologically set to Earth time, and the growth cycle of the available <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('PlantSpecies')">plants</a>, as defined by data provided by NASA, is also measured in Earth time.</p>
                <p>When establishing the duration of your mission, consider the goals and intended outcome. For example, if you are staying for just two weeks, you will not have time to raise and harvest plants. Therefore, all atmosphere, water, and waste recycling must come from the physico-chemical Environmental Control and Life Support System (<a class='reference-link' href="#" @click="SETACTIVEREFENTRY('ECLSS')">ECLSS</a>), as on the International Space Station. Your <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('Food')">food</a> will be brought with you from Earth in dehydrated or freeze dried form.</p>
                <p>If you are staying a few months or longer, you may consider maintaining a <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('Greenhouse')">greenhouse</a> to reduce the quantity of food you must bring, and experiment in long term sustainability. Upon arrival you will still need ECLSS and food rations, but over time the plants will work in conjunction with the ECLSS for a hybrid, physico-chemical / bioregenerative system. This is where SIMOC becomes quite interesting, for the delicate balance required to support human life for long duration missions may require a few simulations to discover.</p>
            </div>
            <div class='reference-item-entry'><a class='reference-link' href="#" @click="SETACTIVEREFENTRY('Table')">Table Of Contents</a></div>

        </div>

        <div class='reference-item' v-if="getActiveRefEntry === 'Inhabitants'">
            <div class='reference-item-title'>Inhabitants</div>
            <div class='reference-item-entry'>
                <p>While you can use SIMOC to simulate a plant-only configuration, if you design a mission that includes humans, then Environmental Control and Life Support System (<a class='reference-link' href="#" @click="SETACTIVEREFENTRY('ECLSS')">ECLSS</a>), <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('Food')">food</a>, and a <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('CrewQuarters')">crew quarters</a> are required. It is assumed the food and life support required to bring the humans from Earth to Mars are already accounted for. Your life support and food rations begin the day you land and occupy the habitat. Be certain to provide ample food for the astronauts to consume until the <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('Greenhouse')">greenhouse</a> produces the first edible <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('PlantSpecies')">plants</a>. You must include at least one ECLSS to maintain breathable air and potable water, as well as manage human waste products. The ELCSS will likely continue to be used when the plants are harvested or plant growth is not maintained due to environmental constraints.</p>
                <p><i>ASTRONAUTS are not required for a plant-only simulation.</i></p>
            </div>
            <div class='reference-item-entry'><a class='reference-link' href="#" @click="SETACTIVEREFENTRY('Table')">Table Of Contents</a></div>
        </div>

        <div class='reference-item' v-if="getActiveRefEntry === 'Food'">
            <div class='reference-item-title'>Food Supply</div>
            <div class='reference-item-entry'>
                <p>It is imperative that your astronauts have ample food supply while the <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('PlantSpecies')">plants</a> are growing in the <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('Greenhouse')">greenhouse</a>. The plants are unable to produce edible fruit and vegetables until they are ready to harvest. Their capacity for carbon dioxide sequestration and oxygen production start at a very minimal level, increasing to their full capacity as a sigmoid (“S”) function.</p>
                <p>When the plants are harvested, each has a unique ratio of edible -vs- inedible biomass. Some plants are almost entirely edible (cabbage) while others offer very little for the human to digest (wheat). Yet, wheat offers the most nutrients and as you will find, is an excellent CO2 reduction agent. At harvest, edible biomass is stored as food while inedible biomass is returned to the plants as nutrients.</p>
                <p><i>FOOD is not required if no astronauts are selected.</i></p>
            </div>
            <div class='reference-item-entry'><a class='reference-link' href="#" @click="SETACTIVEREFENTRY('Table')">Table Of Contents</a></div>
        </div>

        <div class='reference-item' v-if="getActiveRefEntry === 'CrewQuarters'">
            <div class='reference-item-title'>Crew Quarters</div>
            <div class='reference-item-entry'>
                <p>In selecting your crew quarters, it is prudent to consider a balance between the minimum volume required to support the number of astronauts you have chosen, for their physical comfort and the benefits of a larger space. In the real world, we would be concerned with the amount of communal and personal space the inhabitants enjoy. As SIMOC does not currently simulate psycho-social interactions, you may consider the volume of a larger space as an atmosphere storage buffer. In times of reduced breathable atmosphere (power outage), a larger habitat can provide breathable air for a longer period of time. However, a larger habitat is also more massive, consuming more fuel and payload in transit from Earth to the destination (currently recorded but not tracked). What’s more, future versions of SIMOC will enable the scaling of your habitat to accommodate a growing community. As such, a larger, initial structure will allow the addition of crew without having to transport additional structures.</p>
                <p><i>CREW QUARTERS are not required if no astronauts are selected.</i></p>
            </div>
            <div class='reference-item-entry'><a class='reference-link' href="#" @click="SETACTIVEREFENTRY('Table')">Table Of Contents</a></div>
        </div>

        <div class='reference-item' v-if="getActiveRefEntry === 'ECLSS'">
            <div class='reference-item-title'>ECLSS</div>
            <div class='reference-item-entry'>
                <p>An Environmental Control and Life Support System (ECLSS) is a tightly integrated, mechanical and chemical machine whose function is to maintain clean air, water, and relative humidity while sustaining a comfortable temperature for <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('Inhabitants')">human</a> occupants of a closed environment, as used on submarines, the International Space Station, and near future off-world habitats.</p>
                <p>ECLSS modules are composed of several interconnected components, each of which is modeled in SIMOC as follows: Solid Waste Aerobic Bioreactor, MultiFiltration Purifier post-treatment, Urine recycling processor VCD, Oxygen Generation SFWE, Carbon Dioxide Reduction Sabatier, Carbon Dioxide Removal SAWD, Particulate Removal TCCS, and Gas Control. Learn more about each of these agents at <a class='reference-link' href="www.simoc.space">www.simoc.space</a>.</p>
                <p>For long-term missions, it will not be enough to reply on ECLSS. Rather, a greenhouse can provide plants for CO2 sequestration, oxygen generation, waste processing, and food production. Consider a hybrid solution. One ECLSS is able to support 3 human inhabitants. Select how many ECLSS modules you will bring on your mission.</p>
                <p><i>An ECLSS module is not required if no astronauts are selected.</i></p>
            </div>
            <div class='reference-item-entry'><a class='reference-link' href="#" @click="SETACTIVEREFENTRY('Table')">Table Of Contents</a></div>
        </div>

        <div class='reference-item' v-if="getActiveRefEntry === 'Greenhouse'">
            <div class='reference-item-title'>Greenhouse</div>
            <div class='reference-item-entry'>
                <p>As with the <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('CrewQuarters')">crew quarters</a>, the size of the greenhouse is your choice. If you intend for your astronauts to consume only the <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('Food')">food</a> they have brought with them and rely fully on <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('ECLSS')">ECLSS</a>, a greenhouse is not required. If you desire for your astronauts to consume some fresh fruits, vegetables, and grains, and for the <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('PlantSpecies')">plants</a> to offset some of the burden of atmosphere and water recycling, a small greenhouse is beneficial.</p>
                <p>If you select a large greenhouse, you may come to rely almost entirely on a bioregenerative solution to life support, using ECLSS as back-up. And your astronauts will enjoy fresh food with every meal.</p>
                <p><i>A GREENHOUSE is not required, even if astronauts are selected.</i></p>
            </div>
            <div class='reference-item-entry'><a class='reference-link' href="#" @click="SETACTIVEREFENTRY('Table')">Table Of Contents</a></div>
        </div>

        <div class='reference-item' v-if="getActiveRefEntry === 'PlantSpecies'">
            <div class='reference-item-title'>Plant Species</div>
            <div class='reference-item-entry'>
                <p>If your elect to provide your astronauts with something more interesting than freeze-dried <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('Food')">food</a> for a long <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('Duration')">duration</a> mission, a <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('Greenhouse')">greenhouse</a> and plants is a welcomed respite from the monotony of meals in squeeze bottles and aluminum foil containers. Not only do fruits and vegetables provide nutrients and calories, they also help maintain a breathable atmosphere and clean water, off-setting, maybe even replacing the function of the <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('ECLSS')">ECLSS</a> modules. When selecting your plants you will also select the percentage of the total volume of the <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('Greenhouse')">greenhouse</a> allocated to each plant species.</p>
                <p>Keep in mind that you will be starting your plants from seeds, not seedlings nor mature transplants. So make certain you have provided your astronauts with ample freeze-dried food for the time it takes to raise the plants from seed to harvest.</p>
                <p>Note that each plant is associated with a particular power requirement, that is, the amount of synthetic light required to grow the plants. This is based on NASA data for each plant species provided. As such, when you select a higher volume of plants that require more lighting, the <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('PowerGeneration')">power generation</a> and <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('PowerStorage')">storage</a> requirement will increase accordingly.</p>
                <p>Refer to <a class='reference-link' href="www.simoc.space">www.simoc.space</a> to learn more about the plant species made available to you.</p>
                <p>PLANTS are not required, even if astronauts are selected.</p>
            </div>
            <div class='reference-item-entry'><a class='reference-link' href="#" @click="SETACTIVEREFENTRY('Table')">Table Of Contents</a></div>
        </div>

        <div class='reference-item' v-if="getActiveRefEntry === 'PowerGeneration'">
            <div class='reference-item-title'>Power Generation</div>
            <div class='reference-item-entry'>
                <p>Select the number of solar photovoltaic (PV) panels required to sustain the electrical power needs of your <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('CrewQuarters')">habitat</a>. This includes electric heat, lighting for the human occupied space, and grow lights for the <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('PlantSpecies')">plants</a> in the <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('Greenhouse')">greenhouse</a>, <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('ECLSS')">ECLSS</a> operation, radio communication from the habitat to the orbiter, and personal computers.</p>
                <p>On Mars, the total solar gain is roughly 1/3 that on Earth (at its maximum potential). Therefore, a 300 watt solar panel on Earth would generate only 100 watts on Mars. This means you will need 3x more panels to produce the same amount of electric power.</p>
                <p>Keep in mind that not only do you need ample power for all electric devices by day, but also to charge the batteries to operate many of the same devices by night. This will result in a substantial quantity of solar PV panels in your total array.</p>
                <p>The solar PV panels are 2x1 meters, or 2 sq-meters. The surface of the Earth receives on average 1120 W/m2 energy from the Sun. On Mars, the surface receives on average 590 W/m2. This is then reduced by 30% solar panel efficiency for 177 W/m2 x 2 sq-meters = 354 W/m2.</p>
                <p><i>POWER is required for all simulated missions.</i></p>
            </div>
            <div class='reference-item-entry'><a class='reference-link' href="#" @click="SETACTIVEREFENTRY('Table')">Table Of Contents</a></div>
        </div>

        <div class='reference-item' v-if="getActiveRefEntry === 'PowerStorage'">
            <div class='reference-item-title'>Power Storage</div>
            <div class='reference-item-entry'>
                <p>While <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('PowerGeneration')">solar PV panels</a> generate power by day, it is the batteries that provide power at night. Therefore, the total battery capacity should be large enough to power the <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('Greenhouse')">greenhouse</a> grow lights, which may extend beyond the hours of day light, with ample power for the <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('CrewQuarters')">habitat</a> through an entire Martian night.</p>
                <p>In review of the <a class='reference-link' href="#" @click="SETACTIVEREFERENCE('Graphs')">energy graph</a> in the Configuration Wizard, the <em>red</em> consumption bar represents the total power required by the habitat for a full Martian day/night cycle. Therefore, by matching the <em>blue</em> production to <em>red</em> consumption, you will have provided ample solar power generation to recharge the battery array to get through the night.</p>
                <p>The battery holds a maximum of 10,000 kilowatt-hours (kWh).</p>
            </div>
            <div class='reference-item-entry'><a class='reference-link' href="#" @click="SETACTIVEREFENTRY('Table')">Table Of Contents</a></div>
        </div>

        <div class='reference-item' v-if="getActiveRefEntry === 'Table'">
            <div class='reference-item-title'>Table Of Contents</div>
            <div class='reference-item-entry'>
                <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('Welcome')">Welcome to SIMOC</a>
            </div>
            <div class='reference-item-entry'>
                <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('Presets')">Presets</a>
            </div>
            <div class='reference-item-entry'>
                <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('Location')">Location</a>
            </div>
            <div class='reference-item-entry'>
                <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('Duration')">Mission Duration</a>
            </div>
            <div class='reference-item-entry'>
                <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('Inhabitants')">Inhabitants</a>
            </div>
            <div class='reference-item-entry'>
                <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('Food')">Food Supply</a>
            </div>
            <div class='reference-item-entry'>
                <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('CrewQuarters')">Crew Quarters</a>
            </div>
            <div class='reference-item-entry'>
                <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('ECLSS')">Environmental Control</a>
            </div>
            <div class='reference-item-entry'>
                <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('Greenhouse')">Greenhouse</a>
            </div>
            <div class='reference-item-entry'>
                <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('PlantSpecies')">Plant Species</a>
            </div>
            <div class='reference-item-entry'>
                <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('PowerGeneration')">Power Generation</a>
            </div>
            <div class='reference-item-entry'>
                <a class='reference-link' href="#" @click="SETACTIVEREFENTRY('PowerStorage')">Power Storage</a>
            </div>
        </div>



    </div>
</template>

<script>
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
export default {
    computed:{
        ...mapGetters('wizard',['getActiveRefEntry'])
    },
    methods:{
        ...mapMutations('wizard',['SETACTIVEREFENTRY', 'SETACTIVEREFERENCE'])
    }
}
</script>

<style lang="scss" scoped>
    .encyclopedia-wrapper{
        width:100%;
        height:100%;
        overflow-y:auto;
    }

    .reference-item{
        font-family: "Open Sans", sans-serif;
        margin-right: 16px;
    }

    .reference-item-entry,.reference-item-title{
        &:not(:last-of-type){
            margin-bottom: 16px;
        }
    }

    .reference-item-title{
        font-size:24px;
        width: auto;
        font-weight:400;
    }

    .reference-link{
        text-decoration: underline;
        color:lightgreen;
        font-weight: 600;

        &:visited{
            color:lightgreen;

        }
    }
</style>

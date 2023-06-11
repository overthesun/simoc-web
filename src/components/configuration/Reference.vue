<!-- This component is simply for displaying which entry should be displayed on the reference side of the wizard.

Future version should retrieve entries directly from the database, and simply use a v-html for the internal structure of the entry text. A
v-for could be used to loop through each, populating the title, entry, and adding on the table of contents link to the bottom. This would
automate the process and prevent the need for individual sections for every entry. Table of contents could be opulated the same way
using v-for to populate all links with the title and the approriate value for the link.
-->

<template>
    <div class="encyclopedia-wrapper">
        <ReferenceItem v-if="(activeRefEntry === 'Welcome') && (simLocation === 'mars')" heading="Welcome To SIMOC">
            <p>Welcome to SIMOC, a scalable, interactive model of an off-world community. Here you will enjoy the challenges and rewards of designing a habitat for <a class="reference-link" href="#" @click="setActiveRefEntry('Inhabitants')">humans</a> and <a class="reference-link" href="#" @click="setActiveRefEntry('PlantSpecies')">plants</a> using data from four decades of NASA research that defines the simulated interactions.</p>
            <p>Great effort has been made to develop a realistic model. Your goal is to learn which combination of mechanical life support systems (<a class="reference-link" href="#" @click="setActiveRefEntry('ECLSS')">ECLSS</a>) and biological components (<a class="reference-link" href="#" @click="setActiveRefEntry('Greenhouse')">greenhouse</a>) will provide clean air, water, and food for a long-term mission.</p>
            <p><i>Sound easy?</i> Let’s see how your design works on Mars...</p>
            <i>You can click on the <fa-icon :icon="['fa-solid','circle-info']" />
                icons on the left to navigate to the corresponding entries.</i>
        </ReferenceItem>
        <ReferenceItem v-if="(activeRefEntry === 'Welcome') && (simLocation === 'b2')" heading="Welcome To SIMOC">
            <p>Welcome to SIMOC B2, a scalable, interactive model of an off-world Community applied to the world-renowned University of Arizona Biosphere 2. Here you will rediscover the challenges and find solutions for the first and second missions inside one of the world’s most audacious experiments in closed ecosystem design and habitation.</p>
            <p>Great effort has been made to develop this computer model. SIMOC B2 is built upon authentic NASA and Biosphere 2 data, publications, and feedback from those who designed, built, and lived and worked inside of Biosphere 2. Your goal is to learn why the oxygen level fell and how you could adjust the design parameters to achieve a longer mission.</p>
            <p><i>Sound easy?</i> Let’s see how long your crew members will survive! A few months? 500 days? The full two years?</p>
            <i>You can click on the <fa-icon :icon="['fa-solid','circle-info']" />
                icons on the left to navigate to the corresponding entries.</i>
        </ReferenceItem>

        <ReferenceItem v-if="(activeRefEntry === 'Presets') && (simLocation === 'mars')" heading="Presets">
            <p>The Presets are a means to explore simple configurations of the SIMOC simulation, to learn how the agents interact and affect each other over time. With Preset 1 you venture to Mars with one human, one <a class="reference-link" href="#" @click="setActiveRefEntry('ECLSS')">ECLSS</a>, and plenty of food rations for a 10 days mission. You’ll make it. But this is not a static system. Note how CO₂, O₂, food, and power change with time. As with all scientific studies, we encourage you to change one variable at a time. Next, modify this baseline by adding another human, or increase the stay without increasing the food rations. <i>What happens?</i></p>
            <p>The additional Presets introduce slightly more complex systems. They may or may not succeed. <i>What will you change to enable the humans to survive the full duration? What do you notice about the interplay between the number of humans, ECLSS, food rations, and bioregeneration?</i></p>
            <p>Learn more about the Presets at the <a class="reference-link" href="https://simoc.space">SIMOC website</a>.</p>
            <p>As you iterate through your experiment, you can save your current configuration to the Custom Preset.</p>
        </ReferenceItem>

        <ReferenceItem v-if="(activeRefEntry === 'Presets') && (simLocation === 'b2')" heading="Presets">
            <p>The Presets represent three key phases of the Biosphere 2 experiements:</p>
            <dl>
                <dt style="min-width: 8em;"><h3>Mission 1a</h3></dt>
                <dd>The first historical mission, up until day 475 when supplemental O₂ was added. Keep an eye on oxygen producers (plants) and consumers (humans and biomes). How do their rates change over the course of the simulation, and why? How does the concrete affect CO₂?</dd>
            </dl>
            <dl>
                <dt style="min-width: 8em;"><h3>Mission 1b</h3></dt>
                <dd>The first historical mission, from the point at which O₂ was added to the end. In SIMOC, this means the composition of the atmosphere and concrete carbonation match the end of Mission 1a. Mission 1b also includes starting O₂ reserves and a modified greenhouse layout. How does the updated layout impact food production and O₂/CO₂ exchange?</dd>
            </dl>
            <dl>
                <dt style="min-width: 8em;"><h3>Mission 2</h3></dt>
                <dd>The second historical mission, with ideal sunlight and improved crop management practices. How do these factors affect plant productivity? It also includes concrete carbonation accumulated during Mission 1. How does this affect the concrete's CO₂ flows? (see <a class="reference-link" href="#" @click="setActiveRefEntry('Concrete')">Concrete</a>)</dd>
            </dl>
            <p>You can select a preset and launch a simulation as-is to watch the historical missions unfold as they did from 1991-93, and in 1994, or select a preset, customize the settings, then explore how the simulation responds. Try changing the amount and types of plants, and adjust your CO₂ and O₂ reserves and limits. Can you finish the simulation with healthier, happier biospherians?</p>
        </ReferenceItem>

        <ReferenceItem v-if="activeRefEntry === 'StartDate'" heading="Start Date">
            <p>The historical Biosphere 2 missions took place between 1991 and 1995. SIMOC uses historical sunlight data from this period. Plants receive more light in the summer months, and annual output is lower during 1991-1992 due to an El Niño event.</p>
        </ReferenceItem>

        <ReferenceItem v-if="activeRefEntry === 'Duration'" heading="Mission Duration">
            <p>The duration of your mission may be set in hours, days, or years. Each unit of simulated time (a "time step") is equivalent to one hour Earth time. Therefore a duration of 240 time steps is a simulation of 10 Earth days. While the rotational period for each celestial body is unique from that of Earth, SIMOC is set to Earth time due to the fact that the human body is biologically set to Earth time, and the growth cycle of the available <a class="reference-link" href="#" @click="setActiveRefEntry('PlantSpecies')">plants</a>, as defined by data provided by NASA, is also measured in Earth time.</p>
            <template v-if="simLocation === 'mars'">
                <p>When establishing the duration of your mission, consider the goals and intended outcome. For example, if you are staying for just two weeks, you will not have time to raise and harvest plants. Therefore, all atmosphere, water, and waste recycling must come from the physico-chemical Environmental Control and Life Support System (<a class="reference-link" href="#" @click="setActiveRefEntry('ECLSS')">ECLSS</a>), as on the International Space Station. Your <a class="reference-link" href="#" @click="setActiveRefEntry('Food')">food</a> will be brought with you from Earth as dehydrated rations.</p>
                <p>If you are staying a few months or longer, you may consider maintaining a <a class="reference-link" href="#" @click="setActiveRefEntry('Greenhouse')">greenhouse</a> to reduce the quantity of food you must bring from Earth, and experiment in long term sustainability. Upon arrival you will still need ECLSS and rations, but over time the plants will work in conjunction with the ECLSS for a hybrid, physico-chemical / bioregenerative system. This is where SIMOC becomes interesting, for the delicate balance required to support human life for long duration missions may require a few simulations to discover.</p>
            </template>
            <template v-if="simLocation === 'b2'">
                <p>When establishing the duration of your mission, consider the goals and intended outcome. For example, if you are reproducing the original B2 missions, you might keep the mission durations unchanged. Or you might extend the second mission to match the first, for a full two years.</p>
                <p>If you shortened either of the missions, consider that your food cultivars ideally have ample time to see harvest, replanting, and a second growth period to demonstrate a sustainable solution.</p>
            </template>
        </ReferenceItem>

        <ReferenceItem v-if="(activeRefEntry === 'Inhabitants') && (simLocation === 'mars')" heading="Inhabitants">
            <p>While you can use SIMOC to simulate a plant-only configuration, if you design a mission that includes humans, then Environmental Control and Life Support System (<a class="reference-link" href="#" @click="setActiveRefEntry('ECLSS')">ECLSS</a>), <a class="reference-link" href="#" @click="setActiveRefEntry('Food')">food</a>, and a <a class="reference-link" href="#" @click="setActiveRefEntry('CrewQuarters')">crew quarters</a> are required. It is assumed the food and life support required to bring the humans from Earth to Mars are already accounted for, your SIMOC mission starting the day you land and occupy the habitat. Be certain to provide ample food for the astronauts to consume until the <a class="reference-link" href="#" @click="setActiveRefEntry('Greenhouse')">greenhouse</a> produces the first edible <a class="reference-link" href="#" @click="setActiveRefEntry('PlantSpecies')">plants</a>. You must include at least one ECLSS to maintain breathable air and potable water, as well as manage human waste products. The ELCSS will likely continue to be used when the plants are harvested or plant growth is not maintained due to environmental constraints.</p>
            <p><i>ASTRONAUTS are not required for a plant-only simulation.</i></p>
        </ReferenceItem>

        <ReferenceItem v-if="(activeRefEntry === 'Inhabitants') && (simLocation === 'b2')" heading="Inhabitants">
            <p>Biosphere 2 was originally designed for a crew of 8, and Mission 2 included only 7 crew. Below is a short biography of each crew member (at the time of their Mission) and external links, where applicable:</p>
            <h3>Mission 1</h3>
            <ul class="inhabitants">
                <li><b>Sally Silverstone</b>: In charge of finances and day-to-day activities. Background in social studies and management of hostels and drought relief in India.</li>
                <li><b>Mark van Thillo</b>: In charge of technical systems. Background as mechanic and ship's engineer.</li>
                <li><b>Abigail Alling</b>: Coordinated ocean and marsh design. Background in biology with a master's degree from Yale.</li>
                <li><b>Linda Leigh</b>: Coordinated land sections and plant transfer. Background in botany and field ecology.</li>
                <li><b>Taber McCallum</b>: In charge of water, air, soil, and tissue analysis lab. Worked on research vessel. <a class="external-link" href="https://en.wikipedia.org/wiki/Taber_MacCallum" target="_blank">Wikipedia</a></li>
                <li><b>Mark Nelson</b>: In charge of animal systems and data relay. Background in philosophy and agronomy. <a class="external-link" href="https://en.wikipedia.org/wiki/Mark_Nelson_(scientist" target="_blank">Wikipedia</a></li>
                <li><b>Jane Poynter</b>: In charge of agriculture systems. Background in ecological management. <a class="external-link" href="https://en.wikipedia.org/wiki/Jane_Poynter" target="_blank">Wikipedia</a></li>
                <li><b>Dr. Roy Walford</b>: In charge of biospherians' health. Gerontologist with a background in caloric restriction research. <a class="external-link" href="https://en.wikipedia.org/wiki/Roy_Walford" target="_blank">Wikipedia</a></li>
            </ul>
            <h3>Mission 2</h3>
            <ul class="inhabitants">
                <li><b>Bernd Zabel</b>: Physician and researcher, replaced Capt. Norberto Alvarez-Romo.</li>
                <li><b>John Druitt</b>: Agricultural engineer. Background in sustainable agriculture and aquaculture systems.</li>
                <li><b>Matt Finn</b>: Ecologist. Developed the atmospheric and hydrological systems within Biosphere 2.</li>
                <li><b>Pascale Maslin</b>: Ecologist. focused on soil and plant ecology.</li>
                <li><b>Charlotte Godfrey</b>: Environmental researcher. specialized in closed ecosystems and their interactions with the atmosphere.</li>
                <li><b>Rodrigo Romo</b>: Engineer. responsible for technical systems and maintenance.</li>
                <li><b>Tilak Mahato</b>: Agronomist. Expert in <a class="reference-link" href="#" @click="setActiveRefEntry('ImprovedCropManagement')">crop management</a>, in charge of the food production systems.</li>
            </ul>
        </ReferenceItem>

        <ReferenceItem v-if="activeRefEntry === 'Biomes'" heading="Biomes">
            <p>Biosphere 2 includes 5 unique biomes: Rainforest, Desert, Savannah, Ocean and Greenhouse.</p>
            <p>All biomes include some combination of air, soil and vegetation, and each of these performs a different function:</p>
            <ul>
                <li><b>Air</b> circulates between all the biomes, as well as the lungs and crew habitat. A larger air 'sink' means the daily and seasonal fluctuations of O₂ and CO₂ are less in terms of %, which makes it easier to maintain the right composition for humans and plants.</li>
                <li><b>Soil</b> is included in all biomes except the ocean. Soil microorganisms perform respiration, or consume O₂ and produce CO₂, just like humans.</li>
                <li><b>Vegetation</b> varies between biomes, but it always performs photosynthesis, which consumes CO₂ and produces O₂. All biomes include vegetation except for the ocean, which is offset by coral activity, and the IAB, for which the vegetation is the plants, defined below.</li>
            </ul>
            <p>Each biome has different amounts of the above, giving it different exchanges.</p>
            <table id="biomes-table">
                <tr><th>Biome</th><th>Ceiling Height</th><th>Soil Depth</th><th>O₂ in(out)</th><th>CO₂ in(out)</th></tr>
                <tr><td>Savannah</td><td>16.4 m</td><td>2.4 m</td><td>0.13 g/m²</td><td>(0.37 g/m²)</td></tr>
                <tr><td>Ocean</td><td>16.6 m</td><td>-</td><td>-</td><td>-</td></tr>
                <tr><td>Desert</td><td>12.6 m</td><td>2.86 m</td><td>(0.03 g/m²)</td><td>0.09 g/m²</td></tr>
                <tr><td>Rainforest</td><td>14.5 m</td><td>3.0 m</td><td>0.09 g/m²</td><td>(0.26 g/m²)</td></tr>
            </table>
        </ReferenceItem>

        <ReferenceItem v-if="activeRefEntry === 'Concrete'" heading="Concrete">
            <p>When fresh concrete is poured, two processes begin simultaneously: <b>curing</b>, or the hardening of the concrete, and <b>carbonation</b>, the conversion of internal calcium hydroxide (CA(OH)₂) and ambient CO₂ into internal calcium carbonate CaCO₃ and retained moisture. The second process, carbonation, is affected by the level of ambient CO₂ in the air.</p>
            <p>The Biosphere 2 biomes contain a combined 16,000 m² of exposed, unpainted concrete, which were poured in 1989. Increased CO₂ consumption due to concrete carbonation was not considered before Mission 1, and was identified as a major CO₂ sink as a result of research done after the mission.</p>
            <p>In SIMOC, carbonation is measured in moles per square meter. At earth-normal (350 ppm), about 0.005 moles of CO₂ are absorbed out of the atmosphere per square meter of concrete over a period of 1-2 years. At elevated CO₂ levels, like during the Biosphere 2 missions, this process occurs much faster, and for a longer period, reaching up to .1 moles per square meter over 20 years.</p>
            <p>The B2 preset missions include actual concrete carbonation at the start of each mission. For custom simulations, you can set the initial amount of concrete carbonation between 0 (freshly poured) and 0.1. How can you adjust the starting carbonation to your benefit?</p>
        </ReferenceItem>

        <ReferenceItem v-if="activeRefEntry === 'Food'" heading="Food Supply">
            <p v-if="simLocation === 'mars'">It is imperative that your astronauts have ample food supply while the <a class="reference-link" href="#" @click="setActiveRefEntry('PlantSpecies')">plants</a> are growing in the <a class="reference-link" href="#" @click="setActiveRefEntry('Greenhouse')">greenhouse</a>. The plants are unable to produce edible fruit and vegetables until they are ready to harvest. Their capacity for carbon dioxide sequestration and oxygen production start at a very minimal level, increasing to their full capacity as a sigmoid (“S”) function.</p>
            <p v-if="simLocation === 'b2'">The Biospherians entered Biosphere 2 with food cultivars fully grown, many ready for harvest. This reduced their need to call upon pre-grown food from day-one. But as you consider the subsequent harvest and planting cycles, it is imperative that your crew have ample food supply while the <a class="reference-link" href="#" @click="setActiveRefEntry('Plants')">plants</a> are growing in the <a class="reference-link" href="#" @click="setActiveRefEntry('Biomes')">greenhouse</a>. Consider that the plants are unable to produce edible fruit and vegetables until they are ready to harvest. Furthermore, their capacity for carbon dioxide sequestration and oxygen production start at a very minimal level, increasing to their full capacity as a sigmoid (“S”) function.</p>
            <p>When the plants are harvested, each has a unique ratio of edible -vs- inedible biomass. Some plants are almost entirely edible (e.g. cabbage) while others offer very little for the human to digest (e.g. wheat). Yet, wheat offers the most nutrients and as you will find, is an excellent CO₂ reduction agent. At harvest, edible biomass is stored as food while inedible biomass is returned to the plants as nutrients.</p>
            <p v-if="simLocation === 'b2'">During the <a class="reference-link" href="#" @click="setActiveRefEntry('Presets')">Biosphere 2 missions</a>, the crew consumed a low-calorie, nutrient-dense diet prescribed by biospherian Roy Walford. In SIMOC-B2 simulations, this is reflected as a 50% reduction from the default, high-calorie astronaut diet modeled in SIMOC. This change is also reflected in the table below.</p>
            <p>The following table can be used as a reference for the amount of food required (in kg):</p>
            <table id="food-table">
                <tr><td colspan="2" rowspan="2" /><th colspan="7">Mission Duration (Earth days)</th></tr>
                <tr><th>1</th><th>7</th><th>30</th><th>90</th><th>180</th><th>365</th></tr>
                <tr><th rowspan="5">Inhabitants</th><th>1</th><td>{{food}}</td><td>{{food*7}}</td><td>{{food*30}}</td><td>{{food*90}}</td><td>{{food*180}}</td><td>{{food*365}}</td></tr>
                <tr><th>2</th><td>{{food*2}}</td><td>{{food*2*7}}</td><td>{{food*2*30}}</td><td>{{food*2*90}}</td><td>{{food*2*180}}</td><td>{{food*2*365}}</td></tr>
                <tr><th>5</th><td>{{food*5}}</td><td>{{food*5*7}}</td><td>{{food*5*30}}</td><td>{{food*5*90}}</td><td>{{food*5*180}}</td><td>{{food*5*365}}</td></tr>
                <tr><th>10</th><td>{{food*10}}</td><td>{{food*10*7}}</td><td>{{food*10*30}}</td><td>{{food*10*90}}</td><td>{{food*10*180}}</td><td>{{food*10*365}}</td></tr>
            </table>
            <p v-if="simLocation === 'mars'"><i>FOOD is not required if no astronauts are selected.</i></p>
        </ReferenceItem>

        <ReferenceItem v-if="activeRefEntry === 'CrewQuarters'" heading="Crew Quarters">
            <p>In selecting your crew quarters, it is prudent to consider a balance between the volume required to support the number of astronauts you have chosen, for their physical comfort and the benefits of a larger space. In the real world, we would be concerned with the amount of communal and personal space the inhabitants enjoy. As SIMOC does not currently simulate psycho-social interactions, you may consider the volume of a larger space as an atmosphere storage buffer. In times of reduced breathable atmosphere (power outage), a larger habitat can provide breathable air for a longer period of time. However, a larger habitat is also more massive, consuming more fuel and payload in transit from Earth to the destination (currently recorded but not tracked).</p>
            <p>What’s more, future versions of SIMOC will enable the scaling of your habitat to accommodate a growing community. As such, a larger, initial structure will allow the addition of crew without having to transport additional structures.</p>
            <p><i>CREW QUARTERS are not required if no astronauts are selected.</i></p>
        </ReferenceItem>

        <ReferenceItem v-if="activeRefEntry === 'ECLSS'" heading="Environmental Control">
            <p>An Environmental Control and Life Support System (ECLSS) is a tightly integrated, mechanical and chemical system whose function is to maintain clean air, water, and relative humidity while sustaining a comfortable temperature for <a class="reference-link" href="#" @click="setActiveRefEntry('Inhabitants')">human</a> occupants of a closed environment, as used on submarines, the International Space Station, and near future off-world habitats.</p>
            <p>ECLSS modules are composed of several interconnected components, each of which is modeled in SIMOC as follows: Solid Waste Aerobic Bioreactor, MultiFiltration Purifier post-treatment, Urine recycling processor VCD, Oxygen Generation SFWE, Carbon Dioxide Removal SAWD, Particulate Removal TCCS, and Gas Control.</p>
            <p v-if="simLocation === 'mars'">One ECLSS is able to support 3 human inhabitants. Select how many ECLSS modules you will bring on your mission. Learn more about each of these agents at the <a class="reference-link" target="_blank" href="https://simoc.space">SIMOC website</a>.</p>
            <p v-if="simLocation === 'b2'">The ECLSS system manages the levels of oxygen (O₂) and carbon dioxide (CO₂) within Biosphere 2. The <a class="reference-link" href="#" @click="setActiveRefEntry('CO2Management')">CO₂ Management</a> system can scrub, store and re-supply carbon dioxide, while the <a class="reference-link" href="#" @click="setActiveRefEntry('O2Management')">O₂ Management</a> system releases oxygen reserves.</p>
            <p>For long-term missions, it will not be enough to rely on mechanical life support. Rather, a greenhouse can provide plants for CO2 sequestration, oxygen generation, waste processing, and food production. Consider a hybrid solution.</p>
            <p><i>An ECLSS module is not required if no astronauts are selected.</i></p>
        </ReferenceItem>

        <ReferenceItem v-if="activeRefEntry === 'CO2Management'" heading="CO₂ Management">
            <p>Carbon dioxide (CO₂) is critical for plant growth, but can be harmful to humans above a certain level.</p>
            <p>The average concentration of CO₂ in earth's atmosphere was roughly 415 parts per million (ppm) in 2022 (up from 300 ppm in 1900). During the Biosphere 2 experiments, CO₂ was maintained at roughly 2,500 ppm. Humans can survive in up to 10,000 ppm, but may experience negative health effects above 5,000 ppm and feel drowsy above 2,500 ppm.</p>
            <p>Plants use CO₂ to generate new biomass via photosynthesis. Most plants grow 30-40% bigger when CO₂ is increased to 1,000 ppm, and there's some evidence this effect continues at even higher levels.</p>
            <p>In SIMOC, your atmosphere starts at 415 ppm. The Upper Limit determines when the scrubbers are activated and CO₂ is removed from the atmosphere. When it's removed, it's added to the CO₂ storage, along with your starting reserves. The Lower Limit determines when CO₂ is released from storage into the atmosphere. Try reducing the Upper Limit to earth-normal (415 ppm) and see plant productivity is affected.</p>
        </ReferenceItem>

        <ReferenceItem v-if="activeRefEntry === 'O2Management'" heading="O₂ Management">
            <p>Oxygen (O₂) is required for both human and soil respiration, and is a byproduct of plant photosynthesis.</p>
            <p>The average concentration of O₂ in earth's atmosphere was 21% in 2022. Humans can survive as low as 8%, but start experiencing headaches and fatigue below 15%. During the first Biosphere 2 mission, O₂ fell steadily to a low of 14% before supplemental oxygen reserves were pumped in.</p>
            <p>In SIMOC, your atmosphere starts at 21%. You may include starting reserves, which will be added when the internal concentration falls below the Lower Limit.</p>
        </ReferenceItem>

        <ReferenceItem v-if="activeRefEntry === 'Greenhouse'" heading="Greenhouse">
            <p>As with the <a class="reference-link" href="#" @click="setActiveRefEntry('CrewQuarters')">crew quarters</a>, the size of the greenhouse is your choice. If you intend for your astronauts to consume only the <a class="reference-link" href="#" @click="setActiveRefEntry('Food')">food</a> they have brought with them and rely fully on <a class="reference-link" href="#" @click="setActiveRefEntry('ECLSS')">mechanical life support</a>, a greenhouse is not required. If you desire for your astronauts to consume some fresh fruits, vegetables, and grains, and for the <a class="reference-link" href="#" @click="setActiveRefEntry('PlantSpecies')">plants</a> to offset atmosphere and water recycling, a greenhouse is an integral component to a long-duration mission.</p>
            <p>In this SIMOC release, the Crew Quarters and Greenhouse share their atmospheres. This means the Greenhouse is not able to maintain an elevated CO₂ level while keeping the Crew Quarters at nominal. Future versions of SIMOC will provided independent volumes for optimal human and plant atmospheres.</p>
            <p><i>A GREENHOUSE is not required, even if astronauts are selected.</i></p>
        </ReferenceItem>

        <ReferenceItem v-if="(activeRefEntry === 'PlantSpecies') && (simLocation === 'mars')" heading="Plant Species">
            <p>If you elect to provide your astronauts with something more interesting than <a class="reference-link" href="#" @click="setActiveRefEntry('Food')">food rations</a> for a long <a class="reference-link" href="#" @click="setActiveRefEntry('Duration')">duration</a> mission, a <a class="reference-link" href="#" @click="setActiveRefEntry('Greenhouse')">greenhouse</a> and plants are a welcomed respite from the monotony of meals in squeeze bottles and aluminum foil containers. Not only do fruits and vegetables provide nutrients and calories, they also help maintain a breathable atmosphere and clean water, off-setting, maybe even replacing the function of the <a class="reference-link" href="#" @click="setActiveRefEntry('ECLSS')">ECLSS</a> modules. When selecting your plants you will also select the percentage of the total volume of the <a class="reference-link" href="#" @click="setActiveRefEntry('Greenhouse')">greenhouse</a> allocated to each plant species.</p>
            <p>Keep in mind that you will be starting your plants from seeds, not seedlings or mature transplants. So make certain you have provided your astronauts with ample food rations for the time it takes to raise the plants from seed to harvest.</p>
            <p>Note that each plant is associated with a particular power requirement, that is, the amount of synthetic light required to grow the plants. This is based on NASA data for each included plant species. As such, when you select a higher volume of plants that require more lighting, the <a class="reference-link" href="#" @click="setActiveRefEntry('PowerGeneration')">power generation</a> and <a class="reference-link" href="#" @click="setActiveRefEntry('PowerStorage')">storage</a> requirement will increase accordingly.</p>
            <p>Refer to the <a class="reference-link" target="_blank" href="https://simoc.space">SIMOC website</a> to learn more about the plant species made available to you.</p>
            <p>PLANTS are not required, even if astronauts are selected.</p>
        </ReferenceItem>

        <ReferenceItem v-if="(activeRefEntry === 'PlantSpecies') && (simLocation === 'b2')" heading="Plant Species">
            <p>If you elect to provide your astronauts with something more interesting than <a class="reference-link" href="#" @click="setActiveRefEntry('Food')">food rations</a> for a long <a class="reference-link" href="#" @click="setActiveRefEntry('Duration')">duration</a> mission, a <a class="reference-link" href="#" @click="setActiveRefEntry('Greenhouse')">greenhouse</a> and plants are a welcomed respite from the monotony of meals in squeeze bottles and aluminum foil containers. Not only do fruits and vegetables provide nutrients and calories, they also help maintain a breathable atmosphere and clean water, off-setting, maybe even replacing the function of the <a class="reference-link" href="#" @click="setActiveRefEntry('ECLSS')">ECLSS</a> modules. When selecting your plants you will also select the percentage of the total volume of the <a class="reference-link" href="#" @click="setActiveRefEntry('Greenhouse')">greenhouse</a> allocated to each plant species.</p>
            <p>Keep in mind that when the initial, mature plants are harvested, you will be starting new plants from seeds, not seedlings or mature transplants. While NASA would provide ample food rations in the case of failure of one or more crops in the greenhouse, those in the Biosphere 2 had no backup, no reserves. While sealed inside they were nutritionally well fed but hungry from the start due to a low caloric intake.</p>
            <p>Refer to the <a class="reference-link" target="_blank" href="https://simoc.space">SIMOC website</a> to learn more about the plant species made available to you.</p>
        </ReferenceItem>

        <ReferenceItem v-if="activeRefEntry === 'ImprovedCropManagement'" heading="Improved Crop Management">
            <p>For the second historical Biosphere 2 mission, <a class="reference-link" href="#" @click="setActiveRefEntry('Inhabitants')">Tilak Mahato</a>, a controlled-agriculture researcher with an indigenous farming background, implemented several new procedures, including:</p>
            <ul>
                <li>Removing pests immediately. Because pest populations grow so quickly, catching and remediating an infestation early has an outsized impact.</li>
                <li>Taking care not spread pests, fungi or diseases via contaminated tools.</li>
                <li>Washing diseased leaves with soap and water.</li>
                <li>Protect seedling growing areas from roaches and other pests.</li>
                <li>Pollinating plants by hand. During Mission 1, the entire corn crop had failed to produce food because there was no wind to spread pollen from the (male) tassels to the (female) silk. Other plants' pollen had been washed away by overhead irrigation.</li>
            </ul>
            <p>On Mission 2, crop yields and plant well-being improved significantly. Wheat, rice and sorghum yields were 50%, 150%, and 90% higher respectively than in Mission 1a. Some of this is due to the procedures above and others, and some is due to <a class="reference-link" href="#" @click="setActiveRefEntry('Presets')">improved weather/sunlight</a>. In SIMOC-B2, selecting 'Improved Crop Management' results in a 50% increase in food output for all plants.</p>
        </ReferenceItem>

        <ReferenceItem v-if="activeRefEntry === 'PowerGeneration'" heading="Power Generation">
            <p>Select the number of solar photovoltaic (PV) panels required to sustain the electrical power needs of your <a class="reference-link" href="#" @click="setActiveRefEntry('CrewQuarters')">habitat</a>. This includes electric heat, lighting for the human occupied space, and grow lights for the <a class="reference-link" href="#" @click="setActiveRefEntry('PlantSpecies')">plants</a> in the <a class="reference-link" href="#" @click="setActiveRefEntry('Greenhouse')">greenhouse</a>, <a class="reference-link" href="#" @click="setActiveRefEntry('ECLSS')">ECLSS</a> operation, radio communication from the habitat to the orbiter, and personal computers.</p>
            <p>On Mars, the total solar gain is roughly 1/3 that on Earth (at its maximum potential). Therefore, a 300 watt solar panel on Earth would generate only 100 watts on Mars. This means you will need 3x more panels to produce the same amount of electric power.</p>
            <p>The solar PV panels are 2 m². The surface of the Earth receives on average 1120 W/m² energy from the Sun. On Mars, the surface receives on average 590 W/m². This is then reduced by 30% solar panel efficiency for 177 W/m² x 2 m² = 354 W/m².</p>
            <p>Keep in mind that not only do you need ample power for all electric devices by day, but also to charge the batteries to operate many of the same devices by night. This will result in a substantial quantity of solar PV panels in your total array.</p>
            <p><i>POWER is required for all simulated missions.</i></p>
        </ReferenceItem>

        <ReferenceItem v-if="activeRefEntry === 'PowerStorage'" heading="Power Storage">
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

// eslint-disable-next-line import/no-cycle
import {ReferenceItem} from '.'

export default {
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
                {ref: 'Concrete', label: 'Concrete'},
                {ref: 'Food', label: 'Food Supply'},
                {ref: 'CO2Management', label: 'CO₂ Management'},
                {ref: 'O2Management', label: 'O₂ Management'},
                {ref: 'PlantSpecies', label: 'Plant Species'},
                {ref: 'ImprovedCropManagement', label: 'Improved Crop Management'},
            ],
        }
    },
    computed: {
        food() {
            const DEFAULT_RATE = 1.5  // kg per day
            if (this.simLocation === 'b2') {
                return DEFAULT_RATE / 2
            } else {
                return DEFAULT_RATE
            }
        },
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

    #biomes-table {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid #eeeeee;
        text-align: right;
        & td:first-child, & th:first-child {
            text-align: left;
        }
        & th {
            border-bottom: 1px solid #eeeeee;
        }
    }

    .inhabitants li {
        margin-bottom: 0.5em;
    }
</style>

<template>
    <div class="section-nav-wrapper">
        <span title='Scroll Left'>
            <fa-icon :icon="['fas','chevron-left']" @click="scroll('left')" class="scrollArrow" :class="{ 'scrollArrow-hidden' : leftEnd === true }"/>
        </span>
        <div class="section-nav-menu" v-on:scroll.passive="checkEdges">
            <div v-for="section in sections" v-bind:key="section" >
                <div 
                    class='option-item' 
                    @click="$emit('setActiveSection', section)"
                    :class="{ 'option-item-active' : section === activeSection }"
                >{{ formatSection(section) }}</div>
            </div>
        </div>
        <span title='Scroll Right'>
            <fa-icon :icon="['fas','chevron-right']" @click="scroll('right')" class="scrollArrow" :class="{ 'scrollArrow-hidden' : rightEnd === true }"/>
        </span>
    </div>
</template>

<script>

export default {
    props: [
        'sections',
        'activeSection'
    ],
    data() {
        return {
            leftEnd: true,
            rightEnd: false,
        }
    },
    methods: {
        scroll: function(dir) {
            let menu = document.querySelector('.section-nav-menu')
            switch (dir) {
                case 'left': menu.scrollLeft -= 60; break;
                case 'right': menu.scrollLeft += 60; break;
                case 'default': break;
            }
            this.checkEdges()
        },
        checkEdges: function(e) {
            let menu = document.querySelector('.section-nav-menu')
            this.leftEnd = (menu.scrollLeft === 0) ? true : false
            this.rightEnd = (menu.scrollLeft + menu.offsetWidth === menu.scrollWidth) ? true : false
        },
        formatSection: function(text) {
            return text.split("_").join(" ").toUpperCase()
        }
    },
    created() {
        library.add(faChevronLeft, faChevronRight)
    }
}
</script>

<style lang="scss" scoped>

    .scrollArrow {
        font-size: 18px;
        padding: 12px 8px;

        &:hover{
            cursor:pointer;
            background-color: rgba(238, 238, 238, 0.2);
        }

        &-hidden{
            display: none
        }
    }

    // Hidden scroll: https://stackoverflow.com/questions/25067224/horizontally-scrollable-without-scrollbar
    .section-nav-wrapper {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 50px;
        overflow: hidden;
    }

    .section-nav-menu {
        display: flex;
        flex-direction: row;
        flex-grow: 1;
        height: 90px;
        white-space: nowrap;
        overflow-x: scroll;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
    }

    // Copied from BaseConfiguration.vue
    .option-item {
        // padding: 10px 30px;
        // font-size: 20px;
        padding: 8px 20px;
        font-size: 18px;
        position:relative;

        &:hover{
            cursor:pointer;
            background-color: rgba(238, 238, 238, 0.2);
        }

        &:after{
            box-sizing:border-box;
            position:absolute;
            right:0;
            top:100%;
            content:"";
            width:0;
            border-bottom: 2px solid lightgreen;
            transition: width .2s ease;
        }

        &-active:after{
            width:100%;
            left:0;
        }

        &-disabled{
            color:#999;
        }
    }
</style>
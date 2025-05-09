<template>
    <section class="cards-list-wrapper">
        <ul class="cards-list">
            <template v-for="(value, desc) in data" :key="`card_${desc}`">
                <li>
                    <span>{{desc}}</span>
                    <span>{{value}}</span>
                </li>
            </template>
        </ul>
    </section>
</template>


<script>
export default {
    name: 'CardList',
    props: {
        data: {type: Object, required: true},
    },
}
</script>


<style lang="scss" scoped>
.cards-list-wrapper {
    overflow-y: auto;
    height: 100%;
}
.cards-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
.cards-list li {
    font-size: 200%;
    background-color: #222;
    border: 1px solid #666;
    margin: .2em 0;
    padding: 0 .4em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1 1 auto;
}
.panel-fullscreen .cards-list li {
    font-size: 400%;
}
.cards-list span:first-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>

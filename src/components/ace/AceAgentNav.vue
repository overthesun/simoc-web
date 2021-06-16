<template>
    <div class='agent-nav'>
        <div v-for='agent in agents' :key='agent' class='btn-container'>
            <div class='btn-agent'>{{ agent }}</div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            agents: [
                'Rice',
                'Wheat',
                'Cabbage',
                'Chard',
                'Celery',
                'Lettuce',
                'Spinach',
                'Dry Bean',
                'Peanut',
                'Soybean',
                'Strawberry',
                'Tomato',
                'Green Onion',
                'Onion',
                'Pea',
                'Pepper',
                'Snap Bean',
                'Radish',
                'Red Beet',
                'Carrot',
                'Sweet Potato',
                'White Potato'
            ]
        }
    }
}
</script>

<style lang="scss" scoped>

    .agent-nav {
        display: flex;
        flex-direction: column;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    .btn-container {
        margin: 0;
        padding: 0;
    }

    .btn-agent {
        padding: 6px 0;
        margin: 0; 
        width: inherit;
        text-align: center;

        &:hover{
            background-color: rgba(238, 238, 238, 0.2);
            cursor: pointer;
        }
    }
</style>
<template>
    <div style='ace-header-wrapper'>
        <div class="title">CONFIGURATION EDITOR</div>
        <p>Welcome to the SIMOC configuration editor. This interface enables modification of the seed data for SIMOC using customizable JSON files.</p>
        <div>
            <button class='btn-normal'>Import Config</button>
            <input class="file" type="file" id="selectFiles" accept=".json" value="Import" />
            <button class='btn-normal btn-warning'>Revert Changes</button>
        </div>
        <div>
            <button class='btn-normal'>Export Config</button>
            <button class='btn-normal btn-warning'>Restore Defaults</button>
        </div>
        <hr class='rule-line'> 
    </div>
</template>

<script>
export default {
    
}
</script>

<style scoped>
    .ace-header-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }
    .title {
        font-family: "Nasalization", "Open Sans", sans-serif;
        font-weight: 200;
        font-size: 22px;
    }
    .file {
        border: 1px solid #eee
    }
    .rule-line {
        color: 1px solid #eee
    }
</style>
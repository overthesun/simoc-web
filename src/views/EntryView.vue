<!-- Container for all entry related components -->

<template>
    <v-container fluid>
        <v-card class="base-entry-wrapper">
            <router-view />
        </v-card>
    </v-container>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.base-entry-wrapper {
  position: relative;
  width: 480px;
  height: 600px;
  max-height: 600px;
  background-color: #1e1e1eaa;
  border: 1px solid #666;
  border-radius: 5px;

  box-sizing: border-box;
  padding: 16px;

  overflow: hidden;
}
</style>

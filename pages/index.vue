<template lang="html">
  <editor v-if="file" :theFile="file" theFrame="graphic.png" @remove="file = null" />
  <drop-zone v-else @fileAdded="file = $event" />
</template>

<script>
export default {
  data: () => ({
    file: null,
  })
};
</script>

<style lang="css"></style>

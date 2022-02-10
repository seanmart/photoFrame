<template lang="html">
  <section id="dropzone" class="absolute inset-0 p-gutter pt-header">
    <div class="dz__frame w-full h-full flex flex-col justify-center items-center rounded-xl border-2 border-dashed" :class="{ 'is-drag-active': dragActive }" @dragenter.prevent="dragActive = true" @dragleave.prevent="dragActive = false" @dragover.prevent @drop.prevent="drop">
      <upload class="w-16 fill-purple mb-5" />

      <div class="dz__drag-msg text-center">
        <h3 class="text-xl mb-5">Drag an image here</h3>
        <p class="dz__message mb-2">Or if you prefer</p>
      </div>

      <label for="file" class="button">
        <span>Select from your device</span>
        <input type="file" @change="selectedFile" name="file" id="file" class="hidden" />
      </label>
    </div>
  </section>
</template>

<script>
export default {
  data: () => ({
    dragActive: false,
  }),
  methods: {
    drop(e) {
      let file = e.dataTransfer.files[0];
      this.$emit("fileAdded", file);
    },
    selectedFile(e) {
      let file = e.target.files[0];
      this.$emit("fileAdded", file);
    },
  },
};
</script>

<style lang="css">
.dz__frame {
  background: rgba(theme("colors.purplergb"), 0.1);
  border-color: rgba(theme("colors.purplergb"), 0.3);
  transition-property: background border-color;
  transition-duration: 0.25s;
}

.dz__frame.is-drag-active {
  background: rgba(theme("colors.purplergb"), 0.2);
  border-color: rgba(theme("colors.purplergb"), 1);
}
.dz__frame.is-drag-active * {
  pointer-events: none;
}

.is-mobile .dz__drag-msg {
  display: none;
}
</style>

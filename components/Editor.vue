<template lang="html">
  <section id="editor" class="absolute inset-0 flex justify-center items-center pt-header sm:pt-0" ref="container">
    <canvas id="canvas" ref="canvas" :class="{ 'is-visible': isVisible }" />

    <div class="absolute right-gutter left-gutter top-header-space sm:left-auto sm:top-gutter flex flex-row items-center justify-center">
      <a class="button button--grey mr-2" v-html="'Remove'" @click="$emit('remove')" />
      <a class="button" v-html="'Download'" @click="download" />
    </div>

    <div class="absolute bottom-gutter left-gutter right-gutter flex flex-row justify-center items-center text-dark">
      <span class="text-4xl mr-6">–</span>
      <vue-slider
        @change="handleChange"
        :value="1"
        :min="1"
        :max="2"
        :interval="0.01"
        :width="200"
        :dotSize="30"
        :tooltip-formatter="toolTipFormatter"
      />
      <span class="text-4xl ml-6">+</span>
    </div>
  </section>
</template>

<script>
import { fabric } from "fabric";
export default {
  props: ["theFile", "theFrame"],
  mounted() {
    this.theImage = URL.createObjectURL(this.theFile);
    setTimeout(this.init, 250);
  },
  data: () => ({
    isVisible: false,
  }),
  methods: {
    toolTipFormatter(v) {
      return Math.round(100 * v) + "%";
    },
    handleChange(v) {
      if (!this.image) return;
      this.scale(this.image, v, true);
      this.canvas.renderAll();
    },
    async init() {
      this.canvas = new fabric.Canvas(this.$refs.canvas, { preserveObjectStacking: true });
      this.frame = await this.addImage(this.theFrame, {
        evented: false,
        top: 0,
        left: 0,
        hasControls: false,
        hasBorders: false,
        selectable: false,
      });

      this.image = await this.addImage(this.theImage, {
        left: 0,
        originX: "left",
        originY: "top",
        hasControls: false,
      });

      this.image.setControlsVisibility({
        mt: false,
        mb: false,
        ml: false,
        mr: false,
        mtr: false,
      });

      window.addEventListener("resize", this.handleResize);
      this.$refs.container.addEventListener("click", this.handleClick);
      this.handleResize();

      this.scale(this.image, 1);

      this.canvas.add(this.image);
      this.canvas.add(this.frame);

      this.canvas.on("object:moving", () => {
        let minX = this.canvas.width - this.image.getScaledWidth();
        let minY = this.canvas.height - this.image.getScaledHeight();

        this.image.left = this.clamp(this.image.left, minX, 0);
        this.image.top = this.clamp(this.image.top, minY, 0);
      });

      this.isVisible = true;
    },
    scale(e, v, c = false) {
      let width = e.getScaledWidth();
      let height = e.getScaledHeight();

      e.height > e.width ? e.scaleToWidth(this.canvas.width * v) : e.scaleToHeight(this.canvas.height * v);

      if (c) {
        let newWidth = e.getScaledWidth();
        let newHeight = e.getScaledHeight();
        let valX = e.left + (width - newWidth) / 2;
        let valY = e.top + (height - newHeight) / 2;
        let minX = this.canvas.width - newWidth;
        let minY = this.canvas.height - newHeight;

        e.left = this.clamp(valX, minX, 0);
        e.top = this.clamp(valY, minY, 0);
      }
    },
    clamp(num, min, max) {
      return Math.min(Math.max(num, min), max);
    },
    handleClick(e) {
      if (e.path[0] == this.$refs.container) {
        this.canvas.discardActiveObject();
        this.canvas.renderAll();
      }
    },
    handleResize() {
      let currentWidth = this.canvas.width;
      let currentHeight = this.canvas.height;
      let maxWidth = window.innerWidth - 40;
      let maxHeight = window.innerHeight - (window.innerWidth < 600 ? 320 : 180);
      let height = Math.min(maxWidth * (this.frame.height / this.frame.width), maxHeight);
      let width = Math.min(maxHeight * (this.frame.width / this.frame.height), maxWidth);
      let widthDiff = width / currentWidth;
      let heightDiff = height / currentHeight;
      let imageWidth = this.image.getScaledWidth();
      let imageLeft = this.image.left;
      let imageTop = this.image.top;

      this.canvas.setWidth(width);
      this.canvas.setHeight(height);
      this.frame.scaleToWidth(width);
      this.image.scaleToWidth(imageWidth * widthDiff);
      this.image.left = imageLeft * widthDiff;
      this.image.top = imageTop * heightDiff;
    },
    addImage(image, options = null) {
      return new Promise((done) =>
        fabric.Image.fromURL(image, (img) => {
          options &&
            Object.keys(options).map((k) => {
              img[k] = options[k];
            });
          done(img);
        })
      );
    },
    download() {
      let width = 1500;
      let height = width * (this.$refs.canvas.height / this.$refs.canvas.width);
      let imgCanvas = document.createElement("canvas");
      imgCanvas.width = width;
      imgCanvas.height = height;
      imgCanvas.getContext("2d").drawImage(this.$refs.canvas, 0, 0, this.$refs.canvas.width, this.$refs.canvas.height, 0, 0, width, height);

      if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(imgCanvas.msToBlob(), "photo-frame.png");
      } else {
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.href = imgCanvas.toDataURL();
        a.download = "photo-frame.png";
        a.click();
        document.body.removeChild(a);
      }
    },
  },
};
</script>

<style lang="css">

  #canvas{
    box-shadow: 0px 50px 50px -10px rgba(theme('colors.purplergb'),.5);
    opacity: 0;
    transition: opacity .5s;
  }

  #canvas.is-visible{
    opacity: 1;
  }

  .vue-slider-rail{
    background: rgba(theme('colors.purplergb'),.5);
  }
  .vue-slider-process{
    color: white;
    font-size: 1rem;
    background: theme('colors.purple');
  }
  .vue-slider-dot-tooltip{
    padding:.2rem .5rem;
    border-radius: .1rem;
    color:white;
    background: theme('colors.dark');
  }

  .vue-slider-dot{
    background: white;
    box-shadow: 0px 2px 4px rgba(theme('colors.purplergb'),.5);
    border-radius: 100%;
  }
</style>

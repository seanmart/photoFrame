<template lang="html">
<main class="relative h-screen">
  <div class="absolute top-gutter left-gutter right-gutter flex justify-center sm:right-auto">
    <logo class="fill-purple h-logo "/>
  </div>
  <nuxt/>
</main>
</template>

<script>
export default {
  created(){
    if (process.server) return
    let { userAgent, maxTouchPoints, platform } = navigator
    let conditional = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
    let html = document.documentElement
    window.isMobile = conditional.test(userAgent) || (platform === "MacIntel" && maxTouchPoints > 1);
    html.classList.add(window.isMobile ? 'is-mobile' : 'is-desktop')
  },
}
</script>

<style lang="css">
@import url('https://fonts.googleapis.com/css2?family=Varela+Round&display=swap');
html{
  height: 100vh;
  overflow: hidden;
  background: rgba(theme('colors.purplergb'),.1);
}

.button{
  padding: .75rem 2rem;
  color: white;
  border-radius: .25rem;
  background: theme('colors.purple');
  cursor: pointer;
  transition: transform .25s;
}
.button:hover{
  background: theme('colors.dark')
}
.button.button--grey{
  opacity: .6
}
.button:active{
  background: theme('colors.dark');
  transform: scale(.95)
}
</style>

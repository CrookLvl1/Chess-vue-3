<script lang="ts" setup>
import GameWrap from '@/components/gameWrap.vue';
import HeaderComponentVue from '@/components/headerComponent.vue';
import FooterComponent from '@/components/footerComponent.vue';


</script>
<template>
  <div>
    <main class="main-screen-wrapper">
      <header>
        <HeaderComponentVue />
      </header>

      <GameWrap class="main-wrapper"  />

      <footer>
        <FooterComponent />
      </footer>
    </main>
  </div>
</template>
<style lang="scss"></style> 
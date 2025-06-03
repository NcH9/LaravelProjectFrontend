<template>
  <div id="home">
    <header class="left_bubble">
      <h1 class="flex_center" id="title">
          {{ $t('home.hotel') }} "Diploma"
      </h1>
      <p class="flex_right">
          {{ $t('home.welcome_text') }}
      </p>
      <p class="flex_right">
          {{ $t('home.you_can_do_text') }}
      </p>
      
    </header>
    <main>

    </main>
<!--    <footer class="right_bubble">-->
<!--      <p class="flex_left">Laravel/VUE3 app</p>-->
<!--    </footer>-->
  </div>
</template>

<script setup>

</script>

<style scoped>
#home p {
  margin: 10px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
#home #title {
  margin-bottom: 15px;
  font-size: 2em;
  font-weight: bold;
  color: rgb(59, 59, 255);
  font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif
}
</style>

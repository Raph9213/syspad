<script setup lang="ts">
import { useIntervalFn } from "@vueuse/core";
import { computed, onMounted, ref } from "vue";
import Header from "./components/Header.vue";
import Stops from "./components/Stops.vue";
import Time from "./components/Time.vue";
import { nextTrainJourneys } from "./fetch";
import type { SimpleJourney } from "./services/Wagon";

const journeys = ref<SimpleJourney[] | null>(null);

const nextDeparture = computed(() => journeys.value?.at(0)?.userStopDeparture);

const lineLogo = computed(() => journeys.value?.at(0)?.line.numberShapeSvg);

useIntervalFn(async () => {
  journeys.value = await nextTrainJourneys();
}, 61 * 1000);

onMounted(async () => {
  journeys.value = await nextTrainJourneys();
});
</script>

<template>
  <Time class="time"></Time>
  <div class="logo" v-if="lineLogo" v-html="lineLogo"></div>
  <template v-if="nextDeparture">
    <Header class="header" :departure="nextDeparture"></Header>
    <Stops v-if="journeys" :journeys="journeys"></Stops>
  </template>
</template>

<style scoped>
.time {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9999;
}

.header {
  position: fixed;
  top: 7vh;
  left: 27vh;
  z-index: 999;
}

.logo {
  position: fixed;
  top: -4vh;
  left: -4vh;
  height: 40vh;
}
</style>

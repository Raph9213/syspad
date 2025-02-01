<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import Stops from "./components/Stops.vue";
import Time from "./components/Time.vue";
import { nextTrainJourneys } from "./fetch";
import type { SimpleJourney } from "./services/Wagon";
import Header from "./components/Header.vue";

const journeys = ref<SimpleJourney[] | null>(null);

const nextDeparture = computed(() => journeys.value?.at(0)?.userStopDeparture);

onMounted(async () => {
  journeys.value = await nextTrainJourneys();
});
</script>

<template>
  <Time class="time"></Time>
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
  left: 7vh;
  z-index: 999;
}
</style>

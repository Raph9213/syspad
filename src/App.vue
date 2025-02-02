<script setup lang="ts">
import {
  computedAsync,
  promiseTimeout,
  useIntervalFn,
  useTimeout,
} from "@vueuse/core";
import { computed, onMounted, ref, watch } from "vue";
import Header from "./components/Header.vue";
import Stops from "./components/Stops.vue";
import Time from "./components/Time.vue";
import { nextTrainJourneys } from "./fetch";
import type { SimpleDeparture, SimpleJourney } from "./services/Wagon";

const journeys = ref<SimpleJourney[] | null>(null);

const nextDeparture = ref<SimpleDeparture | undefined>(undefined);

const lineLogo = computed(() => journeys.value?.at(0)?.line.numberShapeSvg);

const { ready: canAnimate, start: preventAnimation } = useTimeout(4000, {
  controls: true,
});

useIntervalFn(async () => {
  journeys.value = await nextTrainJourneys();
}, 20 * 1000);

onMounted(async () => {
  journeys.value = await nextTrainJourneys();
});

watch(
  () => journeys.value?.at(0)?.userStopDeparture,
  async (departure) => {
    preventAnimation();
    await promiseTimeout(1500);
    nextDeparture.value = departure;
  }
);
</script>

<template>
  <Time class="time"></Time>
  <div class="logo" v-if="lineLogo" v-html="lineLogo"></div>
  <template v-if="nextDeparture">
    <Header
      :can-animate="canAnimate"
      class="header"
      :departure="nextDeparture"
    ></Header>
    <Stops
      :can-animate="canAnimate"
      v-if="journeys"
      :journeys="journeys"
    ></Stops>
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

<script setup lang="ts">
import { promiseTimeout, useIntervalFn, useTimeout } from "@vueuse/core";
import { computed, onMounted, ref, watch } from "vue";
import Header from "./components/Header.vue";
import Stops from "./components/Stops.vue";
import Time from "./components/Time.vue";
import { nextTrainJourneys } from "./fetch";
import type { SimpleDeparture, SimpleJourney } from "./services/Wagon";
import RepairScreen from "./components/RepairScreen.vue";

const journeys = ref<SimpleJourney[] | null>(null);

const nextDeparture = ref<SimpleDeparture | undefined>(undefined);

const params = ref<{
  currentStopId: string;
  lineId: string;
  terminusPosition: { lat: number; lon: number } | undefined;
} | null>(null);

const lineLogo = computed(() => journeys.value?.at(0)?.line.numberShapeSvg);

const { ready: canAnimate, start: preventAnimation } = useTimeout(4000, {
  controls: true,
});

async function updateJourneys() {
  if (params.value === null) return;

  journeys.value = await nextTrainJourneys(
    params.value.currentStopId,
    params.value.lineId,
    params.value.terminusPosition,
    journeys.value || []
  );
}

useIntervalFn(async () => {
  await updateJourneys();
}, 61 * 1000);

onMounted(async () => {
  setTimeout(() => {
    window.location.reload();
  }, 1000 * 60 * 60 * 18);

  const urlParams = new URLSearchParams(window.location.search);
  const terminusPosition = urlParams.get("to")?.split(",").map(parseFloat);

  params.value = {
    currentStopId: urlParams.get("from") ?? "",
    lineId: urlParams.get("route") ?? "",
    terminusPosition: terminusPosition
      ? { lat: terminusPosition[0], lon: terminusPosition[1] }
      : undefined,
  };

  await updateJourneys();
});

watch(
  () => journeys.value?.at(0)?.stops.reduce((acc, stop) => acc + stop.id, ""),
  async () => {
    preventAnimation();
    await promiseTimeout(1500);
    nextDeparture.value = journeys.value?.at(0)?.userStopDeparture;
  }
);
</script>

<template>
  <template v-if="lineLogo">
    <Time class="time"></Time>
    <div class="logo" v-html="lineLogo"></div>
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
  <RepairScreen v-else></RepairScreen>
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

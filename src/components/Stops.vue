<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import type { SimpleJourney, SimpleStop } from "../services/Wagon";
import { Graph } from "../app/Graph";
import AnimatedPath from "./AnimatedPath.vue";
import { promiseTimeout } from "@vueuse/core";
import { getFixedPosition } from "../layout";

const props = defineProps<{
  journeys: SimpleJourney[];
  start: SimpleStop["id"];
}>();

const paths = ref<
  {
    points: { x: number; y: number }[];
    isAnimated: boolean;
    isInactive: boolean;
  }[]
>([]);

const stops = computed<Graph<SimpleStop>>(() => {
  const graph = new Graph<SimpleStop>((x) => x.id);

  for (const journey of props.journeys) {
    graph.add(journey.stops);
  }

  return graph;
});

const line = computed(() => props.journeys.at(0)?.line);

watch(
  () => props.journeys.at(0)?.userStopDeparture.id,
  async () => {
    await promiseTimeout(1000);
    const _paths = [];

    for (const journey of props.journeys) {
      const points = journey.stops.map((stop) => {
        const element = document.getElementById(stop.id);
        if (!element) {
          return { x: 0, y: 0 };
        }

        return getFixedPosition(element);
      });

      _paths.push({
        points,
        isAnimated: true,
        isInactive: false,
      });
    }

    paths.value = _paths;
  },
  { immediate: true }
);
</script>

<template>
  <div class="paths">
    <AnimatedPath
      :points="path.points"
      :color="line?.backgroundColor ?? '000000'"
      :is-animated="i === 0"
      :is-inactive="false"
      v-for="(path, i) in paths"
    ></AnimatedPath>
  </div>
  <div class="groups">
    <div class="stops" v-for="group in stops.groupedTopologicalSort()">
      <div class="stop" v-for="stop in group">
        <span class="label" aria-hidden="true" style="visibility: hidden">{{
          stop.name
        }}</span>
        <span class="label decorative">{{ stop.name }}</span>
        <div :id="stop.id"></div>
        <div class="dot"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.groups {
  transform: translateY(-10%);
  position: relative;
  padding: 2vh 0;
  display: flex;
  /* gap: 3.6vw; */
  height: 100vh;
  width: calc(100vw - 20vh);
  justify-content: space-between;
  z-index: 99;
}

.stops {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.stop {
  position: relative;
}

.stop:only-child {
  margin: auto 0;
}

.dot {
  width: 4.5vh;
  height: 4.5vh;
  background-color: white;
  border-radius: 50%;
  margin: 0 auto;
  transform: translateY(-50%);
}

.stop .label {
  transform-origin: left;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  height: 40vh;
  font-size: 5vh;
  font-weight: bold;
  color: var(--title-color);
}

.stop .label.decorative {
  top: 100%;
  left: 0;
  position: absolute;
  transform-origin: top;
  transform: translateY(-12vh) rotate(240deg);
}
</style>

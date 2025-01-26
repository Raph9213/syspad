<script lang="ts" setup>
import { promiseTimeout } from "@vueuse/core";
import { computed, ref, watch } from "vue";
import { Graph } from "../app/Graph";
import { getFixedPosition } from "../layout";
import type { SimpleJourney, SimpleStop } from "../services/Wagon";
import AnimatedPath from "./AnimatedPath.vue";

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

const nextDesservedStops = computed(() => {
  const stops = new Set<SimpleStop["id"]>();

  for (const stop of props.journeys.at(0)?.stops ?? []) {
    stops.add(stop.id);
  }

  return stops;
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
  <div
    class="groups"
    :style="{ '--line-color': '#' + (line?.backgroundColor ?? '000000') }"
  >
    <div class="stops" v-for="(group, i) in stops.groupedTopologicalSort()">
      <div
        class="stop"
        v-for="stop in group"
        :class="{
          active: nextDesservedStops.has(stop.id),
          hidden: i === 0,
          origin: stop.id === nextDesservedStops.values().next().value,
          terminus: stop.id === [...nextDesservedStops.values()].at(-1),
        }"
        :style="{
          '--animation-delay': `${
            nextDesservedStops.has(stop.id)
              ? i * 0.3 + 1
              : (nextDesservedStops.size ?? 0) * 0.3 + 2.5
          }s`,
          '--group-count': group.length,
          '--position': i,
        }"
      >
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
  padding-left: 8vh;
  display: flex;
  /* gap: 3.6vw; */
  height: 100vh;
  width: calc(100vw - 32vh);
  justify-content: space-between;
  z-index: 99;
}

.stops {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: -10vh;
}

.stop {
  position: relative;
  animation: stopAppear 0.4s ease-out var(--animation-delay) forwards;
  opacity: 0;
}

.stop:only-child {
  margin: auto 0;
}

.dot {
  position: relative;
  width: 4.5vh;
  height: 4.5vh;
  background-color: white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
}

.stop.active.terminus .dot {
  background-color: var(--line-color);
}

.stop .label {
  --label-font-size: 5vh;
  transform-origin: left;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-size: var(--label-font-size);
  height: 40vh;
  font-weight: bold;
  color: var(--title-color);
}

.stop:not(:first-child) {
  margin-top: calc(-10vh * var(--position));
}

.stop.hidden:not(.active) {
  visibility: hidden;
}

.stop.active.origin .label.decorative,
.stop.active.terminus .label.decorative {
  border-radius: 999px;
  z-index: 1;
}

.stop.active.origin .label.decorative {
  background-color: var(--title-color);
  color: white;
  box-shadow: 0 0 0 1vh var(--title-color);
}

.stop.active.terminus .label.decorative {
  background-color: white;
  box-shadow: 0 0 0 1vh white;
}

@keyframes stopAppear {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes labelAppear {
  from {
    scale: 1.1;
  }
  to {
    scale: 1;
  }
}

.stop .label.decorative {
  top: 100%;
  left: 0;
  position: absolute;
  transform-origin: top;
  transform: translateY(-12vh) translateX(-4vh) rotate(240deg);
  animation: labelAppear 0.4s ease-out var(--animation-delay);
}

.stop:not(.active) .label {
  opacity: 0.7;
}
</style>

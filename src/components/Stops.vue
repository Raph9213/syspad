<script lang="ts" setup>
import { promiseTimeout, useIntervalFn } from "@vueuse/core";
import { computed, ref, watch } from "vue";
import { Graph } from "../app/Graph";
import { getFixedPosition } from "../layout";
import type { SimpleJourney, SimpleStop } from "../services/Wagon";
import AnimatedPath from "./AnimatedPath.vue";
import StopName from "./StopName.vue";
import { isInParis } from "../geo";

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

const stopsInParis = computed(() => {
  return props.journeys.at(0)?.stops.filter((stop) => isInParis(stop)) || [];
});

const someStopsOutOfScreen = ref(false);

function checkIfSomeStopsAreOutOfScreen() {
  for (const journey of props.journeys) {
    for (const stop of journey.stops) {
      const element = document.getElementById(stop.id);
      if (!element) {
        continue;
      }

      const { x, y } = getFixedPosition(element);

      if (x < 0 || x > window.innerWidth || y < 0 || y > window.innerHeight) {
        someStopsOutOfScreen.value = true;
        return;
      }
    }
  }

  someStopsOutOfScreen.value = false;
}

const nextDesservedStops = computed(() => {
  const stops = new Set<SimpleStop["id"]>();

  for (const stop of props.journeys.at(0)?.stops ?? []) {
    stops.add(stop.id);
  }

  return stops;
});

function isStopHidden(
  floor: SimpleStop[],
  i: number,
  stop: SimpleStop
): boolean {
  if (someStopsOutOfScreen.value === false) {
    return false;
  }

  return i !== floor.length - 1 && !nextDesservedStops.value.has(stop.id);
}

const line = computed(() => props.journeys.at(0)?.line);

function meanLatitude(stops: SimpleStop[]): number {
  return stops.reduce((acc, stop) => acc + stop.position.lat, 0) / stops.length;
}

function northToSouth(a: SimpleStop[], b: SimpleStop[]): number {
  return meanLatitude(b) - meanLatitude(a);
}

function updatePaths() {
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
}

const parisCirclePosition = ref({ xLeft: "0vh", xRight: "0vh", y: "0vh" });

function updateParisCirclePosition() {
  const [first, last] = [stopsInParis.value.at(0), stopsInParis.value.at(-1)];

  function _getFixedPosition(stop: SimpleStop) {
    const element = document.getElementById(stop.id);
    if (!element) {
      return { x: 0, y: 0 };
    }

    return getFixedPosition(element);
  }

  const firstStopIsInParis =
    first?.id === nextDesservedStops.value.values().next().value;

  parisCirclePosition.value = {
    xLeft:
      first && !firstStopIsInParis
        ? _getFixedPosition(first).x + "px"
        : "-20vh",
    xRight: last ? _getFixedPosition(last).x + "px" : "-20vh",
    y: last ? _getFixedPosition(last).y + "px" : "50vh",
  };
}

watch(
  () => props.journeys.at(0)?.stops.at(-1)?.id,
  async () => {
    await promiseTimeout(1000);
    updatePaths();
    checkIfSomeStopsAreOutOfScreen();
    updateParisCirclePosition();
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
    v-if="stopsInParis.length > 0"
    class="circle"
    :style="{
      '--top': parisCirclePosition.y,
      '--left': parisCirclePosition.xLeft,
      '--right': parisCirclePosition.xRight,
    }"
  >
    <span>Paris</span>
  </div>
  <div
    class="groups"
    :class="{ compact: someStopsOutOfScreen }"
    :style="{ '--line-color': '#' + (line?.backgroundColor ?? '000000') }"
  >
    <div class="floors" v-for="(group, i) in stops.groupedTopologicalPaths">
      <div
        class="floor"
        v-for="(floor, j) in group.sort(northToSouth)"
        :style="{
          gap: 12 / group.length + 'vh',
        }"
      >
        <div
          class="stop"
          v-for="(stop, k) in floor"
          :class="{
            active: nextDesservedStops.has(stop.id),
            hidden: i === 0,
            origin: stop.id === nextDesservedStops.values().next().value,
            terminus: stop.id === [...nextDesservedStops.values()].at(-1),
          }"
          :style="{
            '--animation-delay': `${
              nextDesservedStops.has(stop.id)
                ? [...nextDesservedStops.values()].indexOf(stop.id) *
                    (7.5 / nextDesservedStops.size) +
                  0.5
                : 9
            }s`,
            '--group-count': group.length,
            '--position': i,
          }"
        >
          <StopName
            :compact="isStopHidden(floor, k, stop)"
            class="label"
            :char-limit="16"
            :name="stop.name"
            :is-inactive="!nextDesservedStops.has(stop.id)"
          ></StopName>
          <div class="anchor" :id="stop.id"></div>
          <div class="dot"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.groups {
  padding-top: 25vh;
  /* transform: translateY(-10%); */
  position: relative;
  padding-left: 8vh;
  display: flex;
  gap: 40vh;
  height: 70vh;
  max-width: calc(100vw - 32vh);
  width: fit-content;
  justify-content: space-between;
  z-index: 99;
}

.floors {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.floors:not(.compact):first-child {
  min-width: 120vh;
}

.floor:only-child {
  margin: auto 0;
}

.floor {
  display: flex;
  justify-content: space-between;
}

/* .stop:last-child:not(:first-child) .anchor {
  position: absolute;
  right: 0;
} */

.floors:last-child .floor {
  justify-content: start;
}

.stop {
  position: relative;
  animation: stopAppear 2s ease-out var(--animation-delay) forwards;
  opacity: 0;
}

@keyframes stopAppear {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.stop .label {
  animation: labelAppear 1s ease-out var(--animation-delay) forwards;
}

@keyframes labelAppear {
  from {
    scale: 1.1;
  }
  to {
    scale: 1;
  }
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

.stop.hidden:not(.active) {
  visibility: hidden;
}

.stop:not(.active) .dot {
  opacity: 0.5;
}

.circle {
  position: fixed;
  display: grid;
  place-items: center;
  top: var(--top);
  left: var(--left);
  right: calc(100vw - var(--right));
  height: calc(var(--right) - var(--left));
  transform: translateY(-50%) scale(1.2);
  background: linear-gradient(to bottom, #f0ebe9, #dcd7d6);
  border-radius: 9999px;
  z-index: -1;
}

.circle span {
  text-transform: uppercase;
  font-size: 5vh;
  margin-top: 30vh;
  color: var(--gray);
}
</style>

<script lang="ts" setup>
import { promiseTimeout } from "@vueuse/core";
import { computed, ref, watch } from "vue";
import { Graph } from "../app/Graph";
import { getFixedPosition } from "../layout";
import type { SimpleJourney, SimpleStop } from "../services/Wagon";
import AnimatedPath from "./AnimatedPath.vue";
import StopName from "./StopName.vue";

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

function meanLatitude(stops: SimpleStop[]): number {
  return stops.reduce((acc, stop) => acc + stop.position.lat, 0) / stops.length;
}

function northToSouth(a: SimpleStop[], b: SimpleStop[]): number {
  return meanLatitude(b) - meanLatitude(a);
}

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
    <div class="floors" v-for="(group, i) in stops.groupedTopologicalPaths">
      <div class="floor" v-for="(floor, j) in group.sort(northToSouth)">
        <div
          class="stop"
          v-for="stop in floor"
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
          <StopName
            :char-limit="35 / group.length"
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
  padding-top: 15vh;
  /* transform: translateY(-10%); */
  position: relative;
  padding-left: 8vh;
  display: flex;
  gap: 25vh;
  height: 75vh;
  width: calc(100vw - 32vh);
  justify-content: space-between;
  z-index: 99;
}

.floors {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.floor:only-child {
  margin: auto 0;
}

.floor {
  display: flex;
  gap: 5vh;
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

.stop.hidden:not(.active) {
  visibility: hidden;
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

.stop:not(.active) .dot {
  opacity: 0.5;
}
</style>

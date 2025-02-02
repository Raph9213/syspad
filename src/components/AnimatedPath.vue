<script lang="ts" setup>
import { useTimeout, useWindowSize } from "@vueuse/core";
import { computed, ref, watch } from "vue";
import { Colors } from "../colors";

const props = defineProps<{
  points: { x: number; y: number }[];
  /** Color in HEX format without # */
  color: string;
  isAnimated: boolean;
  /** Path with gray background used when stops are not desserved */
  isInactive: boolean;
  canAnimate: boolean;
}>();

const { width, height } = useWindowSize();
const id = ref(window.crypto.randomUUID());

const { ready: firstAnimationFinished, start: startFirstAnimation } =
  useTimeout(7500, { controls: true });

const mainPath = ref<SVGPathElement | null>(null);

const pathLength = computed(() => {
  if (!mainPath.value) {
    return 0;
  }

  return mainPath.value.getTotalLength();
});

const path = computed(() => {
  const offsetX = height.value / 13.5;

  const d = props.points.flatMap((point, i) => {
    const command = i === 0 ? "M" : "L";
    const prevPoint = props.points[i - 1];
    const nextPoint = props.points[i + 1];

    // Ajoute un offsetX leading seulement si le précédent point a un Y différent
    const leading =
      prevPoint && prevPoint.y !== point.y
        ? `${command} ${point.x - offsetX} ${point.y}`
        : null;

    const middle = `${command} ${point.x} ${point.y}`;

    // Ajoute un offsetX trailing seulement si le prochain point a un Y différent
    const trailing =
      nextPoint && nextPoint.y !== point.y
        ? `L ${point.x + offsetX} ${point.y}`
        : null;

    if (i === 0) {
      return [middle, trailing].filter(Boolean);
    }

    if (i === props.points.length - 1) {
      return [leading, middle].filter(Boolean);
    }

    return [leading, middle, trailing].filter(Boolean);
  });

  return d.join(" ");
});

const primaryColor = computed(() => `#${props.color}`);

const secondaryColor = computed(() => {
  return Colors.mix(primaryColor.value, "FFFFFF", 0.5);
});

const tertiaryColor = computed(() => {
  return Colors.mix(primaryColor.value, "FFFFFF", 0.75);
});

watch(
  () => props.canAnimate,
  (canAnimate) => {
    if (canAnimate) {
      startFirstAnimation();
    }
  }
);
</script>

<template>
  <svg
    :class="{ animated: isAnimated }"
    :width="width"
    :height="height"
    :style="{ zIndex: props.isAnimated ? 3 : 0, '--path-length': pathLength }"
  >
    <path
      :d="path"
      fill="none"
      :stroke="props.isAnimated ? primaryColor : tertiaryColor"
      stroke-width="6vh"
      stroke-linecap="round"
      stroke-linejoin="round"
      ref="mainPath"
    ></path>
  </svg>

  <svg
    v-if="isAnimated && !firstAnimationFinished"
    :width="width"
    :height="height"
    style="z-index: 2"
  >
    <path
      :d="path"
      fill="none"
      :stroke="tertiaryColor"
      stroke-width="6vh"
      stroke-linecap="round"
      stroke-linejoin="round"
      ref="mainPath"
    ></path>
  </svg>

  <svg
    v-if="isAnimated && firstAnimationFinished"
    class="gradient"
    :width="width"
    :height="height"
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="`0 0 ${width} ${height}`"
    fill="none"
  >
    <defs>
      <linearGradient :id="id" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop :stop-color="secondaryColor" offset="0%" />
        <stop :stop-color="primaryColor" offset="100%" />
      </linearGradient>
    </defs>
    <path
      :d="path"
      :stroke="`url(#${id})`"
      stroke-width="6vh"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>

  <svg
    v-if="isAnimated && firstAnimationFinished"
    class="gradientBackground"
    :width="width"
    :height="height"
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="`0 0 ${width} ${height}`"
    fill="none"
  >
    <path
      :d="path"
      :stroke="secondaryColor"
      stroke-width="6vh"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<style scoped>
svg {
  position: fixed;
  top: 0;
  left: 0;
}

svg.animated path {
  stroke-dasharray: var(--path-length);
  stroke-dashoffset: var(--path-length);
  animation: draw 10s linear infinite;
}

@keyframes draw {
  0% {
    opacity: 1;
    stroke-dashoffset: var(--path-length);
  }

  75% {
    opacity: 1;
    stroke-dashoffset: 0;
  }

  100% {
    opacity: 0;
    stroke-dashoffset: 0;
  }
}

svg.gradient {
  z-index: 2;
}

svg.gradientBackground {
  z-index: 1;
}

svg.gradient path {
  animation: fadeOut 10s linear 2.5s infinite;
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  75% {
    opacity: 0;
  }
}
</style>

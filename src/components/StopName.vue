<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps<{
  name: string;
  charLimit: number;
  isInactive: boolean;
  compact: boolean;
}>();

const lines = computed(() => {
  const words = props.name.split(" ");
  let currentLine = "";
  const result = [];

  words.forEach((word) => {
    if (currentLine.length + word.length + 1 > props.charLimit) {
      result.push(currentLine.trim());
      currentLine = word;
    } else {
      currentLine += " " + word;
    }
  });

  if (currentLine.length > 0) {
    result.push(currentLine.trim());
  }

  if (result.at(0) === "") {
    result.shift();
  }

  return result;
});

const formattedName = computed(() => {
  return lines.value.reduce(
    (prev, curr, i) => prev + "\n" + " ".repeat(6).repeat(i) + curr,
    ""
  );
});

const width = computed(() => {
  if (props.compact) {
    return 0;
  }

  const longestLineCharCount = Math.max(
    ...lines.value.map((line) => line.length)
  );
  const linesCount = lines.value.length;

  return longestLineCharCount * 0.1 + linesCount * 7;
});
</script>

<template>
  <div
    :class="{ inactive: isInactive, labelHidden: compact }"
    :style="{
      width: width + 'vh',
    }"
  >
    <span>{{ formattedName }}</span>
  </div>
</template>

<style scoped>
div {
  display: flex;
  flex-direction: column;
  height: 20vh;
}

span {
  white-space: pre;
  display: block;
  transform: translateY(9vh) translateX(-3vh) rotate(-30deg);
  transform-origin: top left;
  font-size: 5vh;
  font-weight: bold;
  color: var(--title-color);
  line-height: 4vh;
}

.labelHidden span {
  display: none;
}

.inactive span {
  color: #cfcaca;
}
</style>

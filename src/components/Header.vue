<script lang="ts" setup>
import { useIntervalFn } from "@vueuse/core";
import dayjs from "dayjs";
import { ref } from "vue";
import type { SimpleDeparture } from "../services/Wagon";

const props = defineProps<{
  departure: SimpleDeparture;
}>();

const remainingMinutes = ref(-1);

useIntervalFn(() => {
  remainingMinutes.value = props.departure.leavesAt.diff(dayjs(), "minute");
}, 1000);
</script>

<template>
  <div class="header">
    <div class="box">
      <div class="text">
        <span>Terminus</span>
        <h1>{{ departure.destination }}</h1>
      </div>
      <div class="minutes">
        <span>{{ remainingMinutes }}</span>
        <label>min</label>
      </div>
    </div>
    <div class="journeyCode" v-if="departure.journeyCode">
      <span>{{ departure.journeyCode }}</span>
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  flex-direction: column;
}

.box {
  display: flex;
}

.text {
  padding: 2vh 6vh;
  display: flex;
  flex-direction: column;
  background-color: white;
}

.text span {
  font-size: 4vh;
  color: var(--gray);
}

h1 {
  padding: 0;
  margin: 0;
  font-size: 9vh;
  color: var(--title-color);
  min-width: 40vh;
}

.minutes {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: black;
  width: 20vh;
  color: var(--time-color, yellow);
  border-radius: 0 1vh 1vh 0;
}

.minutes span {
  font-size: 10vh;
}

.minutes label {
  margin-top: -1vh;
  font-size: 4vh;
  opacity: 0.7;
}

.journeyCode {
  margin-left: 12vh;
  padding: 1.4vh 4vh;
  background-color: var(--gray);
  color: white;
  width: fit-content;
  font-size: 4vh;
  border-radius: 0 0 1vh 1vh;
}
</style>

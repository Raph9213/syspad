<script setup lang="ts">
import { onMounted, ref } from "vue";
import Stops from "./components/Stops.vue";
import { nextTrainJourneys } from "./fetch";
import type { SimpleJourney } from "./services/Wagon";

const journeys = ref<SimpleJourney[] | null>(null);

onMounted(async () => {
  journeys.value = await nextTrainJourneys();
});
</script>

<template>
  <Stops v-if="journeys" :journeys="journeys"></Stops>
</template>

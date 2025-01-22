<script setup lang="ts">
import { ref, onMounted } from "vue";
import HelloWorld from "./components/HelloWorld.vue";
import { nextTrainGraph } from "./fetch";

const data = ref([]);

onMounted(async () => {
  const graph = await nextTrainGraph();
  console.log(
    graph
      .groupedTopologicalSort()
      .map((group) => group.map((stop) => stop.name))
  );
  data.value = graph.groupedTopologicalSort();
});
</script>

<template>
  <div class="groups">
    <div class="stops" v-for="group in data">
      <div v-for="stop in group">
        <span>{{ stop.name }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.groups {
  display: flex;
  gap: 56px;
  height: 300px;
}

.stops {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>

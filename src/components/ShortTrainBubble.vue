<script lang="ts" setup>
const props = defineProps<{
  walkTo: "right" | "left";
}>();
</script>

<template>
  <div class="group">
    <section :class="{ reversed: props.walkTo === 'left' }">
      <svg
        class="arrows"
        width="155"
        height="140"
        viewBox="0 0 155 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9 9L71.5 71.5L11.5 131.5" stroke="black" stroke-width="23" />
        <path
          d="M76 9L138.5 71.5L78.5 131.5"
          stroke="black"
          stroke-width="23"
        />
      </svg>
      <svg
        class="human"
        width="135"
        height="238"
        viewBox="0 0 135 238"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Group 189">
          <g id="legLeft">
            <path
              id="a"
              d="M69.5 132L14 219"
              stroke="#FFDA3A"
              stroke-width="28"
              stroke-linecap="round"
            />
            <path
              id="a_2"
              d="M69.5 132L14 219"
              stroke="black"
              stroke-width="23"
              stroke-linecap="round"
            />
          </g>
          <g id="legRight">
            <path
              id="a_3"
              d="M76.5 132L116.5 223.5"
              stroke="#FFDA3A"
              stroke-width="28"
              stroke-linecap="round"
            />
            <path
              id="a_4"
              d="M76.5 132L116.5 223.5"
              stroke="black"
              stroke-width="23"
              stroke-linecap="round"
            />
          </g>
          <g id="armLeft">
            <path
              id="a_5"
              d="M78 51.5L49.5 88L45.5 136"
              stroke="#FFDA3A"
              stroke-width="28"
              stroke-linecap="round"
            />
            <path
              id="a_6"
              d="M78 51.5L49.5 88L45.5 136"
              stroke="black"
              stroke-width="23"
              stroke-linecap="round"
            />
          </g>
          <g id="armRight">
            <path
              id="a_7"
              d="M78 51.5L87.5 97L120.5 136.5"
              stroke="#FFDA3A"
              stroke-width="28"
              stroke-linecap="round"
            />
            <path
              id="a_8"
              d="M78 51.5L87.5 97L120.5 136.5"
              stroke="black"
              stroke-width="23"
              stroke-linecap="round"
            />
          </g>
          <ellipse id="head" cx="75" cy="18" rx="22" ry="18" fill="black" />
          <path
            id="chest"
            d="M72 140L76 53.5"
            stroke="black"
            stroke-width="23"
            stroke-linecap="round"
          />
        </g>
      </svg>
      <svg
        class="train"
        width="472"
        height="315"
        viewBox="0 0 472 315"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M471.501 0H74.001C46.5008 0 15.7071 33.7205 5.00093 166C-2.00002 252.5 0.227982 273.5 5.00093 296C5.84947 300 9.49998 313 20.5 314.5H471.501V213.322C471.134 213.738 470.598 214 470 214H285C283.895 214 283 213.105 283 212V81.0005C283 79.8959 283.895 79.0005 285 79.0005H470C470.598 79.0005 471.134 79.2628 471.501 79.6787V0ZM37.5 31.0005L27.5 53.5005C29.3333 54.0005 33.9 53.6005 37.5 48.0005C41.1 42.4005 39 34.3338 37.5 31.0005ZM59 60.5005H31.3689C29.2766 60.5005 27.3198 61.5579 26.4822 63.4752C18.0709 82.7297 13.6767 140.165 12.2476 172.795C12.0989 176.19 14.8204 179 18.2181 179H59C62.3137 179 65 176.314 65 173V66.5005C65 63.1867 62.3137 60.5005 59 60.5005ZM22.5 199C12.6262 199.022 10.8584 212.193 12 222C12.9644 230.286 15.1606 239.809 23.5 240C32.4115 240.205 34.4279 228.914 34.5 220C34.5763 210.555 31.9455 198.979 22.5 199ZM4.49998 227.5V254.5C7.66664 253.834 14 250.5 14 242.5C14 234.5 8.99998 227.5 4.49998 227.5ZM95 79.0005C91.134 79.0005 88 82.1345 88 86.0005V207C88 210.866 91.134 214 95 214H115C118.866 214 122 210.866 122 207V86.0005C122 82.1345 118.866 79.0005 115 79.0005H95ZM145 81.0005C145 79.8959 145.895 79.0005 147 79.0005H276C277.105 79.0005 278 79.8959 278 81.0005V212C278 213.105 277.105 214 276 214H147C145.895 214 145 213.105 145 212V81.0005Z"
          fill="black"
        />
      </svg>
      <div class="platform"></div>
    </section>
    <div class="text" :class="walkTo">
      <h1>Train court</h1>
      <ul>
        <li>Short train</li>
        <li>Kurzzüge</li>
        <li>Tren corto</li>
        <li>Treno corto</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
section {
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  width: 100vh;
  padding: 20vh;
  border-radius: 50%;
  background-color: var(--warning-color);
  animation: scaleBounce 5s infinite ease;
  overflow: hidden;
}

section.reversed {
  scale: -1 1;
}

@keyframes scaleBounce {
  0% {
    width: 100vh;
    height: 100vh;
    transform: translate(0);
  }
  50% {
    width: 110vh;
    height: 110vh;
    transform: translate(-5vh, -5vh);
  }
  100% {
    width: 100vh;
    height: 100vh;
    transform: translate(0);
  }
}

.group {
  animation: fade 15s infinite ease;
}

@keyframes fade {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  80% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}

.text {
  position: fixed;
  top: 7vh;
}

.text.right {
  left: 120vh;
  transform: translateX(-50%);
}

.text.left {
  right: 120vh;
  transform: translateX(50%);
}

h1 {
  margin: 0;
  font-weight: normal;
  font-size: 10vh;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  font-style: italic;
  opacity: 0.5;
  column-gap: 6vh;
  width: fit-content;
}

li {
  width: fit-content;
}

.platform {
  position: absolute;
  top: calc(50% + 40vh);
  width: 200vh;
  height: 100vh;
  background-color: black;
}

.train {
  height: 47vh;
  position: absolute;
  left: 40%;
  top: calc(50% - 6vh);
  animation: trainMove 7s infinite ease;
}

@keyframes trainMove {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  50% {
    transform: translateX(60vh);
    opacity: 1;
  }
  52% {
    transform: translateX(60vh);
    opacity: 0;
  }
  60% {
    transform: translateX(0vh);
    opacity: 0;
  }
  70% {
    transform: translateX(0);
    opacity: 1;
  }
}

.arrows {
  opacity: 0.4;
  position: absolute;
  left: calc(50% - 30vh);
  top: calc(50% + 5vh);
  height: 26vh;
}

.arrows path:first-child {
  animation: arrowBounce 3s infinite ease;
}

.arrows path:last-child {
  animation: arrowBounce 3s infinite ease 0.1s;
}

@keyframes arrowBounce {
  0% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-8vh);
  }
  40% {
    transform: translateX(-8vh);
  }
  60% {
    transform: translateX(0);
  }
}

.human {
  position: absolute;
  left: calc(50% - 30vh);
  top: calc(50% + 8vh);
  height: 35vh;
}

.human #legLeft {
  transform-origin: 40% 60%;
  animation: legLeft 1.4s infinite ease;
}

@keyframes legLeft {
  0% {
    transform: rotate(-42deg);
  }
  40% {
    transform: rotate(10deg);
  }
  50% {
    transform: rotate(10deg);
  }
  90% {
    transform: rotate(-42deg);
  }
  100% {
    transform: rotate(-42deg);
  }
}

.human #legRight {
  transform-origin: 40% 60%;
  animation: legRight 1.4s infinite ease;
  animation-delay: 1.5s;
}

@keyframes legRight {
  0% {
    transform: rotate(42deg);
  }
  40% {
    transform: rotate(-10deg);
  }
  50% {
    transform: rotate(-10deg);
  }
  90% {
    transform: rotate(42deg);
  }
  100% {
    transform: rotate(42deg);
  }
}

.human #armLeft {
  transform-origin: 60% 20%;
  animation: armLeft 1.4s infinite ease;
  animation-delay: 0s;
}

@keyframes armLeft {
  0% {
    transform: rotate(-42deg);
  }
  40% {
    transform: rotate(10deg);
  }
  50% {
    transform: rotate(10deg);
  }
  90% {
    transform: rotate(-42deg);
  }
  100% {
    transform: rotate(-42deg);
  }
}

.human #armRight {
  transform-origin: 50% 20%;
  animation: armRight 1.4s infinite ease;
  animation-delay: 0s;
}

@keyframes armRight {
  0% {
    transform: rotate(42deg);
  }
  40% {
    transform: rotate(-10deg);
  }
  50% {
    transform: rotate(-10deg);
  }
  90% {
    transform: rotate(42deg);
  }
  100% {
    transform: rotate(42deg);
  }
}

.human {
  animation: humanMove 7s infinite 4s linear;
}

@keyframes humanMove {
  0% {
    transform: translateX(-30vh);
    opacity: 1;
  }
  50% {
    transform: translateX(40vh);
    opacity: 1;
  }
  52% {
    transform: translateX(40vh);
    opacity: 0;
  }
  100% {
    transform: translateX(-30vh);
    opacity: 0;
  }
}
</style>

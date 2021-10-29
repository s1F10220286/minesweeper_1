<template>
	<Setting @generate-event="onclick" />
	<Board :generate="generate" :width="scale.width" :height="scale.height" :mines="scale.mines"/>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import setting from "./setting.vue";
import board from "./board.vue";
import { BoardScale } from "../ts/constants";

export default defineComponent({
	components: {
		Setting: setting,
		Board: board,
	},
	setup() {
		type nullableScale = {
			width?: number;
			height?: number;
			mines?: number;
		};
		const scale = reactive<nullableScale>({
			width:undefined,
			height:undefined,
			mines:undefined,
		});

		const generate = ref(0);
		
		const onclick = (...args: number[]) => {
			const [width, height, mines] = [...args];
			scale.width = width;
			scale.height = height;
			scale.mines = mines;
			generate.value++;
		};

		return {
			scale,
			generate,
			onclick,
		};
	},
});
</script>
<template>
	<div :class="Classes.Setting">
		<label>
			<a>難易度</a>
			<select v-model="level" @change="onLevelChange">
				<option
					v-for="level of Object.values(Level)"
					:key="level"
					:value="level"
				>
					{{ level }}
					<template v-if="BoardTemplate[level]">
						:{{ BoardTemplate[level].width }}×{{
							BoardTemplate[level].height
						}}({{ BoardTemplate[level].mines }})
					</template>
				</option>
			</select>
		</label>
		<label>
			<a>横幅</a
			><input
				type="number"
				min="0"
				v-model.number="width"
				@change="onScaleChange"
			/>
		</label>
		<label>
			<a>縦幅</a
			><input
				type="number"
				min="0"
				v-model.number="height"
				@change="onScaleChange"
			/>
		</label>
		<label>
			<a>地雷数</a
			><input
				type="number"
				min="0"
				v-model.number="mines"
				@change="onScaleChange"
			/>
		</label>
		<input type="button" value="生成" @click="generate" />
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRef } from "vue";
import { Classes, Level, BoardTemplate, BoardScale } from "../ts/constants";

export default defineComponent({
	setup(props, context) {
		const defaultLevel = Level.Beginner;
		const defalutScale = BoardTemplate[defaultLevel];
		const width = ref(defalutScale.width);
		const height = ref(defalutScale.height);
		const mines = ref(defalutScale.mines);

		const level = ref(defaultLevel);

		const generate = () => {
			context.emit("generate-event",width.value,height.value,mines.value);
		};

		const onLevelChange = () => {
			const selectedLevel = level.value;
			if (selectedLevel === Level.Custom) {
				return;
			}
			const scale = BoardTemplate[selectedLevel];
			width.value = scale.width;
			height.value = scale.height;
			mines.value = scale.mines;
		};

		const onScaleChange = () => {
			level.value = Level.Custom;
		};

		return {
			level,
			width,
			height,
			mines,
			Classes,
			Level,
			BoardTemplate,
			generate,
			onLevelChange,
			onScaleChange,
		};
	},
});
</script>

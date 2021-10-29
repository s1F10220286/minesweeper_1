<template>
	<table v-if="board.value !== undefined" :meta-dummy="dummy">
		<tr v-for="i of range(0, board.value.height)" :key="i">
			<td
				v-for="index of range(i * board.value.width, board.value.width)"
				:key="index"
			>
				<button
					:meta-dummy="dummy"
					@click.left="onClick(index)"
					@contextmenu="onContextmenu(index, $event)"
					:disabled="board.value?.at(index).status === MineStatus.Opened"
				>
					{{ board.value[index]?.displayString }}
				</button>
			</td>
		</tr>
	</table>
</template>


<script lang="ts">
import { defineComponent, reactive, ref, watchEffect,watch } from "vue";
import { Board, MineStatus, OpenResult } from "../ts/mineSweeper";
import { range } from "../ts/util";
import swal from "sweetalert";

export default defineComponent({
	props: {
		width: {
			type: Number,
			required: false,
		},
		height: {
			type: Number,
			required: false,
		},
		mines: {
			type: Number,
			required: false,
		},
		generate: {
			type: Number,
			required: true,
		},
	},
	setup(props) {
		type nullableBoard = {
			value?: Board;
		};

		const dummy = ref(0); //boradを弄っても更新されないので更新用のダミー
		const board = reactive<nullableBoard>({
			value: undefined,
		});

		const refreshBoard = () => {
			if (props.width && props.height && props.mines) {
				const b = Board.generate(props.width, props.height, props.mines);
				if (b instanceof Error) {
					swal(`${b.message}\n再度生成してください`, "", "error");
				} else {
					board.value = b;
				}
			}
		};
		watch(()=>props.generate, () => {
			refreshBoard();
		});

		const onClick = (index: number) => {
			if (!board.value) {
				return;
			}
			const result = board.value.open(index);
			if (result === OpenResult.Bombed) {
				swal(result);
			}
			if (board.value.isCleard()) {
				swal("Clear!");
			}
			board.value[0];
			dummy.value++;
		};
		const onContextmenu = (index: number, e: Event) => {
			if (!board.value) {
				return;
			}
			dummy.value++;
			board.value.toggleFlag(index);
			e.preventDefault();
		};

		return {
			dummy,
			MineStatus,
			board,
			onContextmenu,
			onClick,
			range,
		};
	},
});
</script>

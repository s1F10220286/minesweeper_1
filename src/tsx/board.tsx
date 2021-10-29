import React, { Component,useState } from "react";
import swal from "sweetalert";
import * as Mine from "../ts/mineSweeper";
import { range } from "../ts/util";

type BoardProp = {};

type BoardState = {
	board?: Mine.Board;
};

export class Board extends Component<BoardProp, BoardState> {
	constructor(prop: BoardProp) {
		super(prop);
		this.state = {
			board: undefined,
		};
	}

	public generateBoard = (
		width: number,
		height: number,
		mines: number
	) => {
		const borad = Mine.Board.generate(width, height, mines);
		if (borad instanceof Error) {
			swal(`${borad.message}\n再度生成してください`, "", "error");
			return;
		}

		this.setState({ board: borad });
	};

	render = () => {
		const board = this.state.board;
		if (board === undefined) {
			return <></>;
		}
		const width = board.width;
		const height = board.height;

		return (
			<table>
				{range(0, height).map(i => (
					<tr>
						{range(i * width, width).map(index => (
							<td>
								<button
									onClick={() => {
										const result = board.open(index);
										this.setState({ board: board });
										if (result === Mine.OpenResult.Bombed) {
											swal(result);
										}
										if (board.isCleard()) {
											swal("Clear!");
										}
									}}
									onContextMenu={e => {
										board.toggleFlag(index);
										this.setState({ board: board });
										e.preventDefault();
									}}
									disabled={board[index].status === Mine.MineStatus.Opened}
								>
									{board[index].displayString}
								</button>
							</td>
						))}
					</tr>
				))}
			</table>
		);
	};
}

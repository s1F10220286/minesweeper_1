import { MatrixArray, Index } from "./matrixArray";
import { shuffle } from "./util";

export const MineStatus = {
	Closed: "Closed",
	Opened: "Opened",
	Flaged: "Flaged",
} as const;
export type MineStatus = typeof MineStatus[keyof typeof MineStatus];

export const OpenResult = {
	Done: "Done",
	Bombed: "Bombed",
	Unaltered: "Unaltered"
} as const;
export type OpenResult = typeof OpenResult[keyof typeof OpenResult];

export class Cell {
	public status: MineStatus;

	constructor(
		public readonly hasMine: boolean,
		public readonly adjacentMines: number
	) {
		this.status = MineStatus.Closed;
	}

	public get displayString() {
		switch (this.status) {
			case MineStatus.Opened:
				if (this.hasMine) {
					return "💣";
				} else {
					return this.adjacentMines > 0 ? this.adjacentMines.toString() : " ";
				}
			case MineStatus.Flaged:
				return "🚩";
			case MineStatus.Closed:
				return " ";
		}
	}

	public open = () => {
		if (this.status !== MineStatus.Closed) {
			return OpenResult.Unaltered;
		}

		this.status = MineStatus.Opened;

		const result = this.hasMine ? OpenResult.Bombed : OpenResult.Done;
		return result;
	};

	public toggleFlag = () => {
		if (this.status === MineStatus.Opened) {
			return;
		}

		this.status =
			this.status === MineStatus.Flaged ? MineStatus.Closed : MineStatus.Flaged;
	};
}

export class Board extends MatrixArray<Cell> {
	private constructor(
		width: number,
		height: number,
		public readonly mines: number
	) {
		super(width, height);
		this.isLaying = false;
	}

	private isLaying: boolean;

	public static readonly leastEmptyCells = 9;

	public static validGenerateArgs = (
		width: number,
		height: number,
		mines: number
	) => {
		const nums = [width, height, mines];
		const isNaN = nums.some(n => Number.isNaN(n));
		const isNegativeOr0 = nums.some(n => n < 1);

		const isExcessedMine = width * height - Board.leastEmptyCells < mines;

		const errorMessage = isNaN
			? "いずれかの値が未入力です"
			: isNegativeOr0
			? "いずれかの値が0以下です"
			: isExcessedMine
			? `地雷数が多すぎます(最低でも${Board.leastEmptyCells}つは空白にしてください)`
			: undefined;
		if (errorMessage) {
			return new Error(errorMessage);
		} else {
			return true;
		}
	};

	public static generate = (width: number, height: number, mines: number) => {
		const validArgs = Board.validGenerateArgs(width, height, mines);
		if (validArgs instanceof Error) {
			return validArgs;
		}

		const board = new Board(width, height, mines);
		const dummyCell = new Cell(false, 0);
		board.fill(dummyCell);

		return board;
	};

	private layMines = (excludeIndex: number) => {
		if (this.isLaying) {
			return;
		}

		const temp = [...Array(this.length).keys()].map(i => i < this.mines);
		const tempMatrix = MatrixArray.fromArray<boolean>(
			temp,
			this.width,
			this.height
		);

		const execludeIndexes = [
			excludeIndex,
			...this.adjacentIndexes(excludeIndex),
		];
		const somneoneHasMine = () => execludeIndexes.some(i => tempMatrix[i]);

		do {
			shuffle(tempMatrix);
		} while (somneoneHasMine());

		for (let i = 0; i < this.length; i++) {
			const adjacentMines = tempMatrix.adjacents(i).filter(b => b).length;

			this[i] = new Cell(tempMatrix[i], adjacentMines);
		}

		this.isLaying = true;
	};

	public open: Index<OpenResult> = (x: number, y?: number) => {
		const index = this.index(x, y);
		if (!this.isLaying) {
			this.layMines(index);
		}

		const cell = this[index];
		const result = cell.open();

		if (result === OpenResult.Done && cell.adjacentMines === 0) {
			const adjacentIndexes = this.adjacentIndexes(index);
			for (const i of adjacentIndexes) {
				this.open(i);
			}
		}

		return result;
	};

	public isCleard = () =>{
		for (const cell of this) {
			if(!cell.hasMine && cell.status === MineStatus.Closed){
				return false;
			}
		}
		return true;
	};

	public toggleFlag: Index<void> = (x: number, y?: number) => {
		if (!this.isLaying) {
			const index = y === undefined ? x : this.index(x, y);
			this.layMines(index);
		}
		const cell = this.at(x, y);
		cell.toggleFlag();
	};
}

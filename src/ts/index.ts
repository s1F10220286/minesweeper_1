import { Board, MineStatus, OpenResult } from "./mineSweeper";
import { Classes, Level, BoardTemplate } from "./constants";
import swal from "sweetalert";

const appTable = () => {
	const app = document.getElementById("app");
	if (!app) {
		return new Error("HTMLエラーです。\nページを更新してください");
	}
	let table = app.getElementsByTagName("table").item(0);
	if (!table) {
		table = document.createElement("table");
		app.appendChild(table);
	}

	return table;
};

const indexedButtons = () => {
	const array = [];

	const table = appTable();
	if (table instanceof Error) {
		return table;
	}

	const rows = table.getElementsByTagName("tr");

	for (let y = 0; y < rows.length; y++) {
		const row = rows[y];
		const columns = row.getElementsByTagName("td");

		for (let x = 0; x < columns.length; x++) {
			const button = columns[x].getElementsByTagName("button")[0];
			const indexedButtons = {
				x,
				y,
				button
			};
			array.push(indexedButtons);
		}
	}
	return array;
};

const fillBoard = (
	width: number,
	height: number,
	mines: number
) => {
	const table = appTable();
	if (table instanceof Error) {
		swal(table.message, "", "error");
		return;
	}

	const handleError = (msg: string) => {
		swal(`${msg}\n再度生成してください`, "", "error")
		.then(() => (table.innerHTML = ""))
		.catch(e=>console.log(e))
		;
	};
	const board = Board.generate(width, height, mines);
	if (board instanceof Error) {
		handleError(board.message);
		return;
	}

	const buttons = indexedButtons();
	if (buttons instanceof Error) {
		handleError(buttons.message);
		return;
	}

	const updateButtons = () => {
		for (const indexedButton of buttons) {
			const cell = board.at(indexedButton.x, indexedButton.y);
			const button = indexedButton.button;

			button.textContent = cell.displayString;
			const disabled = cell.status === MineStatus.Opened;
			button.disabled = disabled;
		}
	};

	for (const indexedButton of buttons) {
		const x = indexedButton.x;
		const y = indexedButton.y;
		const button = indexedButton.button;
		const index = board.index(x, y);

		button.onclick = () => {
			const result = board.open(index);
			updateButtons();
			if (result === OpenResult.Bombed) {
				swal(result);
			}
			if(board.isCleard()){
				swal("Clear!");
			}
		};
		button.oncontextmenu = () => {
			board.toggleFlag(index);
			updateButtons();
			return false;
		};
	}
};

const generateEmptyBoard = (width: number, height: number, mines: number) => {
	const table = appTable();
	if (table instanceof Error) {
		swal(table.message, "", "error");
		return;
	}
	table.innerHTML = "";

	for (let y = 0; y < height; y++) {
		const tr = document.createElement("tr");
		for (let x = 0; x < width; x++) {
			const td = document.createElement("td");
			const button = document.createElement("button");
			td.appendChild(button);

			button.onclick = () => {
				fillBoard(width, height, mines);
				button.click();
			};
			button.oncontextmenu = () => {
				fillBoard(width, height, mines);
				button.oncontextmenu?.(new MouseEvent(""));
				return false;
			};

			tr.appendChild(td);
		}
		table.appendChild(tr);
	}
};

const createSetting = () => {
	const setting = document.createElement("div");
	setting.classList.add(Classes.Setting);
	const addElement = (tagName: string, labelText: string) => {
		const element = document.createElement(tagName);

		const label = document.createElement("label");
		const labelTextNode = document.createElement("a");
		labelTextNode.textContent = labelText;
		label.appendChild(labelTextNode);
		label.appendChild(element);

		setting.appendChild(label);

		return element;
	};
	const addInput = (type: string, labelText: string) => {
		const input = addElement("input", labelText) as HTMLInputElement;
		input.type = type;
		input.min = "0";

		return input;
	};

	const selectBoardType = addElement("select", "難易度") as HTMLSelectElement;
	const inputWidth = addInput("number", "横幅");
	const inputHeight = addInput("number", "縦幅");
	const inputMines = addInput("number", "地雷数");

	const buttonGenerate = document.createElement("input");
	buttonGenerate.type = "button";
	buttonGenerate.value = "生成";
	setting.appendChild(buttonGenerate);

	for (const level of Object.values(Level)) {
		const option = document.createElement("option");
		option.value = level;
		option.textContent = level;
		const scale = BoardTemplate[level];
		if (scale) {
			option.textContent += `:${scale.width}×${scale.height}(${scale.mines})`;
		}
		selectBoardType.appendChild(option);
	}
	selectBoardType.onchange = () => {
		const level = selectBoardType.value;
		if (level === Level.Custom) {
			return;
		}

		const scale = BoardTemplate[level];
		if (!scale) {
			selectBoardType.value = Level.Custom;
			return;
		}

		inputWidth.valueAsNumber = scale.width;
		inputHeight.valueAsNumber = scale.height;
		inputMines.valueAsNumber = scale.mines;
	};
	selectBoardType.onchange(new Event(""));

	const inputs = [inputWidth, inputHeight, inputMines];
	for (const input of inputs) {
		input.onchange = () => (selectBoardType.value = Level.Custom);
	}

	buttonGenerate.onclick = () => {
		const width = inputWidth.valueAsNumber;
		const height = inputHeight.valueAsNumber;
		const mines = inputMines.valueAsNumber;

		const validArgs = Board.validGenerateArgs(width, height, mines);
		if (validArgs instanceof Error) {
			swal(`${validArgs.message}`, "", "error");
			return;
		}

		generateEmptyBoard(width, height, mines);
	};

	return setting;
};

export const render = () => {
	const app = document.getElementById("app");
	const setting = createSetting();
	app?.appendChild(setting);
	
};

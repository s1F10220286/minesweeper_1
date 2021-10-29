import React, { Component } from "react";
import { Classes, Level, BoardTemplate, BoardScale } from "../ts/constants";

type SettingProp = {
	generate:()=>void,
};
type SettingState = BoardScale;

const Labeled: React.FC<{ label: string }> = prop => (
	<label>
		<a>{prop.label}</a>
		{prop.children}
	</label>
);

export class Setting extends Component<SettingProp, SettingState> {
	constructor(prop: SettingProp) {
		super(prop);
		const defaultLevel = Level.Beginner;
		const scale = BoardTemplate[defaultLevel];
		this.state = scale;
	}

	render = () => {
	
		const selectBoardTypeRef = React.createRef<HTMLSelectElement>();
		const changeLevelToCustom = () => {
			const selectBoardType = selectBoardTypeRef.current;
			if (selectBoardType) {
				selectBoardType.value = Level.Custom;
			}
		};

		const onBoardTypechange = (e: React.FormEvent<HTMLSelectElement>) => {
			const level = e.currentTarget.value;
			if (level === Level.Custom) {
				return;
			}

			const scale = BoardTemplate[level];
			if (!scale) {
				e.currentTarget.value = Level.Custom;
				return;
			}
			this.setState(scale);
		};

		return (
			<div className={Classes.Setting}>
				<Labeled label="難易度">
					<select ref={selectBoardTypeRef} onChange={onBoardTypechange}>
						{
							Object.values(Level).map(l => {
								const scale = BoardTemplate[l];
								let text = l;
								if (scale) {
									text += `:${scale.width}×${scale.height}(${scale.mines})`;
								}
								return <option value={l}>{text}</option>;
							})
						}
					</select>
				</Labeled>
				<Labeled label="横幅">
					<input
						onChange={(e: React.FormEvent<HTMLInputElement>) => {
							this.setState({ width: Number(e.currentTarget.value) });
							changeLevelToCustom();
						}}
						value={this.state.width}
						type="number"
						min="0"
					/>
				</Labeled>
				<Labeled label="縦幅">
					<input
						onChange={(e: React.FormEvent<HTMLInputElement>) => {
							this.setState({ height: Number(e.currentTarget.value) });
							changeLevelToCustom();
						}}
						value={this.state.height}
						type="number"
						min="0"
					/>
				</Labeled>
				<Labeled label="地雷数">
					<input
						onChange={(e: React.FormEvent<HTMLInputElement>) => {
							this.setState({ mines: Number(e.currentTarget.value) });
							changeLevelToCustom();
						}}
						value={this.state.mines}
						type="number"
						min="0"
					/>
				</Labeled>
				<input type="button" value="生成" onClick={this.props.generate} />
			</div>
		);
	};
}

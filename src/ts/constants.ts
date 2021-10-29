export const Classes = {
	Setting: "setting"
} as const;

export type Classes = typeof Classes[keyof typeof Classes];

export const Level = {
	Beginner: "Beginner",
	Advanced: "Advanced",
	Difficult: "Difficult",
	Expert: "Expert",
	Challenge: "Challenge",
	Custom: "Custom"
};
export type Level = typeof Level[keyof typeof Level];

export interface BoardScale {
	width: number;
	height: number;
	mines: number;
}
export const BoardTemplate: { [key: string]: BoardScale } = {};
BoardTemplate[Level.Beginner] = { width: 10, height: 10, mines: 15 };
BoardTemplate[Level.Advanced] = { width: 16, height: 16, mines: 50 };
BoardTemplate[Level.Difficult] = { width: 30, height: 30, mines: 225 };
BoardTemplate[Level.Expert] = { width: 50, height: 50, mines: 850 };
BoardTemplate[Level.Challenge] = { width: 100, height: 100, mines: 4000 };

export const isLevel =(str:string):str is Level =>Object.values(Level).includes(str);

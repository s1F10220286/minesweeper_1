import { range } from "./util";

export type Index<T> = {
	(index: number): T;
	(x: number, y: number): T;
	(x: number, y?: number): T;
};

export class MatrixArray<T> extends Array<T>{

	public constructor(public readonly width: number, public readonly height: number) {
		super(width * height);
	}

	public static fromArray<T>(array:T[],width:number,height:number){
		const length = Math.min(array.length,width*height);
		const matrix = new MatrixArray<T>(width,height);

		for(let i = 0;i<length;i++){
			matrix[i] = array[i];
		}
		
		return matrix;
	}
	
	public index:Index<number> = (x: number, y?: number) =>{
		const index = y === undefined ? x : y * this.width + x;
		return index;
	} 
	public indexes:Index<{x:number,y:number}> = (x: number, y?: number) => {
		if(y !== undefined){
			return {x:x,y:y};
		}

		const index = x;
		const indexed = {
			x:index % this.width,
			y:Math.floor(index / this.width)

		};
		return indexed;
	};

	public at: Index<T> = (x: number, y?: number) => {
		const index = this.index(x,y);
		return this[index];
	};

	public adjacentIndexes:Index<number[]> = (x: number, y?: number) => {
		const indexes = this.indexes(x,y);
		
		const adjacentIndexes = range(indexes.x - 1, 3)
			.map(i => range(indexes.y - 1, 3).map(j => ({ x: i, y: j })))
			.flat()
			.filter(
				a =>
					0 <= a.x &&
					a.x < this.width &&
					0 <= a.y &&
					a.y < this.height &&
					!(a.x === indexes.x && a.y === indexes.y)
			)
			.map(a=>this.index(a.x,a.y));

		return adjacentIndexes;
	}

	public adjacents: Index<T[]> = (x: number, y?: number) => {
		const adjacents = this.adjacentIndexes(x,y)
			.map(i=>this[i]);
		return adjacents;
	};
}

export type Coord = [ number, number, ] 
export type Edge = [ Coord, Coord, ]
export type Edges = [ Edge, Edge, Edge, Edge, ]

export class Rectangle {
	height: number
	width: number
	x: number
	y: number
	isPlaced: boolean

	constructor (height: number, width: number, x: number, y: number) {
		this.height = height
		this.width = width
		this.x = x
		this.y = y
		this.isPlaced = false
	}

	getEdges(): Edges{
		const top: Edge = [ [this.x, this.y], [ this.x + this.width, this.y, ], ]
		const bottom: Edge = [ [this.x, this.y + this.height], [ this.x + this.width, this.y + this.height, ], ]

		const left: Edge = [ [ this.x, this.y], [ this.x, this.y + this.height, ], ]
		const right: Edge = [ [ this.x + this.width, this.y ], [ this.x + this.width, this.y + this.height, ], ]

		return [ top, right, bottom, left, ] // like a clock
	}

	public move(e: MouseEvent) {
		this.x = e.offsetX - this.width / 2
		this.y = e.offsetY - this.height / 2
	}

	public place() {
		this.isPlaced = true
	}
}
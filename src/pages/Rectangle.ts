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

	public move(e: MouseEvent) {
		this.x = e.offsetX - this.width / 2
		this.y = e.offsetY - this.height / 2
	}

	public place() {
		this.isPlaced = true
	}
}
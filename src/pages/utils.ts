import { HEIGHT, WIDTH } from './Board'
import { Rectangle } from './Rectangle'

export const drawRect = (rect: Rectangle, ctx: CanvasRenderingContext2D, color: 'blue' | 'red') => {
	ctx.fillStyle = color
	ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
}

export const drawBoundingBox = (rects: Rectangle[], ctx: CanvasRenderingContext2D): void => {
	const minX = Math.min(...rects.map(rect => rect.x))
	const maxX = Math.max(...rects.map(rect => rect.x + rect.width))
	const minY = Math.min(...rects.map(rect => rect.y))
	const maxY = Math.max(...rects.map(rect => rect.y + rect.height))

	ctx.beginPath()
	ctx.moveTo(minX, minY)
	ctx.lineTo(maxX, minY)
	ctx.lineTo(maxX, maxY)
	ctx.lineTo(minX, maxY)
	ctx.lineTo(minX, minY)

	console.log(minX, minY, maxX, maxY)

	ctx.stroke()
}

export const spawnRect = (): Rectangle => {
	const width = Math.floor(Math.random() * 100) + 5
	const height = Math.floor(Math.random() * 100) + 5

	const rectangle = new Rectangle(height, width, 0, 0)

	return rectangle
}

export const overlap = (rectA: Rectangle, rectB: Rectangle) => {
	const rightBorderA = rectA.x + rectA.width
	const bottomBorderA = rectA.y + rectA.height
	const leftBorderA = rectA.x
	const topBorderA = rectA.y

	const rightBorderB = rectB.x + rectB.width
	const bottomBorderB = rectB.y + rectB.height
	const leftBorderB = rectB.x
	const topBorderB = rectB.y

	const overlapsX = rightBorderA > leftBorderB && rightBorderB > leftBorderA
	const overlapsY = bottomBorderA > topBorderB && bottomBorderB > topBorderA

	return overlapsY && overlapsX
} 

export const collision = (rect: Rectangle, otherRectangles: Rectangle[]): boolean => {
	console.log('checking colission between', rect, 'and', otherRectangles)
	if (otherRectangles.length === 0){
		return false
	}

	return otherRectangles.map(otherRect => overlap(rect, otherRect)).indexOf(true) === -1 ? false : true
}

export const doesHover = (rect: Rectangle, ctx: CanvasRenderingContext2D, e: MouseEvent) => {
	if (rect.isPlaced) {
		return false
	}

	const mousePosX = e.offsetX
	const mousePosY = e.offsetY

	const overlapsX = mousePosX > rect.x && mousePosX < rect.x + rect.width
	const overlapsY = mousePosY > rect.y && mousePosY < rect.y + rect.height

	if (overlapsX && overlapsY) {
		return true
	}

	return false
}

export const draw = (rects: Rectangle[], ctx: CanvasRenderingContext2D) => {
	ctx.clearRect(0, 0, WIDTH, HEIGHT)
	drawBoundingBox(rects, ctx)

	rects.forEach((rect, i) => drawRect(rect, ctx, i === rects.length - 1 ? 'red' : 'blue'))
}
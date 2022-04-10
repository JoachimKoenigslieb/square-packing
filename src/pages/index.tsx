import { Container } from '@mui/material'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import './index.css'

const MyContainer = styled(Container)`
	height: 500px;
`

type ICanvas = {}

const MyStyledCanvas = styled.canvas`
	border: 1px solid black;
`

const WIDTH = 500
const HEIGHT = 500


const innerCanvas = (props: ICanvas, ref: React.ForwardedRef<HTMLCanvasElement>) => {
	return <MyStyledCanvas width={WIDTH} height={HEIGHT} ref={ref}/>
}
class Rectangle {
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

const Canvas = React.forwardRef<HTMLCanvasElement>(innerCanvas)

const drawRect = (rect: Rectangle, ctx: CanvasRenderingContext2D, color: 'blue' | 'red') => {
	ctx.fillStyle = color
	ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
}

const moveRect = (rect: Rectangle, ctx: CanvasRenderingContext2D, e: MouseEvent) => {
	// ctx.clearRect(rect.x, rect.y, rect.width, rect.height)
	rect.move(e)
	// ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
}

const placeRect = (rect: Rectangle, ctx: CanvasRenderingContext2D) => {
	ctx.clearRect(rect.x, rect.y, rect.width, rect.height)
	rect.place()
	ctx.fillStyle = 'red'
	ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
}

const spawnRect = (): Rectangle => {
	const width = Math.floor(Math.random() * 100)
	const height = Math.floor(Math.random() * 100)

	const rectangle = new Rectangle(height, width, 0, 0)

	return rectangle
}

const doesHover = (rect: Rectangle, ctx: CanvasRenderingContext2D, e: MouseEvent) => {
	if (rect.isPlaced) {
		return false
	}

	const mousePosX = e.offsetX
	const mousePosY = e.offsetY

	const overlapsX = mousePosX > rect.x && mousePosX < rect.x + rect.width
	const overlapsY = mousePosY > rect.y && mousePosY < rect.y + rect.height

	// console.log(
	// 	'mouse is at (', mousePosX, ', ', mousePosY, ').', 
	// 	'rect is at', 'x:', rect.x, 'to', rect.x + rect.width, 'y:', rect.y, 'to', rect.y + rect.height,
	// 	'overlaps x?', overlapsX,
	// 	'overlaps Y', overlapsY,
	// )

	if (overlapsX && overlapsY) {
		return true
	}

	return false
}

const draw = (rects: Rectangle[], ctx: CanvasRenderingContext2D) => {
	ctx.clearRect(0, 0, WIDTH, HEIGHT)

	rects.forEach((rect, i) => drawRect(rect, ctx, i === 0 ? 'red' : 'blue'))
}


const useSetupCanvas = (ref: React.RefObject<HTMLCanvasElement>): void => {
	const dragRef = useRef<boolean>(false)

	let settableRect = new Rectangle(230, 90, 0, 0)

	const rectangles: Rectangle[] = []

	const [, setRender, ] = useState(0)

	useLayoutEffect(() => {
		if (ref.current === null) {
			return
		}
	
		const canvas = ref.current
		const ctx = canvas.getContext('2d')
		
		if (ctx === null) {
			return
		}
		
		draw([settableRect], ctx)
		const canvasClassName = canvas.className

		canvas.addEventListener('mouseup', e => {
			const hovers = doesHover(settableRect, ctx, e)

			if (hovers) {
				placeRect(settableRect, ctx)

				rectangles.push(settableRect)
				settableRect = spawnRect()
				drawRect(settableRect, ctx, 'red')
				
				dragRef.current = false
			}
		})
	
		canvas.addEventListener('mousedown', e => {
			const hovers = doesHover(settableRect, ctx, e)
		
			if (hovers) {
				console.log('setting drag')
				dragRef.current = true
			}
		})

		canvas.addEventListener('mousemove', e => {
			const hovers = doesHover(settableRect, ctx, e)
	
			if (hovers) {
				canvas.className = `${canvasClassName} hovered`
			} else {
				canvas.className = canvasClassName
			}
		})

		canvas.addEventListener('mousemove', e => {
			console.log('is draggin?', dragRef.current)
			if (dragRef.current) {
				moveRect(settableRect, ctx, e)
				draw([settableRect, ...rectangles, ], ctx)
			}
		})
	}, [])
}

const IndexPage = () => {
	const ref = useRef<HTMLCanvasElement>(null)
	useSetupCanvas(ref)

	useLayoutEffect(() => {
		console.log(ref)
	}, [])

	return (
		<MyContainer maxWidth="lg">
			Board
			<Canvas ref={ref}/>
		</MyContainer>
	)
}

export default IndexPage

import { useEffect, useRef } from 'react'
import { useRectangles } from './Context'
import { Edge, Edges, Rectangle } from './Rectangle'
import { collision, doesHover, draw, spawnRect } from './utils'

const findEdgeMatches = (edges: Edges, rectangles: Rectangle[]) => {
	// check if close to any edges
	const YEdges: Edge[] = []
	const XEdges: Edge[] = []
	
	rectangles.forEach(rect => {
		const edges = rect.getEdges()
							
		YEdges.push(edges[0], edges[2])
		XEdges.push(edges[1], edges[3])
	})

	const errorMargin = 4 // error margin in pixels

	const topEdge = edges[0]
	const topY = topEdge[0][1]

	const rightEdge = edges[1]
	const rightX = rightEdge[0][0]

	const bottomEdge = edges[2]
	const bottomY = bottomEdge[0][1]

	const leftEdge = edges[3]
	const leftX = leftEdge[0][0]

	const matchesTop = YEdges.filter(edge => Math.abs(edge[0][1] - topY) < errorMargin)
	const matchesBottom = YEdges.filter(edge => Math.abs(edge[0][1] - bottomY) < errorMargin)
	const matchesRight = XEdges.filter(edge => Math.abs(edge[0][0] - rightX) < errorMargin)
	const matchesLeft = XEdges.filter(edge => Math.abs(edge[0][0] - leftX) < errorMargin)

	return [ ...matchesTop, ...matchesBottom, ...matchesRight, ...matchesLeft, ]
}


export const useSetupCanvas = (ref: React.RefObject<HTMLCanvasElement>): void => {
	const dragRef = useRef<boolean>(false)

	const { rectangles, setRectangles, } = useRectangles()
	const settableRect = spawnRect()

	useEffect(() => {
		if (ref.current === null) {
			return
		}
	
		const canvas = ref.current
		const ctx = canvas.getContext('2d')
		
		if (ctx === null) {
			return
		}
		
		draw(rectangles, [], settableRect, ctx)

		const canvasClassName = canvas.className.replace('hovered', '')

		const upHandler = (e: MouseEvent) => {
			const hovers = doesHover(settableRect, ctx, e)

			if (hovers && dragRef.current === true) {
				if (collision(settableRect, rectangles.slice(0, -1))) {
					alert('cant set there!')
				} else {
					setRectangles(rectangles => [...rectangles, settableRect, ])
					
					dragRef.current = false
				}
			}
		}

		const downHandler = (e: MouseEvent) => {
			const hovers = doesHover(settableRect, ctx, e)
		
			if (hovers) {
				dragRef.current = true
			}
		}

		const hoverHandler = (e: MouseEvent) => {
			const hovers = doesHover(settableRect, ctx, e)
	
			if (hovers) {
				canvas.className = `${canvasClassName} hovered`
			} else {
				canvas.className = canvasClassName
			}
		}

		const dragHandler = (e: MouseEvent) => {
			if (dragRef.current) {
				settableRect.move(e)

				const currentEdges = settableRect.getEdges()
				const edgeMatches = findEdgeMatches(currentEdges, rectangles)

				draw(rectangles, edgeMatches, settableRect, ctx)
			}
		}
		
		canvas.addEventListener('mouseup', upHandler)
		canvas.addEventListener('mousedown', downHandler)
		canvas.addEventListener('mousemove', hoverHandler)
		canvas.addEventListener('mousemove', dragHandler)

		return () => {
			canvas.removeEventListener('mouseup', upHandler)
			canvas.removeEventListener('mousedown', downHandler)
			canvas.removeEventListener('mousemove', hoverHandler)
			canvas.removeEventListener('mousemove', dragHandler)	
		}
	}, [ rectangles.length, ])
}
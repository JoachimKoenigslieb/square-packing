import { useEffect, useRef } from 'react'
import { useRectangles } from './Context'
import { Edge, Edges, Rectangle } from './Rectangle'
import { collision, doesHover, draw, spawnRect } from './utils'

const findEdgeMatches = (edges: Edges, rectangles: Rectangle[]) => {
	// check if close to any edges
	const topEdges: Edge[] = []
	const bottomEdges: Edge[] = []
	const rightEdges: Edge[] = []
	const leftEdges: Edge[] = []
	
	rectangles.forEach(rect => {
		const edges = rect.getEdges()
						
		topEdges.push(edges[0])
		rightEdges.push(edges[1])
		bottomEdges.push(edges[2])
		leftEdges.push(edges[3])
	})

	const errorMargin = 4 // error margin in pixels

	const topEdge = edges[0]
	const topY = topEdge[0][1]

	const matches = bottomEdges.filter(edge => Math.abs(edge[0][1] - topY) < errorMargin)

	return matches
}


export const useSetupCanvas = (ref: React.RefObject<HTMLCanvasElement>): void => {
	const dragRef = useRef<boolean>(false)

	const { rectangles, setRectangles, } = useRectangles()
	const settableRect = rectangles[rectangles.length - 1]

	useEffect(() => {
		if (ref.current === null) {
			return
		}
	
		const canvas = ref.current
		const ctx = canvas.getContext('2d')
		
		if (ctx === null) {
			return
		}

		if (!settableRect) {
			return
		}
		
		draw(rectangles, [], ctx)

		const canvasClassName = canvas.className.replace('hovered', '')

		const upHandler = (e: MouseEvent) => {
			if (!settableRect) {
				return
			}

			const hovers = doesHover(settableRect, ctx, e)

			if (hovers) {
				const nextRect = spawnRect()

				if (collision(settableRect, rectangles.slice(0, -1))) {
					alert('cant set there!')
				} else {
					setRectangles(rectangles => [...rectangles, nextRect, ])
					
					dragRef.current = false
				}
			}
		}

		const downHandler = (e: MouseEvent) => {
			if (!settableRect) {
				return
			}

			const hovers = doesHover(settableRect, ctx, e)
		
			if (hovers) {
				dragRef.current = true
			}
		}

		const hoverHandler = (e: MouseEvent) => {
			if (!settableRect) {
				return
			}

			const hovers = doesHover(settableRect, ctx, e)
	
			if (hovers) {
				canvas.className = `${canvasClassName} hovered`
			} else {
				canvas.className = canvasClassName
			}
		}

		const dragHandler = (e: MouseEvent) => {
			if (dragRef.current) {
				if (!settableRect) {
					return
				}

				settableRect.move(e)

				const currentEdges = settableRect.getEdges()
				const edgeMatches = findEdgeMatches(currentEdges, rectangles)

				draw(rectangles, edgeMatches, ctx)
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
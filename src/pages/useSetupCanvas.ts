import { useEffect, useRef } from 'react'
import { useRectangles } from './Context'
import { collision, doesHover, draw, spawnRect } from './utils'

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
		
		draw(rectangles, ctx)

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
				draw(rectangles, ctx)
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
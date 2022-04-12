import React, { useRef } from 'react'
import styled, { useTheme } from 'styled-components'
import { useSetupCanvas } from './useSetupCanvas'

const MyStyledCanvas = styled.canvas`
	border: 1px solid black;
`

const breakpoints = {
	xs: 0,
	sm: 600,
	md: 900,
	lg: 1200,
	xl: 1536
} as const
  
export const HEIGHT = 500
export const WIDTH = breakpoints.sm


interface CanvasProps {
	children?: React.ReactNode
}
const innerCanvas = (props: CanvasProps, ref: React.ForwardedRef<HTMLCanvasElement>) => {
	return <MyStyledCanvas width={WIDTH} height={HEIGHT} ref={ref}/>
}

const Canvas = React.forwardRef<HTMLCanvasElement>(innerCanvas)

const Board = (): JSX.Element => {
	const ref = useRef<HTMLCanvasElement>(null)
	useSetupCanvas(ref)

	return (
		<Canvas ref={ref}/>
	)
}

export default Board
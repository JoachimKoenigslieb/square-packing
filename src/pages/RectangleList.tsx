import { Grid } from '@mui/material'
import React from 'react'
import styled from 'styled-components'
import { useRectangles } from './Context'


const ItemContainer = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
`

const RectangleList = (): JSX.Element => {
	const { rectangles, } = useRectangles()
	
	return (
		<Grid container>
			{rectangles.map((rectangle, i) => {
				return (
					<Grid key={i} item container xs={12}>
						<ItemContainer>
							<div>
								x: {rectangle.x}
							</div>
							<div>
								y: {rectangle.y}
							</div>
							<div>
								width: {rectangle.width}
							</div>
							<div>
								height: {rectangle.height}
							</div>
						</ItemContainer>
					</Grid>
				)
			})}
		</Grid>
	)
}

export default RectangleList
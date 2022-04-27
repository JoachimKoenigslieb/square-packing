import { Container } from '@mui/material'
import React, { useState } from 'react'
import styled from 'styled-components'
import Board from './Board'
import { Context } from './Context'
import './index.css'
import { Rectangle } from './Rectangle'
import RectangleList from './RectangleList'
import { spawnRect } from './utils'

const MyContainer = styled(Container)`
`

const IndexPage = () => {
	const [ rectangles, setRectangles, ] = useState<Rectangle[]>([])

	return (
		<Context.Provider value={{ rectangles, setRectangles, }}>
			<MyContainer maxWidth="sm">
				<Board />
				<RectangleList />
			</MyContainer>
		</Context.Provider>
	)
}

export default IndexPage

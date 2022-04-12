import React, { useContext } from 'react'
import { Rectangle } from './Rectangle'

type Context = {
	rectangles: Rectangle[],
	setRectangles: React.Dispatch<React.SetStateAction<Rectangle[]>>
}

export const Context = React.createContext<Context>({} as Context)
export const useRectangles = () => useContext(Context)
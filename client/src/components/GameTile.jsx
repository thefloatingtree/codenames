import React, { useEffect, useState } from 'react'
import { Center, ScaleFade, useColorModeValue, useMediaQuery } from "@chakra-ui/react"
import { motion } from 'framer-motion'
import { TILE_BLUE_TEAM, TILE_BOMB, TILE_NO_TEAM, TILE_RED_TEAM } from '../shared/constants'
import { useDispatch } from 'react-redux'
import { redPoint, bluePoint } from '../redux/game/gameActions'

const MotionCenter = motion(Center)

const boxColors = {
    [TILE_NO_TEAM]: ["blackAlpha.200", "whiteAlpha.200"],
    [TILE_RED_TEAM]: ["red.300", "red.600"],
    [TILE_BLUE_TEAM]: ["blue.300", "blue.600"],
    [TILE_BOMB]: ["blackAlpha.600", "blackAlpha.900"],
}

export default function GameTile({ word, delay, type }) {

    const [shouldAppear, setShouldAppear] = useState(false)
    const [typeHidden, setTypeHidden] = useState(true)

    const [desktop] = useMediaQuery("(min-width: 769px)")
    const lightMode = useColorModeValue(true, false)

    const boxSize = desktop ? { w: "190px", h: "152px" } : { w: "76px", h: "57px" }
    const boxColor = typeHidden ? boxColors[TILE_NO_TEAM][+!lightMode] : boxColors[type][+!lightMode]

    const dispatch = useDispatch()

    useEffect(() => {
        const timer = setTimeout(() => setShouldAppear(true), delay)
        return () => clearTimeout(timer)
    }, [])

    const tileClicked = () =>{
        if(typeHidden){
            setTypeHidden(false);

            if(type === TILE_RED_TEAM)
                dispatch(redPoint())

            if(type === TILE_BLUE_TEAM)
                dispatch(bluePoint())
        }
    }

    return (
        <ScaleFade in={shouldAppear} initialScale={0.5}>
            <MotionCenter
                onClick={() => tileClicked()}
                w={boxSize.w}
                h={boxSize.h}
                _hover={{ cursor: "pointer" }}
                backgroundColor={boxColor}
                border="3px"
                borderColor="blue.500"
                borderRadius="md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}>
                <div style={{
                    userSelect: "none",
                    textTransform: "uppercase",
                    hyphens: "auto",
                    margin: "1em",
                    fontWeight: "bold"
                }}>{word}</div>
            </MotionCenter>
        </ScaleFade>
    )
}

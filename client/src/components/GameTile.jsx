// @ts-nocheck
import React, { useEffect, useState } from 'react'
import { Center, ScaleFade, useColorModeValue, useMediaQuery } from "@chakra-ui/react"
import { motion } from 'framer-motion'
import { TILE_BLUE_TEAM, TILE_BOMB, TILE_NO_TEAM, TILE_RED_TEAM, TILE_UNCLICKED } from '../shared/constants'
import { useDispatch, useSelector } from 'react-redux'
import { redPoint, bluePoint, bombPressed, changeTurns } from '../redux/game/gameActions'
import '../styles.css'

const MotionCenter = motion(Center)

const boxColors = {
    [TILE_UNCLICKED]: ["blackAlpha.200", "whiteAlpha.200"],
    [TILE_NO_TEAM]: ["blackAlpha.400", "whiteAlpha.500"],
    [TILE_RED_TEAM]: ["red.400", "red.600"],
    [TILE_BLUE_TEAM]: ["blue.400", "blue.600"],
    [TILE_BOMB]: ["blackAlpha.700", "blackAlpha.900"],
}

const boxColorsSM = {
    [TILE_UNCLICKED]: ["blackAlpha.200", "whiteAlpha.200"],
    [TILE_NO_TEAM]: ["blackAlpha.200", "whiteAlpha.800"],
    [TILE_RED_TEAM]: ["red.200", "red.300"],
    [TILE_BLUE_TEAM]: ["blue.200", "blue.300"],
    [TILE_BOMB]: ["blackAlpha.600", "blackAlpha.500"],
}

export default function GameTile({ word, delay, type, spymasterOn }) {

    const [shouldAppear, setShouldAppear] = useState(false)
    const [typeHidden, setTypeHidden] = useState(true)

    const [desktop] = useMediaQuery("(min-width: 769px)")
    const lightMode = useColorModeValue(true, false)

    const boxSize = desktop ? { w: "190px", h: "152px" } : { w: "76px", h: "57px" }
    const boxColor = typeHidden ? boxColors[TILE_UNCLICKED][+!lightMode] : boxColors[type][+!lightMode]
    const boxColorSM = typeHidden ? boxColorsSM[type][+!lightMode] : boxColors[type][+!lightMode]

    const gameWon = useSelector(state => state.game.gameWon)
    const turn = useSelector(state => state.game.turn);
    const dispatch = useDispatch()

    useEffect(() => {
        const timer = setTimeout(() => setShouldAppear(true), delay)
        return () => clearTimeout(timer)
    }, [])

    const tileClicked = () =>{
        if(!gameWon && !spymasterOn && typeHidden){
            setTypeHidden(false);

            if(type === TILE_RED_TEAM)
                dispatch(redPoint())

            if(type === TILE_BLUE_TEAM)
                dispatch(bluePoint())

            if(type === TILE_NO_TEAM)
                dispatch(changeTurns())

            if(type === TILE_BOMB)
                dispatch(bombPressed())
        }
    }

    return (
        <ScaleFade in={shouldAppear} initialScale={0.5}>
            <MotionCenter
                className="gameTile"
                onClick={() => tileClicked()}
                w={boxSize.w}
                h={boxSize.h}
                _hover={{ cursor: "pointer" }}
                backgroundColor={spymasterOn ? boxColorSM : boxColor}
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

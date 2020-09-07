import React from "react"
import styled, { keyframes } from "styled-components"

export default function ScaleIncreasing (points, maxPoints, background, color)  {
    const width = points / maxPoints * 100
    const increasing = keyframes`
        from {  width: 0%;  }
        to { width: ${width}%; }`

    const Scale = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50px;
    height: 100%;
    width: 0%;
    background: ${background};
    animation: ${increasing} 1s ease-out;
    animation-fill-mode: forwards;
    `

    return <Scale/>
}
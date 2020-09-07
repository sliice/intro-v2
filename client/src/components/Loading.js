import React from "react"
import styled, { keyframes } from "styled-components"

export const Loading = () => {
    const x = window.innerWidth / 2 - 100;
    const y = window.innerHeight / 2 - 100;

    const Loading = styled.div`
    display: block;
    position: fixed;
    top: ${y}px;
    left: ${x}px;
    width: 200px;
    height: 200px;
    //background: #000000;  
    `

    return (
        <Loading>
            <h1>Cекундочку...</h1>
        </Loading>
    )
}

export default Loading
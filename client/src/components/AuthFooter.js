import React from "react"
import './appearence/css/index.css'
import styled from "styled-components"

export const AuthFooter = () => {

    const footerY = window.innerHeight

    const Footer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 100%;
    height: 150px;
    top: ${footerY}px;
    background: #FFFFFF;
    box-shadow: inset 4px 4px 5px 0px rgba(181, 181, 181, 0.2),
    inset -4px 4px 20px 0px rgba(255, 255, 255, 0.3),
     -3px -3px 5px 0px rgba(181, 181, 181, 0.5),
     3px 3px 10px 0px rgba(255, 255, 255, 0.5);
     padding: 1% 0;
    `
    const P1 = styled.p`
    font-size: 14pt;
    font-family: Gill Sans, Gill Sans MT, Calibri, sans-serif;
    font-weight: normal;   
    color: #909F70;  
    margin: 0;
    `

    const P2 = styled.p`
    font-size: 12pt;
    font-family: Gill Sans, Gill Sans MT, Calibri, sans-serif;
    font-weight: normal;
    color: #4A4A4A;    
    margin: 0;
    `

    return (
        <Footer className = 'soft_appearing'>
            <P1>2020 © ak </P1>
            <P2>Остались вопросы? a.krylova.off@gmail.com</P2>
        </Footer>
    )
}

export default AuthFooter
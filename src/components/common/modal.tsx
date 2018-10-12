import styled from "styled-components"

import colors from "../../lib/colors"

import Text from "../common/text"

export const Modal = styled.div`
  background-color: white;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px 15px;
  box-shadow: 5px 10px 8px rgb(160, 160, 160);
  min-width: 400px;
  min-height: 600px;
  z-index: 10;
  box-sizing: border-box;
`

export const DimOverlay = styled.div`
  background-color: rgb(0, 0, 0);
  background-repeat: repeat;
  -webkit-filter: alpha(opacity=70);
  filter: alpha(opacity=70);
  height: 100%;
  left: 0px;
  -moz-opacity: 0.3;
  opacity: 0.3;
  position: fixed;
  top: 0px;
  width: 100%;
  z-index: 5;
`

export const ModalError = Text.s.extend`
  position: absolute;
  bottom: 0;
  width: 400px;
  left: 0;
  text-align: center;
  color: ${colors.red};
`

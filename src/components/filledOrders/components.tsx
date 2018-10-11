import styled from "styled-components"

import Button from "../common/button"
import colors from "../../lib/colors"

export const Divider = styled.div`
  height: 1px;
  width: 100%;
  margin: 0 auto;
  margin-top: 20px;
  margin-bottom: 20px;
  background-color: ${colors.grey};
`

export const AllocateButton = Button.m.extend`
  position: absolute;
  bottom: 20px;
  left: 200px;
  margin-left: -55px;
`

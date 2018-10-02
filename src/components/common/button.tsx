import styled from "styled-components"
import colors from "../../lib/colors"

interface Props {
  margin?: string
}

const M = styled.p`
  width: 110px;
  height: 35px;
  color: white;
  background-color: ${colors.blue};
  line-height: 35px;
  text-align: center;
  font-family: Source Sans Pro;
  cursor: pointer;
  border-radius: 5px;
  font-weight: 400;
  margin: ${(p: Props) => p.margin};
`

const Button = {
  m: M
}

export default Button

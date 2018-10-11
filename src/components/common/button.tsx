import styled from "styled-components"
import colors from "../../lib/colors"

interface Props {
  margin?: string
  white?: boolean
}

const M = styled.p`
  width: 110px;
  height: 35px;
  background-color: ${(p: Props) => (p.white ? "white" : colors.blue)};
  color: ${(p: Props) => (p.white ? colors.darkGrey : "white")};
  border: ${(p: Props) => `1px solid ${p.white ? colors.grey : colors.blue}`};
  box-sizing: border-box;
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

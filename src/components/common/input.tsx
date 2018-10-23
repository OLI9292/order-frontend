import styled from "styled-components"
import colors from "../../lib/colors"

interface Props {
  underline?: boolean
}

const M = styled.input`
  font-family: Source Sans Pro;
  outline: none;
  display: block;
  border: 0;
  border-bottom: ${(p: Props) => (p.underline ? "1px solid black" : "none")};
  box-sizing: border-box;
  font-size: 16px;
  font-weight: 300;
  color: ${colors.darkGrey};
  padding: 3px 0;
`

const Submit = M.extend`
  border: 1px solid ${colors.darkGrey};
  color: ${colors.darkGrey};
  padding: 5px;
  cursor: pointer;
  border-radius: 5px;
`

export default {
  m: M,
  submit: Submit
}

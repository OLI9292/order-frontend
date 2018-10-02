import styled from "styled-components"
import colors from "../../lib/colors"

const M = styled.input`
  font-family: Source Sans Pro;
  outline: none;
  display: block;
  border: none;
  box-sizing: border-box;
  font-size: 16px;
  font-weight: 300px;
  color: ${colors.darkGrey};
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

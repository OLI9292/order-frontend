import styled from "styled-components"

interface Props {
  color?: string
  hide?: boolean
}

const M = styled.p`
  color: ${(p: Props) => p.color};
  font-family: Source Sans Pro;
  visibility: ${(p: Props) => (p.hide ? "hidden" : "visible")};
`

const S = M.extend`
  font-size: 12px;
`

const Text = {
  m: M,
  s: S
}

export default Text

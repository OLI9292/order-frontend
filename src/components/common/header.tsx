import styled from "styled-components"

interface Props {
  margin?: string
  textAlign?: string
  color?: string
  cursor?: string
}

const R = styled.p`
  margin: ${(p: Props) => p.margin};
  text-align: ${(p: Props) => p.textAlign};
  color: ${(p: Props) => p.color};
  cursor: ${(p: Props) => p.cursor};
  font-family: Source Sans Pro;
  font-weight: 200;
  text-transform: Capitalize;
`

const M = R.extend`
  font-size: 3em;
`

const MS = R.extend`
  font-size: 1.75em;
`

const S = styled.h4`
  margin: ${(p: Props) => p.margin};
  text-align: ${(p: Props) => p.textAlign};
  color: ${(p: Props) => p.color};
  cursor: ${(p: Props) => p.cursor};
  font-family: Source Sans Pro;
  font-weight: 700;
`

const Header = {
  m: M,
  ms: MS,
  s: S
}

export default Header

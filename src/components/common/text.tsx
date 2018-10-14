import styled from "styled-components"

interface Props {
  color?: string
  hoverColor?: string
  hide?: boolean
  margin?: string
  height?: string
  lineHeight?: string
  textAlign?: string
  clickable?: boolean
  display?: string
}

const M = styled.p`
  color: ${(p: Props) => p.color};
  font-family: Source Sans Pro;
  visibility: ${(p: Props) => (p.hide ? "hidden" : "visible")};
  margin: ${(p: Props) => p.margin};
  display: ${(p: Props) => p.display};
  height: ${(p: Props) => p.height};
  line-height: ${(p: Props) => p.lineHeight};
  text-align: ${(p: Props) => p.textAlign};
  cursor: ${(p: Props) => p.clickable && "pointer"};
  &:hover {
    color: ${(p: Props) => p.hoverColor};
  }
`

const S = M.extend`
  font-size: 12px;
`

const Text = {
  m: M,
  s: S
}

export default Text

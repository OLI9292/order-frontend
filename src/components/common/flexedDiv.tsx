import styled from "styled-components"

interface Props {
  justifyContent?: string
  alignItems?: string
  margin?: string
  height?: string
}

export default styled.div`
  align-items: center;
  display: flex;
  justify-content: ${(p: Props) => p.justifyContent};
  align-items: ${(p: Props) => p.alignItems};
  margin: ${(p: Props) => p.margin};
  height: ${(p: Props) => p.height};
`

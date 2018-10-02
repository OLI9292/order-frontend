import styled from "styled-components"

interface Props {
  justifyContent?: string
  margin?: string
  height?: string
}

export default styled.div`
  align-items: center;
  display: flex;
  justify-content: ${(p: Props) => p.justifyContent};
  margin: ${(p: Props) => p.margin};
  height: ${(p: Props) => p.height};
`

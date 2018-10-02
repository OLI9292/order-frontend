import styled from "styled-components"

interface Props {
  isPlaying: boolean
}

export const OuterContainer = styled.div`
  text-align: left;
  max-width: 900px;
  margin: 0 auto;
  margin-top: 25px;
  margin-bottom: 25px;
  position: ${(p: Props) => (p.isPlaying ? "fixed" : "relative")};
  overflow: ${(p: Props) => p.isPlaying && "hidden"};
`

import styled from "styled-components"

import colors from "../../lib/colors"

export const Container = styled.div`
  height: 100vh;
  position: absolute;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100vw;
`

export const Form = styled.form`
  width: 300px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  height 150px;
  justify-content: space-between;
`

export const ErrorMessage = styled.p`
  color: ${colors.red};
  font-size: 0.85em;
`

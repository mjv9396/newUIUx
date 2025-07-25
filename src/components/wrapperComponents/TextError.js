import { Box, styled } from '@mui/material'

const ErrorDiv = styled(Box)({
  fontSize: "12px",
  color: "#f1416c",
  textAlign: "left",
})

function TextError(props) {
  return (
    <ErrorDiv >
      {props.children}
      </ErrorDiv>
  )
}

export default TextError
import { Button } from '@mui/material';
import { styled } from '@mui/material';
 
const StyledButton = styled(Button)`
  ${({ theme }) => `
  cursor: pointer;
  transition: ${theme.transitions.create(['background-color', 'transform'], {
    duration: theme.transitions.duration.standard,
  })};
  &:hover {
    transform: scale(1.03);
  }
  `}
`;
 
function MuiButton(props) {
    const {label, ...rest} = props;
    return (
        <StyledButton
            {...rest}
            variant={props.variant? props.variant: "contained"}
            color={props.color? props.color: "primary"}
            fullWidth = {props.fullWidth ? props.fullWidth : false}
            disabled = {props.disabled ? props.disabled : false}
            type = {props.type ? props.type : "submit"}
            sx={props.style ? props.style : ""}
            >
            {label}
        </StyledButton>
    )
}
 
export default MuiButton
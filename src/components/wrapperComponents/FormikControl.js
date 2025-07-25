import MuiInput from "./MuiInput.js";
import MuiAutocomplete from "./MuiAutocomplete.js";
import MuiRadioGroup from "./MuiRadioGroup.js";
import MuiCheckboxes from "./MuiCheckboxes.js";
import { MuiPasswordField } from "./MuiPasswordField.js";
import { MuiSelect } from "./MuiSelect.js";
import MuiButton from "./MuiButton.js";
import MuiUpiInput from "./MuiUpiInput.js";

function FormikControl(props) {
  const { control, ...rest } = props;
  switch (control) {
    case "textfield":
      return <MuiInput {...rest} />;
    case "autocomplete":
      return <MuiAutocomplete {...rest} />;
    case "radiogroup":
      return <MuiRadioGroup {...rest} />;
    case "ckeckbox":
      return <MuiCheckboxes {...rest} />;
    case "passwordfield":
      return <MuiPasswordField {...rest} />;
    case "select":
      return <MuiSelect {...rest} />;
    case "button":
      return <MuiButton {...rest} />;
    case "upitextfield":
      return <MuiUpiInput {...rest} />;
    default:
      return null;
  }
}

export default FormikControl;

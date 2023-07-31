import { useEffect, useState } from "react";
import { ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import PersonAddDisabledIcon from "@mui/icons-material/PersonAddDisabled";
import { makeStyles } from "@mui/styles";

interface IProps {
  params: any;
  diemdanh: any;
  setDiemDanh: any;
  setIsSubmit: any;
  disabled: boolean;
}

const useStyles = makeStyles((theme: any) => ({
  disabled: {
    "&&": {
      backgroundColor: "transparent",
      color: "rgba(0, 0, 0, 0.2)",
    },
  },
}));

export const CellDiemDanh = (props: IProps) => {
  const { params, diemdanh, setDiemDanh, setIsSubmit, disabled } = props;

  const [value, setValue] = useState<string | null>();

  const styles = useStyles();

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    status: string | null
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setValue(status);
    diemdanh[params.id] = status;
    setDiemDanh(diemdanh);
    setIsSubmit(false);
  };

  useEffect(() => {
    setValue(diemdanh[params.id]);
  }, [diemdanh, params.id]);

  return (
    <ToggleButtonGroup
      size="small"
      color="primary"
      // value={diemdanh[params.id]}
      value={value}
      exclusive
      onChange={handleChange}
      aria-label="text"
      disabled={disabled}
    >
      <ToggleButton
        value="Đi Học"
        classes={disabled ? { selected: styles.disabled } : {}}
        disabled={disabled}
      >
        <Tooltip title="Đi Học">
          <CheckIcon />
        </Tooltip>
      </ToggleButton>

      <ToggleButton
        value="Nghỉ không phép"
        classes={disabled ? { selected: styles.disabled } : {}}
      >
        <Tooltip title="Nghỉ không phép">
          <PersonOffIcon />
        </Tooltip>
      </ToggleButton>

      <ToggleButton
        value="Nghỉ có phép"
        classes={disabled ? { selected: styles.disabled } : {}}
      >
        <Tooltip title="Nghỉ có phép">
          <PersonAddDisabledIcon />
        </Tooltip>
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

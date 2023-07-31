import { Tooltip, useTheme, Zoom, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { SxProps } from "@mui/system";

const fabStyle = {
  position: "absolute",
  bottom: 16,
  right: 16,
};

const fab = {
  color: "primary" as "primary",
  sx: fabStyle as SxProps,
  icon: <AddIcon />,
  label: "Add",
};

interface IProps {
  isActive: boolean;
  handleClick: any;
  title: string;
}

export const AddFloatButton = (props: IProps) => {
  const { isActive, handleClick, title } = props;

  const theme = useTheme();

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  return (
    <Zoom
      key={fab.color}
      in={isActive}
      timeout={transitionDuration}
      style={{
        transitionDelay: `${isActive ? transitionDuration.exit : 0}ms`,
      }}
      unmountOnExit
    >
      <Tooltip title={title}>
        <Fab
          sx={fab.sx}
          aria-label={fab.label}
          color={fab.color}
          onClick={handleClick}
        >
          {fab.icon}
        </Fab>
      </Tooltip>
    </Zoom>
  );
};

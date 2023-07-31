import React from "react";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Button } from "@mui/material";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPopupTitle?: React.Dispatch<React.SetStateAction<string>>;
  popupTitle: any;
  popupContent: any;
  handleOk?: any;
  haveOk?: boolean;
  maxWidth?: DialogProps["maxWidth"];
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Popup = (props: Props) => {
  const {
    open,
    setOpen,
    popupTitle,
    popupContent,
    handleOk,
    haveOk,
    maxWidth,
    setPopupTitle,
  } = props;

  const handleClose = () => {
    setOpen(false);
    setPopupTitle && setPopupTitle("");
  };
  return (
    <Dialog
      fullWidth={true}
      maxWidth={maxWidth}
      TransitionComponent={Transition}
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={{ fontSize: 20 }}>
        {popupTitle}
      </DialogTitle>
      <DialogContent>
        {typeof popupContent === "string" ? (
          <DialogContentText
            sx={{ whiteSpace: "pre-line", minWidth: 300 }}
            id="alert-dialog-description"
          >
            {popupContent}
          </DialogContentText>
        ) : (
          popupContent
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" size="small" onClick={handleClose}>
          Đóng
        </Button>
        {haveOk && (
          <Button
            type="submit"
            variant="contained"
            size="small"
            autoFocus
            onClick={() => {
              handleOk();
              handleClose();
            }}
          >
            Đồng ý
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

Popup.defaultProps = {
  open: false,
  setOpen: () => {},
  popupTitle: "",
  dialogContent: "",
  handleOk: () => {},
  haveOk: false,
  maxWidth: "sm",
};

export default Popup;

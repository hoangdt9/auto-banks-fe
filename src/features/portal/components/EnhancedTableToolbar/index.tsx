import React, { useState, useEffect } from "react";
import { Box, InputBase, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import { useQuery } from "react-query";
import studentApi from "../../../../api/studentApi";
import FilterMenu from "../FilterMenu";
import teacherApi from "../../../../api/teacherApi";
import Popup from "../../../../components/Popup";

import "./styles.scss";
import { IRequestStudents } from "../../../../types";

interface EnhancedTableToolbarProps {
  selected: readonly number[];
  setDataCallBack?: React.Dispatch<React.SetStateAction<any>>;
  setParams: React.Dispatch<React.SetStateAction<any>>;
  classes?: string | number[];
  filterType: string;
  refetch: any;
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type Props = PartialBy<EnhancedTableToolbarProps, "refetch">;

const Search = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  position: "relative",
  backgroundColor: alpha(theme.palette.divider, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.divider, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const EnhancedTableToolbar = (props: Props) => {
  const { selected, setDataCallBack, refetch, filterType, classes, setParams } = props;
  const numSelected = selected.length;
  const [title, setTitle] = useState<string>("");

  const [showPopup, setshowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupContent, setPopupContent] = useState("");

  const queryTeacher = useQuery(
    ["teacher", classes],
    () => classes && teacherApi.getTeacherByClass(classes),
    {
      enabled: false,
    }
  );

  const deleteStudents = async () => {
    await studentApi.deleteStudents({ ids: selected });
    refetch();
  };

  const deleteTeachers = async () => {
    await teacherApi.deleteTeachers({ ids: selected });
    queryTeacher.refetch();
    refetch();
  };

  const DELETE = new Map([
    ["student", deleteStudents],
    ["teacher", deleteTeachers],
  ]);

  const handleOkClick = DELETE.get(filterType);

  const handleDeleteClick = () => {
    setshowPopup(true);
    setPopupTitle("Xóa");
    setPopupContent(`${selected.length} ${title}`);
  };

  useEffect(() => {
    switch (filterType) {
      case "student":
        setTitle("Học Sinh");

        return;

      case "teacher":
        queryTeacher.refetch();
        setDataCallBack && setDataCallBack(queryTeacher.data?.results);
        setTitle("Huấn Luyện Viên");
        return;

      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setDataCallBack, filterType, queryTeacher.data]);

  return (
    <Box
      sx={{
        position: { sm: "absolute" },
        top: 12,
        right: { sm: 120, lg: 250, xl: 350 },
      }}
    >
      {numSelected > 0 ? (
        <Tooltip title={`Xóa ${numSelected} ${title.toLowerCase()}`}>
          <IconButton
            color="error"
            onClick={handleDeleteClick}
            sx={{
              position: "absolute",
              top: { sm: 0, xs: 10 },
              right: { sm: 0, xs: 115 },
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Search
          sx={{
            backgroundColor: { sm: alpha("#fff", 0.15) },
            color: { sm: "#fff" },
            borderRadius: {
              xs: 0,
              sm: 1,
            },
          }}
        >
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Tìm Kiếm..."
            inputProps={{ "aria-label": "search" }}
          />
          <FilterMenu
            setParams={setParams}
            filterType={filterType}
          />
        </Search>
      )}

      <Popup
        maxWidth={"xs"}
        open={showPopup}
        setOpen={setshowPopup}
        popupTitle={popupTitle}
        popupContent={popupContent}
        handleOk={handleOkClick}
        haveOk={true}
      />
    </Box>
  );
};

export default EnhancedTableToolbar;

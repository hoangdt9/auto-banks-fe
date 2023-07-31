import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { IconButton, Box, Tooltip, } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import vi from "../../../../assets/languages/vi.json";
import CustomToolbar from "../../../../custom-fields/CustomToolBar";
import { STUDENT_STATUS } from "../../../../constants/CommonConstant";
import EnhancedTableToolbar from "../EnhancedTableToolbar";
import studentApi from "../../../../api/studentApi";
import Popup from "../../../../components/Popup";
import { AddFloatButton } from "../AddFloatButton";
import "./styles.scss";
import { IRequestStudents } from "../../../../types";

const COLUMNS: GridColDef[] = [
  {
    field: "id",
    headerName: "Mã số",
    maxWidth: 70,
    align: "center",
    headerAlign: "center",
    flex: 1,
  },
  {
    field: "name",
    headerName: "Họ Tên",
    description: "Họ Tên",
    headerAlign: "center",
    width: 160,
    flex: 1,
  },
  {
    field: "year",
    headerName: "Năm sinh",
    align: "center",
    headerAlign: "center",
    maxWidth: 70,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => {
      const d = new Date(params.row.dob);
      return params.row.dob ? d.getFullYear() : "";
    },
  },
  {
    field: "status",
    headerName: "Trạng thái",
    width: 130,
    align: "center",
    headerAlign: "center",
    valueGetter: (params: GridValueGetterParams) =>
      STUDENT_STATUS.get(params.row.status),
    flex: 1,
  },
  {
    field: "phone",
    headerName: "Số điện thoại",
    width: 160,
    align: "center",
    headerAlign: "center",
    flex: 1,
  },
  {
    field: "avatar",
    headerName: "Ảnh đại diện",
    align: "center",
    headerAlign: "center",
    sortable: false,
    disableColumnMenu: true,
    width: 160,
    renderCell: (params) => (
      <img src={params.value} className="avatar" alt="" />
    ),
    flex: 1,
  },
];

export default function StudentList(props: any) {
  const { active } = props;

  const [selected, setSelected] = useState<readonly number[]>([]);
  const [showPopup, setshowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupContent, setPopupContent] = useState("");
  const [row, setRow] = useState<any>();
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 20,
    page: 0,
  });
  const [params, setParams] = useState<IRequestStudents>({
    pageSize: paginationModel.pageSize,
    pageNumber: paginationModel.page,
  });

  const { data, isLoading, refetch } = useQuery(["students", params], () =>
    studentApi.getStudents(params)
  );
  const students = data?.content?.results ?? []

  const totalRowCount = data?.totalRowCount ?? 0

  const [rowCountState, setRowCountState] = useState(totalRowCount);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  const navigate = useNavigate();

  const handleOkClick = async () => {
    await studentApi.deleteStudents({ ids: [row?.id] });
    refetch();
  };

  const renderCell = (params: any) => {
    const { row } = params;
    const handleCalendarClick = (e: any) => {
      e.stopPropagation(); // don't select this row after clicking
      navigate("calendar-student", {
        state: { student: row },
      });
    };

    const handleEditClick = async (e: any) => {
      e.stopPropagation(); // don't select this row after clicking
      refetch();

      try {
        const data = await studentApi.getStudentById(row.id);
        data &&
          navigate("update-student", {
            state: { student: row },
          });
      } catch (error) { }
    };

    const handleDeleteClick = () => {
      setRow(row);
      setshowPopup(true);
      setPopupTitle("Xóa");
      setPopupContent(`Học Sinh ${row.name}`);
    };

    return (
      <Box>
        <Tooltip title="sửa" placement="bottom">
          <IconButton
            color="primary"
            aria-label="Lịch học"
            component="label"
            onClick={handleCalendarClick}
          >
            <CalendarMonthIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="sửa" placement="bottom">
          <IconButton
            color="primary"
            aria-label="sửa"
            component="label"
            onClick={handleEditClick}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="xóa" placement="bottom">
          <IconButton
            color="error"
            aria-label="xóa"
            component="label"
            onClick={handleDeleteClick}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };

  const action = {
    field: "Sửa/Xóa",
    headerName: "",
    sortable: false,
    disableColumnMenu: true,
    minWidth: 120,
    renderCell: renderCell,
    flex: 1,
  };

  const columns = [...COLUMNS, action];

  const handleSelected = (selected: any) => {
    setSelected(selected);
  };

  const navigateStudentAdd = useCallback(
    () => navigate("add-student", { replace: true }),
    [navigate]
  );

  useEffect(() => {
    setRowCountState((prevRowCountState: any) =>
      totalRowCount !== undefined ? totalRowCount : prevRowCountState
    );
  }, [totalRowCount, setRowCountState]);

  return (
    <Box
      sx={{
        "& .MuiDataGrid-root": {
          border: "none",
        },
        "& .MuiDataGrid-cell": {
          borderBottom: "none",
        },
        height: { sm: "75vh", xs: "65vh" },
        minHeight: 400,
      }}
    >
      <EnhancedTableToolbar
        selected={selected}
        filterType="student"
        setParams={setParams}
      />

      <DataGrid
        localeText={vi}
        rows={students}
        columns={columns}
        components={{ Toolbar: CustomToolbar }}
        paginationModel={paginationModel}
        rowCount={rowCountState}
        onPaginationModelChange={setPaginationModel}
        paginationMode="server"
        onRowSelectionModelChange={(newRowSelectionModel: any) => {
          setRowSelectionModel(newRowSelectionModel);
        }}
        rowSelectionModel={rowSelectionModel}
        loading={isLoading}
        keepNonExistentRowsSelected
        pageSizeOptions={[5, 10, 20, 30, 50]}
      />

      <AddFloatButton
        isActive={active.student === "active"}
        handleClick={navigateStudentAdd}
        title="Thêm học sinh"
      />

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
}

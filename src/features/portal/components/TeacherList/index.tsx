import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { IconButton, Box, Tooltip, Divider } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import vi from "../../../../assets/languages/vi.json";
import CustomToolbar from "../../../../custom-fields/CustomToolBar";
import EnhancedTableToolbar from "../EnhancedTableToolbar";
import "./styles.scss";
import dayjs from "dayjs";
import teacherApi from "../../../../api/teacherApi";
import Popup from "../../../../components/Popup";
import { useQuery } from "react-query";
import { AddFloatButton } from "../AddFloatButton";

const COLUMNS: GridColDef[] = [
  {
    field: "id",
    headerName: "Mã giáo viên",
    width: 130,
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
    field: "role",
    headerName: "Chức vụ",
    align: "center",
    headerAlign: "center",
    width: 130,
    flex: 1,
  },
  {
    field: "start_date",
    headerName: "Ngày nhận việc",
    width: 130,
    align: "center",
    headerAlign: "center",
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.start_date
        ? dayjs(params.row.start_date).format("DD/MM/YYYY")
        : "",
  },
  {
    field: "salary",
    headerName: "Mức lương",
    width: 160,
    align: "center",
    headerAlign: "center",
    flex: 1,
  },
  {
    field: "allowance",
    headerName: "Lương khác",
    align: "center",
    headerAlign: "center",
    width: 160,
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
    field: "seniority",
    headerName: "Thâm niên",
    width: 160,
    align: "center",
    headerAlign: "center",
    flex: 1,
  },
];

export default function TeacherList(props: any) {
  const { active } = props;

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 20,
    page: 0,
  });
  const [params, setParams] = useState({
    pageSize: paginationModel.pageSize,
    pageNumber: paginationModel.page,
  });
  const [selected, setSelected] = useState<readonly number[]>([]);
  const [teachers, setTeachers] = useState<any>([]);
  const [showPopup, setshowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupContent, setPopupContent] = useState("");
  const [row, setRow] = useState<any>();

  const navigate = useNavigate();

  const queryTeacher = useQuery("teacher", teacherApi.getAllTeachers);

  const handleOkClick = () => {
    teacherApi.deleteTeachers({ ids: [row?.id] });
    const newTeachers = teachers.filter(
      (teacher: any) => teacher.id !== row.id
    );
    setTeachers(newTeachers);
    setshowPopup(false);
    queryTeacher.refetch();
  };

  const renderCell = (params: GridValueGetterParams): JSX.Element => {
    const { row } = params;
    const handleEditClick = async (e: any) => {
      e.stopPropagation(); // don't select this row after clicking
      queryTeacher.refetch();

      try {
        const data = await teacherApi.getTeacherById(row.id);
        data &&
          navigate("add-teacher", {
            state: { teacher: row },
          });
      } catch (error) { }
    };

    const handleDeleteClick = () => {
      setRow(row);
      setshowPopup(true);
      setPopupTitle("Xóa");
      setPopupContent(`Huấn Luyện Viên ${row.name}`);
    };

    return (
      <Box>
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

  const action: any = {
    field: "Sửa/Xóa",
    headerName: "",
    sortable: false,
    disableColumnMenu: true,
    renderCell: renderCell,
  };

  const columns: GridColDef[] = [...COLUMNS, action];

  const handleSelected: any = (selected: any) => {
    setSelected(selected);
  };

  const navigateTeacherAdd = useCallback(
    () => navigate("add-teacher", { replace: true }),
    [navigate]
  );

  useEffect(() => {
    queryTeacher.refetch();
    setTeachers(queryTeacher.data?.results);
  }, [queryTeacher.data]);

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
        setDataCallBack={setTeachers}
        filterType="teacher"
        refetch={queryTeacher.refetch}
        setParams={setParams}
      />
      <DataGrid
        localeText={vi}
        rows={teachers ?? []}
        columns={columns}
        // pageSize={pageSize}
        // onPageSizeChange={(newPage) => setPageSize(newPage)}
        checkboxSelection
        // rowsPerPageOptions={[5, 10, 20, 30, 50]}
        // onSelectionModelChange={handleSelected}
        components={{ Toolbar: CustomToolbar }}
      // experimentalFeatures={{ newEditingApi: true }}
      />
      <AddFloatButton
        isActive={active.teacher === "active"}
        handleClick={navigateTeacherAdd}
        title="Thêm huấn luyện viên"
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

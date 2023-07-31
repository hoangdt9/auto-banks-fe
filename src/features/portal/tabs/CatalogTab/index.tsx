import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { IconButton, Box, Tooltip, Divider } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import vi from "../../../../assets/languages/vi.json";
import Popup from "../../../../components/Popup";
import { useMutation, useQuery } from "react-query";
import locationApi from "../../../../api/locationApi";
import { LocationForm } from "../../components/LocationForm";
import { Formik } from "formik";
import { AddFloatButton } from "../../components/AddFloatButton";
import CustomToolbar from "../../../../custom-fields/CustomToolBar";
import "./styles.scss";

interface IProps {
  setActive: React.Dispatch<React.SetStateAction<any>>;
  active: any;
}

const COLUMNS: GridColDef[] = [
  {
    field: "location_id",
    headerName: "Mã cơ sở",
    description: "Mã cơ sở",
    width: 100,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "name",
    headerName: "Tên cơ sở",
    description: "Tên cơ sở",
    headerAlign: "center",
    minWidth: 350,
    flex: 1,
  },
  {
    field: "address",
    headerName: "Địa chỉ",
    description: "Địa chỉ",
    headerAlign: "center",
    width: 160,
    flex: 1,
  },
  {
    field: "contact1",
    headerName: "Người liên hệ 1",
    description: "Người liên hệ 1",
    width: 160,
    align: "center",
    headerAlign: "center",
    flex: 1,
  },
  {
    field: "phone1",
    headerName: "Số điện thoại",
    description: "Số điện thoại",
    width: 160,
    align: "center",
    headerAlign: "center",
    flex: 1,
  },
  {
    field: "contact2",
    headerName: "Người liên hệ 2",
    description: "Người liên hệ 2",
    width: 160,
    align: "center",
    headerAlign: "center",
    flex: 1,
  },
  {
    field: "phone2",
    headerName: "Số điện thoại",
    description: "Số điện thoại",
    width: 160,
    align: "center",
    headerAlign: "center",
    flex: 1,
  },
  {
    field: "contact3",
    headerName: "Người liên hệ 3",
    description: "Người liên hệ 3",
    width: 160,
    align: "center",
    headerAlign: "center",
    flex: 1,
  },
  {
    field: "phone3",
    headerName: "Số điện thoại",
    description: "Số điện thoại",
    width: 160,
    align: "center",
    headerAlign: "center",
    flex: 1,
  },
];

const CatalogTab = (props: IProps): JSX.Element => {
  const { setActive, active } = props;

  const [pageSize, setPageSize] = useState(5);
  const [locations, setLocations] = useState<any>([]);
  const [showPopup, setshowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupContent, setPopupContent] = useState<any>();
  const [row, setRow] = useState<any>();
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [haveOk, setHaveOk] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);

  const initialValues = {
    location_id: "",
    name: "",
    address: "",
    contact1: "",
    phone1: "",
    contact2: "",
    phone2: "",
    contact3: "",
    phone3: "",
  };

  const queryLocation = useQuery("location", locationApi.getLocations);

  const registerNewLocation = useMutation(locationApi.registerNewLocation, {
    onMutate: () => { },
    onSuccess: (response) => {
      setHaveOk(false);
      setshowPopup(true);
      setPopupTitle("Cơ sở");
      setPopupContent("Đăng ký thành công");
      queryLocation?.refetch();
    },
    onError: (err: any) => {
      setshowPopup(true);
      setPopupTitle("Lỗi!");
      setPopupContent("Đăng ký thất bại");
      queryLocation?.refetch();
    },
  });

  const updateLocation = useMutation(locationApi.updateLocation, {
    onSuccess: (response) => {
      setshowPopup(true);
      setPopupTitle("Thành công");
      setPopupContent(`Đã cập nhật thông tin cơ sở ${response.name}`);
      setHaveOk(false);
      queryLocation?.refetch();
    },
    onError: (err: any) => {
      console.log(err);
      setshowPopup(true);
      setPopupTitle("Lỗi!!!");
      setPopupContent(`kiểm tra lại mã cơ sở`);
      setHaveOk(false);
    },
  });

  const renderCell = (params: GridValueGetterParams): JSX.Element => {
    const { row } = params;
    const handleEditClick = async (e: any) => {
      await queryLocation?.refetch();
      e.stopPropagation(); // don't select this row after clicking
      e.preventDefault();

      setIsUpdate(true);
      setHaveOk(true);
      setIsSubmit(true);
      setshowPopup(true);
      setPopupTitle("Thêm mới cơ sở");
      setPopupContent(<LocationForm defaultValue={row} />);
    };

    const handleDeleteClick = () => {
      setHaveOk(true);
      setIsSubmit(false);
      setRow(row);
      setshowPopup(true);
      setPopupTitle("Xóa Cơ Sở");
      setPopupContent(`${row.name}`);
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

  const handleOkClick = async () => {
    setshowPopup(false);
    await queryLocation?.refetch();
    try {
      await locationApi.deleteLocation(row?.location_id);
      alert(`Đã xóa cơ sở ${row?.name}`);
      queryLocation?.refetch();
    } catch (error) {
      alert(`Lỗi!!!`);
      queryLocation?.refetch();
    }
  };

  const handleSubmit = async (values: any) => {
    if (isUpdate) {
      updateLocation.mutate(values);
    } else registerNewLocation.mutate(values);
  };

  const handleAddClick = (event: any) => {
    event.preventDefault();

    setIsUpdate(false);
    setHaveOk(true);
    setIsSubmit(true);
    setshowPopup(true);
    setPopupTitle("Thêm mới cơ sở");
    setPopupContent(<LocationForm />);
  };

  useEffect(() => {
    queryLocation.refetch();

    const results = queryLocation?.data?.results;
    const locationData = results?.map((row: any) => {
      return { ...row, id: row.location_id };
    });
    setLocations(locationData);
  }, [queryLocation?.data]);

  useEffect(() => {
    setActive({ catalog: "active" });
  }, [setActive]);

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
      <DataGrid
        localeText={vi}
        rows={locations ?? []}
        columns={columns}
        // pageSize={pageSize}
        // onPageSizeChange={(newPage) => setPageSize(newPage)}
        // rowsPerPageOptions={[5, 10, 20, 30, 50]}
        components={{ Toolbar: CustomToolbar }}
        // experimentalFeatures={{ newEditingApi: true }}
      />

      <AddFloatButton
        isActive={active.catalog === "active"}
        handleClick={handleAddClick}
        title="Thêm cơ sở"
      />

      <Formik
        initialValues={initialValues}
        // validationSchema={TeacherFormSchema}
        onSubmit={handleSubmit}
      >
        {(props) => {
          const { handleSubmit } = props;
          return (
            <Popup
              maxWidth={haveOk ? "md" : "sm"}
              open={showPopup}
              setOpen={setshowPopup}
              popupTitle={popupTitle}
              popupContent={popupContent}
              handleOk={isSubmit ? handleSubmit : handleOkClick}
              haveOk={haveOk}
            />
          );
        }}
      </Formik>
    </Box>
  );
};

export default CatalogTab;

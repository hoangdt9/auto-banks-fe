import { useState, useEffect } from "react";
import {
  Box,
  Switch,
  FormControlLabel,
  Typography,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  DataGrid,
  GridColDef,
  GridRowSelectionModel,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { darken, lighten } from "@mui/material/styles";
import dayjs, { Dayjs } from "dayjs";
import { useMutation, useQuery } from "react-query";

import ManyTeacherSelectField from "../../../../custom-fields/ManyTeacherSelectField";
import DatePickerField from "../../../../custom-fields/DatePickerField";
import Popup from "../../../../components/Popup";
import vi from "../../../../assets/languages/vi.json";
import {
  IOption,
  DiemDanhToolbar,
  DiemDanhToolbarXS,
} from "../../components/DiemDanhToolbar";
import { FastField, Field, Formik } from "formik";
import locationApi from "../../../../api/locationApi";
import classApi from "../../../../api/classApi";
import studentApi from "../../../../api/studentApi";
import { STUDENT_STATUS } from "../../../../constants/CommonConstant";
import { CellDiemDanh } from "../../components/CellDiemDanh";
import attendanceApi from "../../../../api/attendanceApi";
import { AttendanceSchema } from "../../../../utils/validation";
import OffReasonField from "../../components/OffReasonField";
import "./styles.scss";
import AutocompleteField from "../../../../custom-fields/AutocompleteField";
import { IRequestStudents } from "../../../../types";

interface IProps {
  setActive: React.Dispatch<React.SetStateAction<any>>;
}

const initialValues = {
  location: null,
  class: null,
  teacher: [],
  date: dayjs().format("YYYY-MM-DD"),
  reason_off: "Lớp nghỉ",
};

const getBackgroundColor = (color: string, mode: string) =>
  mode === "dark" ? darken(color, 0.6) : lighten(color, 0.6);

const getHoverBackgroundColor = (color: string, mode: string) =>
  mode === "dark" ? darken(color, 0.5) : lighten(color, 0.5);

const AttendanceTab = (props: IProps): JSX.Element => {
  const { setActive } = props;

  const [isClassOn, setIsClassOn] = useState(true);
  const [reason, setReason] = useState("Nghỉ mưa");

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 20,
    page: 0,
  });

  const [showPopup, setshowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState<any | string>("");
  const [popupContent, setPopupContent] = useState("");
  const [location, setLocation] = useState("");
  const [classId, setClassId] = useState<number>(0);
  const [dow, setDow] = useState<number>(new Date().getDay());
  const [diemdanh, setDiemDanh] = useState<any>({});
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [notes, setNotes] = useState<any>({});

  const { data: attendanceData, refetch: refetchAttendance } = useQuery(
    ["attendance", classId, date?.format("YYYY-MM-DD")],
    () => attendanceApi.getAttendance(classId, date?.format("YYYY-MM-DD"))
  );

  const { data: locationData } = useQuery("locations", locationApi.getLocations);

  const { data: classData } = useQuery(["classes", "", location, dow], () =>
    classApi.getClasses("", location, dow)
  );

  const params: IRequestStudents = {
    classes: classId,
    pageSize: paginationModel.pageSize,
    pageNumber: paginationModel.page,
  }


  const { data: studentData, refetch: refetchStudent } = useQuery(["students", params], () =>
    studentApi.getStudents(params)
  );

  const totalRowCount = studentData?.totalRowCount ?? 0
  const [rowCountState, setRowCountState] = useState(totalRowCount);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  const { data: usedUnit } = useQuery(["usedUnitClass", classId], () =>
    classApi.getUsedUnit(classId)
  );

  const attended_students = attendanceData?.results[0]
    ? Object.keys(attendanceData?.results[0].attendance_student).map((item) =>
      parseInt(item)
    )
    : null;

  const student_in_class = studentData?.content?.results.map(
    (item: any, index: number) => {
      return {
        ...item,
        unit_num: item.fee.unit_num,
        unit_used: item.fee.unit_used,
      };
    }
  );

  const student_set = studentData?.content?.results.reduce(
    (a: any, v: any) => ({ ...a, [v.id]: v }),
    {}
  );

  const students = attended_students
    ? student_in_class?.filter((item: any) => {
      return attended_students?.includes(item.id);
    })
    : student_in_class?.filter((item: any) => {
      // return item.fee?.unit_used < item.fee?.unit_num;
      return (
        // item.status !== "NGHIHOC" &&
        item.fee?.end_date &&
        date?.isBefore(dayjs(item.fee?.end_date))
      );
    });

  const STUDENTS = students?.map((item: any, index: number) => {
    return {
      ...item,
      index: index + 1,
    };
  });

  const LOCATIONS: IOption[] = locationData?.results.map((item: any) => {
    return { label: item.name, id: item.location_id };
  });

  const location_name: any = {};
  locationData?.results.map(
    (item: any) => (location_name[`${item.location_id}`] = item.name)
  );

  const class_data: IOption[] = classData?.results.map((item: any) => {
    return {
      is_open: item.is_open,
      label: `${item.location} ${item.name}  ${item.start_at.substring(
        0,
        5
      )} ~ ${item.end_at.substring(0, 5)}`,
      id: item.id,
      location: item.location,
      location_name: location_name[`${item.location}`],
    };
  });

  const CLASSES = class_data?.filter((item: any) => item.is_open);

  const COLUMNS: GridColDef[] = [
    {
      field: "index",
      headerName: "STT",
      description: "STT",
      width: 55,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "id",
      headerName: "Mã số",
      description: "Mã học sinh",
      width: 60,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      // flex: 1,
    },
    {
      field: "name",
      headerName: "Họ tên",
      description: "Họ tên",
      headerAlign: "center",
      width: 120,
    },
    {
      field: "status",
      headerName: "Trạng thái học",
      description: "Trạng thái học",
      headerAlign: "center",
      align: "center",
      width: 120,
      valueGetter: (params: GridValueGetterParams) =>
        STUDENT_STATUS.get(params.row.status),
    },
    {
      field: "year",
      headerName: "Năm sinh",
      description: "Năm sinh",
      align: "center",
      headerAlign: "center",
      width: 100,
      valueGetter: (params: GridValueGetterParams) => {
        const d = new Date(params.row.dob);
        return params.row.dob ? d.getFullYear() : "";
      },
    },
    {
      field: "phone",
      headerName: "Số điện thoại",
      description: "Số điện thoại",
      width: 120,
      align: "center",
      headerAlign: "center",
      // flex: 1,
    },
    {
      field: "avatar",
      headerName: "Ảnh đại diện",
      description: "Ảnh đại diện",
      align: "center",
      headerAlign: "center",
      sortable: false,
      maxWidth: 120,
      renderCell: (params) => (
        <img src={params.value} className="avatar" alt="" />
      ),
      // flex: 1,
    },
    {
      field: "unit_num",
      headerName: "Số buổi",
      description: "Số buổi học",
      width: 75,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "unit_used",
      headerName: "Đã học",
      description: "Số buổi đã học",
      width: 70,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      valueGetter: (params: GridValueGetterParams) =>
        usedUnit && usedUnit[params.row.id],
    },
    {
      field: "unit_rest",
      headerName: "Còn lại",
      description: "Số buổi học còn lại",
      width: 70,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      valueGetter: (params: GridValueGetterParams) =>
        usedUnit && params.row.unit_num - usedUnit[params.row.id],
    },
    {
      field: "diemdanh",
      headerName: "Điểm danh",
      description: "Điểm danh",
      width: 120,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <CellDiemDanh
          params={params}
          diemdanh={diemdanh}
          setDiemDanh={setDiemDanh}
          setIsSubmit={setIsSubmit}
          disabled={!isClassOn}
        />
      ),
    },
    {
      field: "note",
      headerName: "Ghi chú",
      description: "Ghi chú",
      width: 100,
      disableColumnMenu: true,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <IconButton
            color="default"
            aria-label="Ghi Chú"
            component="label"
            onClick={(e: React.MouseEvent<HTMLElement>) =>
              handleNoteClick(e, params)
            }
          >
            <EventNoteIcon />
          </IconButton>
        );
      },
    },
  ];

  const handleNoteClick = (
    event: React.MouseEvent<HTMLElement>,
    params: any
  ) => {
    setshowPopup(true);
    setPopupTitle("Ghi Chú");
    setPopupContent(params.id);
  };

  const handleOkClick = () => { };

  const handleChangeNote = (e: any) => {
    const { name, value } = e.target;
    const id = parseInt(name);
    setNotes({ ...notes, [id]: value });
  };

  const handleCellClick = (param: any, event: any) => {
    event.defaultMuiPrevented =
      param.field === "diemdanh" || param.field === "note";
  };

  const handleSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsClassOn(event.target.checked);
  };

  const registerNewAttendance = useMutation(
    attendanceApi.registerNewAttendance,
    {
      onMutate: () => { },
      onSuccess: (response) => {
        setshowPopup(true);
        setPopupTitle("Điểm Danh");
        setPopupContent("Điểm danh thành công");
        refetchAttendance();
        refetchStudent();
      },
      onError: (err: any) => {
        // const { data } = err.response;
        alert("Điểm danh thất bại");
      },
    }
  );

  const handleSubmit = async (values: any) => {
    if (!STUDENTS || STUDENTS.length === 0) return;

    const { teacher, class: classes, date, reason_off } = values;
    const teacher_id = teacher.map((t: any) => parseInt(t.id));
    const student_id = STUDENTS.map((s: any) => s.id);
    const status = isClassOn ? "Lớp Học" : reason_off;

    const note_in_class = Object.keys(notes)
      .filter((key) => student_id.includes(parseInt(key)))
      .reduce((a: any, v: any) => ({ ...a, [v]: notes[v] }), {});

    const params = {
      date: date,
      status: status,
      student: student_id,
      teacher: teacher_id,
      classes: classes.id,
      attendance_student: isClassOn ? diemdanh : {},
      note: note_in_class,
    };

    setIsSubmit(true);

    if (attendanceData && attendanceData?.results.length !== 0) {
      if (isClassOn)
        for (const [key, value] of Object.entries(diemdanh)) if (!value) return;
      try {
        await attendanceApi.updateAttendance(
          attendanceData?.results[0].id,
          params
        );
        setshowPopup(true);
        setPopupTitle("Cập nhật");
        setPopupContent("Điểm danh thành công");
        refetchAttendance();
        refetchStudent();
        return;
      } catch (error) {
        // alert("Cập nhật thất bại");
      }
    }

    if (isClassOn) {
      setSelectionModel([]);
      if (Object.keys(diemdanh).length !== STUDENTS.length) return;
      for (const [key, value] of Object.entries(diemdanh)) if (!value) return;
    }

    registerNewAttendance.mutate(params);
  };

  const handleSelection = (newSelection: any) => {
    setSelectionModel(newSelection);
    const newDiemDanh: any = {};
    newSelection?.forEach((id: number) => {
      newDiemDanh[id] = "Đi Học";
    });

    setDiemDanh(newDiemDanh);
  };

  useEffect(() => {
    setActive({ attendance: "active" });

    if (!attendanceData?.results || attendanceData?.results.length === 0) {
      setDiemDanh({});
      setReason("Lớp Học");
      setIsClassOn(true);
      return;
    }

    const note = attendanceData?.results[0].note;
    const attendance_student = attendanceData?.results[0].attendance_student;
    const status = attendanceData?.results[0].status;

    setDiemDanh(attendance_student ?? {});
    setNotes(note ?? {});
    setReason(status);
    setIsClassOn(status === "Lớp Học");
  }, [attendanceData, setActive]);

  useEffect(() => {
    setRowCountState((prevRowCountState: any) =>
      totalRowCount !== undefined ? totalRowCount : prevRowCountState
    );
  }, [totalRowCount, setRowCountState]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Formik
        initialValues={initialValues}
        validationSchema={AttendanceSchema}
        onSubmit={handleSubmit}
      >
        {(props) => {
          const { handleSubmit } = props;

          return (
            <Grid container spacing={2} sx={{ px: 2, pt: 2 }}>
              <Grid item xs={12} md={3.3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isClassOn}
                      onChange={handleSwitch}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  }
                  label={
                    isClassOn ? (
                      <Typography>Lớp Học</Typography>
                    ) : (
                      <div>
                        <Box
                          sx={{
                            display: { xs: "none", md: "flex" },
                            width: "22.2vw",
                          }}
                        >
                          <Typography sx={{ width: 100, pt: 1 }}>
                            Lớp nghỉ
                          </Typography>
                          <Field
                            name="reason_off"
                            component={OffReasonField}
                            reason={reason}
                            setReason={setReason}
                          />
                        </Box>

                        <Typography sx={{ display: { md: "none" }, mb: 2 }}>
                          Lớp nghỉ
                        </Typography>
                      </div>
                    )
                  }
                />
                {!isClassOn && (
                  <Typography
                    component={"span"}
                    sx={{ display: { md: "none" } }}
                  >
                    <Field
                      name="reason_off"
                      component={OffReasonField}
                      reason={reason}
                      setReason={setReason}
                    />
                  </Typography>
                )}

                <Box sx={{ my: 1 }}>
                  <Field
                    name="teacher"
                    component={ManyTeacherSelectField}
                    label="Huấn Luyện Viên"
                    size="small"
                    defaultValue={attendanceData?.results[0]}
                  />
                </Box>

                <Box sx={{ my: 1 }}>
                  <FastField
                    name="date"
                    component={DatePickerField}
                    label="Ngày điểm danh"
                    setDow={setDow}
                    type="diemdanh"
                    setDate={setDate}
                    setClassId={setClassId}
                  />
                </Box>

                <DiemDanhToolbarXS
                  locationOption={LOCATIONS}
                  classOption={CLASSES}
                  setLocation={setLocation}
                  setClassId={setClassId}
                />
              </Grid>

              <Grid item xs={12} md={8.7}>
                <Box
                  className="right-container"
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{
                    position: "relative",
                    "& .super-app-theme--Error": {
                      bgcolor: (theme) =>
                        getBackgroundColor(
                          theme.palette.error.main,
                          theme.palette.mode
                        ),
                      "&:hover": {
                        bgcolor: (theme) =>
                          getHoverBackgroundColor(
                            theme.palette.error.main,
                            theme.palette.mode
                          ),
                      },
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      display: { xs: "none", md: "flex" },
                      zIndex: 1000,
                    }}
                  >
                    <Field
                      name="location"
                      component={AutocompleteField}
                      label="Cơ sở"
                      options={LOCATIONS}
                      size="small"
                      width={220}
                      type="diemdanh"
                      setLocation={setLocation}
                      setClassId={setClassId}
                    />
                  </Box>

                  <Box
                    sx={{
                      position: "absolute",
                      top: 10,
                      left: 240,
                      display: { xs: "none", md: "flex" },
                      zIndex: 1000,
                    }}
                  >
                    <Field
                      name="class"
                      component={AutocompleteField}
                      label="Lớp"
                      options={CLASSES}
                      size="small"
                      width={220}
                      type="diemdanh"
                      setClassId={setClassId}
                    />
                  </Box>
                  <DataGrid
                    localeText={vi}
                    rows={STUDENTS ?? []}
                    columns={COLUMNS}
                    components={{ Toolbar: DiemDanhToolbar }}
                    getRowClassName={(params) =>
                      isSubmit && !diemdanh[params.row.id] && isClassOn
                        ? `super-app-theme--Error`
                        : ""
                    }
                    paginationModel={paginationModel}
                    rowCount={rowCountState}
                    onPaginationModelChange={setPaginationModel}
                    paginationMode="server"
                    onRowSelectionModelChange={(newRowSelectionModel: any) => {
                      setRowSelectionModel(newRowSelectionModel);
                    }}
                    rowSelectionModel={rowSelectionModel}
                    keepNonExistentRowsSelected
                    pageSizeOptions={[5, 10, 20, 30, 50]}
                    onCellClick={handleCellClick}
                  />
                </Box>
              </Grid>
            </Grid>
          );
        }}
      </Formik>
      <Popup
        maxWidth={"xs"}
        open={showPopup}
        setOpen={setshowPopup}
        setPopupTitle={setPopupTitle}
        popupTitle={
          popupTitle === "Ghi Chú"
            ? student_set[popupContent]?.name
            : popupTitle
        }
        popupContent={
          popupTitle === "Ghi Chú" ? (
            <TextField
              name={`${popupContent}`}
              label="Ghi Chú"
              multiline
              fullWidth
              defaultValue={notes[popupContent]}
              variant="filled"
              onChange={handleChangeNote}
            />
          ) : (
            popupContent
          )
        }
        handleOk={handleOkClick}
        haveOk={popupTitle === "Ghi Chú"}
      />
    </LocalizationProvider>
  );
};

export default AttendanceTab;

import { useEffect, useState } from "react";
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  Tooltip,
  TooltipProps,
  tooltipClasses,
  Autocomplete,
  TextField,
  Grid,
  IconButton,
  Stack,
  Chip,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import dayjs from "dayjs";
import { useMutation, useQuery } from "react-query";
import { Formik } from "formik";

import locationApi from "../../../../api/locationApi";
import classApi from "../../../../api/classApi";
import teacherApi from "../../../../api/teacherApi";
import { ITeacher } from "../../components/TeacherForm";
import Popup from "../../../../components/Popup";
import { IClassroom } from "../../components/Schedule";
import { ClassForm } from "../../components/ClassForm";
import styles from "./style.module.scss";
import { tokens } from "../../../../theme";

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 300,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

type WeekType = Array<IClassroom>[];

interface IProps {
  setActive: React.Dispatch<React.SetStateAction<any>>;
}

const TeacherDetail = (props: any): JSX.Element => {
  const { classId } = props;
  const { data: teacher } = useQuery(["teacher", classId], () =>
    teacherApi.getTeacherByClass(classId)
  );

  return (
    <>
      {teacher?.results.map((item: ITeacher, index: number) => (
        <div key={`Scheduler${index}`}>
          {item.role}: {item.name}
        </div>
      ))}
    </>
  );
};

const convertTime = (time: string) => {
  const hour = parseInt(time.slice(0, 2));
  if (hour < 12) {
    return "morning";
  } else if (hour >= 12) {
    return "afternoon";
  } else {
    return "noData";
  }
};

const ClassTab = (props: IProps): JSX.Element => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { setActive } = props;

  const [isOpenClass, setIsOpenClass] = useState<boolean>(true);
  const [location, setLocation] = useState<any>();
  const [showPopup, setshowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [classInfo, setClassInfo] = useState<any>();

  const { data: locationData, refetch: refetchLocation } = useQuery(
    "location",
    locationApi.getLocations,
    { enabled: false }
  );

  const { data: classData, refetch: refetchClass } = useQuery(
    ["class", location?.location_id],
    () => classApi.getClassesByLocation(location?.location_id)
  );

  const registerNewClass = useMutation(classApi.registerNewClass, {
    onMutate: () => {},
    onSuccess: (response) => {
      alert("Thêm lớp mới thành công");
    },
    onError: (err: any) => {
      const { data } = err.response;
      console.log("err", data);
    },
  });

  const morning: WeekType = [[], [], [], [], [], [], []];
  const afternoon: WeekType = [[], [], [], [], [], [], []];

  classData?.forEach((item: IClassroom) => {
    if (
      convertTime(item?.start_at) !== "noData" &&
      item?.is_open === isOpenClass
    ) {
      if (convertTime(item?.start_at) === "morning") {
        morning[item?.day_of_week].push(item);
      } else {
        afternoon[item?.day_of_week].push(item);
      }
    }
  });

  const initialValues = {
    day_of_week: "",
    start_at: dayjs().format("HH:mm:ss"),
    type: "",
    end_at: dayjs().format("HH:mm:ss"),
    name: "",
    is_open: true,
    teacher: null,
  };

  const LOCATIONS = locationData?.results.map((item: any) => {
    return { label: item.name, location_id: item.location_id, id: item.id };
  });

  const handleRadioSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === "on_class") setIsOpenClass(true);
    else setIsOpenClass(false);
  };

  const handleChange = (e: any, value: any) => {
    setLocation(value);
  };

  const handleAddClick = async (e: any, id: number) => {
    setClassInfo({ day_of_week: id });
    setshowPopup(true);
    setPopupTitle(`Thêm mới lớp học (${location.label.toLowerCase()})`);
  };

  const handleSelection = (e: any, classInfo: any) => {
    setClassInfo(classInfo);
    setshowPopup(true);
    setPopupTitle(`Cập nhật lớp học (${location.label.toLowerCase()})`);
  };

  const handleDelete = async (e: any, id: number) => {
    await classApi.deleteClass(id);
    refetchClass();
  };

  const handleSubmit = async (value: any) => {
    const { teacher } = value;

    const params = { ...value };
    params.location = location.location_id;
    params.teacher = teacher.map((teacher: any) => teacher.id);

    if (classInfo && classInfo.name) {
      await classApi.updateClass(classInfo.id, params);
      refetchClass();
      alert("Cập nhật thành công");
    } else registerNewClass.mutate(params);
  };

  useEffect(() => {
    setActive({ class: "active" });
    refetchLocation();
  }, [locationData, refetchLocation, setActive]);

  return (
    <>
      <Grid
        container
        sx={{
          px: 1,
          pt: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Grid item xs={12} md={4} sx={{ pb: { xs: 1, md: 0 } }}>
          <Autocomplete
            size="small"
            fullWidth
            isOptionEqualToValue={(option: any, value: any) =>
              option?.label === value?.label
            }
            getOptionLabel={(option: any) => option?.label}
            options={LOCATIONS ?? []}
            value={location || null}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Cơ sở"
                size="small"
                InputProps={{
                  ...params.InputProps,
                  style: {
                    fontSize: 12,
                    fontWeight: 400,
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontSize: 12,
                  },
                }}
              />
            )}
            renderOption={(props, option: any) => (
              <li {...props} style={{ fontSize: 12 }}>
                {option.label}
              </li>
            )}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={8} md={3}>
          <RadioGroup
            row
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FormControlLabel
              control={
                <Radio
                  size="small"
                  checked={!isOpenClass}
                  onChange={handleRadioSwitch}
                  name="off_class"
                />
              }
              label="Lớp đóng"
            />
            <FormControlLabel
              control={
                <Radio
                  size="small"
                  checked={isOpenClass}
                  onChange={handleRadioSwitch}
                  name="on_class"
                />
              }
              label="Lớp mở"
            />
          </RadioGroup>
        </Grid>
      </Grid>

      <TableContainer
        component={Paper}
        sx={{ py: 1 }}
        className={styles.class_tab}
      >
        <Table className={styles.schedule_table}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ border: `1px solid ${colors.black[100]}` }}
              ></TableCell>
              <TableCell
                align="center"
                sx={{ border: `1px solid ${colors.black[100]}` }}
              >
                Chủ nhật
              </TableCell>
              <TableCell
                align="center"
                sx={{ border: `1px solid ${colors.black[100]}` }}
              >
                Thứ 2
              </TableCell>
              <TableCell
                align="center"
                sx={{ border: `1px solid ${colors.black[100]}` }}
              >
                Thứ 3
              </TableCell>
              <TableCell
                align="center"
                sx={{ border: `1px solid ${colors.black[100]}` }}
              >
                Thứ 4
              </TableCell>
              <TableCell
                align="center"
                sx={{ border: `1px solid ${colors.black[100]}` }}
              >
                Thứ 5
              </TableCell>
              <TableCell
                align="center"
                sx={{ border: `1px solid ${colors.black[100]}` }}
              >
                Thứ 6
              </TableCell>
              <TableCell
                align="center"
                sx={{ border: `1px solid ${colors.black[100]}` }}
              >
                Thứ 7
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow sx={{ height: 200 }}>
              <TableCell
                sx={{
                  border: `1px solid ${colors.black[100]}`,
                  fontWeight: "bold",
                }}
              >
                Sáng
              </TableCell>
              {morning.map((day, index) => {
                return (
                  <TableCell
                    sx={{ border: `1px solid ${colors.black[100]}` }}
                    key={index}
                  >
                    <Stack
                      spacing={1}
                      direction="column"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {day.map((classroom, index) => {
                        return (
                          <HtmlTooltip
                            key={`day${index}`}
                            title={
                              <>
                                {"Mã lớp học: " + classroom?.class_id}
                                <br />
                                {"Địa chỉ lớp học: " + location?.label}
                                <br />
                                <TeacherDetail classId={classroom?.id} />
                              </>
                            }
                          >
                            <Chip
                              variant="outlined"
                              label={`${
                                classroom?.name
                              } ${classroom?.start_at?.slice(
                                0,
                                2
                              )}:${classroom?.start_at?.slice(
                                3,
                                5
                              )} - ${classroom?.end_at?.slice(0, 2)}:
                              ${classroom?.end_at?.slice(3, 5)}`}
                              onClick={(e) => handleSelection(e, classroom)}
                              onDelete={(e) => handleDelete(e, classroom?.id)}
                            />
                          </HtmlTooltip>
                        );
                      })}
                      {location && (
                        <Tooltip title="Thêm Lớp" arrow>
                          <IconButton
                            aria-label="add"
                            onClick={(e) => handleAddClick(e, index)}
                          >
                            <AddIcon id={`${index}`} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                );
              })}
            </TableRow>

            <TableRow sx={{ height: 200 }}>
              <TableCell
                sx={{
                  border: `1px solid ${colors.black[100]}`,
                  fontWeight: "bold",
                }}
              >
                Chiều
              </TableCell>
              {afternoon.map((day, index) => {
                return (
                  <TableCell
                    sx={{ border: `1px solid ${colors.black[100]}` }}
                    key={`b${index}`}
                  >
                    <Stack
                      spacing={1}
                      direction="column"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      {day.map((classroom, index) => {
                        return (
                          <HtmlTooltip
                            key={`day${index}`}
                            title={
                              <>
                                {"Mã lớp học: " + classroom?.class_id}
                                <br />
                                {"Địa chỉ lớp học: " + location?.label}
                                <br />
                                <TeacherDetail classId={classroom?.id} />
                              </>
                            }
                          >
                            <Chip
                              variant="outlined"
                              label={`${
                                classroom?.name
                              } ${classroom?.start_at?.slice(
                                0,
                                2
                              )}:${classroom?.start_at?.slice(
                                3,
                                5
                              )} - ${classroom?.end_at?.slice(0, 2)}:
                              ${classroom?.end_at?.slice(3, 5)}`}
                              onClick={(e) => handleSelection(e, classroom)}
                              onDelete={(e) => handleDelete(e, classroom?.id)}
                              sx={{ fontWeight: "bold" }}
                            />
                          </HtmlTooltip>
                        );
                      })}
                      {location && (
                        <Tooltip title="Thêm Lớp" arrow>
                          <IconButton
                            aria-label="add"
                            onClick={(e) => handleAddClick(e, index)}
                          >
                            <AddIcon id={`${index}`} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Formik
        initialValues={initialValues}
        // validationSchema={TeacherFormSchema}
        onSubmit={handleSubmit}
      >
        {(props) => {
          const { handleSubmit } = props;
          return (
            <Popup
              maxWidth="md"
              open={showPopup}
              setOpen={setshowPopup}
              popupTitle={popupTitle}
              popupContent={<ClassForm defaultValue={classInfo} />}
              handleOk={handleSubmit}
              haveOk={true}
            />
          );
        }}
      </Formik>
    </>
  );
};

export default ClassTab;

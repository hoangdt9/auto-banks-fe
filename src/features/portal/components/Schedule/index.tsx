import { useEffect, useState } from "react";
import {
  Badge,
  Tooltip,
  TooltipProps,
  tooltipClasses,
  Autocomplete,
  TextField,
  Box,
  Grid,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableBody,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import ClassIcon from "@mui/icons-material/Class";
import ClearIcon from "@mui/icons-material/Clear";
import locationApi from "../../../../api/locationApi";
import { useQuery } from "react-query";
import classApi from "../../../../api/classApi";
import { OptionType } from "../../../../custom-fields/AutocompleteField";
import teacherApi from "../../../../api/teacherApi";
import { ITeacher } from "../TeacherForm";
import styles from "./style.module.scss";
import { tokens } from "../../../../theme";
import { IClass } from "../../../../types";

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

export interface IClassroom {
  class_id: string;
  id: number;
  is_open: boolean;
  start_at: string;
  end_at: string;
  day_of_week: number;
  location_name: string;
  name: string;
  student: Array<number>;
  teacher: Array<number>;
  type: string;
}

interface IProps {
  classes: IClass[];
  setClasses: React.Dispatch<React.SetStateAction<IClass[]>>;
  setFieldValue?: any;
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

const Schedule = (props: IProps): JSX.Element => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { classes, setClasses, setFieldValue } = props;
  const [location, setLocation] = useState<OptionType>();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { data: locationData, refetch: refetchLocation } = useQuery(
    "location",
    locationApi.getLocations,
    { enabled: false }
  );

  const { data: classData } = useQuery(["class", location?.id], () =>
    classApi.getClassesByLocation(location?.id)
  );

  const morning: WeekType = [[], [], [], [], [], [], []];
  const afternoon: WeekType = [[], [], [], [], [], [], []];

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

  classData?.forEach((item: IClassroom, index: number) => {
    if (item?.is_open === true && convertTime(item?.start_at) !== "noData") {
      if (convertTime(item?.start_at) === "morning") {
        morning[item?.day_of_week].push(item);
      } else {
        afternoon[item?.day_of_week].push(item);
      }
    }
  });

  const LOCATIONS = locationData?.results.map((item: any) => {
    return { label: item.name, id: item.location_id };
  });

  const handleChange = (e: any, value: any) => {
    setLocation(value);
  };

  const handleSelection = (classItem: any) => {
    if (classes?.some((e) => e.id === classItem.id)) {
      const classData = classes.filter((c) => c.id !== classItem.id);
      setClasses(classData);
      setFieldValue("classes", classData);
    } else {
      const classData = [...classes, classItem];
      setClasses(classData);
      setFieldValue("classes", classData);
    }
  };

  useEffect(() => {
    refetchLocation();
  }, [locationData]);

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
            isOptionEqualToValue={(option: OptionType, value: OptionType) =>
              option?.label === value?.label
            }
            getOptionLabel={(option: OptionType) => option?.label}
            options={LOCATIONS ?? []}
            value={location || null}
            // sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Cơ sở" size="small" />
            )}
            onChange={handleChange}
          />
        </Grid>

        <Grid item>
          <IconButton aria-label="list" onClick={handleClick}>
            <Badge badgeContent={classes?.length} color="primary">
              <ClassIcon color="action" />
            </Badge>
          </IconButton>
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <List>
              {classes?.length > 0 ? (
                classes?.map((item, index) => (
                  <ListItem key={`classList${index}`}>
                    <ListItemButton>
                      <ListItemText primary={`Lớp ${item?.class_id}`} />
                    </ListItemButton>
                    <IconButton
                      onClick={() => {
                        handleSelection(item);
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="Không có lớp nào được chọn" />
                </ListItem>
              )}
            </List>
          </Popover>
        </Grid>
      </Grid>

      <Box className={styles.button} sx={{ p: 1 }}>
        <TableContainer component={Paper}>
          <Table className={styles.schedule_table}>
            <TableHead>
              <TableRow className={styles.first_row}>
                <TableCell
                  sx={{ border: `1px solid ${colors.black[100]}` }}
                  align="center"
                  className={styles.class_session_col}
                >
                  {" "}
                </TableCell>
                <TableCell
                  sx={{
                    border: `1px solid ${colors.black[100]}`,
                    fontWeight: "bold",
                  }}
                  align="center"
                  className={styles.week_days}
                >
                  Chủ nhật
                </TableCell>
                <TableCell
                  sx={{
                    border: `1px solid ${colors.black[100]}`,
                    fontWeight: "bold",
                  }}
                  align="center"
                  className={styles.week_days}
                >
                  Thứ 2
                </TableCell>
                <TableCell
                  sx={{
                    border: `1px solid ${colors.black[100]}`,
                    fontWeight: "bold",
                  }}
                  align="center"
                  className={styles.week_days}
                >
                  Thứ 3
                </TableCell>
                <TableCell
                  sx={{
                    border: `1px solid ${colors.black[100]}`,
                    fontWeight: "bold",
                  }}
                  align="center"
                  className={styles.week_days}
                >
                  Thứ 4
                </TableCell>
                <TableCell
                  sx={{
                    border: `1px solid ${colors.black[100]}`,
                    fontWeight: "bold",
                  }}
                  align="center"
                  className={styles.week_days}
                >
                  Thứ 5
                </TableCell>
                <TableCell
                  sx={{
                    border: `1px solid ${colors.black[100]}`,
                    fontWeight: "bold",
                  }}
                  align="center"
                  className={styles.week_days}
                >
                  Thứ 6
                </TableCell>
                <TableCell
                  sx={{
                    border: `1px solid ${colors.black[100]}`,
                    fontWeight: "bold",
                  }}
                  align="center"
                  className={styles.week_days}
                >
                  Thứ 7
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow className={styles.class_session_row}>
                <TableCell
                  sx={{
                    border: `1px solid ${colors.black[100]}`,
                    fontWeight: "bold",
                  }}
                  align="center"
                >
                  Sáng
                </TableCell>
                {morning.map((day, index) => {
                  return (
                    <TableCell
                      sx={{ border: `1px solid ${colors.black[100]}` }}
                      align="center"
                      key={`morning${index}`}
                    >
                      <Stack spacing={1} direction="column">
                        {day.map((classroom, index) => {
                          return (
                            <HtmlTooltip
                              key={`morningClass${index}`}
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
                              <Button
                                variant={
                                  classes?.some((e) => e.id === classroom.id)
                                    ? "contained"
                                    : "outlined"
                                }
                                id={`${classroom?.id}`}
                                onClick={() => {
                                  handleSelection(classroom);
                                }}
                              >
                                {classroom?.name}
                                <br />
                                {classroom?.start_at?.slice(0, 2)}:
                                {classroom?.start_at?.slice(3, 5)} -{" "}
                                {classroom?.end_at?.slice(0, 2)}:
                                {classroom?.end_at?.slice(3, 5)}
                              </Button>
                            </HtmlTooltip>
                          );
                        })}
                      </Stack>
                    </TableCell>
                  );
                })}
              </TableRow>
              <TableRow className={styles.class_session_row}>
                <TableCell
                  sx={{
                    border: `1px solid ${colors.black[100]}`,
                    fontWeight: "bold",
                  }}
                  align="center"
                >
                  Chiều
                </TableCell>
                {afternoon.map((day, index) => {
                  return (
                    <TableCell
                      sx={{ border: `1px solid ${colors.black[100]}` }}
                      align="center"
                      key={`afternoon${index}`}
                    >
                      <Stack spacing={1} direction="column">
                        {day.map((classItem, index) => {
                          return (
                            <HtmlTooltip
                              key={`afternoonClass${index}`}
                              title={
                                <>
                                  {"Mã lớp học: " + classItem?.class_id}
                                  <br />
                                  {"Địa chỉ lớp học: " + location?.label}
                                  <br />
                                  <TeacherDetail classId={classItem?.id} />
                                </>
                              }
                            >
                              <Button
                                variant={
                                  classes?.some((e) => e.id === classItem.id)
                                    ? "contained"
                                    : "outlined"
                                }
                                id={`${classItem?.id}`}
                                onClick={() => {
                                  handleSelection(classItem);
                                }}
                              >
                                {classItem?.name}
                                <br /> {classItem?.start_at?.slice(0, 2)}:
                                {classItem?.start_at?.slice(3, 5)} -{" "}
                                {classItem?.end_at?.slice(0, 2)}:
                                {classItem?.end_at?.slice(3, 5)}
                              </Button>
                            </HtmlTooltip>
                          );
                        })}
                      </Stack>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default Schedule;

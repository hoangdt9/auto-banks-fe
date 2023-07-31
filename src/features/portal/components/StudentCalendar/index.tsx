import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import vi from "@fullcalendar/core/locales/vi";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  useTheme,
  Tooltip,
} from "@mui/material";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import { useLocation } from "react-router-dom";

import { tokens } from "../../../../theme";
import studentApi from "../../../../api/studentApi";
import "./styles.scss";
import Header from "../../../../components/Header";
import { formatDate } from "@fullcalendar/core";

interface IProps {
  setActive: React.Dispatch<React.SetStateAction<any>>;
}

const StudentCalendar = (props: IProps): JSX.Element => {
  const { setActive } = props;
  const { state }: any = useLocation();
  const student = state?.student;

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [events, setEvents] = useState<any[]>([]);

  const calendarComponentRef = useRef<any>();

  const handleDateClick = (selected: any) => {
    const title = prompt("Please enter a new title for your event");
    const calendarApi = selected.view.calendar;
    calendarApi.unselect();

    if (title) {
      calendarApi.addEvent({
        id: `${selected.dateStr}-${title}`,
        title,
        start: selected.startStr,
        end: selected.endStr,
        allDay: selected.allDay,
      });
    }
  };

  const deleteEvent = (event: any) => {
    if (
      window.confirm(
        `Are you sure you want to delete the event '${event.title}'`
      )
    ) {
      event.remove();
    }
  };

  const goToDate = (event: any) => {
    const { start } = event;
    let calendarApi = calendarComponentRef.current.getApi();
    calendarApi.gotoDate(start); // call a method on the Calendar object
  };

  const className = new Map([
    ["Đi Học", "sideBar__item-on"],
    ["Nghỉ mưa", "sideBar__item-rain"],
    [null, ""],
  ]);

  const SideBarItem = (event: any) => {
    return (
      <ListItem
        onClick={() => goToDate(event)}
        key={event.id}
        sx={{
          backgroundColor: colors.greenAccent[500],
          margin: "10px 0",
          borderRadius: "2px",
        }}
        className={className.get(event.title)}
      >
        <ListItemText
          primary={event.title}
          secondary={
            <Typography>
              {formatDate(event.start, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </Typography>
          }
        />
        <ListItemIcon>
          {event.title === "Đi Học" && <SportsBasketballIcon />}
          {event.title === "Nghỉ mưa" && (
            <ThunderstormIcon sx={{ color: colors.grey[500] }} />
          )}
        </ListItemIcon>
      </ListItem>
    );
  };

  const renderEventContent = (eventInfo: any) => {
    const { event } = eventInfo;
    const { extendedProps } = event;

    return (
      <Tooltip
        title={`${extendedProps.class.name} - ${extendedProps.class.class_id}`}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",

            width: "100%",
            height: "100%",
            borderRadius: 0.5,
            px: 1,
            backgroundColor: colors.greenAccent[500],
          }}
          className={className.get(event.title)}
        >
          {event.title}
          {event.title === "Đi Học" && <SportsBasketballIcon />}
          {event.title === "Nghỉ mưa" && (
            <ThunderstormIcon sx={{ color: colors.grey[500] }} />
          )}
        </Box>
      </Tooltip>
    );
  };

  useEffect(() => {
    setActive({ student: "active" });
  }, [setActive]);

  useEffect(() => {
    const fetchAttendance = async () => {
      const attendances = await studentApi.getAttendances(student.id);

      const events = attendances?.map((attendance: any) => {
        const start = `${attendance.date}T${attendance.class?.start_at}`;
        const end = `${attendance.date}T${attendance.class?.end_at}`;

        return {
          id: attendance.id,
          title: attendance.status,
          // date: attendance.date,
          start: start,
          end: end,
          extendedProps: {
            class: attendance.class,
          },
          color: "transparent",
        };
      });

      setEvents(events);
    };

    fetchAttendance();
  }, [student]);

  return (
    <Box mx="20px">
      <Header title="Lịch Học" subtitle={`${student?.name}`} />
      <Box display="flex" justifyContent="space-between">
        {/* CALENDAR SIDEBAR */}
        <Box
          sx={{
            flex: "1 1 20%",
            px: "15px",
            borderRadius: "4px",
            backgroundColor: colors.black[400],
          }}
        >
          <Typography variant="h5">Lịch sử</Typography>
          <List
            sx={{
              height: "65vh",
              overflowY: "scroll",
            }}
            className="sideBarList"
          >
            {currentEvents.map((event: any) => SideBarItem(event))}
          </List>
        </Box>

        {/* CALENDAR */}
        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            ref={calendarComponentRef}
            height="75vh"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={(selected: any) => goToDate(selected.event)}
            eventsSet={(events: any) => setCurrentEvents(events)}
            events={events}
            eventContent={renderEventContent}
            locale={vi}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default StudentCalendar;

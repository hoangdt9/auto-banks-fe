import { Box } from "@mui/system";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useQuery } from "react-query";

import locationApi from "../../../../api/locationApi";
import BarChart from "../../../../components/BarChart";
import "./style.scss";

export default function StatisticClass(props: any): JSX.Element {
  const { selected } = props;
  const { data } = useQuery("locationStatus", locationApi.getLocationStatus);

  const barChartData = data?.map((location: any) => {
    return {
      name: location.name,
      "cơ sở": location.location_id,
      "Đã nhập học": location.enrolled,
      enrolledColor: "hsl(229, 70%, 50%)",
      "Hẹn học thử": location.appointmentTrial,
      appointmentTrialColor: "hsl(296, 70%, 50%)",
      "Học thử": location.trial,
      trialColor: "hsl(97, 70%, 50%)",
      "Hỏi thông tin": location.question,
      questionColor: "hsl(340, 70%, 50%)",
      "Đã nghỉ học": location.quit,
      quitColor: "hsl(240, 70%, 50%)",
    };
  });

  const keys = [
    "Đã nhập học",
    "Hẹn học thử",
    "Học thử",
    "Hỏi thông tin",
    "Đã nghỉ học",
  ];

  return (
    <Box height="80vh">
      {selected === "Cột" && (
        <>
          <Box sx={{ minWidth: { sm: "80vw", xs: 500 } }} />
          <BarChart
            data={barChartData}
            legendX="Cơ sở"
            legendY="Số học sinh"
            keys={keys}
          />
        </>
      )}
      {selected === "Bảng" && (
        <TableContainer
          component={Paper}
          sx={{ maxHeight: "80vh" }}
          className="scroll"
        >
          <Table sx={{ minWidth: 450 }} aria-label="statistic table">
            <TableHead>
              <TableRow>
                <TableCell>Cơ sở / Trạng thái học</TableCell>
                <TableCell align="right">Đã nhập học</TableCell>
                <TableCell align="right">Hẹn học thử</TableCell>
                <TableCell align="right">Học thử</TableCell>
                <TableCell align="right">Hỏi thông tin</TableCell>
                <TableCell align="right">Đã nghỉ học</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((row: any) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="center">{row.enrolled}</TableCell>
                  <TableCell align="center">{row.appointmentTrial}</TableCell>
                  <TableCell align="center">{row.trial}</TableCell>
                  <TableCell align="center">{row.question}</TableCell>
                  <TableCell align="center">{row.quit}</TableCell>
                </TableRow>
              ))}
              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  color: "#c3e3f7",
                }}
              >
                <TableCell component="th" scope="row">
                  Tổng
                </TableCell>
                <TableCell align="center">0</TableCell>
                <TableCell align="center">0</TableCell>
                <TableCell align="center">0</TableCell>
                <TableCell align="center">0</TableCell>
                <TableCell align="center">0</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

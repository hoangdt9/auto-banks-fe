import { Box } from "@mui/system";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useQuery } from "react-query";
import locationApi from "../../../../api/locationApi";

export default function StatisticPayment(): JSX.Element {
  const { data } = useQuery("locationStatus", locationApi.getPayment);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Cơ sở / Trạng thái nộp HP</TableCell>
            <TableCell align="right">Số học sinh đã nộp HP</TableCell>
            <TableCell align="right">Tổng số tiền HP đã nộp</TableCell>
            <TableCell align="right">Số học sinh chưa nộp HP</TableCell>
            <TableCell align="right">Tổng số tiền HP chưa nộp</TableCell>
            <TableCell align="right">Số học sinh sắp hết HP</TableCell>
            <TableCell align="right">Tổng số tiền</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row: any) => (
            <TableRow
              key={row.location}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="center">{row.havePaid}</TableCell>
              <TableCell align="center">{row.totalTuition}</TableCell>
              <TableCell align="center">{row.haveNotPaid}</TableCell>
              <TableCell align="center">{row.totalNotPaid}</TableCell>
              <TableCell align="center">{row.almostDone}</TableCell>
              <TableCell align="center">{row.totalFee}</TableCell>
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
            <TableCell align="center"></TableCell>
            <TableCell align="center"></TableCell>
            <TableCell align="center"></TableCell>
            <TableCell align="center"></TableCell>
            <TableCell align="center"></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

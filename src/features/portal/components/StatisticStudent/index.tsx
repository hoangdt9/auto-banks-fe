import { Divider, Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import locationApi from "../../../../api/locationApi";
import vi from "../../../../assets/languages/vi.json";
import { IOption } from "../DiemDanhToolbar";
import StatisticToolbar from "../StatisticToolbar";
import { Dayjs } from "dayjs";

export default function StatisticStudent(): JSX.Element {
  const [pageSize, setPageSize] = useState(5);
  const [location, setLocation] = useState("");
  const [dateStart, setDateStart] = useState<Dayjs | null>(null);
  const [dateEnd, setDateEnd] = useState<Dayjs | null>(null);

  function createData(
    id: number,
    classroom: string,
    present: number,
    authorized: number,
    unauthorized: number,
    raining: number,
    holidays: number,
    other: number
  ) {
    return {
      id,
      classroom,
      present,
      authorized,
      unauthorized,
      raining,
      holidays,
      other,
    };
  }

  const rows = [
    createData(1, "Frozen yoghurt", 159, 6.0, 24, 4.0, 9, 9),
    createData(2, "Ice cream sandwich", 237, 9.0, 37, 4.3, 9, 9),
    createData(3, "Eclair", 262, 16.0, 24, 6.0, 9, 9),
    createData(4, "Cupcake", 305, 3.7, 67, 4.3, 9, 9),
    createData(5, "Gingerbread", 356, 16.0, 49, 3.9, 9, 9),
  ];

  const COLUMNS: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      description: "ID",
      width: 55,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "classroom",
      headerName: "Lớp học",
      description: "Lớp học",
      width: 150,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      // flex: 1,
    },
    {
      field: "present",
      headerName: "Đi học",
      description: "Đi học",
      headerAlign: "center",
      align: "center",
      width: 120,
    },
    {
      field: "authorized",
      headerName: "Nghỉ có phép",
      description: "Nghỉ có phép",
      headerAlign: "center",
      align: "center",
      width: 120,
    },
    {
      field: "unauthorized",
      headerName: "Nghỉ không phép",
      description: "Nghỉ không phép",
      align: "center",
      headerAlign: "center",
      width: 100,
      // valueGetter: (params: GridValueGetterParams) => {
      //   const d = new Date(params.row.dob);
      //   return params.row.dob ? d.getFullYear() : "";
      // },
    },
    {
      field: "raining",
      headerName: "Nghỉ mưa",
      description: "Nghỉ mưa",
      width: 120,
      align: "center",
      headerAlign: "center",
      // flex: 1,
    },
    {
      field: "holidays",
      headerName: "Nghỉ lễ",
      description: "Nghỉ lễ",
      align: "center",
      headerAlign: "center",
      sortable: false,
      maxWidth: 120,
      // renderCell: (params) => (
      //   <img src={params.value} className="avatar" alt="" />
      // ),
      // flex: 1,
    },
    {
      field: "other",
      headerName: "Nghỉ khác",
      description: "Nghỉ khác",
      width: 75,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
    },
  ];

  const { data: locationData, refetch: refetchLocation } = useQuery(
    "location",
    locationApi.getLocations,
    { enabled: false }
  );

  useEffect(() => {
    refetchLocation();
  }, [locationData, refetchLocation]);

  const LOCATIONS: IOption[] = locationData?.results.map((item: any) => {
    return { label: item.name, id: item.location_id };
  });

  return (
    <Box sx={{ height: { sm: "75vh", xs: "65vh" }, minHeight: 400 }}>
      <DataGrid
        localeText={vi}
        rows={rows ?? []}
        columns={COLUMNS}
        // pageSize={pageSize}
        // onPageSizeChange={(newPage) => {
        //   setPageSize(newPage);
        // }}
        // rowsPerPageOptions={[5, 10, 20, 30, 50]}
        components={{
          Toolbar: () => (
            <>
              <StatisticToolbar
                locationOption={LOCATIONS}
                setLocation={setLocation}
                dateStart={dateStart}
                setDateStart={setDateStart}
                dateEnd={dateEnd}
                setDateEnd={setDateEnd}
                location={location}
              />
              <Divider sx={{ mt: 0.5 }} />
            </>
          ),
        }}
        // experimentalFeatures={{ newEditingApi: true }}
      />
    </Box>
  );
}

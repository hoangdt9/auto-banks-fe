import { Divider, Box } from "@mui/material";
import {
  DataGrid,
  GridColDef,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import locationApi from "../../../../api/locationApi";
import vi from "../../../../assets/languages/vi.json";
import { IOption } from "../DiemDanhToolbar";
import StatisticToolbar from "../StatisticToolbar";
import { Dayjs } from "dayjs";

export default function StatisticRevenue(): JSX.Element {
  const [pageSize, setPageSize] = useState(5);
  const [location, setLocation] = useState("");
  const [dateStart, setDateStart] = useState<Dayjs | null>(null);
  const [dateEnd, setDateEnd] = useState<Dayjs | null>(null);

  function createData(id: number, classroom: string, revenue: number) {
    return {
      id,
      classroom,
      revenue,
    };
  }

  const rows = [
    createData(1, "Frozen yoghurt", 159),
    createData(2, "Ice cream sandwich", 237),
    createData(3, "Eclair", 262),
    createData(4, "Cupcake", 305),
    createData(5, "Gingerbread", 356),
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
      field: "revenue",
      headerName: "Đi học",
      description: "Đi học",
      headerAlign: "center",
      align: "center",
      width: 120,
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
    <Box sx={{ height: 450 }}>
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

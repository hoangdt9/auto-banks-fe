import { useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import vi from "../../../../assets/languages/vi.json";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import "./styles.scss";
import { IRequestBank } from "../../../../types";
import { useQuery } from "react-query";
import bankApi from "../../../../api/bankApi";
import CustomToolbar from "../../../../custom-fields/CustomToolBar";
import { tokens } from "../../../../theme";

interface IProps {
  setActive: React.Dispatch<React.SetStateAction<any>>;
  active: any;
}


const COLUMNS: GridColDef[] = [
  {
    field: "balance",
    headerName: "Balance",
    description: "Balance",
    width: 100,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "credit",
    headerName: "Credit",
    description: "Credit",
    width: 100,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "date",
    headerName: "Date",
    description: "Date",
    width: 100,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "Debit",
    headerName: "Debit",
    description: "Debit",
    width: 100,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "transaction_detail",
    headerName: "Details",
    description: "Details",
    flex: 1,
  },
];


const Dashboard = (props: IProps): JSX.Element => {
  const { setActive } = props;

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 20,
    page: 0,
  });

  const [params, setParams] = useState<IRequestBank>({
    pageSize: paginationModel.pageSize,
    pageNumber: paginationModel.page,
  });

  const { data, isLoading } = useQuery(["banks", params], () =>
    bankApi.getBanks(params)
  );

  const totalRowCount = data?.totalRowCount ?? 0
  const [rowCountState, setRowCountState] = useState(totalRowCount);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  const banks = data?.content?.results ?? []

  const transaction = banks?.map((bank: any) => bank?.transaction)

  const rows = transaction?.map((t: any, index: number) => {
    return {
      id: index,
      balance: t?.balance,
      credit: t?.credit,
      date: t?.date,
      debit: t?.debit,
      transaction_detail: t?.transaction_detail,
    }
  })

  useEffect(() => {
    setRowCountState((prevRowCountState: any) =>
      totalRowCount !== undefined ? totalRowCount : prevRowCountState
    );
  }, [totalRowCount, setRowCountState]);

  useEffect(() => {
    setActive({ dashboard: "active" });
  }, [setActive]);

  return (
    <Box
      px={1}
      sx={{
        "& .MuiDataGrid-root": {
          border: "none",
        },
        "& .MuiDataGrid-cell": {
          borderBottom: "none",
        },
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: colors.grey[900],
        },
        ".MuiDataGrid-columnHeaderTitle": {
          fontSize: 14,
          fontWeight: "bold",
        },
        width: "100%",
      }}
    >
      <DataGrid
        autoHeight
        localeText={vi}
        rows={rows ?? []}
        columns={COLUMNS}
        components={{ Toolbar: CustomToolbar }}
        paginationModel={paginationModel}
        rowCount={rowCountState}
        onPaginationModelChange={setPaginationModel}
        paginationMode="server"
        onRowSelectionModelChange={(newRowSelectionModel: any) => {
          setRowSelectionModel(newRowSelectionModel);
        }}
        rowSelectionModel={rowSelectionModel}
        loading={isLoading}
        keepNonExistentRowsSelected
        pageSizeOptions={[5, 10, 20, 30, 50]}
      />
    </Box>
  );
};

export default Dashboard;

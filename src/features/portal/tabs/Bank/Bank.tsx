import { useEffect } from "react";
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../../theme";

import "./styles.scss";
import { Field, Formik } from "formik";
import { BankSchema } from "../../../../utils/validation";
import InputField from "../../../../custom-fields/InputField";
import PasswordField from "../../../../custom-fields/PasswordField";
import DateTimeField from "../../../../custom-fields/DateTimeField";
import { useMutation } from "react-query";
import bankApi from "../../../../api/bankApi";
import dayjs from "dayjs";
import { LoadingButton } from "@mui/lab";

interface IProps {
    setActive: React.Dispatch<React.SetStateAction<any>>;
    active: any;
}

interface IRow {
    id: string | number;
    bankName: string | JSX.Element;
    username: string | JSX.Element;
    password: string | JSX.Element;
}

function createData(row: any) {

    const { id, bankName } = row;

    const username = (
        <Field
            name="username"
            component={InputField}
            minWidth={100}
            fullWidth
            label="Account"
        />
    );

    const password = (
        <Field
            name="password"
            component={PasswordField}
            minWidth={100}
            fullWidth
            label="Password"
        />
    );

    const fromDate = (
        <Field
            name="fromDate"
            component={DateTimeField}
            minWidth={100}
            fullWidth
            label="From Date"
        />
    );

    const toDate = (
        <Field
            name="toDate"
            component={DateTimeField}
            minWidth={100}
            fullWidth
            label="To Date"
        />
    );

    return { id, bankName, username, password, fromDate, toDate };
}

const Bank = (props: IProps): JSX.Element => {
    const { setActive } = props;

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const rows = [createData({
        id: 1,
        bankName: "VietcomBank",
    })]

    const initialValues = {
        bankName: "",
        username: "",
        password: "",
        fromDate: "",
        toDate: "",
    };



    const syncData = useMutation(bankApi.syncVietcombank, {
        onSuccess(data, variables, context) {
            console.log("onSuccess", data, variables, context);
        },
        onError(error, variables, context) {
            console.log("onError", error, variables, context);
        },
    });

    const handleSubmit = (values: any) => {
        const { username, password, fromDate, toDate } = values
        const timeRange = `${dayjs(fromDate).format("DD/MM/YYYY")}-${dayjs(toDate).format("DD/MM/YYYY")}`
        const params = {
            username,
            password,
            timeRange
        }

        syncData.mutate(params);
    };

    useEffect(() => {
        setActive({ bank: "active" });
    }, [setActive]);

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow
                        sx={{
                            "& .MuiTableCell-head": {
                                borderBottom: "1px solid black",
                                fontWeight: "bold",
                                color: colors.black[500],
                            },
                        }}
                    >
                        <TableCell align="center" width="20%">
                            Bank Name
                        </TableCell>
                        <TableCell align="center" width="20%">
                            Bank Account
                        </TableCell>
                        <TableCell align="center" width="20%">
                            Bank Password
                        </TableCell>
                        <TableCell align="center" width="20%">
                            From Date
                        </TableCell>
                        <TableCell align="center" width="20%">
                            To Date
                        </TableCell>
                        <TableCell align="center" width="20%">
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {rows?.map((row: any, index: number) => (
                        <Formik
                            key={index}
                            initialValues={initialValues}
                            validationSchema={BankSchema}
                            onSubmit={handleSubmit}
                            enableReinitialize
                        >
                            {(props) => {
                                const { handleSubmit } = props;
                                return (
                                    <TableRow
                                        sx={{
                                            position: "relative",
                                            verticalAlign: "top",
                                            "&:last-child td, &:last-child th": { border: 0 },
                                            width: "100%",
                                            pb: 5,
                                        }}
                                    >
                                        {/* bankName, username, password, timeRange  */}
                                        <TableCell width="20%" align="center" >
                                            <Typography sx={{ mt: 1.5 }}>
                                                {row.bankName}
                                            </Typography>
                                        </TableCell>
                                        <TableCell width="20%" align="center">{row.username}</TableCell>
                                        <TableCell width="20%" align="center">{row.password}</TableCell>
                                        <TableCell width="20%" align="center">{row.fromDate}</TableCell>
                                        <TableCell width="20%" align="center">{row.toDate}</TableCell>
                                        <TableCell align="center" width="20%">
                                            <LoadingButton
                                                variant="contained"
                                                type="submit"
                                                loading={syncData.isLoading}
                                                sx={{ mt: 1 }}
                                                onClick={() => handleSubmit()}
                                            >
                                                sync
                                            </LoadingButton >
                                        </TableCell>

                                    </TableRow>
                                );
                            }}
                        </Formik>
                    ))}

                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default Bank;

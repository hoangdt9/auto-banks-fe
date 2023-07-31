import { useState } from "react";

import { Autocomplete, Box, TextField } from "@mui/material";
import { GridToolbarContainer } from "@mui/x-data-grid";
import { Dayjs } from "dayjs";
import { FastField, Field, Formik } from "formik";
import AutocompleteField from "../../../../custom-fields/AutocompleteField";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DateTimeField from "../../../../custom-fields/DateTimeField";

const StatisticStudentToolbar = (props: any) => {
  const {
    locationOption,
    setLocation,
    setDateStart,
    setDateEnd,
  } = props;

  const initialValues = {
    location: null,
    startDate: null,
    endDate: null,
  };

  const handleSubmit = () => {};

  return (
    <Formik
      initialValues={initialValues}
      // validationSchema={AttendanceSchema}
      onSubmit={handleSubmit}
    >
      {(props) => {
        const { handleSubmit } = props;

        return (
          <GridToolbarContainer>
            <Field
              name="location"
              component={AutocompleteField}
              label="Cơ sở"
              options={locationOption ?? []}
              size="small"
              width={220}
              setLocation={setLocation}
            />

            <FastField
              name="startDate"
              component={DateTimeField}
              label="Từ"
              type="statistic"
              setCallBackDate={setDateStart}
              size="small"
            />

            <FastField
              name="endDate"
              component={DateTimeField}
              label="Đến"
              type="statistic"
              setCallBackDate={setDateEnd}
              size="small"
            />
          </GridToolbarContainer>
        );
      }}
    </Formik>
  );
};
export default StatisticStudentToolbar;

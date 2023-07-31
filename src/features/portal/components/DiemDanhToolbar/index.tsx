import {
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarDensitySelector,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid";
import { Button, Box, Divider } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { Field } from "formik";
import AutocompleteField from "../../../../custom-fields/AutocompleteField";

export interface IOption {
  label: string;
  id: string;
}

interface IProps {
  locationOption?: IOption[] | null;
  classOption?: IOption[] | null;
  setLocation?: any;
  setClassId?: any;
}

function DiemDanhToolbar() {
  return (
    <>
      <GridToolbarContainer>
        <Box width={450} height={45} />
        <GridToolbarColumnsButton sx={{ marginLeft: "auto" }} />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
        <Button type="submit" variant="text" startIcon={<SaveIcon />}>
          Lưu
        </Button>
      </GridToolbarContainer>
      <Divider />
    </>

  );
}

const DiemDanhToolbarXS = (props: IProps) => {
  const { locationOption, classOption, setLocation, setClassId } = props;
  return (
    <>
      <Box sx={{ my: 1, display: { xs: "block", md: "none" } }}>
        <Field
          name="location"
          component={AutocompleteField}
          label="Cơ sở"
          options={locationOption}
          setLocation={setLocation}
          type="diemdanh"
          setClassId={setClassId}
          size="small"
        />
      </Box>

      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <Field
          name="class"
          component={AutocompleteField}
          label="Lớp"
          options={classOption}
          type="diemdanh"
          setClassId={setClassId}
          size="small"
        />
      </Box>
    </>
  );
};

export { DiemDanhToolbar, DiemDanhToolbarXS };

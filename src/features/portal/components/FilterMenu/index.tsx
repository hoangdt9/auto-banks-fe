import React, {
  SetStateAction,
  Dispatch,
  FormEvent,
  useEffect,
  useState,
} from "react";

import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Tooltip,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Divider,
  Box,
} from "@mui/material";
import { useQuery } from "react-query";
import { FastField, Field, Formik, Form } from "formik";

import locationApi from "../../../../api/locationApi";
import classApi from "../../../../api/classApi";
import FilterSelectField from "../../../../custom-fields/FilterSelectField";
import "./styles.scss";
import { IRequestStudents } from "../../../../types";

interface IFilter {
  dow: any;
  class_type: any;
  status: any;
  location: any;
  class: any;
}

interface IFilterMenu {
  setParams: Dispatch<SetStateAction<IRequestStudents>>;
  filterType: string;
}

const initialValues = {
  dow: null,
  class_type: null,
  status: null,
  location: null,
  class: null,
} as FormEvent<HTMLFormElement> & IFilter;

const DAY_OF_WEEK_OPTIONS = [
  { title: "Thứ 2", id: 1 },
  { title: "Thứ 3", id: 2 },
  { title: "Thứ 4", id: 3 },
  { title: "Thứ 5", id: 4 },
  { title: "Thứ 6", id: 5 },
  { title: "Thứ 7", id: 6 },
  { title: "Chủ Nhật", id: 0 },
];

const CLASS_TYPE_OPTIONS = [
  { title: "A", id: "A" },
  { title: "B", id: "B" },
  { title: "C", id: "C" },
];

const STATUS_OPTIONS = [
  { title: "Đã nhập học", id: "DAHOC" },
  { title: "Hẹn học thử", id: "HENHOC" },
  { title: "Học thử", id: "HOCTHU" },
  { title: "Hỏi thông tin", id: "HOI" },
  { title: "Đã nghỉ học", id: "NGHIHOC" },
];

const LIST_OPTIONS = [
  {
    id: "2",
    name: "dow",
    label: "Thứ",
    options: DAY_OF_WEEK_OPTIONS,
  },
  {
    id: "4",
    name: "class_type",
    label: "Loại lớp",
    options: CLASS_TYPE_OPTIONS,
  },
  {
    id: "5",
    name: "status",
    label: "Trạng thái",
    options: STATUS_OPTIONS,
  },
];

const ITEM_HEIGHT = 48;

FilterMenu.defaultProps = {
  setClasses: () => { },
  setStatus: () => { },
  filterType: "",
};

export default function FilterMenu(props: IFilterMenu): JSX.Element {
  const { setParams, filterType } = props;

  const [list, setList] = useState<null | any>(LIST_OPTIONS);
  const [typeOption, setTypeOption] = useState<string>("");
  const [locationOption, setLocationOption] = useState<string>("");
  const [dowOption, setDowOption] = useState<number>();

  const { data: locationData } = useQuery("location", locationApi.getLocations);
  const { data: classData } = useQuery(
    ["class", typeOption, locationOption, dowOption ?? ""],
    () => classApi.getClasses(typeOption, locationOption, dowOption ?? "")
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [filterItems, setFilteritems] = useState<null | any>(list);

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = (e: any, name: string, setFieldValue: any) => {
    e.preventDefault();
    const filterList = filterItems.filter((item: any) => item.name !== name);
    setFilteritems(filterList);
    setFieldValue(name, null);
  };

  const handleAddClick = (e: any) => {
    e.preventDefault();

    for (const i in list) {
      if (!filterItems.includes(list[i])) {
        const filterList = [...filterItems, list[i]];
        filterList.sort((a: any, b: any) => a.id.localeCompare(b.id));
        setFilteritems(filterList);
        return;
      }
    }
  };

  const handleSubmit = async (values: IFilter) => {
    const { location, class_type, dow } = values;

    const classes = classData?.results.map((c: any) => c?.id) ?? [];
    setParams(values.class ? [values.class.id] : classes);

    if (filterType === "student") {
      const { status } = values;
      setParams && setParams(prev => {
        return {
          ...prev,
          status: status?.id
        }
      });
    }

    handleClose();
  };

  useEffect(() => {
    if (!locationData) return;

    const LOCATIONS = locationData?.results.map((item: any) => {
      return { title: item.name, id: item.location_id };
    });

    const CLASSES = classData?.results.map((item: any) => {
      const title = item.name
        ? `${item.class_id} - ${item.name}`
        : item.class_id;
      return {
        title: title,
        id: item.id,
        class_type: item.type,
        dow: item.day_of_week,
        location: item.location,
        location_name: item.location_name,
      };
    });

    const newList = [
      ...LIST_OPTIONS,
      {
        id: "1",
        name: "location",
        label: "Cơ sở",
        options: LOCATIONS ?? [],
      },
      {
        id: "3",
        name: "class",
        label: "Lớp",
        options: CLASSES ?? [],
      },
    ];

    newList.sort((a: any, b: any) => a.id.localeCompare(b.id));
    setList(newList);
    setFilteritems(newList);
  }, [locationData, classData]);

  return (
    <div>
      <Tooltip title="Lọc danh sách học sinh">
        <IconButton
          aria-label="filter"
          id="filter-button"
          aria-controls={open ? "filter-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleFilterClick}
          sx={{ color: { sm: "#fff" } }}
        >
          <FilterListIcon />
        </IconButton>
      </Tooltip>

      <Formik
        initialValues={initialValues}
        // validationSchema={FilterMenuSchema}
        onSubmit={handleSubmit}
      >
        {(props) => {
          const { setFieldValue } = props;
          return (
            <Menu
              id="filter-menu"
              MenuListProps={{
                "aria-labelledby": "filter-button",
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                style: {
                  maxHeight: ITEM_HEIGHT * 5.5,
                  width: "100%",
                  maxWidth: 260,
                },
              }}
            >
              {filterItems.map((item: any, index: number) => {
                return filterType !== "student" &&
                  item.name === "status" ? null : (
                  <MenuItem key={item.id} sx={{ m: -1 }}>
                    <IconButton
                      aria-label="delete"
                      size="small"
                      onClick={(e) =>
                        handleDeleteClick(e, item.name, setFieldValue)
                      }
                      disabled={item.name === "location"}
                    >
                      {item.name !== "location" ? (
                        <ClearIcon fontSize="inherit" />
                      ) : (
                        <Box component="span" sx={{ ml: 2 }} />
                      )}
                    </IconButton>

                    {item.name === "class" ? (
                      <Field
                        name={item?.name}
                        component={FilterSelectField}
                        item={list[index]}
                      />
                    ) : (
                      <FastField
                        name={item?.name}
                        component={FilterSelectField}
                        item={list[index]}
                        setTypeOption={setTypeOption}
                        setLocationOption={setLocationOption}
                        setDowOption={setDowOption}
                      />
                    )}
                  </MenuItem>
                );
              })}

              <br />
              <Divider sx={{ ml: 2 }} />

              <Form className="btnGroup">
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  sx={{ ml: 1 }}
                  onClick={handleAddClick}
                  style={{ textTransform: "none" }}
                >
                  Thêm
                </Button>
                <Button
                  type="submit"
                  size="small"
                  startIcon={<FilterListIcon />}
                  style={{ textTransform: "none" }}
                >
                  Lọc
                </Button>
              </Form>
            </Menu>
          );
        }}
      </Formik>
    </div>
  );
}

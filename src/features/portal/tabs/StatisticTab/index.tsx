import { useEffect, useState } from "react";
import StatisticClass from "../../components/StatisticClass";
import { Box, Tabs, Tab, Typography, MenuItem, useTheme } from "@mui/material";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import TableViewIcon from "@mui/icons-material/TableView";

import StatisticPayment from "../../components/StatisticPayment";
import StatisticStudent from "../../components/StatisticStudent";
import { tokens } from "../../../../theme";
import "./style.scss";
import StatisticRevenue from "../../components/StatisticRevenue";

interface IProps {
  setActive: React.Dispatch<React.SetStateAction<any>>;
}

const Item = ({ title, icon, select, setSelect }: any) => {
  const theme = useTheme();
  const colors: any = tokens(theme.palette.mode);

  return (
    <MenuItem
      sx={{
        color: select === title ? colors.blueAccent[500] : colors.black[700],
        ml: 1,
      }}
      onClick={() => setSelect(title)}
    >
      {icon}
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

const StatisticTab = (props: IProps): JSX.Element => {
  const { setActive } = props;

  const [tabId, setTabId] = useState(0);
  const [selected, setSelected] = useState<string>("");

  const theme = useTheme();
  const colors: any = tokens(theme.palette.mode);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabId(newValue);
  };

  useEffect(() => {
    setActive({ statistic: "active" });
  }, [setActive]);

  useEffect(() => {
    tabId !== 0 && setSelected("Bảng");
  }, [tabId]);

  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <Box
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
        sx={{ p: 3, overflowX: "auto" }}
      >
        {value === index && children}
      </Box>
    );
  }

  const tabsArr = [
    {
      label: "Thống kê",
      disabled: true,
    },
    {
      label: "Tình trạng học",
    },
    {
      label: "Tình trạng nộp học phí",
    },
    {
      label: "Tình trạng đi học",
    },
    {
      label: "Doanh thu",
    },
  ];

  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "background.paper",
          display: { xs: "none", sm: "flex" },
          height: "89vh",
        }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={tabId}
          onChange={handleChange}
          sx={{ borderRight: 1, borderColor: "divider", minWidth: "150px" }}
        >
          {tabsArr.map((item: any, index: number) => (
            <Tab
              key={index}
              {...item}
              sx={{
                alignItems: "flex-start",
                color: colors.black[100],
                ml: item.label !== "Thống kê" && 1,
              }}
            />
          ))}

          {tabId > 0 && (
            <Tab sx={{ alignItems: "flex-start" }} label="Biểu đồ" disabled />
          )}
          {tabId > 0 && (
            <Item
              tabId={tabId}
              title="Bảng"
              icon={<TableViewIcon />}
              select={selected}
              setSelect={setSelected}
            />
          )}
          {(tabId === 1 || tabId === 2) && (
            <Item
              tabId={tabId}
              title="Cột"
              icon={<BarChartOutlinedIcon />}
              select={selected}
              setSelect={setSelected}
            />
          )}
        </Tabs>

        <TabPanel value={tabId} index={1}>
          <StatisticClass selected={selected} />
        </TabPanel>
        <TabPanel value={tabId} index={2}>
          <StatisticPayment />
        </TabPanel>
        <TabPanel value={tabId} index={3}>
          <StatisticStudent />
        </TabPanel>
        <TabPanel value={tabId} index={4}>
          <StatisticRevenue />
        </TabPanel>
      </Box>

      {/* Mobile reponsive */}
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "background.paper",
          display: { xs: "flex", sm: "none" },
          overflow: "scroll",
          height: "92vh",
        }}
        className="scroll"
      >
        <Box>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={tabId}
            onChange={handleChange}
            sx={{ borderRight: 1, borderColor: "divider", minWidth: "150px" }}
          >
            <Tab sx={{ alignItems: "flex-start" }} label="Thống kê" disabled />
            <Tab
              sx={{ alignItems: "flex-start", color: colors.black[100], ml: 1 }}
              label="Tình trạng học"
            />
            <Tab
              sx={{ alignItems: "flex-start", color: colors.black[100], ml: 1 }}
              label="Tình trạng nộp học phí"
            />
            <Tab
              sx={{ alignItems: "flex-start", color: colors.black[100], ml: 1 }}
              label="Tình trạng đi học"
            />
            <Tab
              sx={{ alignItems: "flex-start", color: colors.black[100], ml: 1 }}
              label="Doanh thu"
            />
            {tabId > 0 && (
              <Tab sx={{ alignItems: "flex-start" }} label="Biểu đồ" disabled />
            )}
            {tabId > 0 && (
              <Item
                tabId={tabId}
                title="Bảng"
                icon={<TableViewIcon />}
                select={selected}
                setSelect={setSelected}
              />
            )}
            {(tabId === 1 || tabId === 2) && (
              <Item
                tabId={tabId}
                title="Cột"
                icon={<BarChartOutlinedIcon />}
                select={selected}
                setSelect={setSelected}
              />
            )}
          </Tabs>
        </Box>

        <TabPanel value={tabId} index={1}>
          <StatisticClass selected={selected} />
        </TabPanel>
        <TabPanel value={tabId} index={2}>
          <StatisticPayment />
        </TabPanel>
        <TabPanel value={tabId} index={3}>
          <StatisticStudent />
        </TabPanel>
        <TabPanel value={tabId} index={4}>
          <StatisticRevenue />
        </TabPanel>
      </Box>
    </>
  );
};

export default StatisticTab;

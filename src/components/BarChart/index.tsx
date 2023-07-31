import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { BasicTooltip } from "@nivo/tooltip";

import { tokens } from "../../theme";

interface IProps {
  data: any;
  legendX: string;
  legendY: string;
  keys: string[];
}

const BarChart = (props: IProps) => {
  const { data, legendX, legendY, keys } = props;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const BarTooltip = (props: any) => {
    return (
      <BasicTooltip
        id={`${props.id} - ${props.data?.name}`}
        value={props.value}
        color={props.color}
        enableChip
      />
    );
  };

  return (
    <ResponsiveBar
      data={data ?? []}
      theme={{
        // added
        tooltip: {
          container: {
            background: "#ffffff",
            color: colors.greenAccent[500],
            fontSize: 12,
          },
        },
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
      }}
      keys={keys}
      indexBy="cơ sở"
      margin={{ top: 5, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "nivo" }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "#38bcb2",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "#eed312",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      borderColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: legendX,
        legendPosition: "middle",
        legendOffset: 45,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: legendY,
        legendPosition: "middle",
        legendOffset: -45,
      }}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      tooltip={BarTooltip}
      role="application"
      barAriaLabel={function (e) {
        return (
          e.id + ": " + e.formattedValue + `thuộc ${legendX}: ` + e.indexValue
        );
      }}
    />
  );
};
export default BarChart;

import grid from "flexboxgrid/dist/flexboxgrid.css";

export default [
  {
    title: "Transaction Type",
    classList: grid["col-xs-2"],
  },
  {
    title: "Transaction ID",
    classList: grid["col-xs-2"],
  },
  {
    title: "Sender",
    classList: grid["col-xs-2"],
  },
  {
    title: "Recipient",
    classList: grid["col-xs-2"],
  },
  {
    title: "Date",
    classList: grid["col-xs-1"],
  },
  {
    title: "Amount",
    classList: `${grid["col-xs-1"]}`,
  },
  {
    title: "Fee",
    classList: `${grid["col-xs-1"]}`,
  },
  {
    title: "Status",
    classList: grid["col-xs-1"],
  },
];

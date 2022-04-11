import React from "react";
import moment from "moment";
import { withTranslation } from "react-i18next";
import i18n from "../../i18n";

const timestampConverters = {
  PHAE: (timestamp) => timestamp * 1000,
};

export const Time = withTranslation()((props) => {
  moment.locale(i18n.language);
  // eslint-disable-next-line new-cap
  const time = moment(timestampConverters.PHAE(props.label));
  return <span>{time.fromNow(true)}</span>;
});

export const DateFromTimestamp = withTranslation()((props) => {
  moment.locale(i18n.language);
  const day = moment(timestampConverters.PHAE(props.time));
  return <span className="date">{day.format("ll")}</span>;
});

export const TimeFromTimestamp = withTranslation()((props) => {
  moment.locale(i18n.language);
  // eslint-disable-next-line new-cap
  const day = moment(timestampConverters.PHAE(props.time));
  return <span className="time">{day.format("LTS")}</span>;
});

export const DateTimeFromTimestamp = withTranslation()((props) => {
  moment.locale(i18n.language);
  const datetime = moment(
    timestampConverters[props.token || "PHAE"](props.time)
  );
  return (
    <span className={`${props.className || ""}`}>
      {props.fulltime
        ? /* istanbul ignore next */
        datetime.format("DD MMM YYYY, hh:mm:ss A")
        : datetime.calendar(null, {
          lastDay: props.t("DD MMM YYYY"),
          sameDay: props.t("hh:mm A"),
          nextDay: props.t("[Tomorrow], hh:mm A"),
          lastWeek: props.t("DD MMM YYYY"),
          nextWeek: props.t("DD MMM YYYY"),
          sameElse: props.t("DD MMM YYYY"),
        })}
    </span>
  );
});

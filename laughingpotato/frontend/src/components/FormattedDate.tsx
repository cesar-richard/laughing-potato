import React from 'react';
import {DateTime} from 'luxon';

const FormattedDate = ({isoString, timezone = 'Europe/Paris'}: { isoString: string, timezone?: string }) => {
  const {timeZoneName, ...format} = DateTime.DATETIME_FULL;
  return (
    <span>
      {DateTime.fromISO(isoString)
        .setZone(timezone)
        .toLocaleString(format)}
    </span>
  );
};

export default FormattedDate;

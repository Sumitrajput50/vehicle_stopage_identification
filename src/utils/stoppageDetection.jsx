export const identifyStoppages = (gpsData, threshold) => {
  const stoppages = [];
  const thresholdInMillis = threshold * 60 * 1000;
  let currentStoppage = null;

  for (let i = 0; i < gpsData.length; i++) {
    const dataPoint = gpsData[i];
    const speed = parseFloat(dataPoint.speed);
    const eventTime = new Date(parseFloat(dataPoint.eventGeneratedTime));

    if (speed === 0) {
      if (!currentStoppage) {
        currentStoppage = { reachTime: eventTime, data: dataPoint };
      }
    } else {
      if (currentStoppage) {
        const endTime = eventTime;
        const duration = endTime - currentStoppage.reachTime;
        if (duration >= thresholdInMillis) {
          currentStoppage.endTime = endTime;
          currentStoppage.duration = Math.round(duration / 1000 / 60); // in minutes
          stoppages.push(currentStoppage);
        }
        currentStoppage = null;
      }
    }
  }

  // Check if there was an ongoing stoppage at the end of the data
  if (currentStoppage) {
    const lastEventTime = new Date(parseFloat(gpsData[gpsData.length - 1].eventGeneratedTime));
    const duration = lastEventTime - currentStoppage.reachTime;
    if (duration >= thresholdInMillis) {
      currentStoppage.endTime = lastEventTime;
      currentStoppage.duration = Math.round(duration / 1000 / 60); // in minutes
      stoppages.push(currentStoppage);
    }
  }

  return stoppages;
};

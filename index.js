const ping = require("ping");
const chalk = require("chalk");
const moment = require("moment");
const {
  verbose,
  hosts = ["google.com"],
  interval = 1000,
  threshold = 500,
  dots = false,
} = require("yargs").argv;

const spikes = [];

console.log("Spike alarm set for spikes above", chalk.cyan(threshold + "ms"));

const pingTest = async () => {
  for (let host of hosts) {
    const { time } = await ping.promise.probe(host);

    if (time > threshold) {
      const timestamp = +new Date();

      spikes.push({
        time,
        timestamp,
      });

      console.log(
        chalk.white("\nSPIKE:"),
        chalk.cyan(moment(timestamp).format("hh:mm:ss")),
        chalk.red(time)
      );

      if (spikes.length > 1) {
        const previousSpike = spikes[spikes.length - 2];
        const timeSinceLastSpike = timeDifference(
          timestamp,
          previousSpike.timestamp
        );

        console.log("Time since last spike:", chalk.cyan(timeSinceLastSpike));
      }
    } else {
      if (verbose) {
        console.log(chalk.green(time));
      } else if (dots) {
        process.stdout.write(chalk.green("."));
      }
    }
  }
  setTimeout(pingTest, interval);
};

function timeDifference(current, previous) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  let approximately = false;
  let num = "";
  let unit = "";
  if (elapsed < msPerMinute) {
    num = Math.round(elapsed / 1000);
    unit = "second";
  } else if (elapsed < msPerHour) {
    num = Math.round(elapsed / msPerMinute);
    unit = "minute";
  } else if (elapsed < msPerDay) {
    num = Math.round(elapsed / msPerHour);
    unit = "hour";
  } else if (elapsed < msPerMonth) {
    approximately = true;
    num = Math.round(elapsed / msPerDay);
    unit = "day";
  } else if (elapsed < msPerYear) {
    approximately = true;
    num = Math.round(elapsed / msPerMonth);
    unit = "month";
  } else {
    approximately = true;
    num = Math.round(elapsed / msPerYear);
    unit = "year";
  }

  return `${approximately ? "approximately " : ""}${num} ${unit}${
    num !== 1 ? "s" : ""
  } ago`;
}

pingTest();

process.on("SIGINT", () => {
  console.log(
    "\n\nSpike report:",
    spikes.map(({ time, timestamp }) => {
      return {
        time: Math.round(time),
        timestamp: moment(timestamp).format("YYYY-MM-DD HH:MM:SS"),
      };
    })
  );

  process.exit();
});

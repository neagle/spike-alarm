# Spike Alarm

Log your ping to find out when ping spikes (brief periods of increased latency) occur.

# Usage

```shell
npm install
node index.js
```

# Options

The script accepts the following arguments:

| argument | default | description |
| - | - | - |
| verbose | false | Log normal pings, too. |
| interval | 1000 | How frequently to ping. |
| threshold | 500 | Above how many ms should be considered a spike? |
| dots | false | Output dots for every normal ping. Helpful to show ongoing activity. |

Example output:

```
SPIKE: 10:49:37 815.595
Time since last spike: 2 seconds ago
...............................................................................................................................
SPIKE: 10:51:48 761.792                                                                                                                                                Time since last spike: 2 minutes ago

SPIKE: 10:51:50 1011.702
Time since last spike: 2 seconds ago
.......................................................................................................................................................................
..............................................................................................................................
SPIKE: 10:56:50 799.937
Time since last spike: 5 minutes ago

SPIKE: 10:56:52 788.038
Time since last spike: 2 seconds ago
.......................................................................................................................................................................
............................................................................................................................
SPIKE: 11:01:51 799.995
Time since last spike: 5 minutes ago
```

import { Bench, Task } from "tinybench"
import { Identity } from "@semaphore-protocol/identity"
import { Group } from "@semaphore-protocol/group"
import * as V4 from "@semaphore-protocol/core"

const generateTable = (task: Task) => {
  if (task && task.name && task.result) {
    return {
      Function: task.name,
      "ops/sec": task.result.error
        ? "NaN"
        : parseInt(task.result.hz.toString(), 10).toLocaleString(),
      "Average Time (ms)": task.result.error
        ? "NaN"
        : task.result.mean.toFixed(5),
      Samples: task.result.error ? "NaN" : task.result.samples.length
    }
  }
}

async function main() {
  //   const samples = 100

  //   const bench = new Bench({ time: 0, iterations: samples })

  const bench = new Bench()

  const generateMembersV3 = (size: number) => {
    return Array.from(
      { length: size },
      (_, i) => new Identity(i.toString())
    ).map(({ commitment }) => commitment)
  }

  const generateMembersV4 = (size: number) => {
    return Array.from(
      { length: size },
      (_, i) => new V4.Identity(i.toString())
    ).map(({ commitment }) => commitment)
  }

  let membersV3: bigint[]

  let membersV4: bigint[]

  bench
    .add("V3 - Create Empty Group", async () => {
      new Group(1, 16, [])
    })
    .add("V4 - Create Empty Group", async () => {
      new V4.Group([])
    })
    .add(
      "V3 - Create Group 100 Members",
      async () => {
        new Group(1, 16, membersV3)
      },
      {
        beforeAll: () => {
          membersV3 = generateMembersV3(100)
        }
      }
    )
    .add(
      "V4 - Create Group 100 Members",
      async () => {
        new V4.Group(membersV4)
      },
      {
        beforeAll: () => {
          membersV4 = generateMembersV4(100)
        }
      }
    )
    .add(
      "V3 - Create Group 500 Members",
      async () => {
        new Group(1, 16, membersV3)
      },
      {
        beforeAll: () => {
          membersV3 = generateMembersV3(500)
        }
      }
    )
    .add(
      "V4 - Create Group 500 Members",
      async () => {
        new V4.Group(membersV4)
      },
      {
        beforeAll: () => {
          membersV4 = generateMembersV4(500)
        }
      }
    )
    .add(
      "V3 - Create Group 1000 Members",
      async () => {
        new Group(1, 16, membersV3)
      },
      {
        beforeAll: () => {
          membersV3 = generateMembersV3(1000)
        }
      }
    )
    .add(
      "V4 - Create Group 1000 Members",
      async () => {
        new V4.Group(membersV4)
      },
      {
        beforeAll: () => {
          membersV4 = generateMembersV4(1000)
        }
      }
    )
    .add(
      "V3 - Create Group 2000 Members",
      async () => {
        new Group(1, 16, membersV3)
      },
      {
        beforeAll: () => {
          membersV3 = generateMembersV3(2000)
        }
      }
    )
    .add(
      "V4 - Create Group 2000 Members",
      async () => {
        new V4.Group(membersV4)
      },
      {
        beforeAll: () => {
          membersV4 = generateMembersV4(2000)
        }
      }
    )

  await bench.warmup()
  await bench.run()

  const table = bench.table((task) => generateTable(task))

  // Add column to show how many times V4 is faster/slower than V3.
  // Formula: highest average execution time divided by lowest average execution time.
  // Using highest ops/sec divided by lowest ops/sec would work too.
  table.map((rowInfo, i) => {
    if (rowInfo && !(rowInfo["Function"] as string).includes("V4")) {
      rowInfo["Relative to V3"] = ""
    } else if (rowInfo) {
      const v3AvgExecTime = bench.tasks[i - 1].result?.mean

      const v4AvgExecTime = bench.tasks[i]!.result?.mean

      if (v3AvgExecTime === undefined || v4AvgExecTime === undefined) return

      if (v3AvgExecTime > v4AvgExecTime) {
        rowInfo["Relative to V3"] = `${(v3AvgExecTime / v4AvgExecTime).toFixed(
          2
        )} x faster`
      } else {
        rowInfo["Relative to V3"] = `${(v4AvgExecTime / v3AvgExecTime).toFixed(
          2
        )} x slower`
      }
    }
  })

  console.table(table)

  // console.log(bench.results)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

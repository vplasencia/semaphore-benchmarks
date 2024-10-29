import { Bench, Task } from "tinybench"
import { Identity } from "@semaphore-protocol/identity"
import { Group } from "@semaphore-protocol/group"
import { generateProof } from "@semaphore-protocol/proof"
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

export async function generateBenchmarks() {
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

  let memberV3: Identity

  let memberV4: V4.Identity

  let groupV3: Group

  let groupV4: V4.Group

  let membersV3: bigint[]

  let membersV4: bigint[]

  const secretMessage = "secret-message"

  let v4Identity: V4.Identity

  const message = "Message to sign"

  bench
    .add("V3 - Create non-deterministic Identity", async () => {
      new Identity()
    })
    .add("V4 - Create non-deterministic Identity", async () => {
      new V4.Identity()
    })
    .add("V3 - Create deterministic Identity", async () => {
      new Identity(secretMessage)
    })
    .add("V4 - Create deterministic Identity", async () => {
      new V4.Identity(secretMessage)
    })
    .add(
      "V4 - Sign Message",
      async () => {
        v4Identity.signMessage(message)
      },
      {
        beforeAll: () => {
          v4Identity = new V4.Identity()
        }
      }
    )
    .add(
      "V3 - Generate Proof 1 Member",
      async () => {
        await generateProof(memberV3, groupV3, 1, 1)
      },
      {
        beforeAll: () => {
          groupV3 = new Group(1, 16, [])
          memberV3 = new Identity()
          groupV3.addMember(memberV3.commitment)
        }
      }
    )
    .add(
      "V4 - Generate Proof 1 Member",
      async () => {
        await V4.generateProof(memberV4, groupV4, 1, 1)
      },
      {
        beforeAll: () => {
          groupV4 = new V4.Group([])
          memberV4 = new V4.Identity()
          groupV4.addMember(memberV4.commitment)
        }
      }
    )
    .add(
      "V3 - Generate Proof 100 Members",
      async () => {
        await generateProof(memberV3, groupV3, 1, 1)
      },
      {
        beforeAll: () => {
          membersV3 = generateMembersV3(100)
          groupV3 = new Group(1, 16, membersV3)
          const index = Math.floor(membersV3.length / 2)
          memberV3 = new Identity(index.toString())
        }
      }
    )
    .add(
      "V4 - Generate Proof 100 Members",
      async () => {
        await V4.generateProof(memberV4, groupV4, 1, 1)
      },
      {
        beforeAll: () => {
          membersV4 = generateMembersV4(100)
          groupV4 = new V4.Group(membersV4)
          const index = Math.floor(membersV4.length / 2)
          memberV4 = new V4.Identity(index.toString())
        }
      }
    )
    .add(
      "V3 - Generate Proof 500 Members",
      async () => {
        await generateProof(memberV3, groupV3, 1, 1)
      },
      {
        beforeAll: () => {
          membersV3 = generateMembersV3(500)
          groupV3 = new Group(1, 16, membersV3)
          const index = Math.floor(membersV3.length / 2)
          memberV3 = new Identity(index.toString())
        }
      }
    )
    .add(
      "V4 - Generate Proof 500 Members",
      async () => {
        await V4.generateProof(memberV4, groupV4, 1, 1)
      },
      {
        beforeAll: () => {
          membersV4 = generateMembersV4(500)
          groupV4 = new V4.Group(membersV4)
          const index = Math.floor(membersV4.length / 2)
          memberV4 = new V4.Identity(index.toString())
        }
      }
    )
    .add(
      "V3 - Generate Proof 1000 Members",
      async () => {
        await generateProof(memberV3, groupV3, 1, 1)
      },
      {
        beforeAll: () => {
          membersV3 = generateMembersV3(1000)
          groupV3 = new Group(1, 16, membersV3)
          const index = Math.floor(membersV3.length / 2)
          memberV3 = new Identity(index.toString())
        }
      }
    )
    .add(
      "V4 - Generate Proof 1000 Members",
      async () => {
        await V4.generateProof(memberV4, groupV4, 1, 1)
      },
      {
        beforeAll: () => {
          membersV4 = generateMembersV4(1000)
          groupV4 = new V4.Group(membersV4)
          const index = Math.floor(membersV4.length / 2)
          memberV4 = new V4.Identity(index.toString())
        }
      }
    )
    .add(
      "V3 - Generate Proof 2000 Members",
      async () => {
        await generateProof(memberV3, groupV3, 1, 1)
      },
      {
        beforeAll: () => {
          membersV3 = generateMembersV3(2000)
          groupV3 = new Group(1, 16, membersV3)
          const index = Math.floor(membersV3.length / 2)
          memberV3 = new Identity(index.toString())
        }
      }
    )
    .add(
      "V4 - Generate Proof 2000 Members",
      async () => {
        await V4.generateProof(memberV4, groupV4, 1, 1)
      },
      {
        beforeAll: () => {
          membersV4 = generateMembersV4(2000)
          groupV4 = new V4.Group(membersV4)
          const index = Math.floor(membersV4.length / 2)
          memberV4 = new V4.Identity(index.toString())
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
    } else if (rowInfo && (rowInfo["Function"] as string).includes("Sign")) {
      rowInfo["Relative to V3"] = "N/A"
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

  // console.table(table)

  // console.log(bench.results)

  return table
}

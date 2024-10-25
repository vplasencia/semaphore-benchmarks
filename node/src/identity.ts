import { Bench, Task } from "tinybench"
import { Identity } from "@semaphore-protocol/identity"
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
  // const samples = 100

  // const bench = new Bench({ time: 0, iterations: samples })

  const bench = new Bench()

  const secretMessage = "secret-message"

  let v3Identity: Identity
  let exportedV3Identity: string

  let v4Identity: V4.Identity
  let exportedV4Identity: string

  const message = "Message to sign"
  let signature: any

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
      "V3 - Export Identity",
      async () => {
        v3Identity.toString()
      },
      {
        beforeAll: () => {
          v3Identity = new Identity()
        }
      }
    )
    .add(
      "V4 - Export Identity",
      async () => {
        v4Identity.export()
      },
      {
        beforeAll: () => {
          v4Identity = new V4.Identity()
        }
      }
    )
    .add(
      "V3 - Import Identity",
      async () => {
        new Identity(exportedV3Identity)
      },
      {
        beforeAll: () => {
          v3Identity = new Identity()
          exportedV3Identity = v3Identity.toString()
        }
      }
    )
    .add(
      "V4 - Import Identity",
      async () => {
        V4.Identity.import(exportedV4Identity)
      },
      {
        beforeAll: () => {
          v4Identity = new V4.Identity()
          exportedV4Identity = v4Identity.export()
        }
      }
    )
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
      "V4 - Verify Signature",
      async () => {
        V4.Identity.verifySignature(message, signature, v4Identity.publicKey)
      },
      {
        beforeAll: () => {
          v4Identity = new V4.Identity()
          signature = v4Identity.signMessage(message)
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
    } else if (
      (rowInfo && (rowInfo["Function"] as string).includes("Sign")) ||
      (rowInfo && (rowInfo["Function"] as string).includes("Verify"))
    ) {
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

  console.table(table)

  // console.log(bench.results)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

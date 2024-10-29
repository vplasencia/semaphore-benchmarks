/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import Table from "./Table"
import ContractBenchmarksData from "../assets/contracts-benchmarks.json"

function calculateRelativeToColumn(table: any) {
  table.map((rowInfo: any, i: number) => {
    if (rowInfo && !(rowInfo["Function"] as string).includes("V4")) {
      rowInfo["Relative to V3"] = ""
    } else if (rowInfo) {
      const v3AvgExecTime = table[i - 1]["Gas Units"]

      const v4AvgExecTime = table[i]["Gas Units"]

      if (typeof v3AvgExecTime === "string") {
        rowInfo["Relative to V3"] = "N/A"
        return
      }

      if (v3AvgExecTime === undefined || v4AvgExecTime === undefined) return

      if (v3AvgExecTime > v4AvgExecTime) {
        rowInfo["Relative to V3"] = `${(v3AvgExecTime / v4AvgExecTime).toFixed(
          2
        )} x cheaper`
      } else {
        rowInfo["Relative to V3"] = `${(v4AvgExecTime / v3AvgExecTime).toFixed(
          2
        )} x more expensive`
      }
    }
  })
}

export default function ContractBenchmarks() {
  const [tableData, setTableData] = useState([])

  useEffect(() => {
    const dataCopy = JSON.parse(JSON.stringify(ContractBenchmarksData))
    calculateRelativeToColumn(dataCopy)
    setTableData(dataCopy)
  }, [])

  return (
    <div className="">
      <div className="text-xl text-center">Semaphore Contract Benchmarks</div>
      <div className="flex justify-center items-center my-5">
        {tableData && tableData.length > 0 ? (
          <Table data={tableData} />
        ) : (
          <div className="flex justify-center items-center space-x-3">
            <div className="loader"></div>
            <div>Loading benchmarks</div>
          </div>
        )}
      </div>
    </div>
  )
}

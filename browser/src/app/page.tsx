"use client"

import { useState } from "react"
import { generateBenchmarks } from "../utils/generate-benchmarks"
import Table from "../components/Table"
import ContractBenchmarks from "../components/ContractBenchmarks"

export default function Home() {
  const [tableInfo, setTableInfo] = useState()
  const [loading, setLoading] = useState(false)

  const getTableInfo = async () => {
    setLoading(true)
    const benchmarksInfo = await generateBenchmarks()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setTableInfo(benchmarksInfo as any)
    setLoading(false)
  }

  const downloadData = async () => {
    const filename = "functions-browser"

    const jsonStr = JSON.stringify(tableInfo, null, 2)
    const dataUri = `data:text/json;charset=utf-8,${encodeURIComponent(jsonStr)}`
    const link = document.createElement("a")
    link.href = dataUri
    link.download = `${filename}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-col min-h-screen px-2 text-slate-950">
      <div className="mb-auto">
        <div className="flex justify-center items-center my-10">
          <ContractBenchmarks />
        </div>
        <div className="flex flex-col justify-center items-center my-10">
          <div className="w-96 text-xl text-center">
            Generate browser benchmarks for Semaphore V3 and Semaphore V4.
          </div>
          <div className="mt-5 flex flex-col justify-center items-center">
            <button
              onClick={getTableInfo}
              className="w-full mt-5 rounded-md border-2 border-indigo-700 bg-indigo-700 py-3 px-5 font-semibold hover:bg-indigo-600 transition-colors duration-150 text-white"
            >
              Generate Benchmarks
            </button>
          </div>
        </div>
        <div>
          {loading ? (
            <div className="flex justify-center items-center space-x-3">
              <div className="loader"></div>
              <div>Generating benchmarks</div>
            </div>
          ) : tableInfo ? (
            <div>
              <div className="flex justify-center items-center mb-10">
                <button
                  className="max-w-fit rounded-md border-2 border-indigo-700 text-indigo-700 py-3 px-5 font-semibold"
                  onClick={downloadData}
                >
                  Download Benchmarks
                </button>
              </div>
              <div className="flex justify-center items-center my-5">
                <Table data={tableInfo} />
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  )
}

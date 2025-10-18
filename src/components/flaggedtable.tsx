"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown } from "lucide-react"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import toast, { Toaster } from "react-hot-toast"
import { useRouter } from "next/navigation"

export type FlaggedRow = {
  ipAddress: string
  rawMessage: string
  cleanedMessage: string
  truncated_in: boolean
  removed_zero_width: number
  unicode_nfkc: boolean
  homoglyph_folds: number
  decoded?: string
  clamped_runs: boolean
  truncated_out: boolean
  sanitizedAndDeobfuscated: boolean
  thread_id?: string | null
  createdAt: string
  updatedAt: string
}

export function FlaggedTable() {
  const router = useRouter()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [data, setData] = React.useState<FlaggedRow[]>([])
  const [loading, setLoading] = React.useState(true)
  const [bannedIPs, setBannedIPs] = React.useState<Set<string>>(new Set())
  const [processing, setProcessing] = React.useState<string | null>(null)

  // Fetch flagged data
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [resData, resBanned] = await Promise.all([
          axios.get("/api/flagged"),
          axios.get("/api/ban"),
        ])
        setData(
          resData.data.map((d: any) => ({
            ipAddress: d.ipAddress,
            rawMessage: d.rawMessage,
            cleanedMessage: d.cleanedMessage,
            truncated_in: d.sanitizationLog.truncated_in,
            removed_zero_width: d.sanitizationLog.removed_zero_width,
            unicode_nfkc: d.sanitizationLog.unicode_nfkc,
            homoglyph_folds: d.sanitizationLog.homoglyph_folds,
            decoded: d.sanitizationLog.decoded,
            clamped_runs: d.sanitizationLog.clamped_runs,
            truncated_out: d.sanitizationLog.truncated_out,
            sanitizedAndDeobfuscated: d.sanitizationLog.sanitizedAndDeobfuscated,
            thread_id: d.thread_id,
            createdAt: d.createdAt,
            updatedAt: d.updatedAt,
          }))
        )
        const bannedData = Array.isArray(resBanned.data.data)
        ? resBanned.data.data
        : Array.isArray(resBanned.data)
        ? resBanned.data
        : []

      setBannedIPs(new Set(bannedData.map((b: any) => b.ipAddress)))
      } catch (err) {
        console.error(err)
        toast.error("Failed to fetch flagged data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Ban/Unban handlers
  const banIP = async (ip: string) => {
    setProcessing(ip)
    try {
      const res = await axios.post("/api/ban", { ip })
      toast.success(res.data.message || "IP Banned")
      setBannedIPs(prev => new Set(prev).add(ip))
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong!")
    } finally {
      setProcessing(null)
    }
  }

  const unbanIP = async (ip: string) => {
    setProcessing(ip)
    try {
      const res = await axios.post("/api/unban", { ip })
      toast.success(res.data.message || "IP Unbanned")
      setBannedIPs(prev => {
        const newSet = new Set(prev)
        newSet.delete(ip)
        return newSet
      })
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong!")
    } finally {
      setProcessing(null)
    }
  }

  // Table columns
  const columns: ColumnDef<FlaggedRow>[] = [
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const ip = row.original.ipAddress
        const isBanned = bannedIPs.has(ip)
        const isBusy = processing === ip
        return (
          <Button
            variant={isBanned ? "outline" : "destructive"}
            size="sm"
            disabled={isBusy}
            onClick={e => {
              e.stopPropagation()
              isBanned ? unbanIP(ip) : banIP(ip)
            }}
          >
            {isBusy ? "Processing..." : isBanned ? "Unban" : "Ban"}
          </Button>
        )
      },
    },
    { accessorKey: "ipAddress", header: "IP Address" },
    { accessorKey: "rawMessage", header: "Raw Message", cell: ({ row }) => <div className="truncate max-w-md">{row.getValue("rawMessage")}</div> },
    { accessorKey: "cleanedMessage", header: "Cleaned Message", cell: ({ row }) => <div className="truncate max-w-md">{row.getValue("cleanedMessage")}</div> },
    { accessorKey: "truncated_in", header: "Truncated In" },
    { accessorKey: "removed_zero_width", header: "Removed Zero Width" },
    { accessorKey: "unicode_nfkc", header: "Unicode NFKC" },
    { accessorKey: "homoglyph_folds", header: "Homoglyph Folds" },
    { accessorKey: "decoded", header: "Decoded", cell: ({ row }) => <div className="truncate max-w-md">{row.getValue("decoded")}</div> },
    { accessorKey: "clamped_runs", header: "Clamped Runs" },
    { accessorKey: "truncated_out", header: "Truncated Out" },
    { accessorKey: "sanitizedAndDeobfuscated", header: "Sanitized" },
    { accessorKey: "thread_id", header: "Thread ID" },
    { accessorKey: "createdAt", header: "Created At", cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleString() },
    { accessorKey: "updatedAt", header: "Updated At", cell: ({ row }) => new Date(row.getValue("updatedAt")).toLocaleString() },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="w-full">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Filter and Columns */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter IP Address"
          value={(table.getColumn("ipAddress")?.getFilterValue() as string) ?? ""}
          onChange={e => table.getColumn("ipAddress")?.setFilterValue(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table.getAllColumns()
              .filter(col => col.getCanHide())
              .map(col => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  className="capitalize"
                  checked={col.getIsVisible()}
                  onCheckedChange={val => col.toggleVisibility(!!val)}
                >
                  {col.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border">
        <Table className="px-2">
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="cursor-pointer">
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Rows: {table.getState().pagination.pageSize} <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {[5, 10, 20, 50].map(size => (
              <DropdownMenuItem key={size} onClick={() => table.setPageSize(size)}>
                {size} rows
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

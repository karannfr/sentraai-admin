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

export type Chat = {
  ipAddress: string
  rawMessage: string
  cleanedMessage: string
  generatedResponse: string
  label: string
  category?: string | null
  confidence: number
  reason: string
  excerpt?: string
  thread_id: string
  createdAt: string
  updatedAt: string
}

export function DashboardTable() {
  const router = useRouter()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [data, setData] = React.useState<Chat[]>([])
  const [loading, setLoading] = React.useState<boolean>(true)
  const [bannedIPs, setBannedIPs] = React.useState<Set<string>>(new Set())
  const [processing, setProcessing] = React.useState<string | null>(null) // currently banning/unbanning IP
    
  // Fetch data
  React.useEffect(() => {
    const fetchChats = async () => {
      try {
        const [chatRes, bannedRes] = await Promise.all([
          axios.get("/api/behavioral"),
          axios.get("/api/ban"),
        ])
        const chats: Chat[] = chatRes.data.chats.map((c: any) => ({
          ipAddress: c.ipAddress,
          rawMessage: c.rawMessage,
          cleanedMessage: c.cleanedMessage,
          generatedResponse: c.generatedResponse,
          label: c.classification.label,
          category: c.classification.category,
          confidence: c.classification.confidence,
          reason: c.classification.reason,
          excerpt: c.classification.excerpt,
          thread_id: c.thread_id,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
        }))
        setData(chats)
        setBannedIPs(new Set(bannedRes.data.data.map((b: any) => b.ipAddress)))
      } catch (err) {
        console.error(err)
        toast.error("Failed to fetch data")
      } finally {
        setLoading(false)
      }
    }
    fetchChats()
  }, [])

  // Ban IP
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

  // Unban IP
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

  // Table Columns
  const columns: ColumnDef<Chat>[] = [
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
            onClick={(e) => {
              e.stopPropagation()
              isBanned ? unbanIP(ip) : banIP(ip)
            }}
            className="cursor-pointer"
          >
            {isBusy
              ? "Processing..."
              : isBanned
              ? "Unban"
              : "Ban"}
          </Button>
        )
      },
    },
    { accessorKey: "ipAddress", header: "IP Address" },
    {
      accessorKey: "rawMessage",
      header: "Raw Message",
      cell: ({ row }) => (
        <div className="truncate max-w-md">{row.getValue("rawMessage")}</div>
      ),
    },
    {
      accessorKey: "cleanedMessage",
      header: "Cleaned Message",
      cell: ({ row }) => (
        <div className="truncate max-w-md">{row.getValue("cleanedMessage")}</div>
      ),
    },
    {
      accessorKey: "generatedResponse",
      header: "Response",
      cell: ({ row }) => (
        <div className="truncate max-w-md">{row.getValue("generatedResponse")}</div>
      ),
    },
    {
      accessorKey: "label",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
          className="cursor-pointer"
        >
          Label
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="lowercase">{row.getValue("label")}</div>,
    },
    { accessorKey: "category", header: "Category" },
    { accessorKey: "confidence", header: "Confidence" },
    {
      accessorKey: "reason",
      header: "Reason",
      cell: ({ row }) => (
        <div className="truncate max-w-md">{row.getValue("reason")}</div>
      ),
    },
    {
      accessorKey: "excerpt",
      header: "Excerpt",
      cell: ({ row }) => (
        <div className="truncate max-w-md">{row.getValue("excerpt")}</div>
      ),
    },
    { accessorKey: "thread_id", header: "Thread ID" },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) =>
        new Date(row.getValue("createdAt")).toLocaleString(),
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: ({ row }) =>
        new Date(row.getValue("updatedAt")).toLocaleString(),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  })

  React.useEffect(() => {
    table.setPageSize(5);
  }, [table]);

  return (
    <div className="w-full">
      <Toaster position="top-right" reverseOrder={false}/>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter IP Address"
          value={(table.getColumn("ipAddress")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("ipAddress")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) =>
                    column.toggleVisibility(!!value)
                  }
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table className="px-2">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
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
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() =>
                    router.push(`/behavioral/${row.original.thread_id}`)
                  }
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

"use client"

import React, { useState } from "react"
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd"
import {
  ColumnDef,
  useReactTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export default function LinksTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [linkData, setLinkData] = useState(data)

  const table = useReactTable({
    data: linkData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source } = result

    if (!destination) return

    const newData = Array.from(linkData)
    const [reorderedItem] = newData.splice(source.index, 1)
    newData.splice(destination.index, 0, reorderedItem)

    setLinkData(newData)
  }

  return (
    <>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter links..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border overflow-y-scroll custom-scrollbar">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="links">
            {(provided) => (
              <Table {...provided.droppableProps} ref={provided.innerRef}>
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
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row, index) => (
                      <Draggable
                        key={row.id}
                        draggableId={row.id}
                        index={index}
                      >
                        {(provided) => (
                          <TableRow
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>
                                {cell.column.id === "image" &&
                                cell.getValue() ? (
                                  <img
                                    src={cell.getValue() as string}
                                    alt="Link preview"
                                    className="w-12"
                                  />
                                ) : (
                                  flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                  {provided.placeholder}
                </TableBody>
              </Table>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </>
  )
}

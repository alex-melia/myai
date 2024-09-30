"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Trash } from "lucide-react"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Checkbox } from "../ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"

import UpdateLinkForm from "../forms/UpdateLink"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { toast } from "../ui/use-toast"
import { useRouter } from "next/navigation"
import { InferSelectModel } from "drizzle-orm"
import { links } from "@/db/schema"

type Link = InferSelectModel<typeof links>

export const columns: ColumnDef<Link>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "image",
    header: "Image",
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: "actions",
    cell: function ActionCell({ row }) {
      const router = useRouter()
      const link = row.original
      const [deletionSelected, setDeletionSelected] = useState(false)

      async function deleteLink(link: Link) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}api/links/${link.id}`,
          {
            method: "DELETE",
          }
        )

        if (!res.ok) {
          toast({
            title: "Error!",
          })
        } else {
          toast({
            title: "Link deleted",
          })
          router.refresh()
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-0" align="end">
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuLabel className="cursor-pointer">
                  Update
                </DropdownMenuLabel>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="items-center space-y-1">
                  <DialogTitle className="text-4xl tracking-tighter">
                    Update Link
                  </DialogTitle>
                </DialogHeader>
                <UpdateLinkForm link={link} />
              </DialogContent>
            </Dialog>
            <DropdownMenuLabel
              onClick={async () => {
                deletionSelected && (await deleteLink(link))
                setDeletionSelected(!deletionSelected)
              }}
              className={cn(
                deletionSelected && "bg-destructive",
                "flex items-center gap-1 cursor-pointer"
              )}
              onMouseLeave={() =>
                deletionSelected && setDeletionSelected(!deletionSelected)
              }
            >
              <Trash size={16} />
              {deletionSelected ? "Confirm Delete" : "Delete"}
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

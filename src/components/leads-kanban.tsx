"use client"

import { useMemo, useState, useTransition } from "react"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { LeadStatus } from "@prisma/client"
import { toast } from "sonner"
import {
  LEAD_STATUS_LABEL,
  LEAD_STATUS_ORDER,
} from "@/components/lead-status-badge"
import { LeadCard, type LeadCardData } from "@/components/lead-card"
import { changeStatusAction } from "@/app/dashboard/leads/[id]/actions"
import { cn } from "@/lib/utils"

const ACTIVE_COLUMNS: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "DEMO_SCHEDULED",
  "DEMO_DONE",
  "IN_EVALUATION",
  "CUSTOMER",
]

const TERMINAL_COLUMN: LeadStatus = "LOST"

const COLUMN_ACCENT: Record<LeadStatus, string> = {
  NEW: "border-t-gray-400",
  CONTACTED: "border-t-blue-400",
  DEMO_SCHEDULED: "border-t-purple-400",
  DEMO_DONE: "border-t-indigo-400",
  IN_EVALUATION: "border-t-amber-400",
  CUSTOMER: "border-t-emerald-500",
  LOST: "border-t-red-300",
}

export function LeadsKanban({
  initialLeads,
  followUpLeadIds,
}: {
  initialLeads: LeadCardData[]
  followUpLeadIds: string[]
}) {
  const [leads, setLeads] = useState(initialLeads)
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null)
  const [, startTransition] = useTransition()
  const followUpSet = useMemo(
    () => new Set(followUpLeadIds),
    [followUpLeadIds]
  )

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  )

  const grouped = groupByStatus(leads)
  const draggedLead = draggedLeadId
    ? leads.find((l) => l.id === draggedLeadId) || null
    : null

  const handleDragStart = (event: DragStartEvent) => {
    setDraggedLeadId(String(event.active.id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setDraggedLeadId(null)

    const overId = event.over?.id
    if (!overId) return

    const leadId = String(event.active.id)
    const newStatus = String(overId) as LeadStatus
    const lead = leads.find((l) => l.id === leadId)
    if (!lead || lead.status === newStatus) return

    const previousStatus = lead.status

    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? {
              ...l,
              status: newStatus,
              trialStartedAt:
                newStatus === "IN_EVALUATION" && !l.trialStartedAt
                  ? new Date()
                  : l.trialStartedAt,
            }
          : l
      )
    )

    startTransition(async () => {
      try {
        await changeStatusAction(leadId, newStatus)
      } catch (e) {
        console.error(e)
        toast.error("No se pudo actualizar el estado, revirtiendo")
        setLeads((prev) =>
          prev.map((l) =>
            l.id === leadId ? { ...l, status: previousStatus } : l
          )
        )
      }
    })
  }

  return (
    <DndContext
      id="leads-kanban"
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {ACTIVE_COLUMNS.map((status) => (
            <Column
              key={status}
              status={status}
              leads={grouped[status] || []}
              draggedLeadId={draggedLeadId}
              followUpSet={followUpSet}
            />
          ))}
        </div>

        <div className="mt-auto pt-4">
          <Column
            status={TERMINAL_COLUMN}
            leads={grouped[TERMINAL_COLUMN] || []}
            draggedLeadId={draggedLeadId}
            followUpSet={followUpSet}
            horizontal
          />
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {draggedLead ? (
          <div className="rotate-1">
            <LeadCard
              lead={draggedLead}
              draggable
              from="kanban"
              hasActiveFollowUp={followUpSet.has(draggedLead.id)}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

function Column({
  status,
  leads,
  draggedLeadId,
  followUpSet,
  horizontal = false,
}: {
  status: LeadStatus
  leads: LeadCardData[]
  draggedLeadId: string | null
  followUpSet: Set<string>
  horizontal?: boolean
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "rounded-lg border bg-muted/30 flex flex-col min-w-0",
        "border-t-3",
        COLUMN_ACCENT[status],
        isOver && "bg-primary/5 border-primary/30"
      )}
    >
      <header className="px-3 py-2 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {LEAD_STATUS_LABEL[status]}
        </h3>
        <span className="text-xs text-muted-foreground tabular-nums">
          {leads.length}
        </span>
      </header>

      <div
        className={cn(
          "px-2 pb-2 flex flex-col gap-2 min-h-[60px]",
          horizontal && "flex-row flex-wrap"
        )}
      >
        {leads.map((lead) => (
          <DraggableLeadCard
            key={lead.id}
            lead={lead}
            isDragging={draggedLeadId === lead.id}
            hasActiveFollowUp={followUpSet.has(lead.id)}
          />
        ))}
        {leads.length === 0 && (
          <p className="text-xs text-muted-foreground/60 italic px-1.5 py-2">
            Vacío
          </p>
        )}
      </div>
    </div>
  )
}

function DraggableLeadCard({
  lead,
  isDragging,
  hasActiveFollowUp,
}: {
  lead: LeadCardData
  isDragging: boolean
  hasActiveFollowUp: boolean
}) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: lead.id })

  return (
    <div ref={setNodeRef} {...attributes} {...listeners}>
      <LeadCard
        lead={lead}
        draggable
        isDragging={isDragging}
        from="kanban"
        hasActiveFollowUp={hasActiveFollowUp}
      />
    </div>
  )
}

function groupByStatus(leads: LeadCardData[]) {
  const out: Partial<Record<LeadStatus, LeadCardData[]>> = {}
  for (const status of LEAD_STATUS_ORDER) {
    out[status] = []
  }
  for (const lead of leads) {
    out[lead.status]!.push(lead)
  }
  return out
}

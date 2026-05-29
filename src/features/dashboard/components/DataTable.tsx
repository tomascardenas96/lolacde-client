"use client";

import { Fragment, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Column } from "../types/dashboard.types";

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  renderExpanded?: (item: T) => React.ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  renderExpanded,
}: DataTableProps<T>) {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const expandable = !!renderExpanded;
  const totalCols = expandable ? columns.length + 1 : columns.length;

  const handleRowClick = (item: T, key: string) => {
    if (expandable) {
      setExpandedKey((prev) => (prev === key ? null : key));
    }
    onRowClick?.(item);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/5">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="text-left text-[0.6rem] tracking-[0.2em] text-muted uppercase py-3 px-4 font-medium"
              >
                {col.label}
              </th>
            ))}
            {expandable && <th className="w-10" aria-hidden="true" />}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            const key = keyExtractor(item);
            const isExpanded = expandedKey === key;
            const isClickable = expandable || !!onRowClick;
            return (
              <Fragment key={key}>
                <tr
                  onClick={() => handleRowClick(item, key)}
                  className={`border-b border-white/5 transition-colors ${
                    isClickable ? "cursor-pointer" : ""
                  } ${
                    isExpanded
                      ? "bg-card-light/40"
                      : isClickable
                        ? "hover:bg-card-light/50"
                        : ""
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className="py-3 px-4 text-sm text-white/80"
                    >
                      {col.render
                        ? col.render(item)
                        : String(item[col.key as keyof T] ?? "")}
                    </td>
                  ))}
                  {expandable && (
                    <td className="py-3 px-4 text-right">
                      <ChevronDown
                        size={14}
                        className={`text-muted transition-transform duration-300 ${
                          isExpanded ? "rotate-180 text-white" : ""
                        }`}
                      />
                    </td>
                  )}
                </tr>
                {expandable && (
                  <tr
                    className={
                      isExpanded ? "border-b border-white/5" : "border-b-0"
                    }
                  >
                    <td colSpan={totalCols} className="p-0">
                      <div
                        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                      >
                        <div className="overflow-hidden">
                          {renderExpanded?.(item)}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

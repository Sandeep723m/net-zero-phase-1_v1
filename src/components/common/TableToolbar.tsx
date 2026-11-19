import React from 'react';
import { Search, Filter, ArrowUpDown, Columns, Download, Plus } from 'lucide-react';

interface TableToolbarProps {
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  onFilterClick?: () => void;
  filterActive?: boolean;
  onSortClick?: () => void;
  onColumnsClick?: () => void;
  onExportClick?: () => void;
  onAddClick?: () => void;
  addLabel?: string;
  extraControls?: React.ReactNode;
  className?: string;
}

export const TableToolbar: React.FC<TableToolbarProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search activity, site or ID...',
  onFilterClick,
  filterActive,
  onSortClick,
  onColumnsClick,
  onExportClick,
  onAddClick,
  addLabel = 'Add New',
  extraControls,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 px-4 bg-white border border-[var(--border-default)] rounded-xl mb-4 shadow-[0_1px_2px_rgba(20,20,20,0.02)] ${className}`}
    >
      {/* Left: Search input */}
      <div className="flex-1 max-w-md relative">
        <Search className="w-4 h-4 text-[var(--text-tertiary)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchValue ?? ''}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full h-9 pl-9 pr-3 text-xs sm:text-[13px] bg-white border border-[#E2E4E8] rounded-full text-[var(--text-primary)] placeholder-[#85808D] focus:outline-none focus:border-[var(--action-primary)] focus:ring-2 focus:ring-[var(--border-focus)]/10 transition-all"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center flex-wrap gap-2 justify-end">
        {onFilterClick && (
          <button
            type="button"
            onClick={onFilterClick}
            className={`h-9 px-3.5 text-xs font-semibold rounded-full border flex items-center space-x-1.5 transition-colors ${
              filterActive
                ? 'bg-[var(--brand-50)] border-[var(--action-primary)] text-[var(--text-primary)]'
                : 'bg-white border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--bg-canvas)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>
        )}

        {onSortClick && (
          <button
            type="button"
            onClick={onSortClick}
            className="h-9 px-3.5 text-xs font-semibold rounded-full border bg-white border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--bg-canvas)] hover:text-[var(--text-primary)] flex items-center space-x-1.5 transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort</span>
          </button>
        )}

        {onColumnsClick && (
          <button
            type="button"
            onClick={onColumnsClick}
            className="h-9 px-3.5 text-xs font-semibold rounded-full border bg-white border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--bg-canvas)] hover:text-[var(--text-primary)] flex items-center space-x-1.5 transition-colors"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Columns</span>
          </button>
        )}

        {extraControls}

        {onExportClick && (
          <button
            type="button"
            onClick={onExportClick}
            className="h-9 px-3.5 text-xs font-semibold rounded-full border bg-white border-[var(--border-default)] text-[#303238] hover:bg-[var(--bg-canvas)] flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
            <span>Export</span>
          </button>
        )}

        {onAddClick && (
          <button
            type="button"
            onClick={onAddClick}
            className="h-9 px-4 text-xs font-semibold rounded-full bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] text-white flex items-center space-x-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{addLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
};

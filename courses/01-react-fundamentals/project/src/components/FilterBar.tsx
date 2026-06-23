interface FilterBarProps {
  filter: 'all' | 'active' | 'completed'
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void
  sort: string
  onSortChange: (sort: string) => void
  search: string                      
  onSearchChange: (search: string) => void 
}

export default function FilterBar(props: FilterBarProps) {
  return (
    <div id="filter-bar">

      <button
        data-active={props.filter === 'all'}
        onClick={() => props.onFilterChange('all')}
      >All</button>

      <button
        data-active={props.filter === 'active'}
        onClick={() => props.onFilterChange('active')}
      >Active</button>

      <button
        data-active={props.filter === 'completed'}
        onClick={() => props.onFilterChange('completed')}
      >Completed</button>

      <select
        id="sort-order"
        value={props.sort}
        onChange={e => props.onSortChange(e.target.value)}
      >
        <option value="recently-added">Recently Added</option>
        <option value="priority-high-low">Priority: High to Low</option>
        <option value="priority-low-high">Priority: Low to High</option>
        <option value="alphabetical">Alphabetical</option>
      </select>

      <input
        id="search-input"
        type="text"
        value={props.search}                         
        onChange={e => props.onSearchChange(e.target.value)}
        placeholder="Search tasks..."
      />

      {props.search && (
        <button
          id="clear-search"
          onClick={() => props.onSearchChange('')}  
        >
          Clear search
        </button>
      )}

    </div>
  )
}
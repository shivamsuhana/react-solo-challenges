interface FilterBarProps {
  filter: 'all' | 'active' | 'completed'  
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void  
}

export default function FilterBar(props: FilterBarProps) {
  return (
    <div id="filter-bar">

      <button
        data-active={props.filter === 'all'}  
        onClick={() => props.onFilterChange('all')} 
      >
        All
      </button>

      <button
        data-active={props.filter === 'active'}
        onClick={() => props.onFilterChange('active')}
      >
        Active
      </button>

      <button
        data-active={props.filter === 'completed'}
        onClick={() => props.onFilterChange('completed')}
      >
        Completed
      </button>

    </div>
  )
}
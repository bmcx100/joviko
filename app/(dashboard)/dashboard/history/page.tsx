import SessionTable from '@/components/dashboard/SessionTable'

const pills = [
  { label: 'All', active: true },
  { label: 'Number Patterns', active: false },
  { label: 'Addition', active: false },
  { label: 'Shapes', active: false },
  { label: 'Subtraction', active: false },
]

export default function HistoryPage() {
  return (
    <div>
      <h1 className="font-heading font-extrabold text-[28px] mb-6">Session History</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        {pills.map((pill) => (
          <span
            key={pill.label}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-colors ${
              pill.active
                ? 'bg-brand-indigo text-white border-brand-indigo'
                : 'bg-brand-cream border-brand-cream-dark text-brand-pencil hover:border-brand-indigo hover:text-brand-indigo'
            }`}
          >
            {pill.label}
          </span>
        ))}
      </div>

      <SessionTable />
    </div>
  )
}

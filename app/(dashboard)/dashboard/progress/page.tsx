import { mockTopics } from '@/lib/mockData'
import ProgressCard from '@/components/dashboard/ProgressCard'
import LeitnerViz from '@/components/dashboard/LeitnerViz'

export default function ProgressPage() {
  return (
    <div>
      <h1 className="font-heading font-extrabold text-[28px] mb-8">Progress</h1>

      <div className="space-y-4">
        {mockTopics.map((topic) => (
          <div key={topic.id} className="space-y-3 mb-6">
            <ProgressCard
              name={topic.name}
              icon={topic.icon}
              pct={topic.pct}
              learned={topic.learned}
              remaining={topic.remaining}
            />
            <LeitnerViz />
          </div>
        ))}
      </div>
    </div>
  )
}

'use client'

import StatusBar from '@/components/play/StatusBar'
import ProgressBar from '@/components/play/ProgressBar'
import MascotBubble from '@/components/play/MascotBubble'
import ChunkyButton from '@/components/play/ChunkyButton'
import FeedbackOverlay from '@/components/play/FeedbackOverlay'
import CheckButton from '@/components/play/CheckButton'
import ResultsScreen from '@/components/play/ResultsScreen'

export default function SessionPage() {
  return (
    <div className="flex flex-col h-full">
      <StatusBar hearts={4} streak={12} xp={340} />
      <ProgressBar current={6} total={10} />

      <div className="flex-1 flex flex-col pt-4">
        <MascotBubble message="Which number comes next in the pattern?" />

        {/* Number blocks */}
        <div className="flex gap-2 justify-center my-4 px-5">
          {[2, 4, 6].map(n => (
            <div
              key={n}
              className="w-11 h-11 rounded-[10px] bg-brand-indigo text-white font-extrabold text-lg flex items-center justify-center"
            >
              {n}
            </div>
          ))}
          <div className="w-11 h-11 rounded-[10px] bg-brand-parchment-dark border-2 border-dashed border-brand-cream-dark text-brand-pencil font-extrabold text-lg flex items-center justify-center">
            ?
          </div>
        </div>

        {/* Answer buttons */}
        <div className="px-5 space-y-3">
          <ChunkyButton letter="A" label="7" state="default" />
          <ChunkyButton letter="B" label="8" state="selected" />
          <ChunkyButton letter="C" label="10" state="default" />
        </div>
      </div>

      {/* Feedback overlay */}
      <FeedbackOverlay
        type="correct"
        title="🎉 Correct!"
        message="The pattern increases by 2 each time."
      />

      {/* Check/Continue button */}
      <div className="px-5 pb-6 pt-3">
        <CheckButton state="continue" />
      </div>
    </div>
  )
}

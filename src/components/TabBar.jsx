import { HomeIcon, ClipboardDocumentCheckIcon, ChartBarIcon, UserIcon } from '@heroicons/react/24/outline'
import { HomeIcon as HomeSolid, ClipboardDocumentCheckIcon as QuizSolid, ChartBarIcon as ChartSolid, UserIcon as UserSolid } from '@heroicons/react/24/solid'

export default function TabBar({ currentTab, onTabChange }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: HomeIcon, activeIcon: HomeSolid },
    { id: 'quiz', label: 'Quiz', icon: ClipboardDocumentCheckIcon, activeIcon: QuizSolid },
    { id: 'results', label: 'Results', icon: ChartBarIcon, activeIcon: ChartSolid },
    { id: 'profile', label: 'Profile', icon: UserIcon, activeIcon: UserSolid },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id
          const Icon = isActive ? tab.activeIcon : tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center flex-1 h-full gap-0.5"
            >
              <Icon className={`w-6 h-6 ${isActive ? 'text-orange-500' : 'text-slate-400'}`} />
              <span className={`text-xs ${isActive ? 'text-orange-500' : 'text-slate-400'}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
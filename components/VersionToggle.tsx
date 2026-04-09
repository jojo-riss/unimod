'use client'

import { createContext, useContext, useState } from 'react'

type Version = 'original' | 'investor'

const VersionContext = createContext<{ version: Version; setVersion: (v: Version) => void }>({
  version: 'original',
  setVersion: () => {},
})

export function useVersion() {
  return useContext(VersionContext)
}

export function VersionProvider({ children }: { children: React.ReactNode }) {
  const [version, setVersion] = useState<Version>('original')
  return (
    <VersionContext.Provider value={{ version, setVersion }}>
      {children}
    </VersionContext.Provider>
  )
}

export default function VersionToggle() {
  const { version, setVersion } = useVersion()

  return (
    <div className="fixed bottom-6 right-[180px] z-[200] pointer-events-auto">
      <div className="bg-[#111] border border-[#2a2a2a] rounded-full p-0.5 flex shadow-lg">
        <button
          onClick={() => setVersion('original')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
            version === 'original'
              ? 'bg-white text-[#0a0a0a]'
              : 'text-[#888] hover:text-white'
          }`}
        >
          Original
        </button>
        <button
          onClick={() => setVersion('investor')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
            version === 'investor'
              ? 'bg-[#e85d2f] text-white'
              : 'text-[#888] hover:text-white'
          }`}
        >
          Investor
        </button>
      </div>
    </div>
  )
}

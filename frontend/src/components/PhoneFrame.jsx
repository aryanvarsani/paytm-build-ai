export default function PhoneFrame({ children }) {
  return (
    <div className="min-h-screen bg-[#E4E7ED] flex items-center justify-center p-2 sm:p-6 select-none font-sans">
      {/* Phone Outer Shell */}
      <div className="relative w-[440px] h-[900px] bg-[#121316] rounded-[56px] p-[14px] shadow-[0_25px_80px_-15px_rgba(0,0,0,0.45)] border-[8px] border-[#2B2C32] flex flex-col shrink-0 ring-1 ring-black/20">
        
        {/* Dynamic Island */}
        <div className="absolute top-[22px] left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-black rounded-full z-50 flex items-center justify-between px-3 shadow-md pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-[#0D0D11] border border-[#222]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#081326] flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-[#183968]" />
          </div>
        </div>

        {/* Screen Viewport */}
        <div 
          id="phone-frame-viewport"
          className="relative w-full h-full bg-[#F5F7FA] rounded-[44px] overflow-hidden flex flex-col border border-black/10 shadow-inner"
        >
          {/* iOS Top Status Bar */}
          <div className="h-[54px] bg-[#F5F7FA] w-full flex items-end justify-between px-[38px] pb-2 text-[13px] font-bold text-gray-900 z-40 shrink-0 select-none">
            <span className="tracking-tight text-[13px] font-bold text-gray-900">5:58</span>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-800">
              <span className="text-[10px] font-bold text-gray-800">5G</span>
              <div className="flex items-end gap-[1.5px] h-3 ml-0.5">
                <div className="w-[2px] h-[4px] bg-gray-900 rounded-[0.5px]" />
                <div className="w-[2px] h-[6px] bg-gray-900 rounded-[0.5px]" />
                <div className="w-[2px] h-[8px] bg-gray-900 rounded-[0.5px]" />
                <div className="w-[2px] h-[10px] bg-gray-900 rounded-[0.5px]" />
              </div>
              <div className="w-5 h-2.5 border border-gray-800 rounded-[3px] p-[1px] flex items-center ml-0.5">
                <div className="w-full h-full bg-gray-800 rounded-[1px]" />
              </div>
              <span className="text-[10px] font-bold text-gray-800">100%</span>
            </div>
          </div>

          {/* App Content Area */}
          <div className="relative flex-1 flex flex-col overflow-hidden bg-[#F5F7FA]">
            {children}
          </div>

          {/* iOS Home Indicator — pushed below nav */}
          <div className="absolute bottom-[4px] left-1/2 -translate-x-1/2 w-[134px] h-[4px] bg-gray-900/70 rounded-full z-[60] pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

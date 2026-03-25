export default function Background() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 w-32 h-32 bg-cyan-400/20 rounded-full blur-xl animate-float"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-blue-400/30 rounded-full blur-lg animate-float-delayed"></div>
      <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-indigo-400/20 rounded-full blur-2xl animate-float-slow"></div>
      <div className="absolute bottom-20 right-10 w-28 h-28 bg-cyan-300/25 rounded-full blur-xl animate-float"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/10 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-l from-indigo-600/10 to-transparent"></div>
    </div>
  )
}

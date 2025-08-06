import { Activity } from "lucide-react";

function LiveComponent() {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <Activity className="h-3 w-3 text-green-400" />
            <span className="text-green-400 font-medium text-xs">EN VIVO</span>
          </div>
  );
}
export default LiveComponent;
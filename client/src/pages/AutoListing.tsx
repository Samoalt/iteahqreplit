import { useAuth } from "@/hooks/useAuth";
import AutoListingSettings from "@/components/AutoListingSettings";

export default function AutoListing() {
  const { user } = useAuth();

  if (!user || user.role !== "producer") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Access Restricted</h2>
          <p className="text-slate-600">Auto-listing is only available for producer accounts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <AutoListingSettings />
    </div>
  );
}
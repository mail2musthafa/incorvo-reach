"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Compass,
  Search,
  Filter,
  Coins,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  FileSearch,
  Video,
  Camera,
} from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function DiscoverMissionsPage() {
  const [missions, setMissions] = useState<any[]>([
    {
      id: "52878390-51ca-4097-88db-bff55d76576b",
      title: "Plant-Based Protein Bar Flavor & Texture Feedback",
      tagline: "Taste test NovaHealth's new almond fudge bar and provide honest private research.",
      vendor_name: "NovaHealth Organics",
      template_type: "PRIVATE_SURVEY",
      reward_per_action: 150.0,
      estimated_time_minutes: 8,
      remaining_capacity: 97,
      verification_method: "MANUAL_REVIEW",
    },
    {
      id: "986e1038-131d-4d39-8bfa-99ca46160531",
      title: "Original Morning Routine UGC Video with Nova Matcha",
      tagline: "Create an unscripted, genuine 30-45s vertical video incorporating organic ceremonial matcha.",
      vendor_name: "NovaHealth Organics",
      template_type: "UGC",
      reward_per_action: 850.0,
      estimated_time_minutes: 25,
      remaining_capacity: 19,
      verification_method: "MANUAL_REVIEW",
    },
    {
      id: "c3",
      title: "Clean Beauty & Cold-Pressed Oil Consumer Study",
      tagline: "Watch a 3-minute ingredient breakdown and test your knowledge with a 4-question quiz.",
      vendor_name: "NovaHealth Organics",
      template_type: "VIDEO_QUIZ",
      reward_per_action: 75.0,
      estimated_time_minutes: 5,
      remaining_capacity: 198,
      verification_method: "AUTOMATED_CHECK",
    },
    {
      id: "c4",
      title: "Flagship Experience Store QR Check-in & Visit",
      tagline: "Visit our flagship wellness lounge in Indiranagar, scan the rotating in-store QR and explore.",
      vendor_name: "NovaHealth Organics",
      template_type: "STORE_VISIT",
      reward_per_action: 200.0,
      estimated_time_minutes: 15,
      remaining_capacity: 49,
      verification_method: "MANUAL_REVIEW",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  useEffect(() => {
    async function load() {
      try {
        const res = await apiRequest("/campaigns");
        if (Array.isArray(res) && res.length > 0) {
          setMissions(res);
        }
      } catch (err) {
        // fallback
      }
    }
    load();
  }, []);

  const filtered = missions.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.tagline.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "ALL" || m.template_type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <DashboardLayout portalType="participant">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-brand-navy">Discover Verified Missions</h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Complete honest consumer tasks, surveys, and UGC briefs to earn verified rewards
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by topic or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs bg-transparent focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Category:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs"
            >
              <option value="ALL">All Categories</option>
              <option value="PRIVATE_SURVEY">Private Survey</option>
              <option value="UGC">Original UGC Video</option>
              <option value="VIDEO_QUIZ">Hosted Video & Quiz</option>
              <option value="STORE_VISIT">Store Check-in</option>
            </select>
          </div>
        </div>

        {/* Mission Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((m) => (
            <div
              key={m.id}
              className="bg-white p-6 rounded-2xl border border-brand-border shadow-xs hover:shadow-card hover:border-brand-violet/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">
                    {m.vendor_name || "Verified Brand"}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Coins className="w-3.5 h-3.5" />
                    ₹{m.reward_per_action}
                  </span>
                </div>

                <h3 className="font-bold text-base text-brand-navy mb-2 leading-snug">{m.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{m.tagline}</p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 py-3 border-t border-slate-100">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {m.estimated_time_minutes} mins
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-violet" />
                    {m.template_type}
                  </span>
                  <span className="text-emerald-700 font-semibold ml-auto text-[11px]">
                    {m.remaining_capacity} spots open
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/participant/missions/${m.id}`}
                  className="w-full py-2.5 rounded-xl gradient-brand text-white font-bold text-xs shadow-xs hover:brightness-105 transition-all flex items-center justify-center gap-2"
                >
                  <span>Inspect Brief & Accept</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

"use client";

import React, { useState } from "react";
import { Search, BookOpen, MessageSquare, Plus, LifeBuoy } from "lucide-react";

export default function OrganizationsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-screen bg-[#0a0e1a] text-gray-100">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold">Organizations</h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search projects"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-gray-600 text-sm w-64"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium">
                  <Plus className="w-4 h-4" />
                  New Organization
                </button>
              </div>
            </div>

            {/* Get Started Card */}
            <div className="border border-gray-800 rounded-lg p-6 bg-linear-to-br from-gray-900/50 to-gray-900/30">
              <h2 className="text-xl font-semibold mb-2">Get Started</h2>
              <p className="text-gray-400 mb-5">
                Create an organization to get started. Alternatively, ask your
                organization admin to invite you.
              </p>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium">
                  <Plus className="w-4 h-4" />
                  New Organization
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm border border-gray-700">
                  <BookOpen className="w-4 h-4" />
                  Docs
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm border border-gray-700">
                  <MessageSquare className="w-4 h-4" />
                  Ask AI
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  BellRing,
  Check,
  ChevronDown,
  Clock3,
  Edit3,
  Eye,
  Filter,
  Info,
  Megaphone,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings2,
  ShieldAlert,
  Trash2,
  Users,
  X,
  XCircle,
  AlertTriangle,
} from "lucide-react";

type NotificationType =
  | "System"
  | "Trading"
  | "Deposit"
  | "Withdrawal"
  | "Security"
  | "Promotion";

type NotificationStatus =
  | "Sent"
  | "Scheduled"
  | "Draft"
  | "Failed";

type Audience =
  | "All Users"
  | "Active Traders"
  | "Verified Users"
  | "Specific Users";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  audience: Audience;
  status: NotificationStatus;
  recipients: number;
  sentAt: string;
  createdAt: string;
  priority: "Normal" | "High" | "Urgent";
}

const initialNotifications: Notification[] = [
  {
    id: "NTF-001",
    title: "Welcome to PIPMASTER Trading",
    message:
      "Welcome to PIPMASTER Trading. Complete your account verification to unlock all trading features.",
    type: "System",
    audience: "Verified Users",
    status: "Sent",
    recipients: 1248,
    sentAt: "Aug 12, 2026 • 10:42 AM",
    createdAt: "Aug 12, 2026",
    priority: "Normal",
  },
  {
    id: "NTF-002",
    title: "Market Volatility Alert",
    message:
      "Major market volatility has been detected. Please review your open positions and risk exposure.",
    type: "Trading",
    audience: "Active Traders",
    status: "Sent",
    recipients: 684,
    sentAt: "Aug 12, 2026 • 09:18 AM",
    createdAt: "Aug 12, 2026",
    priority: "High",
  },
  {
    id: "NTF-003",
    title: "Scheduled Platform Maintenance",
    message:
      "PIPMASTER Trading will undergo scheduled maintenance. Trading services may be temporarily unavailable.",
    type: "System",
    audience: "All Users",
    status: "Scheduled",
    recipients: 1842,
    sentAt: "Aug 14, 2026 • 01:00 AM",
    createdAt: "Aug 11, 2026",
    priority: "High",
  },
  {
    id: "NTF-004",
    title: "Deposit Successfully Confirmed",
    message:
      "Your deposit has been successfully verified and credited to your trading account.",
    type: "Deposit",
    audience: "Specific Users",
    status: "Sent",
    recipients: 1,
    sentAt: "Aug 12, 2026 • 08:32 AM",
    createdAt: "Aug 12, 2026",
    priority: "Normal",
  },
  {
    id: "NTF-005",
    title: "Withdrawal Processing Update",
    message:
      "Your withdrawal request is currently being reviewed by our finance team.",
    type: "Withdrawal",
    audience: "Specific Users",
    status: "Sent",
    recipients: 1,
    sentAt: "Aug 12, 2026 • 08:12 AM",
    createdAt: "Aug 12, 2026",
    priority: "Normal",
  },
  {
    id: "NTF-006",
    title: "Security Verification Required",
    message:
      "Please complete the required security verification on your account.",
    type: "Security",
    audience: "Verified Users",
    status: "Draft",
    recipients: 0,
    sentAt: "-",
    createdAt: "Aug 11, 2026",
    priority: "Urgent",
  },
  {
    id: "NTF-007",
    title: "Trading Campaign Announcement",
    message:
      "A new PIPMASTER trading campaign is now available. Check the platform for more information.",
    type: "Promotion",
    audience: "Active Traders",
    status: "Scheduled",
    recipients: 684,
    sentAt: "Aug 15, 2026 • 12:00 PM",
    createdAt: "Aug 10, 2026",
    priority: "Normal",
  },
  {
    id: "NTF-008",
    title: "Account Security Reminder",
    message:
      "Keep your account secure by using a strong password and enabling available security features.",
    type: "Security",
    audience: "All Users",
    status: "Failed",
    recipients: 0,
    sentAt: "Aug 10, 2026 • 06:20 PM",
    createdAt: "Aug 10, 2026",
    priority: "High",
  },
];

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(
    initialNotifications
  );

  const [search, setSearch] = useState("");

  const [typeFilter, setTypeFilter] = useState<
    "All" | NotificationType
  >("All");

  const [statusFilter, setStatusFilter] = useState<
    "All" | NotificationStatus
  >("All");

  const [showFilters, setShowFilters] = useState(false);

  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  const [editingNotification, setEditingNotification] =
    useState<Notification | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredNotifications = useMemo(() => {
    const query = search.toLowerCase().trim();

    return notifications.filter((notification) => {
      const matchesSearch =
        !query ||
        notification.title.toLowerCase().includes(query) ||
        notification.message.toLowerCase().includes(query) ||
        notification.type.toLowerCase().includes(query) ||
        notification.audience.toLowerCase().includes(query);

      const matchesType =
        typeFilter === "All" ||
        notification.type === typeFilter;

      const matchesStatus =
        statusFilter === "All" ||
        notification.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [
    notifications,
    search,
    typeFilter,
    statusFilter,
  ]);

  const sentCount = notifications.filter(
    (notification) => notification.status === "Sent"
  ).length;

  const scheduledCount = notifications.filter(
    (notification) => notification.status === "Scheduled"
  ).length;

  const draftCount = notifications.filter(
    (notification) => notification.status === "Draft"
  ).length;

  const totalRecipients = notifications.reduce(
    (total, notification) =>
      total + notification.recipients,
    0
  );

  const deleteNotification = (id: string) => {
    setNotifications((current) =>
      current.filter(
        (notification) => notification.id !== id
      )
    );
  };

  const sendNotification = (id: string) => {
    setNotifications((current) =>
      current.map((notification) => {
        if (notification.id !== id) return notification;

        return {
          ...notification,
          status: "Sent",
          sentAt: "Just now",
        };
      })
    );
  };

  const saveNotification = (
    updatedNotification: Notification
  ) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === updatedNotification.id
          ? updatedNotification
          : notification
      )
    );

    setEditingNotification(null);
  };

  const createNotification = (
    notification: Notification
  ) => {
    setNotifications((current) => [
      notification,
      ...current,
    ]);

    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* =========================================================
          HEADER
      ========================================================= */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
            <BellRing className="h-5 w-5 text-cyan-400" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Notifications
            </h1>

            <p className="mt-1 text-[10px] text-gray-600">
              Manage customer alerts, system announcements and trading messages
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2.5 text-[10px] font-semibold text-gray-500 transition hover:bg-white/[0.05] hover:text-gray-300"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-3.5 py-2.5 text-[10px] font-bold text-black transition hover:bg-cyan-400"
          >
            <Plus className="h-3.5 w-3.5" />
            Create Notification
          </button>
        </div>
      </div>

      {/* =========================================================
          STAT CARDS
      ========================================================= */}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <NotificationStat
          title="Total Notifications"
          value={notifications.length.toString()}
          subtitle="All notification records"
          icon={Bell}
          iconClass="text-cyan-400"
        />

        <NotificationStat
          title="Sent"
          value={sentCount.toString()}
          subtitle="Successfully delivered"
          icon={Check}
          iconClass="text-emerald-400"
        />

        <NotificationStat
          title="Scheduled"
          value={scheduledCount.toString()}
          subtitle="Waiting to be sent"
          icon={Clock3}
          iconClass="text-amber-400"
        />

        <NotificationStat
          title="Recipients"
          value={totalRecipients.toLocaleString()}
          subtitle="Total delivery targets"
          icon={Users}
          iconClass="text-purple-400"
        />
      </div>

      {/* =========================================================
          QUICK STATUS
      ========================================================= */}

      <div className="grid gap-3 md:grid-cols-3">
        <NotificationStatusCard
          title="Delivery System"
          value="Operational"
          text="Notification services are currently available."
          icon={Check}
          className="text-emerald-400"
        />

        <NotificationStatusCard
          title="Scheduled Messages"
          value={`${scheduledCount} pending`}
          text="Notifications waiting for their scheduled time."
          icon={Clock3}
          className="text-amber-400"
        />

        <NotificationStatusCard
          title="Draft Messages"
          value={`${draftCount} drafts`}
          text="Messages created but not yet sent."
          icon={Edit3}
          className="text-gray-500"
        />
      </div>

      {/* =========================================================
          NOTIFICATIONS TABLE
      ========================================================= */}

      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0d121b]">
        {/* Toolbar */}

        <div className="flex flex-col gap-3 border-b border-white/[0.05] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xs font-semibold text-gray-300">
              Notification Center
            </h2>

            <p className="mt-1 text-[9px] text-gray-700">
              {filteredNotifications.length} of{" "}
              {notifications.length} notifications displayed
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-700" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search notifications..."
                className="h-9 w-full rounded-lg border border-white/[0.06] bg-white/[0.02] pl-9 pr-3 text-[10px] text-gray-300 outline-none placeholder:text-gray-700 transition focus:border-cyan-500/30 sm:w-64"
              />
            </div>

            <button
              type="button"
              onClick={() =>
                setShowFilters(!showFilters)
              }
              className={`flex h-9 items-center justify-center gap-2 rounded-lg border px-3 text-[10px] font-semibold transition ${
                showFilters ||
                typeFilter !== "All" ||
                statusFilter !== "All"
                  ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-400"
                  : "border-white/[0.06] bg-white/[0.02] text-gray-600 hover:text-gray-300"
              }`}
            >
              <Filter className="h-3.5 w-3.5" />
              Filter
            </button>
          </div>
        </div>

        {/* Filters */}

        {showFilters && (
          <div className="space-y-4 border-b border-white/[0.05] bg-white/[0.01] px-4 py-4 sm:px-5">
            <div>
              <p className="mb-2 text-[8px] font-bold uppercase tracking-wider text-gray-700">
                Notification Type
              </p>

              <div className="flex flex-wrap gap-2">
                {(
                  [
                    "All",
                    "System",
                    "Trading",
                    "Deposit",
                    "Withdrawal",
                    "Security",
                    "Promotion",
                  ] as const
                ).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      setTypeFilter(type)
                    }
                    className={`rounded-lg px-3 py-2 text-[9px] font-semibold transition ${
                      typeFilter === type
                        ? "bg-cyan-500/10 text-cyan-400"
                        : "bg-white/[0.025] text-gray-600 hover:text-gray-300"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[8px] font-bold uppercase tracking-wider text-gray-700">
                Status
              </p>

              <div className="flex flex-wrap gap-2">
                {(
                  [
                    "All",
                    "Sent",
                    "Scheduled",
                    "Draft",
                    "Failed",
                  ] as const
                ).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() =>
                      setStatusFilter(status)
                    }
                    className={`rounded-lg px-3 py-2 text-[9px] font-semibold transition ${
                      statusFilter === status
                        ? "bg-cyan-500/10 text-cyan-400"
                        : "bg-white/[0.025] text-gray-600 hover:text-gray-300"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Table */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead>
              <tr className="border-b border-white/[0.04] bg-white/[0.015]">
                <TableHead label="Notification" />
                <TableHead label="Type" />
                <TableHead label="Audience" />
                <TableHead label="Recipients" />
                <TableHead label="Priority" />
                <TableHead label="Status" />
                <TableHead label="Sent / Scheduled" />
                <TableHead label="Actions" />
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.04]">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map(
                  (notification) => (
                    <tr
                      key={notification.id}
                      className="transition hover:bg-white/[0.015]"
                    >
                      {/* Notification */}

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <NotificationIcon
                            type={notification.type}
                          />

                          <div className="max-w-[300px]">
                            <p className="truncate text-[10px] font-bold text-gray-300">
                              {notification.title}
                            </p>

                            <p className="mt-1 truncate text-[8px] text-gray-700">
                              {notification.message}
                            </p>

                            <p className="mt-1 text-[7px] text-gray-800">
                              {notification.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Type */}

                      <td className="px-4 py-4">
                        <NotificationTypeBadge
                          type={notification.type}
                        />
                      </td>

                      {/* Audience */}

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3 text-gray-700" />

                          <span className="text-[9px] text-gray-500">
                            {notification.audience}
                          </span>
                        </div>
                      </td>

                      {/* Recipients */}

                      <td className="px-4 py-4">
                        <span className="text-[9px] font-semibold text-gray-500">
                          {notification.recipients.toLocaleString()}
                        </span>
                      </td>

                      {/* Priority */}

                      <td className="px-4 py-4">
                        <PriorityBadge
                          priority={notification.priority}
                        />
                      </td>

                      {/* Status */}

                      <td className="px-4 py-4">
                        <NotificationStatusBadge
                          status={notification.status}
                        />
                      </td>

                      {/* Sent */}

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Clock3 className="h-3 w-3 text-gray-700" />

                          <span className="text-[8px] text-gray-600">
                            {notification.sentAt}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedNotification(
                                notification
                              )
                            }
                            title="View notification"
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.025] text-gray-600 transition hover:bg-white/[0.06] hover:text-gray-300"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          {notification.status ===
                            "Draft" && (
                            <button
                              type="button"
                              onClick={() =>
                                setEditingNotification(
                                  notification
                                )
                              }
                              title="Edit notification"
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.025] text-gray-600 transition hover:bg-white/[0.06] hover:text-gray-300"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                          )}

                          {notification.status ===
                            "Draft" && (
                            <button
                              type="button"
                              onClick={() =>
                                sendNotification(
                                  notification.id
                                )
                              }
                              title="Send notification"
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/5 text-emerald-500/70 transition hover:bg-emerald-500/10 hover:text-emerald-400"
                            >
                              <Send className="h-3.5 w-3.5" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              deleteNotification(
                                notification.id
                              )
                            }
                            title="Delete notification"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-700 transition hover:bg-red-500/5 hover:text-red-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>

                          <button
                            type="button"
                            title="More options"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-700 transition hover:bg-white/[0.04] hover:text-gray-400"
                          >
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-16 text-center"
                  >
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.03]">
                      <Bell className="h-4 w-4 text-gray-700" />
                    </div>

                    <p className="mt-3 text-xs font-semibold text-gray-500">
                      No notifications found
                    </p>

                    <p className="mt-1 text-[9px] text-gray-700">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}

        <div className="flex flex-col gap-3 border-t border-white/[0.05] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-[9px] text-gray-700">
            Notification service:{" "}
            <span className="text-emerald-400">
              Operational
            </span>
          </p>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[8px] text-gray-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Delivery system connected
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================
          INFORMATION CARDS
      ========================================================= */}

      <div className="grid gap-3 md:grid-cols-3">
        <InfoCard
          icon={Megaphone}
          title="Customer Announcements"
          text="Send important platform announcements and trading updates to selected customer groups."
        />

        <InfoCard
          icon={ShieldAlert}
          title="Security Alerts"
          text="Security notifications should be treated as high-priority messages and delivered immediately."
        />

        <InfoCard
          icon={Settings2}
          title="Notification Configuration"
          text="Configure your Node.js notification service later to deliver these messages through the customer dashboard."
        />
      </div>

      {/* =========================================================
          VIEW MODAL
      ========================================================= */}

      {selectedNotification && (
        <NotificationViewModal
          notification={selectedNotification}
          onClose={() =>
            setSelectedNotification(null)
          }
          onEdit={() => {
            setSelectedNotification(null);
            setEditingNotification(
              selectedNotification
            );
          }}
        />
      )}

      {/* =========================================================
          EDIT MODAL
      ========================================================= */}

      {editingNotification && (
        <NotificationEditModal
          notification={editingNotification}
          onClose={() =>
            setEditingNotification(null)
          }
          onSave={saveNotification}
        />
      )}

      {/* =========================================================
          CREATE MODAL
      ========================================================= */}

      {showCreateModal && (
        <CreateNotificationModal
          onClose={() =>
            setShowCreateModal(false)
          }
          onSave={createNotification}
        />
      )}
    </div>
  );
}

/* ========================================================================
   STAT CARD
========================================================================= */

function NotificationStat({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0d121b] p-4 sm:p-5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.035]">
        <Icon className={`h-4 w-4 ${iconClass}`} />
      </div>

      <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.12em] text-gray-600">
        {title}
      </p>

      <p className="mt-1 text-lg font-bold tracking-tight text-white">
        {value}
      </p>

      <p className="mt-1 text-[8px] text-gray-700">
        {subtitle}
      </p>
    </div>
  );
}

/* ========================================================================
   STATUS CARD
========================================================================= */

function NotificationStatusCard({
  title,
  value,
  text,
  icon: Icon,
  className,
}: {
  title: string;
  value: string;
  text: string;
  icon: React.ElementType;
  className: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0d121b] p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.035]">
          <Icon className={`h-3.5 w-3.5 ${className}`} />
        </div>

        <div>
          <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-700">
            {title}
          </p>

          <p className="mt-1 text-[10px] font-bold text-gray-400">
            {value}
          </p>
        </div>
      </div>

      <p className="mt-3 text-[9px] text-gray-700">
        {text}
      </p>
    </div>
  );
}

/* ========================================================================
   NOTIFICATION ICON
========================================================================= */

function NotificationIcon({
  type,
}: {
  type: NotificationType;
}) {
  const config: Record<
    NotificationType,
    {
      icon: React.ElementType;
      className: string;
    }
  > = {
    System: {
      icon: Bell,
      className: "bg-cyan-500/10 text-cyan-400",
    },
    Trading: {
      icon: Megaphone,
      className: "bg-purple-500/10 text-purple-400",
    },
    Deposit: {
      icon: Check,
      className: "bg-emerald-500/10 text-emerald-400",
    },
    Withdrawal: {
      icon: Send,
      className: "bg-red-500/10 text-red-400",
    },
    Security: {
      icon: ShieldAlert,
      className: "bg-amber-500/10 text-amber-400",
    },
    Promotion: {
      icon: BellRing,
      className: "bg-pink-500/10 text-pink-400",
    },
  };

  const item = config[type];
  const Icon = item.icon;

  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.className}`}
    >
      <Icon className="h-4 w-4" />
    </div>
  );
}

/* ========================================================================
   TYPE BADGE
========================================================================= */

function NotificationTypeBadge({
  type,
}: {
  type: NotificationType;
}) {
  const classes: Record<
    NotificationType,
    string
  > = {
    System:
      "bg-cyan-500/10 text-cyan-400",
    Trading:
      "bg-purple-500/10 text-purple-400",
    Deposit:
      "bg-emerald-500/10 text-emerald-400",
    Withdrawal:
      "bg-red-500/10 text-red-400",
    Security:
      "bg-amber-500/10 text-amber-400",
    Promotion:
      "bg-pink-500/10 text-pink-400",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1.5 text-[8px] font-semibold ${classes[type]}`}
    >
      {type}
    </span>
  );
}

/* ========================================================================
   PRIORITY BADGE
========================================================================= */

function PriorityBadge({
  priority,
}: {
  priority: Notification["priority"];
}) {
  if (priority === "Urgent") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-1.5 text-[8px] font-semibold text-red-400">
        <AlertTriangle className="h-3 w-3" />
        Urgent
      </span>
    );
  }

  if (priority === "High") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1.5 text-[8px] font-semibold text-amber-400">
        <ShieldAlert className="h-3 w-3" />
        High
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-white/[0.04] px-2.5 py-1.5 text-[8px] font-semibold text-gray-600">
      Normal
    </span>
  );
}

/* ========================================================================
   STATUS BADGE
========================================================================= */

function NotificationStatusBadge({
  status,
}: {
  status: NotificationStatus;
}) {
  if (status === "Sent") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1.5 text-[8px] font-semibold text-emerald-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        Sent
      </span>
    );
  }

  if (status === "Scheduled") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1.5 text-[8px] font-semibold text-amber-400">
        <Clock3 className="h-3 w-3" />
        Scheduled
      </span>
    );
  }

  if (status === "Draft") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] px-2.5 py-1.5 text-[8px] font-semibold text-gray-500">
        <Edit3 className="h-3 w-3" />
        Draft
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1.5 text-[8px] font-semibold text-red-400">
      <XCircle className="h-3 w-3" />
      Failed
    </span>
  );
}

/* ========================================================================
   TABLE HEAD
========================================================================= */

function TableHead({
  label,
}: {
  label: string;
}) {
  return (
    <th className="px-4 py-3 text-left text-[8px] font-bold uppercase tracking-wider text-gray-700">
      {label}
    </th>
  );
}

/* ========================================================================
   INFO CARD
========================================================================= */

function InfoCard({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0d121b] p-4">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.035]">
          <Icon className="h-3.5 w-3.5 text-gray-500" />
        </div>

        <p className="text-[10px] font-semibold text-gray-400">
          {title}
        </p>
      </div>

      <p className="mt-3 text-[9px] leading-4 text-gray-700">
        {text}
      </p>
    </div>
  );
}

/* ========================================================================
   VIEW MODAL
========================================================================= */

function NotificationViewModal({
  notification,
  onClose,
  onEdit,
}: {
  notification: Notification;
  onClose: () => void;
  onEdit: () => void;
}) {
  return (
    <ModalShell onClose={onClose}>
      <div className="flex items-center justify-between border-b border-white/[0.05] p-5">
        <div className="flex items-center gap-3">
          <NotificationIcon
            type={notification.type}
          />

          <div>
            <h2 className="text-xs font-bold text-white">
              Notification Details
            </h2>

            <p className="mt-1 text-[8px] text-gray-700">
              {notification.id}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 hover:bg-white/[0.04] hover:text-gray-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-5 p-5">
        <div>
          <p className="text-[8px] uppercase tracking-wider text-gray-700">
            Title
          </p>

          <p className="mt-2 text-sm font-bold text-white">
            {notification.title}
          </p>
        </div>

        <div>
          <p className="text-[8px] uppercase tracking-wider text-gray-700">
            Message
          </p>

          <div className="mt-2 rounded-xl border border-white/[0.05] bg-white/[0.015] p-4">
            <p className="text-[10px] leading-5 text-gray-500">
              {notification.message}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <DetailBox
            label="Type"
            value={notification.type}
          />

          <DetailBox
            label="Audience"
            value={notification.audience}
          />

          <DetailBox
            label="Recipients"
            value={notification.recipients.toLocaleString()}
          />

          <DetailBox
            label="Priority"
            value={notification.priority}
          />

          <DetailBox
            label="Status"
            value={notification.status}
          />

          <DetailBox
            label="Created"
            value={notification.createdAt}
          />
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-white/[0.05] pt-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/[0.06] px-4 py-2.5 text-[9px] font-semibold text-gray-600 hover:text-gray-300"
          >
            Close
          </button>

          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-[9px] font-bold text-black hover:bg-cyan-400"
          >
            <Edit3 className="h-3 w-3" />
            Edit Notification
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

/* ========================================================================
   EDIT MODAL
========================================================================= */

function NotificationEditModal({
  notification,
  onClose,
  onSave,
}: {
  notification: Notification;
  onClose: () => void;
  onSave: (
    notification: Notification
  ) => void;
}) {
  const [form, setForm] =
    useState<Notification>(notification);

  const update = (
    key: keyof Notification,
    value: string | number
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <ModalShell onClose={onClose}>
      <div className="flex items-center justify-between border-b border-white/[0.05] p-5">
        <div>
          <h2 className="text-xs font-bold text-white">
            Edit Notification
          </h2>

          <p className="mt-1 text-[8px] text-gray-700">
            Modify notification details
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 hover:bg-white/[0.04] hover:text-gray-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4 p-5">
        <FormField
          label="Title"
          value={form.title}
          onChange={(value) =>
            update("title", value)
          }
        />

        <TextAreaField
          label="Message"
          value={form.message}
          onChange={(value) =>
            update("message", value)
          }
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Type"
            value={form.type}
            options={[
              "System",
              "Trading",
              "Deposit",
              "Withdrawal",
              "Security",
              "Promotion",
            ]}
            onChange={(value) =>
              update("type", value)
            }
          />

          <SelectField
            label="Audience"
            value={form.audience}
            options={[
              "All Users",
              "Active Traders",
              "Verified Users",
              "Specific Users",
            ]}
            onChange={(value) =>
              update("audience", value)
            }
          />

          <SelectField
            label="Priority"
            value={form.priority}
            options={[
              "Normal",
              "High",
              "Urgent",
            ]}
            onChange={(value) =>
              update("priority", value)
            }
          />

          <SelectField
            label="Status"
            value={form.status}
            options={[
              "Sent",
              "Scheduled",
              "Draft",
              "Failed",
            ]}
            onChange={(value) =>
              update("status", value)
            }
          />
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-white/[0.05] pt-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/[0.06] px-4 py-2.5 text-[9px] font-semibold text-gray-600 hover:text-gray-300"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onSave(form)}
            className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-[9px] font-bold text-black hover:bg-cyan-400"
          >
            <Check className="h-3 w-3" />
            Save Changes
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

/* ========================================================================
   CREATE MODAL
========================================================================= */

function CreateNotificationModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (
    notification: Notification
  ) => void;
}) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const [type, setType] =
    useState<NotificationType>("System");

  const [audience, setAudience] =
    useState<Audience>("All Users");

  const [priority, setPriority] =
    useState<Notification["priority"]>(
      "Normal"
    );

  const [sendMode, setSendMode] =
    useState<"Send Now" | "Save Draft">(
      "Save Draft"
    );

  const handleSubmit = () => {
    if (!title.trim() || !message.trim()) {
      return;
    }

    const notification: Notification = {
      id: `NTF-${String(
        Math.floor(Math.random() * 900) + 100
      )}`,
      title,
      message,
      type,
      audience,
      status:
        sendMode === "Send Now"
          ? "Sent"
          : "Draft",
      recipients:
        audience === "All Users"
          ? 1842
          : audience === "Active Traders"
          ? 684
          : audience === "Verified Users"
          ? 1248
          : 1,
      sentAt:
        sendMode === "Send Now"
          ? "Just now"
          : "-",
      createdAt: "Aug 12, 2026",
      priority,
    };

    onSave(notification);
  };

  return (
    <ModalShell onClose={onClose}>
      <div className="flex items-center justify-between border-b border-white/[0.05] p-5">
        <div>
          <h2 className="text-xs font-bold text-white">
            Create Notification
          </h2>

          <p className="mt-1 text-[8px] text-gray-700">
            Send an alert or announcement to customers
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 hover:bg-white/[0.04] hover:text-gray-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4 p-5">
        <FormField
          label="Notification Title"
          value={title}
          placeholder="Enter notification title"
          onChange={setTitle}
        />

        <TextAreaField
          label="Message"
          value={message}
          placeholder="Write your notification message..."
          onChange={setMessage}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Notification Type"
            value={type}
            options={[
              "System",
              "Trading",
              "Deposit",
              "Withdrawal",
              "Security",
              "Promotion",
            ]}
            onChange={(value) =>
              setType(
                value as NotificationType
              )
            }
          />

          <SelectField
            label="Audience"
            value={audience}
            options={[
              "All Users",
              "Active Traders",
              "Verified Users",
              "Specific Users",
            ]}
            onChange={(value) =>
              setAudience(
                value as Audience
              )
            }
          />

          <SelectField
            label="Priority"
            value={priority}
            options={[
              "Normal",
              "High",
              "Urgent",
            ]}
            onChange={(value) =>
              setPriority(
                value as Notification["priority"]
              )
            }
          />

          <SelectField
            label="Delivery"
            value={sendMode}
            options={[
              "Send Now",
              "Save Draft",
            ]}
            onChange={(value) =>
              setSendMode(
                value as
                  | "Send Now"
                  | "Save Draft"
              )
            }
          />
        </div>

        <div className="rounded-xl border border-cyan-500/10 bg-cyan-500/[0.025] p-3">
          <div className="flex items-start gap-2.5">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400" />

            <p className="text-[8px] leading-4 text-gray-600">
              This interface currently uses local sample data.
              Later, the form can POST directly to your Node.js
              notification API and deliver the message to the PIPMASTER
              customer dashboard.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-white/[0.05] pt-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/[0.06] px-4 py-2.5 text-[9px] font-semibold text-gray-600 hover:text-gray-300"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              !title.trim() ||
              !message.trim()
            }
            className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-[9px] font-bold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {sendMode === "Send Now" ? (
              <>
                <Send className="h-3 w-3" />
                Send Notification
              </>
            ) : (
              <>
                <Edit3 className="h-3 w-3" />
                Save Draft
              </>
            )}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

/* ========================================================================
   MODAL SHELL
========================================================================= */

function ModalShell({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="my-8 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d121b] shadow-2xl">
        {children}
      </div>
    </div>
  );
}

/* ========================================================================
   DETAIL BOX
========================================================================= */

function DetailBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-3">
      <p className="text-[8px] uppercase tracking-wider text-gray-700">
        {label}
      </p>

      <p className="mt-2 text-[10px] font-semibold text-gray-400">
        {value}
      </p>
    </div>
  );
}

/* ========================================================================
   FORM FIELD
========================================================================= */

function FormField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-[8px] font-bold uppercase tracking-wider text-gray-700">
        {label}
      </label>

      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-10 w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 text-[10px] text-gray-300 outline-none placeholder:text-gray-700 transition focus:border-cyan-500/30"
      />
    </div>
  );
}

/* ========================================================================
   TEXT AREA
========================================================================= */

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-[8px] font-bold uppercase tracking-wider text-gray-700">
        {label}
      </label>

      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        rows={5}
        className="w-full resize-none rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-3 text-[10px] leading-5 text-gray-300 outline-none placeholder:text-gray-700 transition focus:border-cyan-500/30"
      />
    </div>
  );
}

/* ========================================================================
   SELECT FIELD
========================================================================= */

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-[8px] font-bold uppercase tracking-wider text-gray-700">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="h-10 w-full appearance-none rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 pr-9 text-[10px] text-gray-300 outline-none transition focus:border-cyan-500/30"
        >
          {options.map((option) => (
            <option
              key={option}
              value={option}
              className="bg-[#0d121b]"
            >
              {option}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-700" />
      </div>
    </div>
  );
}
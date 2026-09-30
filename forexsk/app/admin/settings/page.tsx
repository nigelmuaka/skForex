"use client";

import { useState } from "react";
import {
  Bell,
  Check,
  ChevronDown,
  Globe,
  KeyRound,
  Lock,
  Mail,
  Save,
  Server,
  Shield,
  SlidersHorizontal,
  Smartphone,
  ToggleLeft,
  UserCog,
  Wallet,
  X,
} from "lucide-react";

type Tab =
  | "General"
  | "Trading"
  | "Security"
  | "Notifications"
  | "Payments"
  | "System";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] =
    useState<Tab>("General");

  const [saved, setSaved] = useState(false);

  const [maintenanceMode, setMaintenanceMode] =
    useState(false);

  const [allowRegistration, setAllowRegistration] =
    useState(true);

  const [emailVerification, setEmailVerification] =
    useState(true);

  const [twoFactor, setTwoFactor] =
    useState(true);

  const [loginAlerts, setLoginAlerts] =
    useState(true);

  const [tradeAlerts, setTradeAlerts] =
    useState(true);

  const [depositAlerts, setDepositAlerts] =
    useState(true);

  const [withdrawalAlerts, setWithdrawalAlerts] =
    useState(true);

  const [emailNotifications, setEmailNotifications] =
    useState(true);

  const [pushNotifications, setPushNotifications] =
    useState(true);

  const [demoTrading, setDemoTrading] =
    useState(true);

  const [negativeBalanceProtection, setNegativeBalanceProtection] =
    useState(true);

  const [autoApproveDeposits, setAutoApproveDeposits] =
    useState(false);

  const [autoApproveWithdrawals, setAutoApproveWithdrawals] =
    useState(false);

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* =========================================================
          HEADER
      ========================================================= */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
            <SlidersHorizontal className="h-5 w-5 text-cyan-400" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Settings
            </h1>

            <p className="mt-1 text-[10px] text-gray-600">
              Manage PIPMASTER platform configuration and administrative controls
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="flex w-fit items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-[10px] font-bold text-black transition hover:bg-cyan-400"
        >
          {saved ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Changes Saved
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* =========================================================
          WARNING
      ========================================================= */}

      {maintenanceMode && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/[0.05] p-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
            <Server className="h-4 w-4 text-amber-400" />
          </div>

          <div>
            <p className="text-[10px] font-bold text-amber-400">
              Maintenance Mode Enabled
            </p>

            <p className="mt-1 text-[9px] leading-4 text-amber-500/60">
              Customer trading access may be restricted while maintenance
              mode is active.
            </p>
          </div>
        </div>
      )}

      {/* =========================================================
          SETTINGS LAYOUT
      ========================================================= */}

      <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
        {/* =======================================================
            SIDEBAR
        ======================================================= */}

        <div className="h-fit rounded-2xl border border-white/[0.06] bg-[#0d121b] p-2">
          <SettingsNav
            icon={Globe}
            label="General"
            active={activeTab === "General"}
            onClick={() =>
              setActiveTab("General")
            }
          />

          <SettingsNav
            icon={Wallet}
            label="Trading"
            active={activeTab === "Trading"}
            onClick={() =>
              setActiveTab("Trading")
            }
          />

          <SettingsNav
            icon={Shield}
            label="Security"
            active={activeTab === "Security"}
            onClick={() =>
              setActiveTab("Security")
            }
          />

          <SettingsNav
            icon={Bell}
            label="Notifications"
            active={
              activeTab === "Notifications"
            }
            onClick={() =>
              setActiveTab("Notifications")
            }
          />

          <SettingsNav
            icon={Wallet}
            label="Payments"
            active={activeTab === "Payments"}
            onClick={() =>
              setActiveTab("Payments")
            }
          />

          <SettingsNav
            icon={Server}
            label="System"
            active={activeTab === "System"}
            onClick={() =>
              setActiveTab("System")
            }
          />
        </div>

        {/* =======================================================
            CONTENT
        ======================================================= */}

        <div className="min-w-0">
          {activeTab === "General" && (
            <GeneralSettings
              maintenanceMode={maintenanceMode}
              setMaintenanceMode={
                setMaintenanceMode
              }
              allowRegistration={allowRegistration}
              setAllowRegistration={
                setAllowRegistration
              }
              emailVerification={
                emailVerification
              }
              setEmailVerification={
                setEmailVerification
              }
            />
          )}

          {activeTab === "Trading" && (
            <TradingSettings
              demoTrading={demoTrading}
              setDemoTrading={setDemoTrading}
              negativeBalanceProtection={
                negativeBalanceProtection
              }
              setNegativeBalanceProtection={
                setNegativeBalanceProtection
              }
            />
          )}

          {activeTab === "Security" && (
            <SecuritySettings
              twoFactor={twoFactor}
              setTwoFactor={setTwoFactor}
              loginAlerts={loginAlerts}
              setLoginAlerts={setLoginAlerts}
            />
          )}

          {activeTab === "Notifications" && (
            <NotificationSettings
              tradeAlerts={tradeAlerts}
              setTradeAlerts={setTradeAlerts}
              depositAlerts={depositAlerts}
              setDepositAlerts={
                setDepositAlerts
              }
              withdrawalAlerts={
                withdrawalAlerts
              }
              setWithdrawalAlerts={
                setWithdrawalAlerts
              }
              emailNotifications={
                emailNotifications
              }
              setEmailNotifications={
                setEmailNotifications
              }
              pushNotifications={
                pushNotifications
              }
              setPushNotifications={
                setPushNotifications
              }
            />
          )}

          {activeTab === "Payments" && (
            <PaymentSettings
              autoApproveDeposits={
                autoApproveDeposits
              }
              setAutoApproveDeposits={
                setAutoApproveDeposits
              }
              autoApproveWithdrawals={
                autoApproveWithdrawals
              }
              setAutoApproveWithdrawals={
                setAutoApproveWithdrawals
              }
            />
          )}

          {activeTab === "System" && (
            <SystemSettings />
          )}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   SETTINGS NAV
================================================================ */

function SettingsNav({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
        active
          ? "bg-cyan-500/10 text-cyan-400"
          : "text-gray-600 hover:bg-white/[0.025] hover:text-gray-300"
      }`}
    >
      <Icon className="h-4 w-4" />

      <span className="text-[10px] font-semibold">
        {label}
      </span>
    </button>
  );
}

/* ================================================================
   GENERAL SETTINGS
================================================================ */

function GeneralSettings({
  maintenanceMode,
  setMaintenanceMode,
  allowRegistration,
  setAllowRegistration,
  emailVerification,
  setEmailVerification,
}: {
  maintenanceMode: boolean;
  setMaintenanceMode: (value: boolean) => void;
  allowRegistration: boolean;
  setAllowRegistration: (value: boolean) => void;
  emailVerification: boolean;
  setEmailVerification: (value: boolean) => void;
}) {
  return (
    <div className="space-y-4">
      <SettingsHeader
        title="General Settings"
        description="Basic configuration for the PIPMASTER trading platform."
        icon={Globe}
      />

      <SettingsCard title="Platform Information">
        <div className="grid gap-4 md:grid-cols-2">
          <InputField
            label="Platform Name"
            value="PIPMASTER TRADING"
          />

          <InputField
            label="Support Email"
            value="support@pipmaster.com"
            type="email"
          />

          <InputField
            label="Platform URL"
            value="https://pipmaster.com"
          />

          <SelectField
            label="Default Currency"
            value="KES — Kenyan Shilling"
            options={[
              "KES — Kenyan Shilling",
              "USD — US Dollar",
              "EUR — Euro",
              "GBP — British Pound",
            ]}
          />

          <SelectField
            label="Default Language"
            value="English"
            options={[
              "English",
              "Swahili",
            ]}
          />

          <SelectField
            label="Timezone"
            value="Africa/Nairobi"
            options={[
              "Africa/Nairobi",
              "UTC",
              "Europe/London",
              "America/New_York",
            ]}
          />
        </div>
      </SettingsCard>

      <SettingsCard title="Customer Access">
        <div className="space-y-1">
          <ToggleRow
            icon={UserCog}
            title="Allow New Registrations"
            description="Allow new customers to create trading accounts."
            enabled={allowRegistration}
            onToggle={() =>
              setAllowRegistration(
                !allowRegistration
              )
            }
          />

          <ToggleRow
            icon={Mail}
            title="Email Verification"
            description="Require customers to verify their email before accessing the platform."
            enabled={emailVerification}
            onToggle={() =>
              setEmailVerification(
                !emailVerification
              )
            }
          />

          <ToggleRow
            icon={Server}
            title="Maintenance Mode"
            description="Temporarily restrict customer access while system maintenance is being performed."
            enabled={maintenanceMode}
            onToggle={() =>
              setMaintenanceMode(
                !maintenanceMode
              )
            }
            danger
          />
        </div>
      </SettingsCard>

      <SettingsCard title="Branding">
        <div className="grid gap-4 md:grid-cols-2">
          <InputField
            label="Company Name"
            value="PIPMASTER TRADING"
          />

          <InputField
            label="Support Phone"
            value="+254 700 000 000"
          />

          <div className="md:col-span-2">
            <label className="mb-2 block text-[8px] font-bold uppercase tracking-wider text-gray-700">
              Platform Description
            </label>

            <textarea
              defaultValue="Professional online trading platform providing access to global financial markets."
              rows={4}
              className="w-full resize-none rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-3 text-[10px] text-gray-400 outline-none placeholder:text-gray-700 focus:border-cyan-500/30"
            />
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}

/* ================================================================
   TRADING SETTINGS
================================================================ */

function TradingSettings({
  demoTrading,
  setDemoTrading,
  negativeBalanceProtection,
  setNegativeBalanceProtection,
}: {
  demoTrading: boolean;
  setDemoTrading: (value: boolean) => void;
  negativeBalanceProtection: boolean;
  setNegativeBalanceProtection: (
    value: boolean
  ) => void;
}) {
  return (
    <div className="space-y-4">
      <SettingsHeader
        title="Trading Settings"
        description="Control trading rules, account behavior and risk configuration."
        icon={Wallet}
      />

      <SettingsCard title="Trading Configuration">
        <div className="grid gap-4 md:grid-cols-2">
          <InputField
            label="Minimum Trade Size"
            value="0.01"
          />

          <InputField
            label="Maximum Trade Size"
            value="100.00"
          />

          <InputField
            label="Default Leverage"
            value="1:100"
          />

          <InputField
            label="Maximum Leverage"
            value="1:500"
          />

          <InputField
            label="Minimum Deposit"
            value="1000"
          />

          <InputField
            label="Maximum Open Positions"
            value="50"
          />
        </div>
      </SettingsCard>

      <SettingsCard title="Risk Controls">
        <div className="space-y-1">
          <ToggleRow
            icon={Shield}
            title="Negative Balance Protection"
            description="Prevent customer accounts from going below zero."
            enabled={negativeBalanceProtection}
            onToggle={() =>
              setNegativeBalanceProtection(
                !negativeBalanceProtection
              )
            }
          />

          <ToggleRow
            icon={SlidersHorizontal}
            title="Demo Trading"
            description="Allow customers to use demo trading accounts."
            enabled={demoTrading}
            onToggle={() =>
              setDemoTrading(!demoTrading)
            }
          />
        </div>
      </SettingsCard>

      <SettingsCard title="Market Configuration">
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField
            label="Market Status"
            value="Open"
            options={[
              "Open",
              "Closed",
              "Maintenance",
            ]}
          />

          <SelectField
            label="Execution Mode"
            value="Market Execution"
            options={[
              "Market Execution",
              "Instant Execution",
            ]}
          />

          <InputField
            label="Default Spread"
            value="1.5 pips"
          />

          <InputField
            label="Maximum Slippage"
            value="3 pips"
          />
        </div>
      </SettingsCard>
    </div>
  );
}

/* ================================================================
   SECURITY SETTINGS
================================================================ */

function SecuritySettings({
  twoFactor,
  setTwoFactor,
  loginAlerts,
  setLoginAlerts,
}: {
  twoFactor: boolean;
  setTwoFactor: (value: boolean) => void;
  loginAlerts: boolean;
  setLoginAlerts: (value: boolean) => void;
}) {
  return (
    <div className="space-y-4">
      <SettingsHeader
        title="Security"
        description="Protect customer accounts and administrative access."
        icon={Shield}
      />

      <SettingsCard title="Authentication">
        <div className="space-y-1">
          <ToggleRow
            icon={Shield}
            title="Two-Factor Authentication"
            description="Require an additional authentication factor for sensitive accounts."
            enabled={twoFactor}
            onToggle={() =>
              setTwoFactor(!twoFactor)
            }
          />

          <ToggleRow
            icon={Bell}
            title="Login Alerts"
            description="Notify administrators when a new login is detected."
            enabled={loginAlerts}
            onToggle={() =>
              setLoginAlerts(!loginAlerts)
            }
          />
        </div>
      </SettingsCard>

      <SettingsCard title="Password Policy">
        <div className="grid gap-4 md:grid-cols-2">
          <InputField
            label="Minimum Password Length"
            value="8"
          />

          <SelectField
            label="Password Expiration"
            value="90 Days"
            options={[
              "Never",
              "30 Days",
              "60 Days",
              "90 Days",
            ]}
          />

          <SelectField
            label="Maximum Login Attempts"
            value="5 Attempts"
            options={[
              "3 Attempts",
              "5 Attempts",
              "10 Attempts",
            ]}
          />

          <SelectField
            label="Lockout Duration"
            value="15 Minutes"
            options={[
              "5 Minutes",
              "15 Minutes",
              "30 Minutes",
              "1 Hour",
            ]}
          />
        </div>
      </SettingsCard>

      <SettingsCard title="Admin Security">
        <div className="space-y-3">
          <ActionRow
            icon={KeyRound}
            title="Change Admin Password"
            description="Update the password used to access the administration panel."
            button="Change"
          />

          <ActionRow
            icon={Smartphone}
            title="Authenticator App"
            description="Configure an authenticator application for administrator accounts."
            button="Configure"
          />

          <ActionRow
            icon={Lock}
            title="Active Sessions"
            description="Review and revoke active administrator sessions."
            button="Manage"
          />
        </div>
      </SettingsCard>
    </div>
  );
}

/* ================================================================
   NOTIFICATIONS
================================================================ */

function NotificationSettings({
  tradeAlerts,
  setTradeAlerts,
  depositAlerts,
  setDepositAlerts,
  withdrawalAlerts,
  setWithdrawalAlerts,
  emailNotifications,
  setEmailNotifications,
  pushNotifications,
  setPushNotifications,
}: {
  tradeAlerts: boolean;
  setTradeAlerts: (value: boolean) => void;
  depositAlerts: boolean;
  setDepositAlerts: (value: boolean) => void;
  withdrawalAlerts: boolean;
  setWithdrawalAlerts: (
    value: boolean
  ) => void;
  emailNotifications: boolean;
  setEmailNotifications: (
    value: boolean
  ) => void;
  pushNotifications: boolean;
  setPushNotifications: (
    value: boolean
  ) => void;
}) {
  return (
    <div className="space-y-4">
      <SettingsHeader
        title="Notifications"
        description="Configure alerts and administrative notifications."
        icon={Bell}
      />

      <SettingsCard title="Platform Alerts">
        <div className="space-y-1">
          <ToggleRow
            icon={Wallet}
            title="Trade Alerts"
            description="Receive notifications when customer trades are opened or closed."
            enabled={tradeAlerts}
            onToggle={() =>
              setTradeAlerts(!tradeAlerts)
            }
          />

          <ToggleRow
            icon={Wallet}
            title="Deposit Alerts"
            description="Receive notifications when customers make deposits."
            enabled={depositAlerts}
            onToggle={() =>
              setDepositAlerts(
                !depositAlerts
              )
            }
          />

          <ToggleRow
            icon={Wallet}
            title="Withdrawal Alerts"
            description="Receive notifications when customers request withdrawals."
            enabled={withdrawalAlerts}
            onToggle={() =>
              setWithdrawalAlerts(
                !withdrawalAlerts
              )
            }
          />
        </div>
      </SettingsCard>

      <SettingsCard title="Notification Channels">
        <div className="space-y-1">
          <ToggleRow
            icon={Mail}
            title="Email Notifications"
            description="Send administrative alerts to the configured support email."
            enabled={emailNotifications}
            onToggle={() =>
              setEmailNotifications(
                !emailNotifications
              )
            }
          />

          <ToggleRow
            icon={Smartphone}
            title="Push Notifications"
            description="Send real-time notifications to supported admin devices."
            enabled={pushNotifications}
            onToggle={() =>
              setPushNotifications(
                !pushNotifications
              )
            }
          />
        </div>
      </SettingsCard>

      <SettingsCard title="Notification Email">
        <div className="grid gap-4 md:grid-cols-2">
          <InputField
            label="Admin Email"
            value="admin@pipmaster.com"
            type="email"
          />

          <InputField
            label="SMTP Host"
            value="smtp.example.com"
          />

          <InputField
            label="SMTP Port"
            value="587"
          />

          <SelectField
            label="Encryption"
            value="TLS"
            options={[
              "TLS",
              "SSL",
              "None",
            ]}
          />
        </div>
      </SettingsCard>
    </div>
  );
}

/* ================================================================
   PAYMENT SETTINGS
================================================================ */

function PaymentSettings({
  autoApproveDeposits,
  setAutoApproveDeposits,
  autoApproveWithdrawals,
  setAutoApproveWithdrawals,
}: {
  autoApproveDeposits: boolean;
  setAutoApproveDeposits: (
    value: boolean
  ) => void;
  autoApproveWithdrawals: boolean;
  setAutoApproveWithdrawals: (
    value: boolean
  ) => void;
}) {
  return (
    <div className="space-y-4">
      <SettingsHeader
        title="Payment Settings"
        description="Configure deposits, withdrawals and payment processing controls."
        icon={Wallet}
      />

      <SettingsCard title="Deposit Configuration">
        <div className="grid gap-4 md:grid-cols-2">
          <InputField
            label="Minimum Deposit"
            value="1000"
          />

          <InputField
            label="Maximum Deposit"
            value="1000000"
          />

          <InputField
            label="Deposit Processing Fee"
            value="1.5%"
          />

          <SelectField
            label="Deposit Currency"
            value="KES"
            options={[
              "KES",
              "USD",
              "EUR",
            ]}
          />
        </div>

        <div className="mt-4">
          <ToggleRow
            icon={Wallet}
            title="Auto-Approve Deposits"
            description="Automatically approve deposits that meet your verification requirements."
            enabled={autoApproveDeposits}
            onToggle={() =>
              setAutoApproveDeposits(
                !autoApproveDeposits
              )
            }
            warning
          />
        </div>
      </SettingsCard>

      <SettingsCard title="Withdrawal Configuration">
        <div className="grid gap-4 md:grid-cols-2">
          <InputField
            label="Minimum Withdrawal"
            value="500"
          />

          <InputField
            label="Maximum Withdrawal"
            value="500000"
          />

          <InputField
            label="Withdrawal Processing Fee"
            value="1%"
          />

          <SelectField
            label="Withdrawal Currency"
            value="KES"
            options={[
              "KES",
              "USD",
              "EUR",
            ]}
          />
        </div>

        <div className="mt-4">
          <ToggleRow
            icon={Wallet}
            title="Auto-Approve Withdrawals"
            description="Automatically process withdrawal requests that meet configured requirements."
            enabled={
              autoApproveWithdrawals
            }
            onToggle={() =>
              setAutoApproveWithdrawals(
                !autoApproveWithdrawals
              )
            }
            danger
          />
        </div>
      </SettingsCard>

      <SettingsCard title="Payment Providers">
        <div className="space-y-3">
          <PaymentProvider
            name="M-Pesa"
            description="Mobile money payment processing"
            status="Connected"
          />

          <PaymentProvider
            name="Bank Transfer"
            description="Direct bank deposit and withdrawal processing"
            status="Connected"
          />

          <PaymentProvider
            name="Card Payments"
            description="Visa and Mastercard payment processing"
            status="Not Connected"
          />
        </div>
      </SettingsCard>
    </div>
  );
}

/* ================================================================
   SYSTEM SETTINGS
================================================================ */

function SystemSettings() {
  return (
    <div className="space-y-4">
      <SettingsHeader
        title="System"
        description="Monitor platform infrastructure and system configuration."
        icon={Server}
      />

      <SettingsCard title="System Information">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <SystemInfo
            label="Application"
            value="PIPMASTER"
          />

          <SystemInfo
            label="Environment"
            value="Development"
          />

          <SystemInfo
            label="Backend"
            value="Node.js"
          />

          <SystemInfo
            label="Database"
            value="MySQL"
          />

          <SystemInfo
            label="Frontend"
            value="Next.js"
          />

          <SystemInfo
            label="API Status"
            value="Operational"
            positive
          />
        </div>
      </SettingsCard>

      <SettingsCard title="System Controls">
        <div className="space-y-3">
          <ActionRow
            icon={Server}
            title="Clear Application Cache"
            description="Clear temporary application cache and refresh system data."
            button="Clear Cache"
          />

          <ActionRow
            icon={RefreshIcon}
            title="Restart Services"
            description="Restart application services after a configuration change."
            button="Restart"
          />

          <ActionRow
            icon={Shield}
            title="System Health"
            description="Run a health check across the trading platform services."
            button="Check"
          />
        </div>
      </SettingsCard>

      <SettingsCard title="API Configuration">
        <div className="grid gap-4 md:grid-cols-2">
          <InputField
            label="API Base URL"
            value="http://localhost:5000/api"
          />

          <InputField
            label="WebSocket URL"
            value="ws://localhost:5000"
          />

          <InputField
            label="API Timeout"
            value="30000 ms"
          />

          <SelectField
            label="API Environment"
            value="Development"
            options={[
              "Development",
              "Staging",
              "Production",
            ]}
          />
        </div>
      </SettingsCard>

      <div className="rounded-2xl border border-red-500/10 bg-red-500/[0.025] p-4">
        <div className="flex items-start gap-3">
          <Shield className="mt-0.5 h-4 w-4 text-red-400" />

          <div>
            <p className="text-[10px] font-bold text-red-400">
              Production Safety
            </p>

            <p className="mt-1 text-[9px] leading-4 text-red-500/50">
              System configuration displayed here is intended for
              administrative use. Production credentials and secret keys
              should be stored securely in environment variables.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   SETTINGS HEADER
================================================================ */

function SettingsHeader({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0d121b] p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10">
          <Icon className="h-4 w-4 text-cyan-400" />
        </div>

        <div>
          <h2 className="text-xs font-bold text-gray-300">
            {title}
          </h2>

          <p className="mt-1 text-[9px] text-gray-700">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   SETTINGS CARD
================================================================ */

function SettingsCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0d121b] p-5">
      <h3 className="mb-4 text-[10px] font-bold text-gray-400">
        {title}
      </h3>

      {children}
    </div>
  );
}

/* ================================================================
   INPUT
================================================================ */

function InputField({
  label,
  value,
  type = "text",
}: {
  label: string;
  value: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-[8px] font-bold uppercase tracking-wider text-gray-700">
        {label}
      </label>

      <input
        type={type}
        defaultValue={value}
        className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 text-[10px] text-gray-400 outline-none transition placeholder:text-gray-700 focus:border-cyan-500/30"
      />
    </div>
  );
}

/* ================================================================
   SELECT
================================================================ */

function SelectField({
  label,
  value,
  options,
}: {
  label: string;
  value: string;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-2 block text-[8px] font-bold uppercase tracking-wider text-gray-700">
        {label}
      </label>

      <div className="relative">
        <select
          defaultValue={value}
          className="h-10 w-full appearance-none rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 pr-9 text-[10px] text-gray-400 outline-none focus:border-cyan-500/30"
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

/* ================================================================
   TOGGLE
================================================================ */

function ToggleRow({
  icon: Icon,
  title,
  description,
  enabled,
  onToggle,
  danger = false,
  warning = false,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  danger?: boolean;
  warning?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.04] bg-white/[0.015] p-3.5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.03]">
          <Icon className="h-3.5 w-3.5 text-gray-600" />
        </div>

        <div className="min-w-0">
          <p className="text-[9px] font-semibold text-gray-400">
            {title}
          </p>

          <p className="mt-1 text-[8px] leading-4 text-gray-700">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggle}
        className={`relative h-5 w-9 shrink-0 rounded-full transition ${
          enabled
            ? danger
              ? "bg-red-500/70"
              : warning
              ? "bg-amber-500/70"
              : "bg-cyan-500/70"
            : "bg-white/[0.08]"
        }`}
        aria-label={`Toggle ${title}`}
      >
        <span
          className={`absolute top-1 h-3 w-3 rounded-full bg-white transition ${
            enabled
              ? "left-5"
              : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

/* ================================================================
   ACTION ROW
================================================================ */

function ActionRow({
  icon: Icon,
  title,
  description,
  button,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  button: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.04] bg-white/[0.015] p-3.5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.03]">
          <Icon className="h-3.5 w-3.5 text-gray-600" />
        </div>

        <div>
          <p className="text-[9px] font-semibold text-gray-400">
            {title}
          </p>

          <p className="mt-1 text-[8px] leading-4 text-gray-700">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        className="shrink-0 rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-2 text-[8px] font-semibold text-gray-600 transition hover:border-cyan-500/20 hover:text-cyan-400"
      >
        {button}
      </button>
    </div>
  );
}

/* ================================================================
   PAYMENT PROVIDER
================================================================ */

function PaymentProvider({
  name,
  description,
  status,
}: {
  name: string;
  description: string;
  status: "Connected" | "Not Connected";
}) {
  const connected =
    status === "Connected";

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.04] bg-white/[0.015] p-3.5">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03]">
          <Wallet className="h-3.5 w-3.5 text-gray-600" />
        </div>

        <div>
          <p className="text-[9px] font-semibold text-gray-400">
            {name}
          </p>

          <p className="mt-1 text-[8px] text-gray-700">
            {description}
          </p>
        </div>
      </div>

      <span
        className={`rounded-full px-2.5 py-1.5 text-[8px] font-semibold ${
          connected
            ? "bg-emerald-500/10 text-emerald-400"
            : "bg-gray-500/10 text-gray-600"
        }`}
      >
        {status}
      </span>
    </div>
  );
}

/* ================================================================
   SYSTEM INFO
================================================================ */

function SystemInfo({
  label,
  value,
  positive = false,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-3.5">
      <p className="text-[8px] uppercase tracking-wider text-gray-700">
        {label}
      </p>

      <p
        className={`mt-2 text-[10px] font-bold ${
          positive
            ? "text-emerald-400"
            : "text-gray-400"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* ================================================================
   REFRESH ICON
================================================================ */

function RefreshIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 5v4h4" />
      <path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 19v-4h-4" />
    </svg>
  );
}
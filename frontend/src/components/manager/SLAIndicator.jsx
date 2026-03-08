import { formatSLATime } from "../../utils/formatters.js";

export const SLAIndicator = ({ timeRemaining, slaBreached, status }) => {
  // Si ya está resuelto o descartado, no mostrar SLA
  if (status === "resuelto" || status === "descartado") {
    return <span className="text-sm text-gray-500">-</span>;
  }

  if (slaBreached || timeRemaining?.expired) {
    return (
      <div className="flex items-center text-red-600">
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-sm font-medium">SLA Vencido</span>
      </div>
    );
  }

  const minutes = timeRemaining?.minutes || 0;
  const isUrgent = minutes < 30;

  return (
    <div
      className={`flex items-center ${isUrgent ? "text-orange-600" : "text-gray-600"}`}
    >
      <svg
        className="w-4 h-4 mr-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span className="text-sm font-medium">
        {formatSLATime(timeRemaining)}
      </span>
    </div>
  );
};

import { STATUS_LABELS, STATUS_COLORS } from "../../utils/constants";

export const StatusBadge = ({ status }) => {
  return (
    <span
      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${STATUS_COLORS[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
};

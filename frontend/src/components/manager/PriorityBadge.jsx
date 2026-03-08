import { PRIORITY_LABELS, PRIORITY_COLORS } from "../../utils/constants";

export const PriorityBadge = ({ priority }) => {
  return (
    <span
      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${PRIORITY_COLORS[priority]}`}
    >
      {PRIORITY_LABELS[priority]}
    </span>
  );
};

import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../app/store";
import { hideModal } from "../features/modalSlice";

export default function GlobalModal() {
  const { isOpen, title, message, type, confirmAction } = useSelector((state: RootState) => state.modal);
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const bgTypeColors = {
    info: "bg-blue-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
  }[type];

  const hoverBgColors = {
    info: "hover:bg-blue-600",
    warning: "hover:bg-yellow-600",
    error: "hover:bg-red-600",
  }[type]

  const handleClose = () => dispatch(hideModal());

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
      <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg w-96 max-w-full p-6 border border-white/30">
        <h2 className={`text-xl font-bold mb-2 text-black`}>
          {title}
        </h2>
        <p className="mb-4 text-gray-700">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2  bg-green-500 rounded  hover:bg-green-600 cursor-pointer transition-colors duration-300"
            onClick={handleClose}
          >
            Close
          </button>
          {confirmAction && (
            <button
              className={`px-4 py-2 ${bgTypeColors}  text-black rounded ${hoverBgColors} cursor-pointer transition-colors duration-300`}
              onClick={() => {
                confirmAction();
                handleClose();
              }}
            >
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

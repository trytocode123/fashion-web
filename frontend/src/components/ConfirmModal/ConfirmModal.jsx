import { IoAlertCircleOutline } from "react-icons/io5";

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, type = "danger" }) => {
    if (!isOpen) return null;

    const colors = {
        danger: "bg-red-50 text-red-600 border-red-100",
        warning: "bg-amber-50 text-amber-600 border-amber-100",
        info: "bg-blue-50 text-blue-600 border-blue-100"
    };

    const confirmButtonColors = {
        danger: "bg-red-600 hover:bg-red-700 shadow-red-200",
        warning: "bg-amber-600 hover:bg-amber-700 shadow-amber-200",
        info: "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 transition-all">

            <div
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-scale-in">
                <div className="p-8">
                    <div className="flex flex-col items-center text-center">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 border-4 ${colors[type]}`}>
                            <IoAlertCircleOutline size={48} />
                        </div>

                        <h3 className="text-2xl font-black text-gray-900 mb-3">{title}</h3>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            {message}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-10">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-4 rounded-2xl font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 transition-all active:scale-[0.98]"
                        >
                            {cancelText || "Cancel"}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`flex-1 px-6 py-4 rounded-2xl font-bold text-white transition-all shadow-lg active:scale-[0.98] ${confirmButtonColors[type]}`}
                        >
                            {confirmText || "Confirm"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;

import { useRef, useState } from "react";
import { Tables } from "./Table";
import ComButton from "../../../Components/ComButton/ComButton";
import ComModal from "../../../Components/ComModal/ComModal";
import { useModalState } from "../../../hook/useModalState";

function StaffManagement() {
  const modal = useModalState();
  const tableRef = useRef(null);

  return (
    <div>
      <div className="flex justify-between items-center pb-4"> 
        <div>
          <ComButton onClick={modal.handleOpen}>Thêm nhân viên</ComButton>
        </div>
      </div>
      <ComModal width={800} isOpen={modal?.isModalOpen} onClose={modal?.handleClose}>
        {/* Add staff form will go here */}
      </ComModal>
      <Tables ref={tableRef} />
    </div>
  );
}

export default StaffManagement; 
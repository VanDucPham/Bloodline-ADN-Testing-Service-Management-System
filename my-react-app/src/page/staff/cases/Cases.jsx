import { useRef, useState } from "react"; 
import {  Tables } from "./Table";
import ComButton from "../../../Components/ComButton/ComButton"; 
import ComModal from "../../../Components/ComModal/ComModal";
// import CreateUser from "./CreateUser"; 
import { useModalState } from "../../../hook/useModalState";
function Cases() {
  const modal = useModalState();
  const tableRef = useRef(null);
  return (
    <div>
      <div className="flex justify-end pb-2">
        <div><ComButton onClick={modal.handleOpen}>Tạo mới</ComButton></div>
      </div>
      <ComModal width={800} isOpen={modal?.isModalOpen} onClose={modal?.handleClose}>
        {/* <CreateUser
          isOpen={modal?.isModalOpen}
          onClose={modal?.handleClose}
          tableRef={tableRef}
        /> */}
      </ComModal>
      <Tables ref={tableRef} />
    </div>
  );
}

export default Cases;

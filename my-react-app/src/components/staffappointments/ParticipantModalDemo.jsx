import React, { useState } from 'react';
import ParticipantModal from './ParticipantModal';

// Dữ liệu mẫu cho service với participantType
const mockService = {
  serviceId: 1,
  serviceName: "Xét nghiệm ADN cha con",
  serviceDescription: "Xét nghiệm ADN để xác định quan hệ cha con",
  limitPeople: 2,
  participantsType: [
    {
      participantId: 1,
      participantName: "Cha"
    },
    {
      participantId: 2,
      participantName: "Con"
    }
  ],
  servicePrice: 2000000,
  imageUrl: "https://example.com/image.jpg"
};

// Dữ liệu mẫu cho service không có participantType
const mockServiceNoParticipants = {
  serviceId: 2,
  serviceName: "Xét nghiệm ADN tổng quát",
  serviceDescription: "Xét nghiệm ADN tổng quát",
  limitPeople: 1,
  participantsType: [],
  servicePrice: 1500000,
  imageUrl: "https://example.com/image2.jpg"
};

function ParticipantModalDemo() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const handleOpenModal = (service) => {
    setSelectedService(service);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedService(null);
  };

  const handleAddParticipant = async (participants) => {
    console.log('Thêm participants:', participants);
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Thêm thành công!');
        resolve();
      }, 1000);
    });
  };

  const handleShowSample = async (participantId) => {
    console.log('Xem sample cho participant:', participantId);
  };

  const handleCreateSample = async (sampleData) => {
    console.log('Tạo sample:', sampleData);
  };

  const handleUpdateSample = async (sampleData) => {
    console.log('Cập nhật sample:', sampleData);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Demo ParticipantModal</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Test với service có participantType:</h3>
        <button 
          onClick={() => handleOpenModal(mockService)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0077b6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Mở Modal (Có participantType)
        </button>
        
        <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          <strong>Service:</strong> {mockService.serviceName}<br/>
          <strong>ParticipantTypes:</strong> {mockService.participantsType.map(pt => pt.participantName).join(', ')}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Test với service không có participantType:</h3>
        <button 
          onClick={() => handleOpenModal(mockServiceNoParticipants)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Mở Modal (Không có participantType)
        </button>
        
        <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          <strong>Service:</strong> {mockServiceNoParticipants.serviceName}<br/>
          <strong>ParticipantTypes:</strong> Không có
        </div>
      </div>

      <ParticipantModal
        open={modalOpen}
        onClose={handleCloseModal}
        participants={[]} // Không có participants ban đầu
        onShowSample={handleShowSample}
        sampleLoading={false}
        sampleError={null}
        selectedSample={null}
        onAddParticipant={handleAddParticipant}
        onCreateSample={handleCreateSample}
        onUpdateSample={handleUpdateSample}
        editingSample={null}
        onEditSample={() => {}}
        onCancelEditSample={() => {}}
        showCreateSample={false}
        onShowCreateSampleForm={() => {}}
        onCancelCreateSample={() => {}}
        createSampleLoading={false}
        createSampleError={null}
        createSampleSuccess={null}
        allowShowSample={true}
        allowAddParticipant={true}
        service={selectedService}
      />
    </div>
  );
}

export default ParticipantModalDemo; 
import React from 'react';
import './Questionadn.css';

const Question = ({ title, details, isOpen, onToggle }) => (
  <div className="faq-item">
    <button className="faq-toggle" onClick={onToggle}>
      <span className={`faq-icon ${isOpen ? 'open' : ''}`}>▶</span>
      <span className="faq-title">{title}</span>
    </button>

    <div className={`faq-details ${isOpen ? 'open' : ''}`}>
      {details}
    </div>
  </div>
);


const QuestionADNApp = () => {
  const [openSections, setOpenSections] = React.useState({
    q1: false,
    q2: false,
    q3: false,
    q4: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
  <div className="p-4 max-w-4xl w-full">
    <h3 className="text-center text-gray-500 text-sm uppercase mb-2">Câu hỏi thường gặp</h3>
    <h1 className="text-center text-3xl font-bold mb-6">Trả lời câu hỏi Dịch vụ <br /> ADN Huyết Thống</h1>
    <div className="faq-container">
      <Question
          title="Xét nghiệm ADN huyết thống là gì?"
          details="Xét nghiệm ADN huyết thống là xét nghiệm xác định quan hệ về mặt di truyền giữa các cá thể dựa trên thông tin di truyền của họ..."
          isOpen={openSections.q1}
          onToggle={() => toggleSection('q1')}
        />
        <Question
          title="Xét nghiệm ADN xác định huyết thống được thực hiện ở độ tuổi nào?"
          details="Do hệ GEN được thiết lập từ khi thai và duy trì bền vững, xét nghiệm có thể thực hiện từ mọi độ tuổi, kể cả thai nhi..."
          isOpen={openSections.q2}
          onToggle={() => toggleSection('q2')}
        />
        <Question
          title="Xét nghiệm ADN huyết thống có thể xác định mối quan hệ nào?"
          details="Xác định cha con, mẹ con, anh em ruột, ông bà và cháu..."
          isOpen={openSections.q3}
          onToggle={() => toggleSection('q3')}
        />
        <Question
          title="Kiểm tra huyết thống cần mẫu xét nghiệm nào?"
          details="Có thể sử dụng mẫu máu, nước bọt, móng tay, tóc có chân, hoặc mẫu sinh học khác..."
          isOpen={openSections.q4}
          onToggle={() => toggleSection('q4')}
        />
    </div>
  </div>
</div>
    
  );
};

export default QuestionADNApp;

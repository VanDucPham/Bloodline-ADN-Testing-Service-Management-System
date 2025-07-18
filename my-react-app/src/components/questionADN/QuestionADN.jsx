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
    <div className="faq-header-wrapper">
  <div className="faq-header-content">
    <h3>Câu hỏi thường gặp</h3>
    <h1>Trả lời câu hỏi Dịch vụ <br /> ADN Huyết Thống</h1>
        <div className="faq-container">
          <Question
            title="Xét nghiệm ADN huyết thống là gì?"
            details="Xét nghiệm ADN huyết thống là xét nghiệm xác định quan hệ về mặt di truyền giữa các cá thể dựa trên thông tin di truyền của họ (trình tự ADN). Do vật chất di truyền của người con được thừa hưởng từ cha mẹ nên trình tự ADN của người con sẽ có sự tương đồng với cả hai."
            isOpen={openSections.q1}
            onToggle={() => toggleSection('q1')}
          />
          <Question
            title="Xét nghiệm ADN xác định huyết thống được thực hiện ở độ tuổi nào?"
            details="Do hệ GEN được thiết lập ngay từ khi thụ thai và duy trì bền vững, xét nghiệm ADN xác định huyết thống có thể được thực hiện ở mọi độ tuổi, trên mọi đối tượng, thậm chí là có thể được thực hiện ngay từ khi đứa trẻ chưa chào đời (xét nghiệm ADN thai nhi không xâm lấn từ tuần thai thứ 7)."
            isOpen={openSections.q2}
            onToggle={() => toggleSection('q2')}
          />
          <Question
            title="Xét nghiệm ADN huyết thống có thể xác định mối quan hệ nào?"
            details="Xét nghiệm huyết thống cho phép xác định các mối quan hệ họ hàng trong dòng họ. Xác định mối quan hệ huyết thống trực hệ: cha – con, mẹ – con Xét nghiệm ADN huyết thống theo dòng họ nội (nam giới trong cùng một dòng họ) Xét nghiệm ADN huyết thống theo dòng họ ngoại (Anh/ chị – em cùng mẹ, bà ngoại – cháu, dì – cháu, hoặc các mối quan hệ khác miễn là có chung dòng họ ngoại)"
            isOpen={openSections.q3}
            onToggle={() => toggleSection('q3')}
          />
          <Question
            title="Kiểm tra huyết thống cần mẫu xét nghiệm nào?"
            details="Tất cả các mẫu chứa ADN có thể được sử dụng để xét nghiệm huyết thống. Các mẫu sinh phẩm thường được sử dụng như: máu, tế bào niêm mạc miệng, tóc có chân, móng tay/chân, cuống rốn,… Đặc biệt, các vật dụng chứa ADN của người cũng có thể dùng cho xét nghiệm giám định ADN: dao cạo râu đã qua vài lần sử dụng, kẹo cao su, bao cao su, bàn chải đánh răng, đầu lọc thuốc lá,… Trong đó, 2 mẫu được sử dụng phổ biến nhất là mẫu tế bào niêm mạc miệng và mẫu tóc ..."
            isOpen={openSections.q4}
            onToggle={() => toggleSection('q4')}
          />
        </div>
      </div>
    </div>

  );
};

export default QuestionADNApp;

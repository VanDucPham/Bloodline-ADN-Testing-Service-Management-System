import { Card, Row, Col, Statistic, DatePicker } from 'antd';
import { Line } from '@ant-design/plots';
import { useState } from 'react';

const { RangePicker } = DatePicker;

function RevenueManagement() {
  const [dateRange, setDateRange] = useState(null);

  // Sample data - replace with actual API data
  const data = [
    { date: '2024-01', revenue: 3500 },
    { date: '2024-02', revenue: 4200 },
    { date: '2024-03', revenue: 3800 },
    { date: '2024-04', revenue: 4500 },
    { date: '2024-05', revenue: 5000 },
  ];

  const config = {
    data,
    xField: 'date',
    yField: 'revenue',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý dòng tiền</h1>
        <RangePicker
          onChange={(dates) => setDateRange(dates)}
          style={{ width: 300 }}
        />
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng doanh thu tháng"
              value={5000}
              prefix="₫"
              formatter={(value) => `${value.toLocaleString()}`}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Số lượng hồ sơ"
              value={25}
              suffix="hồ sơ"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Doanh thu trung bình/hồ sơ"
              value={200}
              prefix="₫"
              suffix="k"
            />
          </Card>
        </Col>
      </Row>

      <Card title="Biểu đồ doanh thu theo tháng">
        <Line {...config} />
      </Card>
    </div>
  );
}

export default RevenueManagement; 
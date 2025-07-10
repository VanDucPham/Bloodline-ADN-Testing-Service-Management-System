// src/pages/RevenueManagement.jsx
import { Card, Row, Col, Statistic, DatePicker, Empty, Button } from 'antd';
import { Line } from '@ant-design/plots';
import { useState, useMemo } from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const sampleData = [
  { date: '2024-01', revenue: 3500, cases: 15 },
  { date: '2024-02', revenue: 4200, cases: 18 },
  { date: '2024-03', revenue: 3800, cases: 16 },
  { date: '2024-04', revenue: 4500, cases: 22 },
  { date: '2024-05', revenue: 5000, cases: 25 },
];

function RevenueManagement() {
  const [dateRange, setDateRange] = useState(null);

  // Lọc dữ liệu theo khoảng ngày
  const filteredData = useMemo(() => {
    if (!dateRange || dateRange.length !== 2) return sampleData;
    const [start, end] = dateRange;
    return sampleData.filter(d => {
      const dMonth = dayjs(d.date + '-01');
      return dMonth.isSameOrAfter(start, 'month') && dMonth.isSameOrBefore(end, 'month');
    });
  }, [dateRange]);

  // Tính toán số liệu
  const totalRevenue = filteredData.reduce((sum, d) => sum + d.revenue, 0);
  const totalCases = filteredData.reduce((sum, d) => sum + (d.cases || 0), 0);
  const avgRevenuePerCase = totalCases ? Math.round(totalRevenue / totalCases) : 0;

  // Tăng trưởng doanh thu so với tháng trước (nếu có)
  const growthPercent = useMemo(() => {
    if (filteredData.length < 2) return 0;
    const prev = filteredData[filteredData.length - 2].revenue;
    const curr = filteredData[filteredData.length - 1].revenue;
    return prev ? (((curr - prev) / prev) * 100).toFixed(2) : 0;
  }, [filteredData]);

  // Doanh thu cao nhất/thấp nhất
  const maxRevenueMonth = filteredData.length
    ? Math.max(...filteredData.map(d => d.revenue))
    : 0;
  const minRevenueMonth = filteredData.length
    ? Math.min(...filteredData.map(d => d.revenue))
    : 0;

  const config = {
    data: filteredData,
    xField: 'date',
    yField: 'revenue',
    point: { size: 5, shape: 'diamond' },
    label: { style: { fill: '#aaa' } },
    smooth: true,
    tooltip: { showMarkers: true },
    interactions: [{ type: 'active-region' }],
  };

  // (Tùy chọn) Hàm xuất Excel (giả lập)
  const handleExportExcel = () => {
    // Bạn có thể dùng thư viện như xlsx hoặc SheetJS để xuất file thực tế
    alert("Tính năng xuất Excel chưa được tích hợp!");
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
        <h1 className="text-2xl font-bold">Quản lý dòng tiền</h1>
        <div style={{ display: "flex", gap: 12 }}>
          <RangePicker
            picker="month"
            onChange={setDateRange}
            style={{ width: 300 }}
            allowClear
          />
          <Button type="primary" icon={<DownloadOutlined />} onClick={handleExportExcel}>
            Xuất Excel
          </Button>
        </div>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={totalRevenue}
              prefix="₫"
              formatter={value => value.toLocaleString()}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Số lượng hồ sơ"
              value={totalCases}
              suffix="hồ sơ"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Doanh thu trung bình/hồ sơ"
              value={avgRevenuePerCase}
              prefix="₫"
              formatter={value => value.toLocaleString()}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Tăng trưởng doanh thu"
              value={growthPercent}
              precision={2}
              suffix="%"
              valueStyle={{ color: growthPercent > 0 ? "#3f8600" : "#cf1322" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Doanh thu cao nhất"
              value={maxRevenueMonth}
              prefix="₫"
              formatter={value => value.toLocaleString()}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Doanh thu thấp nhất"
              value={minRevenueMonth}
              prefix="₫"
              formatter={value => value.toLocaleString()}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Biểu đồ doanh thu theo tháng">
        {filteredData.length > 0 ? (
          <Line {...config} />
        ) : (
          <Empty description="Không có dữ liệu trong khoảng thời gian này" />
        )}
      </Card>
    </div>
  );
}

export default RevenueManagement;

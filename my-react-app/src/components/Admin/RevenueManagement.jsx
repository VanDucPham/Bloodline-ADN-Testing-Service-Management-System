// src/pages/RevenueManagement.jsx
import { Card, Row, Col, Statistic, DatePicker, Empty, Button, Spin, Alert, Select } from 'antd';
import { Line } from '@ant-design/charts';
import { useState, useMemo, useEffect } from 'react';
import { DownloadOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import revenueService from './revenueService.js';

// Cấu hình dayjs plugins
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { RangePicker } = DatePicker;
const { Option } = Select;

function RevenueManagement() {
  const [dateRange, setDateRange] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [timeRange, setTimeRange] = useState('current_month'); // Thêm state cho time range

  // Load dữ liệu ban đầu
  useEffect(() => {
    loadRevenueData();
  }, []);

  // Hàm tạo date range theo time range
  const getDateRangeByTimeRange = (range) => {
    const now = dayjs();
    switch (range) {
      case 'current_month':
        return [now.startOf('month'), now.endOf('month')];
      case 'last_month':
        return [now.subtract(1, 'month').startOf('month'), now.subtract(1, 'month').endOf('month')];
      case 'last_3_months':
        return [now.subtract(3, 'month').startOf('month'), now.endOf('month')];
      case 'last_6_months':
        return [now.subtract(6, 'month').startOf('month'), now.endOf('month')];
      case 'current_year':
        return [now.startOf('year'), now.endOf('year')];
      case 'last_year':
        return [now.subtract(1, 'year').startOf('year'), now.subtract(1, 'year').endOf('year')];
      default:
        return [now.startOf('month'), now.endOf('month')];
    }
  };

  const loadRevenueData = async (startDate = null, endDate = null) => {
    setLoading(true);
    setError(null);
    try {
      const data = await revenueService.getRevenueOverview(startDate, endDate);
      setRevenueData(data);
    } catch (error) {
      console.error('Error loading revenue data:', error);
      // Thử lấy dữ liệu mẫu nếu API thực không có dữ liệu
      try {
        console.log('Trying to load sample data...');
        const sampleData = await revenueService.getSampleRevenueData();
        setRevenueData(sampleData);
      } catch (sampleError) {
        console.error('Error loading sample data:', sampleError);
        setError('Không thể tải dữ liệu doanh thu. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Lọc dữ liệu theo khoảng ngày
  const filteredData = useMemo(() => {
    if (!revenueData || !revenueData.monthlyData) return [];
    
    if (!dateRange || dateRange.length !== 2) return revenueData.monthlyData;
    
    const [start, end] = dateRange;
    return revenueData.monthlyData.filter(d => {
      const dMonth = dayjs(`${d.year}-${d.month.toString().padStart(2, '0')}-01`);
      return dMonth.isSameOrAfter(start, 'month') && dMonth.isSameOrBefore(end, 'month');
    });
  }, [dateRange, revenueData]);

  // Xử lý thay đổi time range
  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
    const [start, end] = getDateRangeByTimeRange(value);
    setDateRange([start, end]);
    loadRevenueData(start.toDate(), end.toDate());
  };

  // Xử lý thay đổi date range
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    if (dates && dates.length === 2) {
      const [start, end] = dates;
      loadRevenueData(start.toDate(), end.toDate());
    } else {
      loadRevenueData();
    }
  };

  // Cấu hình biểu đồ
  const config = {
    data: filteredData.map(d => ({
      date: `${d.year}-${d.month.toString().padStart(2, '0')}`,
      revenue: d.revenue || 0
    })),
    xField: 'date',
    yField: 'revenue',
    point: { size: 5, shape: 'diamond' },
    label: { style: { fill: '#aaa' } },
    smooth: true,
    tooltip: { 
      showMarkers: true,
      formatter: (datum) => {
        return {
          name: 'Doanh thu',
          value: `${datum.revenue.toLocaleString()} ₫`
        };
      }
    },
    interactions: [{ type: 'active-region' }],
  };

  // Hàm xuất Excel (giả lập)
  const handleExportExcel = () => {
    alert("Tính năng xuất Excel chưa được tích hợp!");
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => loadRevenueData()}>
              Thử lại
            </Button>
          }
        />
      </div>
    );
  }

  if (!revenueData) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Empty description="Không có dữ liệu doanh thu" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
        <h1 className="text-2xl font-bold">Quản lý dòng tiền</h1>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {/* Quick Time Range Selector */}
          <Select
            value={timeRange}
            onChange={handleTimeRangeChange}
            style={{ width: 150 }}
            placeholder="Chọn khoảng thời gian"
          >
            <Option value="current_month">Tháng hiện tại</Option>
            <Option value="last_month">Tháng trước</Option>
            <Option value="last_3_months">3 tháng gần đây</Option>
            <Option value="last_6_months">6 tháng gần đây</Option>
            <Option value="current_year">Năm hiện tại</Option>
            <Option value="last_year">Năm trước</Option>
          </Select>
          
          {/* Custom Date Range Picker */}
          <RangePicker
            picker="month"
            onChange={handleDateRangeChange}
            style={{ width: 300 }}
            allowClear
            placeholder={['Từ tháng', 'Đến tháng']}
          />
          
          <Button type="primary" icon={<DownloadOutlined />} onClick={handleExportExcel}>
            Xuất Excel
          </Button>
        </div>
      </div>

      {/* Hiển thị khoảng thời gian đang xem */}
      {dateRange && dateRange.length === 2 && (
        <div style={{ marginBottom: 16, padding: '8px 16px', backgroundColor: '#f0f0f0', borderRadius: 6 }}>
          <CalendarOutlined style={{ marginRight: 8 }} />
          Đang xem dữ liệu từ: <strong>{dateRange[0].format('MM/YYYY')}</strong> 
          đến: <strong>{dateRange[1].format('MM/YYYY')}</strong>
        </div>
      )}

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={revenueData.totalRevenue || 0}
              prefix="₫"
              formatter={value => value.toLocaleString()}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Số lượng hồ sơ"
              value={revenueData.totalCases || 0}
              suffix="hồ sơ"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Doanh thu trung bình/hồ sơ"
              value={revenueData.averageRevenuePerCase || 0}
              prefix="₫"
              formatter={value => value.toLocaleString()}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Tăng trưởng doanh thu"
              value={revenueData.growthPercent || 0}
              precision={2}
              suffix="%"
              valueStyle={{ color: (revenueData.growthPercent || 0) > 0 ? "#3f8600" : "#cf1322" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Doanh thu cao nhất"
              value={revenueData.maxRevenueMonth || 0}
              prefix="₫"
              formatter={value => value.toLocaleString()}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Doanh thu thấp nhất"
              value={revenueData.minRevenueMonth || 0}
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

      {/* Thống kê theo service */}
      {revenueData.serviceRevenue && revenueData.serviceRevenue.length > 0 && (
        <Card title="Doanh thu theo dịch vụ" style={{ marginTop: 16 }}>
          <Row gutter={[16, 16]}>
            {revenueData.serviceRevenue.map((service, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <Card size="small">
                  <Statistic
                    title={service.serviceName}
                    value={service.revenue || 0}
                    prefix="₫"
                    formatter={value => value.toLocaleString()}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}
    </div>
  );
}

export default RevenueManagement;

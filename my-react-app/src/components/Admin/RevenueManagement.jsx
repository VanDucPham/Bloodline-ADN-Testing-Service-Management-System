// src/pages/RevenueManagement.jsx
import { Card, Row, Col, Statistic, DatePicker, Empty, Button, Spin, Alert, Select } from 'antd';
import {  Column } from '@ant-design/charts';
import { useState, useMemo, useEffect, useRef } from 'react';
import {  CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import revenueService from './revenueService.js';
import './RevenueManagement.css';

// Cấu hình dayjs plugins
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { RangePicker } = DatePicker;
const { Option } = Select;

function RevenueManagement() {
  const now = dayjs();
  const [dateRange, setDateRange] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null); // Không auto-select khi khởi tạo
  const [selectedYear, setSelectedYear] = useState(now.year());
  const didAutoSelectMonth = useRef(false); // Biến cờ để chỉ tự động chọn tháng 1 lần
  const [yearOptions, setYearOptions] = useState([]);
  const [monthOptions, setMonthOptions] = useState([]);
  const [dailyData, setDailyData] = useState([]); // Thêm state để lưu dữ liệu ngày
  const [backendMonthStats, setBackendMonthStats] = useState(null); // Thêm state để lưu thống kê từ backend

  // Load dữ liệu ban đầu
  useEffect(() => {
    loadRevenueData();
  }, []);

  // Khi dữ liệu doanh thu thay đổi, cập nhật danh sách năm thực tế
  useEffect(() => {
    if (revenueData && revenueData.monthlyData) {
      const years = Array.from(new Set(revenueData.monthlyData.map(d => d.year))).sort((a, b) => b - a);
      setYearOptions(years);
      // Nếu năm hiện tại không có trong DB, tự động chọn năm mới nhất
      if (!years.includes(selectedYear)) {
        setSelectedYear(years[0]);
      }
    }
  }, [revenueData]);

  // Khi dữ liệu doanh thu hoặc năm thay đổi, cập nhật danh sách tháng thực tế
  useEffect(() => {
    if (revenueData && revenueData.monthlyData && selectedYear) {
      const months = Array.from(new Set(
        revenueData.monthlyData.filter(d => d.year === selectedYear).map(d => d.month)
      )).sort((a, b) => a - b);
      setMonthOptions(months);
      // Nếu tháng hiện tại không có trong DB, tự động bỏ chọn tháng
      if (selectedMonth && !months.includes(selectedMonth)) {
        setSelectedMonth(null);
      }
    }
  }, [revenueData, selectedYear]);

  // Chỉ auto-select tháng hiện tại đúng 1 lần khi trang mount và monthOptions đã có
  useEffect(() => {
    if (!didAutoSelectMonth.current && monthOptions.length > 0) {
      if (monthOptions.includes(now.month() + 1)) {
        setSelectedMonth(now.month() + 1);
      }
      didAutoSelectMonth.current = true;
    }
  }, [monthOptions, now]);

  // Khi chọn cả tháng và năm, lấy dữ liệu từng ngày trong tháng đó
  useEffect(() => {
    const fetchDailyData = async () => {
      if (selectedYear && selectedMonth) {
        setLoading(true);
        try {
          const res = await revenueService.getRevenueByMonth(selectedYear, selectedMonth);
          setDailyData(res.dailyData || []);
          setBackendMonthStats({
            growthPercent: res.growthPercent,
            maxRevenue: res.maxRevenueMonth,
            minRevenue: res.minRevenueMonth,
            totalRevenue: res.totalRevenue,
            totalCases: res.totalCases,
            averageRevenuePerCase: res.averageRevenuePerCase
          });
        } catch  {
          setDailyData([]);
          setBackendMonthStats(null);
        } finally {
          setLoading(false);
        }
      } else {
        setDailyData([]);
        setBackendMonthStats(null);
      }
    };
    fetchDailyData();
  }, [selectedYear, selectedMonth]);



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

  // Tính toán lại các chỉ số theo bộ lọc
  let growthPercent = 0, maxRevenue = 0, minRevenue = 0, totalRevenue = 0, totalCases = 0, averageRevenuePerCase = 0;
  if (selectedYear && selectedMonth && backendMonthStats) {
    growthPercent = backendMonthStats.growthPercent || 0;
    maxRevenue = backendMonthStats.maxRevenue || 0;
    minRevenue = backendMonthStats.minRevenue || 0;
    totalRevenue = backendMonthStats.totalRevenue || 0;
    totalCases = backendMonthStats.totalCases || 0;
    averageRevenuePerCase = backendMonthStats.averageRevenuePerCase || 0;
  } else if (filteredData.length > 0) {
    const revenues = filteredData.map(d => d.revenue || 0);
    maxRevenue = Math.max(...revenues);
    minRevenue = Math.min(...revenues);
    if (revenues.length > 1 && revenues[0] !== 0) {
      growthPercent = ((revenues[revenues.length - 1] - revenues[0]) / Math.abs(revenues[0])) * 100;
    } else {
      growthPercent = 0;
    }
    totalRevenue = revenueData.totalRevenue || 0;
    totalCases = revenueData.totalCases || 0;
    averageRevenuePerCase = revenueData.averageRevenuePerCase || 0;
  }

  // Hàm load dữ liệu theo tháng/năm
  const handleMonthYearChange = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    let startDate, endDate;
    if (year && month) {
      startDate = dayjs(`${year}-${month}-01`).startOf('month');
      endDate = dayjs(`${year}-${month}-01`).endOf('month');
    } else if (year) {
      startDate = dayjs(`${year}-01-01`).startOf('year');
      endDate = dayjs(`${year}-12-31`).endOf('year');
    } else {
      startDate = null;
      endDate = null;
    }
    setDateRange(startDate && endDate ? [startDate, endDate] : null);
    loadRevenueData(startDate ? startDate.toDate() : null, endDate ? endDate.toDate() : null);
  };

  // Khi thay đổi tháng
  const handleMonthChange = (value) => {
    handleMonthYearChange(value, selectedYear);
  };
  // Khi thay đổi năm
  const handleYearChange = (value) => {
    handleMonthYearChange(selectedMonth, value);
  };

  // Tạo danh sách năm (ví dụ: 2020-2026)
  // const yearOptions = [];
  // for (let y = dayjs().year() - 5; y <= dayjs().year() + 1; y++) {
  //   yearOptions.push(y);
  // }



  // Cấu hình biểu đồ cột
  let chartData = [];
  let xField = '';
  let chartTitle = '';
  if (selectedYear && selectedMonth) {
    // Lấy số ngày trong tháng
    const daysInMonth = dayjs(`${selectedYear}-${selectedMonth}-01`).daysInMonth();
    // Tạo map ngày -> revenue
    const dayRevenueMap = new Map();
    dailyData.forEach(d => {
      dayRevenueMap.set(d.day, d.revenue || 0);
    });
    chartData = Array.from({ length: daysInMonth }, (_, i) => ({
      x: i + 1,
      revenue: dayRevenueMap.get(i + 1) || 0
    }));
    xField = 'x';
    chartTitle = `Biểu đồ doanh thu theo ngày (Tháng ${selectedMonth}/${selectedYear})`;
  } else {
    // Đảm bảo đủ 12 tháng, kể cả tháng không có doanh thu
    const monthRevenueMap = new Map();
    filteredData.forEach(d => {
      monthRevenueMap.set(d.month, d.revenue || 0);
    });
    chartData = Array.from({ length: 12 }, (_, i) => ({
      x: `${(i + 1).toString().padStart(2, '0')}/${selectedYear}`,
      revenue: monthRevenueMap.get(i + 1) || 0
    }));
    xField = 'x';
    chartTitle = `Biểu đồ doanh thu theo tháng (${selectedYear})`;
  }



  const columnConfig = {
    data: chartData,
    xField: xField,
    yField: 'revenue',
    columnWidthRatio: 0.6,
    tooltip: {
      showMarkers: true,
      formatter: (datum) => {
        const value = Number(datum.revenue);
        return {
          name: 'Tổng doanh thu',
          value: value > 0 ? value.toLocaleString() + ' ₫' : '0 ₫',
        };
      },
    },
    label: {
      position: 'top',
      style: {
        fill: '#000',
        fontSize: 13,
        fontWeight: 600,
        textShadow: '0 1px 2px #fff',
      },
      formatter: (value) => {
        const num = Number(value);
        return num > 0 ? num.toLocaleString() + ' ₫' : '';
      },
    },
    color: '#1890ff',
    xAxis: {
      title: { text: selectedMonth ? 'Ngày' : 'Tháng' },
    },
    yAxis: {
      title: { text: 'Doanh thu (₫)' },
    },
    interactions: [{ type: 'active-region' }],
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
          {/* Bộ lọc tháng/năm */}
          <Select
            value={selectedMonth}
            onChange={handleMonthChange}
            style={{ width: 120 }}
            placeholder="Chọn tháng"
            allowClear
          >
            {monthOptions.map(m => (
              <Option key={m} value={m}>Tháng {m}</Option>
            ))}
          </Select>
          <Select
            value={selectedYear}
            onChange={handleYearChange}
            style={{ width: 120 }}
            placeholder="Chọn năm"
          >
            {yearOptions.map(y => (
              <Option key={y} value={y}>{y}</Option>
            ))}
          </Select>
        </div>
      </div>
      {/* Hiển thị khoảng thời gian đang xem */}
      {selectedYear && (
        <div style={{ marginBottom: 16, padding: '8px 16px', backgroundColor: '#f0f0f0', borderRadius: 6 }}>
          <CalendarOutlined style={{ marginRight: 8 }} />
          Đang xem dữ liệu: {selectedMonth ? (
            <><strong>Tháng {selectedMonth}</strong> năm <strong>{selectedYear}</strong></>
          ) : (
            <>Cả năm <strong>{selectedYear}</strong></>
          )}
        </div>
      )}

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
              value={averageRevenuePerCase}
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
              valueStyle={{ color: (growthPercent || 0) > 0 ? "#3f8600" : "#cf1322" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Doanh thu cao nhất"
              value={maxRevenue}
              prefix="₫"
              formatter={value => value.toLocaleString()}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Doanh thu thấp nhất"
              value={minRevenue}
              prefix="₫"
              formatter={value => value.toLocaleString()}
            />
          </Card>
        </Col>
      </Row>

      <Card title={chartTitle}>
        {chartData.length > 0 ? (
          <Column {...columnConfig} />
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

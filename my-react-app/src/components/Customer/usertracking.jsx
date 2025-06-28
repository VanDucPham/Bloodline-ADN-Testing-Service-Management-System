import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import apiService from "../../service/api";



function usertracking() {
   

    return (
 <div class="container">
    <h1>Lịch hẹn xét nghiệm ADN của bạn</h1>
    <table>
      <thead>
        <tr>
          <th>Mã lịch hẹn</th>
          <th>Ngày hẹn</th>
          <th>Loại dịch vụ</th>
          <th>Địa điểm</th>
          <th>Trạng thái</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>#APT001</td>
          <td>2025-07-03</td>
          <td>Xét nghiệm cha - con</td>
          <td>Hà Nội - Trung tâm ADN</td>
          <td><span class="status pending">Đang xử lý</span></td>
        </tr>
        <tr>
          <td>#APT002</td>
          <td>2025-06-15</td>
          <td>Xét nghiệm huyết thống</td>
          <td>TP.HCM - CN Quận 3</td>
          <td><span class="status confirmed">Đã xác nhận</span></td>
        </tr>
        <tr>
          <td>#APT003</td>
          <td>2025-06-10</td>
          <td>Giải mã gen di truyền</td>
          <td>Đà Nẵng</td>
          <td><span class="status canceled">Đã hủy</span></td>
        </tr>
      </tbody>
    </table>
  </div>

    )

      
    
}

export default Login;

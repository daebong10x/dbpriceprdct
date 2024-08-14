"use client";

import React, { useState } from 'react';
import Dropdown from "../ui/dashboard/dropdown/dropdown";
import PriceInfo from "../ui/dashboard/priceinfo/PriceInfo";
import ChartComponent from "../ui/dashboard/chart/chart"; // 차트 컴포넌트 import

const Page = () => {
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedWeight, setSelectedWeight] = useState('');
  const [selectedDetail, setSelectedDetail] = useState('');

  return (
    <div>
      <Dropdown
        setSelectedItem={setSelectedItem}
        setSelectedWeight={setSelectedWeight}
        setSelectedDetail={setSelectedDetail}
      />
      <PriceInfo
        selectedItem={selectedItem}
        selectedWeight={selectedWeight}
        selectedDetail={selectedDetail}
      />
      <ChartComponent selectedItem={selectedItem} />
    </div>
  );
};

export default Page;

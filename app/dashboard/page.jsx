"use client";

import React, { useState } from 'react';
import PriceInfo from "../ui/dashboard/priceinfo/PriceInfo";
import Dropdown from "../ui/dashboard/dropdown/dropdown";
import Title from "../ui/dashboard/title/Title"; // Title 컴포넌트 임포트

const Page = () => {
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedWeight, setSelectedWeight] = useState('');
  const [selectedDetail, setSelectedDetail] = useState('');

  return (
    <div>
      <Title /> {/* Title 컴포넌트를 최상단에 추가 */}
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
    </div>
  );
};

export default Page;

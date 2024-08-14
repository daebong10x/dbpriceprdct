"use client";

import React, { useState } from 'react';
import PriceInfo from "../ui/dashboard/priceinfo/PriceInfo";
import Dropdown from "../ui/dashboard/dropdown/Dropdown";

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
    </div>
  );
};

export default Page;

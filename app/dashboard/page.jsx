"use client"; // 클라이언트 컴포넌트로 설정

import { useState } from 'react';
import Card from "../ui/dashboard/card/card";
import Chart from "../ui/dashboard/chart/chart";
import Dropdown from "../ui/dashboard/dropdown/dropdown";
import styles from "../ui/dashboard/dashboard.module.css";
import Rightbar from "../ui/dashboard/rightbar/rightbar";
import { dataStructure } from "../ui/dashboard/data/chartData";

const Page = () => {
  const [selectedItem, setSelectedItem] = useState('복숭아');
  const [selectedOption, setSelectedOption] = useState('3kg');
  const [selectedDetailOption, setSelectedDetailOption] = useState('10과');

  const handleItemChange = (e) => {
    const newItem = e.target.value;
    setSelectedItem(newItem);
    const firstOption = Object.keys(dataStructure[newItem])[0];
    setSelectedOption(firstOption);
    setSelectedDetailOption(Object.keys(dataStructure[newItem][firstOption])[0]);
  };

  const handleOptionChange = (e) => {
    const newOption = e.target.value;
    setSelectedOption(newOption);
    setSelectedDetailOption(Object.keys(dataStructure[selectedItem][newOption])[0]);
  };

  const handleDetailOptionChange = (e) => {
    setSelectedDetailOption(e.target.value);
  };

  const itemOptions = Object.keys(dataStructure);
  const optionOptions = Object.keys(dataStructure[selectedItem]);
  const detailOptions = Object.keys(dataStructure[selectedItem][selectedOption]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <div className={styles.cards}>
          <Card />
          <Card />
        </div>
        <Card />

        <div className={styles.dropdownContainer}>
          <div className={styles.dropdownGroup}>
            <label>품목 선택</label>
            <Dropdown
              options={itemOptions.map(item => ({ value: item, label: item }))}
              value={selectedItem}
              onChange={handleItemChange}
            />
          </div>

          <div className={styles.dropdownGroup}>
            <label>키로 수 선택</label>
            <Dropdown
              options={optionOptions.map(option => ({ value: option, label: option }))}
              value={selectedOption}
              onChange={handleOptionChange}
            />
          </div>

          <div className={styles.dropdownGroup}>
            <label>세부 과수 선택</label>
            <Dropdown
              options={detailOptions.map(detail => ({ value: detail, label: detail }))}
              value={selectedDetailOption}
              onChange={handleDetailOptionChange}
            />
          </div>
        </div>

        <Chart selectedData={dataStructure[selectedItem][selectedOption][selectedDetailOption]} />
      </div>
      <div className={styles.side}>
        <Rightbar />
      </div>
    </div>
  );
};

export default Page;

import React, { useState, useEffect } from 'react';
import styles from './dropdown.module.css';

const Dropdown = ({ setSelectedItem, setSelectedWeight, setSelectedDetail }) => {
  const [data, setData] = useState([]);
  const [currentItem, setCurrentItem] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [currentDetail, setCurrentDetail] = useState('');

  // Google Sheets 데이터를 가져오는 함수
  const fetchData = async () => {
    try {
      const response = await fetch('/api/chartapi');
      const result = await response.json();
      setData(result.slice(1)); // 첫 번째 행(헤더)을 제외하고 데이터를 설정
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 선택된 품목에 따라 가능한 키로수 목록을 반환하는 함수
  const getWeightsForItem = (item) => {
    const weights = data
      .filter((row) => row[0] === item)
      .map((row) => row[1]);
    return Array.from(new Set(weights)); // 중복 제거
  };

  // 선택된 품목과 키로수에 따라 가능한 세부 과수 목록을 반환하는 함수
  const getDetailsForItemAndWeight = (item, weight) => {
    return data
      .filter((row) => row[0] === item && row[1] === weight)
      .map((row) => row[2]);
  };

  return (
    <div className={styles.dropdownContainer}>
      <div>
        <label>품목 선택:</label>
        <select
          value={currentItem}
          onChange={(e) => {
            const item = e.target.value;
            setCurrentItem(item);
            setSelectedItem(item);
            setCurrentWeight('');
            setSelectedWeight('');
            setCurrentDetail('');
            setSelectedDetail('');
          }}
        >
          <option value="">-- 품목을 선택하세요 --</option>
          {Array.from(new Set(data.map((row) => row[0]))).map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {currentItem && (
        <div>
          <label>키로수 선택:</label>
          <select
            value={currentWeight}
            onChange={(e) => {
              const weight = e.target.value;
              setCurrentWeight(weight);
              setSelectedWeight(weight);
              setCurrentDetail('');
              setSelectedDetail('');
            }}
            disabled={!currentItem}
          >
            <option value="">-- 키로수를 선택하세요 --</option>
            {getWeightsForItem(currentItem).map((weight, index) => (
              <option key={index} value={weight}>
                {weight}
              </option>
            ))}
          </select>
        </div>
      )}

      {currentWeight && (
        <div>
          <label>세부 과수 선택:</label>
          <select
            value={currentDetail}
            onChange={(e) => {
              const detail = e.target.value;
              setCurrentDetail(detail);
              setSelectedDetail(detail);
            }}
            disabled={!currentWeight}
          >
            <option value="">-- 세부 과수를 선택하세요 --</option>
            {getDetailsForItemAndWeight(currentItem, currentWeight).map((detail, index) => (
              <option key={index} value={detail}>
                {detail}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default Dropdown;

import React, { useState, useEffect } from 'react';
import './PriceInfo.css'; // CSS 파일을 따로 만들어서 스타일링 할 것입니다.

const PriceInfo = ({ selectedItem, selectedWeight, selectedDetail }) => {
  const [data, setData] = useState([]);
  const [price, setPrice] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [nextWeekPrice, setNextWeekPrice] = useState(null);

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

  useEffect(() => {
    if (selectedItem && selectedWeight && selectedDetail) {
      const selectedRow = data.find(
        (row) =>
          row[0] === selectedItem &&
          row[1] === selectedWeight &&
          row[2] === selectedDetail
      );
      if (selectedRow) {
        setPrice(selectedRow[3]); // D열 값
        setForecast(selectedRow[4]); // E열 값
        setNextWeekPrice(selectedRow[5]); // G열 값
      } else {
        setPrice(null);
        setForecast(null);
        setNextWeekPrice(null);
      }
    } else {
      setPrice(null);
      setForecast(null);
      setNextWeekPrice(null);
    }
  }, [selectedItem, selectedWeight, selectedDetail, data]);

  return (
    <div className="price-info-container">
      {/* 3개 모두 선택되지 않았을 때 표시 */}
      {(!selectedItem || !selectedWeight || !selectedDetail) && (
        <p className="no-selection">옵션을 선택해주세요</p>
      )}

      {/* 3개 모두 선택되었을 때 정보 표시 */}
      {selectedItem && selectedWeight && selectedDetail && (
        <>
          <div className="selection-info">
            <p>[{selectedItem} {selectedWeight} {selectedDetail}]</p>
          </div>

          {/* 예상 변화 표시 */}
          {forecast && (
            <div className="forecast-info">
              <p className="forecast-text">다음주 <span className="forecast-highlight">{forecast}</span> 예상</p>
            </div>
          )}

          {/* 가격 정보 표시 */}
          {price && nextWeekPrice ? (
            <div className="price-info">
              <div className="price-block">
                <p className="price-title">이번주 가격</p>
                <p className="price-detail">24년 7월 1주차 <span className="price-amount">{price}원</span></p>
              </div>
              <div className="price-block">
                <p className="price-title">다음주 가격</p>
                <p className="price-detail">24년 7월 2주차 <span className="price-amount">{nextWeekPrice}원</span></p>
              </div>
            </div>
          ) : (
            <p className="no-data">선택한 옵션에 대한 가격 정보를 찾을 수 없습니다.</p>
          )}
        </>
      )}
    </div>
  );
};

export default PriceInfo;

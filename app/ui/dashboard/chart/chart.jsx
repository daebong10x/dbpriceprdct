import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import styles from './chart.module.css'; // CSS 모듈 임포트

const ChartComponent = ({ selectedItem, selectedWeight, selectedDetail, price, nextWeekPrice }) => {
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedItem || !selectedWeight || !selectedDetail) return;

      const sheetName = `${selectedItem}_차트데이터`;
      try {
        const response = await fetch(`/api/chartdataapi?sheetName=${sheetName}`);
        const data = await response.json();

        if (data.error) {
          console.error(data.error);
          return;
        }

        const labels = Array.from(new Set(data.slice(1).map(row => row[0].replace(/^\d+년/, ''))));
        const prices2023 = Array(labels.length).fill(null);
        const prices2024 = Array(labels.length).fill(null);

        data.slice(1).forEach(row => {
          const [date, price] = row;
          const week = date.replace(/^\d+년/, '');
          const index = labels.indexOf(week);

          if (index !== -1) {
            if (date.includes('2023년')) {
              prices2023[index] = parseInt(price);
            } else if (date.includes('2024년')) {
              prices2024[index] = parseInt(price);
            }
          }
        });

        const highlightIndex3rdWeek = labels.indexOf('7월3주');
        const highlightIndex4thWeek = labels.indexOf('7월4주');

        setChartData({
          labels: labels,
          datasets: [
            {
              label: `2023년 ${selectedItem} 가격`,
              data: prices2023,
              borderColor: 'rgba(75,192,192,1)',
              backgroundColor: 'rgba(75,192,192,0.2)',
              pointRadius: 0, // 점 제거
              tension: 0.4, // 곡선을 부드럽게 만들기 위해 tension 추가
            },
            {
              label: `2024년 ${selectedItem} 가격`,
              data: prices2024,
              borderColor: 'rgba(192,75,75,1)',
              backgroundColor: 'rgba(192,75,75,0.2)',
              pointBackgroundColor: prices2024.map((_, index) =>
                index === highlightIndex3rdWeek ? 'rgba(0,0,255,0.7)' : // 파란색 하이라이트
                index === highlightIndex4thWeek ? 'rgba(0,255,0,0.7)' :  // 초록색 하이라이트
                'rgba(192,75,75,1)' // 나머지 점의 색상
              ),
              pointRadius: prices2024.map((_, index) =>
                index === highlightIndex3rdWeek || index === highlightIndex4thWeek ? 15 : 0 // 강조된 곳만 점 표시, 나머지 제거
              ),
              pointHoverRadius: prices2024.map((_, index) =>
                index === highlightIndex3rdWeek || index === highlightIndex4thWeek ? 20 : 0
              ),
              tension: 0.4, // 곡선을 부드럽게 만들기 위해 tension 추가
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, [selectedItem, selectedWeight, selectedDetail]);

  useEffect(() => {
    const chartContainer = chartRef.current?.canvas?.parentNode;
    if (chartContainer) {
      const existingTooltips = chartContainer.querySelectorAll('.chart-tooltip');
      existingTooltips.forEach(tooltip => tooltip.remove());
    }
  
    if (chartData && chartRef.current) {
      const chart = chartRef.current;
  
      const dataIndex3rdWeek = chartData.labels.indexOf('7월3주');
      const dataIndex4thWeek = chartData.labels.indexOf('7월4주');
  
      if (dataIndex3rdWeek !== -1 && dataIndex4thWeek !== -1 && chart.data.datasets[1]) {
        const tooltipEl3rdWeek = document.createElement('div');
        tooltipEl3rdWeek.className = 'chart-tooltip';
        tooltipEl3rdWeek.style.position = 'absolute';
        tooltipEl3rdWeek.style.background = '#f7f7f7';
        tooltipEl3rdWeek.style.color = '#000';
        tooltipEl3rdWeek.style.padding = '10px';
        tooltipEl3rdWeek.style.borderRadius = '4px';
        tooltipEl3rdWeek.style.pointerEvents = 'none';
        tooltipEl3rdWeek.style.left = '50%';
        tooltipEl3rdWeek.style.transform = 'translateX(-120%)'; // 조정된 위치
        tooltipEl3rdWeek.style.top = '20px';
        tooltipEl3rdWeek.innerHTML = `<strong><span style="color: rgba(0,0,255,0.7);">&#9679;</span> 이번주 가격: ${price}원</strong>`;

  
        chartContainer.appendChild(tooltipEl3rdWeek);
  
        const tooltipEl4thWeek = document.createElement('div');
        tooltipEl4thWeek.className = 'chart-tooltip';
        tooltipEl4thWeek.style.position = 'absolute';
        tooltipEl4thWeek.style.background = '#f7f7f7';
        tooltipEl4thWeek.style.color = '#000';
        tooltipEl4thWeek.style.padding = '10px';
        tooltipEl4thWeek.style.borderRadius = '4px';
        tooltipEl4thWeek.style.pointerEvents = 'none';
        tooltipEl4thWeek.style.left = 'calc(50% + 1px)'; // 첫 번째 툴팁의 오른쪽에 배치
        tooltipEl4thWeek.style.transform = 'translateX(0%)';
        tooltipEl4thWeek.style.top = '20px';
        tooltipEl4thWeek.innerHTML = `<strong><span style="color: rgba(0,255,0,0.7);">&#9679;</span> 다음주 가격(예상): ${nextWeekPrice}원</strong>`;
  
        chartContainer.appendChild(tooltipEl4thWeek);
      }
    }
  }, [chartData, price, nextWeekPrice]);
  
  

  if (!selectedItem || !selectedWeight || !selectedDetail) {
    return <p>옵션을 선택해주세요</p>;
  }

  if (!chartData) return <p>차트를 로드 중입니다...</p>;

  return (
    <div className={styles.chartContainer}> {/* 클래스 사용 */}
      <div className={styles.chartInnerContainer}> {/* 클래스 사용 */}
        <Line 
          ref={chartRef} 
          data={chartData} 
          options={{
            responsive: false,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                enabled: false,
              },
              legend: {
                display: true,
                position: 'bottom',
              },
            },
            interaction: {
              mode: 'none',
            },
            hover: {
              mode: null,
            },
            scales: {
              x: {
                grid: {
                  color: 'rgba(0, 0, 0, 0.2)',
                  borderDash: [5, 5],
                },
              },
              y: {
                display: false,
                grid: {
                  color: 'rgba(0, 0, 0, 0.2)',
                  borderDash: [5, 5],
                },
              },
            },
          }} 
          height={400} 
          width={1100}  // 차트 가로 길이 조정
        />
      </div>
    </div>
  );
};

export default ChartComponent;

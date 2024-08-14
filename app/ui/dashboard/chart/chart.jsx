import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

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
              pointBackgroundColor: 'rgba(75,192,192,1)',
            },
            {
              label: `2024년 ${selectedItem} 가격`,
              data: prices2024,
              borderColor: 'rgba(192,75,75,1)',
              backgroundColor: 'rgba(192,75,75,0.2)',
              pointBackgroundColor: prices2024.map((_, index) =>
                index === highlightIndex3rdWeek ? 'yellow' :
                index === highlightIndex4thWeek ? 'green' : 
                'rgba(192,75,75,1)'
              ),
              pointRadius: prices2024.map((_, index) =>
                index === highlightIndex3rdWeek || index === highlightIndex4thWeek ? 6 : 3
              ),
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
    // 새로운 데이터가 설정될 때 이전에 생성된 툴팁을 제거
    const chartContainer = chartRef.current?.canvas?.parentNode;
    if (chartContainer) {
      const existingTooltips = chartContainer.querySelectorAll('.chart-tooltip');
      existingTooltips.forEach(tooltip => tooltip.remove());
    }

    if (chartData && chartRef.current) {
      const chart = chartRef.current;

      // 7월 3주와 7월 4주 데이터 인덱스 찾기
      const dataIndex3rdWeek = chartData.labels.indexOf('7월3주');
      const dataIndex4thWeek = chartData.labels.indexOf('7월4주');

      if (dataIndex3rdWeek !== -1 && dataIndex4thWeek !== -1 && chart.data.datasets[1]) {
        // 고정된 위치에 7월 3주 라벨을 표시
        const tooltipEl3rdWeek = document.createElement('div');
        tooltipEl3rdWeek.className = 'chart-tooltip';
        tooltipEl3rdWeek.style.position = 'absolute';
        tooltipEl3rdWeek.style.background = 'rgba(0, 0, 0, 0.8)';
        tooltipEl3rdWeek.style.color = '#fff';
        tooltipEl3rdWeek.style.padding = '10px';
        tooltipEl3rdWeek.style.borderRadius = '4px';
        tooltipEl3rdWeek.style.pointerEvents = 'none';
        tooltipEl3rdWeek.style.left = '50%';
        tooltipEl3rdWeek.style.transform = 'translateX(-100%)';
        tooltipEl3rdWeek.style.top = '-40px';
        tooltipEl3rdWeek.innerHTML = `<strong>이번주 가격: ${price}원</strong>`;
        

        chartContainer.appendChild(tooltipEl3rdWeek);

        // 고정된 위치에 7월 4주 라벨을 표시
        const tooltipEl4thWeek = document.createElement('div');
        tooltipEl4thWeek.className = 'chart-tooltip';
        tooltipEl4thWeek.style.position = 'absolute';
        tooltipEl4thWeek.style.background = 'rgba(0, 0, 0, 0.8)';
        tooltipEl4thWeek.style.color = '#fff';
        tooltipEl4thWeek.style.padding = '10px';
        tooltipEl4thWeek.style.borderRadius = '4px';
        tooltipEl4thWeek.style.pointerEvents = 'none';
        tooltipEl4thWeek.style.left = '50%';
        tooltipEl4thWeek.style.transform = 'translateX(0%)';
        tooltipEl4thWeek.style.top = '-40px';
        tooltipEl4thWeek.innerHTML = `<strong>다음주 가격(예상): ${nextWeekPrice}원</strong>`;
        
        // 추가: PriceInfo의 nextWeekPrice 데이터를 표시

        chartContainer.appendChild(tooltipEl4thWeek);
      }
    }
  }, [chartData, price, nextWeekPrice]);

  if (!selectedItem || !selectedWeight || !selectedDetail) {
    return <p>옵션을 선택해주세요</p>;
  }

  if (!chartData) return <p>차트를 로드 중입니다...</p>;

  return (
    <div style={{ width: '600px', margin: '0 auto', padding: '20px', position: 'relative' }}>
      <div style={{ height: '400px', position: 'relative' }}>
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
          }} 
          height={400} 
          width={600} 
        />
      </div>
    </div>
  );
};

export default ChartComponent;
